export function animations() {
    return {
        pulsing: function* (object, iterations, speed) {
            while (true) {
                for (let i = 0; i < iterations; i++) {
                    //callback(object);
                    object.size[0] += speed;
                    object.size[1] -= speed;
                    object.position[0] -= speed / 2;
                    object.position[1] += speed;
                    yield;
                }
                for (let i = 0; i < iterations; i++) {
                    object.size[0] -= speed;
                    object.size[1] += speed;
                    object.position[0] += speed / 2;
                    object.position[1] -= speed;
                    yield;
                }
            }
        },
        patrolling: function* (object, iterations, speed) {
            while (true) {
                for (let i = 0; i < iterations; i++) {
                    object.position[0] += speed;
                    yield;
                }
                for (let i = 0; i < iterations; i++) {
                    object.position[0] -= speed;
                    yield;
                }
            }
        }
    }
}