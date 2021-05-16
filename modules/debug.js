'use strict';
export class Debug {
    isEnabled;
    constructor(debugWindow, isDebug) {
        this.isEnabled = isDebug;
        this.debugWindow = debugWindow;
    }
    log(message) {
        if (!this.isEnabled) return;
        this.debugWindow.innerHTML += message + '<br/>';
    }
    clear() {
        if (!this.isEnabled) return;
        this.debugWindow.innerHTML = '';
    }
}