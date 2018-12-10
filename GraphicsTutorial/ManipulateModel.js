var renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), antialias: true });
var canvas = document.getElementById('myCanvas');
var mesh;
var camera;
var geometry;
var scene;
var material;
var colors = [0x0000FF, 0xA52A2A, 0x000080, 0x008000, 0x800080, 0x800000, 0x008080]; // blue, brown, dark blue, dark green, dark magneta, dark red, dark cyan
var currentColor = 0;
var loader;
var currentShapes = 0;
var shapesLength = 4;
var shapeString = ['cube', 'sphere', 'rectangle', 'torus(donut)'];
var colorString = ['blue', 'brown', 'dark blue', 'dark green', 'dark magenta', 'dark red', 'dark cyan'];
var targetColor;
var targetShape;
var won = false;
var viewResults = false;
var shapes = {
    Cube: function () {
        geometry = new THREE.BoxGeometry(100, 100, 100);
        material = new THREE.MeshLambertMaterial({ color: colors[currentColor] });
        mesh = new THREE.Mesh(geometry, material);
        setMeshPosition();
        addMeshToScene();
    },
    Sphere: function () {
        geometry = new THREE.SphereGeometry(80, 32, 32);
        material = new THREE.MeshLambertMaterial({ color: colors[currentColor] });
        mesh = new THREE.Mesh(geometry, material);
        setMeshPosition();
        addMeshToScene();
    },
    Extrude: function () {
        var length = 100, width = 150;
        var shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, width);
        shape.lineTo(length, width);
        shape.lineTo(length, 0);
        shape.lineTo(0, 0);

        var extrudeSettings = {
            steps: 5,
            depth: 96,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 1
        };

        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        material = new THREE.MeshLambertMaterial({ color: colors[currentColor] });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-50, -90, -1000);
        addMeshToScene();
    },
    Torus: function () {
        geometry = new THREE.TorusGeometry(100, 40, 64, 100);
        material = new THREE.MeshLambertMaterial({ color: colors[currentColor] });
        mesh = new THREE.Mesh(geometry, material);
        setMeshPosition();
        addMeshToScene();
    }
};



function main() {

    canvas.innerHTML = "Change Color";
    renderer.setClearColor(0x00ffff, 1); ///cyan
    renderer.setPixelRatio(window.devicePizelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);

    var light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    var light1 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light1);


    shapes.Cube();
   // shapes.Extrude();
    
    requestAnimationFrame(render);
    
    document.addEventListener("keydown", onDocumentKeyDown, false);
}

function onDocumentKeyDown(event) {
    
    var keyCode = event.which;
    if (keyCode == 37) { // left
        mesh.rotation.y -= 0.1;
    }
    else if (keyCode == 38) { // up
        mesh.rotation.x -= 0.1;
    }
    else if (keyCode == 39) { // right
        mesh.rotation.y += 0.1;
    }
    else if (keyCode == 40) { // down

        mesh.rotation.x += 0.1;
    }
    else if (keyCode == 67) {// C

        if (currentColor < (colors.length - 1)) {
            currentColor++;
        }

        else {
            currentColor = 0;
        }
        mesh.material.color.setHex(colors[currentColor]);

    }

    else if (keyCode == 83) { // s
        if (currentShapes < (shapesLength - 1)) {
            currentShapes++;
        }
        else {
            currentShapes = 0;
        }
        //mesh.geometry.dispose();
        removeMeshFromScene();
        if (currentShapes == 0) {
            shapes.Cube();
        }
        else if (currentShapes == 1) {
            shapes.Sphere();
        }
        else if (currentShapes == 2) {
            shapes.Extrude();
        }
        else if (currentShapes == 3) {
            shapes.Torus();
        }

        requestAnimationFrame(render);
    }
    else if (keyCode == 82) { // r
        if (viewResults) {

            changeTextOriginal();
            viewResults = false;
        }
        
    }
    check();
}


function render() {
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function setMeshPosition() {

    mesh.position.set(0, 0, -1000);
}
function addMeshToScene() {

    scene.add(mesh);
}
function removeMeshFromScene() {

    mesh.geometry.dispose();
    scene.remove(mesh);
}
function setTarget() {
    var shapeMin = 0;
    var colorMin = 0;
    var randShape = Math.floor((Math.random() * (shapesLength - shapeMin)) + shapeMin);
    var randColor = Math.floor((Math.random() * (colorString.length - colorMin)) + colorMin);
    targetColor = colorString[randColor]; // magenta
    targetShape = shapeString[randShape]; // sphere
    console.log(targetColor);
    console.log(targetShape);
    console.log(randShape);
    console.log(randColor);
    won = false;
}
function check() {
    if ((targetColor == colorString[currentColor]) && (targetShape == shapeString[currentShapes])) {
        won = true;
    }
}

function startTimer() {
    setTarget();
    var rules = document.getElementById('hiddenrules');
    var countdown = document.getElementById('countdown');
    countdown.style.visibility = 'visible';
    rules.style.visibility = 'hidden';
    countdown.innerHTML = "Ready? Start!";
    var countDown = new Date((new Date().getTime()) + 1000 * 12).getTime();
    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDown - now;

        var seconds = Math.floor((distance % (1000 * 60) / 1000));

        countdown.innerHTML = targetShape + "<br/>" + targetColor + "<br/>" + seconds + "s";
        if (distance < 0) {
            clearInterval(x);
            viewResults = true;
            check();
            if (won == true) {
                countdown.innerHTML = "You won! <br/> Click 'R' to return to instructions";
                
            }
            else {

                countdown.innerHTML = "You lost! <br/> Click 'R' to return to main page";
            }
            viewResults = true;
        }
    }, 1000)
}
