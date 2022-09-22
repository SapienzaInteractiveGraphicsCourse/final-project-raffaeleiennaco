import {difficultyEnum, mapEnum, stateEnum} from './EnumModule.js';

export class GameSetting{
    _min_dayTime = 6;
    _max_dayTime = 20;
    _dayTime = 12;

    _min_volume = 0;
    _max_volume = 10;
    _volume = 10;

    constructor(){
        this._difficulty = difficultyEnum.Easy;
        this._map = mapEnum.Plain;
        this._state = stateEnum.Menu;
        this._first_person = false;
    }

    setValuesFromJSON(JSONstring){
        this.setDifficulty(JSONstring._difficulty);
        this.setMap(JSONstring._map);
        this.setDayTime(JSONstring._dayTime);
        this.setVolume(JSONstring._volume);
        this.setState(JSONstring._state);
        this.setFirstPerson(JSONstring._first_person);
    }

    setDifficulty(difficulty){
        if (difficulty in difficultyEnum){
            this._difficulty = difficulty;
        } else {
            throw TypeError("Wrong type of difficulty");
        }
    }
    setMap(map){
        if (map in mapEnum){
            this._map = map;
        } else {
            throw TypeError("Wrong type of map");
        }
    }
    setDayTime(dayTime){
        if ( this._min_dayTime <= dayTime &&
                dayTime <= this._max_dayTime ){
            this._dayTime = dayTime;
        } else {
            throw TypeError("Wrong value of day-time");
        }
    }
    setVolume(volume){
        if ( this._min_volume <= volume &&
                volume <= this._max_volume ){
            this._volume = volume;
        } else {
            throw TypeError("Wrong value of volume");
        }
    }
    setState(state){
        if (state in stateEnum){
            this._state = state;
        } else {
            throw TypeError("Wrong type of state");
        }
    }

    setFirstPerson(first_person){
        this._first_person = first_person;
    }
    invertFirstPerson(){
        this._first_person = !this._first_person;
    }

    getDifficulyEnumerator(){
        return difficultyEnum;
    }
    getMapEnumerator(){
        return mapEnum;
    }
    getStateEnumerator(){
        return stateEnum;
    }

    getDifficulty(){
        return this._difficulty;
    }
    getMap(){
        return this._map;
    }
    getDayTime(){
        return this._dayTime;
    }
    getVolume(){
        return this._volume;
    }
    getState(){
        return this._state;
    }

    isFirstPerson(){
        return this._first_person;
    }

    print(){
        return "Difficulty: " + this._difficulty + "\n" +
               "Map: " + this._map + "\n" +
               "Day Time: " + this._dayTime + "\n" +
               "Volume: " + this._volume + "\n" +
               "Is First Person: " + this._first_person + "\n"
    }
}