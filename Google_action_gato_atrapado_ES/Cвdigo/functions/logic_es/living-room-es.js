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
        objectsLivingRoom = ['foto', 'cuenco', 'radiografía'];
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
    interaction(object, conv){
        let speechText = 'No ves interés en hacer eso. Dime qué quieres hacer ahora.  ';
        points = 0;
        switch(object){
            case 'televisión':
                if(livingRoomElements.indexOf('televisión') === -1){
                    speechText = 'Es una televisión antigua. No tienes mucha fe en que vaya a funcionar, pero pulsas el botón. '
                        + 'Para tu sorpresa, la pantalla se enciende. Están poniendo un programa sobre poesía. Escuchas el poema del que hablan: '
                        + 'Y cuando llegue el día del último viaje, '
                        + 'y esté al partir la nave que nunca ha de tornar, '
                        + 'me encontraréis a bordo ligero de equipaje, '
                        + 'casi desnudo, como los hijos de la mar. Dime qué quieres hacer ahora.  '
                    livingRoomElements.push('televisión');
                    conv.livingRoomElements = livingRoomElements;
                }else{
                    speechText = 'Escuchas el poema de nuevo, es como si la televisión estuviera en bucle. A lo mejor es una grabación: '
                        + 'Y cuando llegue el día del último viaje, '
                        + 'y esté al partir la nave que nunca ha de tornar, '
                        + 'me encontraréis a bordo ligero de equipaje, '
                        + 'casi desnudo, como los hijos de la mar. Dime qué quieres hacer ahora.  '
                }
                break;
            case 'caja fuerte':
                if(livingRoomElements.indexOf('caja fuerte') === -1){
                    speechText = 'Es una caja fuerte con un teclado numérico. Necesitas una combinación de cuatro números para abrirla. Para probar un código, di introducir y los 4 números. Dime qué quieres hacer ahora.  '
                }else{
                    speechText = 'La caja fuerte está abierta. '
                    if(floorObjectsLivingRoom.indexOf('cuenco') === -1 && objectsLivingRoom.indexOf('cuenco') !== -1){
                        speechText += 'Puedes ver un cuenco. Puedes lanzarlo o guardarlo. '
                    }
                    if(floorObjectsLivingRoom.indexOf('foto') === -1 && objectsLivingRoom.indexOf('foto') !== -1){
                        speechText += 'Hay una foto al fondo.'
                    }
                    speechText += ' Dime qué quieres hacer ahora.  ';
                }
                break;
            case 'estantería':
                speechText = 'Se trata de una estantería llena de libros. Hay muchos autores, sobre todo poetas. Si quieres mirar algún libro de un autor concreto, di leer y el nombre del escritor. Dime qué quieres hacer ahora.  '
                break;
            case 'conducto':
                speechText = 'El conducto está abierto. Quizás podrías ver lo que hay, pero está muy alto. Dime qué quieres hacer ahora.  '
                break;
            case 'escaleras':
                speechText = 'Las escaleras bajan hasta una puerta. Puedes ver más migas de galleta por el suelo. Dime qué quieres hacer ahora.  ';    
                break;
            case 'puerta':
                if(livingRoomElements.indexOf('puerta') === -1){
                    speechText = "<speak>"
                        + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                        + 'La puerta está cerrada. La llave está echada. Necesitas algo para abrir la puerta. '
                        + " Dime qué quieres hacer ahora. </speak>";
                }else{
                    speechText = 'La puerta está abierta y delante ves un sótano. Dime qué quieres hacer ahora.  ';    
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
    take(item, conv){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsLivingRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'cuenco' && firstTime === true){
                points += 20;
                firstTime = false;
                conv.firstTimeLivingRoom = firstTime;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsLivingRoom = canTakeObjects;
            if(item === 'foto'){
                speechText += ' Es una foto de un gato blanco muy bonito. Por detrás hay un texto: '
                    + "Me gusta perseguir y atrapar aquello que se mueve. "
                    + '¿Me darás esa oportunidad?'
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
        let speechText = 'Has puesto ' + item + ' en ' + this.getRoom(); 
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
        let speakOutput = 'No puedes hacer eso. Dime qué quieres hacer ahora.  ';
        if(object === 'silla' && element === 'conducto'){
            if(floorObjectsLivingRoom.indexOf('radiografía') === -1 && objectsLivingRoom.indexOf('radiografía') !== -1){
                speakOutput = ' Te subes a la silla y te asomas para ver lo que hay dentro del conducto.'
                    + ' Palpas alrededor y encuentras una radiografía. Dime qué quieres hacer ahora. ';
                canTakeObjects.push('radiografía');
                conv.canTakeObjectsLivingRoom = canTakeObjects;
                if(firstUse){
                    points += 10;
                    firstUse = false;
                    conv.firstUseLivingRoom = firstUse;
                }
            }else{
                speakOutput = 'Te subes a la silla y te asomas al conducto. Ya no hay nada. Dime qué quieres hacer ahora.  ';
            }
        }
        if(object === 'radiografía' && element === 'puerta'){
            if(livingRoomElements.indexOf('puerta') === -1){
                speakOutput = 
                    '<speak> Usas la radiografía y abres la puerta.' 
                    + "<audio src='https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'/>"
                    + 'Al fondo ves un sótano. Dime qué quieres hacer ahora. </speak>'; 
                livingRoomElements.push('puerta');
                conv.livingRoomElements =  livingRoomElements;
                points += 10;
            }else{
                speakOutput = 'La puerta está abierta. Ves un sótano al fondo. Dime qué quieres hacer ahora. '
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
                        + 'Esa no es la clave. Sigue intentándolo. Dime qué quieres hacer ahora. </speak>';
        if(livingRoomElements.indexOf('caja fuerte') !== -1){
            speakOutput = 'Ya has abierto la caja fuerte. ';
            if(floorObjectsLivingRoom.indexOf('cuenco') === -1 && objectsLivingRoom.indexOf('cuenco') !== -1){
                speakOutput += 'Puedes ver un cuenco. Puedes lanzarlo o guardarlo. ';
            }
            if(floorObjectsLivingRoom.indexOf('foto') === -1 && objectsLivingRoom.indexOf('foto') !== -1){
                speakOutput += 'Hay una foto al fondo.';
            }
            speakOutput += ' Dime qué quieres hacer ahora.  ';
        }
            
        if(number === '1875' && livingRoomElements.indexOf('caja fuerte') === -1){
            speakOutput = "<speak>" 
                + '<say-as interpret-as="digits">'+number+'</say-as>. '
                + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                + "<say-as interpret-as='interjection'>Enhorabuena</say-as>."
                + '<break time = "0.5s" />'
                + " Esa era la combinación correcta. La caja fuerte se ha abierto. "
                + "Dentro hay un cuenco y una foto. Puedes guardar o lanzar el cuenco."
                + " Dime qué quieres hacer ahora. "
                + "</speak>"
            livingRoomElements.push('caja fuerte');
            canTakeObjects.push('cuenco');
            canTakeObjects.push('foto');
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
        let speakOutput = 'Abres el libro de ' + author + '. '
        
        switch(author){
            case 'antonio machado':
                speakOutput += 'Antonio Machado nació en 1875...'
                break;
            case 'lorca':
                speakOutput += 'Lorca nació en 1898...'
                break;
            case 'calderón de la barca':
                speakOutput += 'Calderón de la Barca nació en 1600...'
                break;
            case 'jorge manrique':
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
            speakOutput = 'Estás en el sótano. Las luces se encienden solas en cuanto entras';
            r = 'sótano';
        }  
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    choose(option, conv){
        points = 0;
        let speakOutput = 'Esa acción ya no es posible. Dime qué quieres hacer ahora.  ';
        if(canTakeObjects.indexOf('cuenco') !== -1 && livingRoomElements.indexOf('caja fuerte') !== -1 && objectsLivingRoom.indexOf('cuenco') !== -1 && floorObjectsLivingRoom.indexOf('cuenco') === -1){
            if(option === 'lanzar'){
                speakOutput = 'Lanzas el cuenco y lo pierdes de vista. Tienes 20 puntos menos. Dime qué quieres hacer ahora.  ';
                points -= 20;
                let i = canTakeObjects.indexOf('cuenco')
                canTakeObjects.splice(i,1)
                conv.canTakeObjectsLivingRoom = canTakeObjects;
                let index = objectsLivingRoom.indexOf('cuenco');
                objectsLivingRoom.splice(index,1);
                conv.objectsLivingRoom = objectsLivingRoom;
            }
        }
        return{
            speak: speakOutput,
            points: points
        }
    },
    clue(conv){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'El conducto de ventilación guarda algo importante para seguir avanzando hacia otra habitación. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'La lectura es una buena aliada. Busca al autor del poema. ';
            n = 2;
        }else if(n === 2){
            speakOutput = 'Es mejor no perder de vista las cosas que se tienen a mano. ';
            n = 0;
        }
        conv.livingRoomClue = n;
        return speakOutput;
    }
}