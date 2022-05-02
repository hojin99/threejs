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
        // this._setupLight();
        this._setupModel();
        this._setupControls();   
        this._setupGrid();   
        // this._loadObj();  

        window.onresize = this.resize.bind(this);
        this.resize();

        // 브라우저에 애니메이션 프레임 요청 - render 호출됨
        requestAnimationFrame(this.render.bind(this));
    }

    _loadObj() {
        // 외부 3차원 객체를 추가
        let object;
        let that = this;

        // 진행 중 호출 함수
        function onProgress( xhr ) {

            if ( xhr.lengthComputable ) {

                const percentComplete = xhr.loaded / xhr.total * 100;
                console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );

            }
        }

        // 에러 시 호출 함수
        function onError() {}

        // 최종 호출 함수
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
        // 2차원 격자를 정의할 수 있도록 해줌
        const helper = new THREE.GridHelper( 10, 100 ); // total size, divisions
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        this._scene.add( helper );
    }

    _setupControls() {
        // 마우스 컨트롤에 따라서 Camera가 Target 주위를 회전할 수 있도록 해줌
        const control = new OrbitControls(this._camera, this._divContainer);
        control.maxPolarAngle = Math.PI / 2; // 수직으로 얼마나 각도를 움직일 수 있는 지 설정 0 ~ PI
    }

    _setupCamera() {
        // 카메라 설정
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        console.log(`[_setupCamera] width - ${width}`);
        console.log(`[_setupCamera] height - ${height}`);
        // 원근감이 있는 카메라 (일반 적인 경우 이걸 사용하면 된다고 함)
        const camera = new THREE.PerspectiveCamera(
            75, // 시야각
            width/height, // 종횡비
            0.1, // near
            100 // far
        );
        camera.position.z = 2; // 2정도 뒤로
        camera.position.y = 1; // 1정도 위로
        this._camera = camera;
    }

    _setupLight() {
        // 광원 설정
        const color = 0xffffff;
        const intensity = 1; // 광원세기
        // 태양과 비슷한 성격의 광원, 그림자 사용 가능
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-4, 4, 10); // 광원 위치
        this._scene.add(light);
    }

    _setupModel() {
        // 모델 설정
        const vertices = [];
        const colors = [];
        const sizes = [];

        let ret;
        const data = Papa.parse("./data/data2.csv", {
            header: false,
            delimiter: ",",	
            download:true,
            complete: response => {
                ret = response.data;
                // console.log(response.data)
                let x,y,z;

                for ( let i = 0; i < ret.length; i ++ ) {            
                    x = ret[i][0];
                    y = ret[i][1];
                    z = ret[i][2];

                    vertices.push( x,y,z );
        
                    colors.push( z );
                    colors.push( y );
                    colors.push( x );

                    sizes[i] = 0.1;
                }
       
				const material = new THREE.ShaderMaterial( {

					uniforms: {
						color: { value: new THREE.Color( 0xffffff ) },
						pointTexture: { value: new THREE.TextureLoader().load( 'textures/disc.png' ) },
						alphaTest: { value: 0.8 }
					},
					vertexShader: document.getElementById( 'vertexshader' ).textContent,
					fragmentShader: document.getElementById( 'fragmentshader' ).textContent

				} );

                //  const material = new THREE.PointsMaterial( { size: 0.03, vertexColors: true } );
        
                const meshGeometry = new THREE.BufferGeometry();
                meshGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
				meshGeometry.setAttribute( 'customColor', new THREE.Float32BufferAttribute( colors, 3 ) );
                // meshGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
				meshGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ) );
                // 3D 모델의 초기 배치가 Z가 위가 아니라 앞 쪽이어서 위가 되도록 돌려줌
                meshGeometry.rotateX( - Math.PI / 2 );

                this._addPoint(meshGeometry, material, 0,0,0);

            }
        });

    }

    _addPoint(geometry, material, x, y, z) {
        const mesh = new THREE.Points( geometry, material );

        mesh.position.set(x,y,z);

        this._meshs.push(mesh);
        this._scene.add(mesh);
    }

    _addLine(geometry, material, x, y, z) {
        const mesh = new THREE.Line( geometry, material );

        mesh.position.set(x,y,z);

        this._meshs.push(mesh);
        this._scene.add(mesh);
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

        // rnderer 사이즈를 맞춰줌
        this._renderer.setSize(width, height);
    }
}

window.onload= function() {
    new App();
}