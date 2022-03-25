import * as THREE from 'three';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true});
        // HD-DPI(고해상도) 디스플레이 처리 - 한픽셀을 선명하게 하기 위해 다수의 작은 픽셀을 넣는 것
        renderer.setPixelRatio(window.devicePixelRatio);

        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );
        this._scene = scene;

        this._meshs = [];
        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();   
        this._setupGrid();   
        // this._loadObj();  

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _loadObj() {

        let object;
        let that = this;

        function onProgress( xhr ) {

            if ( xhr.lengthComputable ) {

                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

            }
        }

        function onError() {}

        function loadModel() {
            object.scale.set(0.0005,0.0005,0.0004)
            that._scene.add( object );
        }

        const manager = new THREE.LoadingManager( loadModel );

        const loader = new OBJLoader( manager );
        loader.load( 'model/anntena.obj', function ( obj ) {
            object = obj;
        }, onProgress, onError );

    }

    _setupGrid() {
        const helper = new THREE.GridHelper( 100, 100 );
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        this._scene.add( helper );
    }

    _setupControls() {
        // 마우스 컨트롤을 가능하게 해줌
        const control = new OrbitControls(this._camera, this._divContainer);
        control.maxPolarAngle = Math.PI / 2;
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
        light.position.set(-4, 4, 10);
        this._scene.add(light);
    }

    _setupModel() {

        const material = new THREE.MeshPhongMaterial({color: 0x515151});
        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const geometry = new THREE.PlaneGeometry(1,1,100,100); 

        // 초기 배치가 Z가 위가 아니라 앞 쪽이어서 위가 되도록 돌려줌
        geometry.rotateX( - Math.PI / 2 );

        // vertex를 배열로 
        const points = geometry.attributes.position.array;
        console.log(points.length);

        for ( let i = 0, l = points.length; i < l; i ++) {

            // vertex 중 높이만 랜덤으로 높여줌
            if(i%3===1)
                points[ i ] = Math.random() * 0.1;
        }

        this._addMesh(geometry, material, lineMaterial, 0,0,0);

    }

    _addMesh(geometry, material, lineMaterial, x, y, z) {

        const mesh = new THREE.Mesh(geometry, material);

        const group = new THREE.Group();
        group.add(mesh);
        if(lineMaterial) {
            const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial);
            group.add(line);
        }
        group.position.set(x,y,z);

        this._meshs.push(group);
        this._scene.add(group);
    }

    render(time) {
        // console.log(`[render]`);
        this._renderer.render(this._scene, this._camera);

        // this.update(time);

        // 브라우저에 애니메이션 프레임을 요청 - reder함수 호출 실행 후 페이지에 변화가 있다면 페이지를 다시 렌더링함
        // render 함수에 ms 단위의 로드된 이후 시간값을 넘겨줌
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        time *= 0.001;

        this._meshs.forEach((item) => {
            item.rotation.x = time;
            item.rotation.y = time;
        })
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        // 종횡비를 동적으로 맞춰줌
        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix(); 

        this._renderer.setSize(width, height);
    }
}

window.onload= function() {
    new App();
}