import { Entity } from './entities.js';
import { Utils, fpsCounter } from './utils.js';
import { Renderer } from './renderer.js';
import { Physics } from './physics.js';
import { Input } from './event.js';
import { animations } from './animations.js';

export let GLOBAL_GAME_OBJECT;

function createCanvas(size) {
    let canvas = document.createElement('canvas');
    canvas.width = size?.[0] ?? 1280;
    canvas.height = size?.[1] ?? 720;
    canvas.style = `position: absolute; top: 50px; left: 0px; width: 1280px; margin: 0.5%; height: 720px`;

    let context = canvas.getContext('2d');
    return {
        canvas: canvas,
        context: context
    };
}

function LoopAnimations() {
    if (!GLOBAL_GAME_OBJECT.scene) return;
    for (let entity of GLOBAL_GAME_OBJECT.scene) {
        entity.animation?.next();
    }
}

function loop() {

    let length = GLOBAL_GAME_OBJECT?.scene?.length;

    for (let i = 0; i < length; i++) {
        if (GLOBAL_GAME_OBJECT.scene[i].life <= 0) {
            GLOBAL_GAME_OBJECT.scene.splice(i, 1);
        }
    }

    fpsCounter();
    LoopAnimations();

    GLOBAL_GAME_OBJECT.renderer.clearCanvas(0);
    if (GLOBAL_GAME_OBJECT.scene) {
        GLOBAL_GAME_OBJECT.runScene();

        if (!GLOBAL_GAME_OBJECT.isSetupDone) {
            console.log('setting up...');

            for (let entity of GLOBAL_GAME_OBJECT.scene) {
                if (entity.tag)
                    GLOBAL_GAME_OBJECT.setup[entity.tag]?.apply(entity);
            }

            GLOBAL_GAME_OBJECT.isSetupDone = true;
        }
    }

    requestAnimationFrame(loop);
}

function* idMaker() {
    var index = 0;
    while (true)
        yield index++;
}

export class KramEngine {
    gameState;
    layerContexts;
    layerCanvases;
    scenes;
    scene;
    Utils;
    logic;
    entities;
    Renderer;
    isCutscene;
    cutscene;
    isSetupDone;
    animations;

    constructor({ size }) {
        this.gameState = 0;
        this.scenes = [];
        this.isSetupDone = false;

        this.isCutscene = false;

        let { canvas: layerOne, context: layerOneContext } = createCanvas(size);
        let { canvas: layerTwo, context: layerTwoContext } = createCanvas(size);
        let { canvas: entityLayer, context: entityLayerContext } = createCanvas(size);

        this.layerContexts = [entityLayerContext, layerOneContext, layerTwoContext];
        this.layerCanvases = [entityLayer, layerOne, layerTwo];

        this.entity = Entity;
        this.utils = new Utils();
        this.renderer = new Renderer();
        this.physics = new Physics();
        this.input = Input;
        this.animations = animations();

        this.utils.appendToDom(layerOne, '.main');
        this.utils.appendToDom(entityLayer, '.main');
        this.utils.appendToDom(layerTwo, '.main');

        this.gravity = 2;

        GLOBAL_GAME_OBJECT = this;
        loop();
    }
    idGenerator = idMaker();
    runScene() {
        for (let entity of this.scene) {
            entity.runComponents();
            if (entity.tag)
                this.logic[entity.tag]?.apply(entity);
        }
    }
    runUI(object) {
        this.data = Vue.createApp({
            data() {
                return object
            }
        }).mount('.container');
    }
    eventSystemGenerator = function* (events) {
        for (let event of events) {
            if (event.type === 'message') {
                yield event.message;
            }
            else if (event.type === 'conditional' && event[event.condition]) {
                yield event[event.condition];
            }
            else if (event.type === 'script') {
                event.script();
            }
            else if (event.type === 'new') {
                if (event.condition) {
                    yield* eventSystemGenerator(event.events);
                }
            }
        }
        return;
    }
}