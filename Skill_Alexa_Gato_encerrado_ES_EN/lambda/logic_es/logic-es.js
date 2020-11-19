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
let room;

// Inventory of the player
let inventory;

// Player
let points;
let name;

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

// Array with usable objects by themselves
let usableObjects;

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
    initialize(sessionAttributes){
        // Initialize all the rooms
        room_es.initialize(sessionAttributes);
        corridor_es.initialize(sessionAttributes);
        washing_room_es.initialize(sessionAttributes);
        bathroom_es.initialize(sessionAttributes);
        courtyard_es.initialize(sessionAttributes);
        living_room_es.initialize(sessionAttributes);
        basement_es.initialize(sessionAttributes);
        kitchen_es.initialize(sessionAttributes);
        secret_room_es.initialize(sessionAttributes);
        hall_es.initialize(sessionAttributes);
        
        // Inventory of the player
        inventory = [];
        sessionAttributes['inventoryEs'] = inventory;
        
        // Array with usable objects by themselves
        usableObjects = [];
        sessionAttributes['usableObjectsEs'] = usableObjects;
        
        // Player
        points = 0;
        sessionAttributes['pointsEs'] = points;
        name = '';
        dead = false;
        sessionAttributes['deadEs'] = dead;
        
        // Boolean to know if the game is over
        finished = false;
        sessionAttributes['finishedEs'] = finished;
        
        // Room
        room = room_es.getRoom();
        sessionAttributes['roomEs'] = room;
        
        // Boolean to know if the telephone has already been used
        firstUseTelephone = true;
        sessionAttributes['firstUseTelephoneEs'] = firstUseTelephone;
    },
    continueGame(sessionAttributes){
        // Initialize all the rooms
        room_es.continueGame(sessionAttributes);
        corridor_es.continueGame(sessionAttributes);
        washing_room_es.continueGame(sessionAttributes);
        bathroom_es.continueGame(sessionAttributes);
        courtyard_es.continueGame(sessionAttributes);
        living_room_es.continueGame(sessionAttributes);
        basement_es.continueGame(sessionAttributes);
        kitchen_es.continueGame(sessionAttributes);
        secret_room_es.continueGame(sessionAttributes);
        hall_es.continueGame(sessionAttributes);
        
        // Inventory of the player
        inventory = sessionAttributes['inventoryEs'];
        
        // Array with usable objects by themselves
        usableObjects = sessionAttributes['usableObjectsEs'];
        
        // Player
        points = sessionAttributes['pointsEs'];
        name = sessionAttributes['nameEs'];
        dead = sessionAttributes['deadEs'];
        
        // Boolean to know if the game is over
        finished = sessionAttributes['finishedEs'];
        
        // Room
        room = sessionAttributes['roomEs'];
        
        // Boolean to know if the telephone has already been used
        firstUseTelephone = sessionAttributes['firstUseTelephoneEs'];
        
        // Image associated to the room
        let url = this.getUrl(room);
        
        return url;
    },
    // Gets the image of the corresponding room
    getUrl(room){
        let url = '';
        if(room === 'habitación'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/bedroom.jpg";
        }else if(room === 'pasillo'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/corridor.jpg";
        }else if(room === 'sala de lavadoras'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/washing.png"
        }else if(room === 'cocina'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/kitchen.jpg";
        }else if(room === 'habitación secreta'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/secret.jpg";
        }else if(room === 'recibidor'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/hall.png";
        }else if(room === 'patio'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/courtyard.png";
        }else if(room === 'baño'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/bath.png";
        }else if(room === 'salón'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/living.jpg";
        }else if(room === 'sótano'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/basement.jpg";
        } 
        return url;
    },
    setName(n, sessionAttributes){
      name = n;  
      sessionAttributes['nameEs'] = name;
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
        let url = '';
        if(room === room_es.getRoom()){
            let value = room_es.look(orientation);
            speechText = value.speechText;
            url = value.url;
        }else if(room === corridor_es.getRoom()){
            let value = corridor_es.look(orientation);
            speechText = value.speechText;
            url = value.url;
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
        
        return {
            speechText: speechText,
            url: url
        }
    },
    interaction(object, sessionAttributes){
        let speechText = 'No hay nada de interés en eso.';
        let url = '';
        if(room === room_es.getRoom()){
            let value = room_es.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === corridor_es.getRoom()){
            let value = corridor_es.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === washing_room_es.getRoom()){
            if(object === 'teléfono' && firstUseTelephone){
                inventory.push('papel');
                firstUseTelephone = false;
                usableObjects.push('papel');
                sessionAttributes['firstUseTelephoneEs'] = firstUseTelephone;
                sessionAttributes['usableObjectsEs'] = usableObjects;
                sessionAttributes['inventoryEs'] = inventory;
            }
            let dryer = corridor_es.getSwitch();
            let value = washing_room_es.interaction(object, dryer, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            room = value.room;
            sessionAttributes['roomEs'] = room;
            url = value.url;
        }else if(room === bathroom_es.getRoom()){
            let value = bathroom_es.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === courtyard_es.getRoom()){
            let value = courtyard_es.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === living_room_es.getRoom()){
            let value = living_room_es.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === basement_es.getRoom()){
            let value = basement_es.interaction(object, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
        }else if(room === kitchen_es.getRoom()){
            let lintern = false;
            if(usableObjects.indexOf('linterna') !== -1 && inventory.indexOf('linterna') !== -1){
                lintern = true;
            }
            let value = kitchen_es.interaction(object, lintern, sessionAttributes);
            room = value.room;
            sessionAttributes['roomEs'] = room;
            url = value.url;
            speechText = value.speechText;
        }else if(room === secret_room_es.getRoom()){
            let value = secret_room_es.interaction(object, sessionAttributes);
            speechText = value.speechText;
            points += value.points;
        }else if(room === hall_es.getRoom()){
            let value = hall_es.interaction(object, sessionAttributes);
            speechText = value.speechText;
            points += value.points;
        }
        sessionAttributes['pointsEs'] = points;
        return {
            speechText: speechText,
            url: url
        }
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
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        let success = false;
        
        if(room === room_es.getRoom()){
            let value = room_es.take(item, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
        }else if(room === corridor_es.getRoom()){
            let value = corridor_es.take(item, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
            if(item === 'carta'){
                usableObjects.push('carta');
                sessionAttributes['usableObjectsEs'] = usableObjects;
            }
        }else if(room === washing_room_es.getRoom()){
            let value = washing_room_es.take(item, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
        }else if(room === bathroom_es.getRoom()){
            let value = bathroom_es.take(item, sessionAttributes);
            points += value.points;
            speechText = value.speechText;
            success = value.success;
            if(item === 'papel higiénico'){
                usableObjects.push('papel higiénico');
            }else if(item === 'alcohol'){
                usableObjects.push('alcohol');
            }
            sessionAttributes['usableObjectsEs'] = usableObjects;
        }else if(room === courtyard_es.getRoom()){
            let value = courtyard_es.take(item, sessionAttributes);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
            if(item === 'reproductor'){
                usableObjects.push('reproductor');
                sessionAttributes['usableObjectsEs'] = usableObjects;
            }
        }else if(room === living_room_es.getRoom()){
            let value = living_room_es.take(item, sessionAttributes);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
            if(item === 'foto'){
                usableObjects.push('foto');
                sessionAttributes['usableObjectsEs'] = usableObjects;
            }
        }else if(room === basement_es.getRoom()){
            let value = basement_es.take(item, sessionAttributes);
            points += value.points;
            success = value.success;
            speechText = value.speechText;
        }else if(room === kitchen_es.getRoom()){
            let value = kitchen_es.take(item, sessionAttributes)
            speechText = value.speechText;
            success = value.success;
            points += value.points;
            if(item === 'nota'){
                usableObjects.push('nota');
                sessionAttributes['usableObjectsEs'] = usableObjects;
            }
        }else if(room === secret_room_es.getRoom()){
            let value = secret_room_es.take(item, sessionAttributes);
            speechText = value.speechText;
            success = value.success;
        }else if(room === hall_es.getRoom()){
            let value = hall_es.take(item, sessionAttributes);
            speechText = value.speechText;
            success = value.success;
            points += value.points;
        }
        if(success){
            inventory.push(item);
            sessionAttributes['inventoryEs'] = inventory;
        }
        sessionAttributes['pointsEs'] = points;
        return speechText;
    },
    release(item, sessionAttributes){
        let speechText = 'No puedes soltar ' + item;
        
        if(inventory.indexOf(item) !== -1){
            if(room === room_es.getRoom()){
                speechText = room_es.release(item, sessionAttributes);
            }else if(room === corridor_es.getRoom()){
                speechText = corridor_es.release(item, sessionAttributes);
            }else if(room === washing_room_es.getRoom()){
                speechText = washing_room_es.release(item, sessionAttributes);
            }else if(room === bathroom_es.getRoom()){
                speechText = bathroom_es.release(item, sessionAttributes);
            }else if(room === courtyard_es.getRoom()){
                speechText = courtyard_es.release(item, sessionAttributes);
            }else if(room === living_room_es.getRoom()){
                speechText = living_room_es.release(item, sessionAttributes);
            }else if(room === basement_es.getRoom()){
                speechText = basement_es.release(item, sessionAttributes);
            }else if(room === kitchen_es.getRoom()){
                speechText = kitchen_es.release(item, sessionAttributes);
            }else if(room === secret_room_es.getRoom()){
                speechText = secret_room_es.release(item, sessionAttributes);
            }else if(room === hall_es.getRoom()){
                speechText = hall_es.release(item, sessionAttributes);
            }
            let index = inventory.indexOf(item);
            inventory.splice(index,1);
            sessionAttributes['inventoryEs'] = inventory;
        }
        return speechText;
    },
    use(object, element, sessionAttributes){
        let speakOutput = 'No puedes hacer eso. No olvides que para usar un objeto tienes que tenerlo en el inventario.';
        
        if(inventory.indexOf(object) !== -1){
            if(room === room_es.getRoom()){
                let value = room_es.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                dead = value.dead;
            }else if(room === washing_room_es.getRoom()){
                let value = washing_room_es.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === bathroom_es.getRoom()){
                let value = bathroom_es.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === living_room_es.getRoom()){
                let value = living_room_es.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === basement_es.getRoom()){
                let value = basement_es.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                let four = value.fourObjects;
                if(finished){
                    if(four){
                        speakOutput += ' <audio src="soundbank://soundlibrary/alarms/buzzers/buzzers_01"/> ¿Qué ha pasado? Abres los ojos y estás en tu habitación, en tu cama. '
                                        + ' Todo parece normal. ';
                        if(inventory.indexOf('gato') !== -1){
                            speakOutput += ' <audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_purr_03"/> ¡Oh! El gatito está encima de ti. Un momento... Tú no tenías mascotas. ¿Ha sido un sueño o ha sido real? Miras al gato y lo acaricias. Sea como sea, estás feliz de tenerlo. '
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
                let value = secret_room_es.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else if(room === hall_es.getRoom()){
                let value = hall_es.use(object,element, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                finished = value.finished;
                if(finished){
                    if(inventory.indexOf('gato') === -1){
                        speakOutput += ' Te vas triste porque has dejado al gatito allí. Además, te has convertido en un fantasma. '
                    }else{
                        speakOutput += 'Has superado con éxito el desafío. Has adoptado un gato fantasma y eres libre, no puedes ser más feliz. El hecho de que ya no tengas vida solo son efectos colaterales. '
                    }
                }
            }
        }
        if(dead){
            speakOutput = speakOutput + '¡Oh! ¡Estás muerto!';
        }
        if(finished){
            speakOutput = speakOutput + ' Tu puntuación ha sido de ' 
            + points + ' puntos, ' + name;
        }
        
        sessionAttributes['pointsEs'] = points;
        sessionAttributes['deadEs'] = dead;
        sessionAttributes['finishedEs'] = finished;
        
        return {
            speakOutput: speakOutput,
            dead: dead,
            finished: finished
        }
    },
    useObject(object, sessionAttributes){
        let speakOutput = 'No puedes usar eso. No olvides que debes tener el objeto en el inventario.';
        
        if(inventory.indexOf(object) !== -1){
            if(object === 'linterna'){
                if(usableObjects.indexOf('linterna') !== -1){
                    if(room === corridor_es.getRoom()){
                        let value = corridor_es.useObject(sessionAttributes);
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
                    + '<voice name="Enrique"> Llevo bastante tiempo observándote. Te estoy poniendo a prueba con una serie de desafíos. '
                    + 'Quiero ver si eres capaz de resolverlos para ser digno de la misión que quiero encomendarte. '
                    + 'Sigue avanzando para descubrir de qué trata todo esto. Solo puedo decirte que confío en ti para que llegues a ser el recipiente del que beba. '
                    + 'Firmado: <say-as interpret-as="characters">E</say-as>.'
                    + '<say-as interpret-as="characters">C</say-as>.'
                    + '<say-as interpret-as="characters">B</say-as>.'
                    + '<say-as interpret-as="characters">I</say-as>.'
                    + '</voice>'
                    + '</speak>';
                }
                if(object === 'papel higiénico'){
                    speakOutput = "Miras de nuevo las inscripciones del papel. "
                    + "Son cuatro símbolos: un árbol, una nube, una hoguera y un río.";
                }
                if(object === 'foto'){
                    speakOutput = 'Miras otra vez la foto del gato blanco. Es tan mono que te da paz. Lees de nuevo el texto: '
                    + "<voice name='Enrique'> Me gusta perseguir y atrapar aquello que se mueve. "
                    + '¿Me darás esa oportunidad?'
                    + '</voice>';
                }
                if(object === 'alcohol'){
                    speakOutput = 'No es el momento de usar el alcohol.';
                    if(room === basement_es.getRoom()){
                        let value = basement_es.useObject(sessionAttributes);
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
                    + "<voice name='Enrique'> Tengo mucha hambre, un apetito felino diría yo. "
                    + 'Más vale que te des prisa.'
                    + '</voice> ';
                }
                if(object === 'reproductor'){
                    speakOutput = ' Escuchas de nuevo el mensaje del reproductor. '
                    + "<voice name='Enrique'> Ve mucho más allá. No olvides las hebras que se entretejen y forman un todo."
                    + '</voice>'   
                }
            }
        }
        if(dead){
            speakOutput = speakOutput + '¡Oh! ¡Estás muerto!'
            + ' Tu puntuación ha sido de ' 
            + points + ' puntos, ' + name;
        }
        
        sessionAttributes['pointsEs'] = points;
        sessionAttributes['deadEs'] = dead;
        
        return {
            speak: speakOutput,
            faint : dead
        }
    },
    combine(object, object2, sessionAttributes){
        let speakOutput = 'No puedes hacer eso. Recuerda que para combinar dos objetos tienes que tenerlos en el inventario.';
        
        if(inventory.indexOf(object) !== -1 && inventory.indexOf(object2) !== -1){
            if((object === 'linterna' && object2 === 'pilas') || (object2 === 'linterna' && object === 'pilas')){
                speakOutput = 'Has combinado la linterna y las pilas. Ahora funcionará si es necesaria.';
                usableObjects.push('linterna');
                sessionAttributes['usableObjectsEs'] = usableObjects;
                let index = inventory.indexOf('pilas');
                inventory.splice(index,1);
                sessionAttributes['inventoryEs'] = inventory;
                points += 10;
                sessionAttributes['pointsEs'] = points;
            }
        }
        return speakOutput;
    },
    numberCode(number, sessionAttributes){
        let speakOutput = 'No puedes introducir nada ahora. ';
        
        if(room === corridor_es.getRoom()){
            let value = corridor_es.numberCode(number, sessionAttributes);
            points += value.points;
            speakOutput = value.speakOutput;
        }else if(room === living_room_es.getRoom()){
            let value = living_room_es.numberCode(number, sessionAttributes);
            points += value.points;
            speakOutput = value.speakOutput;
        }
        sessionAttributes['pointsEs'] = points;
        return speakOutput;
    },
    pushSymbol(symbol, symbol2, symbol3, symbol4, sessionAttributes){
        let speakOutput = 'No hay nada que pulsar ahora.';
        if(room === courtyard_es.getRoom()){
            let value = courtyard_es.pushSymbol(symbol, symbol2, symbol3, symbol4, sessionAttributes);
            points += value.points;
            speakOutput = value.speakOutput;
        }
        sessionAttributes['pointsEs'] = points;
        return speakOutput;
    },
    read(author){
        let speakOutput = 'No es el momento de leer.';
        if(room === living_room_es.getRoom()){
            speakOutput = living_room_es.read(author);
        }
        return speakOutput;
    },
    giveCats(element1, element2, element3, element4, sessionAttributes){
        let speakOutput = 'No es el momento de dar nada.';
        let success = false;
        
        if(room === basement_es.getRoom()){
            if(inventory.indexOf('cuenco') !== -1 && inventory.indexOf('comida de gato') !== -1 && inventory.indexOf('ovillo de lana') !== -1 && inventory.indexOf('ratón de juguete') !== -1){
                let value = basement_es.giveCats(element1, element2, element3, element4, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                success = value.success;
            }else{
                speakOutput = 'Necesitas tener los objetos en el inventario para poder dárselos al gato.';
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
            sessionAttributes['inventoryEs'] = inventory;
        }
        sessionAttributes['pointsEs'] = points;

        return speakOutput;
    },
    giveCats2(element1, element2, element3, sessionAttributes){
        let speakOutput = 'No es el momento de dar nada.';
        let success = false;
        
        if(room === basement_es.getRoom()){
            if(inventory.indexOf(element1) !== -1 && inventory.indexOf(element2) !== -1 && inventory.indexOf(element3) !== -1){
                let value = basement_es.giveCats2(element1, element2, element3, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
                success = value.success;
            }else{
                speakOutput = 'Necesitas tener los objetos en el inventario para poder dárselos al gato.';
            }
        }
        
        if(success){
            let index = inventory.indexOf(element1);
            inventory.splice(index,1);
            index = inventory.indexOf(element2);
            inventory.splice(index,1);
            index = inventory.indexOf(element3);
            inventory.splice(index,1);
            sessionAttributes['inventoryEs'] = inventory;
        }
        sessionAttributes['pointsEs'] = points;

        return speakOutput;
    },
    giveCats3(element1, element2, sessionAttributes){
        let speakOutput = 'No es el momento de dar nada.';
        
        if(room === basement_es.getRoom()){
            if(inventory.indexOf(element1) !== -1 && inventory.indexOf(element2) !== -1){
                let value = basement_es.giveCats3(element1, element2, sessionAttributes);
                points += value.points;
                speakOutput = value.speakOutput;
            }else{
                speakOutput = 'Necesitas tener los objetos en el inventario para poder dárselos al gato.';
            }
        }
        sessionAttributes['pointsEs'] = points;
      
        return speakOutput;
    },
    giveCats4(element1, sessionAttributes){
        let speakOutput = 'No es el momento de dar nada.';
        let dead = false;
        
        if(room === basement_es.getRoom()){
            if(inventory.indexOf(element1) !== -1){
                let value = basement_es.giveCats4(element1);
                points += value.points;
                speakOutput = value.speakOutput;
                dead = value.dead;
            }else{
                speakOutput = 'Necesitas tener el objeto en el inventario para poder dárselo al gato.';
            }
        }
        
        if(dead){
            speakOutput = speakOutput + '¡Oh! ¡Estás muerto!'
            + ' Tu puntuación ha sido de ' 
            + points + ' puntos, ' + name;
            finished = true;
        }
        sessionAttributes['deadEs'] = dead;
        sessionAttributes['pointsEs'] = points;
        sessionAttributes['finishedEs'] = finished;
        
        return {
            speakOutput: speakOutput,
            dead: dead
        }
    },
    go(place, sessionAttributes){
        let speechText = 'No puedes ir ahí.';
        let url = '';
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
            speechText = 'Ya estás ahí';
            r = room;
        }
        
        sessionAttributes['roomEs'] = r;
        
        if(r === 'habitación'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/bedroom.jpg";
        }else if(r === 'pasillo'){
            if(room !== r){
                corridor_es.setLight(false, sessionAttributes);
            }
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/corridor.jpg";
        }else if(r === 'sala de lavadoras'){
            if(room === 'pasillo'){
                speechText += washing_room_es.getEnterSpeak(sessionAttributes);
            }
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/washing.png"
        }else if(r === 'cocina'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/kitchen.jpg";
        }else if(r === 'habitación secreta'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/secret.jpg";
        }else if(r === 'recibidor'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/hall.png";
        }else if(r === 'patio'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/courtyard.png";
        }else if(r === 'baño'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/bath.png";
        }else if(r === 'salón'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/living.jpg";
        }else if(r === 'sótano'){
            url = "https://soundgato.s3.eu-west-3.amazonaws.com/basement.jpg";
        }
        room = r;
        
        return {
            speechText: speechText,
            room: room,
            url: url
        }
    },
    where(){
        let speakOutput = 'Aún no has empezado el juego.';
        if (room !== ''){
            speakOutput = 'Estás en ' + room;
        }
        return speakOutput;
    },
    clue(sessionAttributes){
        let speakOutput = 'No puedo darte pistas porque aún no estás en ninguna habitación.';
        
        if(room === room_es.getRoom()){
            speakOutput = room_es.clue(sessionAttributes);
        }else if(room === corridor_es.getRoom()){
            speakOutput = corridor_es.clue(sessionAttributes);
        }else if(room === washing_room_es.getRoom()){
            speakOutput = washing_room_es.clue(sessionAttributes);
        }else if(room === bathroom_es.getRoom()){
            speakOutput = bathroom_es.clue(sessionAttributes);
        }else if(room === courtyard_es.getRoom()){
            speakOutput = courtyard_es.clue(sessionAttributes);
        }else if(room === living_room_es.getRoom()){
            speakOutput = living_room_es.clue(sessionAttributes);
        }else if(room === basement_es.getRoom()){
            speakOutput = basement_es.clue(sessionAttributes);
        }else if(room === kitchen_es.getRoom()){
            speakOutput = kitchen_es.clue();
        }else if(room === secret_room_es.getRoom()){
            speakOutput = secret_room_es.clue();
        }else if(room === hall_es.getRoom()){
            speakOutput = hall_es.clue(sessionAttributes);
        }
        points -= 10;
        sessionAttributes['pointsEs'] = points;
        return speakOutput;
    },
    choose(option, sessionAttributes){
        let speakOutput = 'No es el momento de hacer eso.';
        if(room === room_es.getRoom()){
            let value = room_es.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
           
        }else if(room === washing_room_es.getRoom()){
            let dryer = corridor_es.getSwitch();
            let value = washing_room_es.choose(option, dryer, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === courtyard_es.getRoom()){
            let value = courtyard_es.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === living_room_es.getRoom()){
            let value = living_room_es.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === hall_es.getRoom()){
            let value = hall_es.choose(option, sessionAttributes);
            speakOutput = value.speakOutput;
            points += value.points;
            finished = value.finished;
            if(finished){
                speakOutput = speakOutput + ' Tu puntuación ha sido de ' 
                + points + ' puntos, ' + name;
            }
        }
        sessionAttributes['pointsEs'] = points;
        sessionAttributes['finishedEs'] = finished;
        return {
            speakOutput: speakOutput,
            finished: finished
        }
    },
    chooseObject(option, object, sessionAttributes){
        let speakOutput = 'O no es el momento de hacer eso o no puedes.';
        if(room === room_es.getRoom() && object === 'comida de gato'){
            let value = room_es.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === washing_room_es.getRoom() && object === 'ovillo de lana'){
            let dryer = corridor_es.getSwitch();
            let value = washing_room_es.choose(option, dryer, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === courtyard_es.getRoom() && object === 'ratón de juguete'){
            let value = courtyard_es.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === living_room_es.getRoom() && object === 'cuenco'){
            let value = living_room_es.choose(option, sessionAttributes);
            speakOutput = value.speak;
            points += value.points;
        }else if(room === hall_es.getRoom() && object === 'veneno'){
            let value = hall_es.choose(option, sessionAttributes);
            speakOutput = value.speakOutput;
            points += value.points;
            finished = value.finished;
            if(finished){
                speakOutput = speakOutput + ' Tu puntuación ha sido de ' 
                + points + ' puntos, ' + name;
            }
        }
        sessionAttributes['pointsEs'] = points;
        sessionAttributes['finishedEs'] = finished;
        return {
            speakOutput: speakOutput,
            finished: finished
        }
    }
}