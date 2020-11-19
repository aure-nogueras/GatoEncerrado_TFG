// Objects in the room
let objectsLivingRoom = [];
        
// Objects in the floor of the room
let floorObjectsLivingRoom = [];

// Array with accomplished interactions with the objects of the room
let livingRoomElements = [];
        
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
        floorObjectsLivingRoom = [];
        objectsLivingRoom = ['photo', 'bowl', 'bone scan'];
        canTakeObjects = [];
        livingRoomElements = [];
        firstTime = true;
        firstUse = true;
        points = 0;
        n = 0;
        
        conv.objectsLivingRoom = objectsLivingRoom;
        conv.floorObjectsLivingRoom = floorObjectsLivingRoom;
        conv.canTakeObjectsLivingRoom = canTakeObjects;
        conv.livingRoomElements = livingRoomElements;
        conv.firstTimeLivingRoom = firstTime;
        conv.firstUseLivingRoom = firstUse;
        conv.livingRoomClue = n;
    },
    continueGame(conv){
        objectsLivingRoom = conv.objectsLivingRoom;
        floorObjectsLivingRoom = conv.floorObjectsLivingRoom;
        canTakeObjects = conv.canTakeObjectsLivingRoom;
        livingRoomElements = conv.livingRoomElements;
        firstTime = conv.firstTimeLivingRoom;
        firstUse = conv.firstUseLivingRoom;
        points = 0;
        n = conv.livingRoomClue;
    },
    getRoom(){
        let room = 'living room';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'north':
                speechText = 'You can see some stairs going down. There is a door behind them.';
                break;
            case 'south':
                speechText = 'You can see the courtyard. The light coming in allows you to clearly see the living room.';
                break;
            case 'east':
                speechText = 'To the right you can see a television and a lockbox. ';
                break;
            case 'west':
                speechText = 'To the left there is a bookshelf.';
                break;
            case 'up':
                speechText = 'There is a ventilation duct above.';
                break;
            case 'down':
                if(floorObjectsLivingRoom.length === 0){
                    speechText = "It's just the floor. Nothing interesting.";
                }else{
                    speechText = 'On the ground you find: ' + floorObjectsLivingRoom;
                }
                break;
        }
        return speechText;
    },
    interaction(object, conv){
        let speechText = "There's nothing interesting about it. Tell me what you want to do now. ";
        points = 0;
        switch(object){
            case 'television':
                if(livingRoomElements.indexOf('television') === -1){
                    speechText = "It's an old television. You press the button, but you don't think it's going to work. "
                    + "To your surprise, the screen turns on. It's a show about poetry. You listen to the poem they are talking about: "
                    + "O Captain! my Captain! our fearful trip is done, "
                    + "The ship has weather'd every rack, the prize we sought is won, "
                    + "The port is near, the bells I hear, the people all exulting, "
                    + "While follow eyes the steady keel, the vessel grim and daring. Tell me what you want to do now. "
                    livingRoomElements.push('television');
                    conv.livingRoomElements = livingRoomElements;
                }else{
                    speechText = "You listen to the poem again. The TV is in a loop. Maybe it's a recording: "
                    + "O Captain! my Captain! our fearful trip is done, "
                    + "The ship has weather'd every rack, the prize we sought is won, "
                    + "The port is near, the bells I hear, the people all exulting, "
                    + "While follow eyes the steady keel, the vessel grim and daring. "
                    + ' Tell me what you want to do now. '
                }
                break;
            case 'lockbox':
                if(livingRoomElements.indexOf('lockbox') === -1){
                    speechText = "It's a lockbox with a numeric keyboard. You need a four number combination to open it. To try a code, say insert and the four numbers. Tell me what you want to do now. "  
                }else{
                    speechText = 'The lockbox is open. ';
                    if(floorObjectsLivingRoom.indexOf('bowl') === -1 && objectsLivingRoom.indexOf('bowl') !== -1){
                        speechText += 'You can see a bowl. You can throw it or take it. ';
                    }
                    if(floorObjectsLivingRoom.indexOf('photo') === -1 && objectsLivingRoom.indexOf('photo') !== -1){
                        speechText += 'There is a photo.'
                    }
                    speechText += ' Tell me what you want to do now. '
                }
                break;
            case 'bookshelf':
                speechText = "It's a bookshelf. There are plenty of authors, mainly poets. If you want to read a book, say read and the name of the author. Tell me what you want to do now. "
                break;
            case 'ventilation duct':
                speechText = "The ventilation duct is open. Perhaps you could look inside, but it's too high. Tell me what you want to do now. "
                break;
            case 'stairs':
                speechText = 'The stairs go down to a door. You can see more crumbs on the floor. Tell me what you want to do now. ';    
                break;
            case 'door':
                if(livingRoomElements.indexOf('door') === -1){
                    speechText = "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                    + "The door is closed. It's locked. You need something to open the door. Tell me what you want to do now. "
                    + "</speak>";
                }else{
                    speechText = 'The door is open and you see the basement. Tell me what you want to do now. ';    
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
        if(objectsLivingRoom.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = "You can' take " + item;
        points = 0;
        let success = false;
        if(objectsLivingRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            if(item === 'bowl' && firstTime === true){
                points += 20;
                firstTime = false;
                conv.firstTimeLivingRoom = firstTime;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsLivingRoom = canTakeObjects;
            if(item === 'photo'){
                speechText += " It's a photo of a really cute white cat. There is a text behind: "
                    + " I like to chase and catch everything that is moving. "
                    + 'Will you give me that chance?';
            }
            let index = objectsLivingRoom.indexOf(item)
            objectsLivingRoom.splice(index,1)
            conv.objectsLivingRoom = objectsLivingRoom;
            if(floorObjectsLivingRoom.indexOf(item) !== -1){
                let index2 = floorObjectsLivingRoom.indexOf(item)
                floorObjectsLivingRoom.splice(index2,1)
                conv.floorObjectsLivingRoom = floorObjectsLivingRoom;
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
        objectsLivingRoom.push(item);
        floorObjectsLivingRoom.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsLivingRoom = canTakeObjects;
        conv.floorObjectsLivingRoom = floorObjectsLivingRoom;
        conv.objectsLivingRoom = objectsLivingRoom;
        return speechText;
    },
    use(object, element, conv){
        points = 0;
        let speakOutput = "You can't do that. Tell me what you want to do now. ";
        if(object === 'chair' && element === 'ventilation duct'){
            if(floorObjectsLivingRoom.indexOf('bone scan') === -1 && objectsLivingRoom.indexOf('bone scan') !== -1){
                speakOutput = 'You get on the chair and look inside the ventilation duct.'
                + ' You touch around and you find a bone scan. Tell me what you want to do now. ';
                canTakeObjects.push('bone scan');
                conv.canTakeObjectsLivingRoom = canTakeObjects;
                if(firstUse){
                    points += 10;
                    firstUse = false;
                    conv.firstUseLivingRoom = firstUse;
                }
            }else{
                speakOutput = "You get on the chair and look inside the ventilation duct. There's nothing inside. Tell me what you want to do now. ";
            }
        }
        if(object === 'bone scan' && element === 'door'){
            if(livingRoomElements.indexOf('door') === -1){
                speakOutput = "<speak>" +
                'You use the bone scan and open the door.' 
                + "<audio src='https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'/>"
                + 'You see the basement. Tell me what you want to do now. '
                + "</speak>"; 
                livingRoomElements.push('door');
                conv.livingRoomElements =  livingRoomElements;
                points += 10;
            }else{
                speakOutput = 'The door is open. You see the basement. Tell me what you want to do now. '
            }
        }
        return{
            speakOutput: speakOutput,
            points: points
        }        
    },
    numberCode(number, conv){
        let speakOutput = '<speak> <say-as interpret-as="digits">'+ number +'</say-as>. '
        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
        + "That's not the code. Keep trying. Tell me what you want to do now. </speak>";
                        
        if(livingRoomElements.indexOf('lockbox') !== -1){
            speakOutput = 'You have already opened the lockbox. '
            if(floorObjectsLivingRoom.indexOf('bowl') === -1 && objectsLivingRoom.indexOf('bowl') !== -1){
                speakOutput += 'You can see a bowl. You can throw it or take it. ';
            }
            if(floorObjectsLivingRoom.indexOf('photo') === -1 && objectsLivingRoom.indexOf('photo') !== -1){
                speakOutput += 'There is a photo. ';
            }
            speakOutput += ' Tell me what you want to do now. '
        }
            
        if(number === '1819' && livingRoomElements.indexOf('lockbox') === -1){
            speakOutput = "<speak>" 
            + '<say-as interpret-as="digits">'+number+'</say-as>. '
            + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
            + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
            + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
            + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
            + "<say-as interpret-as='interjection'>Fantastic</say-as>."
            + '<break time = "0.5s" />'
            + " That was the correct code. The lockbox is open. "
            + "There is a bowl and a photo inside. You can take or throw the bowl. Tell me what you want to do now. "
            + "</speak>"
            livingRoomElements.push('lockbox');
            canTakeObjects.push('bowl');
            canTakeObjects.push('photo');
            conv.livingRoomElements = livingRoomElements;
            conv.canTakeObjectsLivingRoom = canTakeObjects;
            points += 10;
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    read(author){
        let speakOutput = 'You open the book of ' + author + '. '
        
        switch(author){
            case 'walt whitman':
                speakOutput += 'Walt Whitman was born in 1819...'
                break;
            case 'lorca':
                speakOutput += 'Lorca was born in 1898...'
                break;
            case 'thoreau':
                speakOutput += 'Henry David Thoreau was born in 1817...'
                break;
            case 'virginia woolf':
                speakOutput += 'Virginia Woolf was born in 1882...'
                break;
        }
        return speakOutput;
    },
    go(place){
        let speakOutput = "You can't go there.";
        let r = 'living room';
        if(place === 'courtyard'){
            speakOutput = 'Now you are in the courtyard.';
            r = 'courtyard';
        }else if(place === 'basement' && livingRoomElements.indexOf('door') !== -1){
            speakOutput = 'You are in the basement. The lights turn on when you enter. '
            r = 'basement';
        }  
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    choose(option, conv){
        points = 0;
        let speakOutput = 'That action is not possible. Tell me what you want to do now. ';
        if(canTakeObjects.indexOf('bowl') !== -1 && livingRoomElements.indexOf('lockbox') !== -1 && objectsLivingRoom.indexOf('bowl') !== -1 && floorObjectsLivingRoom.indexOf('bowl') === -1){
            if(option === 'throw'){
                speakOutput = "You throw the bowl and you can't see it anymore. You lose 20 points. Tell me what you want to do now. ";
                points -= 20;
                let i = canTakeObjects.indexOf('bowl')
                canTakeObjects.splice(i,1)
                conv.canTakeObjectsLivingRoom = canTakeObjects;
                let index = objectsLivingRoom.indexOf('bowl');
                objectsLivingRoom.splice(index,1);
                conv.objectsLivingRoom = objectsLivingRoom;
            }
        }
        return{
            speak: speakOutput,
            points: points
        }
    },
    clue(){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'The ventilation duct has something important to keep going to another room. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Reading is a good hobby. Look for the author of the poem. ';
            n = 2;
        }else if(n === 2){
            speakOutput = "It's better not to lose sight of thing you have around. ";
            n = 0;
        }
        conv.livingRoomClue = n;
        return speakOutput;
    }
}