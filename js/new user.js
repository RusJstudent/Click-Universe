export {newUser as default};

const maxHp = 1e3;
const maxSh = 1e3;

const formatter = new Intl.DateTimeFormat('ru', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', });
const now = formatter.format(new Date());

const zeroDestroys = {
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

const newUser = {
    exp: 0,
    btc: 100e3,
    lvl: 1,
    plt: 10e3,
    rank: 1,
    nickname: '',
    hp: maxHp,
    maxHp: maxHp,
    sh: maxSh,
    maxSh: maxSh,
    damage: 0,
    equip: {
        lg1: 0,
        lg2: 0,
        lg3: 0,
        db1: 0,
        db2: 0,
        db3: 0,
        drones: 0,
    },
    upgrades: {
        db1: 0,
        db2: 0,
        db3: 0,
    },
    extensions: {
        fastrep: 0,
        emp: 0,
        wshield: 0,
    },
    nameChanged: 'no',
    registration: now,
    destroys: zeroDestroys,
    promo: [],
    version: 11,
};