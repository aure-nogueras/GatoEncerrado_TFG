// Objects in the room
let objectsCorridor = [];
        
// Objects in the floor of the room
let floorObjectsCorridor = [];

// Array with accomplished interactions with the objects of the room
let corridorElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Variable that indicates if there is enough light to explore the room
let light; 

// Points in this room
let points;

// First time to use the lantern
let firstUse;

// Number used to choose the clue
let n;

module.exports = {
    initialize(sessionAttributes){
        light = false;
        objectsCorridor = ['letter'];
        floorObjectsCorridor = [];
        corridorElements = [];
        canTakeObjects = [];
        points = 0;
        n = 0;
        firstUse = false;
        
        sessionAttributes['lightCorridorEn'] = light;
        sessionAttributes['objectsCorridorEn'] = objectsCorridor;
        sessionAttributes['floorObjectsCorridorEn'] = floorObjectsCorridor;
        sessionAttributes['canTakeObjectsCorridorEn'] = canTakeObjects;
        sessionAttributes['corridorElementsEn'] = corridorElements;
        sessionAttributes['firstUseCorridorEn'] = firstUse;
        sessionAttributes['corridorClueEn'] = n;
    },
    continueGame(sessionAttributes){
        light = sessionAttributes['lightCorridorEn'];
        
        objectsCorridor = sessionAttributes['objectsCorridorEn'];
        
        floorObjectsCorridor = sessionAttributes['floorObjectsCorridorEn'];
        
        canTakeObjects = sessionAttributes['canTakeObjectsCorridorEn'];
        
        corridorElements = sessionAttributes['corridorElementsEn'];
    
        points = 0;
        
        firstUse = sessionAttributes['firstUseCorridorEn'];
        n = sessionAttributes['corridorClueEn'];
    },
    getRoom(){
        let room = 'corridor';
        return room;
    },
    look(orientation){
        let speechText = '';
        let url = '';
        if(light){
            switch(orientation){
                case 'north':
                    speechText = 'Down the corridor there is a door with a padlock.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/north_corridor.png';
                    break;
                case 'south':
                    speechText = "Behind you it's the bedroom.";
                    break;
                case 'east':
                    speechText = 'To the right there is a switch on a wall affected by humidity.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/east_corridor.png';
                    break;
                case 'west':
                    speechText = 'To the left you can see a painting. The rest is a wall covered by a disgusting mold.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/west_corridor.png';
                    break;
                case 'up':
                    speechText = "It's just the ceiling. Nothing interesting." 
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/down.png';
                    break;
                case 'down':
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/down.png';
                    if(floorObjectsCorridor.length === 0){
                        speechText = "It's just the floor. Nothing interesting.";
                    }else{
                        speechText = 'On the ground you find: ' + floorObjectsCorridor;
                    }
                    break;
            }
        }else{
            speechText = 'The corridor is really dark and you see nothing. You need some light before you can explore it.';
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
            case 'painting':
                if(floorObjectsCorridor.indexOf('letter') === -1 && objectsCorridor.indexOf('letter') !== -1){
                    speechText = speechText = "<speak>"
                        + "It's a really weird painting. There are some cats around a table playing poker. "
                        + "They bet with cat food instead of money. "
                        + "You look behind the painting and a letter falls on the floor. "
                        + '<audio src="soundbank://soundlibrary/cloth_leather_paper/books/books_07"/>'
                        + "You would swear that one of the cats has winked at you. "
                        + "</speak>";
                    canTakeObjects.push('letter');
                    floorObjectsCorridor.push('letter');
                    sessionAttributes['floorObjectsCorridorEn'] = floorObjectsCorridor;
                    points += 10;
                }else{
                    speechText = 'There is nothing behind the painting. Those cats gaze disturbs you. ';
                }
                break;
            case 'switch':
                if(corridorElements.indexOf('switch') === -1){
                    speechText = 
                        "<speak>"
                        + "You get closer to the switch and press it. "
                        + '<audio src="soundbank://soundlibrary/machines/power_up_down/power_up_down_12"/>'
                        + "You can hear a noise but it's not coming from this room. "
                        + "</speak>";
                    corridorElements.push('switch');
                    sessionAttributes['corridorElementsEn'] = corridorElements;
                }else{
                    speechText = 'You press again the switch. '
                        + '<audio src="soundbank://soundlibrary/machines/power_up_down/power_up_down_13"/>'
                        + 'A new noise is heard. Whatever you activated, you have deactived it now.';    
                    let index = corridorElements.indexOf('switch');
                    corridorElements.splice(index,1);
                    sessionAttributes['corridorElementsEn'] = corridorElements;
                }
                break;
            case 'padlock':
                if(corridorElements.indexOf('padlock') === -1){
                    speechText = 'The padlock can be opened with a four number combination. To try a combination, say insert followed by the numbers you want to try.';
                }else{
                    speechText = 'The padlock is open.';
                }
                break;
            case 'door':
                if(corridorElements.indexOf('door') === -1){
                    speechText = 
                        "<speak>"
                        + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                        + 'The door is closed. The padlock prevents it from opening. You need a four numbers combination. To try a combination, say insert followed by the numbers you want to try. '
                        + "</speak>";
                }else{
                    speechText = 'The door is open and you can see a washing room.';    
                }
                break;
        }
        sessionAttributes['canTakeObjectsCorridorEn'] = canTakeObjects;
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsCorridor.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = "You can't take " + item;
        points = 0;
        let success = false;
        if(objectsCorridor.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' ;
            let i = canTakeObjects.indexOf(item);
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsCorridorEn'] = canTakeObjects;
            if(item === 'letter'){
                speechText += ' You read the letter: '
                    + "<voice name='Matthew'> I've been watching you for a while. I'm testing you with a series of challenges. "
                    + "I want to know if you're able to succeed in order to entrust you with a mission. "
                    + "Keep going to discover what's all of this about. I only can say that I trust you to become the container I drink from. "
                    + 'Signed: <say-as interpret-as="characters">E</say-as>.'
                    + '<say-as interpret-as="characters">C</say-as>.'
                    + '<say-as interpret-as="characters">B</say-as>.'
                    + '<say-as interpret-as="characters">I</say-as>.'
                    + '</voice>'
            }
            let index = objectsCorridor.indexOf(item);
            objectsCorridor.splice(index,1);
            sessionAttributes['objectsCorridorEn'] = objectsCorridor;
            if(floorObjectsCorridor.indexOf(item) !== -1){
                let index2 = floorObjectsCorridor.indexOf(item);
                floorObjectsCorridor.splice(index2,1);
                sessionAttributes['floorObjectsCorridorEn'] = floorObjectsCorridor;
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
        objectsCorridor.push(item);
        floorObjectsCorridor.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsCorridorEn'] = canTakeObjects;
        sessionAttributes['floorObjectsCorridorEn'] = floorObjectsCorridor;
        sessionAttributes['objectsCorridorEn'] = objectsCorridor;
        return speechText;
    },
    useObject(sessionAttributes){
        let speakOutput = 'You have already turned the flashlight on.';
        points = 0;
        if(!light){
            speakOutput = 'You used the flashlight and now you can see the corridor. It narrows until the end, where you can see a door.';
            light = true; 
            sessionAttributes['lightCorridorEn'] = true;
            if(!firstUse){
                firstUse = true;
                points += 10;
                sessionAttributes['firstUseCorridorEn'] = firstUse;
            }
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    numberCode(number, sessionAttributes){
        points = 0;
        let speakOutput = '<say-as interpret-as="digits">'+number+'</say-as>. '
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + "That's not the code. Keep trying.";
        if(corridorElements.indexOf('door') !== -1){
            speakOutput = 'The door is already open. There is a washing room in front of it.';
        }
            
        if(number === '5329' && corridorElements.indexOf('door') === -1){
            speakOutput = '<say-as interpret-as="digits">'+number+'</say-as>. '
                + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                + "<say-as interpret-as='interjection'>Congratulations</say-as>."
                + '<break time = "0.5s" />'
                + " That was the correct code. The door is open. "
                + "You can see a washing room.";
            corridorElements.push('door');
            corridorElements.push('padlock');
            sessionAttributes['corridorElementsEn'] = corridorElements;
            points += 20;
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    go(place){
        let speakOutput = "You can't go there. ";
        let r = 'corridor';
        if(place === 'bedroom'){
            speakOutput = 'Now you are in the bedroom.';
            r = 'bedroom';
        }else if(place === 'washing room' && corridorElements.indexOf('door') !== -1){
            speakOutput = 'Now you are in the washing room.';
            r = 'washing room';
        }
        
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    setLight(state, sessionAttributes){
        light = state;
        sessionAttributes['lightCorridorEn'] = light;
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'There is a letter whose signature is really important. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Try to replace letters for numbers in the letter signature. ';
            n = 0;
        }
        sessionAttributes['corridorClueEn'] = n;
        return speakOutput;
    },
    getSwitch(){
        let on = 0;
        if(corridorElements.indexOf('switch') !== -1){
            on = 1;
        }
        return on;
    }
    
}