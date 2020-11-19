// Objects in the room
let objectsCourt = [];
        
// Objects in the floor of the room
let floorObjectsCourt = [];

// Array with accomplished interactions with the objects of the room
let courtElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;
let firstTry;

// Indicates if the mouse can be taken
let mouse;

// Number used to choose the clue
let n;

module.exports = {
    initialize(conv){
        objectsCourt = ['toy mouse', 'player'];
        floorObjectsCourt = ['player']
        canTakeObjects = ['player'];
        courtElements = [];
        firstTime = true;
        firstTry = true;
        mouse = true;
        points = 0;
        n = 0;
        
        conv.objectsCourt = objectsCourt;
        conv.floorObjectsCourt = floorObjectsCourt;
        conv.canTakeObjectsCourt = canTakeObjects;
        conv.courtElements = courtElements;
        conv.firstTimeCourt = firstTime;
        conv.firstTryCourt = firstTry;
        conv.mouse = mouse;
        conv.courtyardClue = n;
    },
    continueGame(conv){
        objectsCourt = conv.objectsCourt;
        floorObjectsCourt = conv.floorObjectsCourt;
        canTakeObjects = conv.canTakeObjectsCourt;
        courtElements = conv.courtElements;
        firstTime = conv.firstTimeCourt;
        firstTry = conv.firstTryCourt;
        mouse = conv.mouse;  
        points = 0;
        n = conv.courtyardClue;
    },
    getRoom(){
        let room = 'courtyard';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'north':
                speechText = 'You can see another door.';
                break;
            case 'south':
                speechText = 'You can see the washing room.';
                break;
            case 'east':
                speechText = 'To the east there is a table.';
                break;
            case 'west':
                speechText = 'To the west you can see a hole in the wall.';
                break;
            case 'up':
                speechText = "You can see the sky. It's getting dark, but there's still enough light to see. ";
                break;
            case 'down':
                if(floorObjectsCourt.length === 0){
                    speechText = "It's the floor. You can see some footprints again.";
                }else{
                    speechText = 'Besides the footprints, you find: ' + floorObjectsCourt;
                    if(floorObjectsCourt.indexOf('toy mouse') !== -1){
                        if(!mouse){
                            speechText += "The toy mouse is broken. You can't take it. ";
                        }else{
                            speechText += 'You can take or squeeze the mouse.';
                        }    
                    }
                }
                break;
        }
        return speechText;
    },
    interaction(object, conv){
        let speechText = "There's nothing interesting about it. Tell me what you want to do now. ";
        points = 0;
        switch(object){
            case 'table':
                speechText = "It's a wood table. There's a tray on it. Tell me what you want to do now. ";
                break;
            case 'tray':
                speechText = 'The tray is full of chocolate cookies. Some of them are bitten. There are crumbs everywhere. Tell me what you want to do now. ';
                break;
            case 'hole':
                if(courtElements.indexOf('hole') === -1){
                    speechText = 'You approach to the hole. Suddenly a toy mouse appears and starts rotating on the floor. It stops after a while. You can take or squeeze the toy mouse. Tell me what you want to do now. ';
                    courtElements.push('hole')
                    floorObjectsCourt.push('toy mouse')
                    canTakeObjects.push('toy mouse')
                    conv.canTakeObjectsCourt = canTakeObjects;
                    conv.floorObjectsCourt = floorObjectsCourt;
                    conv.courtElements = courtElements;
                }else{
                    speechText = 'There is nothing inside the hole. Tell me what you want to do now. ' 
                }
                break;
            case 'footprints':
                speechText = 'They are the footprints of a pet. There are crumbs next to them. Tell me what you want to do now. ';    
                break;
            case 'door':
                if(courtElements.indexOf('door') === -1){
                    speechText = "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                    + "It's a metal door and it's closed. There are four symbols on it: air, water, earth y fire. "
                    + 'You need to press them to open the door. To try a combination, say press and the order of the symbols.  Tell me what you want to do now. '
                    + "</speak>";
                }else{
                    speechText = 'The door is open and you see a living room.  Tell me what you want to do now. ';    
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
        if(objectsCourt.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsCourt.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            if(item === 'toy mouse' && firstTime === true){
                points += 20;
                firstTime = false;
                conv.firstTimeCourt = firstTime;
            }
            if(item === 'player'){
                speechText = ' You take the mp3 player and start to listen to a voice that sounds familiar. '
                + " Go into the unknown. Don't forget the threads that interweave and form a whole.";
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsCourt = canTakeObjects;
            let index = objectsCourt.indexOf(item)
            objectsCourt.splice(index,1)
            conv.objectsCourt = objectsCourt;
            if(floorObjectsCourt.indexOf(item) !== -1){
                let index2 = floorObjectsCourt.indexOf(item)
                floorObjectsCourt.splice(index2,1)
                conv.floorObjectsCourt = floorObjectsCourt;
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
        objectsCourt.push(item);
        floorObjectsCourt.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsCourt = canTakeObjects;
        conv.floorObjectsCourt = floorObjectsCourt;
        conv.objectsCourt = objectsCourt;
        return speechText;
    },
    pushSymbol(symbol, symbol2, symbol3, symbol4, conv){
        let speakOutput = symbol + ' ' + symbol2 + ' ' + symbol3 + ' ' + symbol4
                        + " That's not the code. Keep trying. Tell me what you want to do now. ";
        points = 0;
        
        if(courtElements.indexOf('door') !== -1){
            speakOutput = "You have already opened the door. There is a living room. Tell me what you want to do now. ";
        }
        if(symbol === 'earth' && symbol2 === 'air' && symbol3 === 'fire' && symbol4 === 'water' && courtElements.indexOf('door') === -1){
            speakOutput = "<speak>" 
            +  symbol + ' ' + symbol2 + ' ' + symbol3 + ' ' + symbol4
            + "<audio src='https://soundgato.s3.eu-west-3.amazonaws.com/wind.mp3'/>"
            + "<say-as interpret-as='interjection'>Amazing</say-as>."
            + '<break time = "0.5s" />'
            + " That was the correct code. The door is open. "
            + "You see a living room. Tell me what you want to do now. "
            + "</speak>"
            courtElements.push('door');
            conv.courtElements = courtElements;
            points += 10;
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    go(place){
        let speakOutput = "You can't go there.";
        let r = 'courtyard';
        if(place === 'washing room'){
            speakOutput = 'Now you are in the washing room.';
            r = 'washing room';
        }else if(place === 'living room' && courtElements.indexOf('door') !== -1){
            speakOutput = 'You are in the living room.';
            r = 'living room';
        }
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    choose(option, conv){
        points = 0;
        let speakOutput = 'That action is not possible. Tell me what you want to do now. ';
        if(firstTry && canTakeObjects.indexOf('toy mouse') !== -1 && courtElements.indexOf('hole') !== -1 && objectsCourt.indexOf('toy mouse') !== -1 && floorObjectsCourt.indexOf('toy mouse') !== -1){
            if(option === 'squeeze'){
                speakOutput = 'You squeeze the mouse and you break it. You lose 20 points. Tell me what you want to do now. ';
                points -= 20;
                let i = canTakeObjects.indexOf('toy mouse')
                canTakeObjects.splice(i,1)
                conv.canTakeObjectsCourt = canTakeObjects;
                mouse = false;
                conv.mouse = mouse;
            }
            firstTry = false;
            conv.firstTryCourt = firstTry;
        }
        return{
            speak: speakOutput,
            points: points
        }
    },
    clue(){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'You can find the open code in something you should have taken from the bathroom. ';
            n = 1;
        }else if(n === 1){
            speakOutput = "It's better not to mess up with mice. ";
            n = 0;
        }
        conv.courtyardClue = n;
        return speakOutput;
    }
    
}