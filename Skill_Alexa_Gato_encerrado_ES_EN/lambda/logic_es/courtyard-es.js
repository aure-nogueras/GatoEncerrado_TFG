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
    initialize(sessionAttributes){
        objectsCourt = ['ratón de juguete', 'reproductor'];
        floorObjectsCourt = ['reproductor']
        canTakeObjects = ['reproductor'];
        courtElements = [];
        firstTime = true;
        firstTry = true;
        mouse = true;
        points = 0;
        n = 0;
        
        sessionAttributes['objectsCourtEs'] = objectsCourt;
        sessionAttributes['floorObjectsCourtEs'] = floorObjectsCourt;
        sessionAttributes['canTakeObjectsCourtEs'] = canTakeObjects;
        sessionAttributes['courtElementsEs'] = courtElements;
        sessionAttributes['firstTimeCourtEs'] = firstTime;
        sessionAttributes['firstTryCourtEs'] = firstTry;
        sessionAttributes['mouseEs'] = mouse;
        sessionAttributes['courtyardClueEs'] = n;
    },
    continueGame(sessionAttributes){
        objectsCourt = sessionAttributes['objectsCourtEs'];
        floorObjectsCourt = sessionAttributes['floorObjectsCourtEs'];
        canTakeObjects = sessionAttributes['canTakeObjectsCourtEs'];
        courtElements = sessionAttributes['courtElementsEs'];
        firstTime = sessionAttributes['firstTimeCourtEs'];
        firstTry = sessionAttributes['firstTryCourtEs'];
        mouse = sessionAttributes['mouseEs'];  
        points = 0;
        n = sessionAttributes['courtyardClueEs'];
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
    interaction(object, sessionAttributes){
        let speechText = 'No ves interés en hacer eso. ';
        points = 0;
        switch(object){
            case 'mesa':
                speechText = 'Es una mesa de madera. Encima de ella hay una bandeja.'
                break;
            case 'bandeja':
                speechText = 'La bandeja está llena de galletas de chocolate. Alguna de ellas está mordisqueada. Hay migas por todas partes.'
                break;
            case 'agujero':
                if(courtElements.indexOf('agujero') === -1){
                    speechText = 'Te acercas al agujero. De repente sale un ratón de juguete y empieza a dar vueltas en el suelo. Después de un rato se para. Puedes guardar o apretar el ratón.'
                    courtElements.push('agujero')
                    floorObjectsCourt.push('ratón de juguete')
                    canTakeObjects.push('ratón de juguete')
                    sessionAttributes['canTakeObjectsCourtEs'] = canTakeObjects;
                    sessionAttributes['floorObjectsCourtEs'] = floorObjectsCourt;
                    sessionAttributes['courtElementsEs'] = courtElements;
                }else{
                    speechText = 'Dentro del agujero ya no hay nada.' 
                }
                break;
            case 'huellas':
                speechText = 'Son las huellas de un animal doméstico. También hay migas de galletas junto a ellas.';    
                break;
            case 'puerta':
                if(courtElements.indexOf('puerta') === -1){
                    speechText = "<speak>"
                        + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                        + 'La puerta es de metal y está cerrada. Sobre ella hay cuatro símbolos: aire, agua, tierra y fuego. '
                        + 'Parece que has de pulsarlos para que la puerta se abra. Para probar una combinación, di pulsar y el orden de los símbolos.'
                        + "</speak>";
                }else{
                    speechText = 'La puerta está abierta y delante ves un salón.';    
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
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsCourt.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'ratón de juguete' && firstTime === true){
                points += 20;
                firstTime = false;
                sessionAttributes['firstTimeCourtEs'] = firstTime;
            }
            if(item === 'reproductor'){
                speechText += ' Coges el reproductor mp3 y empiezas a escuchar una voz que te resulta familiar. '
                    + "<voice name='Enrique'> Ve mucho más allá. No olvides las hebras que se entretejen y forman un todo."
                    + '</voice>'
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsCourtEs'] = canTakeObjects;
            let index = objectsCourt.indexOf(item)
            objectsCourt.splice(index,1)
            sessionAttributes['objectsCourtEs'] = objectsCourt;
            if(floorObjectsCourt.indexOf(item) !== -1){
                let index2 = floorObjectsCourt.indexOf(item)
                floorObjectsCourt.splice(index2,1)
                sessionAttributes['floorObjectsCourtEs'] = floorObjectsCourt;
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
        objectsCourt.push(item);
        floorObjectsCourt.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsCourtEs'] = canTakeObjects;
        sessionAttributes['floorObjectsCourtEs'] = floorObjectsCourt;
        sessionAttributes['objectsCourtEs'] = objectsCourt;
        return speechText;
    },
    pushSymbol(symbol, symbol2, symbol3, symbol4, sessionAttributes){
        let speakOutput = symbol + ' ' + symbol2 + ' ' + symbol3 + ' ' + symbol4
                        + ' Esa no es la clave. Sigue intentándolo.';
        points = 0;
        
        if(courtElements.indexOf('puerta') !== -1){
            speakOutput = 'Ya has abierto la puerta. Delante hay un salón.'
        }
        
        if(symbol === 'tierra' && symbol2 === 'aire' && symbol3 === 'fuego' && symbol4 === 'agua' && courtElements.indexOf('puerta') === -1){
            speakOutput = "<speak>" 
            +  symbol + ' ' + symbol2 + ' ' + symbol3 + ' ' + symbol4
            + "<audio src='https://soundgato.s3.eu-west-3.amazonaws.com/wind.mp3'/>"
            + "<say-as interpret-as='interjection'>Genial</say-as>."
            + '<break time = "0.5s" />'
            + " Esa era la combinación correcta. La puerta se ha abierto. "
            + "Delante ves un salón."
            + "</speak>";
            courtElements.push('puerta');
            sessionAttributes['courtElementsEs'] = courtElements;
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
    choose(option, sessionAttributes){
        points = 0;
        let speakOutput = 'Esa acción ya no es posible.';
        if(firstTry && canTakeObjects.indexOf('ratón de juguete') !== -1 && courtElements.indexOf('agujero') !== -1 && objectsCourt.indexOf('ratón de juguete') !== -1 && floorObjectsCourt.indexOf('ratón de juguete') !== -1){
            if(option === 'apretar'){
                speakOutput = 'Aprietas el ratón y se rompe. Pierdes 20 puntos';
                points -= 20;
                let i = canTakeObjects.indexOf('ratón de juguete')
                canTakeObjects.splice(i,1)
                sessionAttributes['canTakeObjectsCourtEs'] = canTakeObjects;
                mouse = false;
                sessionAttributes['mouseEs'] = mouse;
            }
            firstTry = false;
            sessionAttributes['firstTryCourtEs'] = firstTry;
        }
        return{
            speak: speakOutput,
            points: points
        }
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'Puedes encontrar el código de apertura de la puerta en algo que deberías haber encontrado en el baño. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Siempre es mejor no ensuciarse las manos con los roedores. ';
            n = 0;
        }
        sessionAttributes['courtyardClueEs'] = n;
        return speakOutput;
    }
}