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
    initialize(sessionAttributes){
        floorObjectsLivingRoom = [];
        objectsLivingRoom = ['photo', 'bowl', 'bone scan'];
        canTakeObjects = [];
        livingRoomElements = [];
        firstTime = true;
        firstUse = true;
        points = 0;
        n = 0;
        
        sessionAttributes['objectsLivingRoomEn'] = objectsLivingRoom;
        sessionAttributes['floorObjectsLivingRoomEn'] = floorObjectsLivingRoom;
        sessionAttributes['canTakeObjectsLivingRoomEn'] = canTakeObjects;
        sessionAttributes['livingRoomElementsEn'] = livingRoomElements;
        sessionAttributes['firstTimeLivingRoomEn'] = firstTime;
        sessionAttributes['firstUseLivingRoomEn'] = firstUse;
        sessionAttributes['livingRoomClueEn'] = n;
    },
    continueGame(sessionAttributes){
        objectsLivingRoom = sessionAttributes['objectsLivingRoomEn'];
        floorObjectsLivingRoom = sessionAttributes['floorObjectsLivingRoomEn'];
        canTakeObjects = sessionAttributes['canTakeObjectsLivingRoomEn'];
        livingRoomElements = sessionAttributes['livingRoomElementsEn'];
        firstTime = sessionAttributes['firstTimeLivingRoomEn'];
        firstUse = sessionAttributes['firstUseLivingRoomEn'];
        points = 0;
        n = sessionAttributes['livingRoomClueEn'];
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
    interaction(object, sessionAttributes){
        let speechText = "There's nothing interesting about it. ";
        points = 0;
        switch(object){
            case 'television':
                if(livingRoomElements.indexOf('television') === -1){
                    speechText = "It's an old television. You press the button, but you don't think it's going to work. "
                    + "To your surprise, the screen turns on. It's a show about poetry. You listen to the poem they are talking about: "
                    + "<voice name='Joanna'>" 
                    + "O Captain! my Captain! our fearful trip is done, "
                    + "The ship has weather'd every rack, the prize we sought is won, "
                    + "The port is near, the bells I hear, the people all exulting, "
                    + "While follow eyes the steady keel, the vessel grim and daring. "
                    + '</voice>'
                    livingRoomElements.push('television');
                    sessionAttributes['livingRoomElementsEn'] = livingRoomElements;
                }else{
                    speechText = "You listen to the poem again. The TV is in a loop. Maybe it's a recording: "
                    + "<voice name='Joanna'>" 
                    + "O Captain! my Captain! our fearful trip is done, "
                    + "The ship has weather'd every rack, the prize we sought is won, "
                    + "The port is near, the bells I hear, the people all exulting, "
                    + "While follow eyes the steady keel, the vessel grim and daring. "
                    + '</voice>'
                }
                break;
            case 'lockbox':
                if(livingRoomElements.indexOf('lockbox') === -1){
                    speechText = "It's a lockbox with a numeric keyboard. You need a four number combination to open it. To try a code, say insert and the four numbers. "  
                }else{
                    speechText = 'The lockbox is open. ';
                    if(floorObjectsLivingRoom.indexOf('bowl') === -1 && objectsLivingRoom.indexOf('bowl') !== -1){
                        speechText += 'You can see a bowl. You can throw it or take it. ';
                    }
                    if(floorObjectsLivingRoom.indexOf('photo') === -1 && objectsLivingRoom.indexOf('photo') !== -1){
                        speechText += 'There is a photo.'
                    }
                }
                break;
            case 'bookshelf':
                speechText = "It's a bookshelf. There are plenty of authors, mainly poets. If you want to read a book, say read and the name of the author."
                break;
            case 'ventilation duct':
                speechText = "The ventilation duct is open. Perhaps you could look inside, but it's too high. "
                break;
            case 'stairs':
                speechText = 'The stairs go down to a door. You can see more crumbs on the floor.';    
                break;
            case 'door':
                if(livingRoomElements.indexOf('door') === -1){
                    speechText = "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                    + "The door is closed. It's locked. You need something to open the door. "
                    + "</speak>";
                }else{
                    speechText = 'The door is open and you see the basement.';    
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
        if(objectsLivingRoom.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = "You can' take " + item;
        points = 0;
        let success = false;
        if(objectsLivingRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            if(item === 'bowl' && firstTime === true){
                points += 20;
                firstTime = false;
                sessionAttributes['firstTimeLivingRoomEn'] = firstTime;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsLivingRoomEn'] = canTakeObjects;
            if(item === 'photo'){
                speechText += " It's a photo of a really cute white cat. There is a text behind: "
                    + "<voice name='Matthew'> I like to chase and catch everything that is moving. "
                    + 'Will you give me that chance?'
                    + '</voice>';
            }
            let index = objectsLivingRoom.indexOf(item)
            objectsLivingRoom.splice(index,1)
            sessionAttributes['objectsLivingRoomEn'] = objectsLivingRoom;
            if(floorObjectsLivingRoom.indexOf(item) !== -1){
                let index2 = floorObjectsLivingRoom.indexOf(item)
                floorObjectsLivingRoom.splice(index2,1)
                sessionAttributes['floorObjectsLivingRoomEn'] = floorObjectsLivingRoom;
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
        objectsLivingRoom.push(item);
        floorObjectsLivingRoom.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsLivingRoomEn'] = canTakeObjects;
        sessionAttributes['floorObjectsLivingRoomEn'] = floorObjectsLivingRoom;
        sessionAttributes['objectsLivingRoomEn'] = objectsLivingRoom;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = "You can't do that.";
        if(object === 'chair' && element === 'ventilation duct'){
            if(floorObjectsLivingRoom.indexOf('bone scan') === -1 && objectsLivingRoom.indexOf('bone scan') !== -1){
                speakOutput = 'You get on the chair and look inside the ventilation duct.'
                + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_meow_1x_01"/>'
                + ' Where does that sound come from? You touch around and you find a bone scan.';
                canTakeObjects.push('bone scan');
                sessionAttributes['canTakeObjectsLivingRoomEn'] = canTakeObjects;
                if(firstUse){
                    points += 10;
                    firstUse = false;
                    sessionAttributes['firstUseLivingRoomEn'] = firstUse;
                }
            }else{
                speakOutput = "You get on the chair and look inside the ventilation duct. There's nothing inside.";
            }
        }
        if(object === 'bone scan' && element === 'door'){
            if(livingRoomElements.indexOf('door') === -1){
                speakOutput = "<speak>" +
                'You use the bone scan and open the door.' 
                + "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                + 'You see the basement.'
                + "</speak>"; 
                livingRoomElements.push('door');
                sessionAttributes['livingRoomElementsEn'] =  livingRoomElements;
                points += 10;
            }else{
                speakOutput = 'The door is open. You see the basement. '
            }
        }
        return{
            speakOutput: speakOutput,
            points: points
        }        
    },
    numberCode(number, sessionAttributes){
        let speakOutput = '<say-as interpret-as="digits">'+number+'</say-as>. '
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + "That's not the code. Keep trying.";
                        
        if(livingRoomElements.indexOf('lockbox') !== -1){
            speakOutput = 'You have already opened the lockbox. '
            if(floorObjectsLivingRoom.indexOf('bowl') === -1 && objectsLivingRoom.indexOf('bowl') !== -1){
                speakOutput += 'You can see a bowl. You can throw it or take it. ';
            }
            if(floorObjectsLivingRoom.indexOf('photo') === -1 && objectsLivingRoom.indexOf('photo') !== -1){
                speakOutput += 'There is a photo. ';
            }
        }
            
        if(number === '1819' && livingRoomElements.indexOf('lockbox') === -1){
            speakOutput = "<speak>" 
            + '<say-as interpret-as="digits">'+number+'</say-as>. '
            + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
            + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
            + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
            + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
            + "<say-as interpret-as='interjection'>Fantastic</say-as>."
            + '<break time = "0.5s" />'
            + " That was the correct code. The lockbox is open. "
            + "There is a bowl and a photo inside. You can take or throw the bowl. "
            + "</speak>"
            livingRoomElements.push('lockbox');
            canTakeObjects.push('bowl');
            canTakeObjects.push('photo');
            sessionAttributes['livingRoomElementsEn'] = livingRoomElements;
            sessionAttributes['canTakeObjectsLivingRoomEn'] = canTakeObjects;
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
            case 'Walt Whitman':
                speakOutput += 'Walt Whitman was born in 1819...'
                break;
            case 'Lorca':
                speakOutput += 'Lorca was born in 1898...'
                break;
            case 'Thoreau':
                speakOutput += 'Henry David Thoreau was born in 1817...'
                break;
            case 'Virginia Woolf':
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
            + '<audio src="soundbank://soundlibrary/household/lamps_lanterns/lamps_lanterns_02"/>';
            r = 'basement';
        }  
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    choose(option, sessionAttributes){
        points = 0;
        let speakOutput = 'That action is not possible.';
        if(canTakeObjects.indexOf('bowl') !== -1 && livingRoomElements.indexOf('lockbox') !== -1 && objectsLivingRoom.indexOf('bowl') !== -1 && floorObjectsLivingRoom.indexOf('bowl') === -1){
            if(option === 'throw'){
                speakOutput = "You throw the bowl and you can't see it anymore. You lose 20 points. ";
                points -= 20;
                let i = canTakeObjects.indexOf('bowl')
                canTakeObjects.splice(i,1)
                sessionAttributes['canTakeObjectsLivingRoomEn'] = canTakeObjects;
                let index = objectsLivingRoom.indexOf('bowl');
                objectsLivingRoom.splice(index,1);
                sessionAttributes['objectsLivingRoomEn'] = objectsLivingRoom;
            }
        }
        return{
            speak: speakOutput,
            points: points
        }
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'The ventilation duct has something important to keep going to another room. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Reading is a good hobby. Look for the author of the poem. ';
            n = 2;
        }else if(n === 2){
            speakOutput = "It's better not to throw the things you have around. ";
            n = 0;
        }
        sessionAttributes['livingRoomClueEn'] = n;
        return speakOutput;
    }
}