import { GLOBAL_GAME_OBJECT } from './core.js';
import { Input } from './event.js';

export class Utils {
    vector2d(x, y) {
        return [x, y];
    }
    appendToDom(child, HTMLSelector) {
        document.querySelector(HTMLSelector).append(child);
    }
    setDOMStyle(style, HTMLElement) {
        HTMLElement.style = style;
    }
    setMultipleDOMStyles(style, list) {
        for (let object of list) {
            object.style = style;
        }
    }
    simplePlayerController(object, speed) {
        if (Input.right) object.velocityVector[0] = speed;
        else if (Input.left) object.velocityVector[0] = -speed;
        else object.velocityVector[0] = 0;

        if (Input.up) object.velocityVector[1] = -speed;
        else if (Input.down) object.velocityVector[1] = speed;
        else object.velocityVector[1] = 0;
    }
    simplePlayerController2d(object, speed) {
        if (Input.right) object.velocityVector[0] = speed;
        else if (Input.left) object.velocityVector[0] = -speed;
        else object.velocityVector[0] = 0;

        if (Input.space && object.hasLanded) {
            object.hasLanded = false;
            object.velocityVector[1] = -10;
        }
    }
    loadNextLevel(levelData) {
        if (GLOBAL_GAME_OBJECT.scene.data.currentLevel !== levelData.length - 1) {
            GLOBAL_GAME_OBJECT.scene.entities = levelData[GLOBAL_GAME_OBJECT.scene.data.currentLevel + 1];
            GLOBAL_GAME_OBJECT.scene.data.currentLevel += 1;
            return true;
        }
        return false;
    }
    squish(object, targetWidth, speed) {
        if (object.size[0] > targetWidth) {
            object.size[0] -= speed;
            object.positionVector[0] += speed / 2;

            object.size[1] -= speed;
            object.positionVector[1] -= speed;
            return true;
        }
        return false;
    }
    stretch(object, targetWidth, speed) {
        if (object.size[0] < targetWidth) {
            object.size[0] += speed;
            object.positionVector[0] -= speed / 2;

            object.size[1] += speed;
            object.positionVector[1] -= speed;
            return false;
        }

        return true;
    }
    oscillate(input, min, max) {
        var range = max - min;
        return min + Math.abs(((input + range) % (range * 2)) - range);
    }
    belowMap(object, callback) {
        if (object.position[1] >= GLOBAL_GAME_OBJECT.layerCanvases[0].height) callback(object);
    }
    getEntityByTag(tag) {
        for (const object of GLOBAL_GAME_OBJECT.scene) {
            if (object.tag === tag) {
                return object;
            }
        }
        return null;
    }
}

let lastLoop = new Date();
export function fpsCounter() {
    if (!GLOBAL_GAME_OBJECT.data) return;

    let thisLoop = new Date();
    GLOBAL_GAME_OBJECT.data.fps = Math.floor(1000 / (thisLoop - lastLoop));
    lastLoop = thisLoop;
}