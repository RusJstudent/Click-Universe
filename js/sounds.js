export {destroySound, deathSound, clickSound, empSound, wshieldSound};

const destroySound = new Audio();
const deathSound = new Audio();
const clickSound = new Audio();
const empSound = new Audio();
const wshieldSound = new Audio();

destroySound.src = 'audio/alien_1.wav';
deathSound.src = 'audio/death.mp3';
clickSound.src = 'audio/click.wav';
empSound.src = 'audio/emp.mp3';
wshieldSound.src = 'audio/wshield.mp3';