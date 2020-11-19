// We import the room
const room_en = require('./room-en')

// Room
let room = '';

// Inventory of the player
let inventory = [];

// Player
let points = '';
let name = '';

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

module.exports = {
    initialize(){
        room_en.initialize();
        
        // Inventory of the player
        inventory = [];
        
        // Player
        points = 0;
        name = '';
        dead = false;
        
        // Boolean to know if the game is over
        finished = false;
        
        room = room_en.getRoom();
    },
    setName(n){
      name = n;  
    },
    getName(){
        return name;  
    },
    getPoints(){
        let speechText = 'You have ' + points + ' points';
        if(points === ''){
            speechText = "You still don't have points";
        }
        return speechText;  
    },
    look(orientation){
        let speechText = "You can't look at anything because you are not at any room.";
        if(room === room_en.getRoom()){
            speechText = room_en.look(orientation);
        }
        return speechText;                                                                                                                                                                                                                             return speechText ; 
    },
    interaction(object){
        let speechText = "There's nothing interesting about it";
        if(room === room_en.getRoom()){
            speechText = room_en.interaction(object).speechText;
            points += room_en.interaction(object).points;
        }
        return speechText;
    },
    inventory(){
        let speechText = ''
        if(inventory.length === 0){
            speechText = 'You have nothing inside the inventory.'
        }else{
            speechText = 'Inside the inventory you have: ' + inventory;
        }
        return speechText;
    },
    take(item){
        let speechText = "You can't take " + item;
        
        if(room === room_en.getRoom()){
            speechText = room_en.take(item).speechText;
            inventory.push(item);
            points += room_en.take(item).points;
        }
        return speechText;
    },
    release(item){
        let speechText = "You can't release " + item;
        
        if(inventory.indexOf(item) !== -1){
            if(room === room_en.getRoom()){
                speechText = room_en.release(item);
            }
            let index = inventory.indexOf(item)
            inventory.splice(index,1)
        }
        return speechText;
    },
    use(object, element){
        let speakOutput = "You can't do that. Remember that you need to have an object inside the inventory in order to use it.";
        
        if(inventory.indexOf(object) !== -1){
            if(room === room_en.getRoom()){
                speakOutput = room_en.use(object,element).speakOutput;
                finished = room_en.use(object,element).finished;
                dead = room_en.use(object,element).dead;
                points += room_en.use(object,element).points;
            }
        }
        if(dead){
            speakOutput = speakOutput + " Oh, oh! You're dead!";
        }
        if(finished){
            speakOutput = speakOutput + ' Your score was '
            + points + ' points, ' + name + '</speak>';
        }
        
        return {
            speakOutput: speakOutput,
            dead: dead,
            finished: finished
        }
    },
    where(){
        let speakOutput = "You haven't started the game yet.";
        if (room !== ''){
            speakOutput = 'You are in ' + room;
        }
        return speakOutput;
    },
    clue(){
        let speakOutput = "I can't give you a clue because you are not at any room."
        
        if(room === room_en.getRoom()){
            speakOutput = room_en.clue();
        }
        points -= 10;
        return speakOutput;
    },
    choose(option){
        let speakOutput = "It's not the time for that.";
        if(room === room_en.getRoom()){
            let take = false;
            speakOutput = room_en.choose(option).speakOutput;
            points += room_en.choose(option).points;
            take = room_en.choose(option).take;
            if(take){
                speakOutput = this.take('cat food');
            }
        }
        return speakOutput;
    }
}