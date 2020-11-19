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
    initialize(conv){
        objectsBathroom = ['toilet paper', 'screwdriver', 'rubbing alcohol'];
        canTakeObjects = [];
        floorObjectsBathroom = [];
        bathroomElements = [];
        firstTime = true;
        firstUse = true;
        points = 0;
        n = 0;
        
        conv.objectsBathroom = objectsBathroom;
        conv.floorObjectsBathroom = floorObjectsBathroom;
        conv.canTakeObjectsBathroom = canTakeObjects;
        conv.bathroomElements = bathroomElements;
        conv.firstTimeBathroom = firstTime;
        conv.firstUseBathroom = firstUse;
        conv.bathroomClue = n;
    },
    continueGame(conv){
        objectsBathroom = conv.objectsBathroom;
        floorObjectsBathroom = conv.floorObjectsBathroom;
        canTakeObjects = conv.canTakeObjectsBathroom;
        bathroomElements = conv.bathroomElements;
        firstTime = conv.firstTimeBathroom;
        firstUse = conv.firstUseBathroom;
        points = 0; 
        n = conv.bathroomClue;
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
    interaction(object, conv){
        let speechText = "There's nothing interesting about it. Tell me what you want to do now. ";
        points = 0;
        switch(object){
            case 'sink':
                speechText = "It's a normal sink. You try to wash your face, but it doesn't work. Tell me what you want to do now. ";
                break;
            case 'mirror':
                speechText = 'You look yourself in the mirror and you get scared of your scruffy appearance. Tell me what you want to do now. ';
                break;
            case 'window':
                if(bathroomElements.indexOf('window') === -1){
                    speechText = "It's a glass window. You can see something behind, but you can't open it.";
                }else{
                    speechText = 'The window is broken.'; 
                    if(floorObjectsBathroom.indexOf('toilet paper') === -1 && objectsBathroom.indexOf('toilet paper') !== -1){
                        speechText += " There is a roll of toilet paper. It was hidden. Thank God you didn't need it urgently."
                    }
                    speechText += ' Tell me what you want to do now. ';
                }
                break;
            case 'first-aid kit':
                if(floorObjectsBathroom.indexOf('rubbing alcohol') === -1 && objectsBathroom.indexOf('rubbing alcohol') !== -1){
                    speechText = 'You open the first-aid kit and see a bottle of rubbing alcohol. Tell me what you want to do now. ';
                    canTakeObjects.push('rubbing alcohol');
                    conv.canTakeObjectsBathroom = canTakeObjects;
                }else{
                    speechText = "There's nothing inside the first-aid kit. Tell me what you want to do now. "
                }
                break;
            case 'toilet':
                if(floorObjectsBathroom.indexOf('screwdriver') === -1 && objectsBathroom.indexOf('screwdriver') !== -1){
                    speechText = "You don't want to do it, but you look inside the toilet. There is a screwdriver. Tell me what you want to do now. ";
                    canTakeObjects.push('screwdriver');
                    conv.canTakeObjectsBathroom = canTakeObjects;
                    if(firstUse){
                        points += 10;
                        firstUse = false;
                        conv.firstUseBathroom = firstUse;
                    }
                }else{
                    speechText = "Luckily there's nothing else inside the toilet. Tell me what you want to do now. "
                }
                break;
            case 'spider':
                speechText = "You look to the spider in the ceiling. It's like the spider was also looking at you. You feel a shiver running down your body. Tell me what you want to do now. ";
                break;
            case 'footprints':
                speechText = 'They look like the footprints of a pet. Tell me what you want to do now. ';       
                break;
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsBathroom.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsBathroom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.';
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsBathroom = canTakeObjects;
            // Esto hace que solo la lea al cogerla en el baño
            if(item === 'toilet paper'){
                speechText += ' You read the symbols that are written in the toilet paper. '
                    + "A tree, a cloud, a bonfire and a river.";
                if(firstTime){
                    points += 10;
                    firstTime = false;
                    conv.firstTimeBathroom = firstTime;
                }
            }
            let index = objectsBathroom.indexOf(item)
            objectsBathroom.splice(index,1)
            conv.objectsBathroom = objectsBathroom;
            if(floorObjectsBathroom.indexOf(item) !== -1){
                let index2 = floorObjectsBathroom.indexOf(item)
                floorObjectsBathroom.splice(index2,1)
                conv.floorObjectsBathroom = floorObjectsBathroom;
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
        objectsBathroom.push(item);
        floorObjectsBathroom.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsBathroom = canTakeObjects;
        conv.floorObjectsBathroom = floorObjectsBathroom;
        conv.objectsBathroom = objectsBathroom;
        return speechText;
    },
    use(object, element, conv){
        points = 0;
        let speakOutput = "You can't do that. Tell me what you want to do now. ";
        if(object === 'hammer' && element === 'window'){
            if(bathroomElements.indexOf('window') === -1){
                speakOutput = '<speak> You break the glass window with the hammer.' 
                + "<audio src='https://actions.google.com/sounds/v1/impacts/small_glass_pane_shatter.ogg'/>"
                + "You see a roll of toilet paper. It's something written in it. Tell me what you want to do now. </speak>";
                bathroomElements.push('window');
                conv.bathroomElements = bathroomElements;
                canTakeObjects.push('toilet paper');
                conv.canTakeObjectsBathroom = canTakeObjects;
                points += 10;
            }else{
                speakOutput = 'The window is broken. '
                if(floorObjectsBathroom.indexOf('toilet paper') === -1 && objectsBathroom.indexOf('toilet paper') !== -1){
                    speakOutput += 'There is a roll of toilet paper.';
                }
                speakOutput += ' Tell me what you want to do now. '
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
    clue(){
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
        conv.bathroomClue = n;
        return speakOutput;
    }
}