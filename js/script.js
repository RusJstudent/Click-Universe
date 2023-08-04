import newUser from './new user.js';
import {levels, ranks} from '../js/levels.js';
import {rewards, npcDamage, equip, shipHp, droneParams, promocodes} from './pve.js';
import {destroySound, deathSound, clickSound} from './sounds.js';
import {about, welcome, guide, news} from './info.js';
import {buyItem, upgradeShip, setUpgradeButton, buyDrone, setDroneButton} from './shop.js';
import {dead, calcDamage, animateRepair, animateDamage, autoMode, displayProfileInfo, updateRank, updateLevel} from './functions.js';
import {animateShip} from './animations.js';
import {openMenu, openMenuSection, addEquipItem, selectEquipItem, showEquipQuantity, promocodeHandler} from './menu.js';

window.onerror = () => {
    localStorage.clear();
    location.reload();
};

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

const rank = document.getElementById('ranks');
const nickname = document.querySelector('.ship__nickname');

const equipInfo = document.getElementById('info__equip');
const destroysStats = document.getElementById('info__destroys');
const aboutInfo = document.getElementById('info__about');
const howToPlay = document.getElementById('info__how');
const newsButton = document.getElementById('info__news');

const autoButton = document.querySelector('.auto__button');

const menu = document.querySelector('.menu');
const menuEquip = document.querySelector('.menu__equip');

const menuEquipGuns = document.querySelector('.equip__lg');
const menuEquipShields = document.querySelector('.equip__db');

const menuButton = document.querySelector('.wrapper__menu-button');
const menuNavigation = document.querySelector('.menu__nav-content');
const menuQuitButton = document.querySelector('.menu__nav-quit');

const promoButton = document.querySelector('.menu__promo-send');

// parameters from CSS:
const hpLineWidth = parseInt(getComputedStyle(hpLine).width);
const shLineWidth = parseInt(getComputedStyle(shLine).width);

// global event listeners
document.onkeydown = e => {
    if (e.code === 'KeyQ') autoMode(e, user, autoButton, npcDamage);
    if (e.code === 'KeyP') {
        if (document.activeElement.tagName === 'INPUT') return;
        openMenu(e, menu, user, menuEquipGuns, menuEquipShields);
    }
}

// registration
let user;
let registered = localStorage.getItem('reg');
registered ? getUserData() : createNewUser();
displayData();

function getUserData() {
    user = JSON.parse(localStorage.getItem('user'));
    if (user.version !== newUser.version) throw new Error('different version');
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
    displayProfileInfo(user, ranks);
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
autoButton.onclick = e => autoMode(e, user, autoButton, npcDamage);
menuButton.onclick = menuQuitButton.onclick = e => openMenu(e, menu, user, menuEquipGuns, menuEquipShields);
menuNavigation.onclick = e => openMenuSection(e, menu, menuNavigation);
promoButton.onclick = e => promocodeHandler(e, user, promocodes, displayProfileInfo, ranks, saveData);

menuEquip.addEventListener('click', e => {
    selectEquipItem(e, menuEquip, user, equip, updateHp, displayProfileInfo, ranks, saveData);
});

let timerDamage;
pve.addEventListener('click', function(e) {
    let npc = e.target.dataset.enemy;
    if (!npc) return;

    const result = calcDamage(user, npcDamage[npc]);

    animateDamage(result, damageContainer, timerDamage);
    timerDamage = setTimeout(() => damageContainer.innerHTML = '', 2200);

    if (result.damage !== 0) {
        clearTimeout(repairId);
        repairId = setTimeout(repair, repairTimeout);
    }

    if (result.isDead) {
        dead(deathSound);
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
    updateLevel(user, levels);
    updateRank(user, ranks, rank);
    displayProfileInfo(user, ranks);
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
    } else {
        const bought = buyItem(user, equip, button, clickSound);
        if (!bought) return;
        addEquipItem(itemName, itemType, menuEquipGuns, menuEquipShields);
    }

    if (itemType === 'db' || itemName === 'ship') {
        repairHp = repairPersentHp / 100 * user.maxHp;
        repairSh = repairPersentSh / 100 * user.maxSh;
        updateHp();
        if (user.sh === user.maxSh || user.hp === user.maxHp) repair();
    }

    showEquipQuantity(user);
    displayProfileInfo(user, ranks);
    saveData();
});

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

function saveData() {
    localStorage.setItem('user', JSON.stringify(user));
}

equipInfo.onclick = () => alert(JSON.stringify(user.equip, null, 2));
destroysStats.onclick = () => alert(JSON.stringify(user.destroys, null, 2));
aboutInfo.onclick = () => alert(about);
howToPlay.onclick = () => alert(guide);
newsButton.onclick = () => alert(news);