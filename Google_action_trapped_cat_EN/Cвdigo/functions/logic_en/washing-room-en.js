 // Objects in the room
 let objectsWashingRoom = [];
        
 // Objects in the floor of the room
 let floorObjectsWashingRoom = [];
 
 // Array with accomplished interactions with the objects of the room
 let washingRoomElements = [];
         
 // Array that indicates if an object can be taken
 let canTakeObjects;
 
 // Points in this room
 let points;
 
 // Number used to choose the clue
 let n;
 
 // Boolean to know if it is the first time an object is taken
 let firstTime;
 
 // Indicates if you can take the wool
 let wool;
 
 module.exports = {
     initialize(conv){
         objectsWashingRoom = ['ball of wool'];
         floorObjectsWashingRoom = [];
         washingRoomElements = [];
         canTakeObjects = [];
         points = 0;
         firstTime = true;
         wool = true;
         n = 0;
         
         conv.objectsWashingRoom = objectsWashingRoom;
         conv.floorObjectsWashingRoom = floorObjectsWashingRoom;
         conv.canTakeObjectsWashingRoom = canTakeObjects;
         conv.washingRoomElements = washingRoomElements;
         conv.firstTimeWashingMachine = firstTime;
         conv.wool = wool;
         conv.washingRoomClue = n;
     },
     continueGame(conv){
         objectsWashingRoom = conv.objectsWashingRoom;
         floorObjectsWashingRoom = conv.floorObjectsWashingRoom;
         canTakeObjects = conv.canTakeObjectsWashingRoom;
         washingRoomElements = conv.washingRoomElements;
         firstTime = conv.firstTimeWashingMachine;
         wool = conv.wool;
         points = 0;
         n = conv.washingRoomClue;
     },
     getRoom(){
         let room = 'washing room';
         return room;
     },
     look(orientation){
         let speechText = '';
         switch(orientation){
             case 'north':
                 speechText = 'You can see two doors. The left one is made of glass. The right one is a door with latch.';
                 break;
             case 'south':
                 speechText = 'You see the corridor.';
                 break;
             case 'east':
                 speechText = 'To the right there is a washing machine and a dryer. ';
                 break;
             case 'west':
                 speechText = "To the left there is a phone. It's probably the one you heard when you entered the room. There is also a slightly peculiar wall. ";
                 break;
             case 'up':
                 speechText = "Above you it's the ceiling. There is a huge skylight that lets the light in. ";
                 break;
             case 'down':
                 if(floorObjectsWashingRoom.length === 0){
                     speechText = "It's just the floor. Nothing interesting.";
                 }else{
                     speechText = 'On the ground you find: ' + floorObjectsWashingRoom;
                     if(!wool){
                         speechText += "The ball of wool is undone. You can't take it."
                     }
                 }
                 break;
             }
         return speechText;
     },
     interaction(object, dryer, conv){
         let speechText = "There's nothing interesting about it. Tell me what you want to do now. ";
         let r = 'washing room';
         points = 0;
         switch(object){
             case 'washing machine':
                 speechText = "It's an old washing machine, a bit rusty. There's nothing interesting about it. Tell me what you want to do now. ";
                 break;
             case 'dryer':
                 if(floorObjectsWashingRoom.indexOf('ball of wool') === -1 && objectsWashingRoom.indexOf('ball of wool') !== -1){
                     if(dryer){
                         speechText = "It's a dryer that has been stopped. You get closer and see something inside. Wait, is that a ball of wool? Maybe you were a cat in another life. You can play with it or take it. Tell me what you want to do now. ";
                         canTakeObjects.push('ball of wool');
                         conv.canTakeObjectsWashingRoom = canTakeObjects;
                     }else{
                         speechText = "The dryer is working now. If you could stop it, you would see what's inside. Tell me what you want to do now. ";
                     }
                 }else{
                     speechText = "There's nothing inside the dryer. Tell me what you want to do now. ";
                 }
                 break;
             case 'glass door':
                 if(washingRoomElements.indexOf('glass door') === -1){
                     speechText = "The glass door is stuck and can't be opened. Tell me what you want to do now. ";
                 }else{
                     speechText = 'The glass door is broken and you can see a bathroom. Tell me what you want to do now. ';
                 }
                 break;
             case 'door with latch':
                 if(washingRoomElements.indexOf('door with latch') === -1){
                     speechText = "<speak>"
                     + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                     + 'The door is closed. The latch is screwed to the door. Tell me what you want to do now. '
                     + "</speak>";
                 }else{
                     speechText = 'The door is open and the latch unscrewed. In front of you there is a courtyard. Tell me what you want to do now. ';    
                 }
                 break;
             case 'latch':
                 if(washingRoomElements.indexOf('door with latch') === -1){
                     speechText = 'The latch is screwed to the door. Tell me what you want to do now. '; 
                 }else{
                     speechText = 'The latch is unscrewed. Tell me what you want to do now. ';
                 }
                 break;
             case 'door':
                 speechText = 'You must choose a door: the door witch latch or the glass door. Tell me what you want to do now. '
                 break;
             case 'telephone':
                 speechText = "It's an old telephone, anchored to the wall. You pick it and you hear something: '"
                 + " I'm really hungry. You better rush. "
                 + ' You find it so weird that you write it in a paper you discover in your pocket. You save it in your inventory. Tell me what you want to do now. '  ;      
                 break;    
             case 'wall':
                 speechText = '<speak> The wall has a really weird texture. It looks like you can cross it. You get closer and... you break through the wall. '
                 + '<audio src="https://actions.google.com/sounds/v1/horror/synthetic_insects.ogg"/> What was that? You look around and you are in a kitchen. '
                 + "The wall closed behind you and you can't come back. Definitely, you don't remember your house doing this kind of stuff. Tell me what you want to do now. </speak> ";
                 r = 'kitchen';
                 break;
             case 'skylight':
                 speechText = "The skylight lets the light come through. It's the most bright room you've been at for now. Tell me what you want to do next. ";   
                 break;
         }
         return {
             speechText: speechText,
             points: points,
             room: r
         }
     },
     interactionObjects(object){
         let speechText = '';
         if(objectsWashingRoom.indexOf(object) !== -1){
             speechText += 'Maybe you can take it. Once you have it in the inventory, it could be useful to use it. ';
         }
         return speechText;
     },
     take(item, conv){
         let speechText = "You can't take " + item;
         points = 0;
         let success = false;
         if(objectsWashingRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
             speechText = 'You put ' + item + ' in the inventory.' 
             if(item === 'ball of wool' && firstTime === true){
                 points += 20;
                 firstTime = false;
                 conv.firstTimeWashingMachine = firstTime;
             }
             let i = canTakeObjects.indexOf(item)
             canTakeObjects.splice(i,1)
             conv.canTakeObjectsWashingRoom = canTakeObjects;
             let index = objectsWashingRoom.indexOf(item)
             objectsWashingRoom.splice(index,1)
             conv.objectsWashingRoom = objectsWashingRoom;
             if(floorObjectsWashingRoom.indexOf(item) !== -1){
                 let index2 = floorObjectsWashingRoom.indexOf(item);
                 floorObjectsWashingRoom.splice(index2,1);
                 conv.floorObjectsWashingRoom = floorObjectsWashingRoom;
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
         objectsWashingRoom.push(item);
         floorObjectsWashingRoom.push(item);
         canTakeObjects.push(item);
         conv.canTakeObjectsWashingRoom = canTakeObjects;
         conv.floorObjectsWashingRoom = floorObjectsWashingRoom;
         conv.objectsWashingRoom = objectsWashingRoom;
         return speechText;
     },
     use(object, element, conv){
         points = 0;
         let speakOutput = "You can't do that. Tell me what you want to do now. ";
         if(object === 'hammer' && element === 'glass door'){
             if(washingRoomElements.indexOf('glass door') === -1){
                 speakOutput = '<speak> You break the glass door with the hammer. ' 
                 + "<audio src='https://actions.google.com/sounds/v1/impacts/crash.ogg'/>"
                 + 'You see a bathroom. Tell me what you want to do now. </speak>'; 
                 washingRoomElements.push('glass door');
                 conv.washingRoomElements = washingRoomElements;
                 points += 10;
             }else{
                 speakOutput = 'The glass door is broken. You can go to the bathroom. Tell me what you want to do now. ';
             }
         } 
         if(object === 'screwdriver' && element === 'door with latch'){
             if(washingRoomElements.indexOf('puerta con cerrojo') === -1){
                 speakOutput = "<speak> <audio src='https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'/>"
                 + '<say-as interpret-as="interjection">great</say-as>'
                 + '<break time = "0.5s" />'
                 + ' The door is open! Behind the door there is a courtyard. Tell me what you want to do now. </speak> ';
                 washingRoomElements.push('door with latch');
                 conv.washingRoomElements = washingRoomElements;
                 points += 10;
             }else{
                 speakOutput = 'The door with latch is open and you can see a courtyard. Tell me what you want to do now. ';
             }
         }
         return{
             speakOutput: speakOutput,
             points: points
         }        
     },
     go(place){
         let speakOutput = "You can't go there.";
         let r = 'washing room';
         if(place === 'corridor'){
             speakOutput = 'Now you are in the corridor.';
             r = 'corridor';
         }else if(place === 'bathroom' && washingRoomElements.indexOf('glass door') !== -1){
             speakOutput = 'Now you are in the bathroom. It smells really bad.';
             r = 'bathroom';
         }else if(place === 'courtyard' && washingRoomElements.indexOf('door with latch') !== -1){
             speakOutput = 'Now you are in the courtyard. The sunlight cheers you up.';
             r = 'courtyard';
         }
         return {
             speakOutput: speakOutput,
             room: r
         }
     },
     getEnterSpeak(conv){
         let speakOutput = '</speak>';
         if(washingRoomElements.indexOf('telephone') === -1){
             speakOutput = '<audio src="https://actions.google.com/sounds/v1/household/phone_ringing.ogg"/>'
             + ' You hear a telephone. Maybe you should see who is calling. Wait, what was that? '
             + 'You just saw something... crossing the wall. Tell me what you want to do now. </speak>';
             washingRoomElements.push('telephone');
             conv.washingRoomElements = washingRoomElements;
         }
         return speakOutput;
     },
     choose(option, dryer, conv){
         points = 0;
         let speakOutput = 'That action is not possible. Tell me what you want to do now. ';
         if(dryer && canTakeObjects.indexOf('ovillo de lana') !== -1 && objectsWashingRoom.indexOf('ovillo de lana') !== -1 && floorObjectsWashingRoom.indexOf('ovillo de lana') === -1){
             if(option === 'jugar'){
                 speakOutput = 'Juegas con el ovillo y se deshace. Ahora no podrás cogerlo. Pierdes 20 puntos. Tell me what you want to do now. ';
                 points -= 20;
                 let i = canTakeObjects.indexOf('ovillo de lana')
                 canTakeObjects.splice(i,1)
                 conv.canTakeObjectsWashingRoom = canTakeObjects;
                 floorObjectsWashingRoom.push('ovillo de lana');
                 conv.floorObjectsWashingRoom = floorObjectsWashingRoom;
                 wool = false;
                 conv.wool = wool;
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
             speakOutput = 'You can break the glass door with something you should have taken from a previous room. ';
             n = 1;
         }else if(n === 1){
             speakOutput = 'The door with latch can be opened with something that you can find in the room with the glass door. ';
             n = 2;
         }else if(n === 2){
             speakOutput = 'Maybe you could press a switch you saw in a previous room to stop the dryer. ';
             n = 3;
         }else if(n === 3){
             speakOutput = "It's not a good idea to play with someone else's stuff. ";
             n = 0;
         }
         conv.washingRoomClue = n;
         return speakOutput;
     }
     
 }