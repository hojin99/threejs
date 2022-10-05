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
        camera.position.z = 30;
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

        const radius =1;
        const widthSegments = 12;
        const heightSegments =12;
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

        const sunMaterial = new THREE.MeshPhongMaterial({
            emissive: 0xffff00, flatShading:true
        });

        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        // sunMesh.scale.set(3,3,3);
  
        this._scene.add(sunMesh);
        this._sunMesh = sunMesh;

     }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix(); 

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {

        console.log(time);

        time *= 0.001;

        // 각도에 대해서 cos은 x축 거리, sin은 y축 거리를 나타냄, 증가하는 시간값은 각도가 0~360도(라디안)를 반복하는 것과 동일함 (361도는 1도)
        // 아래는 큰원을 그리면서 중간원, 작은원을 함께 그리는 방식을 통해서 공이 다이나믹하게 튀는 애니메이션 효과를 줌 
        // 큰원
        this._sunMesh.position.set(10*Math.cos(time), 10*Math.sin(time), this._sunMesh.position.z );
        // 큰원 내 중간원
        this._sunMesh.position.set(this._sunMesh.position.x + 5*Math.cos(time*3), this._sunMesh.position.y + 5*Math.sin(time*3), this._sunMesh.position.z );
        // 중간원 내 작은원
        this._sunMesh.position.set(this._sunMesh.position.x + 2*Math.cos(time*15), this._sunMesh.position.y + 2*Math.sin(time*15), this._sunMesh.position.z )

    }
}

window.onload= function() {
    new App();
}