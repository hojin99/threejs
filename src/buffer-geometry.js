import * as THREE from 'three';
import { VertexNormalsHelper } from '../node_modules/three/examples/jsm/helpers/VertexNormalsHelper.js'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'

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
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        // 마우스 컨트롤을 가능하게 해줌
        new OrbitControls(this._camera, this._divContainer);
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
        const rawPositions = [
            -1,-1,0, //0
            1,-1,0, //1
            -1,1,0, //2
            1,1,0 //3
        ];
        const rawNormals = [
            0,0,1, // 수직
            0,0,1,
            0,0,1,
            0,0,1
        ];
        const rawColors = [
            1,0,0, //r,g,b
            0,1,0,
            0,0,1,
            1,1,0
        ];
        const rawUVs = [
            0,0, // 좌측하단
            1,0, // 우측하단
            0,1, // 좌측상단
            1,1 // 우측상단
        ]

        const positions = new Float32Array(rawPositions);
        const normals = new Float32Array(rawNormals);
        const colors = new Float32Array(rawColors);
        const uvs = new Float32Array(rawUVs);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));
        // geometry.setAttribute("normal", new THREE.BufferAttribute(normals,3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors,3));
        geometry.setAttribute("uv", new THREE.BufferAttribute(uvs,2));

        // Vertex Index로 삼각형을 지정, Vertex Index를 반시계 방향으로 지정
        geometry.setIndex([
            0,1,2,
            2,1,3
        ]);
        
        // 자동으로 normals를 계산
        geometry.computeVertexNormals();

        // const textureLoader = new THREE.TextureLoader();
        // const map = textureLoader.load('../node_modules/three/examples/textures/uv_grid_opengl.jpg');

        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff, 
            vertexColors: true,
            // map:map
        });
        const cube = new THREE.Mesh(geometry, material);

        this._scene.add(cube);
        this._cube = cube;

        // VertexNormalsHelper - vertex normal을 표시해 주는 helper
        const helper = new VertexNormalsHelper(cube, 0.1, 0xffff00);
        this._scene.add(helper);
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

        requestAnimationFrame(this.render.bind(this));
    }

}

window.onload= function() {
    new App();
}