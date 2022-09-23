

export function EnemyAnimation(Enemy){
    Enemy.state += 0.01;

    var LeftUpLeg_60 = Enemy.model.getObjectByName("Bone016_Armature000");
    var LeftLeg_59 = Enemy.model.getObjectByName("Bone020_Armature000");
    var RightUpLeg_65 = Enemy.model.getObjectByName("Bone015_Armature000");
    var RightLeg_64 = Enemy.model.getObjectByName("Bone018_Armature000");
    
    var LeftShoulder_28 = Enemy.model.getObjectByName("Bone003_Armature000");
    var LeftForeArm_26 = Enemy.model.getObjectByName("Bone006_Armature000");
    var RightShoulder_52 = Enemy.model.getObjectByName("Bone004_Armature000");
    var RightForeArm_50 = Enemy.model.getObjectByName("Bone011_Armature000");

    RightShoulder_52.rotation.z = Math.cos(Enemy.state * 3) * 0.3 + 1.52;
    RightForeArm_50.rotation.z = Math.cos(Enemy.state * 3) * 0.3 + 0.75;

    RightUpLeg_65.rotation.x = Math.cos(Enemy.state * 3 + 1.52) * 0.45 - 0.15;
    RightLeg_64.rotation.y = Math.cos(Enemy.state * 3) * 0.3 + 1.0;

    LeftShoulder_28.rotation.z = Math.cos(Enemy.state * 3 + 1.52) * 0.3 - 1.52;
    LeftForeArm_26.rotation.z = Math.cos(Enemy.state * 3 + 1.52) * 0.3 - 0.75;

    LeftUpLeg_60.rotation.x = Math.cos(Enemy.state * 3) * 0.45 - 0.15;
    LeftLeg_59.rotation.z = Math.cos(Enemy.state * 3 + 1.52) * 0.3 + 2.5;
    
/*
"Bone001_Armature000" mid petto

"Bone002_Armature000" neck
"Bone023_Armature000" head
"Bone024_Armature000" head top

"Bone003_Armature000" shoulder l
"Bone005_Armature000" shoulder l 2
"Bone006_Armature000" gomito l

"Bone007_Armature000" mano l
"Bone029_Armature000" mano l 2
"Bone028_Armature000" mano l 3
"Bone030_Armature000" mano l 4

"Bone008_Armature000" pollice l
"Bone009_Armature000" pollice l 2

"Bone004_Armature000" shoulder r
"Bone010_Armature000" shoulder r 2
"Bone011_Armature000" gomito r

"Bone012_Armature000" mano r
"Bone026_Armature000" mano r 2
"Bone025_Armature000" mano r 3
"Bone027_Armature000" mano r 4

"Bone013_Armature000" pollice r
"Bone014_Armature000" pollice r 2

"Bone015_Armature000" anca r
"Bone017_Armature000" anca r 2
"Bone018_Armature000" ginocchio r
"Bone022_Armature000" piede r

"Bone016_Armature000" anca l
"Bone019_Armature000" anca l 2
"Bone020_Armature000" ginocchio l
"Bone021_Armature000" piede l

               "head_018"
                    |
                "neck_00"
                    |
         __"shoulder_spine_08"__
        /           |            \
  "shoulder_L_09"   |     "shoulder_R_022"
        |           |            |
  "elbow_L_010"     |      "elbow_R_023"
        |    "Bone001_Armature000"    |
  "wrist_L_011"     |       wrist_R_024"
                    |
                    |
                    |
                    |
              "hip_spine_01"
            /                 \
       "hip_L_02"        "hip_R_035"
            |                 |
       "knee_L_03"       "knee_R_036"
            |                 |
       "ankle_L_04"      "ankle_R_037"
*/
}

