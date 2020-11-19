// Objects in the room
let objectsCourt = [];
        
// Objects in the floor of the room
let floorObjectsCourt = [];

// Array with accomplished interactions with the objects of the room
let courtElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;
let firstTry;

// Indicates if the mouse can be taken
let mouse;

// Number used to choose the clue
let n;

module.exports = {
    initialize(conv){
        objectsCourt = ['ratón de juguete', 'reproductor'];
        floorObjectsCourt = ['reproductor']
        canTakeObjects = ['reproductor'];
        courtElements = [];
        firstTime = true;
        firstTry = true;
        mouse = true;
        points = 0;
        n = 0;
        
        conv.objectsCourt = objectsCourt;
        conv.floorObjectsCourt = floorObjectsCourt;
        conv.canTakeObjectsCourt = canTakeObjects;
        conv.courtElements = courtElements;
        conv.firstTimeCourt = firstTime;
        conv.firstTryCourt = firstTry;
        conv.mouse = mouse;
        conv.courtyardClue = n;
    },
    continueGame(conv){
        objectsCourt = conv.objectsCourt;
        floorObjectsCourt = conv.floorObjectsCourt;
        canTakeObjects = conv.canTakeObjectsCourt;
        courtElements = conv.courtElements;
        firstTime = conv.firstTimeCourt;
        firstTry = conv.firstTryCourt;
        mouse = conv.mouse;  
        points = 0;
        n = conv.courtyardClue;
    },
    getRoom(){
        let room = 'patio';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'norte':
                speechText = 'Al fondo del patio hay otra puerta.';
                break;
            case 'sur':
                speechText = 'Detrás puedes ver la sala de lavadoras.';
                break;
            case 'este':
                speechText = 'Al este hay una mesa.';
                break;
            case 'oeste':
                speechText = 'Al oeste ves un agujero en la pared.';
                break;
            case 'arriba':
                speechText = 'Arriba puedes ver el cielo. Está atardeciendo, pero aún hay suficiente luz como para ver algo. ';
                break;
            case 'abajo':
                if(floorObjectsCourt.length === 0){
                    speechText = 'Abajo está el suelo. De nuevo puedes ver unas huellas.';
                }else{
                    speechText = 'Además de las huellas, en el suelo encuentras: ' + floorObjectsCourt;
                    if(floorObjectsCourt.indexOf('ratón de juguete') !== -1){
                        if(!mouse){
                            speechText += 'El ratón de juguete está roto. No puedes cogerlo.';
                        }else{
                            speechText += 'Puedes coger o apretar el ratón.';
                        }    
                    }
                }
                break;
        }
        return speechText;
    },
    interaction(object, conv){
        let speechText = 'No ves interés en hacer eso. Dime qué quieres hacer ahora. ';
        points = 0;
        switch(object){
            case 'mesa':
                speechText = 'Es una mesa de madera. Encima de ella hay una bandeja. Dime qué quieres hacer ahora.  '
                break;
            case 'bandeja':
                speechText = 'La bandeja está llena de galletas de chocolate. Alguna de ellas está mordisqueada. Hay migas por todas partes. Dime qué quieres hacer ahora.  '
                break;
            case 'agujero':
                if(courtElements.indexOf('agujero') === -1){
                    speechText = 'Te acercas al agujero. De repente sale un ratón de juguete y empieza a dar vueltas en el suelo. Después de un rato se para. Puedes guardar o apretar el ratón. Dime qué quieres hacer ahora.  '
                    courtElements.push('agujero')
                    floorObjectsCourt.push('ratón de juguete')
                    canTakeObjects.push('ratón de juguete')
                    conv.canTakeObjectsCourt = canTakeObjects;
                    conv.floorObjectsCourt = floorObjectsCourt;
                    conv.courtElements = courtElements;
                }else{
                    speechText = 'Dentro del agujero ya no hay nada. Dime qué quieres hacer ahora.  ' 
                }
                break;
            case 'huellas':
                speechText = 'Son las huellas de un animal doméstico. También hay migas de galletas junto a ellas. Dime qué quieres hacer ahora.  ';    
                break;
            case 'puerta':
                if(courtElements.indexOf('puerta') === -1){
                    speechText = "<speak>"
                        + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                        + 'La puerta es de metal y está cerrada. Sobre ella hay cuatro símbolos: aire, agua, tierra y fuego. '
                        + 'Parece que has de pulsarlos para que la puerta se abra. Para probar una combinación, di pulsar y el orden de los símbolos.'
                        + " Dime qué quieres hacer ahora. </speak>";
                }else{
                    speechText = 'La puerta está abierta y delante ves un salón. Dime qué quieres hacer ahora.  ';    
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
        if(objectsCourt.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsCourt.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'ratón de juguete' && firstTime === true){
                points += 20;
                firstTime = false;
                conv.firstTimeCourt = firstTime;
            }
            if(item === 'reproductor'){
                speechText += ' Coges el reproductor mp3 y empiezas a escuchar una voz que te resulta familiar. '
                    + " Ve mucho más allá. No olvides las hebras que se entretejen y forman un todo. ";
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsCourt = canTakeObjects;
            let index = objectsCourt.indexOf(item)
            objectsCourt.splice(index,1)
            conv.objectsCourt = objectsCourt;
            if(floorObjectsCourt.indexOf(item) !== -1){
                let index2 = floorObjectsCourt.indexOf(item)
                floorObjectsCourt.splice(index2,1)
                conv.floorObjectsCourt = floorObjectsCourt;
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
        objectsCourt.push(item);
        floorObjectsCourt.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsCourt = canTakeObjects;
        conv.floorObjectsCourt = floorObjectsCourt;
        conv.objectsCourt = objectsCourt;
        return speechText;
    },
    pushSymbol(symbol, symbol2, symbol3, symbol4, conv){
        let speakOutput = symbol + ' ' + symbol2 + ' ' + symbol3 + ' ' + symbol4
                        + ' Esa no es la clave. Sigue intentándolo. Dime qué quieres hacer ahora.  ';
        points = 0;
        
        if(courtElements.indexOf('puerta') !== -1){
            speakOutput = 'Ya has abierto la puerta. Delante hay un salón. Dime qué quieres hacer ahora.  '
        }
        
        if(symbol === 'tierra' && symbol2 === 'aire' && symbol3 === 'fuego' && symbol4 === 'agua' && courtElements.indexOf('puerta') === -1){
            speakOutput = "<speak>" 
            +  symbol + ' ' + symbol2 + ' ' + symbol3 + ' ' + symbol4
            + "<audio src='https://soundgato.s3.eu-west-3.amazonaws.com/wind.mp3'/>"
            + "<say-as interpret-as='interjection'>Genial</say-as>."
            + '<break time = "0.5s" />'
            + " Esa era la combinación correcta. La puerta se ha abierto. "
            + "Delante ves un salón. Dime qué quieres hacer ahora.  "
            + "</speak>";
            courtElements.push('puerta');
            conv.courtElements = courtElements;
            points += 10;
        }   
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    go(place){
        let speakOutput = 'No puedes ir ahí.';
        let r = 'patio';
        if(place === 'sala de lavadoras'){
            speakOutput = 'Ahora estás en la sala de lavadoras.';
            r = 'sala de lavadoras';
        }else if(place === 'salón' && courtElements.indexOf('puerta') !== -1){
            speakOutput = 'Estás en el salón.';
            r = 'salón';
        }
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    choose(option, conv){
        points = 0;
        let speakOutput = 'Esa acción ya no es posible. Dime qué quieres hacer ahora.  ';
        if(firstTry && canTakeObjects.indexOf('ratón de juguete') !== -1 && courtElements.indexOf('agujero') !== -1 && objectsCourt.indexOf('ratón de juguete') !== -1 && floorObjectsCourt.indexOf('ratón de juguete') !== -1){
            if(option === 'apretar'){
                speakOutput = 'Aprietas el ratón y se rompe. Pierdes 20 puntos. Dime qué quieres hacer ahora.  ';
                points -= 20;
                let i = canTakeObjects.indexOf('ratón de juguete')
                canTakeObjects.splice(i,1)
                conv.canTakeObjectsCourt = canTakeObjects;
                mouse = false;
                conv.mouse = mouse;
            }
            firstTry = false;
            conv.firstTryCourt = firstTry;
        }
        return{
            speak: speakOutput,
            points: points
        }
    },
    clue(conv){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'Puedes encontrar el código de apertura de la puerta en algo que deberías haber encontrado en el baño. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Siempre es mejor no ensuciarse las manos con los roedores. ';
            n = 0;
        }
        conv.courtyardClue = n;
        return speakOutput;
    }
    
}