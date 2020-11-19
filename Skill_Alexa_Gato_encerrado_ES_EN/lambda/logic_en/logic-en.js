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
    initialize(sessionAttributes){
        // Initialize all the rooms
        room_en.initialize(sessionAttributes);
        corridor_en.initialize(sessionAttributes);
        washing_room_en.initialize(sessionAttributes);
        bathroom_en.initialize(sessionAttributes);
        courtyard_en.initialize(sessionAttributes);
        living_room_en.initialize(sessionAttributes);
        basement_en.initialize(sessionAttributes);
        kitchen_en.initialize(sessionAttributes);
        secret_room_en.initialize(sessionAttributes);
        hall_en.initialize(sessionAttributes);
        
        // Inventory of the player
        inventory = [];
        sessionAttributes['inventoryEn'] = inventory;
        
        // Array with usable objects by themselves
        usableObjects = [];
        sessionAttributes['usableObjectsEn'] = usableObjects;
        
        // Player
        points = 0;
        sessionAttributes['pointsEn'] = points;
        name = '';
        dead = false;
        sessionAttributes['deadEn'] = dead;
        
        // Boolean to know if the game is over
        finished = false;
        sessionAttributes['finishedEn'] = finished;
        
        // Room
        room = room_en.getRoom();
        sessionAttributes['roomEn'] = room;
        
        // Boolean to know if the telephone has already been used
        firstUseTelephone = true;
        sessionAttributes['firstUseTelephoneEn'] = firstUseTelephone;
    },
    continueGame(sessionAttributes){
        // Initialize all the rooms
        room_en.continueGame(sessionAttributes);
        corridor_en.continueGame(sessionAttributes);
        washing_room_en.continueGame(sessionAttributes);
        bathroom_en.continueGame(sessionAttributes);
        courtyard_en.continueGame(sessionAttributes);
        living_room_en.continueGame(sessionAttributes);
        basement_en.continueGame(sessionAttributes);
        kitchen_en.continueGame(sessionAttributes);
        secret_room_en.continueGame(sessionAttributes);
        hall_en.continueGame(sessionAttributes);
        
        // Inventory of the player
        inventory = sessionAttributes['inventoryEn'];
        
        // Array with usable objects by themselves
        usableObjects = sessionAttributes['usableObjectsEn'];
        
        // Player
        points = sessionAttributes['pointsEn'];
        name = sessionAttributes['nameEn'];
        dead = sessionAttributes['deadEn'];
        
        // Boolean to know if the game is over
        finished = sessionAttributes['finishedEn'];
        
        // Room
        room = sessionAttributes['roomEn'];
        
        // Boolean to know if the telephone has already been used
        firstUseTelephone = sessionAttributes['firstUseTelephoneEn'];
        
        // Image associated to the room
        let url = this.getUrl(room);
        
        return url;
    },
    // Gets the image of the corresponding room
    getUrl(room){
        let url = '';
        if(room === 'bedroom'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/bedroom.jpg";
        }else if(room === 'corridor'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/corridor.jpg";
        }else if(room === 'washing room'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/washing.png"
        }else if(room === 'kitchen'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/kitchen.jpg";
        }else if(room === 'secret room'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/secret.jpg";
        }else if(room === 'hall'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/hall.png";
        }else if(room === 'courtyard'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/courtyard.png";
        }else if(room === 'bathroom'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/bath.png";
        }else if(room === 'living room'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/living.jpg";
        }else if(room === 'basement'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/basement.jpg";
        } 
        return url;
    },
    setName(n, sessionAttributes){
      name = n;  
      sessionAttributes['nameEn'] = name;
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
        let url = '';
        if(room === room_en.getRoom()){
            let value = room_en.look(orientation);
            speechText = value.speechText;
            url = value.url;
        }else if(room === corridor_en.getRoom()){
            let value = corridor_en.look(orientation);
            speechText = value.speechText;
            url = value.url;
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
        return {
            speechText: speechText,
            url: url
        }
    },
    interaction(object, sessionAttributes){
        let speechText = "There's nothing interesting about that.";
        let url = '';
        if(room === room_en.getRoom()){
            let value = room_en.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === corridor_en.getRoom()){
            let value = corridor_en.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === washing_room_en.getRoom()){
            if(object === 'telephone' && firstUseTelephone){
                inventory.push('paper');
                firstUseTelephone = false;
                usableObjects.push('paper');
                sessionAttributes['firstUseTelephoneEn'] = firstUseTelephone;
                sessionAttributes['usableObjectsEn'] = usableObjects;
                sessionAttributes['inventoryEn'] = inventory;
            }
            let dryer = corridor_en.getSwitch();
            let value = washing_room_en.interaction(object, dryer, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            room = value.room;
            sessionAttributes['roomEn'] = room;
            url = value.url;
        }else if(room === bathroom_en.getRoom()){
            let value = bathroom_en.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === courtyard_en.getRoom()){
            let value = courtyard_en.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === living_room_en.getRoom()){
            let value = living_room_en.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === basement_en.getRoom()){
            let value = basement_en.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === kitchen_en.getRoom()){
            let lintern = false;
            if(usableObjects.indexOf('flashlight') !== -1 && inventory.indexOf('flashlight') !== -1){
                lintern = true;
            }
            let value = kitchen_en.interaction(object, lintern, sessionAttributes);
            room = value.room;
            sessionAttributes['roomEn'] = room;
            url = value.url;
            speechText = value.speechText;
        }else if(room === secret_room_en.getRoom()){
            let value = secret_room_en.interaction(object, sessionAttributes);
            speechText = value.speechText;
            points += value.points;
        }else if(room === hall_en.getRoom()){
            let value = hall_en.interaction(object, sessionAttributes);
            speechText = value.speechText;
            points += value.points;
        }
        sessionAttributes['pointsEn'] = points;
        return {
            speechText: speechText,
            url: url
        }
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
    take(item, sessionAttributes){
        let speechText = "You can't take " + item;
        let success = false;
        
        if(room === room_en.getRoom()){
            let value = room_en.take(item, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
        }else if(room === corridor_en.getRoom()){
            let value = corridor_en.take(item, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
            if(item === 'letter'){
                usableObjects.push('letter');
                sessionAttributes['usableObjectsEn'] = usableObjects;
            }
        }else if(room === washing_room_en.getRoom()){
            let value = washing_room_en.take(item, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
        }else if(room === bathroom_en.getRoom()){
            let value = bathroom_en.take(item, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
            if(item === 'toilet paper'){
                usableObjects.push('toilet paper');
            }else if(item === 'rubbing alcohol'){
                usableObjects.push('rubbing alcohol');
            }
            sessionAttributes['usableObjectsEn'] = usableObjects;
        }else if(room === courtyard_en.getRoom()){
            let value = courtyard_en.take(item, sessionAttributes);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
            if(item === 'player'){
                usableObjects.push('player');
                sessionAttributes['usableObjectsEs'] = usableObjects;
            }
        }else if(room === living_room_en.getRoom()){
            let value = living_room_en.take(item, sessionAttributes);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
            if(item === 'photo'){
                usableObjects.push('photo');
                sessionAttributes['usableObjectsEn'] = usableObjects;
            }
        }else if(room === basement_en.getRoom()){
            let value = basement_en.take(item, sessionAttributes);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
        }else if(room === kitchen_en.getRoom()){
            let value = kitchen_en.take(item, sessionAttributes)
            speechText = value.speechText;
            success = value.success;
            points += value.points;
            if(item === 'note'){
                usableObjects.push('note');
                sessionAttributes['usableObjectsEn'] = usableObjects;
            }
        }else if(room === secret_room_en.getRoom()){
            let value = secret_room_en.take(item, sessionAttributes);
            speechText = value.speechText;
            success = value.success;
        }else if(room === hall_en.getRoom()){
            let value = hall_en.take(item, sessionAttributes);
            speechText = value.speechText;
            success = value.success;
            points += value.points;
        }
        if(success){
            inventory.push(item);
            sessionAttributes['inventoryEn'] = inventory;
        }
        sessionAttributes['pointsEn'] = points;
        return speechText;
    },
    release(item, sessionAttributes){
        let speechText = "You can't drop " + item;
        
        if(inventory.indexOf(item) !== -1){
            if(room === room_en.getRoom()){
                speechText = room_en.release(item, sessionAttributes);
            }else if(room === corridor_en.getRoom()){
                speechText = corridor_en.release(item, sessionAttributes);
            }else if(room === washing_room_en.getRoom()){
                speechText = washing_room_en.release(item, sessionAttributes);
            }else if(room === bathroom_en.getRoom()){
                speechText = bathroom_en.release(item, sessionAttributes);
            }else if(room === courtyard_en.getRoom()){
                speechText = courtyard_en.release(item, sessionAttributes);
            }else if(room === living_room_en.getRoom()){
                speechText = living_room_en.release(item, sessionAttributes);
            }else if(room === basement_en.getRoom()){
                speechText = basement_en.release(item, sessionAttributes);
            }else if(room === kitchen_en.getRoom()){
                speechText = kitchen_en.release(item, sessionAttributes);
            }else if(room === secret_room_en.getRoom()){
                speechText = secret_room_en.release(item, sessionAttributes);
            }else if(room === hall_en.getRoom()){
                speechText = hall_en.release(item, sessionAttributes);
            }
            let index = inventory.indexOf(item);
            inventory.splice(index,1);
            sessionAttributes['inventoryEn'] = inventory;
        }
        return speechText;
    },
    use(object, element, sessionAttributes){
        let speakOutput = "You can't do that. Don't forget you need to have an object in the inventory in order to use it. ";
        
        if(inventory.indexOf(object) !== -1){
            if(room === room_en.getRoom()){
                let value = room_en.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                dead = value.dead;
            }else if(room === washing_room_en.getRoom()){
                let value = washing_room_en.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === bathroom_en.getRoom()){
                let value = bathroom_en.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === living_room_en.getRoom()){
                let value = living_room_en.use(object, element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === basement_en.getRoom()){
                let value = basement_en.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                let four = value.fourObjects;
                if(finished){
                    if(four){
                        speakOutput += ' <audio src="soundbank://soundlibrary/alarms/buzzers/buzzers_01"/> What happened? You open your eyes and you are in your room, in your bed. '
                                        + ' Everything seems normal. ';
                        if(inventory.indexOf('cat') !== -1){
                            speakOutput += " <audio src='soundbank://soundlibrary/animals/amzn_sfx_cat_purr_03'/> Oh! The kitty is on top of you. One moment... You don't have any pets. Was this a dream or was it real? You pet the cat. Anyway, you are happy to have it. "
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
                let value = secret_room_en.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === hall_en.getRoom()){
                let value = hall_en.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                if(finished){
                    if(inventory.indexOf('cat') === -1){
                        speakOutput += ' You are sad because you left the kitty there. Moreover, you have become a ghost. '
                    }else{
                        speakOutput += "You succeed! You adopted a ghost cat and you are free. You can't be happier! The fact that you are dead is just a side effect. " 
                    }
                }
            }
        }
        if(dead){
            speakOutput = speakOutput + " Oh! You're dead!";
        }
        if(finished){
            speakOutput = speakOutput + ' You got ' 
            + points + ' points, ' + name;
        }
        
        sessionAttributes['pointsEn'] = points;
        sessionAttributes['deadEn'] = dead;
        sessionAttributes['finishedEn'] = finished;
        
        return {
            speakOutput: speakOutput,
            dead: dead,
            finished: finished
        }
    },
    useObject(object, sessionAttributes){
        let speakOutput = "You can't use that. Don't forget you need to have an object in the inventory in order to use it. ";
        
        if(inventory.indexOf(object) !== -1){
            if(object === 'flashlight'){
                if(usableObjects.indexOf('flashlight') !== -1){
                    if(room === corridor_en.getRoom()){
                        let value = corridor_en.useObject(sessionAttributes);
                        points += value.points;
                        speakOutput = value.speakOutput;
                    }else{
                        speakOutput = "Now you don't need the flashlight. ";
                    }
                }else{
                    speakOutput = "The flashlight doesn't have batteries.";    
                }
            }
            if(usableObjects.indexOf(object) !== -1){
                if(object === 'letter'){
                    speakOutput = '<speak> You read again the letter: '
                     + "<voice name='Matthew'> I've been watching you for a while. I'm testing you with a series of challenges. "
                    + "I want to know if you're able to succeed in order to entrust you with a mission. "
                    + "Keep going to discover what's all of this about. I only can say that I trust you to become the container I drink from. "
                    + 'Signed: <say-as interpret-as="characters">E</say-as>.'
                    + '<say-as interpret-as="characters">C</say-as>.'
                    + '<say-as interpret-as="characters">B</say-as>.'
                    + '<say-as interpret-as="characters">I</say-as>.'
                    + '</voice>'
                    + '</speak>';
                }
                if(object === 'toilet paper'){
                    speakOutput = ' You read the symbols that are written in the toilet paper. '
                    + "A tree, a cloud, a bonfire and a river."
                }
                if(object === 'photo'){
                    speakOutput =  " It's a photo of a really cute white cat. There is a text behind: "
                        + "<voice name='Matthew'> I like to chase and catch everything that is moving. "
                        + 'Will you give me that chance?'
                        + '</voice>'
                }
                if(object === 'rubbing alcohol'){
                    speakOutput = "It's not the time to use the rubbing alcohol.";
                    if(room === basement_en.getRoom()){
                        let value = basement_en.useObject(sessionAttributes);
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
                    + "<voice name='Matthew'> I'm really hungry. You better rush. "
                    + '</voice>'
                }
                if(object === 'player'){
                    speakOutput = ' You take the mp3 player and start to listen to it again. '
                    + "<voice name='Matthew'> Go into the unknown. Don't forget the threads that interweave and form a whole."
                    + '</voice>'
                }
            }
               
        }
        if(dead){
            speakOutput = speakOutput + "Oh! You're dead!"
            + ' You got ' 
            + points + ' points, ' + name;
        }
        
        sessionAttributes['pointsEn'] = points;
        sessionAttributes['deadEn'] = dead;
        
        return {
            speak: speakOutput,
            faint : dead
        }
    },
    combine(object, object2, sessionAttributes){
        let speakOutput = "You can't combine those objects. Remember that you need to have an object inside the inventory in order to use it.";
        
        if(inventory.indexOf(object) !== -1 && inventory.indexOf(object2) !== -1){
            if((object === 'flashlight' && object2 === 'batteries') || (object2 === 'flashlight' && object === 'batteries')){
                speakOutput = "You combined the lantern and the batteries. Now it will work if it's necessary. ";
                usableObjects.push('flashlight');
                sessionAttributes['usableObjectsEn'] = usableObjects;
                let index = inventory.indexOf('batteries');
                inventory.splice(index,1);
                sessionAttributes['inventoryEn'] = inventory;
                points += 10;
                sessionAttributes['pointsEn'] = points;
            }
        }
        return speakOutput;
    },
    numberCode(number, sessionAttributes){
        let speakOutput = "You can't insert that now. ";
        
        if(room === corridor_en.getRoom()){
            let value = corridor_en.numberCode(number, sessionAttributes);
            points += value.points;
            speakOutput = value.speakOutput;
        }else if(room === living_room_en.getRoom()){
            let value = living_room_en.numberCode(number, sessionAttributes);
            points += value.points;
            speakOutput = value.speakOutput;
        }
        sessionAttributes['pointsEn'] = points;
        return speakOutput;
    },
    pushSymbol(symbol, symbol2, symbol3, symbol4, sessionAttributes){
        let speakOutput = " You can't press anything right now. ";
        if(room === courtyard_en.getRoom()){
            let value = courtyard_en.pushSymbol(symbol, symbol2, symbol3, symbol4, sessionAttributes);
            points += value.points;
            speakOutput = value.speakOutput;
        }
        sessionAttributes['pointsEn'] = points;
        return speakOutput;
    },
    read(author){
        let speakOutput = " Now it's not the time to read. ";
        if(room === living_room_en.getRoom()){
            speakOutput = living_room_en.read(author);
        }
        return speakOutput;
    },
    giveCats(element1, element2, element3, element4, sessionAttributes){
        let speakOutput = " Now it's not the time to give anything. ";
        let success = false;
        
        if(room === basement_en.getRoom()){
            if(inventory.indexOf('bowl') !== -1 && inventory.indexOf('cat food') !== -1 && inventory.indexOf('ball of wool') !== -1 && inventory.indexOf('toy mouse') !== -1){
                let value = basement_en.giveCats(element1, element2, element3, element4, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                success = value.success;
            }else{
                speakOutput = 'You need to have the objects inside the inventory to give them to the cat.';
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
            sessionAttributes['inventoryEn'] = inventory;
        }
        sessionAttributes['pointsEn'] = points;

        return speakOutput;
    },
    giveCats2(element1, element2, element3, sessionAttributes){
        let speakOutput =  " Now it's not the time to give anything. ";
        let success = false;
        
        if(room === basement_en.getRoom()){
            if(inventory.indexOf(element1) !== -1 && inventory.indexOf(element2) !== -1 && inventory.indexOf(element3) !== -1){
                let value = basement_en.giveCats2(element1, element2, element3, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                success = value.success;
            }else{
                speakOutput = 'You need to have the objects inside the inventory to give them to the cat.';
            }
        }
        
        if(success){
            let index = inventory.indexOf(element1);
            inventory.splice(index,1);
            index = inventory.indexOf(element2);
            inventory.splice(index,1);
            index = inventory.indexOf(element3);
            inventory.splice(index,1);
            sessionAttributes['inventoryEn'] = inventory;
        }
        sessionAttributes['pointsEn'] = points;

        return speakOutput;
    },
    giveCats3(element1, element2, sessionAttributes){
        let speakOutput = " Now it's not the time to give anything. ";
        
        if(room === basement_en.getRoom()){
            if(inventory.indexOf(element1) !== -1 && inventory.indexOf(element2) !== -1){
                let value = basement_en.giveCats3(element1, element2, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else{
                speakOutput = 'You need to have the objects inside the inventory to give them to the cat.';
            }
        }
        sessionAttributes['pointsEn'] = points;
      
        return speakOutput;
    },
    giveCats4(element1, sessionAttributes){
        let speakOutput = " Now it's not the time to give anything. ";
        let dead = false;
        
        if(room === basement_en.getRoom()){
            if(inventory.indexOf(element1) !== -1){
                let value = basement_en.giveCats4(element1);
                points += value.points;
                speakOutput = value.speakOutput;
                dead = value.dead;
            }else{
                speakOutput = 'You need to have the objects inside the inventory to give them to the cat.';
            }
        }
        
        if(dead){
            speakOutput = speakOutput + "Oh! You're dead"
            + ' You got ' 
            + points + ' points, ' + name;
            finished = true;
        }
        sessionAttributes['deadEn'] = dead;
        sessionAttributes['pointsEn'] = points;
        sessionAttributes['finishedEn'] = finished;
        
        return {
            speakOutput: speakOutput,
            dead: dead
        }
    },
    go(place, sessionAttributes){
        let speechText = "You can't go there.";
        let url = '';
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
            speechText = 'You are already there';
            r = room;
        }
        
        sessionAttributes['roomEn'] = r;
        
        if(r === 'bedroom'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/bedroom.jpg";
        }else if(r === 'corridor'){
            if(room !== r){
                corridor_en.setLight(false, sessionAttributes);
            }
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/corridor.jpg";
        }else if(r === 'washing room'){
            if(room === 'corridor'){
                speechText += washing_room_en.getEnterSpeak(sessionAttributes);
            }
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/washing.png"
        }else if(r === 'kitchen'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/kitchen.jpg";
        }else if(r === 'secret room'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/secret.jpg";
        }else if(r === 'hall'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/hall.png";
        }else if(r === 'courtyard'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/courtyard.png";
        }else if(r === 'bathroom'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/bath.png";
        }else if(r === 'living room'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/living.jpg";
        }else if(r === 'basement'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/basement.jpg";
        }
        room = r;
        
        return {
            speechText: speechText,
            room: room,
            url: url
        }
    },
    where(){
        let speakOutput = "You haven't started the game yet.";
        if (room !== ''){
            speakOutput = 'You are in ' + room;
        }
        return speakOutput;
    },
    clue(sessionAttributes){
        let speakOutput = "I can't give you a clue because you are not at any room.";
        
        if(room === room_en.getRoom()){
            speakOutput = room_en.clue(sessionAttributes);
        }else if(room === corridor_en.getRoom()){
            speakOutput = corridor_en.clue(sessionAttributes);
        }else if(room === washing_room_en.getRoom()){
            speakOutput = washing_room_en.clue(sessionAttributes);
        }else if(room === bathroom_en.getRoom()){
            speakOutput = bathroom_en.clue(sessionAttributes);
        }else if(room === courtyard_en.getRoom()){
            speakOutput = courtyard_en.clue(sessionAttributes);
        }else if(room === living_room_en.getRoom()){
            speakOutput = living_room_en.clue(sessionAttributes);
        }else if(room === basement_en.getRoom()){
            speakOutput = basement_en.clue(sessionAttributes);
        }else if(room === kitchen_en.getRoom()){
            speakOutput = kitchen_en.clue();
        }else if(room === secret_room_en.getRoom()){
            speakOutput = secret_room_en.clue();
        }else if(room === hall_en.getRoom()){
            speakOutput = hall_en.clue(sessionAttributes);
        }
        points -= 10;
        sessionAttributes['pointsEn'] = points;
        return speakOutput;
    },
    choose(option, sessionAttributes){
        let speakOutput = " Now it's not the time to do that. ";
        if(room === room_en.getRoom()){
            let value = room_en.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
           
        }else if(room === washing_room_en.getRoom()){
            let dryer = corridor_en.getSwitch();
            let value = washing_room_en.choose(option, dryer, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === courtyard_en.getRoom()){
            let value = courtyard_en.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === living_room_en.getRoom()){
            let value = living_room_en.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === hall_en.getRoom()){
            let value = hall_en.choose(option, sessionAttributes);
            speakOutput = value.speakOutput;
            points += value.points;
            finished = value.finished;
            if(finished){
                speakOutput = speakOutput + ' You got ' 
                + points + ' points, ' + name;
            }
        }
        sessionAttributes['pointsEn'] = points;
        sessionAttributes['finishedEn'] = finished;
        return {
            speakOutput: speakOutput,
            finished: finished
        }
    },
    chooseObject(option, object, sessionAttributes){
        let speakOutput = " Now it's not the time to do that. ";
        if(room === room_en.getRoom() && object === 'cat food'){
            let value = room_en.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === washing_room_en.getRoom() && object === 'ball of wool'){
            let dryer = corridor_en.getSwitch();
            let value = washing_room_en.choose(option, dryer, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === courtyard_en.getRoom() && object === 'toy mouse'){
            let value = courtyard_en.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === living_room_en.getRoom() && object === 'bowl'){
            let value = living_room_en.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === hall_en.getRoom() && object === 'poison'){
            let value = hall_en.choose(option, sessionAttributes);
            speakOutput = value.speakOutput;
            points += value.points;
            finished = value.finished;
            if(finished){
                speakOutput = speakOutput + ' You got ' 
                + points + ' points, ' + name;
            }
        }
        sessionAttributes['pointsEn'] = points;
        sessionAttributes['finishedEn'] = finished;
        return {
            speakOutput: speakOutput,
            finished: finished
        }
    }
}