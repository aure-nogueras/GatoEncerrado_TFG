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
    initialize(sessionAttributes){
        objectsCourt = ['toy mouse', 'player'];
        floorObjectsCourt = ['player']
        canTakeObjects = ['player'];
        courtElements = [];
        firstTime = true;
        firstTry = true;
        mouse = true;
        points = 0;
        n = 0;
        
        sessionAttributes['objectsCourtEn'] = objectsCourt;
        sessionAttributes['floorObjectsCourtEn'] = floorObjectsCourt;
        sessionAttributes['canTakeObjectsCourtEn'] = canTakeObjects;
        sessionAttributes['courtElementsEn'] = courtElements;
        sessionAttributes['firstTimeCourtEn'] = firstTime;
        sessionAttributes['firstTryCourtEn'] = firstTry;
        sessionAttributes['mouseEn'] = mouse;
        sessionAttributes['courtyardClueEn'] = n;
    },
    continueGame(sessionAttributes){
        objectsCourt = sessionAttributes['objectsCourtEn'];
        floorObjectsCourt = sessionAttributes['floorObjectsCourtEn'];
        canTakeObjects = sessionAttributes['canTakeObjectsCourtEn'];
        courtElements = sessionAttributes['courtElementsEn'];
        firstTime = sessionAttributes['firstTimeCourtEn'];
        firstTry = sessionAttributes['firstTryCourtEn'];
        mouse = sessionAttributes['mouseEn'];  
        points = 0;
        n = sessionAttributes['courtyardClueEn'];
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
    interaction(object, sessionAttributes){
        let speechText = "There's nothing interesting about it. ";
        points = 0;
        switch(object){
            case 'table':
                speechText = "It's a wood table. There's a tray on it.";
                break;
            case 'tray':
                speechText = 'The tray is full of chocolate cookies. Some of them are bitten. There are crumbs everywhere.';
                break;
            case 'hole':
                if(courtElements.indexOf('hole') === -1){
                    speechText = 'You approach to the hole. Suddenly a toy mouse appears and starts rotating on the floor. It stops after a while. You can take or squeeze the toy mouse.';
                    courtElements.push('hole')
                    floorObjectsCourt.push('toy mouse')
                    canTakeObjects.push('toy mouse')
                    sessionAttributes['canTakeObjectsCourtEn'] = canTakeObjects;
                    sessionAttributes['floorObjectsCourtEn'] = floorObjectsCourt;
                    sessionAttributes['courtElementsEn'] = courtElements;
                }else{
                    speechText = 'There is nothing inside the hole.' 
                }
                break;
            case 'footprints':
                speechText = 'They are the footprints of a pet. There are crumbs next to them.';    
                break;
            case 'door':
                if(courtElements.indexOf('door') === -1){
                    speechText = "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                    + "It's a metal door and it's closed. There are four symbols on it: air, water, earth y fire. "
                    + 'You need to press them to open the door. To try a combination, say press and the order of the symbols.'
                    + "</speak>";
                }else{
                    speechText = 'The door is open and you see a living room.';    
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
        if(objectsCourt.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsCourt.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            if(item === 'toy mouse' && firstTime === true){
                points += 20;
                firstTime = false;
                sessionAttributes['firstTimeCourtEn'] = firstTime;
            }
            if(item === 'player'){
                speechText = ' You take the mp3 player and start to listen to a voice that sounds familiar. '
                + "<voice name='Matthew'> Go into the unknown. Don't forget the threads that interweave and form a whole."
                + '</voice>'
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsCourtEn'] = canTakeObjects;
            let index = objectsCourt.indexOf(item)
            objectsCourt.splice(index,1)
            sessionAttributes['objectsCourtEn'] = objectsCourt;
            if(floorObjectsCourt.indexOf(item) !== -1){
                let index2 = floorObjectsCourt.indexOf(item)
                floorObjectsCourt.splice(index2,1)
                sessionAttributes['floorObjectsCourtEn'] = floorObjectsCourt;
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
        objectsCourt.push(item);
        floorObjectsCourt.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsCourtEn'] = canTakeObjects;
        sessionAttributes['floorObjectsCourtEn'] = floorObjectsCourt;
        sessionAttributes['objectsCourtEn'] = objectsCourt;
        return speechText;
    },
    pushSymbol(symbol, symbol2, symbol3, symbol4, sessionAttributes){
        let speakOutput = symbol + ' ' + symbol2 + ' ' + symbol3 + ' ' + symbol4
                        + " That's not the code. Keep trying. ";
        points = 0;
        
        if(courtElements.indexOf('door') !== -1){
            speakOutput = "You have already opened the door. There is a living room. ";
        }
        if(symbol === 'earth' && symbol2 === 'air' && symbol3 === 'fire' && symbol4 === 'water' && courtElements.indexOf('door') === -1){
            speakOutput = "<speak>" 
            +  symbol + ' ' + symbol2 + ' ' + symbol3 + ' ' + symbol4
            + "<audio src='https://soundgato.s3.eu-west-3.amazonaws.com/wind.mp3'/>"
            + "<say-as interpret-as='interjection'>Amazing</say-as>."
            + '<break time = "0.5s" />'
            + " That was the correct code. The door is open. "
            + "You see a living room."
            + "</speak>"
            courtElements.push('door');
            sessionAttributes['courtElementsEn'] = courtElements;
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
    choose(option, sessionAttributes){
        points = 0;
        let speakOutput = 'That action is not possible.';
        if(firstTry && canTakeObjects.indexOf('toy mouse') !== -1 && courtElements.indexOf('hole') !== -1 && objectsCourt.indexOf('toy mouse') !== -1 && floorObjectsCourt.indexOf('toy mouse') !== -1){
            if(option === 'squeeze'){
                speakOutput = 'You squeeze the mouse and you break it. You lose 20 points.';
                points -= 20;
                let i = canTakeObjects.indexOf('toy mouse')
                canTakeObjects.splice(i,1)
                sessionAttributes['canTakeObjectsCourtEn'] = canTakeObjects;
                mouse = false;
                sessionAttributes['mouseEn'] = mouse;
            }
            firstTry = false;
            sessionAttributes['firstTryCourtEn'] = firstTry;
        }
        return{
            speak: speakOutput,
            points: points
        }
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'You can find the open code in something you should have taken from the bathroom. ';
            n = 1;
        }else if(n === 1){
            speakOutput = "It's better not to mess up with mice. ";
            n = 0;
        }
        sessionAttributes['courtyardClueEn'] = n;
        return speakOutput;
    }
    
}