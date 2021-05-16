import { GLOBAL_GAME_OBJECT } from './core.js';
import { components } from './components.js';

export class Entity {
    components;
    ID;
    collisionValues

    constructor({ components }) {
        this.components = components;
        this.ID = GLOBAL_GAME_OBJECT.idGenerator.next().value;
        this.collisionValues = [];
    }
    runComponents() {
        if (!GLOBAL_GAME_OBJECT.ready) GLOBAL_GAME_OBJECT.ready = true;
        for (let component of this.components) {
            components[component[0]].apply(this, [component[1]]);

            if (!GLOBAL_GAME_OBJECT.isSetupDone) break;
        }
    }

    static build(x, y, w, h, ...rest) {
        return {
            wall: new this({
                components: [
                    ['setup', {
                        position: [x, y],
                        size: [w, h],
                        solid: true,
                        style: 'fill',
                        tag: 'wall',
                        color: rest[0] ?? 'black'
                    }],
                    ['render']
                ]
            }),
            player: new this({
                components: [
                    ['setup', {
                        position: [x, y],
                        size: [w, h],
                        health: 100,
                        tag: 'player',
                        style: 'stroke',
                        mass: 0.3,
                        max: 10,
                        velocity: [0, 0],
                        speed: 5,
                        hasLanded: false,
                    }],
                    ['controller'],
                    ['physics'],
                    ['move'],
                    ['collision'],
                    ['render']
                ]
            }),
            emitter: new this({
                components: [
                    ['setup', {
                        position: [x, y],
                        particle: {
                            offset: [0, 0],
                            size: [10, 10],
                            style: 'stroke',
                            life: 300,
                            velocityX: [-0.2, 0.4],
                            velocityY: [0, -0],
                            mass: -0.001,
                            max: 0.1,
                        },
                        tag: 'emitter',
                        emit: true,
                        limiter: 5,
                        limitTimer: 0
                    }],
                    ['particleEmitter', { bool: 'emit' }]
                ]
            }),
            loader: new this({
                components: [
                    ['setup', {
                        position: [x, y],
                        size: [w, h],
                        color: rest[0] ?? 'purple',
                        tag: 'loader',
                        level: rest[1],
                        solid: false,
                        style: 'fill'
                    }],
                    ['render']
                ]
            }),
            generic: new this({
                components: [
                    ['setup', {
                        position: [x, y],
                        size: [w, h],
                        solid: true,
                        style: 'fill',
                        tag: rest[0] ?? 'generic',
                        color: rest[1] ?? 'black'
                    }],
                    ['render']
                ]
            })
        }
    }
}