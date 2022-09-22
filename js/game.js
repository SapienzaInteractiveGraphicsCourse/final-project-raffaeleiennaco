import * as THREE from "https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js";

import {OrbitControls} from './OrbitControls.js';

import {GameSetting} from './GameSetting.js'
import {buildMap, setScoreOnMap, setEnemyOnMap, buildPerson} from './MapBuilder.js'
import {EnemyAnimation, PersonAnimation} from './Animations.js'

var JSONstring = JSON.parse(sessionStorage.getItem("gameSetting"));
if (JSONstring == null){
    throw ReferenceError("Game settings not set correctly")
}
var gameSetting = new GameSetting();
gameSetting.setValuesFromJSON(JSONstring);

var stateEnum = gameSetting.getStateEnumerator();


var renderer;
var camera;
var scene;

var controls;

var audio_damage = new Audio('damage.mp3');
var audio_collect = new Audio('collect.mp3');

var max_x_map = 10.0;
var max_y_map = 10.0;
var person = {pos: [0.0, 0.0, 0.0], rot: 0.0, vel: 0.0,
    model: null, state: 0.0,
    left: false, up: false, right: false, down: false,
    pause: false}

var points = [];
var enemies = [];

var score = 0;
var score_txt;
var score_txt_pause;

var lives = 5;
var lives_txt;
var lives_txt_pause;

var div_pause_menu;

async function loading(){
    gameSetting.setState(stateEnum.Loading);
    score_txt = document.getElementById("score_txt");
    score_txt_pause = document.getElementById("score_txt_pause");
    lives_txt = document.getElementById("lives_txt");
    lives_txt.innerHTML = lives;
    lives_txt_pause = document.getElementById("lives_txt_pause");

    var canvas = document.getElementById("game_canvas");

    div_pause_menu = document.getElementById("div_pause_menu");

    // build three system
    scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xac0fc );

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 11, 15);
    camera.lookAt(0, 0, 0);
    onWindowResize();
    
	controls = new OrbitControls(camera, renderer.domElement);

    //light system
    var colors = [0xffaa00, 0xffaa00, 0xffd900, 0xffd900, 0xffd900, 0xffffff, 0xffffff,
            0xffffff, 0xffd900, 0xffd900, 0xffd900, 0x66a8ff, 0x66a8ff, 0x006eff, 0x006eff];
    var intensities = [0.8, 0.9, 1.0, 1.1, 1.1, 1.2, 1.2,
            1.2, 1.2, 1.1, 1.1, 1.0, 0.9, 0.8, 0.8]
    var positions_light = [-1, -0.75, -0.5, -0.25, -0.25, 0.0, 0.0,
            0.0, 0.0, 0.25, 0.25, 0.5, 0.75, 1.0, 1.0];
    var time = gameSetting.getDayTime()-gameSetting._min_dayTime;

    var ambientLight = new THREE.AmbientLight(colors[time], 1.0);
    scene.add(ambientLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, intensities[time]);
    dirLight.position.set( positions_light[time], 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );

    dirLight.castShadow = true;

    dirLight.shadow.bias = -0.001;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1000.0;
    
    dirLight.shadow.camera.left = 100;
    dirLight.shadow.camera.right = -100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    scene.add( dirLight );

    var audio_game = document.getElementById("audio_game");
    audio_game.volume = gameSetting.getVolume()/10.0;
    audio_damage.volume = gameSetting.getVolume()/10.0;
    audio_damage.volume = gameSetting.getVolume()/10.0;

    // build map
    await buildMap(gameSetting.getMap(), scene);

    person.model = await buildPerson(gameSetting.getDifficulty(), person, scene);

    points = await setScoreOnMap(gameSetting.getDifficulty(), scene)

    enemies = await setEnemyOnMap(gameSetting.getDifficulty(), scene, person)
    
    document.addEventListener("keydown", function(event) {
        var keyCode = event.keyCode;
		switch (keyCode) {
			case 37:
            person.left = true;
            break;
			case 38:
            person.up = true;
            break;
			case 39:
            person.right = true;
            break;
			case 40:
            person.down = true;
            break;

            case 27:
            person.pause = !person.pause;
            if(person.pause){
                div_pause_menu.style.display = "block";
                score_txt_pause.innerHTML = score;
                lives_txt_pause.innerHTML = lives;
            } else {
                div_pause_menu.style.display = "none";
            }
            break;
            
			case 65:
            person.left = true;
            break;
			case 87:
            person.up = true;
            break;
			case 68:
            person.right = true;
            break;
			case 83:
            person.down = true;
            break;
		}
    });
	
	document.addEventListener("keyup", function(event) {
		var keyCode = event.keyCode;
		switch (keyCode) {
			case 37:
            person.left = false;
            break;
			case 38:
            person.up = false;
            break;
			case 39:
            person.right = false;
            break;
			case 40:
            person.down = false;
            break;
            
			case 65:
            person.left = false;
            break;
			case 87:
            person.up = false;
            break;
			case 68:
            person.right = false;
            break;
			case 83:
            person.down = false;
            break;
		}
    });

    scene.add(camera);

    window.addEventListener( 'resize', onWindowResize );

    // start the game
    playing()
}
function onWindowResize() {
    var w = window.innerWidth - 25;
    var h = window.innerHeight - 9;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}