export function PersonAnimation(Person) {
    Person.state += 0.01;

    var Hips_66 = Person.model.getObjectByName("Hips_66");
    Hips_66.rotation.x = 0.032;

    var LeftUpLeg_60 = Person.model.getObjectByName("LeftUpLeg_60");
    LeftUpLeg_60.rotation.x = -0.019;
    var LeftLeg_59 = Person.model.getObjectByName("LeftLeg_59");
    LeftLeg_59.rotation.x = -0.083;
    var RightUpLeg_65 = Person.model.getObjectByName("RightUpLeg_65");
    RightUpLeg_65.rotation.x= -0.019;
    var RightLeg_64 = Person.model.getObjectByName("RightLeg_64");
    RightLeg_64.rotation.x = -0.083;
    
    var Head_3 = Person.model.getObjectByName("Head_3");
    Head_3.rotation.y = 0.0; //-4.792;
    var Neck_4 = Person.model.getObjectByName("Neck_4");
    Neck_4.rotation.y = 0.0; //1.771;
    
    var LeftShoulder_28 = Person.model.getObjectByName("LeftShoulder_28");
    LeftShoulder_28.rotation.z = -1.579;
    var LeftForeArm_26 = Person.model.getObjectByName("LeftForeArm_26");
    LeftForeArm_26.rotation.z = 0.446;
    var RightShoulder_52 = Person.model.getObjectByName("RightShoulder_52");
    RightShoulder_52.rotation.z = 1.579;
    var RightForeArm_50 = Person.model.getObjectByName("RightForeArm_50");
    RightForeArm_50.rotation.z = -0.446;

    Person.state += 0.01;
    if(Person.up) {
        Hips_66.rotation.x = Math.cos(Person.state * 3 + 1.52) * 0.05 + 0.15;

        RightShoulder_52.rotation.z = Math.cos(Person.state * 3) * 0.3 + 1.52;
        RightForeArm_50.rotation.z = Math.cos(Person.state * 3) * 0.3 - 0.5;

        RightUpLeg_65.rotation.x = Math.cos(Person.state * 3 + 3.14) * 0.45 - 0.15;
        RightLeg_64.rotation.x = Math.cos(Person.state * 3) * 0.3 - 0.5;

        LeftShoulder_28.rotation.z = Math.cos(Person.state * 3) * 0.3 - 1.52;
        LeftForeArm_26.rotation.z = Math.cos(Person.state * 3) * 0.3 + 0.5;

        LeftUpLeg_60.rotation.x = Math.cos(Person.state * 3) * 0.45 - 0.15;
        LeftLeg_59.rotation.x = Math.cos(Person.state * 3 + 3.14) * 0.3 - 0.5;
    } else if(Person.down) {
        Hips_66.rotation.x = -Math.cos(Person.state * 3 + 1.52) * 0.05 - 0.05;

        RightShoulder_52.rotation.z = -Math.cos(Person.state * 3) * 0.3 + 1.52;
        RightForeArm_50.rotation.z = -Math.cos(Person.state * 3) * 0.3 - 0.5;

        RightUpLeg_65.rotation.x = -Math.cos(Person.state * 3 + 3.14) * 0.45 + 0.05;
        RightLeg_64.rotation.x = -Math.cos(Person.state * 3) * 0.3 - 0.5;

        LeftShoulder_28.rotation.z = -Math.cos(Person.state * 3) * 0.3 - 1.52;
        LeftForeArm_26.rotation.z = -Math.cos(Person.state * 3) * 0.3 + 0.5;

        LeftUpLeg_60.rotation.x = -Math.cos(Person.state * 3) * 0.45 + 0.05;
        LeftLeg_59.rotation.x = -Math.cos(Person.state * 3 + 3.14) * 0.3 - 0.5;
    } else if(Person.left) {
        RightShoulder_52.rotation.z = Math.cos(Person.state * 3) * 0.15 + 1.52;
        RightForeArm_50.rotation.z = Math.cos(Person.state * 3) * 0.15 - 0.25;

        RightUpLeg_65.rotation.x = Math.cos(Person.state * 3 + 3.14) * 0.25;
        RightLeg_64.rotation.x = Math.cos(Person.state * 3) * 0.15 - 0.25;

        LeftShoulder_28.rotation.z = Math.cos(Person.state * 3) * 0.15 - 1.52;
        LeftForeArm_26.rotation.z = Math.cos(Person.state * 3) * 0.15 + 0.25;

        LeftUpLeg_60.rotation.x = Math.cos(Person.state * 3) * 0.25;
        LeftLeg_59.rotation.x = Math.cos(Person.state * 3 + 3.14) * 0.15 - 0.25;
    } else if(Person.right) {
        RightShoulder_52.rotation.z = Math.cos(Person.state * 3) * 0.15 + 1.52;
        RightForeArm_50.rotation.z = Math.cos(Person.state * 3) * 0.15 - 0.25;

        RightUpLeg_65.rotation.x = Math.cos(Person.state * 3 + 3.14) * 0.25;
        RightLeg_64.rotation.x = Math.cos(Person.state * 3) * 0.15 - 0.25;

        LeftShoulder_28.rotation.z = Math.cos(Person.state * 3) * 0.15 - 1.52;
        LeftForeArm_26.rotation.z = Math.cos(Person.state * 3) * 0.15 + 0.25;

        LeftUpLeg_60.rotation.x = Math.cos(Person.state * 3) * 0.25;
        LeftLeg_59.rotation.x = Math.cos(Person.state * 3 + 3.14) * 0.15 - 0.25;
    } else {
        LeftShoulder_28.rotation.y = Math.cos(Person.state) * 0.1 - 0.25;
        RightShoulder_52.rotation.y = -Math.cos(Person.state) * 0.1 + 0.25;

        Head_3.rotation.y = -Math.cos(Person.state) * 0.05;
        Neck_4.rotation.y = -Math.cos(Person.state) * 0.05;
    }

/*
                 "Head_3"
                    |
           ___ __"Neck_4"__ ___
        /           |            \
  "LeftShoulder_28" |   "RightShoulder_52"
        |           |            |
    "LeftArm_27"    |      "RightArm_51"
        |           |            |
    "LeftForeArm_26"|    "RightForeArm_50"
        |           |            |
    "LeftHand_25"   |    "RightHand_49"
                    |
                    |
                 "Hips_66"
            /                 \
        "LeftUpLeg_60"  "RightUpLeg_65"
            |                 |
        "LeftLeg_59"    "RightLeg_64"
            |                 |
        "LeftFoot_58"  "RightFoot_63"
*/
}

