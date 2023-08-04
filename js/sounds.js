export {destroySound, deathSound, clickSound, loginSound};

let destroySound = new Audio();
let deathSound = new Audio();
let clickSound = new Audio();
let loginSound = new Audio();

destroySound.src = 'audio/alien_1.wav';
deathSound.src = 'audio/death.mp3';
clickSound.src = 'audio/click.wav';
loginSound.src = 'audio/sys_ready.mp3';
// destroySound.src = 'audio/explosion.wav';
// destroySound.src = 'audio/laser.wav';