'use strict';

/* 
I published link for the game in my discord group.
Link-invitation: https://discord.gg/tshU2eTt or you can find link under any of my YT videos.

done today:
1. Setting nickname option
2. ranks (simple version)
3. Much better interface for phones
4. Better UI look.
5. Stats
6. more npcs and rewards

soon: 
1. shop
2. shields
3. sounds

probably (later):
1. more ships
2. better interface
*/

// localStorage.setItem('rank', 'A');

const welcome = 'Welcome to Click Universe game. Attack enemies to earn resourses. But be careful, if your HP goes to 0, your ship will be destroyed and you will lose all stuff. Good luck!';

const about = 'This game developed by EvilYou. Also is not the latest version. Many improvements are planned, such as shop, shields, sounds and more. Hope you will enjoy it!';

const hp = 276e3;
// ship
let hpLine = document.querySelector('.ship__hp-line');
let hpValue = document.getElementById('hp_value');

// pve
const pveEnems = document.querySelector('.pve__enemies');
const hydro = document.querySelector('.hydro');
const jenta = document.querySelector('.jenta');
const mali = document.querySelector('.mali');

// profile
const exp = document.getElementById('exp');
const btc = document.getElementById('btc');
const lvl = document.getElementById('lvl');
const plt = document.getElementById('plt');

const playerRank = document.getElementById('ranks');
const nickname = document.querySelector('.ship__nickname');
const destroysStats = document.getElementById('info__destroys');
const aboutInfo = document.getElementById('info__about');

// shop
// const lg1 = document.getElementById('lg1');
// const lg2 = document.getElementById('lg2');
// const lg3 = document.getElementById('lg3');

// registration
let formatter = new Intl.DateTimeFormat('ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
});
let now = formatter.format(new Date());
let registered = localStorage.getItem('reg');
if (!registered) {
    localStorage.setItem('reg', now);
}

// data
let destroys = {
    hydro: 0,
    jenta: 0,
    mali: 0,
    plarion: 0,
    motron: 0,
    xeon: 0,
    bangoliour: 0,
    zavientos: 0,
    magmius: 0,
    quattroid: 0,
};

const levels = [
    [1, 0],
    [2, 10000],
    [3, 20000],
    [4, 40000],
    [5, 80000],
    [6, 160000],
    [7, 320000],
    [8, 640000],
    [9, 1280000],
    [10, 2560000],
    [11, 5120000],
    [12, 10240000],
    [13, 20480000],
    [14, 40960000],
    [15, 81920000],
    [16, 163840000],
    [17, 327680000],
    [18, 655360000],
    [19, 1310720000],
    [20, 2621440000],
    [21, 5242880000],
    [22, 10485760000],
];

if (registered) {
    destroys = JSON.parse(localStorage.getItem('destroys'));
    playerRank.classList.remove(`rank1`);
    playerRank.classList.add(`rank${localStorage.getItem('rank')}`);
 } else {
    localStorage.setItem('destroys', JSON.stringify(destroys));
    alert(welcome);
    localStorage.setItem('nickname', prompt('Enter your nickname, please'));
}

const user = {
    exp: +localStorage.getItem('exp') || 0,
    btc: +localStorage.getItem('btc') || 0,
    lvl: +localStorage.getItem('lvl') || 1,
    plt: +localStorage.getItem('plt') || 0,
    rank: +localStorage.getItem('rank') || 1,
    nickname: localStorage.getItem('nickname') || 'Your nickname',
    hp: +localStorage.getItem('hp') || hp,
    registration: localStorage.getItem('reg'),
    stats: destroys,
};

nickname.textContent = user.nickname;

formatData();
increaseRank(user.lvl);

const npcDamage = {
    hydro: 60,
    jenta: 160,
    mali: 400,
    plarion: 1000,
    motron: 2000,
    xeon: 5000,
    bangoliour: 10000,
    zavientos: 25000,
    magmius: 70000,
    quattroid: 250000,
}

const rewards = {
    hydro: {
        exp: 1000,
        btc: 1000,
        plt: 1,
    },
    jenta: {
        exp: 1100,
        btc: 1500,
        plt: 2,
    },
    mali: {
        exp: 1200,
        btc: 2000,
        plt: 3,
    },
    plarion: {
        exp: 1300,
        btc: 3000,
        plt: 4,
    },
    motron: {
        exp: 1500,
        btc: 4000,
        plt: 5,
    },
    xeon: {
        exp: 1900,
        btc: 6000,
        plt: 8,
    },
    bangoliour: {
        exp: 2800,
        btc: 9000,
        plt: 14,
    },
    zavientos: {
        exp: 4000,
        btc: 15000,
        plt: 25,
    },
    magmius: {
        exp: 7000,
        btc: 25000,
        plt: 45,
    },
    quattroid: {
        exp: 15000,
        btc: 40000,
        plt: 100,
    }
};

