export {calcDamage, animateRepair, animateDamage, autoMode, dead, displayProfileInfo, updateRank, updateLevel};

const exp = document.querySelector('.profile__exp');
const btc = document.querySelector('.profile__btc');
const lvl = document.querySelector('.profile__lvl');
const plt = document.querySelector('.profile__plt');
const rnk = document.querySelector('.profile__rnk');
const dmg = document.querySelector('.profile__dmg');

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

function animateDamage(result, damageContainer, timerDamage) {
    clearTimeout(timerDamage);

    let damage = document.createElement('div');
    damage.className = 'ship__damage';

    if (result.damage === 0) {
        damage.textContent = 'MISS';
    } else {
        damage.textContent = addSpaces(String(result.damage));
    }

    damageContainer.append(damage);
}

let timerAuto;
function autoMode(e, user, autoButton, npcDamage) {
    autoButton.classList.toggle('auto__button-off');
    const enemy = Object.keys(npcDamage)[user.rank - 1];
    const enemyButton = document.querySelector(`[data-enemy=${enemy}]`);
    let event = new CustomEvent('click', {bubbles: true});
    if (autoButton.classList.contains('auto__button-off')) {
        clearInterval(timerAuto);
        return;
    }

    enemyButton.dispatchEvent(event);
    timerAuto = setInterval(() => {
        enemyButton.dispatchEvent(event);
    }, 200);
}

function dead(deathSound) {
    clearInterval(timerAuto);
    localStorage.clear();

    deathSound.play();
    alert('You dead');

    location.reload();
}

function displayProfileInfo(user, ranks) {
    let expStr = user.exp.toString();
    exp.textContent = addSpaces(expStr);

    let btcStr = user.btc.toString();
    btc.textContent = addSpaces(btcStr);

    let pltStr = user.plt.toString();
    plt.textContent = addSpaces(pltStr);

    lvl.textContent = user.lvl;

    let dmgStr = (user.damage / 10).toString();
    dmg.textContent = addSpaces(dmgStr);

    rnk.textContent = ranks.find( rank => rank[0] === user.rank )[2];
}

function updateRank(user, ranks, rank) {
    let currentRank = ranks.find( rank => rank[1] >= user.exp )[0] - 1;
    user.rank = currentRank;

    rank.className = `rank${currentRank}`;
}

function updateLevel(user, levels) {
    let levelBefore = user.lvl;
    let levelAfter = levels.find( lvl => lvl[1] >= user.exp )[0] - 1;

    if (levelAfter > levelBefore) {
        user.lvl = levelAfter;
        lvl.textContent = levelAfter;
    }
}