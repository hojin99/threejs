import * as THREE from 'three';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from '../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../node_modules/three/examples/jsm/geometries/TextGeometry.js';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const rederer = new THREE.WebGLRenderer({ antialias: true});
        // HD-DPI(고해상도) 디스플레이 처리 - 한픽셀을 선명하게 하기 위해 다수의 작은 픽셀을 넣는 것
        rederer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(rederer.domElement);
        this._renderer = rederer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._meshs = [];
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
        camera.position.z = 5;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1; // 광원세기
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-4, 4, 4);
        this._scene.add(light);
    }

    _setupModel() {
        const material = new THREE.MeshPhongMaterial({color: 0x515151});
        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});

        let geometry = new THREE.BoxGeometry(0.7,0.7,0.7,3,3,3); // x, y, z, (segments) x, y, z 
        this._addMesh(geometry, material, lineMaterial, -4,2,0);
    
        // 반지름, 분할 수, 시작 각도(radian), 연장 각도(radian) / 0도에서 시작해서 반시계 방향, PI = 90도
        geometry = new THREE.CircleGeometry(0.6, 12, 0, 2*Math.PI); 
        this._addMesh(geometry, material, lineMaterial, -2,2,0);
        
        // 밑면 반지름, 원뿔 높이, 원 분할 수, 높이 분할수, 원뿔 밑면 Open여부, 시작 각, 연장 각
        geometry = new THREE.ConeGeometry(0.6, 1, 8, 2, false, 0, 2*Math.PI); 
        this._addMesh(geometry, material, lineMaterial, 0,2,0);

        // 윗면 반지름, 밑면 반지름, 원통 높이, 원통 분할 수, 원통 높이 분할 수, 위아래 Open여부, 시작 각, 연장 각
        geometry = new THREE.CylinderGeometry(0.5,0.5,1,16,2,false,0, 2*Math.PI); 
        this._addMesh(geometry, material, lineMaterial, 2,2,0);

        // 구의 반지름, 수평 분할 수, 수직 분할 수, 수평 시작 각, 수평 연장 각, 수직 시작 각, 수직 연장 각
        // 수평 연장각은 2PI가 360도, 수직 연장각은 PI가 360도
        geometry = new THREE.SphereGeometry(0.6, 32, 16,0, 2*Math.PI,0, Math.PI); 
        this._addMesh(geometry, material, lineMaterial, 4,2,0);

        // 내부 반지름, 외부 반지름, 둘레 분할 수, 두께 분할 수, 시작 각, 연장 각
        geometry = new THREE.RingGeometry(0.4, 0.8, 8, 2, 0, 2*Math.PI); 
        this._addMesh(geometry, material, lineMaterial, -4,0,0);

        // 넓이, 높이, 넓이 분할 수, 높이 분할 수 (GIS 3차원 지형에 활용)
        geometry = new THREE.PlaneGeometry(1,1,4,4); 
        this._addMesh(geometry, material, lineMaterial, -2,0,0);

        // 링 반지름, 원통 반지름, 방사 방향 분할 수, 긴 원통 분할 수, 연장각 길이 (시작각은 지원 안함)
        geometry = new THREE.TorusGeometry(0.6, 0.2, 8, 6, 2*Math.PI); 
        this._addMesh(geometry, material, lineMaterial, 0,0,0);

        // 반지름, 원통 반지금, 분할 수, 반복 수 1, 반복 수 2
        geometry = new THREE.TorusKnotGeometry(0.6, 0.1, 64, 32, 3, 4); 
        this._addMesh(geometry, material, lineMaterial, 2,0,0);

        // THREE.Shape를 인자값으로 받음
        const shape = this.makeShape();        
        geometry = new THREE.ShapeGeometry(shape); 
        this._addMesh(geometry, material, lineMaterial, 4,0,0);

        // 원통 path, 진행방향 분할 수, 원통 반지름, 원통 분할 수, Open여부
        geometry = new THREE.TubeGeometry(this._makeScalePath(0.4), 20,0.1, 8, false); 
        this._addMesh(geometry, material, lineMaterial, -4,-2,0);

        // 회전 시킬 path, 분할 수, 시작 각, 연장 각
        geometry = new THREE.LatheGeometry(this._makePath(), 32, 0, Math.PI*2); 
        this._addMesh(geometry, material, lineMaterial, -2,-2,0);

        // 깊이 값, 분할 수, 바벨여부, 바벨 분할수, 바벨 간격, 바벨 두께
        const extrudeSettings = { depth: 0.2, steps: 2, bevelEnabled: true, bevelSegments: 1,  bevelSize: 0.1, bevelThickness: 0.1 };
        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings); 
        this._addMesh(geometry, material, lineMaterial, 0,-2,0);

        const fontLoader = new FontLoader();
        const url = '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json';
        fontLoader.load(url, (font) => {
            geometry = new TextGeometry("GIS", {
                font: font,
                size: 0.5, // 글자 크기
                height: 0.1, // 글자 깊이
                curveSegments: 4, // 분할 수
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.05,
                bevelSegments: 1
            });

            this._addMesh(geometry, material, lineMaterial, 2,-2,0);
        })

    }

    _makePath() {
        const points = [];
        for(let i = 0;i < 10; ++i) {
            points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.3 + 0.3, (i-5) * .08));
        }
        return points;
    }


    _makeScalePath(scale) {
        class CustomSinCurve extends THREE.Curve {
            constructor(scale) {
              super();
              this.scale = scale;
            }
            getPoint(t) {
              const tx = t * 3 - 1.5;
              const ty = Math.sin(2 * Math.PI * t);
              const tz = 0;
              return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
            }
          }

        const path = new CustomSinCurve(scale);
        return path;
    }

    makeShape() {
        const shape = new THREE.Shape();
        const x = -0.25;
        const y = -0.5;
        shape.moveTo(x + 0.25, y + 0.25);
        shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
        shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
        shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.15, y + 0.77, x + 0.25, y + 0.95);
        shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.45, x + 0.8, y + 0.35);
        shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
        shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

        return shape;
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

        this.update(time);

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