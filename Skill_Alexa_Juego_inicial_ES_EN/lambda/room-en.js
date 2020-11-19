let room = 'bedroom';

// Objects in the room
let objectsRoom = [];
        
// Objects in the floor of the rooms
let floorObjectsRoom = [];

// Array with accomplished interactions with the objects of the rooms
let roomElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects = new Map();

// Variable that indicates if there is enough light to explore the room
let light; 

// Points in this room
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

module.exports = {
    initialize(){
        light = false;
        objectsRoom = ['key', 'hammer', 'cat food', 'chair'];
        floorObjectsRoom = ['chair']
        canTakeObjects.set('key',false);
        canTakeObjects.set('hammer',false);
        canTakeObjects.set('cat food',false);
        canTakeObjects.set('chair',true);
        roomElements = [];
        points = 0;
        firstTime = true;
        dead = false;
        finished = false;
    },
    getRoom(){
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
                        speechText = "It's just the floor. Nothing interesting."
                    }else{
                        speechText = 'On the ground you find: ' + floorObjectsRoom;
                    }
                    break;
            }
        }else{
            if(room === 'bedroom'){
                speechText = 'The low light coming in through the window lets you see a switch on the wall...'; 
            }
        }           
        return speechText;
    },
    interaction(object){
        let speechText = '';
        points = 0;
        switch(object){
            case 'bed':
                speechText = 'Your bed has nothing special. The sheets are a a little sweaty.'
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
                    roomElements.push('switch');
                    points += 10;
                }else{
                    speechText = "You've already pressed it. Unlike cats you can't see in the dark, so you better don't press it again."
                }
                break;
            case 'lamp':
                speechText = "The lamp is really high and you can't see it well."
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
                    if(/*inventory.indexOf('cat food') === -1 &&*/ floorObjectsRoom.indexOf('cat food') === -1 && objectsRoom.indexOf('cat food') !== -1){
                        speechText += " There is cat food. It's a curious place to keep it. You can eat or keep it."
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
                    speechText = 'The door is open.';    
                }
                break;
            case 'shelf':
                speechText = 'There are two shelves. There are clothes on the first one. There is a little trapdoor on the second one.'
                break;
            case 'closet':
                speechText = "The closet is small. You can see shelves and a lot of dust. Other than that it's pretty empty."
                break;
            case 'pillow':
                if(/*inventory.indexOf('hammer') === -1 &&*/ floorObjectsRoom.indexOf('hammer') === -1 && objectsRoom.indexOf('hammer') !== -1){
                    speechText = 'The pillow is a little bulky. You take it and find a hammer. Who sleeps with a hammer under their pillow?'
                    canTakeObjects.set('hammer',true);
                }else{
                    speechText = "It's just a pillow. Nothing else."
                }
                break;
            case 'drawer':
                speechText = 'The drawer is empty.'
                break;
            case 'desk':
                speechText = 'On the desk there are some papers, but nothing interesting. There is a drawer aside.'
                break;
            case 'painting':
                if(/*inventory.indexOf('key') === -1 &&*/ floorObjectsRoom.indexOf('key') === -1 && objectsRoom.indexOf('key') !== -1){
                    speechText = "<speak>"
                    + "It's a painting of the Alhambra. It's a little off the hook. "
                    + "<audio src='soundbank://soundlibrary/metal/metal_12'/>"
                    + "You get closer to hang it and a key falls on the floor."
                    + "</speak>"
                    canTakeObjects.set('key',true);
                    floorObjectsRoom.push('key');
                }else{
                    speechText = "The painting's still a little off the hook, but there's nothing behind it."
                }
                break;
            case 'window':
                if(roomElements.indexOf('window') === -1){
                    speechText = "It's a glass window. Maybe you could use something to break it.";
                }else{
                    speechText = 'You broke the window and fell through it.'
                }
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    take(item){
        let speechText = '';
        points = 0;
        if(objectsRoom.indexOf(item) !== -1 && canTakeObjects.get(item) === true){
            speechText = 'You put ' + item + ' inside the inventory.'  
            if(item === 'cat food' && firstTime === true){
                points += 20;
                firstTime = false;
            }
            canTakeObjects.set(item,false)
            let index = objectsRoom.indexOf(item)
            objectsRoom.splice(index,1)
            if(floorObjectsRoom.indexOf(item) !== -1){
                let index2 = floorObjectsRoom.indexOf(item)
                floorObjectsRoom.splice(index2,1)
            }
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    release(item){
        let speechText = 'You put ' + item + ' in ' + room; 
        objectsRoom.push(item);
        floorObjectsRoom.push(item);
        canTakeObjects.set(item,true)
        return speechText;
    },
    use(object, element){
        points = 0;
        let speakOutput = '';
        if(object === 'chair' && element === 'lamp'){
            speakOutput = "You use the chair to see what's inside the lamp, but there's nothing.";
            points+=10;
        }
        if(object === 'hammer' && element === 'trapdoor'){
            if(roomElements.indexOf('trapdoor') === -1){
                speakOutput = "<speak>" +
                'You break the trapdoor with the hammer.' 
                + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                + "You see something. Wait a moment... Is that cat food? That's weird, you've never had a cat..."
                + 'You can keep or eat the food.'
                + "</speak>"; 
                canTakeObjects.set('cat food',true);
                roomElements.push('trapdoor');
                points+=10;
            }else{
                speakOutput = 'The trapdoor is broken. '
                if(/*inventory.indexOf('cat food') === -1 && */floorObjectsRoom.indexOf('cat food') === -1 && objectsRoom.indexOf('cat food') !== -1){
                    speakOutput += "There's still some cat food. You can keep or eat it.";
                }
            }
        }
        if(object === 'key' && element === 'door'){
            if(roomElements.indexOf('door') === -1){
                points+=10;
                speakOutput = "<speak>"
                + "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                + '<say-as interpret-as="interjection">Cool</say-as>'
                + '<break time = "0.5s" />';
                this.initialize();
                roomElements.push('door');
                finished = true;
            }else{
                speakOutput = 'The door is already open.';
            }
        }
        if(object === 'hammer' && element === 'window'){
            if(roomElements.indexOf('window') === -1){
                points -= 20;
                speakOutput = "<speak>"
                + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                + "You broke the window with such bad luck that you fell through it"
                + '<break time = "0.5s" />';
                roomElements.push('window');
                this.initialize();
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
    clue(){
        let speakOutput = 'That painting could have something interesting besides being so beautiful.';
        return speakOutput;
    },
    choose(option){
        points = 0;
        let speakOutput = '';
        let take = false;
        if(roomElements.indexOf('trapdoor') !== -1 && canTakeObjects.get('cat food') === true && objectsRoom.indexOf('cat food') !== -1 /*&& inventory.indexOf('comida de gato') === -1*/ && floorObjectsRoom.indexOf('cat food') === -1){
            if(option === 'eat'){
                speakOutput = 'You feel sick after eating the food and you lose 20 points';
                points -= 20;
                canTakeObjects.set('cat food',false);
                let index = objectsRoom.indexOf('cat food');
                objectsRoom.splice(index,1);
            }else if(option === 'keep'){
                take = true;
                //speakOutput = this.take('comida de gato').speechText;
            }
        }
        return{
            speakOutput: speakOutput,
            points: points,
            take: take
        }
    }
    
}