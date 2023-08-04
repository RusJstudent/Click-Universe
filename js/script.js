import newUser from './new user.js';
import {levels, ranks} from '../js/levels.js';
import {rewards, npcDamage, equip, shipHp, droneParams} from './pve.js';
import {destroySound, deathSound, clickSound} from './sounds.js';
import {about, welcome, guide} from './info.js';
import {buyItem, sellItem, upgradeShip, setUpgradeButton, buyDrone, setDroneButton} from './shop.js';
import {addSpaces, calcDamage, animateShip, animateRepair} from './functions.js';

// global event listeners
window.onerror = () => {
    localStorage.clear();
    location.reload();
};
document.body.onpointerdown = e => false;

// animation
animateShip();

// initialization
const pve = document.querySelector('.pve__enemies');
const shopItems = document.querySelector('.shop__items');
const upgradeButton = document.querySelector("[data-name='ship']");
const buyDroneButton = document.querySelector("[data-name='drone']");

const hpLine = document.querySelector('.ship__hp-line');
const hpValue = document.getElementById('hp_value');
const hpMax = document.getElementById('hp_max');
const shLine = document.querySelector('.ship__sh-line');
const shValue = document.getElementById('sh_value');
const shMax = document.getElementById('sh_max');
const damageContainer = document.querySelector('.ship__damage-container');

const exp = document.querySelector('.profile__exp');
const btc = document.querySelector('.profile__btc');
const lvl = document.querySelector('.profile__lvl');
const plt = document.querySelector('.profile__plt');
const rnk = document.querySelector('.profile__rnk');
const dmg = document.querySelector('.profile__dmg');

const rank = document.getElementById('ranks');
const nickname = document.querySelector('.ship__nickname');

const equipInfo = document.getElementById('info__equipment');
const destroysStats = document.getElementById('info__destroys');
const aboutInfo = document.getElementById('info__about');
const howToPlay = document.getElementById('info__how');

const autoButton = document.querySelector('.auto__button');

// parameters from CSS:
const hpLineWidth = parseInt(getComputedStyle(hpLine).width);
const shLineWidth = parseInt(getComputedStyle(shLine).width);

// registration
let user;
let registered = localStorage.getItem('reg');
registered ? getUserData() : createNewUser();
displayData();

function getUserData() {
    user = JSON.parse(localStorage.getItem('user'));
}

function createNewUser() {
    user = newUser;

    alert(welcome);
    user.nickname = prompt('Enter your nickname, please', '') || 'Your nickname';

    localStorage.setItem('reg', true);
    localStorage.setItem('user', JSON.stringify(user));
}

function displayData() {
    nickname.textContent = user.nickname;
    rank.className = `rank${user.rank}`;

    setDroneButton(user, droneParams, buyDroneButton);
    setUpgradeButton(user, shipHp, upgradeButton);
    displayProfileInfo();
    updateHp();
}

// repair parameters
const repairPersentHp = 5;
const repairPersentSh = 18;
let repairHp = repairPersentHp / 100 * user.maxHp;
let repairSh = repairPersentSh / 100 * user.maxSh;

const repairTimeout = 3000;
const repairFrequency = 1200;

let repairId = setTimeout(repair, repairFrequency);

// event listeners
let timerAuto;
autoButton.onclick = e => {
    e.currentTarget.classList.toggle('auto__button-off');
    const enemy = Object.keys(npcDamage)[user.rank - 1];
    const enemyButton = document.querySelector(`[data-enemy=${enemy}]`);
    let event = new CustomEvent('click', {bubbles: true});
    if (e.currentTarget.classList.contains('auto__button-off')) {
        clearInterval(timerAuto);
        return;
    }

    enemyButton.dispatchEvent(event);
    timerAuto = setInterval(() => {
        enemyButton.dispatchEvent(event);
    }, 200);
}

