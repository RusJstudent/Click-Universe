export {buyItem, sellItem, upgradeShip, setUpgradeButton, buyDrone, setDroneButton};

function calcEquipItems(user, type) {
    const equip = user.equip;
    const sameType = [];

    for (let item in equip) {
        if (item.startsWith(type)) {
            sameType.push(equip[item]);
        }
    }
    
    return sameType.reduce( (acc, cur) => acc + cur, 0);
}

function buyItem(user, equip, button, sound) {
    const itemName = button.dataset.name;
    const itemType = itemName.slice(0, 2);

    const typeQuantity = calcEquipItems(user, itemType);
    const currency = button.dataset.btc ? 'btc' : 'plt';
    const requiredAmount = button.dataset[currency];
    const currentAmount = currency === 'btc' ? user.btc : user.plt;

    if (typeQuantity >= 5 + user.equip.drones) {
        alert(`${itemType.startsWith('lg') ? 'Guns' : 'Shields'} limit reached`);
        return;
    }

    if (currentAmount < requiredAmount) {
        alert(`Not enough ${currency}`);
        return;
    }

    sound.currentTime = 0;
    sound.play();

    user[currency] -= requiredAmount;

    if (itemType === 'lg') user.damage += equip[itemName];
    if (itemType === 'db') user.maxSh += equip[itemName];

    user.equip[itemName]++;

    return true;
}

function sellItem(user, equip, button, sound) {
    const itemName = button.dataset.name;
    const itemType = itemName.slice(0, 2);

    if (user.equip[itemName] === 0) {
        alert(`You have no ${itemName}`);
        return;
    }

    sound.currentTime = 0;
    sound.play();

    if (itemType === 'lg') user.damage -= equip[itemName];
    if (itemType === 'db') user.maxSh -= equip[itemName];

    user.equip[itemName]--;

    return true;
}

function upgradeShip(user, shipHp, button, sound) {
    const ships = Object.entries(shipHp);
    const ship = ships.find( ship => ship[0] == user.maxHp );
    const idx = ships.findIndex( ship => ship[0] == user.maxHp );

    const requiredAmount = ship[1][0];
    const currency = ship[1][1];

    if (user[currency] < requiredAmount) {
        alert(`Not enough ${currency}`);
        return;
    }

    sound.currentTime = 0;
    sound.play();

    user[currency] -= requiredAmount;
    user.maxHp = +ships[idx + 1][0];

    setUpgradeButton(user, shipHp, button);

    return true;
}

function setUpgradeButton(user, shipHp, button) {
    const ships = Object.entries(shipHp);
    const idx = ships.findIndex( ship => ship[0] == user.maxHp );
    const nextShip = ships[idx][1];

    let nextValue = nextShip[0];
    const currency = nextShip[1];

    let suffix = 'k';
    if (nextValue >= 1e6) {
        suffix = 'm';
        nextValue /= 1000;
    }

    button.textContent = nextValue / 1000 + suffix + " " + currency;
    if (nextValue === Infinity) button.hidden = true;
}

function buyDrone(user, droneParams, button, sound) {
    const dronesNum = user.equip.drones;
    const currentDrone = droneParams[dronesNum];

    const currency = currentDrone[1];
    const requiredAmount = currentDrone[0];

    if (user[currency] < requiredAmount) {
        alert(`Not enough ${currency}`);
        return;
    }

    sound.currentTime = 0;
    sound.play();

    user[currency] -= requiredAmount;
    user.equip.drones++;

    setDroneButton(user, droneParams, button);

    return true;
}

function setDroneButton(user, droneParams, button) {
    const dronesNum = user.equip.drones;
    const nextDrone = droneParams[dronesNum];
    const currency = nextDrone[1];

    let nextValue = nextDrone[0];

    let suffix = 'k';
    if (nextValue >= 1e6) {
        suffix = 'm';
        nextValue /= 1000;
    }

    button.textContent = nextValue / 1000 + suffix + " " + currency;
    if (nextDrone[0] === Infinity) button.hidden = true;
}