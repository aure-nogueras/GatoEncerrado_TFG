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
    initialize(sessionAttributes){
        objectsSecretRoom = ['tarjeta'];
        floorObjectsSecretRoom = [];
        secretRoomElements = [];
        canTakeObjects = [];
        points = 0;
        
        sessionAttributes['objectsSecretRoomEs'] = objectsSecretRoom;
        sessionAttributes['floorObjectsSecretRoomEs'] = floorObjectsSecretRoom;
        sessionAttributes['secretRoomElementsEs'] = secretRoomElements;
        sessionAttributes['canTakeObjectsSecretRoomEs'] = canTakeObjects;
    },
    continueGame(sessionAttributes){
        objectsSecretRoom = sessionAttributes['objectsSecretRoomEs'];
        floorObjectsSecretRoom = sessionAttributes['floorObjectsSecretRoomEs'];
        secretRoomElements = sessionAttributes['secretRoomElementsEs'];
        canTakeObjects = sessionAttributes['canTakeObjectsSecretRoomEs'];
        points = 0;
    },
    getRoom(){
        let room = 'habitación secreta';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'norte':
                speechText = 'Al fondo ves una puerta.';
                break;
            case 'sur':
                speechText = 'Detrás de ti está el túnel por el que has llegado.'
                break;
            case 'este':
                speechText = 'A la derecha hay una pecera y un arenero.'
                break;
            case 'oeste':
                speechText = 'A la izquierda ves un rascador.'
                break;
            case 'arriba':
                speechText = 'Arriba hay una lámpara que ilumina la habitación.' 
                break;
            case 'abajo':
                if(floorObjectsSecretRoom.length === 0){
                    speechText = 'Abajo hay una alfombra. No hay nada más interesante.'
                }else{
                    speechText = 'Abajo hay una alfombra. Además, en el suelo encuentras: ' + floorObjectsSecretRoom;
                }
                break;
        }
        return speechText;
    },
    interaction(object, sessionAttributes){
        let speechText = 'No ves interés en hacer eso. ';
        points = 0;
        switch(object){
            case 'puerta':
                if(secretRoomElements.indexOf('puerta') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                    + 'La puerta está cerrada. Esta vez no puedes atravesarla, así que necesitas encontrar un modo de abrirla. Parece que se abre con una tarjeta... '
                    + "</speak>";
                }else{
                    speechText = 'La puerta está abierta.';    
                }
                break;
            case 'pecera':
                speechText = 
                    "<speak>"
                    + "Miras la pecera con detenimiento. Dentro hay un pez nadando alegremente. "
                    + '<audio src="soundbank://soundlibrary/water/underwater/underwater_01"/>'
                    + "</speak>";
                break;
            case 'arenero':
                speechText = 'El arenero huele bastante mal. No piensas meter la mano ahí.' 
                break;
            case 'rascador':
                speechText = 'Es un rascador bastante usado, pero parece llevar mucho tiempo abandonado. Está desgastado por los arañazos. Sin duda, esta habitación perteneció a un gato. '
                break;
            case 'lámpara':
                speechText = 'La lámpara está encendida, pero no has visto ningún interruptor.'
                break;
            case 'alfombra':
                if(secretRoomElements.indexOf('alfombra') === -1){
                    speechText = 'Es una alfombra chillón llena de pelo de gato. Parece estar algo abultada. La levantas y ves una tarjeta. '
                    canTakeObjects.push('tarjeta');
                    floorObjectsSecretRoom.push('tarjeta');
                    sessionAttributes['canTakeObjectsSecretRoomEs'] = canTakeObjects;
                    sessionAttributes['floorObjectsSecretRoomEs'] = floorObjectsSecretRoom;
                    points += 10;
                }else{
                    speechText = 'Ya has mirado debajo de la alfombra. Ahora no hay nada de interés en ella. Además, es bastante fea y está llena de pelo de gato.';    
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
        if(objectsSecretRoom.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        let success = false;
        if(objectsSecretRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsSecretRoomEs'] = canTakeObjects;
            let index = objectsSecretRoom.indexOf(item)
            objectsSecretRoom.splice(index,1)
            sessionAttributes['objectsSecretRoomEs'] = objectsSecretRoom;
            if(floorObjectsSecretRoom.indexOf(item) !== -1){
                let index2 = floorObjectsSecretRoom.indexOf(item)
                floorObjectsSecretRoom.splice(index2,1)
                sessionAttributes['floorObjectsSecretRoomEs'] = floorObjectsSecretRoom;
            }
            success = true;
        }
        return {
            speechText: speechText,
            success: success
        }
    },
    release(item, sessionAttributes){
        let speechText = 'Has puesto ' + item + ' en la habitación secreta.'; 
        objectsSecretRoom.push(item);
        floorObjectsSecretRoom.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsSecretRoomEs'] = canTakeObjects;
        sessionAttributes['floorObjectsSecretRoomEs'] = floorObjectsSecretRoom;
        sessionAttributes['objectsSecretRoomEs'] = objectsSecretRoom;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = 'No puedes hacer eso.';
        if(object === 'tarjeta' && element === 'puerta'){
            if(secretRoomElements.indexOf('puerta') === -1){
                points+=10;
                speakOutput = "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                + '<say-as interpret-as="interjection">genial</say-as>'
                + '<break time = "0.5s" />'
                + ' ¡Has conseguido abrir la puerta! Delante ves el recibidor de la casa.';
                secretRoomElements.push('puerta');
                sessionAttributes['secretRoomElementsEs'] = secretRoomElements;
            }else{
                speakOutput = 'La puerta está ya abierta.';
            }
        }
        return{
            speakOutput: speakOutput,
            points: points
        }        
    },
    go(place){
        let speakOutput = 'No puedes ir ahí.';
        let r = 'habitación secreta';
        
        if(place === 'recibidor' && secretRoomElements.indexOf('puerta') !== -1){
            speakOutput = 'Ahora estás en el recibidor.';
            r = 'recibidor';
        }
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(){
        let speakOutput = 'Puede que la alfombra oculte algo. Además de pelo de minino. ';
        return speakOutput;
    }
}