let timerDamage;
pve.addEventListener('click', function(e) {
    let npc = e.target.dataset.enemy;
    if (!npc) return;

    const result = calcDamage(user, npcDamage[npc]);

    clearTimeout(timerDamage);
    let damage = document.createElement('div');
    damage.className = 'ship__damage';

    if (result.damage === 0) {
        damage.textContent = 'MISS';
    } else {
        clearTimeout(repairId);
        repairId = setTimeout(repair, repairTimeout);

        damage.textContent = addSpaces(String(result.damage));
    }

    damageContainer.append(damage);
    timerDamage = setTimeout(() => damageContainer.innerHTML = '', 2200);

    if (result.isDead) {
        dead();
        return;
    }

    destroySound.currentTime = 0;
    destroySound.play();

    user.destroys[npc]++;

    user.exp = +user.exp + rewards[npc].exp;
    user.btc = +user.btc + rewards[npc].btc;
    user.plt = +user.plt + rewards[npc].plt;
    user.hp = result.hp;
    user.sh = result.sh;

    updateHp();
    updateLevel();
    updateRank();
    displayProfileInfo();
    saveData();
});

pve.onkeydown = e => !e.repeat;

shopItems.addEventListener('click', function(e) {
    const button = e.target.closest('button');
    if (!button || !shopItems.contains(button)) return;

    const itemName = button.dataset.name;
    const itemType = itemName.slice(0, 2);

    if (itemName === 'drone') {
        const droneBought = buyDrone(user, droneParams, button, clickSound);
        if (!droneBought) return;
    } else if (itemName === 'ship') {
        const upgrade = upgradeShip(user, shipHp, button, clickSound)
        if (!upgrade) return;
    } else if (button.classList.contains('shop__sell')) {
        const sold = sellItem(user, equip, button, clickSound);
        if (!sold) return;
    } else {
        const bought = buyItem(user, equip, button, clickSound);
        if (!bought) return;
    }

    if (itemType === 'db' || itemName === 'ship') {
        repairHp = repairPersentHp / 100 * user.maxHp;
        repairSh = repairPersentSh / 100 * user.maxSh;
        repair();
    }

    displayProfileInfo();
    saveData();
});

equipInfo.onclick = () => alert(JSON.stringify(user.equip, null, 2));
destroysStats.onclick = () => alert(JSON.stringify(user.destroys, null, 2));
aboutInfo.onclick = () => alert(about);
howToPlay.onclick = () => alert(guide);

function dead() {
    clearInterval(timerAuto);
    localStorage.clear();

    deathSound.play();
    alert('You dead');

    location.reload();
}

function repair() {
    clearTimeout(repairId);

    animateRepair(user, repairHp, damageContainer, timerDamage);

    if (user.hp < user.maxHp - repairHp) {
        user.hp += repairHp;
    } else {
        user.hp = user.maxHp;
    }

    if (user.sh < user.maxSh - repairSh) {
        user.sh += repairSh;
    } else {
        user.sh = user.maxSh;
    }

    if (user.hp !== user.maxHp || user.sh !== user.maxSh) {
        repairId = setTimeout(repair, repairFrequency);
    }

    updateHp();
    saveData();
}

function updateHp() {
    hpMax.textContent = user.maxHp;
    hpValue.textContent = user.hp;
    hpLine.style.width = user.hp / user.maxHp * hpLineWidth + 'px';

    shMax.textContent = user.maxSh;
    shValue.textContent = user.sh;
    shLine.style.width = user.sh / user.maxSh * shLineWidth + 'px';
}

function updateLevel() {
    let levelBefore = user.lvl;
    let levelAfter = levels.find( lvl => lvl[1] >= user.exp )[0] - 1;

    if (levelAfter > levelBefore) {
        user.lvl = levelAfter;
        lvl.textContent = levelAfter;
    }
}

function updateRank() {
    let currentRank = ranks.find( rank => rank[1] >= user.exp )[0] - 1;
    user.rank = currentRank;

    rank.className = `rank${currentRank}`;
}

function saveData() {
    localStorage.setItem('user', JSON.stringify(user));
}

function displayProfileInfo() {
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