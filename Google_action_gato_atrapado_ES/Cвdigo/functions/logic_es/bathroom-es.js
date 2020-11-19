// Objects in the room
let objectsBathroom = [];
        
// Objects in the floor of the room
let floorObjectsBathroom = [];

// Array with accomplished interactions with the objects of the room
let bathroomElements = [];
        
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
        objectsBathroom = ['papel higiénico', 'destornillador', 'alcohol'];
        canTakeObjects = [];
        floorObjectsBathroom = [];
        bathroomElements = [];
        firstTime = true;
        firstUse = true;
        points = 0;
        n = 0;
        
        conv.objectsBathroom = objectsBathroom;
        conv.floorObjectsBathroom = floorObjectsBathroom;
        conv.canTakeObjectsBathroom = canTakeObjects;
        conv.bathroomElements = bathroomElements;
        conv.firstTimeBathroom = firstTime;
        conv.firstUseBathroom = firstUse;
        conv.bathroomClue = n;
    },
    continueGame(conv){
        objectsBathroom = conv.objectsBathroom;
        floorObjectsBathroom = conv.floorObjectsBathroom;
        canTakeObjects = conv.canTakeObjectsBathroom;
        bathroomElements = conv.bathroomElements;
        firstTime = conv.firstTimeBathroom;
        firstUse = conv.firstUseBathroom;
        points = 0; 
        n = conv.bathroomClue;
    },
    getRoom(){
        let room = 'baño';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'norte':
                speechText = 'Delante de ti hay un lavabo y un espejo.';
                break;
            case 'sur':
                speechText = 'Detrás puedes ver la sala de lavadoras.';
                break;
            case 'este':
                speechText = 'A la derecha hay un retrete. Probablemente sea la fuente del mal olor.';
                break;
            case 'oeste':
                speechText = 'A la izquierda está la ventana por la que entra la luz. Es de cristal. También hay un botiquín.';
                break;
            case 'arriba':
                speechText = 'Puedes ver el techo. Hay unas cuantas telarañas y una araña sobre ellas.'
                break;
            case 'abajo':
                if(floorObjectsBathroom.length === 0){
                    speechText = 'Abajo está el suelo. Está bastante sucio y puedes distinguir unas huellas.'
                }else{
                    speechText = 'Además de las huellas, en el suelo encuentras: ' + floorObjectsBathroom;
                }
                break;
        }
        return speechText;
    },
    interaction(object, conv){
        let speechText = 'No ves interés en hacer eso. Dime qué quieres hacer ahora.  ';
        points = 0;
        switch(object){
            case 'lavabo':
                speechText = 'Es un lavabo normal. Intentas lavarte un poco la cara, pero no sale agua. Dime qué quieres hacer ahora.  '
                break;
            case 'espejo':
                speechText = 'Te miras en el espejo y te asusta tu aspecto desaliñado. Dime qué quieres hacer ahora.  '
                break;
            case 'ventana':
                if(bathroomElements.indexOf('ventana') === -1){
                    speechText = 'La ventana es de cristal. Parece que hay algo detrás, pero no puedes abrirla.'
                }else{
                    speechText = 'La ventana está rota. ' 
                    if(floorObjectsBathroom.indexOf('papel higiénico') === -1 && objectsBathroom.indexOf('papel higiénico') !== -1){
                        speechText += ' Detrás ves un rollo de papel higiénico. Sí que estaba escondido. Menos mal que no has tenido una urgencia.'
                    }
                    speechText += '  Dime qué quieres hacer ahora.  ';
                }
                break;
            case 'botiquín':
                if(floorObjectsBathroom.indexOf('alcohol') === -1 && objectsBathroom.indexOf('alcohol') !== -1){
                    speechText = 'Abres el botiquín y ves un bote de alcohol. Dime qué quieres hacer ahora.  ';
                    canTakeObjects.push('alcohol');
                    conv.canTakeObjectsBathroom = canTakeObjects;
                }else{
                    speechText = 'Ya no hay nada dentro del botiquín. Dime qué quieres hacer ahora.  ';
                }
                break;
            case 'retrete':
                if(floorObjectsBathroom.indexOf('destornillador') === -1 && objectsBathroom.indexOf('destornillador') !== -1){
                    speechText = 'Muy a tu pesar te acercas al retrete y ves que dentro hay un destornillador. Dime qué quieres hacer ahora.  ';
                    canTakeObjects.push('destornillador');
                    conv.canTakeObjectsBathroom = canTakeObjects;
                    if(firstUse){
                        points += 10;
                        firstUse = false;
                        conv.firstUseBathroom = firstUse;
                    }
                }else{
                    speechText = 'Por suerte ya no hay nada dentro del retrete. Dime qué quieres hacer ahora.  ';
                }
                break;
            case 'araña':
                speechText = 'Miras a la araña del techo. Sientes como si te devolviera la mirada y te da un escalofrío. Dime qué quieres hacer ahora.  '
                break; 
            case 'huellas':
                speechText = 'Parecen las huellas de un animal doméstico. Dime qué quieres hacer ahora.  ';    
                break;
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsBathroom.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsBathroom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsBathroom = canTakeObjects;
            // Esto hace que solo la lea al cogerla en el baño
            if(item === 'papel higiénico'){
                speechText += ' Lees las inscripciones que hay en el papel higiénico. '
                    + "Son cuatro símbolos: un árbol, una nube, una hoguera y un río.";
                if(firstTime){
                    points += 10;
                    firstTime = false;
                    conv.firstTimeBathroom = firstTime;
                }
            }
            let index = objectsBathroom.indexOf(item)
            objectsBathroom.splice(index,1)
            conv.objectsBathroom = objectsBathroom;
            if(floorObjectsBathroom.indexOf(item) !== -1){
                let index2 = floorObjectsBathroom.indexOf(item)
                floorObjectsBathroom.splice(index2,1)
                conv.floorObjectsBathroom = floorObjectsBathroom;
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
        objectsBathroom.push(item);
        floorObjectsBathroom.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsBathroom = canTakeObjects;
        conv.floorObjectsBathroom = floorObjectsBathroom;
        conv.objectsBathroom = objectsBathroom;
        return speechText;
    },
    use(object, element, conv){
        points = 0;
        let speakOutput = 'No puedes hacer eso. Dime qué quieres hacer ahora.  ';
        if(object === 'martillo' && element === 'ventana'){
            if(bathroomElements.indexOf('ventana') === -1){
                speakOutput = 
                    '<speak> Rompes la ventana de cristal con el martillo.' 
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/small_glass_pane_shatter.ogg'/>"
                    + 'Puedes ver un rollo de papel higiénico que parece tener unas inscripciones. Dime qué quieres hacer ahora. </speak>'; 
                bathroomElements.push('ventana');
                conv.bathroomElements = bathroomElements;
                canTakeObjects.push('papel higiénico');
                conv.canTakeObjectsBathroom = canTakeObjects;
                points += 10;
            }else{
                speakOutput = 'La ventana está rota. '
                if(floorObjectsBathroom.indexOf('papel higiénico') === -1 && objectsBathroom.indexOf('papel higiénico') !== -1){
                    speakOutput += 'Aún está el papel higiénico al fondo.';
                }
                speakOutput += ' Dime qué quieres hacer ahora.  ';
            }
        } 
        return{
            speakOutput: speakOutput,
            points: points
        }        
    },
    go(place){
        let speakOutput = 'No puedes ir ahí.';
        let r = 'baño';
        if(place === 'sala de lavadoras'){
            speakOutput = 'Ahora estás en la sala de lavadoras.'
            r = 'sala de lavadoras';
        } 
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(conv){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'Sé que no es una idea muy agradable, pero puedes encontrar alguna respuesta en el retrete.';
            n = 1;
        }else if(n === 1){
            speakOutput = 'En este caso sí puede ser bueno romper la ventana. ';
            n = 2;
        }else if(n === 2){
            speakOutput = 'Hay algo esencial en el botiquín. ';
            n = 0;
        }
        conv.bathroomClue = n;
        return speakOutput;
    }
}