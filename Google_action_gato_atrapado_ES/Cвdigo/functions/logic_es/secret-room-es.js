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
        objectsSecretRoom = ['tarjeta'];
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
    interaction(object, conv){
        let speechText = 'No ves interés en hacer eso. Dime qué quieres hacer ahora.  ';
        points = 0;
        switch(object){
            case 'puerta':
                if(secretRoomElements.indexOf('puerta') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                    + 'La puerta está cerrada. Esta vez no puedes atravesarla, así que necesitas encontrar un modo de abrirla. Parece que se abre con una tarjeta... Dime qué quieres hacer ahora.  '
                    + "</speak>";
                }else{
                    speechText = 'La puerta está abierta. Dime qué quieres hacer ahora.  ';    
                }
                break;
            case 'pecera':
                speechText = "Miras la pecera con detenimiento. Dentro hay un pez nadando alegremente. Dime qué quieres hacer ahora.  ";
                break;
            case 'arenero':
                speechText = 'El arenero huele bastante mal. No piensas meter la mano ahí. Dime qué quieres hacer ahora.  ' 
                break;
            case 'rascador':
                speechText = 'Es un rascador bastante usado, pero parece llevar mucho tiempo abandonado. Está desgastado por los arañazos. Sin duda, esta habitación perteneció a un gato. Dime qué quieres hacer ahora.  '
                break;
            case 'lámpara':
                speechText = 'La lámpara está encendida, pero no has visto ningún interruptor. Dime qué quieres hacer ahora. '
                break;
            case 'alfombra':
                if(secretRoomElements.indexOf('alfombra') === -1){
                    speechText = 'Es una alfombra chillón llena de pelo de gato. Parece estar algo abultada. La levantas y ves una tarjeta. Dime qué quieres hacer ahora.  '
                    canTakeObjects.push('tarjeta');
                    floorObjectsSecretRoom.push('tarjeta');
                    conv.canTakeObjectsSecretRoom = canTakeObjects;
                    conv.floorObjectsSecretRoom = floorObjectsSecretRoom;
                    points += 10;
                }else{
                    speechText = 'Ya has mirado debajo de la alfombra. Ahora no hay nada de interés en ella. Además, es bastante fea y está llena de pelo de gato. Dime qué quieres hacer ahora.  ';    
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
    take(item, conv){
        let speechText = 'No puedes coger ' + item;
        let success = false;
        if(objectsSecretRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
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
        let speechText = 'Has puesto ' + item + ' en la habitación secreta.'; 
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
        let speakOutput = 'No puedes hacer eso. Dime qué quieres hacer ahora.  ';
        if(object === 'tarjeta' && element === 'puerta'){
            if(secretRoomElements.indexOf('puerta') === -1){
                points+=10;
                speakOutput = "<speak> <audio src='https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'/>"
                + '<say-as interpret-as="interjection">genial</say-as>'
                + '<break time = "0.5s" />'
                + ' ¡Has conseguido abrir la puerta! Delante ves el recibidor de la casa. Dime qué quieres hacer ahora.</speak>';
                secretRoomElements.push('puerta');
                conv.secretRoomElements = secretRoomElements;
            }else{
                speakOutput = 'La puerta está ya abierta. Dime qué quieres hacer ahora.  ';
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