export {destroySound, deathSound, clickSound};

const destroySound = new Audio();
const deathSound = new Audio();
const clickSound = new Audio();

destroySound.src = 'audio/alien_1.wav';
deathSound.src = 'audio/death.mp3';
clickSound.src = 'audio/click.wav';

// loginSound.src = 'audio/sys_ready.mp3';
// destroySound.src = 'audio/explosion.wav';
// fightSound.src = 'audio/laser.wav';