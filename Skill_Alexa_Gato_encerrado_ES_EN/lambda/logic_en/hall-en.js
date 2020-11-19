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
    initialize(sessionAttributes){
        objectsHall = ['poison', 'golden key', 'cat'];
        floorObjectsHall = [];
        hallElements = [];
        canTakeObjects = [];
        finished = false;
        firstTime = true;
        points = 0;
        n = 0;
        
        sessionAttributes['objectsHallEn'] = objectsHall;
        sessionAttributes['floorObjectsHallEn'] = floorObjectsHall;
        sessionAttributes['hallElementsEn'] = hallElements;
        sessionAttributes['canTakeObjectsHallEn'] = canTakeObjects;
        sessionAttributes['firstTimeHallEn'] = firstTime;
        sessionAttributes['hallClueEn'] = n;
    },
    continueGame(sessionAttributes){
        objectsHall = sessionAttributes['objectsHallEn'];
        floorObjectsHall = sessionAttributes['floorObjectsHallEn'];
        hallElements = sessionAttributes['hallElementsEn'];
        canTakeObjects = sessionAttributes['canTakeObjectsHallEn'];
        finished = sessionAttributes['finishedEn'];
        firstTime = sessionAttributes['firstTimeHallEn'];
        points = 0;
        n = sessionAttributes['hallClueEn'];
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
    interaction(object, sessionAttributes){
        let speechText = "There's nothing interesting about it. ";
        points = 0;
        switch(object){
            case 'door':
                if(hallElements.indexOf('door') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                    + 'The door is closed.'
                    + "</speak>";
                }else{
                    speechText = 'The door is open.';    
                }
                break;
            case 'table':
                speechText = 'You get closer to the table and see a bunch of papers. One of them is a data sheet of a cat. You read it carefully. Name: Whity, Age: 3 years, Allergies: tuna.'
                break;
            case 'painting':
                if(hallElements.indexOf('painting') === -1){
                    speechText = "It's a painting of a white cat. Its pupils are dilated and the image seems to beg you to pet it. "
                    + '<audio src="soundbank://soundlibrary/horror/horror_04"/>'
                    + "The ghost you saw before comes out of the painting and stands in front of you. It's the cat of the painting, the dead cat whose body is on the floor. "
                    + 'It looks at you and leaves something on the ground: a bottle of poison. You have two options: drink it or spill it. '
                    + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_meow_1x_01"/>';
                    hallElements.push('painting');
                    floorObjectsHall.push('poison');
                    canTakeObjects.push('poison');
                    sessionAttributes['canTakeObjectsHallEn'] = canTakeObjects;
                    sessionAttributes['floorObjectsHallEn'] = floorObjectsHall;
                    sessionAttributes['hallElementsEn'] = hallElements;
                    points += 10;
                }else{
                    speechText = "It's a painting of a white cat. Its pupils are dilated and the image seems to beg you to pet it even though it's just a painting. "
                }
                break;
            case 'corpse':
                speechText = "It's a cat corpse. It's been here for a while. The vomit on the floor seems to have been tuna in the past. Poor kitty. Obviously, someone poisoned it. ";
                break;
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsHall.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsHall.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsHallEn'] = canTakeObjects;
            let index = objectsHall.indexOf(item)
            objectsHall.splice(index,1)
            sessionAttributes['objectsHallEn'] = objectsHall;
            if(item === 'cat' && firstTime){
                points += 50;
                firstTime = false;
                sessionAttributes['firstTimeHallEn'] = firstTime;
            }
            if(floorObjectsHall.indexOf(item) !== -1){
                let index2 = floorObjectsHall.indexOf(item)
                floorObjectsHall.splice(index2,1)
                sessionAttributes['floorObjectsHallEn'] = floorObjectsHall;
            }
            success = true;
        }
        if(item === 'key' && objectsHall.indexOf(item) === -1 && objectsHall.indexOf('golden key') !== -1){
            speechText += ' Maybe you meant golden key.';
        }
        return {
            speechText: speechText,
            points: points,
            success: success
        }
    },
    release(item, sessionAttributes){
        let speechText = 'You drop ' + item + ' in the hall. '; 
        objectsHall.push(item);
        floorObjectsHall.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsHallEn'] = canTakeObjects;
        sessionAttributes['floorObjectsHallEn'] = floorObjectsHall;
        sessionAttributes['objectsHallEn'] = objectsHall;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = "You can't do that.";
        if(object === 'golden key' && element === 'door'){
            if(hallElements.indexOf('door') === -1){
                points+=10;
                speakOutput = "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                + '<say-as interpret-as="interjection">Amazing</say-as>'
                + '<break time = "0.5s" />'
                + ' The door is open! You escaped. ';
                hallElements.push('door');
                sessionAttributes['hallElementsEn'] = hallElements;
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
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'Did you look at the painting? ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'The less logic option can also be the most right. ';
            n = 0;
        }
        sessionAttributes['hallClueEn'] = n;
        return speakOutput;
    },
    choose(option, sessionAttributes){
        points = 0;
        let speakOutput = '';
        if(hallElements.indexOf('painting') !== -1 && canTakeObjects.indexOf('poison') !== -1 && objectsHall.indexOf('poison') !== -1 && floorObjectsHall.indexOf('poison') !== -1){
            if(option === 'drink'){
                speakOutput = 'You drink the poison. The ghost cat seems happy because you are joining it. It leaves a golden key in front of you. '
                + "<audio src='soundbank://soundlibrary/metal/metal_12'/>";
                points += 30;
                let i = canTakeObjects.indexOf('poison')
                canTakeObjects.splice(i,1)
                let index = objectsHall.indexOf('poison');
                objectsHall.splice(index,1);
                sessionAttributes['objectsHallEn'] = objectsHall;
                let index2 = floorObjectsHall.indexOf('poison');
                floorObjectsHall.splice(index2,1);
                canTakeObjects.push('golden key');
                floorObjectsHall.push('golden key');
                canTakeObjects.push('cat');
                floorObjectsHall.push('cat');
                sessionAttributes['canTakeObjectsHallEn'] = canTakeObjects;
                sessionAttributes['floorObjectsHallEn'] = floorObjectsHall;
            }else if(option === 'spill'){
                speakOutput = "The ghost cat is mad at you because you've just rejected its gift. It wanted you to join it. It starts to scream really loud. "
                + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_01"/>'
                + " You can't stand it and you faint."
                finished = true;
                sessionAttributes['deadEn'] = true;
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