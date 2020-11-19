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
    initialize(sessionAttributes){
        objectsBathroom = ['papel higiénico', 'destornillador', 'alcohol'];
        canTakeObjects = [];
        floorObjectsBathroom = [];
        bathroomElements = [];
        firstTime = true;
        firstUse = true;
        points = 0;
        n = 0;
        
        sessionAttributes['objectsBathroomEs'] = objectsBathroom;
        sessionAttributes['floorObjectsBathroomEs'] = floorObjectsBathroom;
        sessionAttributes['canTakeObjectsBathroomEs'] = canTakeObjects;
        sessionAttributes['bathroomElementsEs'] = bathroomElements;
        sessionAttributes['firstTimeBathroomEs'] = firstTime;
        sessionAttributes['firstUseBathroomEs'] = firstUse;
        sessionAttributes['bathroomClueEs'] = n;
    },
    continueGame(sessionAttributes){
        objectsBathroom = sessionAttributes['objectsBathroomEs'];
        floorObjectsBathroom = sessionAttributes['floorObjectsBathroomEs'];
        canTakeObjects = sessionAttributes['canTakeObjectsBathroomEs'];
        bathroomElements = sessionAttributes['bathroomElementsEs'];
        firstTime = sessionAttributes['firstTimeBathroomEs'];
        firstUse = sessionAttributes['firstUseBathroomEs'];
        points = 0; 
        n = sessionAttributes['bathroomClueEs'];
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
    interaction(object, sessionAttributes){
        let speechText = 'No ves interés en hacer eso. ';
        points = 0;
        switch(object){
            case 'lavabo':
                speechText = 'Es un lavabo normal. Intentas lavarte un poco la cara, pero no sale agua.'
                break;
            case 'espejo':
                speechText = 'Te miras en el espejo y te asusta tu aspecto desaliñado.'
                break;
            case 'ventana':
                if(bathroomElements.indexOf('ventana') === -1){
                    speechText = 'La ventana es de cristal. Parece que hay algo detrás, pero no puedes abrirla.'
                }else{
                    speechText = 'La ventana está rota.' 
                    if(floorObjectsBathroom.indexOf('papel higiénico') === -1 && objectsBathroom.indexOf('papel higiénico') !== -1){
                        speechText += ' Detrás ves un rollo de papel higiénico. Sí que estaba escondido. Menos mal que no has tenido una urgencia.'
                    }
                }
                break;
            case 'botiquín':
                if(floorObjectsBathroom.indexOf('alcohol') === -1 && objectsBathroom.indexOf('alcohol') !== -1){
                    speechText = 'Abres el botiquín y ves un bote de alcohol.';
                    canTakeObjects.push('alcohol');
                    sessionAttributes['canTakeObjectsBathroomEs'] = canTakeObjects;
                }else{
                    speechText = 'Ya no hay nada dentro del botiquín.';
                }
                break;
            case 'retrete':
                if(floorObjectsBathroom.indexOf('destornillador') === -1 && objectsBathroom.indexOf('destornillador') !== -1){
                    speechText = 'Muy a tu pesar te acercas al retrete y ves que dentro hay un destornillador.';
                    canTakeObjects.push('destornillador');
                    sessionAttributes['canTakeObjectsBathroomEs'] = canTakeObjects;
                    if(firstUse){
                        points += 10;
                        firstUse = false;
                        sessionAttributes['firstUseBathroomEs'] = firstUse;
                    }
                }else{
                    speechText = 'Por suerte ya no hay nada dentro del retrete.';
                }
                break;
            case 'araña':
                speechText = 'Miras a la araña del techo. Sientes como si te devolviera la mirada y te da un escalofrío.'
                break;
            case 'huellas':
                speechText = 'Parecen las huellas de un animal doméstico.';    
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
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsBathroom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsBathroomEs'] = canTakeObjects;
            // Esto hace que solo la lea al cogerla en el baño
            if(item === 'papel higiénico'){
                speechText += ' Lees las inscripciones que hay en el papel higiénico. '
                    + "Son cuatro símbolos: un árbol, una nube, una hoguera y un río.";
                if(firstTime){
                    points += 10;
                    firstTime = false;
                    sessionAttributes['firstTimeBathroomEs'] = firstTime;
                }
            }
            let index = objectsBathroom.indexOf(item)
            objectsBathroom.splice(index,1)
            sessionAttributes['objectsBathroomEs'] = objectsBathroom;
            if(floorObjectsBathroom.indexOf(item) !== -1){
                let index2 = floorObjectsBathroom.indexOf(item)
                floorObjectsBathroom.splice(index2,1)
                sessionAttributes['floorObjectsBathroomEs'] = floorObjectsBathroom;
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
        objectsBathroom.push(item);
        floorObjectsBathroom.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsBathroomEs'] = canTakeObjects;
        sessionAttributes['floorObjectsBathroomEs'] = floorObjectsBathroom;
        sessionAttributes['objectsBathroomEs'] = objectsBathroom;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = 'No puedes hacer eso.';
        if(object === 'martillo' && element === 'ventana'){
            if(bathroomElements.indexOf('ventana') === -1){
                speakOutput = 
                    'Rompes la ventana de cristal con el martillo.' 
                    + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                    + 'Puedes ver un rollo de papel higiénico que parece tener unas inscripciones.'; 
                bathroomElements.push('ventana');
                sessionAttributes['bathroomElementsEs'] = bathroomElements;
                canTakeObjects.push('papel higiénico');
                sessionAttributes['canTakeObjectsBathroomEs'] = canTakeObjects;
                points += 10;
            }else{
                speakOutput = 'La ventana está rota. '
                if(floorObjectsBathroom.indexOf('papel higiénico') === -1 && objectsBathroom.indexOf('papel higiénico') !== -1){
                    speakOutput += 'Aún está el papel higiénico al fondo.';
                }
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
    clue(sessionAttributes){
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
        sessionAttributes['bathroomClueEs'] = n;
        return speakOutput;
    }
}
