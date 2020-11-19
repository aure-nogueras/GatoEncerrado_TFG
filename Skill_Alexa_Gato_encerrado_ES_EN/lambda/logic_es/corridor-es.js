// Objects in the room
let objectsCorridor = [];
        
// Objects in the floor of the room
let floorObjectsCorridor = [];

// Array with accomplished interactions with the objects of the room
let corridorElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Variable that indicates if there is enough light to explore the room
let light; 

// Points in this room
let points;

// First time to use the lantern
let firstUse;

// Number used to choose the clue
let n;

module.exports = {
    initialize(sessionAttributes){
        light = false;
        objectsCorridor = ['carta'];
        floorObjectsCorridor = [];
        corridorElements = [];
        canTakeObjects = [];
        points = 0;
        firstUse = false;
        
        sessionAttributes['lightCorridorEs'] = light;
        sessionAttributes['objectsCorridorEs'] = objectsCorridor;
        sessionAttributes['floorObjectsCorridorEs'] = floorObjectsCorridor;
        sessionAttributes['canTakeObjectsCorridorEs'] = canTakeObjects;
        sessionAttributes['corridorElementsEs'] = corridorElements;
        sessionAttributes['firstUseCorridorEs'] = firstUse;
        n = 0;
        sessionAttributes['corridorClueEs'] = n;
    },
    continueGame(sessionAttributes){
        light = sessionAttributes['lightCorridorEs'];
        
        objectsCorridor = sessionAttributes['objectsCorridorEs'];
        
        floorObjectsCorridor = sessionAttributes['floorObjectsCorridorEs'];
        
        canTakeObjects = sessionAttributes['canTakeObjectsCorridorEs'];
        
        corridorElements = sessionAttributes['corridorElementsEs'];
    
        points = 0;
        
        firstUse = sessionAttributes['firstUseCorridorEs'];
        n = sessionAttributes['corridorClueEs'];
    },
    getRoom(){
        let room = 'pasillo';
        return room;
    },
    look(orientation){
        let speechText = '';
        let url = '';
        if(light){
            switch(orientation){
                case 'norte':
                    speechText = 'Al fondo del pasillo hay una puerta con un candado.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/north_corridor.png';
                    break;
                case 'sur':
                    speechText = 'Detrás de ti está la habitación.';
                    break;
                case 'este':
                    speechText = 'A la derecha hay un interruptor sobre una pared muy afectada por la humedad.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/east_corridor.png';
                    break;
                case 'oeste':
                    speechText = 'A la izquierda ves un cuadro. El resto es pared, llena de una especie de moho bastante desagradable.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/west_corridor.png';
                    break;
                case 'arriba':
                    speechText = 'Arriba solo está el techo. Nada de interés.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/down.png';
                    break;
                case 'abajo':
                    if(floorObjectsCorridor.length === 0){
                        speechText = 'Abajo solo está el suelo. No hay nada interesante.';
                    }else{
                        speechText = 'En el suelo encuentras: ' + floorObjectsCorridor;
                    }
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/down.png';
                    break;
            }
        }else{
            speechText = 'El pasillo está muy oscuro y no ves nada. No quieres avanzar hasta que haya algo de luz.';
        }        
        return {
            speechText: speechText,
            url: url
        }
    },
    interaction(object, sessionAttributes){
        let speechText = 'No ves interés en hacer eso. ';
        points = 0;
        switch(object){
            case 'cuadro':
                if(floorObjectsCorridor.indexOf('carta') === -1 && objectsCorridor.indexOf('carta') !== -1){
                    speechText = "<speak>"
                        + "Es un cuadro bastante peculiar. Aparecen unos gatos alrededor de una mesa jugando al póker. "
                        + "En lugar de apostar con dinero, utilizan chuches de gato. "
                        + "Miras detrás del cuadro y se cae una carta al suelo. "
                        + '<audio src="soundbank://soundlibrary/cloth_leather_paper/books/books_07"/>'
                        + "Jurarías que uno de los gatos del cuadro te acaba de guiñar un ojo. "
                        + "</speak>"
                    canTakeObjects.push('carta');
                    floorObjectsCorridor.push('carta');
                    sessionAttributes['floorObjectsCorridorEs'] = floorObjectsCorridor;
                    points += 10;
                }else{
                    speechText = 'Ya no hay nada detrás del cuadro, pero la mirada de esos gatos te perturba un poco.'
                }
                break;
            case 'interruptor':
                if(corridorElements.indexOf('interruptor') === -1){
                    speechText = 
                        "<speak>"
                        + "Te acercas al interruptor y lo pulsas. "
                        + '<audio src="soundbank://soundlibrary/machines/power_up_down/power_up_down_12"/>'
                        + 'Se escucha un ruido, pero no parece provenir de esta habitación. '
                        + "</speak>";
                    corridorElements.push('interruptor');
                    sessionAttributes['corridorElementsEs'] = corridorElements;
                }else{
                    speechText = 'Pulsas de nuevo el interruptor. '
                    + '<audio src="soundbank://soundlibrary/machines/power_up_down/power_up_down_13"/>'
                    + 'Se oye un nuevo ruido. Sea lo que sea lo que activaste, lo acabas de desactivar.';  
                    let index = corridorElements.indexOf('interruptor');
                    corridorElements.splice(index,1);
                    sessionAttributes['corridorElementsEs'] = corridorElements;
                }
                break;
            case 'candado':
                if(corridorElements.indexOf('candado') === -1){
                    speechText = 'El candado se abre con una combinación de cuatro números. Para probar una combinación, di introduce seguido de los números que quieras probar.'
                }else{
                    speechText = 'Ya has abierto el candado.' 
                }
                break;
            case 'puerta':
                if(corridorElements.indexOf('puerta') === -1){
                    speechText = 
                        "<speak>"
                        + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                        + 'La puerta está cerrada. El candado impide que pueda abrirse. Necesitas una combinación de 4 números. '
                        + 'Para probar una combinación, di introduce seguido de los números que quieras probar.'
                        + "</speak>";
                }else{
                    speechText = 'La puerta está abierta y más allá hay una sala de lavadoras.';    
                }
                break;
        }
        sessionAttributes['canTakeObjectsCorridorEs'] = canTakeObjects;
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsCorridor.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsCorridor.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' ;
            let i = canTakeObjects.indexOf(item);
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsCorridorEs'] = canTakeObjects;
            if(item === 'carta'){
                speechText += ' Lees la carta para ver lo que pone: '
                    + "<voice name='Enrique'> Llevo bastante tiempo observándote. Te estoy poniendo a prueba con una serie de desafíos. "
                    + 'Quiero ver si eres capaz de resolverlos para ser digno de la misión que quiero encomendarte. '
                    + 'Sigue avanzando para descubrir de qué trata todo esto. Solo puedo decirte que confío en ti para que llegues a ser el recipiente del que beba. '
                    + 'Firmado: <say-as interpret-as="characters">E</say-as>.'
                    + '<say-as interpret-as="characters">C</say-as>.'
                    + '<say-as interpret-as="characters">B</say-as>.'
                    + '<say-as interpret-as="characters">I</say-as>.'
                    + '</voice>'
            }
            let index = objectsCorridor.indexOf(item);
            objectsCorridor.splice(index,1);
            sessionAttributes['objectsCorridorEs'] = objectsCorridor;
            if(floorObjectsCorridor.indexOf(item) !== -1){
                let index2 = floorObjectsCorridor.indexOf(item);
                floorObjectsCorridor.splice(index2,1);
                sessionAttributes['floorObjectsCorridorEs'] = floorObjectsCorridor;
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
        objectsCorridor.push(item);
        floorObjectsCorridor.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsCorridorEs'] = canTakeObjects;
        sessionAttributes['floorObjectsCorridorEs'] = floorObjectsCorridor;
        sessionAttributes['objectsCorridorEs'] = objectsCorridor;
        return speechText;
    },
    useObject(sessionAttributes){
        let speakOutput = 'Ya la has encendido.';
        points = 0;
        if(!light){
            speakOutput = 'Has usado la linterna y ahora puedes ver el pasillo. Se trata de un pasadizo que se va estrechando hasta terminar en una puerta.';
            light = true; 
            sessionAttributes['lightCorridorEs'] = true;
            if(!firstUse){
                firstUse = true;
                points += 10;
                sessionAttributes['firstUseCorridorEs'] = firstUse;
            }
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    numberCode(number, sessionAttributes){
        points = 0;
        let speakOutput = '<say-as interpret-as="digits">'+ number +'</say-as>. '
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
                        + 'Esa no es la clave. Sigue intentándolo.';
        if(corridorElements.indexOf('puerta') !== -1){
            speakOutput = 'Ya has abierto la puerta. Delante hay una sala de lavadoras.'
        }
            
        if(number === '5329' && corridorElements.indexOf('puerta') === -1){
            speakOutput = '<say-as interpret-as="digits">'+number+'</say-as>. '
            + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
            + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
            + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
            + '<audio src="soundbank://soundlibrary/computers/beeps_tones/beeps_tones_01"/>'
            + "<say-as interpret-as='interjection'>Enhorabuena</say-as>."
            + '<break time = "0.5s" />'
            + " Esa era la combinación correcta. La puerta se ha abierto. "
            + "Delante ves una sala de lavadoras.";
            corridorElements.push('puerta');
            corridorElements.push('candado');
            sessionAttributes['corridorElementsEs'] = corridorElements;
            points += 20;
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    go(place){
        let speakOutput = 'No puedes ir ahí.';
        let r = 'pasillo';
        if(place === 'habitación'){
            speakOutput = 'Ahora estás en la habitación.';
            r = 'habitación';
        }else if(place === 'sala de lavadoras' && corridorElements.indexOf('puerta') !== -1){
            speakOutput = 'Ahora estás en la sala de lavadoras.';
            r = 'sala de lavadoras';
        }
        
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    setLight(state, sessionAttributes){
        light = state;
        sessionAttributes['lightCorridorEs'] = light;
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'Hay una carta cuya firma tiene una importancia esencial. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Prueba a sustituir las letras de la firma por el número de su posición en el alfabeto. ';
            n = 0;
        }
        sessionAttributes['corridorClueEs'] = n;
        return speakOutput;
    },
    getSwitch(){
        let on = 0;
        if(corridorElements.indexOf('interruptor') !== -1){
            on = 1;
        }
        return on;
    }
    
}