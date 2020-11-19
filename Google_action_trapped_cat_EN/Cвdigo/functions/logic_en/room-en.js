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
    initialize(conv){
        light = false;
        conv.lightRoom = light;
        
        objectsRoom = ['key', 'flashlight', 'batteries', 'hammer', 'cat food', 'chair'];
        conv.objectsRoom = objectsRoom;
        
        floorObjectsRoom = ['chair'];
        conv.floorObjectsRoom = floorObjectsRoom;
        
        canTakeObjects = ['chair'];
        
        conv.canTakeObjectsRoom = canTakeObjects;
        
        roomElements = [];
        conv.roomElements = roomElements;
        conv.noTakeObjectsRoom = [];
        points = 0;
        
        firstTime = true;
        conv.firstTimeRoom = firstTime;
        firstUse = true;
        conv.firstUseRoom = firstUse;
        
        dead = false;
        finished = false;
        n = 0;
        conv.roomClue = n;
    },
    continueGame(conv){
        light = conv.lightRoom;
        
        objectsRoom = conv.objectsRoom;
        
        floorObjectsRoom = conv.floorObjectsRoom;
        
        canTakeObjects = conv.canTakeObjectsRoom;
         
        roomElements = conv.roomElements;
    
        points = 0;
        
        firstTime = conv.firstTimeRoom;
        firstUse = conv.firstUseRoom;
        
        dead = conv.dead;
        finished = conv.finished;
        n = conv.roomClue;
    },
    getRoom(){
        let room = 'bedroom';
        return room;
    },
    look(orientation){
        let speechText = '';
        if(light){
            switch(orientation){
                case 'north':
                    speechText = 'To the north is the switch you just pressed and the door of the room.';
                    break;
                case 'south':
                    speechText = 'To the south you can see a desk and a window.'
                    break;
                case 'east':
                    speechText = 'To the east there is a bed. There is a damaged pillow on it.'
                    break;
                case 'west':
                    speechText = 'To the west there is a closet with shelves and a very beautiful painting.'
                    break;
                case 'up':
                    speechText = "It's the lamp that lights the room."
                    break;
                case 'down':
                    if(floorObjectsRoom.length === 0){
                        speechText = "It's just the floor. Nothing interesting.";
                    }else{
                        speechText = 'On the ground you find: ' + floorObjectsRoom;
                    }
                    break;
            }
        }else{
            speechText = 'The low light coming in through the window lets you see a switch on the wall...'; 
        }
        return speechText;
    },
    interaction(object, conv){
        let speechText = "There's nothing interesting about it. Tell me what you want to do now. ";
        points = 0;
        switch(object){
            case 'bed':
                speechText = 'Your bed has nothing special. The sheets are a a little sweaty. Tell me what you want to do now. ';
                break;
            case 'switch':
                if(!light){
                    speechText = 
                    "<speak>"
                    + "It looks like the lamp switch."
                    + "<audio src='https://actions.google.com/sounds/v1/doors/deadbolt_lock.ogg'/>"
                    + "You press it. Now there is light to explore the room. Tell me what you want to do now. "
                    + "</speak>";
                    light = true;
                    points += 10;
                    roomElements.push('switch');
                    conv.roomElements = roomElements;
                    conv.lightRoom = true;
                }else{
                    speechText = "You've already pressed it. Unlike cats you can't see in the dark, so you better don't press it again. Tell me what you want to do now. ";
                }
                break;
            case 'lamp':
                if(floorObjectsRoom.indexOf('batteries') === -1 && objectsRoom.indexOf('batteries') !== -1){
                    speechText = "The lamp is really high and you can't see it well. There is something inside it. Tell me what you want to do now. "
                }else{
                    speechText = "The lamp is really high and you can't see it well. Tell me what you want to do now. "
                }
                break;
            case 'trapdoor':
                if(roomElements.indexOf('trapdoor') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster.ogg'/>"
                    + 'The trapdoor is stuck. Maybe you can break it with something. Tell me what you want to do now. '
                    + "</speak>"
                }else{
                    speechText = "The trapdoor is already broken. "
                    if(floorObjectsRoom.indexOf('cat food') === -1 && objectsRoom.indexOf('cat food') !== -1){
                        speechText += " There is cat food. It's a curious place to keep it. You can eat it or take it. "
                    }
                    speechText += 'Tell me what you want to do now. '
                }
                break;
            case 'door':
                if(roomElements.indexOf('door') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                    + 'The door is closed. It would have been too easy to exit so soon. Tell me what you want to do now. '
                    + "</speak>";
                }else{
                    speechText = 'The door is open and you can see a corridor. Tell me what you want to do now. ';    
                }
                break;
            case 'shelves':
                speechText = 'There are two shelves. There are clothes on the first one. There is a little trapdoor on the second one. Tell me what you want to do now. ';
                break;
            case 'closet':
                speechText = "The closet is small. You can see shelves and a lot of dust. Other than that it's pretty empty. Tell me what you want to do now. ";
                break;
            case 'pillow':
                if(floorObjectsRoom.indexOf('hammer') === -1 && objectsRoom.indexOf('hammer') !== -1){
                    speechText = 'The pillow is a little bulky. You take it and find a hammer. Who sleeps with a hammer under their pillow? Tell me what you want to do now. '
                    canTakeObjects.push('hammer');
                }else{
                    speechText = "It's just a pillow. Nothing else. Tell me what you want to do now. "
                }
                break;
            case 'drawer':
                if(floorObjectsRoom.indexOf('flashlight') === -1 && objectsRoom.indexOf('flashlight') !== -1){
                    speechText = "There is a flashlight inside the drawer. It doesn't have batteries. Tell me what you want to do now. "
                    canTakeObjects.push('flashlight');
                }else{
                    speechText = 'The drawer is empty. Tell me what you want to do now. ';
                }
                break;
            case 'desk':
                speechText = 'On the desk there are some papers, but nothing interesting. There is a drawer aside. Tell me what you want to do now. ';
                break;
            case 'painting':
                if(floorObjectsRoom.indexOf('key') === -1 && objectsRoom.indexOf('key') !== -1){
                    speechText = "It's a painting of the Alhambra. It's a little off the hook. "
                    + "You get closer to hang it and a key falls on the floor."
                    + " Tell me what you want to do now. "
                    canTakeObjects.push('key');
                    floorObjectsRoom.push('key');
                    conv.floorObjectsRoom = floorObjectsRoom;
                    points += 10;
                }else{
                    speechText = "The painting's still a little off the hook, but there's nothing behind it. Tell me what you want to do now. "
                }
                break;
            case 'window':
                if(roomElements.indexOf('window') === -1){
                    speechText = 'The window is made of glass. Maybe you could break it. Tell me what you want to do now. ';
                }else{
                    speechText = 'You broke the window and you fell out of it. Tell me what you want to do now. '
                }
                break;
        }
        conv.canTakeObjectsRoom = canTakeObjects;
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsRoom.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            if(item === 'cat food' && firstTime === true){
                points += 20;
                firstTime = false;
                conv.firstTimeRoom = firstTime;
            }
            let i = canTakeObjects.indexOf(item);
            canTakeObjects.splice(i,1);
            conv.canTakeObjectsRoom = canTakeObjects;
            let index = objectsRoom.indexOf(item)
            objectsRoom.splice(index,1)
            conv.objectsRoom = objectsRoom;
            if(floorObjectsRoom.indexOf(item) !== -1){
                let index2 = floorObjectsRoom.indexOf(item)
                floorObjectsRoom.splice(index2,1)
                conv.floorObjectsRoom = floorObjectsRoom;
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
        objectsRoom.push(item);
        floorObjectsRoom.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsRoom = canTakeObjects;
        conv.floorObjectsRoom = floorObjectsRoom;
        conv.objectsRoom = objectsRoom;
        return speechText;
    },
    use(object, element, conv){
        points = 0;
        let speakOutput = "You can't do that. Tell me what you want to do now. ";
        if(object === 'chair' && element === 'lamp'){
            if(floorObjectsRoom.indexOf('batteries') === -1 && objectsRoom.indexOf('batteries') !== -1){
                speakOutput = "You use the chair to see what's inside the lamp. You see some batteries. Tell me what you want to do now. ";
                canTakeObjects.push('batteries');
                conv.canTakeObjectsRoom = canTakeObjects;
            }else{
                speakOutput = "You get on the chair and see what's inside the lamp, but there's nothing. Tell me what you want to do now. ";
            }
            if(firstUse){
                points+=10;
                firstUse = false;
                conv.firstUseRoom = firstUse;
            }
        }
        if(object === 'hammer' && element === 'trapdoor'){
            if(roomElements.indexOf('trapdoor') === -1){
                speakOutput = 
                "<speak>" +
                'You break the trapdoor with the hammer.' 
                + "<audio src='https://actions.google.com/sounds/v1/impacts/small_glass_pane_shatter.ogg'/>"
                + "You see something. Wait a moment... Is that cat food? That's weird, you've never had a cat..."
                + " You can eat it or take it. Tell me what you want to do now. "
                + "</speak>";
                canTakeObjects.push('cat food');
                conv.canTakeObjectsRoom = canTakeObjects;
                roomElements.push('trapdoor');
                conv.roomElements = roomElements;
                points+=10;
            }else{
                speakOutput = 'The trapdoor is broken. Tell me what you want to do now. '
                if(floorObjectsRoom.indexOf('cat food') === -1 && objectsRoom.indexOf('cat food') !== -1){
                    speakOutput += "There's still some cat food. You can choose between taking or eating it. Tell me what you want to do now. ";
                }
            }
        }
        if(object === 'key' && element === 'door'){
            if(roomElements.indexOf('door') === -1){
                points+=10;
                speakOutput = "<speak> <audio src='https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'/>"
                + '<say-as interpret-as="interjection">Cool</say-as>'
                + '<break time = "0.5s" />'
                + ' The door is open! You can see a dark corridor. Tell me what you want to do now. </speak>';
                roomElements.push('door');
                conv.roomElements = roomElements;
            }else{
                speakOutput = 'The door is open and you see a corridor. Tell me what you want to do now. ';
            }
        }
        if(object === 'hammer' && element === 'window'){
            if(roomElements.indexOf('window') === -1){
                points -= 20;
                speakOutput = "<speak>"
                + "<audio src='https://actions.google.com/sounds/v1/impacts/crash.ogg'/> "
                + 'You broke the window with such bad luck that you fell out of it.'
                + '<break time = "0.5s" />';
                roomElements.push('window');
                conv.roomElements = roomElements;
                dead = true;
                finished = true;
            }else{
                speakOutput = 'The window is already broken. Tell me what you want to do now. ';
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
    clue(){
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
        conv.roomClue = n;
        return speakOutput;
    },
    choose(option, conv){
        points = 0;
        let speakOutput = "That action isn't possible. Tell me what you want to do now. ";
        if(roomElements.indexOf('trapdoor') !== -1 && canTakeObjects.indexOf('cat food') !== -1 && objectsRoom.indexOf('cat food') !== -1 && floorObjectsRoom.indexOf('cat food') === -1){
            if(option === 'eat'){
                speakOutput = 'You feel sick after eating that and you lose 20 points. Tell me what you want to do now. ';
                points -= 20;
                let i = canTakeObjects.indexOf('cat food');
                canTakeObjects.splice(i,1)
                conv.canTakeObjectsRoom = canTakeObjects;
                let index = objectsRoom.indexOf('cat food');
                objectsRoom.splice(index,1);
                conv.objectsRoom = objectsRoom;
            }
        }
        return{
            speak: speakOutput,
            points: points
        }
    }
    
}