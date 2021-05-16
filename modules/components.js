import { GLOBAL_GAME_OBJECT } from "./core.js";
import { Input } from './event.js';

function renderC() {
    let context = GLOBAL_GAME_OBJECT.layerContexts[0];

    context.shadowColor = this.color ?? 'black';

    context[this.style + 'Style'] = this.color ?? 'black';
    context.beginPath();

    context.moveTo(this.position[0], this.position[1]);
    context.lineTo(this.position[0] + this.size[0], this.position[1]);
    context.lineTo(this.position[0] + this.size[0], this.position[1] + this.size[1]);
    context.lineTo(this.position[0], this.position[1] + this.size[1]);
    context.lineTo(this.position[0], this.position[1]);

    context[this.style]();

}

function controllerC() {
    if (!GLOBAL_GAME_OBJECT.data.isPlaying) return;
    if (!GLOBAL_GAME_OBJECT.isCutscene) {
        if (Input.right) this.velocity[0] = this.speed;
        else if (Input.left) this.velocity[0] = -this.speed;
        else this.velocity[0] = 0;

        if (Input.space && this.hasLanded) {
            this.velocity[1] = -12;
            this.hasLanded = false;
        }
        return;
    }

    if (Input.space) {
        GLOBAL_GAME_OBJECT.data.message = GLOBAL_GAME_OBJECT.cutscene.next().value;
        Input.space = false;
    }
}

function moveC() {
    if (!GLOBAL_GAME_OBJECT.data.isPlaying) return;
    this.position[0] += this.velocity?.[0];
    this.position[1] += this.velocity?.[1];
}

function physicsC() {
    if (!GLOBAL_GAME_OBJECT.data.isPlaying) return;
    this.velocity[1] <= this.max ? this.velocity[1] += this.mass * GLOBAL_GAME_OBJECT.gravity : null;
}
function collisionC() {
    if (!GLOBAL_GAME_OBJECT.data.isPlaying) return;
    GLOBAL_GAME_OBJECT.physics.checkCollision(this, 'ALL')
}

function setupC(array) {
    if (this.setup) return;

    for (let attribute of Object.keys(array)) {
        //console.log(attribute);
        this[attribute] = array[attribute];
    }
    this.setup = true;
}

function particleEmitterC({ bool }) {
    if (!GLOBAL_GAME_OBJECT.data.isPlaying) return;
    if (this[bool]) {
        if (this.limitTimer === this.limiter) {
            let entity = new GLOBAL_GAME_OBJECT.entity({
                components: [
                    ['setup', {
                        position: [this?.position[0] + (this?.particle?.offset[0] ?? 0), this.position[1] + (this?.particle?.offset[1] ?? 0)],
                        size: this.particle?.size ?? [4, 4],
                        style: this.particle?.style ?? 'stroke',
                        mass: this.particle?.mass ?? -0.05,
                        max: this.particle?.max ?? 15,
                        tag: this.particle?.tag ?? 'test',
                        velocity: [this.particle.velocityX[0] + Math.random() * this.particle.velocityX[1],
                        this.particle.velocityY[0] + Math.random() * this.particle.velocityY[1]],
                        life: this.particle.life ?? 20
                    }],
                    ['physics'],
                    ['move'],
                    ['render'],
                    ['lifetime']
                ]
            })

            GLOBAL_GAME_OBJECT.scene = [...GLOBAL_GAME_OBJECT.scene, entity];
            this.limitTimer = 0;
        }
        this.limitTimer++;
    }
}

function lifetimeC() {
    if (!GLOBAL_GAME_OBJECT.data.isPlaying) return;
    this.life -= 1;
}

export let components = {
    controller: controllerC,
    render: renderC,
    move: moveC,
    physics: physicsC,
    collision: collisionC,
    particleEmitter: particleEmitterC,
    setup: setupC,
    lifetime: lifetimeC
}