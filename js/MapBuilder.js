import * as THREE from "https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js";
import { GLTFLoader } from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/examples/jsm/loaders/GLTFLoader.js';

import {difficultyEnum, mapEnum} from './EnumModule.js';

// MeshBasic_Material MeshStandard_Material  MeshLambert_Material  MeshPhong_Material
var textureLoader = new THREE.TextureLoader();
function loadTexture(url){
    var texture = textureLoader.load(url);
    texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function loadMaterials(){
    var materials = {};
	
	var lateral_ground_texture = loadTexture("textures/ground.jpg");
	lateral_ground_texture.repeat.set(20, 1);
    var lateral_ground_texture_nm = loadTexture("textures/ground_nm.png");
	lateral_ground_texture_nm.repeat.set(20, 1);

	var grass_texture = loadTexture("textures/grassgame.jpg");
	grass_texture.repeat.set(2, 2);
    var grass_texture_nm = loadTexture("textures/grassgame_nm.png");
	grass_texture_nm.repeat.set(2, 2);

    var rock_texture_long = loadTexture("textures/mattoni.png");
    rock_texture_long.repeat.set(1, 8);
    var rock_texture_long_nm = loadTexture("textures/mattoni_nm.png");
    rock_texture_long_nm.repeat.set(1, 8);

    var rock_texture_medium = loadTexture("textures/mattoni.png");
    rock_texture_medium.repeat.set(1, 5);
    var rock_texture_medium_nm = loadTexture("textures/mattoni_nm.png");
    rock_texture_medium_nm.repeat.set(1, 5);

    var rock_texture_lateral_long = loadTexture("textures/mattoni.png");
    rock_texture_lateral_long.repeat.set(5, 1);
    var rock_texture_lateral_long_nm = loadTexture("textures/mattoni_nm.png");
    rock_texture_lateral_long_nm.repeat.set(5, 1);

    var rock_texture_short = loadTexture("textures/mattoni.png");
    rock_texture_short.repeat.set(3, 1);
    var rock_texture_short_nm = loadTexture("textures/mattoni_nm.png");
    rock_texture_short_nm.repeat.set(3, 1);

    var rock_texture_short_horizontal = loadTexture("textures/mattoni.png");
    rock_texture_short_horizontal.repeat.set(1, 3);
    var rock_texture_short_horizontal_nm = loadTexture("textures/mattoni_nm.png");
    rock_texture_short_horizontal_nm.repeat.set(1, 3);

    materials["grass"] = new THREE.MeshStandardMaterial({
        map: grass_texture,
        normalMap: grass_texture_nm,
        emissive: 'white',
        emissiveIntensity: -0.5,
    });
    materials["lateral_ground"] = new THREE.MeshStandardMaterial({
        map: lateral_ground_texture,
        normalMap: lateral_ground_texture_nm,
        emissive: 'white',
        emissiveIntensity: -0.6,
    });
    materials["ground"] = new THREE.MeshStandardMaterial({
        map: rock_texture_long,
        normalMap: rock_texture_long_nm,
        emissive: 'white',
        emissiveIntensity: -0.6,
    });

    materials["ground_lateral_long"] = new THREE.MeshStandardMaterial({
        map: rock_texture_lateral_long,
        normalMap: rock_texture_lateral_long_nm,
        emissive: 'white',
        emissiveIntensity: -0.6,
    });

    materials["ground_short"] = new THREE.MeshStandardMaterial({
        map: rock_texture_short,
        normalMap: rock_texture_short_nm,
        emissive: 'white',
        emissiveIntensity: -0.6,
    });

    materials["ground_medium"] = new THREE.MeshStandardMaterial({
        map: rock_texture_medium,
        normalMap: rock_texture_medium_nm,
        emissive: 'white',
        emissiveIntensity: -0.6,
    });

    materials["ground_short_horizontal"] = new THREE.MeshStandardMaterial({
        map: rock_texture_short_horizontal,
        normalMap: null, //rock_texture_short_horizontal,
        emissive: 'white',
        emissiveIntensity: -0.6,
    });


    materials["dirt"] = [materials["lateral_ground"], materials["lateral_ground"], materials["grass"],
        materials["ground"], materials["lateral_ground"], materials["lateral_ground"]];

    materials["rock"] = [materials["ground"], materials["ground"], materials["ground"],
        materials["ground"], materials["ground"], materials["ground"]];

    materials["rock_lateral"] = [materials["ground_lateral_long"], materials["ground_lateral_long"], materials["ground_lateral_long"],
        materials["ground_lateral_long"], materials["ground_lateral_long"], materials["ground_lateral_long"]];

    materials["rock_short"] = [materials["ground_short"], materials["ground_short"], materials["ground_short"],
        materials["ground_short"], materials["ground_short"], materials["ground_short"]];

    materials["ground_medium"] = [materials["ground_medium"], materials["ground_medium"], materials["ground_medium"],
        materials["ground_medium"], materials["ground_medium"], materials["ground_medium"]];

    materials["ground_SH"] = [materials["ground_short_horizontal"], materials["ground_short_horizontal"], materials["ground_short_horizontal"],
        materials["ground_short_horizontal"], materials["ground_short_horizontal"], materials["ground_short_horizontal"]];
    return materials;
}

function buildCube(sx, sy, sz, px, py, pz, material){
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), material);
    mesh.position.set(px, py, pz);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
}
function buildSphere(r, px, py, pz, material){
    var mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), material);
    mesh.position.set(px, py, pz);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
}


