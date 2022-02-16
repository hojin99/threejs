import * as THREE from '../node_modules/three/build/three.module.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const rederer = new THREE.WebGLRenderer({ antialias: true});
        rederer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(rederer.domElement);
        this._renderer = rederer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupCamera() {

    }

    _setupLight() {

    }

    _setupModel() {

    }

    render() {

    }

    resize() {

    }
}

window.onload= function() {
    new App();
}