function playing(){
    gameSetting.setState(stateEnum.Playing);

    const nums = document.querySelectorAll('.nums span');
    const counter = document.querySelector('.counter');
    const finalMessage = document.querySelector('.final');
    const div_container_counter = document.getElementById('div_container_counter');

    function runAnimation() {
        nums.forEach((num, idx) => {
            const penultimate = nums.length - 1;
            num.addEventListener('animationend', (e) => {
                if(e.animationName === 'goIn' && idx !== penultimate){
                    num.classList.remove('in');
                    num.classList.add('out');
                } else if (e.animationName === 'goOut' && num.nextElementSibling){
                    num.nextElementSibling.classList.add('in');
                } else {
                    counter.classList.add('hide');
                    finalMessage.classList.add('show');
                }
            });
            finalMessage.addEventListener('animationend', (e) => {
                if(e.animationName === 'show'){
                    finalMessage.classList.remove('show');
                    finalMessage.classList.add('hide');
                    div_container_counter.classList.add('hide');
                } else {
                    requestAnimationFrame(animate);
                }
            });
        });
    };

    runAnimation();
    renderer.render(scene, camera);

    nums[0].classList.add('in');
}
function animate() {
    if (person.pause){
        requestAnimationFrame(animate);
        return;
    }

    PersonAnimation(person);

    if(person.left){
        person.rot -= 0.025;
    }
    if(person.up){
        person.vel += 0.05;
    }
    if(person.right){
        person.rot += 0.025;
    }
    if(person.down){
        person.vel -= 0.05;
    }

    person.vel = Math.min(1.0, Math.max(-1.0, person.vel))

    person.pos[0] += Math.cos(person.rot) * person.vel;
    person.pos[2] += Math.sin(person.rot) * person.vel;
    person.pos[0] = Math.min(max_x_map, Math.max(-max_x_map, person.pos[0]))
    person.pos[2] = Math.min(max_y_map, Math.max(-max_y_map, person.pos[2]))

    person.vel -= Math.sign(person.vel) * 0.05;
    if(Math.abs(person.vel) < 0.1) person.vel = 0;
    else person.vel -= Math.sign(person.vel) * 0.05;

    person.model.position.set(person.pos[0], person.pos[1], person.pos[2]);
    person.model.rotation.set(0.0, -person.rot+1.57, 0.0);

    if(gameSetting.isFirstPerson()){
        camera.position.set((person.pos[0]-5*Math.cos(person.rot)), 5, (person.pos[2]-5*Math.sin(person.rot)));
        camera.lookAt((person.pos[0]+5*Math.cos(person.rot)), person.pos[1], (person.pos[2]+5*Math.sin(person.rot)));
        controls.target.set((person.pos[0]+5*Math.cos(person.rot)), person.pos[1], (person.pos[2]+5*Math.sin(person.rot)));
    } else {
        controls.target.set(person.model.position.x, person.model.position.y, person.model.position.z);
    }



    points.forEach((point) => {
        point.rot += 0.01;
        point.model.rotation.set(0, point.rot, 0);
        if(Math.sqrt(
            Math.pow(point.pos[0] - person.pos[0], 2) +
            Math.pow(point.pos[2] - person.pos[2], 2)
            ) < 0.5){
                var px = Math.random() * 20 - 10;
                var pz = Math.random() * 20 - 10;
                point.pos = [px, 0.75, pz];
                point.model.position.set(point.pos[0], point.pos[1], point.pos[2]);

                score++;
                score_txt.innerHTML = score;

                audio_collect.currentTime = 0;
                audio_collect.play();   
            }
    });

    enemies.forEach((enemy) => {
        EnemyAnimation(enemy);

        var ipo = Math.sqrt(Math.pow(enemy.pos[0] - person.pos[0], 2) +
            Math.pow(enemy.pos[2] - person.pos[2], 2))
        var cos = (person.pos[0] - enemy.pos[0]) / ipo;
        var sin = (person .pos[2] - enemy.pos[2]) / ipo;

        enemy.pos[0] += cos * enemy.vel;
        enemy.pos[2] += sin * enemy.vel;

        enemy.model.position.set(enemy.pos[0], enemy.pos[1], enemy.pos[2]);
        enemy.model.rotation.set(0, -Math.atan2(sin, cos)+1.57, 0);

        if(ipo < 0.25 || (Date.now()-enemy.time_spawn > enemy.max_time && enemy.prob > Math.random())){
            var px = 0;
            var pz = 0;
            do{
                px = Math.random() * 20 - 10;
                pz = Math.random() * 20 - 10;
                var dist = Math.sqrt(Math.pow(px - person.pos[0], 2) +
                    Math.pow(pz - person.pos[2], 2))
            }while(dist < 5);

            
            enemy.pos = [px, 0, pz];
            enemy.model.position.set(enemy.pos[0], enemy.pos[1], enemy.pos[2]);

            if(ipo < 0.25){
                lives--;
                lives_txt.innerHTML = lives;
                audio_damage.currentTime = 0;
                audio_damage.play();                
            }

            enemy.time_spawn = Date.now();
        }
    });


    if(lives > 0){
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    } else {
        terminate();
    }
}


function terminate() {
    gameSetting.setState(stateEnum.Terminate);
    sessionStorage.setItem('score', score);
    window.location.href = "./end.html";
}


window.addEventListener('DOMContentLoaded', () => {
    loading();
});

