// Objects in the room
let objectsHall = [];
        
// Objects in the floor of the room
let floorObjectsHall = [];

// Array with accomplished interactions with the objects of the room
let hallElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;

// Number used to choose the clue
let n;

// Boolean to know if the game has been finished
let finished;

module.exports = {
    initialize(conv){
        objectsHall = ['poison', 'golden key', 'cat'];
        floorObjectsHall = [];
        hallElements = [];
        canTakeObjects = [];
        finished = false;
        firstTime = true;
        points = 0;
        n = 0;
        
        conv.objectsHall = objectsHall;
        conv.floorObjectsHall = floorObjectsHall;
        conv.hallElements = hallElements;
        conv.canTakeObjectsHall = canTakeObjects;
        conv.firstTimeHall = firstTime;
        conv.hallClue = n;
    },
    continueGame(conv){
        objectsHall = conv.objectsHall;
        floorObjectsHall = conv.floorObjectsHall;
        hallElements = conv.hallElements;
        canTakeObjects = conv.canTakeObjectsHall;
        finished = conv.finished;
        firstTime = conv.firstTimeHall;
        points = 0;
        n = conv.hallClue;
    },
    getRoom(){
        let room = 'hall';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'north':
                speechText = 'You can see a very big door.';
                break;
            case 'south':
                speechText = 'Behind you is the secret room.'
                break;
            case 'east':
                speechText = 'To the right there is a table.'
                break;
            case 'west':
                speechText = 'To the left you see a painting hanging on the wall.'
                break;
            case 'up':
                speechText = "It's just the ceiling. Nothing interesting. Curiously, there's light in the room, but there aren't any windows or lamps." 
                break;
            case 'down':
                if(floorObjectsHall.length === 0){
                    speechText = 'The ground is covered by a viscous liquid. It seems vomit. Oh, no! Next to that puddle you see the corpse of a white cat. '
                }else{
                    speechText = 'The ground is covered by a viscous liquid. It seems vomit. Oh, no! Next to that puddle you see the corpse of a white cat. Besides, on the ground you find: ' + floorObjectsHall;
                }
                break;
        }
        return speechText;
    },
    interaction(object, conv){
        let speechText = "There's nothing interesting about it. Tell me what you want to do now. ";
        points = 0;
        switch(object){
            case 'door':
                if(hallElements.indexOf('door') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                    + 'The door is closed. Tell me what you want to do now. '
                    + "</speak>";
                }else{
                    speechText = 'The door is open. Tell me what you want to do now. ';    
                }
                break;
            case 'table':
                speechText = 'You get closer to the table and see a bunch of papers. One of them is a data sheet of a cat. You read it carefully. Name: Whity, Age: 3 years, Allergies: tuna. Tell me what you want to do now. '
                break;
            case 'painting':
                if(hallElements.indexOf('painting') === -1){
                    speechText = " <speak> It's a painting of a white cat. Its pupils are dilated and the image seems to beg you to pet it. "
                    + '<audio src="https://actions.google.com/sounds/v1/horror/synthetic_insects.ogg"/>'
                    + "The ghost you saw before comes out of the painting and stands in front of you. It's the cat of the painting, the dead cat whose body is on the floor. "
                    + 'It looks at you and leaves something on the ground: a bottle of poison. You have two options: drink it or spill it. Tell me what you want to do now. </speak>'
                    hallElements.push('painting');
                    floorObjectsHall.push('poison');
                    canTakeObjects.push('poison');
                    conv.canTakeObjectsHall = canTakeObjects;
                    conv.floorObjectsHall = floorObjectsHall;
                    conv.hallElements = hallElements;
                    points += 10;
                }else{
                    speechText = "It's a painting of a white cat. Its pupils are dilated and the image seems to beg you to pet it even though it's just a painting. Tell me what you want to do now. "
                }
                break;
            case 'corpse':
                speechText = "It's a cat corpse. It's been here for a while. The vomit on the floor seems to have been tuna in the past. Poor kitty. Obviously, someone poisoned it. Tell me what you want to do now. ";
                break;
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsHall.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsHall.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsHall = canTakeObjects;
            let index = objectsHall.indexOf(item)
            objectsHall.splice(index,1)
            conv.objectsHall = objectsHall;
            if(item === 'cat' && firstTime){
                points += 50;
                firstTime = false;
                conv.firstTimeHall = firstTime;
            }
            if(floorObjectsHall.indexOf(item) !== -1){
                let index2 = floorObjectsHall.indexOf(item)
                floorObjectsHall.splice(index2,1)
                conv.floorObjectsHall = floorObjectsHall;
            }
            success = true;
        }
        if(item === 'key' && objectsHall.indexOf(item) === -1 && objectsHall.indexOf('golden key') !== -1){
            speechText += ' Maybe you meant golden key. ';
        }
        return {
            speechText: speechText,
            points: points,
            success: success
        }
    },
    release(item, conv){
        let speechText = 'You drop ' + item + ' in the hall. '; 
        objectsHall.push(item);
        floorObjectsHall.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsHall = canTakeObjects;
        conv.floorObjectsHall = floorObjectsHall;
        conv.objectsHall = objectsHall;
        return speechText;
    },
    use(object, element, conv){
        points = 0;
        let speakOutput = "You can't do that.";
        if(object === 'golden key' && element === 'door'){
            if(hallElements.indexOf('door') === -1){
                points+=10;
                speakOutput = "<speak> <audio src='https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'/>"
                + '<say-as interpret-as="interjection">Amazing</say-as>'
                + '<break time = "0.5s" />'
                + ' The door is open! You escaped. ';
                hallElements.push('door');
                conv.hallElements = hallElements;
                finished = true;
            }else{
                speakOutput = 'The door is already open.';
            }
        }
        return{
            speakOutput: speakOutput,
            finished: finished,
            points: points
        }        
    },
    go(place){
        let speakOutput = "You can't go there. ";
        let r = 'hall';
        
        if(place === 'secret room'){
            speakOutput = 'Now you are in the secret room.';
            r = 'secret room';
        }
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'Did you look at the painting? ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'The less logic option can also be the most right. ';
            n = 0;
        }
        conv.hallClue = n;
        return speakOutput;
    },
    choose(option, conv){
        points = 0;
        let speakOutput = '';
        if(hallElements.indexOf('painting') !== -1 && canTakeObjects.indexOf('poison') !== -1 && objectsHall.indexOf('poison') !== -1 && floorObjectsHall.indexOf('poison') !== -1){
            if(option === 'drink'){
                speakOutput = ' <speak> You drink the poison. The ghost cat seems happy because you are joining it. It leaves a golden key in front of you. '
                + "<audio src='https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg'/> Tell me what you want to do now. </speak>";
                points += 30;
                let i = canTakeObjects.indexOf('poison')
                canTakeObjects.splice(i,1)
                let index = objectsHall.indexOf('poison');
                objectsHall.splice(index,1);
                conv.objectsHall = objectsHall;
                let index2 = floorObjectsHall.indexOf('poison');
                floorObjectsHall.splice(index2,1);
                canTakeObjects.push('golden key');
                floorObjectsHall.push('golden key');
                canTakeObjects.push('cat');
                floorObjectsHall.push('cat');
                conv.canTakeObjectsHall = canTakeObjects;
                conv.floorObjectsHall = floorObjectsHall;
            }else if(option === 'spill'){
                speakOutput = " <speak> The ghost cat is mad at you because you've just rejected its gift. It wanted you to join it. It starts to scream really loud. "
                + '<audio src="https://actions.google.com/sounds/v1/horror/monster_alien_grunt_hiss.ogg"/>'
                + " You can't stand it and you faint."
                finished = true;
                conv.dead = true;
                points -= 30;
            }
        }
        return{
            speakOutput: speakOutput,
            points: points,
            finished: finished
        }
    }
    
}