// params
const repairPersent = 5;
const hpLineWidth = parseInt(getComputedStyle(hpLine).width);
const repairAmount = repairPersent / 100 * hp;

hpLine.style.width = user.hp / hp * hpLineWidth + 'px'; // restore HP amount
hpValue.textContent = user.hp;

const repairTimeout = 5000;
const repairFrequency = 2000;
let repairId = setTimeout(repair, repairFrequency);

// NPCS
pveEnems.addEventListener('click', function(e) {
    let npc = e.target.dataset.enemy;
    if (!npc) return;

    clearTimeout(repairId);
    repairId = setTimeout(repair, repairTimeout);

    let hpBefore = parseFloat(getComputedStyle(hpLine).width) / hpLineWidth * hp;
    let hpAfter = Math.round(hpBefore - npcDamage[npc]);

    let isDead = hpAfter <= 0;
    if (isDead) {
        dead();
        return;
    }

    destroys[npc]++;
    localStorage.setItem('destroys', JSON.stringify(destroys));
    // console.log(user);

    hpValue.textContent = user.hp = hpAfter;
    hpLine.style.width = hpAfter / hp * hpLineWidth + 'px';

    user.exp = +user.exp + rewards[npc].exp;
    user.btc = +user.btc + rewards[npc].btc;
    user.plt = +user.plt + rewards[npc].plt;

    formatData();
    updateData();
});

destroysStats.onclick = function(e) {
    alert(JSON.stringify(destroys, null, 2));
}

aboutInfo.onclick = function(e) {
    alert(about);
}

// SHOP
// const shopItems = document.querySelector('.shop__items');

// shopItems.addEventListener('click', function(e) {
//     let button = e.target;
//     let typeOfValue = button.dataset.btc ? 'btc' : 'plt';

//     let requiredAmount = button.dataset[typeOfValue];
//     let currentAmount = typeOfValue === 'btc' ? btc.textContent : plt.textContent;

//     if (currentAmount < requiredAmount) {
//         alert(`Not enough ${typeOfValue}`);
//         return true;
//     }
// });

function dead() {
    localStorage.clear();

    alert('You dead');

    location.reload();
}

function repair() {
    if (user.hp < hp - repairAmount) {
        let hpAfter = user.hp + repairAmount;
        hpLine.style.width = hpAfter / hp * hpLineWidth + 'px';
        hpValue.textContent = user.hp = hpAfter;

        localStorage.setItem('hp', user.hp);

        repairId = setTimeout(repair, repairFrequency);
    } else {
        hpLine.style.width = hpLineWidth + 'px';
        hpValue.textContent = user.hp = hp;
        localStorage.setItem('hp', user.hp);

        clearTimeout(repairId);
    }
}

function updateLevel() {
    let exp = user.exp;
    let levelBefore = user.lvl;
    let levelAfter = levels.find( lvl => lvl[1] >= exp )[0] - 1;

    if (levelAfter > levelBefore) {
        user.lvl = levelAfter;
        lvl.textContent = levelAfter;
        increaseRank(levelBefore);
    }
}

function increaseRank(lvlBefore) {
    if (user.lvl >= 10) {
        localStorage.setItem('rank', user.lvl);

        playerRank.classList.remove(`rank${lvlBefore}`);
        playerRank.classList.add(`rank10`);
        return;
    }

    let nextRank = user.lvl;
    localStorage.setItem('rank', user.lvl);

    playerRank.classList.remove(`rank${nextRank - 1}`);
    playerRank.classList.add(`rank${nextRank}`);
}

function updateData() {
    localStorage.setItem('exp', user.exp);
    localStorage.setItem('btc', user.btc);
    localStorage.setItem('lvl', user.lvl);
    localStorage.setItem('plt', user.plt);
    localStorage.setItem('hp', user.hp);
}

function formatData() {
    updateLevel();

    let expStr = user.exp.toString();
    let expArr = [];
    for (let i = expStr.length - 1; i >= 0; i--) {
        let idx = expStr.length - i;
        expArr.push(expStr[i]);
        if (idx % 3 === 0) expArr.push(' ');
    }
    exp.textContent = expArr.reverse().join('');

    let btcStr = user.btc.toString();
    let btcArr = [];
    for (let i = btcStr.length - 1; i >= 0; i--) {
        let idx = btcStr.length - i;
        btcArr.push(btcStr[i]);
        if (idx % 3 === 0) btcArr.push(' ');
    }
    btc.textContent = btcArr.reverse().join('');

    let pltStr = user.plt.toString();
    let pltArr = [];
    for (let i = pltStr.length - 1; i >= 0; i--) {
        let idx = pltStr.length - i;
        pltArr.push(pltStr[i]);
        if (idx % 3 === 0) pltArr.push(' ');
    }
    plt.textContent = pltArr.reverse().join('');

    lvl.textContent = user.lvl;
}
