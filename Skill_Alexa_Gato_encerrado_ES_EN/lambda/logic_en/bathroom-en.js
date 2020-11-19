// Objects in the room
let objectsBathroom = [];
        
// Objects in the floor of the room
let floorObjectsBathroom = [];

// Array with accomplished interactions with the objects of the room
let bathroomElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;
let firstUse;

// Number used to choose the clue
let n;

module.exports = {
    initialize(sessionAttributes){
        objectsBathroom = ['toilet paper', 'screwdriver', 'rubbing alcohol'];
        canTakeObjects = [];
        floorObjectsBathroom = [];
        bathroomElements = [];
        firstTime = true;
        firstUse = true;
        points = 0;
        n = 0;
        
        sessionAttributes['objectsBathroomEn'] = objectsBathroom;
        sessionAttributes['floorObjectsBathroomEn'] = floorObjectsBathroom;
        sessionAttributes['canTakeObjectsBathroomEn'] = canTakeObjects;
        sessionAttributes['bathroomElementsEn'] = bathroomElements;
        sessionAttributes['firstTimeBathroomEn'] = firstTime;
        sessionAttributes['firstUseBathroomEn'] = firstUse;
        sessionAttributes['bathroomClueEn'] = n;
    },
    continueGame(sessionAttributes){
        objectsBathroom = sessionAttributes['objectsBathroomEn'];
        floorObjectsBathroom = sessionAttributes['floorObjectsBathroomEn'];
        canTakeObjects = sessionAttributes['canTakeObjectsBathroomEn'];
        bathroomElements = sessionAttributes['bathroomElementsEn'];
        firstTime = sessionAttributes['firstTimeBathroomEn'];
        firstUse = sessionAttributes['firstUseBathroomEn'];
        points = sessionAttributes['bathroomClueEn']; 
        n = 0;
    },
    getRoom(){
        let room = 'bathroom';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'north':
                speechText = 'In front of you there is a mirror and a sink.';
                break;
            case 'south':
                speechText = "Behind you it's the washing room.";
                break;
            case 'east':
                speechText = "To the right there is a toilet. It's probably the origin of the bad smell.";
                break;
            case 'west':
                speechText = 'To the left there is a glass window. The light enters through it. There is also a first-aid kit.';
                break;
            case 'up':
                speechText = 'You can see the ceiling. There are some cobwebs and a spider over them.';
                break;
            case 'down':
                if(floorObjectsBathroom.length === 0){
                    speechText = "It's the floor. It's pretty dirty and you can see some footprints."
                }else{
                    speechText = 'Besides the footprints, you find: ' + floorObjectsBathroom;
                }
                break;
        }
        return speechText;
    },
    interaction(object, sessionAttributes){
        let speechText = "There's nothing interesting about it. ";
        points = 0;
        switch(object){
            case 'sink':
                speechText = "It's a normal sink. You try to wash your face, but it doesn't work. ";
                break;
            case 'mirror':
                speechText = 'You look yourself in the mirror and you get scared of your scruffy appearance. ';
                break;
            case 'window':
                if(bathroomElements.indexOf('window') === -1){
                    speechText = "It's a glass window. You can see something behind, but you can't open it.";
                }else{
                    speechText = 'The window is broken.'; 
                    if(floorObjectsBathroom.indexOf('toilet paper') === -1 && objectsBathroom.indexOf('toilet paper') !== -1){
                        speechText += " There is a roll of toilet paper. It was hidden. Thank God you didn't need it urgently."
                    }
                }
                break;
            case 'first-aid kit':
                if(floorObjectsBathroom.indexOf('rubbing alcohol') === -1 && objectsBathroom.indexOf('rubbing alcohol') !== -1){
                    speechText = 'You open the first-aid kit and see a bottle of rubbing alcohol.';
                    canTakeObjects.push('rubbing alcohol');
                    sessionAttributes['canTakeObjectsBathroomEn'] = canTakeObjects;
                }else{
                    speechText = "There's nothing inside the first-aid kit."
                }
                break;
            case 'toilet':
                if(floorObjectsBathroom.indexOf('screwdriver') === -1 && objectsBathroom.indexOf('screwdriver') !== -1){
                    speechText = "You don't want to do it, but you look inside the toilet. There is a screwdriver.";
                    canTakeObjects.push('screwdriver');
                    sessionAttributes['canTakeObjectsBathroomEn'] = canTakeObjects;
                    if(firstUse){
                        points += 10;
                        firstUse = false;
                        sessionAttributes['firstUseBathroomEn'] = firstUse;
                    }
                }else{
                    speechText = "Luckily there's nothing else inside the toilet."
                }
                break;
            case 'spider':
                speechText = "You look to the spider in the ceiling. It's like the spider was also looking at you. You feel a shiver running down your body.";
                break;
            case 'footprints':
                speechText = 'They look like the footprints of a pet.';       
                break;
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsBathroom.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsBathroom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.';
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsBathroomEn'] = canTakeObjects;
            // Esto hace que solo la lea al cogerla en el baño
            if(item === 'toilet paper'){
                speechText += ' You read the symbols that are written in the toilet paper. '
                    + "A tree, a cloud, a bonfire and a river.";
                if(firstTime){
                    points += 10;
                    firstTime = false;
                    sessionAttributes['firstTimeBathroomEn'] = firstTime;
                }
            }
            let index = objectsBathroom.indexOf(item)
            objectsBathroom.splice(index,1)
            sessionAttributes['objectsBathroomEn'] = objectsBathroom;
            if(floorObjectsBathroom.indexOf(item) !== -1){
                let index2 = floorObjectsBathroom.indexOf(item)
                floorObjectsBathroom.splice(index2,1)
                sessionAttributes['floorObjectsBathroomEn'] = floorObjectsBathroom;
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
        objectsBathroom.push(item);
        floorObjectsBathroom.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsBathroomEn'] = canTakeObjects;
        sessionAttributes['floorObjectsBathroomEn'] = floorObjectsBathroom;
        sessionAttributes['objectsBathroomEn'] = objectsBathroom;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = "You can't do that.";
        if(object === 'hammer' && element === 'window'){
            if(bathroomElements.indexOf('window') === -1){
                speakOutput = 'You break the glass window with the hammer.' 
                + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                + "You see a roll of toilet paper. It's something written in it.";
                bathroomElements.push('window');
                sessionAttributes['bathroomElementsEn'] = bathroomElements;
                canTakeObjects.push('toilet paper');
                sessionAttributes['canTakeObjectsBathroomEn'] = canTakeObjects;
                points += 10;
            }else{
                speakOutput = 'The window is broken. '
                if(floorObjectsBathroom.indexOf('toilet paper') === -1 && objectsBathroom.indexOf('toilet paper') !== -1){
                    speakOutput += 'There is a roll of toilet paper.';
                }
            }
        }
        
        return{
            speakOutput: speakOutput,
            points: points
        }        
    },
    go(place){
        let speakOutput = "You can't go there. ";
        let r = 'bathroom';
        if(place === 'washing room'){
            speakOutput = 'Now you are in the washing room. ';
            r = 'washing room';
        } 
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = "I know it's not a nice idea, but you can find some answers inside the toilet. ";
            n = 1;
        }else if(n === 1){
            speakOutput = "Maybe now it's a good idea to break the window. ";
            n = 2;
        }else if(n === 2){
            speakOutput = "There's something special in the first-aid kit. ";
            n = 0;
        }
        sessionAttributes['bathroomClueEn'] = n;
        return speakOutput;
    }
}