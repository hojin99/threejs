import * as THREE from 'three';

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
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        console.log(`[_setupCamera] width - ${width}`);
        console.log(`[_setupCamera] height - ${height}`);
        const camera = new THREE.PerspectiveCamera(
            75,
            width/height,
            0.1,
            100
        );
        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1; // 광원세기
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);

    }

    _setupModel() {
        const geometry = new THREE.BoxGeometry(1,1,1); //가로,세로,깊이
        const material = new THREE.MeshPhongMaterial({color: 0x44a88});

        const cube = new THREE.Mesh(geometry, material);

        this._scene.add(cube);
        this._cube = cube;
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix(); 

        this._renderer.setSize(width, height);
    }

    render(time) {
        // console.log(`[render] time - ${time}`);
        this._renderer.render(this._scene, this._camera);
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        // console.log(`[update] time - ${time}`);
        time *= 0.001;
        this._cube.rotation.x = time;
        this._cube.rotation.y = time;
    }

}

window.onload= function() {
    new App();
}