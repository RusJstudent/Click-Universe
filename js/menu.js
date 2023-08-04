export {openMenu, openMenuSection, addEquipItem, selectEquipItem, showEquipQuantity, promocodeHandler};

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

function addSpaces(str) {
    let arr = [];
    for (let i = str.length - 1; i >= 0; i--) {
        let idx = str.length - i;
        arr.push(str[i]);
        if (idx % 3 === 0) arr.push(' ');
    }
    return arr.reverse().join('');
}

const menuEquipSelected = document.querySelector('.equip__selected');
const menuEquipSell = document.querySelector('.equip__sell');

const gunsTitle = document.querySelector('.equip__lg-text');
const shieldsTitle = document.querySelector('.equip__db-text');

const promoInput = document.querySelector('.menu__promo-input');

let equipIsShowed = false;
function openMenu(e, menu, user, menuEquipGuns, menuEquipShields) {
    let displayStatus = getComputedStyle(menu).display;
    if (displayStatus === 'none') {
        menu.style.display = 'grid';
        showEquipItems(user, menuEquipGuns, menuEquipShields);
        showEquipQuantity(user);
    } else {
        menu.style.display = 'none';
    }
}

function openMenuSection(e, menu, menuNavigation) {
    let target = e.target.closest('.menu__nav-elem');
    if (!target || !menuNavigation.contains(target)) return;

    menuEquipSelected.textContent = '';
    menuEquipSell.style.display = 'none';

    menu.querySelectorAll('.menu__section').forEach(section => {
        section.style.display = 'none';
    });

    const className = target.classList[1].slice(10);
    const section = menu.querySelector(`.menu__${className}`);
    section.style.display = 'flex';
}

function showEquipItems(user, menuEquipGuns, menuEquipShields) {
    if (equipIsShowed) return;
    equipIsShowed = true;

    const guns = {};
    const shields = {};

    for (let item in user.equip) {
        if (item.startsWith('lg')) {
            guns[item] = user.equip[item];
        }
        if (item.startsWith('db')) {
            shields[item] = user.equip[item];
        }
    }

    for (let gun in guns) {
        if (guns[gun] === 0) continue;
        for (let i = 0; i < guns[gun]; i++) {
            const lg = document.createElement('img');
            lg.style.width = '45px';
            lg.style.height = '45px';
            lg.src = `images/equipment/${gun}.png`;
            menuEquipGuns.prepend(lg);
        }
    }

    for (let shield in shields) {
        if (shields[shield] === 0) continue;
        for (let i = 0; i < shields[shield]; i++) {
            const db = document.createElement('img');
            db.style.width = '45px';
            db.style.height = '45px';
            db.src = `images/equipment/${shield}.png`;
            menuEquipShields.prepend(db);
        }
    }
}

function addEquipItem(itemName, itemType, menuEquipGuns, menuEquipShields) {
    if (itemType === 'lg') {
        const lg = document.createElement('img');
        lg.style.width = '45px';
        lg.style.height = '45px';
        lg.src = `images/equipment/${itemName}.png`;
        menuEquipGuns.append(lg);


    } else if (itemType === 'db') {
        const db = document.createElement('img');
        db.style.width = '45px';
        db.style.height = '45px';
        db.src = `images/equipment/${itemName}.png`;
        menuEquipShields.append(db);
    }
}

function selectEquipItem(e, menuEquip, user, equip, updateHp, displayProfileInfo, ranks, saveData) {
    const target = e.target;
    if (target.tagName !== 'IMG') return;

    const src = target.getAttribute('src');
    if (!src.includes('lg') && !src.includes('db')) return;

    const idx = src.lastIndexOf('/');
    const itemName = src.substr(idx + 1, 3);

    menuEquipSelected.textContent = itemName;
    menuEquipSell.style.display = 'block';

    menuEquipSell.onclick = e => {
        sellEquipItem(e, menuEquip, user, equip, updateHp, displayProfileInfo, ranks, saveData, itemName);
        showEquipQuantity(user);
    }
}

function sellEquipItem(e, menuEquip, user, equip, updateHp, displayProfileInfo, ranks, saveData, itemName) {
    const itemType = itemName.slice(0, 2);

    if (user.equip[itemName] === 0) {
        alert(`You have no ${itemName}`);
        return;
    }

    if (itemType === 'lg') user.damage -= equip[itemName];
    if (itemType === 'db') user.maxSh -= equip[itemName];

    user.equip[itemName]--;

    if (itemType === 'db' && user.sh > user.maxSh) {
        user.sh = user.maxSh;
        updateHp();
    }

    displayProfileInfo(user, ranks);
    saveData();

    // удаляю нужную картинку
    let container = menuEquip.querySelector(`.equip__${itemType}`);
    let arr = Array.from(container.querySelectorAll('img'));
    arr.find( elem => elem.src.includes(itemName)).remove();
}

function showEquipQuantity(user) {
    const gunsNumber = calcEquipItems(user, 'lg');
    const shieldsNumber = calcEquipItems(user, 'db');
    const maxQuantity = user.equip.drones + 5;

    gunsTitle.textContent = gunsNumber + ' / ' +  maxQuantity;
    shieldsTitle.textContent = shieldsNumber + ' / ' +  maxQuantity;
}

function promocodeHandler(e, user, promocodes, displayProfileInfo, ranks, saveData) {
    let input = promoInput.value.toLowerCase();

    let entries = Object.entries(promocodes);
    entries.forEach((entry, idx) => {
        let current = entry[0];
        let arr = [];
        for (let i = 0; i < current.length; i++) {
            if (current[i] === 'q' || current[i] === '1') {
                arr.push('а');
            } else {
                arr.push(current[i]);
            }
        }
        const result = arr.join('');
        entries[idx][0] = result;
    });

    let promoC = {};
    entries.forEach(entry => {
            promoC[entry[0]] = entry[1];
    });

    if (!promoC[input]) {
        alert(`there is no "${input}" promocode`);
        return;
    }

    if (user.promo.includes(input)) {
        alert('Reward is already recieved');
        return;
    }

    let value = promoC[input][0];
    let currency = promoC[input][1];

    user.promo.push(input);
    user[currency] += value;

    displayProfileInfo(user, ranks);
    saveData();

    let str = value.toString();
    value = addSpaces(str).trim();

    alert(`You receive ${value} ${currency}!`);
}