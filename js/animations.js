export {animateShip};

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