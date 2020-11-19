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
    initialize(conv){
        light = false;
        objectsCorridor = ['letter'];
        floorObjectsCorridor = [];
        corridorElements = [];
        canTakeObjects = [];
        points = 0;
        firstUse = false;
        
        conv.lightCorridor = light;
        conv.objectsCorridor = objectsCorridor;
        conv.floorObjectsCorridor = floorObjectsCorridor;
        conv.canTakeObjectsCorridor = canTakeObjects;
        conv.corridorElements = corridorElements;
        conv.firstUseCorridor = firstUse;
        n = 0;
        conv.corridorClue = n;
    },
    continueGame(conv){
        light = conv.lightCorridor;
        
        objectsCorridor = conv.objectsCorridor;
        
        floorObjectsCorridor = conv.floorObjectsCorridor;
        
        canTakeObjects = conv.canTakeObjectsCorridor;
        
        corridorElements = conv.corridorElements;
    
        points = 0;
        
        firstUse = conv.firstUseCorridor;
        n = conv.corridorClue;
    },
    getRoom(){
        let room = 'corridor';
        return room;
    },
    look(orientation){
        let speechText = '';
        if(light){
            switch(orientation){
                case 'north':
                    speechText = 'Down the corridor there is a door with a padlock.';
                    break;
                case 'south':
                    speechText = "Behind you it's the bedroom.";
                    break;
                case 'east':
                    speechText = 'To the right there is a switch on a wall affected by humidity.';
                    break;
                case 'west':
                    speechText = 'To the left you can see a painting. The rest is a wall covered by a disgusting mold.';
                    break;
                case 'up':
                    speechText = "It's just the ceiling. Nothing interesting." 
                    break;
                case 'down':
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
        return speechText;
    },
    interaction(object, conv){
        let speechText = "There's nothing interesting about it. Tell me what you want to do now. ";
        points = 0;
        switch(object){
            case 'painting':
                if(floorObjectsCorridor.indexOf('letter') === -1 && objectsCorridor.indexOf('letter') !== -1){
                    speechText = speechText = "<speak>"
                        + "It's a really weird painting. There are some cats around a table playing poker. "
                        + "They bet with cat food instead of money. "
                        + "You look behind the painting and a letter falls on the floor. "
                        + "You would swear that one of the cats has winked at you. Tell me what you want to do now. "
                        + "</speak>";
                    canTakeObjects.push('letter');
                    floorObjectsCorridor.push('letter');
                    conv.floorObjectsCorridor = floorObjectsCorridor;
                    points += 10;
                }else{
                    speechText = 'There is nothing behind the painting. Those cats gaze disturbs you. Tell me what you want to do now. ';
                }
                break;
            case 'switch':
                if(corridorElements.indexOf('switch') === -1){
                    speechText = 
                        "<speak>"
                        + "You get closer to the switch and press it. "
                        + '<audio src="https://actions.google.com/sounds/v1/impacts/metal_crash.ogg"/>'
                        + "You can hear a noise but it's not coming from this room. Tell me what you want to do now. "
                        + "</speak>";
                    corridorElements.push('switch');
                    conv.corridorElements = corridorElements;
                }else{
                    speechText = '<speak> You press again the switch. '
                    + '<audio src="https://actions.google.com/sounds/v1/impacts/metal_crash.ogg"/>'
                    + 'A new noise is heard. Whatever you activated, you have deactived it now. Tell me what you want to do next. </speak> ';    
                    let index = corridorElements.indexOf('switch');
                    corridorElements.splice(index,1);
                    conv.corridorElements = corridorElements;
                }
                break;
            case 'padlock':
                if(corridorElements.indexOf('padlock') === -1){
                    speechText = 'The padlock can be opened with a four number combination. To try a combination, say insert followed by the numbers you want to try. Tell me what you want to do now. ';
                }else{
                    speechText = 'The padlock is open. Tell me what you want to do now. ';
                }
                break;
            case 'door':
                if(corridorElements.indexOf('door') === -1){
                    speechText = 
                        "<speak>"
                        + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                        + 'The door is closed. The padlock prevents it from opening. If you knew the combination... To try a combination, say insert followed by the numbers you want to try. Tell me what you want to do now. '
                        + "</speak>";
                }else{
                    speechText = 'The door is open and you can see a washing room. Tell me what you want to do now. ';    
                }
                break;
        }
        conv.canTakeObjectsCorridor = canTakeObjects;
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsCorridor.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = "You can't take " + item + '. Tell me what you want to do now. ';
        points = 0;
        let success = false;
        if(objectsCorridor.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = '<speak> You put ' + item + ' in the inventory.' ;
            let i = canTakeObjects.indexOf(item);
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsCorridor = canTakeObjects;
            if(item === 'letter'){
                speechText += ' You read the letter: '
                    + "I've been watching you for a while. I'm testing you with a series of challenges. "
                    + "I want to know if you're able to succeed in order to entrust you with a mission. "
                    + "Keep going to discover what's all of this about. I only can say that I trust you to become the container I drink from. "
                    + 'Signed: <say-as interpret-as="characters">E</say-as>.'
                    + '<say-as interpret-as="characters">C</say-as>.'
                    + '<say-as interpret-as="characters">B</say-as>.'
                    + '<say-as interpret-as="characters">I</say-as>. '
                    + ' Tell me what you want to do now. </speak>';
            } else{
                speechText += ' Tell me what you want to do now. '
            }
            let index = objectsCorridor.indexOf(item);
            objectsCorridor.splice(index,1);
            conv.objectsCorridor = objectsCorridor;
            if(floorObjectsCorridor.indexOf(item) !== -1){
                let index2 = floorObjectsCorridor.indexOf(item);
                floorObjectsCorridor.splice(index2,1);
                conv.floorObjectsCorridor = floorObjectsCorridor;
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
        objectsCorridor.push(item);
        floorObjectsCorridor.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsCorridor = canTakeObjects;
        conv.floorObjectsCorridor = floorObjectsCorridor;
        conv.objectsCorridor = objectsCorridor;
        return speechText;
    },
    useObject(conv){
        let speakOutput = 'You have already turned the flashlight on.';
        points = 0;
        if(!light){
            speakOutput = 'You used the flashlight and now you can see the corridor. It narrows until the end, where you can see a door.';
            light = true; 
            conv.lightCorridor = true;
            if(!firstUse){
                firstUse = true;
                points += 10;
                conv.firstUseCorridor = firstUse;
            }
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    numberCode(number, conv){
        points = 0;
        let speakOutput = '<speak> <say-as interpret-as="digits">'+ number +'</say-as>. '
        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
        + "That's not the code. Keep trying. Tell me what you want to do now. </speak> ";
        if(corridorElements.indexOf('door') !== -1){
            speakOutput = 'The door is already open. There is a washing room in front of it. Tell me what you want to do now. ';
        }
            
        if(number === '5329' && corridorElements.indexOf('door') === -1){
            speakOutput = '<speak> <say-as interpret-as="digits">'+number+'</say-as>. '
                + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                + "<say-as interpret-as='interjection'>Congratulations</say-as>."
                + '<break time = "0.5s" />'
                + " That was the correct code. The door is open. "
                + "You can see a washing room. Tell me what you want to do. </speak> ";
            corridorElements.push('door');
            corridorElements.push('padlock');
            conv.corridorElements = corridorElements;
            points += 20;
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    go(place){
        let speakOutput = "You can't go there. Tell me what you want to do now. ";
        let r = 'corridor';
        if(place === 'bedroom'){
            speakOutput = 'Now you are in the bedroom. Tell me what you want to do now. ';
            r = 'bedroom';
        }else if(place === 'washing room' && corridorElements.indexOf('door') !== -1){
            speakOutput = '<speak> Now you are in the washing room.';
            r = 'washing room';
        }
        
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    setLight(state, conv){
        light = state;
        conv.lightCorridor = light;
    },
    clue(){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'There is a letter whose signature is really important. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Try to replace letters for numbers in the letter signature. ';
            n = 0;
        }
        conv.corridorClue = n;
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