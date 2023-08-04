export {addSpaces, calcDamage};

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

    const shieldAbsorption = 0.9;
    const damageRange = 0.3;

    let receivedDmg = damage - user.damage;
    let minDamage = Math.round(damage / 25);
    if (receivedDmg < minDamage) receivedDmg = minDamage;

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