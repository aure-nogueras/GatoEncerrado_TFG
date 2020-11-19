// Objects in the room
let objectsKitchen = [];
        
// Objects in the floor of the room
let floorObjectsKitchen = [];

// Array that indicates if an object can be taken
let canTakeObjects;

// Points of the player
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;

module.exports = {
    initialize(sessionAttributes){
        objectsKitchen = ['note'];
        floorObjectsKitchen = [];
        canTakeObjects = [];
        points = 0;
        firstTime = true;
        
        sessionAttributes['objectsKitchenEn'] = objectsKitchen;
        sessionAttributes['floorObjectsKitchenEn'] = floorObjectsKitchen;
        sessionAttributes['canTakeObjectsKitchenEn'] = canTakeObjects;
        sessionAttributes['firstTimeKitchenEn'] = firstTime;
    },
    continueGame(sessionAttributes){
        objectsKitchen = sessionAttributes['objectsKitchenEn'];
        floorObjectsKitchen = sessionAttributes['floorObjectsKitchenEn'];
        canTakeObjects = sessionAttributes['canTakeObjectsKitchenEn'];
        firstTime = sessionAttributes['firstTimeKitchenEn'];
        points = 0;
    },
    getRoom(){
        let room = 'kitchen';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'north':
                speechText = "To the north you can see a damaged wall. It's not really interesting. ";
                break;
            case 'south':
                speechText = 'To the south there are two stoves and a worktop with drawers. '
                break;
            case 'east':
                speechText = 'To the right is the wall you just passed through. Now it looks like a normal wall. '
                break;
            case 'west':
                speechText = 'To the left you see a fridge.'
                break;
            case 'up':
                speechText = "It's just the ceiling. Nothing interesting. " 
                break;
            case 'down':
                if(floorObjectsKitchen.length === 0){
                    speechText = 'You see a trapdoor.'
                }else{
                    speechText = 'Besides the trapdoor, on the ground you find: ' + floorObjectsKitchen;
                }
                break;
        }
        return speechText;
    },
    interaction(object, lintern, sessionAttributes){
        let speechText = "You don't find that interesting. ";
        let room = 'kitchen';
        let url = '';
        switch(object){
            case 'stoves':
                speechText = "They are very old. They are rusty and you don't think they work anymore. "
                break;
            case 'worktop':
                speechText = "The worktop is greasy. You better don't touch it. There are some drawers below. "
                break;
            case 'drawer':
                speechText = 'You examine the drawers and you find a note inside one of them. ' 
                canTakeObjects.push('note');
                sessionAttributes['canTakeObjectsKitchenEn'] = canTakeObjects;
                break;
            case 'trapdoor':
                speechText = 'You get closer to the trapdoor. You are over it... <audio src="soundbank://soundlibrary/explosions/explosions/explosions_02"/>'
                + " Oh, no! The trapdoor is broken and you fell down the hole. You can't go back to the kitchen... You look around and barely see anything. Everything is really dark. "
                if(lintern){
                    speechText += "The flashlight doesn't work anymore, so you keep going through a weird tunnel. " 
                }else{
                    speechText += 'You have nothing to light the way, so you keep going through a weird tunnel. '  
                }
                url = "https://soundgato.s3.eu-west-3.amazonaws.com/secret.jpg";
                speechText += ' The ground is puddled and you hear your footsteps. '
                    + "<audio src='soundbank://soundlibrary/footsteps/water/water_06'/> The situation starts to give you the chills. You don't dare to touch the wall, just in case it's "
                    + 'as dirty as the floor. You finally reach the end of the tunnel and see a door. You touch it and it opens in front of you. '
                    + '<audio src="soundbank://soundlibrary/doors/doors_squeaky/squeaky_08"/> You keep going and appear in a strange place. It looks like a secret room. As soon as you enter'
                    + " you see something again. It's a ghost! It crosses the wall and disappears in front of your eyes. <audio src='soundbank://soundlibrary/horror/horror_04'/> "
                room = 'secret room';
                break;
            case 'fridge':
                speechText = "You open the fridge. It's pretty empty. You see a fish scrap and something that seems to have expired a long time ago. No one has touched this fridge in a while. ";
                break;
        }
        return {
            speechText: speechText,
            room: room,
            url: url
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsKitchen.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = "You can't take " + item;
        let success = false;
        points = 0;
        if(objectsKitchen.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'You put ' + item + ' in the inventory.' 
            if(item === 'note'){
                speechText += " You read the note. You can see a word written: meow. Below it says buy tuna, but it's crossed out. ";
                if(firstTime){
                    points += 10;
                    firstTime = false;
                    sessionAttributes['firstTimeKitchenEn'] = firstTime;
                }
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsKitchenEn'] = canTakeObjects;
            let index = objectsKitchen.indexOf(item)
            objectsKitchen.splice(index,1)
            sessionAttributes['objectsKitchenEn'] = objectsKitchen;
            if(floorObjectsKitchen.indexOf(item) !== -1){
                let index2 = floorObjectsKitchen.indexOf(item)
                floorObjectsKitchen.splice(index2,1)
                sessionAttributes['floorObjectsKitchenEn'] = floorObjectsKitchen;
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
        let speechText = 'You drop ' + item + ' in the kitchen. '; 
        objectsKitchen.push(item);
        floorObjectsKitchen.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsKitchenEn'] = canTakeObjects;
        sessionAttributes['floorObjectsKitchenEn'] = floorObjectsKitchen;
        sessionAttributes['objectsKitchenEn'] = objectsKitchen;
        return speechText;
    },
    clue(){
        let speakOutput = 'The trapdoor seems interesting. You should look at it carefully. ';
        return speakOutput;
    }
    
}