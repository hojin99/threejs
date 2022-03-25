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

        const vertices = [];
        const colors = [];
        const r = 5;

        // let x = [ 5.59834667e+00,  4.62756317e+00, -2.06661675e-16, -6.20643384e+00,
        //     -4.43334079e+00, -6.65235702e+00, -4.73873404e-16,  8.63816420e-02,
        //      1.99321656e+00, 6.57566386e+00, 1.28544692e+00, -1.34562637e-16, -9.21026629e-01,
        //     -2.22843308e+00, -4.96136260e+00, -2.88479371e-16,  5.33557648e-01,
        //      4.84337044e+00, -0.00000000e+00, -0.00000000e+00,  0.00000000e+00,  0.00000000e+00,
        //      0.00000000e+00,  0.00000000e+00,  0.00000000e+00, -0.00000000e+00,
        //     -0.00000000e+00, -6.33622537e+00, -7.82590522e-01,  2.63981755e-17,  2.79472741e-01,
        //      5.90282430e+00,  2.20408198e+00,  3.64150368e-16, -2.27347098e-01,
        //     -6.97094393e-01, -6.20862360e+00, -3.55556584e+00,  1.28874290e-16,  7.71355533e-01,
        //      8.54070254e+00,  4.09856659e+00,  5.21620468e-16, -5.64702487e+00,
        //     -6.56135148e+00];
        //   let y = [ 6.85599732e-16,  4.62756317e+00,  3.37504129e+00,  6.20643384e+00,
        //     -0.00000000e+00, -6.65235702e+00, -7.73893998e+00, -8.63816420e-02,
        //     -2.44098628e-16, 8.05286570e-16,  1.28544692e+00,  2.19757464e+00,  9.21026629e-01,
        //     -0.00000000e+00, -4.96136260e+00, -4.71122566e+00, -5.33557648e-01,
        //     -5.93141811e-16, -0.00000000e+00, -0.00000000e+00, -0.00000000e+00, -0.00000000e+00,
        //      0.00000000e+00, 0.00000000e+00,  0.00000000e+00,  0.00000000e+00, 0.00000000e+00,
        //    -7.75963811e-16, -7.82590522e-01, -4.31114922e-01, -2.79472741e-01,
        //      0.00000000e+00,  2.20408198e+00,  5.94702682e+00,  2.27347098e-01,
        //      8.53694417e-17, -7.60337102e-16, -3.55556584e+00, -2.10467688e+00, -7.71355533e-01,
        //      0.00000000e+00, 4.09856659e+00, 8.51870871e+00,  5.64702487e+00,  8.03533809e-16];
        //   let z = [3.42799866e-16, 4.00726635e-16, 2.06661675e-16, 5.37449897e-16,
        //     2.71463830e-16, 5.76064885e-16, 4.73873404e-16, 7.48027060e-18,
        //     1.22049314e-16, 6.57566386e+00, 1.81789647e+00, 2.19757464e+00, 1.30252835e+00,
        //     2.22843308e+00, 7.01642628e+00, 4.71122566e+00, 7.54564462e-01,
        //     4.84337044e+00, 9.97821509e+00, 5.34772990e+00, 2.07624978e+00, 8.42027350e+00,
        //     2.05370163e+00, 4.22550836e+00, 4.03830571e-01, 8.35613024e-01, 1.22142887e+00,
        //    6.33622537e+00, 1.10675013e+00, 4.31114922e-01, 3.95234140e-01,
        //     5.90282430e+00, 3.11704263e+00, 5.94702682e+00, 3.21517350e-01,
        //     6.97094393e-01, 3.80168551e-16, 3.07896378e-16, 1.28874290e-16, 6.67959995e-17,
        //     5.22967201e-16, 3.54917856e-16, 5.21620468e-16, 4.89007539e-16, 4.01766904e-16];

        let ret = [];
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

                    vertices.push( y,z,x );
        
                    colors.push( z * 1.9  );
                    colors.push( 0.1 );
                    colors.push( 0 );
                }
       
                const meshMaterial = new THREE.LineBasicMaterial( { 
                                                                    vertexColors: true, 
                                                                    linewidth: 30 // WeblGL 제약으로 대부분 무조건 1로 인식됨
                                                                } );
        
                const meshGeometry = new THREE.BufferGeometry();
                meshGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
                meshGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
        
                this._addLine(meshGeometry, meshMaterial, 0,0,0);


            }
        });

        // for ( let i = 0; i < x.length; i ++ ) {            
        //     vertices.push( 0,0,0 );
        //     vertices.push( y[i],z[i],x[i] );

        //     colors.push( ( x[i] / r ) + 0.5 );
        //     colors.push( ( y[i] / r ) + 0.5 );
        //     colors.push( ( z[i] / r ) + 0.5 );
        //     colors.push( ( x[i] / r ) + 0.5 );
        //     colors.push( ( y[i] / r ) + 0.5 );
        //     colors.push( ( z[i] / r ) + 0.5 );

        // }

        // console.log(vertices);

        // const meshMaterial = new THREE.LineBasicMaterial( { 
        //                                                     vertexColors: true, 
        //                                                     linewidth: 30 // WeblGL 제약으로 대부분 무조건 1로 인식됨
        //                                                 } );

        // const meshGeometry = new THREE.BufferGeometry();
        // meshGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        // meshGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        // this._addLine(meshGeometry, meshMaterial, 0,0,0);

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

        this._renderer.setSize(width, height);
    }
}

window.onload= function() {
    new App();
}