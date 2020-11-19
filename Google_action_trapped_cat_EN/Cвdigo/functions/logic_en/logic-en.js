// We import the rooms
const room_en = require('./room-en')
const corridor_en = require('./corridor-en')
const washing_room_en = require('./washing-room-en')
const bathroom_en = require('./bathroom-en')
const courtyard_en = require('./courtyard-en')
const living_room_en = require('./living-room-en')
const basement_en = require('./basement-en')
const kitchen_en = require('./kitchen-en')
const secret_room_en = require('./secret-room-en')
const hall_en = require('./hall-en')

// Room
let room = '';

// Inventory of the player
let inventory = [];

// Player
let points = 0;
let name = '';

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

// Array with usable objects by themselves
let usableObjects = [];

// Boolean to know if it is the first time the telephone is used
let firstUseTelephone;

module.exports = {
    // Initialize when launching the game, so if you ask for your location or your name, it doesn't know
    launch(){
        name = '';
        room = '';
        points = 0;
        inventory = [];
    },
    initialize(conv){
        // Initialize all the rooms
        room_en.initialize(conv);
        corridor_en.initialize(conv);
        washing_room_en.initialize(conv);
        bathroom_en.initialize(conv);
        courtyard_en.initialize(conv);
        living_room_en.initialize(conv);
        basement_en.initialize(conv);
        kitchen_en.initialize(conv);
        secret_room_en.initialize(conv);
        hall_en.initialize(conv);
        
        // Inventory of the player
        inventory = [];
        conv.inventory = inventory;
        
        // Array with usable objects by themselves
        usableObjects = [];
        conv.usableObjects = usableObjects;
        
        // Player
        points = 0;
        conv.points = points;
        name = '';
        dead = false;
        conv.dead = dead;
        
        // Boolean to know if the game is over
        finished = false;
        conv.finished = finished;
        
        // Room
        room = room_en.getRoom();
        conv.room = room;

        // Boolean to know if the telephone has already been used
        firstUseTelephone = true;
        conv.firstUseTelephone = firstUseTelephone;
    },
    continueGame(conv){
        // Initialize all the rooms
        room_en.continueGame(conv);
        corridor_en.continueGame(conv);
        washing_room_en.continueGame(conv);
        bathroom_en.continueGame(conv);
        courtyard_en.continueGame(conv);
        living_room_en.continueGame(conv);
        basement_en.continueGame(conv);
        kitchen_en.continueGame(conv);
        secret_room_en.continueGame(conv);
        hall_en.continueGame(conv);
        
        // Inventory of the player
        inventory = conv.inventory;
        
        // Array with usable objects by themselves
        usableObjects = conv.usableObjects;
        
        // Player
        points = conv.points;
        name = conv.name;
        dead = conv.dead;
        
        // Boolean to know if the game is over
        finished = conv.finished;
        
        // Room
        room = conv.room;

        // Boolean to know if the telephone has already been used
        firstUseTelephone = conv.firstUseTelephone;
    },
    setName(n, conv){
      name = n;  
      conv.name = name;
    },
    getName(){
        return name;  
    },
    getPoints(){
        let speechText = 'You have ' + points + ' points';
        if(points === 0){
            speechText = "You still don't have points";
        }
        return speechText;  
    },
    look(orientation){
        let speechText = "You can't look at anything because you are not at any room.";
        if(room === room_en.getRoom()){
            speechText = room_en.look(orientation);
        }else if(room === corridor_en.getRoom()){
            speechText = corridor_en.look(orientation);
        }else if(room === washing_room_en.getRoom()){
            speechText = washing_room_en.look(orientation);
        }else if(room === bathroom_en.getRoom()){
            speechText = bathroom_en.look(orientation);
        }else if(room === courtyard_en.getRoom()){
            speechText = courtyard_en.look(orientation);
        }else if(room === living_room_en.getRoom()){
            speechText = living_room_en.look(orientation);
        }else if(room === basement_en.getRoom()){
            speechText = basement_en.look(orientation);
        }else if(room === kitchen_en.getRoom()){
            speechText = kitchen_en.look(orientation);
        }else if(room === secret_room_en.getRoom()){
            speechText = secret_room_en.look(orientation);
        }else if(room === hall_en.getRoom()){
            speechText = hall_en.look(orientation);
        }
        return speechText;                                                                                                                                                                                                                   return speechText ; 
    },
    interaction(object, conv){
        let speechText = "There's nothing interesting about that. Tell me what you want to do now. ";
        if(room === room_en.getRoom()){
            let value = room_en.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === corridor_en.getRoom()){
            let value = corridor_en.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === washing_room_en.getRoom()){
            if(object === 'telephone' && firstUseTelephone){
                inventory.push('paper');
                firstUseTelephone = false;
                usableObjects.push('paper');
                conv.firstUseTelephone = firstUseTelephone;
                conv.usableObjects = usableObjects;
                conv.inventory = inventory;
            }
            let dryer = corridor_en.getSwitch();
            let value = washing_room_en.interaction(object, dryer, conv);
            points += value.points;
            speechText = value.speechText;
            room = value.room;
            conv.room = room;
        }else if(room === bathroom_en.getRoom()){
            let value = bathroom_en.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === courtyard_en.getRoom()){
            let value = courtyard_en.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === living_room_en.getRoom()){
            let value = living_room_en.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === basement_en.getRoom()){
            let value = basement_en.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === kitchen_en.getRoom()){
            let lintern = false;
            if(usableObjects.indexOf('flashlight') !== -1 && inventory.indexOf('flashlight') !== -1){
                lintern = true;
            }
            let value = kitchen_en.interaction(object, lintern, conv);
            room = value.room;
            conv.room = room;
            speechText = value.speechText;
        }else if(room === secret_room_en.getRoom()){
            let value = secret_room_en.interaction(object, conv);
            speechText = value.speechText;
            points += value.points;
        }else if(room === hall_en.getRoom()){
            let value = hall_en.interaction(object, conv);
            speechText = value.speechText;
            points += value.points;
        }
        conv.points = points;
        return speechText;
    },
    interactionObjects(object){
        let speechText = '';
        if(room === room_en.getRoom()){
            speechText = room_en.interactionObjects(object);
        }else if(room === corridor_en.getRoom()){
            speechText = corridor_en.interactionObjects(object);
        }else if(room === washing_room_en.getRoom()){
            speechText = washing_room_en.interactionObjects(object);
        }else if(room === bathroom_en.getRoom()){
            speechText = bathroom_en.interactionObjects(object);
        }else if(room === courtyard_en.getRoom()){
            speechText = courtyard_en.interactionObjects(object);
        }else if(room === living_room_en.getRoom()){
            speechText = living_room_en.interactionObjects(object);
        }else if(room === basement_en.getRoom()){
            speechText = basement_en.interactionObjects(object);
        }else if(room === kitchen_en.getRoom()){
            speechText = kitchen_en.interactionObjects(object);
        }else if(room === secret_room_en.getRoom()){
            speechText = secret_room_en.interactionObjects(object);
        }else if(room === hall_en.getRoom()){
            speechText = hall_en.interactionObjects(object);
        }
        return speechText;
    },
    inventory(){
        let speechText = ''
        if(inventory.length === 0){
            speechText = 'You have nothing in the inventory.'
        }else{
            speechText = 'In the inventory you have: ' + inventory;
        }
        return speechText;
    },
    take(item, conv){
        let speechText = "You can't take " + item + '. Tell me what you want to do now.  ';
        let success = false;
        
        if(room === room_en.getRoom()){
            let value = room_en.take(item, conv);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
        }else if(room === corridor_en.getRoom()){
            let value = corridor_en.take(item, conv);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
            if(item === 'letter'){
                usableObjects.push('letter');
                conv.usableObjects = usableObjects;
            }
        }else if(room === washing_room_en.getRoom()){
            let value = washing_room_en.take(item, conv);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
        }else if(room === bathroom_en.getRoom()){
            let value = bathroom_en.take(item, conv);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
            if(item === 'toilet paper'){
                usableObjects.push('toilet paper');
            }else if(item === 'rubbing alcohol'){
                usableObjects.push('rubbing alcohol');
            }
            conv.usableObjects = usableObjects;
        }else if(room === courtyard_en.getRoom()){
            let value = courtyard_en.take(item, conv);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
            if(item === 'player'){
                usableObjects.push('player');
                conv.usableObjects = usableObjects;
            }
        }else if(room === living_room_en.getRoom()){
            let value = living_room_en.take(item, conv);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
            if(item === 'photo'){
                usableObjects.push('photo');
                conv.usableObjects = usableObjects;
            }
        }else if(room === basement_en.getRoom()){
            let value = basement_en.take(item, conv);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
        }else if(room === kitchen_en.getRoom()){
            let value = kitchen_en.take(item, conv)
            speechText = value.speechText;
            success = value.success;
            points += value.points;
            if(item === 'note'){
                usableObjects.push('note');
                conv.usableObjects = usableObjects;
            }
        }else if(room === secret_room_en.getRoom()){
            let value = secret_room_en.take(item, conv);
            speechText = value.speechText;
            success = value.success;
        }else if(room === hall_en.getRoom()){
            let value = hall_en.take(item, conv);
            speechText = value.speechText;
            success = value.success;
            points += value.points;
        }
        if(success){
            inventory.push(item);
            conv.inventory = inventory;
        }

        if(room !== corridor_en.getRoom() && room !== ''){
            speechText += ' Tell me what you want to do now.  ';
        }
        conv.points = points;
        return speechText;
    },
    release(item, conv){
        let speechText = "You can't drop " + item;
        
        if(inventory.indexOf(item) !== -1){
            if(room === room_en.getRoom()){
                speechText = room_en.release(item, conv);
            }else if(room === corridor_en.getRoom()){
                speechText = corridor_en.release(item, conv);
            }else if(room === washing_room_en.getRoom()){
                speechText = washing_room_en.release(item, conv);
            }else if(room === bathroom_en.getRoom()){
                speechText = bathroom_en.release(item, conv);
            }else if(room === courtyard_en.getRoom()){
                speechText = courtyard_en.release(item, conv);
            }else if(room === living_room_en.getRoom()){
                speechText = living_room_en.release(item, conv);
            }else if(room === basement_en.getRoom()){
                speechText = basement_en.release(item, conv);
            }else if(room === kitchen_en.getRoom()){
                speechText = kitchen_en.release(item, conv);
            }else if(room === secret_room_en.getRoom()){
                speechText = secret_room_en.release(item, conv);
            }else if(room === hall_en.getRoom()){
                speechText = hall_en.release(item, conv);
            }
            let index = inventory.indexOf(item);
            inventory.splice(index,1);
            conv.inventory = inventory;
        }
        return speechText;
    },
    use(object, element, conv){
        let speakOutput = "You can't do that. To use an object you need to have it in the inventory. Tell me what you want to do now. ";
        
        if(inventory.indexOf(object) !== -1){
            if(room === room_en.getRoom()){
                let value = room_en.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                dead = value.dead;
            }else if(room === washing_room_en.getRoom()){
                let value = washing_room_en.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === bathroom_en.getRoom()){
                let value = bathroom_en.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === living_room_en.getRoom()){
                let value = living_room_en.use(object, element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === basement_en.getRoom()){
                let value = basement_en.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                let four = value.fourObjects;
                if(finished){
                    if(four){
                        speakOutput += ' <audio src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"/> What happened? You open your eyes and you are in your room, in your bed. '
                        + ' Everything seems normal. ';
                        if(inventory.indexOf('cat') !== -1){
                            speakOutput += " <audio src='https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg'/> Oh! The kitty is on top of you. One moment... You don't have any pets. Was this a dream or was it real? You pet the cat. Anyway, you are happy to have it. "
                        }else{
                            speakOutput += ' You remember a cat... But there is no cat around you. Was everything a dream? '
                        }
                    }else{
                        if(inventory.indexOf('cat') === -1){
                            speakOutput += "You are sad because you left the kitty there. "
                        }else{
                            speakOutput +=  "You succeed! You adopted a cat and you are free. You can't be happier! "
                        }
                    }
                }
            }else if(room === secret_room_en.getRoom()){
                let value = secret_room_en.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === hall_en.getRoom()){
                let value = hall_en.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                if(finished){
                    if(inventory.indexOf('cat') === -1){
                        speakOutput += ' You are sad because you left the kitty there. Moreover, you have become a ghost. '
                    }else{
                        speakOutput += "You succeed! You adopted a ghost cat and you are free. You can't be happier! The fact that you are dead is just a side effect. " 
                    }
                }else{
                    speakOutput += ' Tell me what you want to do now. ';
                }
            }
        }
        if(dead){
            speakOutput = speakOutput + " Oh! You're dead!";
        }
        if(finished){
            speakOutput = speakOutput + ' You got ' 
            + points + ' points, ' + name + '</speak>';
        }
        
        conv.points = points;
        conv.dead = dead;
        conv.finished = finished;
        
        return {
            speakOutput: speakOutput,
            dead: dead,
            finished: finished
        }
    },
    useObject(object, conv){
        let speakOutput = "You can't do that. To use an object you need to have it in the inventory. ";
        let read = false;

        if(inventory.indexOf(object) !== -1 && usableObjects.indexOf(object) !== -1){
            if(object === 'flashlight'){
                if(usableObjects.indexOf('flashlight') !== -1){
                    if(room === corridor_en.getRoom()){
                        let value = corridor_en.useObject(conv);
                        points += value.points;
                        speakOutput = value.speakOutput;
                    }else{
                        speakOutput = "Now you don't need the flashlight. ";
                    }
                }else{
                    speakOutput = "The flashlight doesn't have batteries.";    
                }
            }
            if(object === 'letter'){
                speakOutput = '<speak> You read again the letter: '
                 + " I've been watching you for a while. I'm testing you with a series of challenges. "
                + "I want to know if you're able to succeed in order to entrust you with a mission. "
                + "Keep going to discover what's all of this about. I only can say that I trust you to become the container I drink from. "
                + 'Signed: <say-as interpret-as="characters">E</say-as>. '
                + '<say-as interpret-as="characters">C</say-as>. '
                + '<say-as interpret-as="characters">B</say-as>. '
                + '<say-as interpret-as="characters">I</say-as>. ';
                read = true;
            }
            if(object === 'toilet paper'){
                speakOutput = ' You read the symbols that are written in the toilet paper. '
                + "A tree, a cloud, a bonfire and a river."
            }
            if(object === 'photo'){
                speakOutput =  " It's a photo of a really cute white cat. There is a text behind: "
                    + " I like to chase and catch everything that is moving. "
                    + 'Will you give me that chance?';
            }
            if(object === 'rubbing alcohol'){
                speakOutput = "It's not the time to use the rubbing alcohol.";
                if(room === basement_en.getRoom()){
                    let value = basement_en.useObject(conv);
                    speakOutput = value.speakOutput;
                    dead = value.dead;
                    points += value.points;
                }
            }
            if(object === 'note'){
                speakOutput = "You read the note. You can see a word written: meow. Below it says buy tuna, but it's crossed out.";
            }
            if(object === 'paper'){
                speakOutput = 'You read the paper where you wrote what you listened through the telephone: '
                + " I'm really hungry. You better rush. ";
            }
            if(object === 'player'){
                speakOutput = ' You take the mp3 player and start to listen to it again. '
                + " Go into the unknown. Don't forget the threads that interweave and form a whole. ";
            }   
        }
        if(dead){
            speakOutput = speakOutput + "Oh! You're dead!"
            + ' You got ' 
            + points + ' points, ' + name;
        }
        
        conv.points = points;
        conv.dead = dead;
        
        return {
            speak: speakOutput,
            faint : dead,
            read: read
        }
    },
    combine(object, object2, conv){
        let speakOutput = "You can't do that. Remember that you need to have an object inside the inventory in order to use it.";
        
        if(inventory.indexOf(object) !== -1 && inventory.indexOf(object2) !== -1){
            if((object === 'flashlight' && object2 === 'batteries') || (object2 === 'flashlight' && object === 'batteries')){
                speakOutput = "You combined the lantern and the batteries. Now it will work if it's necessary. ";
                usableObjects.push('flashlight');
                conv.usableObjects = usableObjects;
                let index = inventory.indexOf('batteries');
                inventory.splice(index,1);
                conv.inventory = inventory;
                points += 10;
                conv.points = points;
            }
        }
        return speakOutput;
    },
    numberCode(number, conv){
        let speakOutput = "You can't do that now. Tell me what you want to do next. ";
        
        if(room === corridor_en.getRoom()){
            let value = corridor_en.numberCode(number, conv);
            points += value.points;
            speakOutput = value.speakOutput;
        }else if(room === living_room_en.getRoom()){
            let value = living_room_en.numberCode(number, conv);
            points += value.points;
            speakOutput = value.speakOutput;
        }
        conv.points = points;
        return speakOutput;
    },
    pushSymbol(symbol, symbol2, symbol3, symbol4, conv){
        let speakOutput = " Now it's not the time to do that. Tell me what you want to do now. ";
        if(room === courtyard_en.getRoom()){
            let value = courtyard_en.pushSymbol(symbol, symbol2, symbol3, symbol4, conv);
            points += value.points;
            speakOutput = value.speakOutput;
        }
        conv.points = points;
        return speakOutput;
    },
    read(author){
        let speakOutput = " Now it's not the time to do that. ";
        if(room === living_room_en.getRoom()){
            speakOutput = living_room_en.read(author);
        }
        return speakOutput;
    },
    giveCats(element1, element2, element3, element4, conv){
        let speakOutput = " Now it's not the time to do that. Tell me what you want to do now. ";
        let success = false;
        
        if(room === basement_en.getRoom()){
            if(inventory.indexOf('bowl') !== -1 && inventory.indexOf('cat food') !== -1 && inventory.indexOf('ball of wool') !== -1 && inventory.indexOf('toy mouse') !== -1){
                let value = basement_en.giveCats(element1, element2, element3, element4, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                success = value.success;
            }else{
                speakOutput = 'You need to have the objects inside the inventory to give them to the cat. Tell me what you want to do now. ';
            }
        }
        
        if(success){
            let index = inventory.indexOf('bowl');
            inventory.splice(index,1);
            index = inventory.indexOf('cat food');
            inventory.splice(index,1);
            index = inventory.indexOf('ball of wool');
            inventory.splice(index,1);
            index = inventory.indexOf('toy mouse');
            inventory.splice(index,1); 
            conv.inventory = inventory;
        }
        conv.points = points;

        return speakOutput;
    },
    giveCats2(element1, element2, element3, conv){
        let speakOutput =  " Now it's not the time to do that. Tell me what you want to do now. ";
        let success = false;
        
        if(room === basement_en.getRoom()){
            if(inventory.indexOf(element1) !== -1 && inventory.indexOf(element2) !== -1 && inventory.indexOf(element3) !== -1){
                let value = basement_en.giveCats2(element1, element2, element3, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                success = value.success;
            }else{
                speakOutput = 'You need to have the objects inside the inventory to give them to the cat. Tell me what you want to do now. ';
            }
        }
        
        if(success){
            let index = inventory.indexOf(element1);
            inventory.splice(index,1);
            index = inventory.indexOf(element2);
            inventory.splice(index,1);
            index = inventory.indexOf(element3);
            inventory.splice(index,1);
            conv.inventory = inventory;
        }
        conv.points = points;

        return speakOutput;
    },
    giveCats3(element1, element2, conv){
        let speakOutput = " Now it's not the time to do that. Tell me what you want to do now. ";
        
        if(room === basement_en.getRoom()){
            if(inventory.indexOf(element1) !== -1 && inventory.indexOf(element2) !== -1){
                let value = basement_en.giveCats3(element1, element2, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else{
                speakOutput = 'You need to have the objects inside the inventory to give them to the cat. Tell me what you want to do now. ';
            }
        }
        conv.points = points;
      
        return speakOutput;
    },
    giveCats4(element1, conv){
        let speakOutput = " Now it's not the time to do that. Tell me what you want to do next. ";
        let dead = false;
        
        if(room === basement_en.getRoom()){
            if(inventory.indexOf(element1) !== -1){
                let value = basement_en.giveCats4(element1);
                points += value.points;
                speakOutput = value.speakOutput;
                dead = value.dead;
            }else{
                speakOutput = 'You need to have the object inside the inventory to give them to the cat. Tell me what you want to do now. ';
            }
        }
        
        if(dead){
            speakOutput = speakOutput + "Oh! You're dead"
            + ' You got ' 
            + points + ' points, ' + name;
            finished = true;
        }
        conv.dead = dead;
        conv.points = points;
        conv.finished = finished;
        
        return {
            speakOutput: speakOutput,
            dead: dead
        }
    },
    go(place, conv){
        let speechText = "You can't go there. Tell me what you want to do now. ";
        let r = '';
        
        if(room !== place){
            if(room === room_en.getRoom()){
                let value = room_en.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === corridor_en.getRoom()){
                let value = corridor_en.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === washing_room_en.getRoom()){
                let value = washing_room_en.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === bathroom_en.getRoom()){
                let value = bathroom_en.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === courtyard_en.getRoom()){
                let value = courtyard_en.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === living_room_en.getRoom()){
                let value = living_room_en.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === basement_en.getRoom()){
                let value = basement_en.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === kitchen_en.getRoom()){
                r = kitchen_en.getRoom();
            }else if(room === secret_room_en.getRoom()){
                let value = secret_room_en.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === hall_en.getRoom()){
                let value = hall_en.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }
        }else{
            speechText = 'You are already there. Tell me what you want to do now. ';
            r = room;
        }
        
        conv.room = r;
        
        if(r === 'corridor'){
            if(room !== r){
                corridor_en.setLight(false, conv);
            }
        }else if(r === 'washing room'){
            if(room === 'corridor'){
                speechText += washing_room_en.getEnterSpeak(conv);
            }
        }

        if(room !== 'corridor' && room !== ''){
            speechText += ' Tell me what you want to do now.  ';
        }
        room = r;
        
        return speechText;
    },
    where(){
        let speakOutput = "You haven't started the game yet.";
        if (room !== ''){
            speakOutput = 'You are in ' + room + '. ';
        }
        return speakOutput;
    },
    clue(conv){
        let speakOutput = "I can't give you a clue because you are not at any room.";
        
        if(room === room_en.getRoom()){
            speakOutput = room_en.clue();
        }else if(room === corridor_en.getRoom()){
            speakOutput = corridor_en.clue();
        }else if(room === washing_room_en.getRoom()){
            speakOutput = washing_room_en.clue();
        }else if(room === bathroom_en.getRoom()){
            speakOutput = bathroom_en.clue();
        }else if(room === courtyard_en.getRoom()){
            speakOutput = courtyard_en.clue();
        }else if(room === living_room_en.getRoom()){
            speakOutput = living_room_en.clue();
        }else if(room === basement_en.getRoom()){
            speakOutput = basement_en.clue();
        }else if(room === kitchen_en.getRoom()){
            speakOutput = kitchen_en.clue();
        }else if(room === secret_room_en.getRoom()){
            speakOutput = secret_room_en.clue();
        }else if(room === hall_en.getRoom()){
            speakOutput = hall_en.clue();
        }
        points -= 10;
        conv.points = points;
        return speakOutput;
    },
    choose(option, conv){
        let speakOutput = " Now it's not the time to do that. Tell me what you want to do now. ";
        if(room === room_en.getRoom()){
            let value = room_en.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
           
        }else if(room === washing_room_en.getRoom()){
            let dryer = corridor_en.getSwitch();
            let value = washing_room_en.choose(option, dryer, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === courtyard_en.getRoom()){
            let value = courtyard_en.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === living_room_en.getRoom()){
            let value = living_room_en.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === hall_en.getRoom()){
            let value = hall_en.choose(option, conv);
            speakOutput = value.speakOutput;
            points += value.points;
            finished = value.finished;
            if(finished){
                speakOutput = speakOutput + ' You got ' 
                + points + ' points, ' + name;
            }
        }
        conv.points = points;
        conv.finished = finished;
        return {
            speakOutput: speakOutput,
            finished: finished
        }
    },
    chooseObject(option, object, conv){
        let speakOutput = " Now it's not the time to do that or you can't. Tell me what you want to do now. ";
        if(room === room_en.getRoom() && object === 'cat food'){
            let value = room_en.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === washing_room_en.getRoom() && object === 'ball of wool'){
            let dryer = corridor_en.getSwitch();
            let value = washing_room_en.choose(option, dryer, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === courtyard_en.getRoom() && object === 'toy mouse'){
            let value = courtyard_en.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === living_room_en.getRoom() && object === 'bowl'){
            let value = living_room_en.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === hall_en.getRoom() && object === 'poison'){
            let value = hall_en.choose(option, conv);
            speakOutput = value.speakOutput;
            points += value.points;
            finished = value.finished;
            if(finished){
                speakOutput = speakOutput + ' You got ' 
                + points + ' points, ' + name;
            }
        }
        conv.points = points;
        conv.finished = finished;
        return {
            speakOutput: speakOutput,
            finished: finished
        }
    }
}