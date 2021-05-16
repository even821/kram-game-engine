import { GLOBAL_GAME_OBJECT } from "./core.js";

function baseCollision(objectOne, objectTwo) {
    if (!objectTwo.size) return false;
    if (objectOne.position[0] + objectOne.size[0] >= objectTwo.position[0] &&
        objectOne.position[1] + objectOne.size[1] >= objectTwo.position[1] &&
        objectOne.position[0] <= objectTwo.position[0] + objectTwo.size[0] &&
        objectOne.position[1] <= objectTwo.position[1] + objectTwo.size[1]) {
        return true;
    }
    return false;
}

export class Physics {
    collision(objectOne, objectTwo) {
        if (!baseCollision(objectOne, objectTwo)) return;
        if (!objectTwo.solid) return true;

        if (objectOne.position[1] - objectOne.velocity[1] <= objectTwo.position[1] + objectTwo.size[1] - 1 &&
            objectOne.position[1] + objectOne.size[1] - objectOne.velocity[1] >= objectTwo.position[1]) {
            if (objectOne.position[0] <= objectTwo.position[0] + objectTwo.size[0] / 2) {
                objectOne.position[0] = objectTwo.position[0] - objectOne.size[0] - 0.01;
            }
            if (objectOne.position[0] >= objectTwo.position[0] + objectTwo.size[0] / 2) {
                objectOne.position[0] = objectTwo.position[0] + objectTwo.size[0] + 0.01;
            }
            return true;
        }
        else {
            if (objectOne.position[1] <= objectTwo.position[1] + objectTwo.size[1] / 2) {
                objectOne.position[1] = objectTwo.position[1] - objectOne.size[1] - 0.01;
                objectOne.hasLanded = true;
                objectOne.velocity[1] = 0;
            }
            if (objectOne.position[1] >= objectTwo.position[1] + objectTwo.size[1] / 2) {
                objectOne.position[1] = objectTwo.position[1] + objectTwo.size[1] + 0.01;
            }
            return true;
        }
    }
    checkCollision(object) {
        let flattenedArray = GLOBAL_GAME_OBJECT.scene;
        let counter = 0;

        for (let entity of flattenedArray) {
            if (object != entity) {
                if (this.collision(object, entity)) {
                    GLOBAL_GAME_OBJECT?.collisions?.[entity.tag]?.apply(entity, [object]);
                    counter++;
                }
            }
        }

        if (counter === 0) object.noCollision = true;
        else object.noCollision = false;
    }
}