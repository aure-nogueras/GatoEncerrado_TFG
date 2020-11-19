// Objects in the room
let objectsRoom = [];
        
// Objects in the floor of the rooms
let floorObjectsRoom = [];

// Array with accomplished interactions with the objects of the rooms
let roomElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Variable that indicates if there is enough light to explore the room
let light; 

// Points in this room
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;
let firstUse;

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

// Number used to choose the clue
let n;

module.exports = {
    initialize(sessionAttributes){
        light = false;
        sessionAttributes['lightRoomEn'] = light;
        
        objectsRoom = ['key', 'flashlight', 'batteries', 'hammer', 'cat food', 'chair'];
        sessionAttributes['objectsRoomEn'] = objectsRoom;
        
        floorObjectsRoom = ['chair'];
        sessionAttributes['floorObjectsRoomEn'] = floorObjectsRoom;
        
        canTakeObjects = ['chair'];
        
        sessionAttributes['canTakeObjectsRoomEn'] = canTakeObjects;
        
        roomElements = [];
        sessionAttributes['roomElementsEn'] = roomElements;
        points = 0;
        
        firstTime = true;
        sessionAttributes['firstTimeRoomEn'] = firstTime;
        firstUse = true;
        sessionAttributes['firstUseRoomEn'] = firstUse;
        
        dead = false;
        finished = false;
        n = 0;
        sessionAttributes['roomClueEn'] = n;
    },
    continueGame(sessionAttributes){
        light = sessionAttributes['lightRoomEn'];
        
        objectsRoom = sessionAttributes['objectsRoomEn'];
        
        floorObjectsRoom = sessionAttributes['floorObjectsRoomEn'];
        
        canTakeObjects = sessionAttributes['canTakeObjectsRoomEn'];
         
        roomElements = sessionAttributes['roomElementsEn'];
    
        points = 0;
        
        firstTime = sessionAttributes['firstTimeRoomEn'];
        firstUse = sessionAttributes['firstUseRoomEn'];
        
        dead = sessionAttributes['deadEn'];
        finished = sessionAttributes['finishedEn'];
        n = sessionAttributes['roomClueEn'];
    },
    getRoom(){
        let room = 'bedroom';
        return room;
    },
    look(orientation){
        let speechText = '';
        let url = '';
        if(light){
            switch(orientation){
                case 'north':
                    speechText = 'To the north is the switch you just pressed and the door of the room.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/north_room.png';
                    break;
                case 'south':
                    speechText = 'To the south you can see a desk and a window.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/south_room.png';
                    break;
                case 'east':
                    speechText = 'To the east there is a bed. There is a damaged pillow on it.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/east_room.png';
                    break;
                case 'west':
                    speechText = 'To the west there is a closet with shelves and a very beautiful painting.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/west_room.png';
                    break;
                case 'up':
                    speechText = "It's the lamp that lights the room.";
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/up_room.png';
                    break;
                case 'down':
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/down.png';
                    if(floorObjectsRoom.length === 0){
                        speechText = "It's just the floor. Nothing interesting.";
                    }else{
                        speechText = 'On the ground you find: ' + floorObjectsRoom;
                        if(floorObjectsRoom.indexOf('chair') !== -1){
                            url = 'https://soundgato.s3.eu-west-3.amazonaws.com/down_room.png'; 
                        }
                    }
                    break;
            }
        }else{
            speechText = 'The low light coming in through the window lets you see a switch on the wall...'; 
        }
        return {
            speechText: speechText,
            url: url
        }
    },
    interaction(object, sessionAttributes){
        let speechText = "There's nothing interesting about it. ";
        points = 0;
        switch(object){
            case 'bed':
                speechText = 'Your bed has nothing special. The sheets are a a little sweaty.';
                break;
            case 'switch':
                if(!light){
                    speechText = 
                    "<speak>"
                    + "It looks like the lamp switch."
                    + "<audio src='soundbank://soundlibrary/switches_levers/switches_levers_01'/>"
                    + "You press it. Now there is light to explore the room."
                    + "</speak>";
                    light = true;
                    points += 10;
                    roomElements.push('switch');
                    sessionAttributes['roomElementsEn'] = roomElements;
                    sessionAttributes['lightRoomEn'] = true;
                }else{
                    speechText = "You've already pressed it. Unlike cats you can't see in the dark, so you better don't press it again.";
                }
                break;
            case 'lamp':
                if(floorObjectsRoom.indexOf('batteries') === -1 && objectsRoom.indexOf('batteries') !== -1){
                    speechText = "The lamp is really high and you can't see it well. There is something inside it."
                }else{
                    speechText = "The lamp is really high and you can't see it well."
                }
                break;
            case 'trapdoor':
                if(roomElements.indexOf('trapdoor') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_glass/glass_06'/>"
                    + 'The trapdoor is stuck. Maybe you can break it with something.'
                    + "</speak>"
                }else{
                    speechText = "The trapdoor is already broken."
                    if(floorObjectsRoom.indexOf('cat food') === -1 && objectsRoom.indexOf('cat food') !== -1){
                        speechText += " There is cat food. It's a curious place to keep it. You can eat it or take it. "
                    }
                }
                break;
            case 'door':
                if(roomElements.indexOf('door') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                    + 'The door is closed. It would have been too easy to exit so soon.'
                    + "</speak>";
                }else{
                    speechText = 'The door is open and you can see a corridor.';    
                }
                break;
            case 'shelves':
                speechText = 'There are two shelves. There are clothes on the first one. There is a little trapdoor on the second one.';
                break;
            case 'closet':
                speechText = "The closet is small. You can see shelves and a lot of dust. Other than that it's pretty empty.";
                break;
            case 'pillow':
                if(floorObjectsRoom.indexOf('hammer') === -1 && objectsRoom.indexOf('hammer') !== -1){
                    speechText = 'The pillow is a little bulky. You take it and find a hammer. Who sleeps with a hammer under their pillow?'
                    canTakeObjects.push('hammer');
                }else{
                    speechText = "It's just a pillow. Nothing else."
                }
                break;
            case 'drawer':
                if(floorObjectsRoom.indexOf('flashlight') === -1 && objectsRoom.indexOf('flashlight') !== -1){
                    speechText = "There is a flashlight inside the drawer. It doesn't have batteries. "
                    canTakeObjects.push('flashlight');
                }else{
                    speechText = 'The drawer is empty.';
                }
                break;
            case 'desk':
                speechText = 'On the desk there are some papers, but nothing interesting. There is a drawer aside.';
                break;
            case 'painting':
                if(floorObjectsRoom.indexOf('key') === -1 && objectsRoom.indexOf('key') !== -1){
                    speechText = "<speak>"
                    + "It's a painting of the Alhambra. It's a little off the hook. "
                    + "<audio src='soundbank://soundlibrary/metal/metal_12'/>"
                    + "You get closer to hang it and a key falls on the floor."
                    + "</speak>"
                    canTakeObjects.push('key');
                    floorObjectsRoom.push('key');
                    sessionAttributes['floorObjectsRoomEn'] = floorObjectsRoom;
                    points += 10;
                }else{
                    speechText = "The painting's still a little off the hook, but there's nothing behind it."
                }
                break;
            case 'window':
                if(roomElements.indexOf('window') === -1){
                    speechText = 'The window is made of glass. Maybe you could break it.';
                }else{
                    speechText = 'You broke the window and you fell out of it.'
                }
                break;
        }
        sessionAttributes['canTakeObjectsRoomEn'] = canTakeObjects;
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsRoom.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            if(item === 'cat food' && firstTime === true){
                points += 20;
                firstTime = false;
                sessionAttributes['firstTimeRoomEn'] = firstTime;
            }
            let i = canTakeObjects.indexOf(item);
            canTakeObjects.splice(i,1);
            sessionAttributes['canTakeObjectsRoomEn'] = canTakeObjects;
            let index = objectsRoom.indexOf(item)
            objectsRoom.splice(index,1)
            sessionAttributes['objectsRoomEn'] = objectsRoom;
            if(floorObjectsRoom.indexOf(item) !== -1){
                let index2 = floorObjectsRoom.indexOf(item)
                floorObjectsRoom.splice(index2,1)
                sessionAttributes['floorObjectsRoomEn'] = floorObjectsRoom;
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
        objectsRoom.push(item);
        floorObjectsRoom.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsRoomEn'] = canTakeObjects;
        sessionAttributes['floorObjectsRoomEn'] = floorObjectsRoom;
        sessionAttributes['objectsRoomEn'] = objectsRoom;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = "You can't do that.";
        if(object === 'chair' && element === 'lamp'){
            if(floorObjectsRoom.indexOf('batteries') === -1 && objectsRoom.indexOf('batteries') !== -1){
                speakOutput = "You use the chair to see what's inside the lamp. You see some batteries.";
                canTakeObjects.push('batteries');
                sessionAttributes['canTakeObjectsRoomEn'] = canTakeObjects;
            }else{
                speakOutput = "You get on the chair and see what's inside the lamp, but there's nothing.";
            }
            if(firstUse){
                points+=10;
                firstUse = false;
                sessionAttributes['firstUseRoomEn'] = firstUse;
            }
        }
        if(object === 'hammer' && element === 'trapdoor'){
            if(roomElements.indexOf('trapdoor') === -1){
                speakOutput = 
                "<speak>" +
                'You break the trapdoor with the hammer.' 
                + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                + "You see something. Wait a moment... Is that cat food? That's weird, you've never had a cat..."
                + " You can eat it or take it."
                + "</speak>";
                canTakeObjects.push('cat food');
                sessionAttributes['canTakeObjectsRoomEn'] = canTakeObjects;
                roomElements.push('trapdoor');
                sessionAttributes['roomElementsEn'] = roomElements;
                points+=10;
            }else{
                speakOutput = 'The trapdoor is broken. '
                if(floorObjectsRoom.indexOf('cat food') === -1 && objectsRoom.indexOf('cat food') !== -1){
                    speakOutput += "There's still some cat food. You can choose between taking or eating it.";
                }
            }
        }
        if(object === 'key' && element === 'door'){
            if(roomElements.indexOf('door') === -1){
                points+=10;
                speakOutput = "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                + '<say-as interpret-as="interjection">Cool</say-as>'
                + '<break time = "0.5s" />'
                + ' The door is open! You can see a dark corridor.';
                roomElements.push('door');
                sessionAttributes['roomElementsEn'] = roomElements;
            }else{
                speakOutput = 'The door is open and you see a corridor.';
            }
        }
        if(object === 'hammer' && element === 'window'){
            if(roomElements.indexOf('window') === -1){
                points -= 20;
                speakOutput = 
                " <audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/> "
                + 'You broke the window with such bad luck that you fell out of it.'
                + '<break time = "0.5s" />';
                roomElements.push('window');
                sessionAttributes['roomElementsEn'] = roomElements;
                dead = true;
                finished = true;
            }else{
                speakOutput = 'The window is already broken.';
            }
        }
        return{
            speakOutput: speakOutput,
            dead: dead,
            finished: finished,
            points: points
        }        
    },
    go(place){
        let speakOutput = "You can't go there";
        let r = 'bedroom';
        
        if(place === 'corridor' && roomElements.indexOf('door') !== -1){
            speakOutput = 'Now you are in the corridor.';
            r = 'corridor';
        }
        
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'That painting may have something interesting besides being so beautiful.';
            n = 1;
        }else if(n === 1){
            speakOutput = "Perhaps it's not a good idea getting closer to that window.";
            n = 2;
        }else if(n === 2){
            speakOutput = "Cat food doesn't usually sit well with you. ";
            n = 0;
        }
        sessionAttributes['roomClueEn'] = n;
        return speakOutput;
    },
    choose(option, sessionAttributes){
        points = 0;
        let speakOutput = "That action isn't possible.";
        if(roomElements.indexOf('trapdoor') !== -1 && canTakeObjects.indexOf('cat food') !== -1 && objectsRoom.indexOf('cat food') !== -1 && floorObjectsRoom.indexOf('cat food') === -1){
            if(option === 'eat'){
                speakOutput = 'You feel sick after eating that and you lose 20 points. ';
                points -= 20;
                let i = canTakeObjects.indexOf('cat food');
                canTakeObjects.splice(i,1)
                sessionAttributes['canTakeObjectsRoomEn'] = canTakeObjects;
                let index = objectsRoom.indexOf('cat food');
                objectsRoom.splice(index,1);
                sessionAttributes['objectsRoomEn'] = objectsRoom;
            }
        }
        return{
            speak: speakOutput,
            points: points
        }
    }
    
}