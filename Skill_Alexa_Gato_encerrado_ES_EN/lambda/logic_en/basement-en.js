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
    initialize(sessionAttributes){
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
        
        sessionAttributes['objectsBasementEn'] = objectsBasement;
        sessionAttributes['floorObjectsBasementEn'] = floorObjectsBasement;
        sessionAttributes['canTakeObjectsBasementEn'] = canTakeObjects;
        sessionAttributes['basementElementsEn'] = basementElements;
        sessionAttributes['firstTimeBasementEn'] = firstTime;
        sessionAttributes['firstUseBasementEn'] = firstUse;   
        sessionAttributes['harmedEn'] = harmed;
        sessionAttributes['basementClueEn'] = n;
        sessionAttributes['fourObjectsEn'] = fourObjects;
    },
    continueGame(sessionAttributes){
        objectsBasement = sessionAttributes['objectsBasementEn'];
        floorObjectsBasement = sessionAttributes['floorObjectsBasementEn'];
        canTakeObjects = sessionAttributes['canTakeObjectsBasementEn'];
        basementElements = sessionAttributes['basementElementsEn'];
        firstTime = sessionAttributes['firstTimeBasementEn'];
        firstUse = sessionAttributes['firstUseBasementEn'];   
        finished = sessionAttributes['finishedEn'];
        dead = sessionAttributes['deadEn'];
        harmed = sessionAttributes['harmedEn'];
        fourObjects = sessionAttributes['fourObjectsEn'];
        
        points = 0;
        n = sessionAttributes['basementClueEn'];
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
    interaction(object, sessionAttributes){
        let speechText = "There's nothing interesting about it. ";
        points = 0;
        switch(object){
            case 'shelf':
                speechText = 'You look at the shelf and find a board game. Moreover, there are some dusty books, but they are not interesting.';
                break;
            case 'board game':
                speechText = "It's a strange version of a mystery game. A kitty has been murdered. Someone left a game halfway. "
                + 'You look at the solution. The cat has been murdered by a dog, with poisoned tuna in the sandbox. Wow, really curious.';
                break;
            case 'sandbox':
                if(floorObjectsBasement.indexOf('car keys') === -1 && objectsBasement.indexOf('car keys') !== -1){
                    speechText = "It's not really nice, but you put your hand inside the sandbox. You find something and you pray that's not what you're thinking about. Luckily, you find car keys."
                    canTakeObjects.push('car keys');
                    sessionAttributes['canTakeObjectsBasementEn'] = canTakeObjects;
                    if(firstTime){
                        points += 10;
                        firstTime = false;
                        sessionAttributes['firstTimeBasementEn'] = firstTime;
                    }
                }else{
                    speechText = "There's nothing in the sandbox."
                }
                break;
            case 'car':
                if(basementElements.indexOf('car') === -1){
                    speechText = "It's a red car. It's closed and you can't see what's inside."
                }else{
                    speechText = "It's a red car. It's open. You look inside the trunk. "
                    if(floorObjectsBasement.indexOf('cat') === -1 && objectsBasement.indexOf('cat') !== -1){
                        speechText += 'There is a cat. '
                        if(basementElements.indexOf('cat') === -1){
                            speechText += 'The cat looks at you waiting for something. To give objects to the cat, say give followed by the objects. You can give between one and four objects to the cat. '
                                        + 'If you give four objects to the cat, it must be in a specific order you have discovered during your adventure.'
                        }
                    }
                }
                break;
            case 'switch':
                speechText = "You press the switch, but it doesn't work. "
                break;
            case 'stairs':
                speechText = 'The stairs go up to the living room.';    
                break;
            case 'lamp':
                speechText = "The lamp is lit. There's nothing special about it.";    
                break;
            case 'door':
                if(basementElements.indexOf('door') === -1){
                    speechText = "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                    + 'The door is closed. '
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
        if(objectsBasement.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsBasement.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.';
            if(item === 'cat' && firstUse === true){
                points += 50;
                firstUse = false;
                sessionAttributes['firstUseBasementEn'] = firstUse;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsBasementEn'] = canTakeObjects;
            let index = objectsBasement.indexOf(item)
            objectsBasement.splice(index,1)
            sessionAttributes['objectsBasementEn'] = objectsBasement;
            if(floorObjectsBasement.indexOf(item) !== -1){
                let index2 = floorObjectsBasement.indexOf(item)
                floorObjectsBasement.splice(index2,1)
                sessionAttributes['floorObjectsBasementEn'] = floorObjectsBasement;
            }
            success = true;
        }
        return {
            speechText: speechText,
            points: points,
            success: success
        }
    },
    release(item, sessionAttributes){
        let speechText = 'You drop ' + item + ' in ' + this.getRoom(); 
        objectsBasement.push(item);
        floorObjectsBasement.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsBasementEn'] = canTakeObjects;
        sessionAttributes['floorObjectsBasementEn'] = floorObjectsBasement;
        sessionAttributes['objectsBasementEn'] = objectsBasement;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = "You can't do that. ";
        if(object === 'car keys' && element === 'car'){
            if(basementElements.indexOf('car') === -1){
                speakOutput = 'You open the car. ' 
                    + '<audio src="soundbank://soundlibrary/alarms/car_alarms/car_alarm_05"/>'
                basementElements.push('car');
                sessionAttributes['basementElementsEn'] = basementElements;
                points += 10;
            }else{
                speakOutput = 'The car is open. ';
            }
            if(floorObjectsBasement.indexOf('cat') === -1 && objectsBasement.indexOf('cat') !== -1){
                speakOutput += 'You look inside. In the trunk there is a really cute car. You fall in love as soon as you see it. ';
                if(basementElements.indexOf('cat') === -1){
                    speakOutput += 'The cat looks at you waiting for something. To give objects to it, say give and the objects. You can give between one and four objects to the cat. '
                    + ' If you give four objects to the cat, it must be in a specific order you have discovered with different clues during your adventure.'
                }
            }else{
                speakOutput += "There's nothing inside."
            }
        }
        if(object === 'garage control' && element === 'door'){
            if(basementElements.indexOf('door') === -1){
                speakOutput = 
                'You use the garage control and open the door.' 
                + '<audio src="soundbank://soundlibrary/doors/doors_metal/metal_12"/>'
                + ' You are free! '; 
                finished = true;
                basementElements.push('puerta');
                sessionAttributes['basementElementsEn'] = basementElements;
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
    useObject(sessionAttributes){
        let speakOutput = "It's not the time to use the rubbing alcohol.";
        if(basementElements.indexOf('car') !== -1 && harmed){
            hour2 = new Date().getHours()
            minutes2 = new Date().getMinutes()
            seconds2 = new Date().getSeconds()
            sessionAttributes['hour2En'] = hour2;
            sessionAttributes['minutes2En'] = minutes2;
            sessionAttributes['seconds2En'] = seconds2;
            let seconds = seconds2 - seconds1
            if((hour1 === hour2 && minutes1 === minutes2 && seconds < 30) || ((hour1 === hour2 || hour2-hour1 === 1 || (hour2 === 0 && hour1 === 23)) && minutes2-minutes1 === 1 && seconds1 >= 30 && seconds2 <= (seconds1+30)%60)){
                speakOutput = 'You use the rubbing alcohol and heal yourself on time.'
                harmed = false;
                sessionAttributes['harmedEn'] = false;
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
    giveCats(element1, element2, element3, element4, sessionAttributes){
        let speakOutput = 'The car is closed.';
        points = 0;
        let success = false;
        if(basementElements.indexOf('car') !== -1){
            if(basementElements.indexOf('cat') === -1){
                if(harmed){
                    speakOutput = "You can't try again. You are hurt... ";
                }else{
                    if(element1 === 'bowl' && element2 === 'cat food' && element3 === 'ball of wool' && element4 === 'toy mouse'){
                        speakOutput = "<speak>" 
                            +  element1 + ' ' + element2 + ' ' + element3 + ' ' + element4 + ' '
                            + "You gave the objects in the correct order to the cat. "
                            + "Now it's happy and gets closer to you."
                            + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_purr_01"/>'
                            + ' The cat lets the garage control drop to the ground.'
                            + "</speak>";
                        basementElements.push('cat');
                        success = true;
                        fourObjects = true;
                        canTakeObjects.push('cat');
                        canTakeObjects.push('garage control');
                        floorObjectsBasement.push('garage control');
                        sessionAttributes['basementElementsEn'] = basementElements;
                        sessionAttributes['canTakeObjectsBasementEn'] = canTakeObjects;
                        sessionAttributes['floorObjectsBasementEn'] = floorObjectsBasement;
                        sessionAttributes['fourObjectsEn'] = true;
                        points += 30;
                    }else{
                        if(!harmed){
                            speakOutput = element1 + ' ' + element2 + ' ' + element3 + ' ' + element4 + ' '
                                + "That's not the order you were supposed to give the objects to the cat. It seems pretty angry. "
                                + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_02"/>'
                                + "It approaches you and scratches you. Oh, no, you're bleeding. "
                                + "You must stop the blood or you'll faint."
                            hour1 = new Date().getHours();
                            minutes1 = new Date().getMinutes();
                            seconds1 = new Date().getSeconds();
                            sessionAttributes['hour1En'] = hour1;
                            sessionAttributes['minutes1En'] = minutes1;
                            sessionAttributes['seconds1En'] = seconds1;
                            points -= 30;
                        }
                        harmed = true;
                        sessionAttributes['harmedEn'] = harmed;
                    }
                    
                }
            }else{
               speakOutput = "You have already given the objects to the cat correctly. It's happy."; 
            }
        }
        return {
            speakOutput: speakOutput,
            success: success,
            points: points
        }
    },
    giveCats2(element1, element2, element3, sessionAttributes){
        let speakOutput = 'The car is closed.';
        points = 0;
        let success = false;
        if(basementElements.indexOf('car') !== -1){
            if(basementElements.indexOf('cat') === -1){
                if(harmed){
                    speakOutput = "You can't try again. You are hurt... ";
                }else{
                    if(element1 !== element2 && element2 !== element3 && element1 !== element3){
                        speakOutput = "<speak>" 
                            +  element1 + ' ' + element2 + ' ' + element3 + ' '
                            + "You gave three of four objects to the cat. "
                            + "It gives you a look of slight acceptance and it approaches to you."
                            + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_purr_01"/>'
                            + ' The cat lets the garage control drop to the ground.'
                            + "</speak>";
                            basementElements.push('cat');
                            success = true;
                            canTakeObjects.push('cat');
                            canTakeObjects.push('garage control');
                            floorObjectsBasement.push('garage control');
                            sessionAttributes['basementElementsEn'] = basementElements;
                            sessionAttributes['canTakeObjectsBasementEn'] = canTakeObjects;
                            sessionAttributes['floorObjectsBasementEn'] = floorObjectsBasement;
                            points += 10;
                    }else{
                        speakOutput = "The objects can't be repeated. ";
                    }
                }
            }else{
               speakOutput = "You have already given the objects to the cat correctly. It's happy."; 
            }
        }
        return {
            speakOutput: speakOutput,
            success: success,
            points: points
        }
    },
    giveCats3(element1, element2, sessionAttributes){
        let speakOutput = 'The car is closed.';
        points = 0;
        if(basementElements.indexOf('car') !== -1){
            if(basementElements.indexOf('cat') === -1){
                if(harmed){
                    speakOutput = "You can't try again. You are hurt... ";
                }else{
                    if(element1 !== element2){
                        speakOutput = element1 + ' ' + element2 + ' '
                                    + 'You gave two of four objects to the cat. It seems pretty angry. '
                                    + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_02"/>'
                                    + 'It approaches you and scratches you. Oh, no, you are bleeding. '
                                    + "You must stop the blood or you'll faint.";
                        hour1 = new Date().getHours();
                        minutes1 = new Date().getMinutes();
                        seconds1 = new Date().getSeconds();
                        sessionAttributes['hour1En'] = hour1;
                        sessionAttributes['minutes1En'] = minutes1;
                        sessionAttributes['seconds1En'] = seconds1;
                        points -= 30;
                        harmed = true;
                        sessionAttributes['harmedEn'] = harmed;
                    }else{
                        speakOutput = "The objects can't be repeated. ";
                    }
                }
            }else{
               speakOutput = "You have already given the objects to the cat correctly. It's happy."; 
            }
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    giveCats4(element1){
        let speakOutput = 'The car is closed.';
        points = 0;
        let success = false;
        if(basementElements.indexOf('car') !== -1){
            if(basementElements.indexOf('cat') === -1){
                if(harmed){
                    speakOutput = "You can't try again. You are hurt... ";
                }else{
                    speakOutput = 'You gave one of four objects to the cat. '
                    + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_02"/>'
                    + "It's angry with you and it scratches you. You didn't expect that and you faint with no time to react. ";
                    points -= 30;
                    dead = true;
                }
            }else{
               speakOutput = "You have already given the objects to the cat correctly. It's happy.";
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
    clue(sessionAttributes){
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
        sessionAttributes['basementClueEn'] = n;
        return speakOutput;
    }
    
}