function modelLoader(url) {
    var gltfLoader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        gltfLoader.load(url, data=> resolve(data), null, reject);
    });
}

async function loadModel(url, pos, scale, cast, recive){
    var gltfData = await modelLoader(url);

    var model = gltfData.scene;
    
    model.position.set(pos[0], pos[1], pos[2]);
    model.scale.setScalar(scale);

    model.traverse( function (object) {
        if ( object.isMesh ){
            object.castShadow = cast;
            model.receiveShadow = recive;
        }
    });

    model.castShadow = cast;
    model.receiveShadow = recive;

    return model;
}

function setModelPos(scene, model, px, py, pz){
    var clone_model = model.clone();
    clone_model.position.set(px, py, pz);
    scene.add(clone_model);
}
function setModelPosRot(scene, model, px, py, pz, rx, ry, rz){
    var clone_model = model.clone();
    clone_model.position.set(px, py, pz);
    clone_model.rotation.set(rx, ry, rz);
    scene.add(clone_model);
}

export async function buildMap(mapType, scene, materials){
    var materials = loadMaterials();

    if(mapType == mapEnum.Plain) {
        scene.add(buildCube( 26.8, 0.8, 26.5, 3, -0.4, 3, materials["dirt"])); //BASE
        scene.add(buildCube( 2, 2, 28.4, 17.4, 0.2, 4, materials["rock"])); //recinto dietro alberi 3 arancioni e 1 rosso

        scene.add(buildCube( 15.35, 0.8, 20.5, -18.05, -0.4, 0, materials["dirt"])); //AVANTI
        scene.add(buildCube( 2, 2, 20.5, -26.7, 0.2, 0, materials["rock"])); //recinto avanti

        scene.add(buildCube( 2, 2, 17.5, -19.25, 0.2, -19, materials["ground_medium"])); //recinto sinistra avanti
        scene.add(buildCube( 2, 2, 17.5, 3.25, 0.2, -19, materials["ground_medium"])); //recinto sinistra dietro

        scene.add(buildCube( 7.5, 2, 2, -24, 0.2, -11.25, materials["rock_short"])); // recinto sinistra metà avanti
        scene.add(buildCube( 14.15, 2, 2, 11.3, 0.2, -11.25, materials["rock_short"])); // recinto sinistra metà
        // dietro
        scene.add(buildCube( 20.5, 2, 2, -8, 0.2, -26.75, materials["rock_lateral"])); // recinto sinistra

        scene.add(buildCube( 20.5, 0.8, 15.5, -8, -0.4, -18, materials["dirt"])); //DESTRA
        scene.add(buildCube( 26.8, 2, 2, 3, 0.2, 17.25, materials["rock_lateral"])); // recinto destra
        scene.add(buildCube( 15.35, 2, 2, -20.05, 0.2, 11.25, materials["rock_lateral"])); //
        scene.add(buildCube( 2, 2, 8, -11.4, 0.2, 14.25, materials["ground_SH"])); // albero rosso

        var model = null;

        model = await loadModel("./models/platano_tree/scene.gltf", [0, 0, 0], 0.01, true, false);
        setModelPos(scene, model, -16.5, 0, -23.5);
        setModelPos(scene, model, -0.8, 0, -23.5);
        setModelPos(scene, model, -8.5, 0, -23.5);
        setModelPos(scene, model, 14.5, 0, -7.5);
        setModelPos(scene, model, 14.5, 0, -0.5);
        setModelPos(scene, model, 14.5, 0, 7.5);

        model = await loadModel("./models/flowers/scene.gltf", [0, 0, 0], 0.45, false, true);
        setModelPos(scene, model, -3, 0, -23.5);
        setModelPos(scene, model, -4, 0, -23.5);
        setModelPos(scene, model, -5, 0, -23.5);
        setModelPos(scene, model, -6, 0, -23.5);
        setModelPos(scene, model, -11, 0, -23.5);
        setModelPos(scene, model, -12, 0, -23.5);
        setModelPos(scene, model, -13, 0, -23.5);
        setModelPos(scene, model, -14, 0, -23.5);
        setModelPos(scene, model, -8, 0, -18);
        setModelPos(scene, model, -9, 0, -18);

        model = await loadModel("./models/flowers_lib/scene.gltf", [0, 0, 0], 0.45, false, true);
        setModelPos(scene, model, 1.5, 0, 13);
        setModelPosRot(scene, model, 2, 0, 13, 0, 1, 0);
        setModelPos(scene, model, 5, 0, 13);
        setModelPosRot(scene, model, 5.5, 0, 13, 0, 1, 0);

        setModelPos(scene, model, 12, 0, -4.25);
        setModelPosRot(scene, model, 12, 0, -4.25, 0, 1, 0);
        setModelPos(scene, model, 12, 0, 4.25);
        setModelPosRot(scene, model, 12, 0, 4.25, 0, 1, 0);

        model = await loadModel("./models/bench/scene.gltf", [0, 0, 0], 0.02, true, true);
        setModelPosRot(scene, model, -4.5, 0.5, -18, 0, 1.60, 0);
        setModelPosRot(scene, model, -12.5, 0.5, -18, 0, 1.60, 0);

        model = await loadModel("./models/cartoon_pond/scene.gltf", [0, 0, 0], 0.25, false, false);
        setModelPos(scene, model, -18, -0.2, 0);

        model = await loadModel("./models/lotus_flower_by_geometry_nodes/scene.gltf", [0, 0, 0], 0.3, false, true);
        setModelPos(scene, model, -19.5, 0.1, 3);
        setModelPos(scene, model, -20, 0.1, 2.62);
        setModelPos(scene, model, -20.5, 0.1, 2.25);
        setModelPos(scene, model, -18, 0.1, -3);
        setModelPos(scene, model, -18.5, 0.1, -2.25);

        model = await loadModel("./models/lotus/scene.gltf", [0, 0, 0], 0.3, false, false);
        setModelPos(scene, model, -19, 0.1, 0.75);

        model = await loadModel("./models/waste_bin/scene.gltf", [0, 0, 0], 0.25, true, false);
        setModelPos(scene, model, -15.5, 0, -18);
        setModelPos(scene, model,-2, 0, -18);
    
        model = await loadModel("./models/tree/scene.gltf", [0, 0, 0], 0.0035, true, false);
        //setModelPos(scene, model, -18, 0, -8);
        //setModelPos(scene, model, -22, 0, -8);
        setModelPos(scene, model, 14.5, 0, 13);
        setModelPos(scene, model, -7.5, 0, 13);

        model = await loadModel("./models/fantasy_tree/scene.gltf", [0, 0, 0], 1, true, false);
        setModelPosRot(scene, model, -25, 0, -8, 0, 1, 0);
        setModelPosRot(scene, model, -25, 0, 8, 0, 1, 0);

        model = await loadModel("./models/barrels/scene.gltf", [0, 0, 0], 0.3, true, false);
        setModelPos(scene, model, 9, 0, 13);
        setModelPos(scene, model, -2, 0, 13);

        model = await loadModel("./models/wooden_fence/scene.gltf", [0, 0, 0], 0.1, true, true);
        //setModelPos(scene, model, -10.5, 0, 13);
        setModelPos(scene, model, -10.25, 0, 8);
        setModelPos(scene, model, -10.25, 0, 4);
        setModelPos(scene, model, -10.25, 0, 0);
        setModelPos(scene, model, -10.25, 0, -4);
        setModelPos(scene, model, -10.25, 0, -8);

        //setModelPosRot(scene, model, 10.5, 0, 13, 0,Math.PI,0);
        setModelPosRot(scene, model, 10.25, 0, 8,0,Math.PI,0);
        setModelPosRot(scene, model, 10.25, 0, 4,0,Math.PI,0);
        setModelPosRot(scene, model, 10.25, 0, 0,0,Math.PI,0);
        setModelPosRot(scene, model, 10.25, 0, -4,0,Math.PI,0);
        setModelPosRot(scene, model, 10.25, 0, -8,0,Math.PI,0);

        setModelPosRot(scene, model, 0, 0, -10.25, 0, -1.57, 0);
        setModelPosRot(scene, model, -4, 0, -10.25, 0, -1.57, 0);
        setModelPosRot(scene, model, -8, 0, -10.25, 0, -1.57, 0);

        setModelPosRot(scene, model, 8, 0, 10.25, 0, 1.57, 0);
        setModelPosRot(scene, model, 4, 0, 10.25, 0, 1.57, 0);
        setModelPosRot(scene, model, -0, 0, 10.25, 0, 1.57, 0);
        setModelPosRot(scene, model, -4, 0, 10.25, 0, 1.57, 0);
        setModelPosRot(scene, model, -8, 0, 10.25, 0, 1.57, 0);



    }else if(mapType == mapEnum.Lake) {
        scene.add(buildCube( 20, 2, 20, 0, 0, 0, new THREE.MeshStandardMaterial( { color: 0xff00ff }) ));

        var gltfData = await modelLoader("./models/adventure_asset_pack/scene.gltf");
        var adventure_asset_pack = gltfData.scene.children[0].children[0].children[0].children[0].children[0].children;
        /*adventure_asset_pack.forEach((v) => {
            console.log(v.name)
        });*/

        var models = [
            {name:"PineTree_V1", model: null, pos: [10, 0, 10], rot: 0},
            {name:"PineTree_V3", model: null, pos: [10, 0, 8], rot: 0},
            {name:"Willow_Tree", model: null, pos: [10, 0, 6], rot: 0},
            {name:"Pinetree_V2", model: null, pos: [10, 0, 4], rot: 0},
            {name:"Tree", model: null, pos: [10, 0, 2], rot: 0},
            {name:"Tree1", model: null, pos: [10, 0, 0], rot: 0},
            {name:"Tree2", model: null, pos: [10, 0, -2], rot: 0},
            {name:"Tree4", model: null, pos: [10, 0, -4], rot: 0},
            {name:"PineTree_V3", model: null, pos: [10, 0, -6], rot: 0},
            {name:"PineTree_V1", model: null, pos: [10, 0, -8], rot: 0},
            {name:"Willow_Tree", model: null, pos: [10, 0, -10], rot: 0},
        ];
        models.forEach((m) => {
            m.model = adventure_asset_pack.find((child) => child.name === m.name).clone();
            m.model.position.set(m.pos[0], m.pos[1], m.pos[2]);
            m.model.rotation.set(-Math.PI/2, m.rot, 0);
            m.model.scale.setScalar(0.05);
            scene.add(m.model);


        });
    }else if(mapType == mapEnum.Mountain) {
        scene.add(buildCube( 20, 2, 20, 0, 0, 0, new THREE.MeshStandardMaterial( { color: 0x00ffff }) ));
    }
}

