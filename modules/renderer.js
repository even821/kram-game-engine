
import { GLOBAL_GAME_OBJECT } from './core.js';

export class Renderer {
    renderObject(object) {
        object.draw();
    }
    renderScene(scene) {
        let flattenedScene = scene.flat(10);
        for (let object of flattenedScene) {
            object.draw();
        }
    }
    clearCanvas(layer) {
        let width = GLOBAL_GAME_OBJECT.layerCanvases[layer].width;
        let height = GLOBAL_GAME_OBJECT.layerCanvases[layer].height;
        GLOBAL_GAME_OBJECT.layerContexts[layer].clearRect(0, 0, width, height);
    }
    addBorder(object){
        object.context.strokeStyle = 'red';
        object.context.strokeRect(object.positionVector[0], object.positionVector[1], object.size[0], object.size[0]);
    }
}