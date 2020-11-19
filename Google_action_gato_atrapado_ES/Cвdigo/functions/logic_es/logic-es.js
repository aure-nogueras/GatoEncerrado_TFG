// We import the rooms
const room_es = require('./room-es')
const corridor_es = require('./corridor-es')
const washing_room_es = require('./washing-room-es')
const bathroom_es = require('./bathroom-es')
const courtyard_es = require('./courtyard-es')
const living_room_es = require('./living-room-es')
const basement_es = require('./basement-es')
const kitchen_es = require('./kitchen-es')
const secret_room_es = require('./secret-room-es')
const hall_es = require('./hall-es')

// Room
let room = '';

// Inventory of the player
let inventory = [];

// Player
let points = 0;
let name = '';

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

// Array with usable objects by themselves
let usableObjects = [];

// Boolean to know if it is the first time the telephone is used
let firstUseTelephone;

module.exports = {
    // Initialize when launching the game, so if you ask for your location or your name, it doesn't know
    launch(){
        name = '';
        room = '';
        points = 0;
        inventory = [];
    },
    initialize(conv){
        // Initialize all the rooms
        room_es.initialize(conv);
        corridor_es.initialize(conv);
        washing_room_es.initialize(conv);
        bathroom_es.initialize(conv);
        courtyard_es.initialize(conv);
        living_room_es.initialize(conv);
        basement_es.initialize(conv);
        kitchen_es.initialize(conv);
        secret_room_es.initialize(conv);
        hall_es.initialize(conv);
        
        // Inventory of the player
        inventory = [];
        conv.inventory = inventory;
        
        // Array with usable objects by themselves
        usableObjects = [];
        conv.usableObjects = usableObjects;
        
        // Player
        points = 0;
        conv.points = points;
        name = '';
        dead = false;
        conv.dead = dead;
        
        // Boolean to know if the game is over
        finished = false;
        conv.finished = finished;
        
        // Room
        room = room_es.getRoom();
        conv.room = room;

        // Boolean to know if the telephone has already been used
        firstUseTelephone = true;
        conv.firstUseTelephone = firstUseTelephone;
    },
    continueGame(conv){
        // Initialize all the rooms
        room_es.continueGame(conv);
        corridor_es.continueGame(conv);
        washing_room_es.continueGame(conv);
        bathroom_es.continueGame(conv);
        courtyard_es.continueGame(conv);
        living_room_es.continueGame(conv);
        basement_es.continueGame(conv);
        kitchen_es.continueGame(conv);
        secret_room_es.continueGame(conv);
        hall_es.continueGame(conv);
        
        // Inventory of the player
        inventory = conv.inventory;
        
        // Array with usable objects by themselves
        usableObjects = conv.usableObjects;
        
        // Player
        points = conv.points;
        name = conv.name;
        dead = conv.dead;
        
        // Boolean to know if the game is over
        finished = conv.finished;
        
        // Room
        room = conv.room;

        // Boolean to know if the telephone has already been used
        firstUseTelephone = conv.firstUseTelephone;
    },
    setName(n, conv){
      name = n;  
      conv.name = name;
    },
    getName(){
        return name;  
    },
    getPoints(){
        let speechText = 'Tienes ' + points + ' puntos';
        if(points === 0){
            speechText = 'No tienes puntos aún';
        }
        return speechText;  
    },
    look(orientation){
        let speechText = 'No puedes mirar nada porque no estás en ninguna habitación. ';
        if(room === room_es.getRoom()){
            speechText = room_es.look(orientation);
        }else if(room === corridor_es.getRoom()){
            speechText = corridor_es.look(orientation);
        }else if(room === washing_room_es.getRoom()){
            speechText = washing_room_es.look(orientation);
        }else if(room === bathroom_es.getRoom()){
            speechText = bathroom_es.look(orientation);
        }else if(room === courtyard_es.getRoom()){
            speechText = courtyard_es.look(orientation);
        }else if(room === living_room_es.getRoom()){
            speechText = living_room_es.look(orientation);
        }else if(room === basement_es.getRoom()){
            speechText = basement_es.look(orientation);
        }else if(room === kitchen_es.getRoom()){
            speechText = kitchen_es.look(orientation);
        }else if(room === secret_room_es.getRoom()){
            speechText = secret_room_es.look(orientation);
        }else if(room === hall_es.getRoom()){
            speechText = hall_es.look(orientation);
        }
        return speechText;                                                                                                                                                                                                                   return speechText ; 
    },
    interaction(object, conv){
        let speechText = 'No hay nada de interés en eso. Dime qué quieres hacer ahora.  ';
        if(room === room_es.getRoom()){
            let value = room_es.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === corridor_es.getRoom()){
            let value = corridor_es.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === washing_room_es.getRoom()){
            if(object === 'teléfono' && firstUseTelephone){
                inventory.push('papel');
                firstUseTelephone = false;
                usableObjects.push('papel');
                conv.firstUseTelephone = firstUseTelephone;
                conv.usableObjects = usableObjects;
                conv.inventory = inventory;
            }
            let dryer = corridor_es.getSwitch();
            let value = washing_room_es.interaction(object, dryer, conv);
            points += value.points;
            speechText = value.speechText;
            room = value.room;
            conv.room = room;
        }else if(room === bathroom_es.getRoom()){
            let value = bathroom_es.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === courtyard_es.getRoom()){
            let value = courtyard_es.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === living_room_es.getRoom()){
            let value = living_room_es.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === basement_es.getRoom()){
            let value = basement_es.interaction(object, conv);
            points += value.points;
            speechText = value.speechText;
        }else if(room === kitchen_es.getRoom()){
            let lintern = false;
            if(usableObjects.indexOf('linterna') !== -1 && inventory.indexOf('linterna') !== -1){
                lintern = true;
            }
            let value = kitchen_es.interaction(object, lintern, conv);
            room = value.room;
            conv.room = room;
            speechText = value.speechText;
        }else if(room === secret_room_es.getRoom()){
            let value = secret_room_es.interaction(object, conv);
            speechText = value.speechText;
            points += value.points;
        }else if(room === hall_es.getRoom()){
            let value = hall_es.interaction(object, conv);
            speechText = value.speechText;
            points += value.points;
        }
        conv.points = points;
        return speechText;
    },
    interactionObjects(object){
        let speechText = '';
        if(room === room_es.getRoom()){
            speechText = room_es.interactionObjects(object);
        }else if(room === corridor_es.getRoom()){
            speechText = corridor_es.interactionObjects(object);
        }else if(room === washing_room_es.getRoom()){
            speechText = washing_room_es.interactionObjects(object);
        }else if(room === bathroom_es.getRoom()){
            speechText = bathroom_es.interactionObjects(object);
        }else if(room === courtyard_es.getRoom()){
            speechText = courtyard_es.interactionObjects(object);
        }else if(room === living_room_es.getRoom()){
            speechText = living_room_es.interactionObjects(object);
        }else if(room === basement_es.getRoom()){
            speechText = basement_es.interactionObjects(object);
        }else if(room === kitchen_es.getRoom()){
            speechText = kitchen_es.interactionObjects(object);
        }else if(room === secret_room_es.getRoom()){
            speechText = secret_room_es.interactionObjects(object);
        }else if(room === hall_es.getRoom()){
            speechText = hall_es.interactionObjects(object);
        }
        return speechText;
    },
    inventory(){
        let speechText = ''
        if(inventory.length === 0){
            speechText = 'No tienes nada en el inventario.'
        }else{
            speechText = 'En el inventario tienes: ' + inventory;
        }
        return speechText;
    },
    take(item, conv){
        let speechText = 'No puedes coger ' + item + '. Dime qué quieres hacer ahora.  ';
        let success = false;
        
        if(room === room_es.getRoom()){
            let value = room_es.take(item, conv);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
        }else if(room === corridor_es.getRoom()){
            let value = corridor_es.take(item, conv);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
            if(item === 'carta'){
                usableObjects.push('carta');
                conv.usableObjects = usableObjects;
            }
        }else if(room === washing_room_es.getRoom()){
            let value = washing_room_es.take(item, conv);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
        }else if(room === bathroom_es.getRoom()){
            let value = bathroom_es.take(item, conv);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
            if(item === 'papel higiénico'){
                usableObjects.push('papel higiénico');
            }else if(item === 'alcohol'){
                usableObjects.push('alcohol');
            }
            conv.usableObjects = usableObjects;
        }else if(room === courtyard_es.getRoom()){
            let value = courtyard_es.take(item, conv);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
            if(item === 'reproductor'){
                usableObjects.push('reproductor');
                conv.usableObjects = usableObjects;
            }
        }else if(room === living_room_es.getRoom()){
            let value = living_room_es.take(item, conv);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
            if(item === 'foto'){
                usableObjects.push('foto');
                conv.usableObjects = usableObjects;
            }
        }else if(room === basement_es.getRoom()){
            let value = basement_es.take(item, conv);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
        }else if(room === kitchen_es.getRoom()){
            let value = kitchen_es.take(item, conv)
            speechText = value.speechText;
            success = value.success;
            points += value.points;
            if(item === 'nota'){
                usableObjects.push('nota');
                conv.usableObjects = usableObjects;
            }
        }else if(room === secret_room_es.getRoom()){
            let value = secret_room_es.take(item, conv);
            speechText = value.speechText;
            success = value.success;
        }else if(room === hall_es.getRoom()){
            let value = hall_es.take(item, conv);
            speechText = value.speechText;
            success = value.success;
            points += value.points;
        }
        if(success){
            inventory.push(item);
            conv.inventory = inventory;
        }

        if(room !== corridor_es.getRoom() && room !== ''){
            speechText += ' Dime qué quieres hacer ahora.  ';
        }
        conv.points = points;
        return speechText;
    },
    release(item, conv){
        let speechText = 'No puedes soltar ' + item;
        
        if(inventory.indexOf(item) !== -1){
            if(room === room_es.getRoom()){
                speechText = room_es.release(item, conv);
            }else if(room === corridor_es.getRoom()){
                speechText = corridor_es.release(item, conv);
            }else if(room === washing_room_es.getRoom()){
                speechText = washing_room_es.release(item, conv);
            }else if(room === bathroom_es.getRoom()){
                speechText = bathroom_es.release(item, conv);
            }else if(room === courtyard_es.getRoom()){
                speechText = courtyard_es.release(item, conv);
            }else if(room === living_room_es.getRoom()){
                speechText = living_room_es.release(item, conv);
            }else if(room === basement_es.getRoom()){
                speechText = basement_es.release(item, conv);
            }else if(room === kitchen_es.getRoom()){
                speechText = kitchen_es.release(item, conv);
            }else if(room === secret_room_es.getRoom()){
                speechText = secret_room_es.release(item, conv);
            }else if(room === hall_es.getRoom()){
                speechText = hall_es.release(item, conv);
            }
            let index = inventory.indexOf(item, conv);
            inventory.splice(index,1);
            conv.inventory = inventory;
        }
        return speechText;
    },
    use(object, element, conv){
        let speakOutput = 'No puedes hacer eso. No olvides que para usar un objeto tienes que tenerlo en el inventario. Dime qué quieres hacer ahora.  ';
        
        if(inventory.indexOf(object) !== -1){
            if(room === room_es.getRoom()){
                let value = room_es.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                dead = value.dead;
            }else if(room === washing_room_es.getRoom()){
                let value = washing_room_es.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === bathroom_es.getRoom()){
                let value = bathroom_es.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === living_room_es.getRoom()){
                let value = living_room_es.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === basement_es.getRoom()){
                let value = basement_es.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                let four = value.fourObjects;
                if(finished){
                    if(four){
                        speakOutput += ' <audio src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"/> ¿Qué ha pasado? Abres los ojos y estás en tu habitación, en tu cama. '
                                        + ' Todo parece normal. ';
                        if(inventory.indexOf('gato') !== -1){
                            speakOutput += ' <audio src="https://actions.google.com/sounds/v1/animals/cat_purr_close.ogg"/> ¡Oh! El gatito está encima de ti. Un momento... Tú no tenías mascotas. ¿Ha sido un sueño o ha sido real? Miras al gato y lo acaricias. Sea como sea, estás feliz de tenerlo. '
                        }else{
                            speakOutput += ' Tienes recuerdos de un gato... Pero no hay rastro de ninguno a tu alrededor. ¿Habrá sido todo un sueño? '
                        }
                    }else{
                        if(inventory.indexOf('gato') === -1){
                            speakOutput += 'Te vas triste porque has dejado al gatito allí. '
                        }else{
                            speakOutput += 'Has superado con éxito el desafío. Has adoptado un gato y eres libre, no puedes ser más feliz. '
                        }
                    }
                }
            }else if(room === secret_room_es.getRoom()){
                let value = secret_room_es.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === hall_es.getRoom()){
                let value = hall_es.use(object,element, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                if(finished){
                    if(inventory.indexOf('gato') === -1){
                        speakOutput += ' Te vas triste porque has dejado al gatito allí. Además, te has convertido en un fantasma. '
                    }else{
                        speakOutput += 'Has superado con éxito el desafío. Has adoptado un gato fantasma y eres libre, no puedes ser más feliz. El hecho de que ya no tengas vida solo son efectos colaterales. '
                    }
                }else{
                    speakOutput += ' Dime qué quieres hacer ahora.  ';
                }
            }
        }
        if(dead){
            speakOutput = speakOutput + '¡Oh, oh! ¡Estás muerto!';
        }
        if(finished){
            speakOutput = speakOutput + ' Tu puntuación ha sido de ' 
            + points + ' puntos, ' + name + ' </speak>'; 
        }
        
        conv.points = points;
        conv.dead = dead;
        conv.finished = finished;
        
        return {
            speakOutput: speakOutput,
            dead: dead,
            finished: finished
        }
    },
    useObject(object, conv){
        let speakOutput = 'No puedes usar eso. No olvides que debes tener el objeto en el inventario. ';
        let read = false;
        
        if(inventory.indexOf(object) !== -1){
            if(object === 'linterna'){
                if(usableObjects.indexOf('linterna') !== -1){
                    if(room === corridor_es.getRoom()){
                        let value = corridor_es.useObject(conv);
                        points += value.points;
                        speakOutput = value.speakOutput;
                    }else{
                        speakOutput = 'Ahora no necesitas la linterna';
                    }   
                }else{
                    speakOutput = 'La linterna no tiene pilas.';
                }
            }
            if(usableObjects.indexOf(object) !== -1){
                if(object === 'carta'){
                    speakOutput = '<speak> Lees de nuevo la carta: '
                    + 'Llevo bastante tiempo observándote. Te estoy poniendo a prueba con una serie de desafíos. '
                    + 'Quiero ver si eres capaz de resolverlos para ser digno de la misión que quiero encomendarte. '
                    + 'Sigue avanzando para descubrir de qué trata todo esto. Solo puedo decirte que confío en ti para que llegues a ser el recipiente del que beba. '
                    + 'Firmado: <say-as interpret-as="characters">E</say-as>. '
                    + '<say-as interpret-as="characters">C</say-as>. '
                    + '<say-as interpret-as="characters">B</say-as>. '
                    + '<say-as interpret-as="characters">I</say-as>. ';
                    read = true;
                }
                if(object === 'papel higiénico'){
                    speakOutput = "Miras de nuevo las inscripciones del papel. "
                    + "Son cuatro símbolos: un árbol, una nube, una hoguera y un río.";
                }
                if(object === 'foto'){
                    speakOutput = 'Miras otra vez la foto del gato blanco. Es tan mono que te da paz. Lees de nuevo el texto: '
                    + "Me gusta perseguir y atrapar aquello que se mueve. "
                    + '¿Me darás esa oportunidad?';
                }
                if(object === 'alcohol'){
                    speakOutput = 'No es el momento de usar el alcohol.';
                    if(room === basement_es.getRoom()){
                        let value = basement_es.useObject(conv);
                        speakOutput = value.speakOutput;
                        dead = value.dead;
                        points += value.points;
                    }
                }
                if(object === 'nota'){
                    speakOutput = 'Lees la nota para ver lo que pone. Ves una palabra escrita: miau. Abajo pone comprar atún, pero está tachado.';
                }
                if(object === 'papel'){
                    speakOutput = 'Lees el papel en el que has apuntado lo que escuchaste en el teléfono: '
                    + " Tengo mucha hambre, un apetito felino diría yo. "
                    + 'Más vale que te des prisa. ';
                }
                if(object === 'reproductor'){
                    speakOutput = ' Escuchas de nuevo el mensaje del reproductor. '
                    + " Ve mucho más allá. No olvides las hebras que se entretejen y forman un todo. ";   
                }
            }
               
        }
        if(dead){
            speakOutput = speakOutput + '¡Oh, oh! ¡Estás muerto!'
            + ' Tu puntuación ha sido de ' 
            + points + ' puntos, ' + name;
        }
        
        conv.points = points;
        conv.dead = dead;
        
        return {
            speak: speakOutput,
            faint : dead,
            read: read
        }
    },
    combine(object, object2, conv){
        let speakOutput = 'No puedes hacer eso. Recuerda que para combinar dos objetos tienes que tenerlos en el inventario.';
        
        if(inventory.indexOf(object) !== -1 && inventory.indexOf(object2) !== -1){
            if((object === 'linterna' && object2 === 'pilas') || (object2 === 'linterna' && object === 'pilas')){
                speakOutput = 'Has combinado la linterna y las pilas. Ahora funcionará si es necesaria.';
                usableObjects.push('linterna');
                conv.usableObjects = usableObjects;
                let index = inventory.indexOf('pilas');
                inventory.splice(index,1);
                conv.inventory = inventory;
                points += 10;
                conv.points = points;
            }
        }
        return speakOutput;
    },
    numberCode(number, conv){
        let speakOutput = 'No puedes introducir nada ahora. Dime qué quieres hacer ahora.  ';
        
        if(room === corridor_es.getRoom()){
            let value = corridor_es.numberCode(number, conv);
            points += value.points;
            speakOutput = value.speakOutput;
        }else if(room === living_room_es.getRoom()){
            let value = living_room_es.numberCode(number, conv);
            points += value.points;
            speakOutput = value.speakOutput;
        }
        conv.points = points;
        return speakOutput;
    },
    pushSymbol(symbol, symbol2, symbol3, symbol4, conv){
        let speakOutput = 'No hay nada que pulsar ahora. Dime qué quieres hacer ahora.  ';
        if(room === courtyard_es.getRoom()){
            let value = courtyard_es.pushSymbol(symbol, symbol2, symbol3, symbol4, conv);
            points += value.points;
            speakOutput = value.speakOutput;
        }
        conv.points = points;
        return speakOutput;
    },
    read(author){
        let speakOutput = 'No es el momento de leer.';
        if(room === living_room_es.getRoom()){
            speakOutput = living_room_es.read(author);
        }
        return speakOutput;
    },
    giveCats(element1, element2, element3, element4, conv){
        let speakOutput = 'No es el momento de dar nada. Dime qué quieres hacer ahora.  ';
        let success = false;
        
        if(room === basement_es.getRoom()){
            if(inventory.indexOf('cuenco') !== -1 && inventory.indexOf('comida de gato') !== -1 && inventory.indexOf('ovillo de lana') !== -1 && inventory.indexOf('ratón de juguete') !== -1){
                let value = basement_es.giveCats(element1, element2, element3, element4, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                success = value.success;
            }else{
                speakOutput = 'Necesitas tener los objetos en el inventario para poder dárselos al gato. Dime qué quieres hacer ahora.  ';
            }
        }
        
        if(success){
            let index = inventory.indexOf('cuenco');
            inventory.splice(index,1);
            index = inventory.indexOf('comida de gato');
            inventory.splice(index,1);
            index = inventory.indexOf('ovillo de lana');
            inventory.splice(index,1);
            index = inventory.indexOf('ratón de juguete');
            inventory.splice(index,1); 
            conv.inventory = inventory;
        }
        conv.points = points;

        return speakOutput;
    },
    giveCats2(element1, element2, element3, conv){
        let speakOutput = 'No es el momento de dar nada. Dime qué quieres hacer ahora.  ';
        let success = false;
        
        if(room === basement_es.getRoom()){
            if(inventory.indexOf(element1) !== -1 && inventory.indexOf(element2) !== -1 && inventory.indexOf(element3) !== -1){
                let value = basement_es.giveCats2(element1, element2, element3, conv);
                points += value.points;
                speakOutput = value.speakOutput;
                success = value.success;
            }else{
                speakOutput = 'Necesitas tener los objetos en el inventario para poder dárselos al gato. Dime qué quieres hacer ahora.  ';
            }
        }
        
        if(success){
            let index = inventory.indexOf(element1);
            inventory.splice(index,1);
            index = inventory.indexOf(element2);
            inventory.splice(index,1);
            index = inventory.indexOf(element3);
            inventory.splice(index,1);
            conv.inventory = inventory;
        }
        conv.points = points;

        return speakOutput;
    },
    giveCats3(element1, element2, conv){
        let speakOutput = 'No es el momento de dar nada. Dime qué quieres hacer ahora.  ';
        
        if(room === basement_es.getRoom()){
            if(inventory.indexOf(element1) !== -1 && inventory.indexOf(element2) !== -1){
                let value = basement_es.giveCats3(element1, element2, conv);
                points += value.points;
                speakOutput = value.speakOutput;
            }else{
                speakOutput = 'Necesitas tener los objetos en el inventario para poder dárselos al gato. Dime qué quieres hacer ahora.  ';
            }
        }
        conv.points = points;
      
        return speakOutput;
    },
    giveCats4(element1, conv){
        let speakOutput = 'No es el momento de dar nada. Dime qué quieres hacer ahora.  ';
        let dead = false;
        
        if(room === basement_es.getRoom()){
            if(inventory.indexOf(element1) !== -1){
                let value = basement_es.giveCats4(element1);
                points += value.points;
                speakOutput = value.speakOutput;
                dead = value.dead;
            }else{
                speakOutput = 'Necesitas tener el objeto en el inventario para poder dárselo al gato. Dime qué quieres hacer ahora.  ';
            } 
        }
        
        if(dead){
            speakOutput = speakOutput + '¡Oh, oh! ¡Estás muerto!'
            + ' Tu puntuación ha sido de ' 
            + points + ' puntos, ' + name + '</speak>';
            finished = true;
        }
        conv.dead = dead;
        conv.points = points;
        conv.finished = finished;
        
        return {
            speakOutput: speakOutput,
            dead: dead
        }
    },
    go(place, conv){
        let speechText = 'No puedes ir ahí. Dime qué quieres hacer ahora.  ';
        let r = '';
        
        if(room !== place){
            if(room === room_es.getRoom()){
                let value = room_es.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === corridor_es.getRoom()){
                let value = corridor_es.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === washing_room_es.getRoom()){
                let value = washing_room_es.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === bathroom_es.getRoom()){
                let value = bathroom_es.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === courtyard_es.getRoom()){
                let value = courtyard_es.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === living_room_es.getRoom()){
                let value = living_room_es.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === basement_es.getRoom()){
                let value = basement_es.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === kitchen_es.getRoom()){
                r = kitchen_es.getRoom();
            }else if(room === secret_room_es.getRoom()){
                let value = secret_room_es.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }else if(room === hall_es.getRoom()){
                let value = hall_es.go(place);
                speechText = value.speakOutput;
                r = value.room;
            }
        }else{
            speechText = 'Ya estás ahí. Dime qué quieres hacer ahora.  ';
            r = room;
        }
        
        conv.room = r;
        
        if(r === 'pasillo'){
            if(room !== r){
                corridor_es.setLight(false, conv);
            }
        }else if(r === 'sala de lavadoras'){
            if(room === 'pasillo'){
                speechText += washing_room_es.getEnterSpeak(conv);
            }
        }

        if(room !== 'pasillo' && room !== ''){
            speechText += ' Dime qué quieres hacer ahora.  ';
        }
        room = r;
        
        return speechText;
    },
    where(){
        let speakOutput = 'Aún no has empezado el juego.';
        if (room !== ''){
            speakOutput = 'Estás en ' + room;
        }
        return speakOutput;
    },
    clue(conv){
        let speakOutput = 'No puedo darte pistas porque aún no estás en ninguna habitación.';
        
        if(room === room_es.getRoom()){
            speakOutput = room_es.clue(conv);
        }else if(room === corridor_es.getRoom()){
            speakOutput = corridor_es.clue(conv);
        }else if(room === washing_room_es.getRoom()){
            speakOutput = washing_room_es.clue(conv);
        }else if(room === bathroom_es.getRoom()){
            speakOutput = bathroom_es.clue(conv);
        }else if(room === courtyard_es.getRoom()){
            speakOutput = courtyard_es.clue(conv);
        }else if(room === living_room_es.getRoom()){
            speakOutput = living_room_es.clue(conv);
        }else if(room === basement_es.getRoom()){
            speakOutput = basement_es.clue(conv);
        }else if(room === kitchen_es.getRoom()){
            speakOutput = kitchen_es.clue();
        }else if(room === secret_room_es.getRoom()){
            speakOutput = secret_room_es.clue();
        }else if(room === hall_es.getRoom()){
            speakOutput = hall_es.clue(conv);
        }
        points -= 10;
        conv.points = points;
        return speakOutput;
    },
    choose(option, conv){
        let speakOutput = 'No es el momento de hacer eso. Dime qué quieres hacer ahora.  ';
        if(room === room_es.getRoom()){
            let value = room_es.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
           
        }else if(room === washing_room_es.getRoom()){
            let dryer = corridor_es.getSwitch();
            let value = washing_room_es.choose(option, dryer, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === courtyard_es.getRoom()){
            let value = courtyard_es.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === living_room_es.getRoom()){
            let value = living_room_es.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === hall_es.getRoom()){
            let value = hall_es.choose(option, conv);
            speakOutput = value.speakOutput;
            points += value.points;
            finished = value.finished;
            if(finished){
                speakOutput = speakOutput + ' Tu puntuación ha sido de ' 
                + points + ' puntos, ' + name + '</speak>';
            }
        }
        conv.points = points;
        conv.finished = finished;
        return {
            speakOutput: speakOutput,
            finished: finished
        }
    },
    chooseObject(option, object, conv){
        let speakOutput = 'O no es el momento de hacer eso o no puedes. Dime qué quieres hacer ahora.  ';
        if(room === room_es.getRoom() && object === 'comida de gato'){
            let value = room_es.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === washing_room_es.getRoom() && object === 'ovillo de lana'){
            let dryer = corridor_es.getSwitch();
            let value = washing_room_es.choose(option, dryer, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === courtyard_es.getRoom() && object === 'ratón de juguete'){
            let value = courtyard_es.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === living_room_es.getRoom() && object === 'cuenco'){
            let value = living_room_es.choose(option, conv);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === hall_es.getRoom() && object === 'veneno'){
            let value = hall_es.choose(option, conv);
            speakOutput = value.speakOutput;
            points += value.points;
            finished = value.finished;
            if(finished){
                speakOutput = speakOutput + ' Tu puntuación ha sido de ' 
                + points + ' puntos, ' + name + '</speak>';
            }
        }
        conv.points = points;
        conv.finished = finished;
        return {
            speakOutput: speakOutput,
            finished: finished
        }
    }
}