export {addSpaces, calcDamage, animateShip, animateRepair};

function addSpaces(str) {
    let arr = [];
    for (let i = str.length - 1; i >= 0; i--) {
        let idx = str.length - i;
        arr.push(str[i]);
        if (idx % 3 === 0) arr.push(' ');
    }
    return arr.reverse().join('');
}

function calcDamage(user, damage) {
    let result = {
        isDead: false,
    };

    const shieldAbsorption = 0.85;
    const damageRange = 0.2;

    const persentageDmg = user.damage / 1000;
    let decreaseOfDmg = 1 / 100 * persentageDmg * damage;
    let receivedDmg = Math.round(damage - decreaseOfDmg);

    if (Math.random() < 0.07) receivedDmg = 0;

    let deviation = Math.floor(Math.random() * damageRange * receivedDmg);
    if (Math.random() < 0.5) deviation = -deviation;
    receivedDmg += deviation;
    result.damage = receivedDmg;

    let damageBlocked = Math.min(receivedDmg * shieldAbsorption, user.sh);
    result.sh = Math.round(user.sh - damageBlocked);
    result.hp = Math.round(user.hp - (receivedDmg - damageBlocked));
    
    if (result.hp <= 0) result.isDead = true;
    return result;
}

function animateShip() {
    let deg = 0;
    let increase = true;
    let min = -10;
    let max = 10;
    let ship = document.querySelector('.ship__image');
    setInterval(() => {
        ship.style.transform = `rotate(${deg}deg)`;
        if (deg === min) increase = true;
        if (deg === max) increase = false;
        increase ? deg++ : deg--;
    }, 60);
}

function animateRepair(user, repairHp, damageContainer, timerDamage) {
    clearTimeout(timerDamage);
    let repairText = 0;

    if (user.hp < user.maxHp - repairHp) {
        repairText = repairHp;
    } else if (user.hp !== user.maxHp) {
        repairText = user.maxHp - user.hp;
    }

    if (repairText > 0) {
        let repairElem = document.createElement('div');
        repairElem.className = 'ship__damage ship__repair';
        let formatted = addSpaces(String(repairText));
        if (formatted.startsWith(' ')) {
            formatted = formatted.slice(1);
        }
        repairElem.textContent = '+' + formatted;
        damageContainer.append(repairElem);
    }
}