export async function buildPerson(diffType, person, scene){ // human_character
    var model = await loadModel("./models/human_character/scene.gltf", person.pos, 0.85); //
    model.rotation.set(0.0, 1.57, 0.0);

    scene.add(model);

    return model;
}

export async function setScoreOnMap(diffType, scene){
    var scores = [];
    var model = await loadModel("./models/birthday_gem/scene.gltf", [0, 0, 0], 0.4);
    var models = [];

    if(diffType == difficultyEnum.Easy){
        var models = [
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
        ];
    }else if(diffType == difficultyEnum.Medium){
        var models = [
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
        ];
    }else if(diffType == difficultyEnum.Hard){
        var models = [
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
            {model: model.clone(), pos: [0, 0, 0], rot: 0},
        ];
    }
    
    models.forEach((m) => {
        var px = Math.random() * 20 - 10;
        var pz = Math.random() * 20 - 10;
        m.pos = [px, 0.75, pz];

        m.model.position.set(m.pos[0], m.pos[1], m.pos[2]);
        m.model.rotation.set(0, m.rot, 0);

        scene.add(m.model);
        scores.push(m)
    });

    return scores;
}

export async function setEnemyOnMap(diffType, scene, person){
    var enemies = [];
    var models = [];

    var pos1 = [4, 0, 4];
    var pos2 = [-4, 0, 4];
    var pos3 = [4, 0, -4];
    var pos4 = [-4, 0, -4];
    var pos5 = [-6, 0, 0];

    if(diffType == difficultyEnum.Easy){
        models = [
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos1, 0.6), state: 0.0,
                pos: pos1, vel:0.01, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos2, 0.6), state: 10.0,
                pos: pos2, vel:0.01, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos3, 0.65), state: 20.0,
                pos: pos3, vel:0.02, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos4, 0.65), state: 30.0,
                pos: pos4, vel:0.02, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos5, 0.7), state: 40.0,
                pos: pos5, vel:0.03, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
        ];
    }else if(diffType == difficultyEnum.Medium){
        models = [
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos1, 0.6), state: 0.0,
                pos: pos1, vel:0.02, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos2, 0.6), state: 10.0,
                pos: pos2, vel:0.02, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos3, 0.65), state: 20.0,
                pos: pos3, vel:0.03, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos4, 0.65), state: 30.0,
                pos: pos4, vel:0.03, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos5, 0.7), state: 40.0,
                pos: pos5, vel:0.035, time_spawn: Date.now(), max_time: 7500, prob: 0.001, state:0},
        ];
    }else if(diffType == difficultyEnum.Hard){
        models = [
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos1, 0.6), state: 0.0,
                pos: pos1, vel:0.035, time_spawn: Date.now(), max_time: 5000, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos2, 0.6), state: 10.0,
                pos: pos2, vel:0.035, time_spawn: Date.now(), max_time: 5000, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos3, 0.7), state: 20.0,
                pos: pos3, vel:0.04, time_spawn: Date.now(), max_time: 5000, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos4, 0.7), state: 30.0,
                pos: pos4, vel:0.04, time_spawn: Date.now(), max_time: 5000, prob: 0.001, state:0},
            {model: await loadModel("./models/low_poly_warrior/scene.gltf", pos5, 0.75), state: 40.0,
                pos: pos5, vel:0.04, time_spawn: Date.now(), max_time: 5000, prob: 0.001, state:0},
        ];
    }

    models.forEach((m) => {
        scene.add(m.model);

        enemies.push(m);
    });

    return enemies;
}
