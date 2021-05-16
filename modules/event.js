class EventOBJ {
    down;
    up;
    right;
    left;
    space;
    r;

    constructor() {
        this.down = false;
        this.up = false;
        this.right = false;
        this.left = false;
        this.space = false;
        this.r = false;
    }


}

export const Input = new EventOBJ();

document.addEventListener('keydown', function (event) {
    if (event.code == 'ArrowLeft') {
        Input.left = true;
    }
    if (event.code == 'ArrowRight') {
        Input.right = true;
    }
    if (event.code == 'Space') {
        Input.space = true;
    }
    if (event.code == 'KeyR') {
        Input.r = true;
    }
    if (event.code == 'ArrowUp') {
        Input.up = true;
    }
    if (event.code == 'ArrowDown') {
        Input.down = true;
    }
});
document.addEventListener('keyup', function (event) {
    if (event.code == 'ArrowLeft') {
        Input.left = false;
    }
    if (event.code == 'ArrowRight') {
        Input.right = false;
    }
    if (event.code == 'Space') {
        Input.space = false;
    }
    if (event.code == 'ArrowUp') {
        Input.up = false;
    }
    if (event.code == 'ArrowDown') {
        Input.down = false;
    }
    if (event.code == 'KeyR') {
        Input.r = false;
    }
});