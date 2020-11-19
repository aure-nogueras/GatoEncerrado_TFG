// Objects in the room
let objectsSecretRoom = [];
        
// Objects in the floor of the room
let floorObjectsSecretRoom = [];

// Array with accomplished interactions with the objects of the room
let secretRoomElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

module.exports = {
    initialize(conv){
        objectsSecretRoom = ['card'];
        floorObjectsSecretRoom = [];
        secretRoomElements = [];
        canTakeObjects = [];
        points = 0;
        
        conv.objectsSecretRoom = objectsSecretRoom;
        conv.floorObjectsSecretRoom = floorObjectsSecretRoom;
        conv.secretRoomElements = secretRoomElements;
        conv.canTakeObjectsSecretRoom = canTakeObjects;
    },
    continueGame(conv){
        objectsSecretRoom = conv.objectsSecretRoom;
        floorObjectsSecretRoom = conv.floorObjectsSecretRoom;
        secretRoomElements = conv.secretRoomElements;
        canTakeObjects = conv.canTakeObjectsSecretRoom;
        points = 0;
    },
    getRoom(){
        let room = 'secret room';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'north':
                speechText = 'You see a door.';
                break;
            case 'south':
                speechText = 'Behind you is the tunnel you used to come.'
                break;
            case 'east':
                speechText = 'To the right there is a sandbox and a fishbowl.'
                break;
            case 'west':
                speechText = 'To the left you see a cat scratcher.'
                break;
            case 'up':
                speechText = 'There is a lamp lighting the room.' 
                break;
            case 'down':
                if(floorObjectsSecretRoom.length === 0){
                    speechText = 'There is a carpet. Nothing else.'
                }else{
                    speechText = 'There is a carpet. Besides, on the ground you find: ' + floorObjectsSecretRoom;
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
                if(secretRoomElements.indexOf('door') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                    + "The door is closed. This time you can't pass through it, so you need to find a way to open it. It seems that a card can open it... Tell me what you want to do now. "
                    + "</speak>";
                }else{
                    speechText = 'The door is open. Tell me what you want to do now. ';    
                }
                break;
            case 'fishbowl':
                speechText = "You look at the fish tank carefully. There is a happy fish swimming inside it. Tell me what you want to do now. ";
                break;
            case 'sandbox':
                speechText = 'The sandbox smells really bad. You are not going to put your hand in there. Tell me what you want to do now. ' 
                break;
            case 'cat scratcher':
                speechText = 'It is a widely used scraper, but it seems to have been abandoned for a long time. It is worn by scratches. Without a doubt, this room belonged to a cat. Tell me what you want to do now. '
                break;
            case 'lamp':
                speechText = "The lamp is lit, but you haven't seen any switch. Tell me what you want to do now. "
                break;
            case 'carpet':
                if(secretRoomElements.indexOf('carpet') === -1){
                    speechText = "It's an ugly carpet full of cat fur. It seems bulky. You lift it and you find a card. Tell me what you want to do now. "
                    canTakeObjects.push('card');
                    floorObjectsSecretRoom.push('card');
                    conv.canTakeObjectsSecretRoom = canTakeObjects;
                    conv.floorObjectsSecretRoom = floorObjectsSecretRoom;
                    points += 10;
                }else{
                    speechText = "You have already looked under the carpet. Now there's nothing interesting about it. Furthermore, it's pretty ugly and full of cat fur. Tell me what you want to do now. ";    
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
        if(objectsSecretRoom.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = "You can't take " + item;
        let success = false;
        if(objectsSecretRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsSecretRoom = canTakeObjects;
            let index = objectsSecretRoom.indexOf(item)
            objectsSecretRoom.splice(index,1)
            conv.objectsSecretRoom = objectsSecretRoom;
            if(floorObjectsSecretRoom.indexOf(item) !== -1){
                let index2 = floorObjectsSecretRoom.indexOf(item)
                floorObjectsSecretRoom.splice(index2,1)
                conv.floorObjectsSecretRoom = floorObjectsSecretRoom;
            }
            success = true;
        }
        return {
            speechText: speechText,
            success: success
        }
    },
    release(item, conv){
        let speechText = 'You drop ' + item + ' in the secret room.'; 
        objectsSecretRoom.push(item);
        floorObjectsSecretRoom.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsSecretRoom = canTakeObjects;
        conv.floorObjectsSecretRoom = floorObjectsSecretRoom;
        conv.objectsSecretRoom = objectsSecretRoom;
        return speechText;
    },
    use(object, element, conv){
        points = 0;
        let speakOutput = "You can't do that. Tell me what you want to do now. ";
        if(object === 'card' && element === 'door'){
            if(secretRoomElements.indexOf('door') === -1){
                points+=10;
                speakOutput = "<speak> <audio src='https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'/>"
                + '<say-as interpret-as="interjection">great</say-as>'
                + '<break time = "0.5s" />'
                + ' You opened the door! You see the hall in front of you. Tell me what you want to do now. </speak>';
                secretRoomElements.push('door');
                conv.secretRoomElements = secretRoomElements;
            }else{
                speakOutput = 'The door is already opened. Tell me what you want to do now. ';
            }
        }
        return{
            speakOutput: speakOutput,
            points: points
        }        
    },
    go(place){
        let speakOutput = "You can't go there. ";
        let r = 'secret room';
        
        if(place === 'hall' && secretRoomElements.indexOf('door') !== -1){
            speakOutput = 'Now you are in the hall.';
            r = 'hall';
        }
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(){
        let speakOutput = 'The carpet may hide something besides cat fur. ';
        return speakOutput;
    }
}  