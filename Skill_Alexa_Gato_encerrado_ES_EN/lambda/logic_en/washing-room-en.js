 // Objects in the room
let objectsWashingRoom = [];
        
// Objects in the floor of the room
let floorObjectsWashingRoom = [];

// Array with accomplished interactions with the objects of the room
let washingRoomElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

// Number used to choose the clue
let n;

// Boolean to know if it is the first time an object is taken
let firstTime;

// Indicates if you can take the wool
let wool;

module.exports = {
    initialize(sessionAttributes){
        objectsWashingRoom = ['ball of wool'];
        floorObjectsWashingRoom = [];
        washingRoomElements = [];
        canTakeObjects = [];
        points = 0;
        firstTime = true;
        wool = true;
        n = 0;
        
        sessionAttributes['objectsWashingRoomEn'] = objectsWashingRoom;
        sessionAttributes['floorObjectsWashingRoomEn'] = floorObjectsWashingRoom;
        sessionAttributes['canTakeObjectsWashingRoomEn'] = canTakeObjects;
        sessionAttributes['washingRoomElementsEn'] = washingRoomElements;
        sessionAttributes['firstTimeWashingMachineEn'] = firstTime;
        sessionAttributes['woolEn'] = wool;
        sessionAttributes['washingRoomClueEn'] = n;
    },
    continueGame(sessionAttributes){
        objectsWashingRoom = sessionAttributes['objectsWashingRoomEn'];
        floorObjectsWashingRoom = sessionAttributes['floorObjectsWashingRoomEn'];
        canTakeObjects = sessionAttributes['canTakeObjectsWashingRoomEn'];
        washingRoomElements = sessionAttributes['washingRoomElementsEn'];
        firstTime = sessionAttributes['firstTimeWashingMachineEn'];
        wool = sessionAttributes['woolEn'];
        points = 0;
        n = sessionAttributes['washingRoomClueEn'];
    },
    getRoom(){
        let room = 'washing room';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'north':
                speechText = 'You can see two doors. The left one is made of glass. The right one is a door with latch.';
                break;
            case 'south':
                speechText = 'You see the corridor.';
                break;
            case 'east':
                speechText = 'To the right there is a washing machine and a dryer. ';
                break;
            case 'west':
                speechText = "To the left there is a phone. It's probably the one you heard when you entered the room. There is also a slightly peculiar wall. ";
                break;
            case 'up':
                speechText = "Above you it's the ceiling. There is a huge skylight that lets the light in. ";
                break;
            case 'down':
                if(floorObjectsWashingRoom.length === 0){
                    speechText = "It's just the floor. Nothing interesting.";
                }else{
                    speechText = 'On the ground you find: ' + floorObjectsWashingRoom;
                    if(!wool){
                        speechText += "The ball of wool is undone. You can't take it."
                    }
                }
                break;
            }
        return speechText;
    },
    interaction(object, dryer, sessionAttributes){
        let speechText = "There's nothing interesting about it. ";
        let r = 'washing room';
        points = 0;
        let url = '';
       
        switch(object){
            case 'washing machine':
                speechText = "It's an old washing machine, a bit rusty. There's nothing interesting about it.";
                break;
            case 'dryer':
                if(floorObjectsWashingRoom.indexOf('ball of wool') === -1 && objectsWashingRoom.indexOf('ball of wool') !== -1){
                    if(dryer){
                        speechText = "It's a dryer that has been stopped. It seems that the switch you pressed in the corridor was for this. You get closer and see something inside. Wait, is that a ball of wool? Maybe you were a cat in another life. You can play with it or take it. ";
                        canTakeObjects.push('ball of wool');
                        sessionAttributes['canTakeObjectsWashingRoomEn'] = canTakeObjects;
                    }else{
                        speechText = "The dryer is working now. You should stop it to see what's inside.";
                    }
                }else{
                    speechText = "There's nothing inside the dryer.";
                }
                break;
            case 'glass door':
                if(washingRoomElements.indexOf('glass door') === -1){
                    speechText = "The glass door is stuck and can't be opened.";
                }else{
                    speechText = 'The glass door is broken and you can see a bathroom.';
                }
                break;
            case 'door with latch':
                if(washingRoomElements.indexOf('door with latch') === -1){
                    speechText = "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                    + 'The door is closed. The latch is screwed to the door.'
                    + "</speak>";
                }else{
                    speechText = 'The door is open and the latch unscrewed. In front of you there is a courtyard.';    
                }
                break;
            case 'latch':
                if(washingRoomElements.indexOf('door with latch') === -1){
                    speechText = 'The latch is screwed to the door.'; 
                }else{
                    speechText = 'The latch is unscrewed.';
                }
                break;
            case 'door':
                speechText = 'You must choose a door: the door witch latch or the glass door.'
                break;
            case 'telephone':
                speechText = "It's an old telephone, anchored to the wall. You pick it and you hear something: '"
                + "<voice name='Matthew'> I'm really hungry. You better rush. "
                + '</voice>'
                + ' You find it so weird that you write it in a paper you discover in your pocket. You save it in your inventory. '  ;    
                break;    
            case 'wall':
                speechText = 'The wall has a really weird texture. It looks like you can cross it. You get closer and... you break through the wall. '
                + '<audio src="soundbank://soundlibrary/horror/horror_04"/> What was that? You look around and you are in a kitchen. '
                + "The wall closed behind you and you can't come back. Definitely, you don't remember your house doing this kind of stuff. ";
                r = 'kitchen';
                url = "https://soundgato.s3.eu-west-3.amazonaws.com/kitchen.jpg";
                break;
            case 'skylight':
                speechText = "The skylight lets the light come through. It's the most bright room you've been at for now.";   
                break;
        }
        return {
            speechText: speechText,
            points: points,
            room: r,
            url: url
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsWashingRoom.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsWashingRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            if(item === 'ball of wool' && firstTime === true){
                points += 20;
                firstTime = false;
                sessionAttributes['firstTimeWashingMachineEn'] = firstTime;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsWashingRoomEn'] = canTakeObjects;
            let index = objectsWashingRoom.indexOf(item)
            objectsWashingRoom.splice(index,1)
            sessionAttributes['objectsWashingRoomEn'] = objectsWashingRoom;
            if(floorObjectsWashingRoom.indexOf(item) !== -1){
                let index2 = floorObjectsWashingRoom.indexOf(item);
                floorObjectsWashingRoom.splice(index2,1);
                sessionAttributes['floorObjectsWashingRoomEn'] = floorObjectsWashingRoom;
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
        objectsWashingRoom.push(item);
        floorObjectsWashingRoom.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsWashingRoomEn'] = canTakeObjects;
        sessionAttributes['floorObjectsWashingRoomEn'] = floorObjectsWashingRoom;
        sessionAttributes['objectsWashingRoomEn'] = objectsWashingRoom;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = "You can't do that.";
        if(object === 'hammer' && element === 'glass door'){
            if(washingRoomElements.indexOf('glass door') === -1){
                speakOutput = 'You break the glass door with the hammer. ' 
                + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                + 'You see a bathroom.'; 
                washingRoomElements.push('glass door');
                sessionAttributes['washingRoomElementsEn'] = washingRoomElements;
                points += 10;
            }else{
                speakOutput = 'The glass door is broken. You can go to the bathroom. ';
            }
        } 
        if(object === 'screwdriver' && element === 'door with latch'){
            if(washingRoomElements.indexOf('puerta con cerrojo') === -1){
                speakOutput = "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                + '<say-as interpret-as="interjection">great</say-as>'
                + '<break time = "0.5s" />'
                + ' The door is open! Behind the door there is a courtyard.';
                washingRoomElements.push('door with latch');
                sessionAttributes['washingRoomElementsEn'] = washingRoomElements;
                points += 10;
            }else{
                speakOutput = 'The door with latch is open and you can see a courtyard. ';
            }
        }
        return{
            speakOutput: speakOutput,
            points: points
        }        
    },
    go(place){
        let speakOutput = "You can't go there.";
        let r = 'washing room';
        if(place === 'corridor'){
            speakOutput = 'Now you are in the corridor.';
            r = 'corridor';
        }else if(place === 'bathroom' && washingRoomElements.indexOf('glass door') !== -1){
            speakOutput = 'Now you are in the bathroom. It smells really bad.';
            r = 'bathroom';
        }else if(place === 'courtyard' && washingRoomElements.indexOf('door with latch') !== -1){
            speakOutput = 'Now you are in the courtyard. The sunlight cheers you up.';
            r = 'courtyard';
        }
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    getEnterSpeak(sessionAttributes){
        let speakOutput = '';
        if(washingRoomElements.indexOf('telephone') === -1){
            speakOutput = '<audio src="soundbank://soundlibrary/telephones/modern_rings/modern_rings_01"/>'
            + ' You hear a telephone. Maybe you should see who is calling. Wait, what was that? '
            + 'You just saw something... crossing the wall. ';
            washingRoomElements.push('telephone');
            sessionAttributes['washingRoomElementsEn'] = washingRoomElements;
        }
        return speakOutput;
    },
    choose(option, dryer, sessionAttributes){
        points = 0;
        let speakOutput = 'That action is not possible.';
        if(dryer && canTakeObjects.indexOf('ovillo de lana') !== -1 && objectsWashingRoom.indexOf('ovillo de lana') !== -1 /*&& inventory.indexOf('comida de gato') === -1*/ && floorObjectsWashingRoom.indexOf('ovillo de lana') === -1){
            if(option === 'jugar'){
                speakOutput = 'Juegas con el ovillo y se deshace. Ahora no podrás cogerlo. Pierdes 20 puntos. ';
                points -= 20;
                let i = canTakeObjects.indexOf('ovillo de lana')
                canTakeObjects.splice(i,1)
                sessionAttributes['canTakeObjectsWashingRoomEn'] = canTakeObjects;
                floorObjectsWashingRoom.push('ovillo de lana');
                sessionAttributes['floorObjectsWashingRoomEn'] = floorObjectsWashingRoom;
                wool = false;
                sessionAttributes['woolEn'] = wool;
            }
        }
        return{
            speak: speakOutput,
            points: points
        }
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'You can break the glass door with something you should have taken from a previous room. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'The door with latch can be opened with something that you can find in the room with the glass door. ';
            n = 2;
        }else if(n === 2){
            speakOutput = 'Maybe you could press a switch you saw in a previous room to stop the dryer. ';
            n = 3;
        }else if(n === 3){
            speakOutput = "It's not a good idea to play with someone else's stuff. ";
            n = 0;
        }
        sessionAttributes['washingRoomClueEn'] = n;
        return speakOutput;
    }
    
}