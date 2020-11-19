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
        objectsLivingRoom = ['foto', 'cuenco', 'radiografía'];
        canTakeObjects = [];
        livingRoomElements = [];
        firstTime = true;
        firstUse = true;
        points = 0;
        n = 0;
        
        sessionAttributes['objectsLivingRoomEs'] = objectsLivingRoom;
        sessionAttributes['floorObjectsLivingRoomEs'] = floorObjectsLivingRoom;
        sessionAttributes['canTakeObjectsLivingRoomEs'] = canTakeObjects;
        sessionAttributes['livingRoomElementsEs'] = livingRoomElements;
        sessionAttributes['firstTimeLivingRoomEs'] = firstTime;
        sessionAttributes['firstUseLivingRoomEs'] = firstUse;
        sessionAttributes['livingRoomClueEs'] = n;
    },
    continueGame(sessionAttributes){
        objectsLivingRoom = sessionAttributes['objectsLivingRoomEs'];
        floorObjectsLivingRoom = sessionAttributes['floorObjectsLivingRoomEs'];
        canTakeObjects = sessionAttributes['canTakeObjectsLivingRoomEs'];
        livingRoomElements = sessionAttributes['livingRoomElementsEs'];
        firstTime = sessionAttributes['firstTimeLivingRoomEs'];
        firstUse = sessionAttributes['firstUseLivingRoomEs'];
        points = 0;
        n = sessionAttributes['livingRoomClueEs'];
    },
    getRoom(){
        let room = 'salón';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'norte':
                speechText = 'Al final de la habitación ves unas escaleras que bajan y terminan en una puerta.';
                break;
            case 'sur':
                speechText = 'Ves el patio. La luz que entra hace que puedas ver bien el salón.';
                break;
            case 'este':
                speechText = 'A la derecha ves una televisión y una caja fuerte.';
                break;
            case 'oeste':
                speechText = 'A la izquierda hay una estantería llena de libros.';
                break;
            case 'arriba':
                speechText = 'Arriba hay un conducto de ventilación.';
                break;
            case 'abajo':
                if(floorObjectsLivingRoom.length === 0){
                    speechText = 'Abajo puedes ver el suelo. No hay nada interesante.';
                }else{
                    speechText = 'En el suelo encuentras: ' + floorObjectsLivingRoom;
                }
                break;
        }
        return speechText;
    },
    interaction(object, sessionAttributes){
        let speechText = 'No ves interés en hacer eso. ';
        points = 0;
        switch(object){
            case 'televisión':
                if(livingRoomElements.indexOf('televisión') === -1){
                    speechText = 'Es una televisión antigua. No tienes mucha fe en que vaya a funcionar, pero pulsas el botón. '
                        + 'Para tu sorpresa, la pantalla se enciende. Están poniendo un programa sobre poesía. Escuchas el poema del que hablan: '
                        + "<voice name='Conchita'>" 
                        + 'Y cuando llegue el día del último viaje, '
                        + 'y esté al partir la nave que nunca ha de tornar, '
                        + 'me encontraréis a bordo ligero de equipaje, '
                        + 'casi desnudo, como los hijos de la mar.'
                        + '</voice>'
                    livingRoomElements.push('televisión');
                    sessionAttributes['livingRoomElementsEs'] = livingRoomElements;
                }else{
                    speechText = 'Escuchas el poema de nuevo, es como si la televisión estuviera en bucle. A lo mejor es una grabación: '
                        + "<voice name='Conchita'>" 
                        + 'Y cuando llegue el día del último viaje, '
                        + 'y esté al partir la nave que nunca ha de tornar, '
                        + 'me encontraréis a bordo ligero de equipaje, '
                        + 'casi desnudo, como los hijos de la mar.'
                        + '</voice>'
                }
                break;
            case 'caja fuerte':
                if(livingRoomElements.indexOf('caja fuerte') === -1){
                    speechText = 'Es una caja fuerte con un teclado numérico. Necesitas una combinación de cuatro números para abrirla. Para probar un código, di introducir y los 4 números.'
                }else{
                    speechText = 'La caja fuerte está abierta. '
                    if(floorObjectsLivingRoom.indexOf('cuenco') === -1 && objectsLivingRoom.indexOf('cuenco') !== -1){
                        speechText += 'Puedes ver un cuenco. Puedes lanzarlo o guardarlo. '
                    }
                    if(floorObjectsLivingRoom.indexOf('foto') === -1 && objectsLivingRoom.indexOf('foto') !== -1){
                        speechText += 'Hay una foto al fondo.'
                    }
                }
                break;
            case 'estantería':
                speechText = 'Se trata de una estantería llena de libros. Hay muchos autores, sobre todo poetas. Si quieres mirar algún libro de un autor concreto, di leer y el nombre del escritor.'
                break;
            case 'conducto':
                speechText = 'El conducto está abierto. Quizás podrías ver lo que hay, pero está muy alto. '
                break;
            case 'escaleras':
                speechText = 'Las escaleras bajan hasta una puerta. Puedes ver más migas de galleta por el suelo.';    
                break;
            case 'puerta':
                if(livingRoomElements.indexOf('puerta') === -1){
                    speechText = "<speak>"
                        + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                        + 'La puerta está cerrada. La llave está echada. Necesitas algo para abrir la puerta. '
                        + "</speak>";
                }else{
                    speechText = 'La puerta está abierta y delante ves un sótano.';    
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
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsLivingRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'cuenco' && firstTime === true){
                points += 20;
                firstTime = false;
                sessionAttributes['firstTimeLivingRoomEs'] = firstTime;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsLivingRoomEs'] = canTakeObjects;
            if(item === 'foto'){
                speechText += ' Es una foto de un gato blanco muy bonito. Por detrás hay un texto: '
                    + "<voice name='Enrique'> Me gusta perseguir y atrapar aquello que se mueve. "
                    + '¿Me darás esa oportunidad?'
                    + '</voice>'
            }
            let index = objectsLivingRoom.indexOf(item)
            objectsLivingRoom.splice(index,1)
            sessionAttributes['objectsLivingRoomEs'] = objectsLivingRoom;
            if(floorObjectsLivingRoom.indexOf(item) !== -1){
                let index2 = floorObjectsLivingRoom.indexOf(item)
                floorObjectsLivingRoom.splice(index2,1)
                sessionAttributes['floorObjectsLivingRoomEs'] = floorObjectsLivingRoom;
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
        let speechText = 'Has puesto ' + item + ' en ' + this.getRoom(); 
        objectsLivingRoom.push(item);
        floorObjectsLivingRoom.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsLivingRoomEs'] = canTakeObjects;
        sessionAttributes['floorObjectsLivingRoomEs'] = floorObjectsLivingRoom;
        sessionAttributes['objectsLivingRoomEs'] = objectsLivingRoom;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = 'No puedes hacer eso.';
        if(object === 'silla' && element === 'conducto'){
            if(/*inventory.indexOf('radiografía') === -1 &&*/ floorObjectsLivingRoom.indexOf('radiografía') === -1 && objectsLivingRoom.indexOf('radiografía') !== -1){
                speakOutput = 'Te subes a la silla y te asomas para ver lo que hay dentro del conducto.'
                    + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_meow_1x_01"/>'
                    + ' Vaya, ¿de dónde ha venido eso? Palpas alrededor y encuentras una radiografía.';
                canTakeObjects.push('radiografía');
                sessionAttributes['canTakeObjectsLivingRoomEs'] = canTakeObjects;
                if(firstUse){
                    points += 10;
                    firstUse = false;
                    sessionAttributes['firstUseLivingRoomEs'] = firstUse;
                }
            }else{
                speakOutput = 'Te subes a la silla y te asomas al conducto. Ya no hay nada.';
            }
        }
        if(object === 'radiografía' && element === 'puerta'){
            if(livingRoomElements.indexOf('puerta') === -1){
                speakOutput = 
                    'Usas la radiografía y abres la puerta.' 
                    + "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                    + 'Al fondo ves un sótano.'; 
                livingRoomElements.push('puerta');
                sessionAttributes['livingRoomElementsEs'] =  livingRoomElements;
                points += 10;
            }else{
                speakOutput = 'La puerta está abierta. Ves un sótano al fondo. '
            }
        }
        return{
            speakOutput: speakOutput,
            points: points
        }        
    },
    numberCode(number, sessionAttributes){
        let speakOutput = '<say-as interpret-as="digits">'+ number +'</say-as>. '
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + 'Esa no es la clave. Sigue intentándolo.';
        if(livingRoomElements.indexOf('caja fuerte') !== -1){
            speakOutput = 'Ya has abierto la caja fuerte. ';
            if(floorObjectsLivingRoom.indexOf('cuenco') === -1 && objectsLivingRoom.indexOf('cuenco') !== -1){
                speakOutput += 'Puedes ver un cuenco. Puedes lanzarlo o guardarlo. ';
            }
            if(floorObjectsLivingRoom.indexOf('foto') === -1 && objectsLivingRoom.indexOf('foto') !== -1){
                speakOutput += 'Hay una foto al fondo.';
            }
        }
            
        if(number === '1875' && livingRoomElements.indexOf('caja fuerte') === -1){
            speakOutput = "<speak>" 
                + '<say-as interpret-as="digits">'+number+'</say-as>. '
                + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                + "<say-as interpret-as='interjection'>Enhorabuena</say-as>."
                + '<break time = "0.5s" />'
                + " Esa era la combinación correcta. La caja fuerte se ha abierto. "
                + "Dentro hay un cuenco y una foto. Puedes guardar o lanzar el cuenco."
                + "</speak>"
            livingRoomElements.push('caja fuerte');
            canTakeObjects.push('cuenco');
            canTakeObjects.push('foto');
            sessionAttributes['livingRoomElementsEs'] = livingRoomElements;
            sessionAttributes['canTakeObjectsLivingRoomEs'] = canTakeObjects;
            points += 10;
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    read(author){
        let speakOutput = 'Abres el libro de ' + author + '. '
        
        switch(author){
            case 'Antonio Machado':
                speakOutput += 'Antonio Machado nació en 1875...'
                break;
            case 'Lorca':
                speakOutput += 'Lorca nació en 1898...'
                break;
            case 'Calderón de la Barca':
                speakOutput += 'Calderón de la Barca nació en 1600...'
                break;
            case 'Jorge Manrique':
                speakOutput += 'Jorge Manrique nació en 1440...'
                break;
        }
        return speakOutput;
    },
    go(place){
        let speakOutput = 'No puedes ir ahí.';
        let r = 'salón';
        if(place === 'patio'){
            speakOutput = 'Ahora estás en el patio.';
            r = 'patio';
        }else if(place === 'sótano' && livingRoomElements.indexOf('puerta') !== -1){
            speakOutput = 'Estás en el sótano. Las luces se encienden solas en cuanto entras'
            + '<audio src="soundbank://soundlibrary/household/lamps_lanterns/lamps_lanterns_02"/>';
            r = 'sótano';
        }  
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    choose(option, sessionAttributes){
        points = 0;
        let speakOutput = 'Esa acción ya no es posible.';
        if(canTakeObjects.indexOf('cuenco') !== -1 && livingRoomElements.indexOf('caja fuerte') !== -1 && objectsLivingRoom.indexOf('cuenco') !== -1 && floorObjectsLivingRoom.indexOf('cuenco') === -1){
            if(option === 'lanzar'){
                speakOutput = 'Lanzas el cuenco y lo pierdes de vista. Tienes 20 puntos menos';
                points -= 20;
                let i = canTakeObjects.indexOf('cuenco')
                canTakeObjects.splice(i,1)
                sessionAttributes['canTakeObjectsLivingRoomEs'] = canTakeObjects;
                let index = objectsLivingRoom.indexOf('cuenco');
                objectsLivingRoom.splice(index,1);
                sessionAttributes['objectsLivingRoomEs'] = objectsLivingRoom;
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
            speakOutput = 'El conducto de ventilación guarda algo importante para seguir avanzando a otra habitación. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'La lectura es una buena aliada. Busca al autor del poema. ';
            n = 2;
        }else if(n === 2){
            speakOutput = 'Es mejor no lanzar las cosas que se tienen a mano. ';
            n = 0;
        }
        sessionAttributes['livingRoomClueEs'] = n;
        return speakOutput;
    }
}