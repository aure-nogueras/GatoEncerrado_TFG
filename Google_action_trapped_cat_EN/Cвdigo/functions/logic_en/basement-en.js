// Objects in the room
let objectsBasement = [];
        
// Objects in the floor of the room
let floorObjectsBasement = [];

// Array with accomplished interactions with the objects of the room
let basementElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

// Number used to choose the clue
let n;

// Time registers
let hour1, hour2;
let minutes1, minutes2;
let seconds1, seconds2;

// Boolean to know if it is the first time an object is taken
let firstTime;
let firstUse;

// Boolean to know if you are hurt
let harmed;

// Boolean to know if you are dead
let dead;

// Boolean to know if the game has finished
let finished;

// Boolean to know if you gave the cat four objects in correct order
let fourObjects;

module.exports = {
    initialize(conv){
        floorObjectsBasement = [];
        objectsBasement = ['car keys', 'garage control', 'cat'];
        canTakeObjects = [];
        basementElements = [];
        harmed = false;
        dead = false;
        finished = false;
        firstUse = true;
        firstTime = true;
        points = 0;
        n = 0;
        fourObjects = false;
        
        conv.objectsBasement = objectsBasement;
        conv.floorObjectsBasement = floorObjectsBasement;
        conv.canTakeObjectsBasement = canTakeObjects;
        conv.basementElements = basementElements;
        conv.firstTimeBasement = firstTime;
        conv.firstUseBasement = firstUse;   
        conv.harmed = harmed;
        conv.basementClue = n;
        conv.fourObjects = fourObjects;
    },
    continueGame(conv){
        objectsBasement = conv.objectsBasement;
        floorObjectsBasement = conv.floorObjectsBasement;
        canTakeObjects = conv.canTakeObjectsBasement;
        basementElements = conv.basementElements;
        firstTime = conv.firstTimeBasement;
        firstUse = conv.firstUseBasement;   
        finished = conv.finished;
        dead = conv.dead;
        harmed = conv.harmed;
        fourObjects = conv.fourObjects;
        
        points = 0;
        n = conv.basementClue;
    },
    getRoom(){
        let room = 'basement';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            
            case 'north':
                speechText = 'You can see the door and a switch.';
                break;
            case 'south':
                speechText = 'Behind you there are stairs going up to the living room.';
                break;
            case 'east':
                speechText = 'To the right there is a car.';
                break;
            case 'west':
                speechText = 'To the left there is a shelf and a sandbox.';
                break;
            case 'up':
                speechText = "There is a lamp. It's on.";
                break;
            case 'down':
                if(floorObjectsBasement.length === 0){
                    speechText = "It's the floor. You can see some footprints again.";
                }else{
                    speechText = 'Besides the footprints, you find: ' + floorObjectsBasement;
                }
                break; 
        }
        return speechText;
    },
    interaction(object, conv){
        let speechText = "There's nothing interesting about it. Tell me what you want to do now. ";
        points = 0;
        switch(object){
            case 'shelf':
                speechText = 'You look at the shelf and find a board game. Moreover, there are some dusty books, but they are not interesting. Tell me what you want to do now. ';
                break;
            case 'board game':
                speechText = "It's a strange version of a mystery game. A kitty has been murdered. Someone left a game halfway. "
                + 'You look at the solution. The cat has been murdered by a dog, with poisoned tuna in the sandbox. Wow, really curious. Tell me what you want to do now. ';
                break;
            case 'sandbox':
                if(floorObjectsBasement.indexOf('car keys') === -1 && objectsBasement.indexOf('car keys') !== -1){
                    speechText = "It's not really nice, but you put your hand inside the sandbox. You find something and you pray that's not what you're thinking about. Luckily, you find car keys. Tell me what you want to do now. "
                    canTakeObjects.push('car keys');
                    conv.canTakeObjectsBasement = canTakeObjects;
                    if(firstTime){
                        points += 10;
                        firstTime = false;
                        conv.firstTimeBasement = firstTime;
                    }
                }else{
                    speechText = "There's nothing in the sandbox. Tell me what you want to do now. "
                }
                break;
            case 'car':
                if(basementElements.indexOf('car') === -1){
                    speechText = "It's a red car. It's closed and you can't see what's inside. Tell me what you want to do now. "
                }else{
                    speechText = "It's a red car. It's open. You look inside the trunk. "
                    if(floorObjectsBasement.indexOf('cat') === -1 && objectsBasement.indexOf('cat') !== -1){
                        speechText += 'There is a cat. '
                        if(basementElements.indexOf('cat') === -1){
                            speechText += 'The cat looks at you waiting for something. To give objects to the cat, say give followed by the objects. You can give between one and four objects to the cat. '
                                        + 'If you give four objects to the cat, it must be in a specific order you have discovered during your adventure.'
                        }
                    }
                    speechText += ' Tell me what you want to do now. ';
                }
                break;
            case 'switch':
                speechText = "You press the switch, but it doesn't work. Tell me what you want to do now. ";
                break;
            case 'stairs':
                speechText = 'The stairs go up to the living room. Tell me what you want to do now. ';    
                break;
            case 'lamp':
                speechText = "The lamp is lit. There's nothing special about it. Tell me what you want to do now. ";    
                break;
            case 'door':
                if(basementElements.indexOf('door') === -1){
                    speechText = "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                    + ' The door is closed. Tell me what you want to do now. '
                    + "</speak>";
                }
                break;
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsBasement.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsBasement.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.';
            if(item === 'cat' && firstUse === true){
                points += 50;
                firstUse = false;
                conv.firstUseBasement = firstUse;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsBasement = canTakeObjects;
            let index = objectsBasement.indexOf(item)
            objectsBasement.splice(index,1)
            conv.objectsBasement = objectsBasement;
            if(floorObjectsBasement.indexOf(item) !== -1){
                let index2 = floorObjectsBasement.indexOf(item)
                floorObjectsBasement.splice(index2,1)
                conv.floorObjectsBasement = floorObjectsBasement;
            }
            success = true;
        }
        return {
            speechText: speechText,
            points: points,
            success: success
        }
    },
    release(item, conv){
        let speechText = 'You drop ' + item + ' in ' + this.getRoom(); 
        objectsBasement.push(item);
        floorObjectsBasement.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsBasement = canTakeObjects;
        conv.floorObjectsBasement = floorObjectsBasement;
        conv.objectsBasement = objectsBasement;
        return speechText;
    },
    use(object, element, conv){
        points = 0;
        let speakOutput = "You can't do that. Tell me what you want to do now. ";
        if(object === 'car keys' && element === 'car'){
            if(basementElements.indexOf('car') === -1){
                speakOutput = 'You open the car. ' 
                + '<audio src="https://actions.google.com/sounds/v1/transportation/opening_closing_car_door_far.ogg"/>'
                basementElements.push('car');
                conv.basementElements = basementElements;
                points += 10;
            }else{
                speakOutput = '<speak> The car is open. ';
            }
            if(floorObjectsBasement.indexOf('cat') === -1 && objectsBasement.indexOf('cat') !== -1){
                speakOutput += 'You look inside. In the trunk there is a really cute car. You fall in love as soon as you see it. ';
                if(basementElements.indexOf('cat') === -1){
                    speakOutput += 'The cat looks at you waiting for something. To give objects to it, say give and the objects. You can give between one and four objects to the cat. '
                    + ' If you give four objects to the cat, it must be in a specific order you have discovered with different clues during your adventure. </speak> '
                }else{
                    speakOutput += ' Tell me what you want to do now. </speak> '
                }
            }else{
                speakOutput += "There's nothing inside."
            }
        }
        if(object === 'garage control' && element === 'door'){
            if(basementElements.indexOf('door') === -1){
                speakOutput = 
                '<speak> You use the garage control and open the door.' 
                + '<audio src="https://actions.google.com/sounds/v1/doors/wood_door_open.ogg"/>'
                + ' You are free! '; 
                finished = true;
                basementElements.push('puerta');
                conv.basementElements = basementElements;
                points += 20;
            }else{
                speakOutput = 'The door is open. You can see the exit! '
            }
        }
        return{
            speakOutput: speakOutput,
            finished: finished,
            points: points,
            fourObjects: fourObjects
        }        
    },
    useObject(conv){
        let speakOutput = "It's not the time to use the rubbing alcohol.";
        if(basementElements.indexOf('car') !== -1 && harmed){
            hour2 = new Date().getHours()
            minutes2 = new Date().getMinutes()
            seconds2 = new Date().getSeconds()
            conv.hour2 = hour2;
            conv.minutes2 = minutes2;
            conv.seconds2 = seconds2;
            let seconds = seconds2 - seconds1
            if((hour1 === hour2 && minutes1 === minutes2 && seconds < 30) || ((hour1 === hour2 || hour2-hour1 === 1 || (hour2 === 0 && hour1 === 23)) && minutes2-minutes1 === 1 && seconds1 >= 30 && seconds2 <= (seconds1+30)%60)){
                speakOutput = 'You use the rubbing alcohol and heal yourself on time.'
                harmed = false;
                conv.harmed = false;
            }else{
                speakOutput = 'You fainted before you could use the rubbing alcohol.'
                dead = true;
                points -= 30;
            }
        }   
        return{
            speakOutput: speakOutput,
            dead: dead,
            points: points
        }
    },
    giveCats(element1, element2, element3, element4, conv){
        let speakOutput = 'The car is closed. Tell me what you want to do now. ';
        points = 0;
        let success = false;
        if(basementElements.indexOf('car') !== -1){
            if(basementElements.indexOf('cat') === -1){
                if(harmed){
                    speakOutput = "You can't try again. You are hurt... Tell me what you want to do now. ";
                }else{
                    if(element1 === 'bowl' && element2 === 'cat food' && element3 === 'ball of wool' && element4 === 'toy mouse'){
                        speakOutput = "<speak>" 
                            +  element1 + ' ' + element2 + ' ' + element3 + ' ' + element4 + ' '
                            + "You gave the objects in the correct order to the cat. "
                            + "Now it's happy and gets closer to you."
                            + '<audio src="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"/>'
                            + ' The cat lets the garage control drop to the ground. Tell me what you want to do now. '
                            + "</speak>";
                        basementElements.push('cat');
                        success = true;
                        canTakeObjects.push('cat');
                        canTakeObjects.push('garage control');
                        floorObjectsBasement.push('garage control');
                        fourObjects = true;
                        conv.basementElements = basementElements;
                        conv.canTakeObjectsBasement = canTakeObjects;
                        conv.floorObjectsBasement = floorObjectsBasement;
                        conv.fourObjects = fourObjects;
                        points += 30;
                    }else{
                        if(!harmed){
                            speakOutput = '<speak> ' + element1 + ' ' + element2 + ' ' + element3 + ' ' + element4 + ' '
                                + "That's not the order you were supposed to give the objects to the cat. It seems pretty angry. "
                                + '<audio src="https://actions.google.com/sounds/v1/horror/monster_alien_grunt_hiss.ogg"/>'
                                + "It approaches you and scratches you. Oh, no, you're bleeding. "
                                + "You must stop the blood or you'll faint. Tell me what you want to do now. </speak> "
                            hour1 = new Date().getHours();
                            minutes1 = new Date().getMinutes();
                            seconds1 = new Date().getSeconds();
                            conv.hour1 = hour1;
                            conv.minutes1 = minutes1;
                            conv.seconds1 = seconds1;
                            points -= 30;
                        }
                        harmed = true;
                        conv.harmed = harmed;
                    }
                    
                }
            }else{
               speakOutput = "You have already given the objects to the cat correctly. It's happy. Tell me what you want to do now. "; 
            }
        }
        return {
            speakOutput: speakOutput,
            success: success,
            points: points
        }
    },
    giveCats2(element1, element2, element3, conv){
        let speakOutput = 'The car is closed. Tell me what you want to do now. ';
        points = 0;
        let success = false;
        if(basementElements.indexOf('car') !== -1){
            if(basementElements.indexOf('cat') === -1){
                if(harmed){
                    speakOutput = "You can't try again. You are hurt... Tell me what you want to do now. ";
                }else{
                    if(element1 !== element2 && element2 !== element3 && element1 !== element3){
                        speakOutput = "<speak>" 
                            +  element1 + ' ' + element2 + ' ' + element3 + ' '
                            + "You gave three of four objects to the cat. "
                            + "It gives you a look of slight acceptance and it approaches to you."
                            + '<audio src="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"/>'
                            + ' The cat lets the garage control drop to the ground. Tell me what you want to do now. '
                            + "</speak>";
                            basementElements.push('cat');
                            success = true;
                            canTakeObjects.push('cat');
                            canTakeObjects.push('garage control');
                            floorObjectsBasement.push('garage control');
                            conv.basementElements = basementElements;
                            conv.canTakeObjectsBasement = canTakeObjects;
                            conv.floorObjectsBasement = floorObjectsBasement;
                            points += 10;
                    }else{
                        speakOutput = "The objects can't be repeated. Tell me what you want to do now. ";
                    }
                }
            }else{
               speakOutput = "You have already given the objects to the cat correctly. It's happy. Tell me what you want to do now. "; 
            }
        }
        return {
            speakOutput: speakOutput,
            success: success,
            points: points
        }
    },
    giveCats3(element1, element2, conv){
        let speakOutput = 'The car is closed. Tell me what you want to do now. ';
        points = 0;
        if(basementElements.indexOf('car') !== -1){
            if(basementElements.indexOf('cat') === -1){
                if(harmed){
                    speakOutput = "You can't try again. You are hurt... Tell me what you want to do now. ";
                }else{
                    if(element1 !== element2){
                        speakOutput = '<speak>' + element1 + ' ' + element2 + ' '
                                    + ' You gave two of four objects to the cat. It seems pretty angry. '
                                    + '<audio src="https://actions.google.com/sounds/v1/horror/monster_alien_grunt_hiss.ogg"/>'
                                    + 'It approaches you and scratches you. Oh, no, you are bleeding. '
                                    + "You must stop the blood or you'll faint. Tell me what you want to do now. </speak>";
                        hour1 = new Date().getHours();
                        minutes1 = new Date().getMinutes();
                        seconds1 = new Date().getSeconds();
                        conv.hour1 = hour1;
                        conv.minutes1 = minutes1;
                        conv.seconds1 = seconds1;
                        points -= 30;
                        harmed = true;
                        conv.harmed = harmed;
                    }else{
                        speakOutput = "The objects can't be repeated. Tell me what you want to do now. ";
                    }
                }
            }else{
               speakOutput = "You have already given the objects to the cat correctly. It's happy. Tell me what you want to do now. "; 
            }
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    giveCats4(element1){
        let speakOutput = 'The car is closed. Tell me what you want to do now. ';
        points = 0;
        let success = false;
        if(basementElements.indexOf('car') !== -1){
            if(basementElements.indexOf('cat') === -1){
                if(harmed){
                    speakOutput = "You can't try again. You are hurt... Tell me what you want to do now. ";
                }else{
                    speakOutput = '<speak> You gave one of four objects to the cat. '
                    + '<audio src="https://actions.google.com/sounds/v1/horror/monster_alien_grunt_hiss.ogg"/>'
                    + "It's angry with you and it scratches you. You didn't expect that and you faint with no time to react. Tell me what you want to do now. </speak>";
                    points -= 30;
                    dead = true;
                }
            }else{
               speakOutput = "You have already given the objects to the cat correctly. It's happy. Tell me what you want to do now. ";
            }
        }
        return {
            speakOutput: speakOutput,
            dead: dead,
            points: points
        }
    },
    go(place){
        let speakOutput = "You can't go there.";
        let r = 'basement';
        if(place === 'living room'){
            speakOutput = 'You are in the living room.';
            r = 'living room';    
        }
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'Did you look in the sandbox?';
            n = 1;
        }else if(n === 1){
            speakOutput = 'You need something you found in the bathroom just in case.';
            n = 2;
        }else if(n === 2){
            speakOutput = 'A cat is always happy with more. ';
            n = 3;
        }else if(n === 3){
            speakOutput = 'The key to order is a mysterious voice. ';
            n = 4;
        }else if(n === 4){
            speakOutput = 'There are some objects you found during your adventure that indicate the order you have to consider to give the cat the items: a letter, a photo, a telephone and an mp3 player. ';
            n = 0;
        }
        conv.basementClue = n;
        return speakOutput;
    }
    
}