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
    initialize(conv){
        light = false;
        objectsCorridor = ['carta'];
        floorObjectsCorridor = [];
        corridorElements = [];
        canTakeObjects = [];
        points = 0;
        firstUse = false;
        
        conv.lightCorridor = light;
        conv.objectsCorridor = objectsCorridor;
        conv.floorObjectsCorridor = floorObjectsCorridor;
        conv.canTakeObjectsCorridor = canTakeObjects;
        conv.corridorElements = corridorElements;
        conv.firstUseCorridor = firstUse;
        n = 0;
        conv.corridorClue = n;
    },
    continueGame(conv){
        light = conv.lightCorridor;
        
        objectsCorridor = conv.objectsCorridor;
        
        floorObjectsCorridor = conv.floorObjectsCorridor;
        
        canTakeObjects = conv.canTakeObjectsCorridor;
        
        corridorElements = conv.corridorElements;
    
        points = 0;
        
        firstUse = conv.firstUseCorridor;
        n = conv.corridorClue;
    },
    getRoom(){
        let room = 'pasillo';
        return room;
    },
    look(orientation){
        let speechText = '';
        if(light){
            switch(orientation){
                case 'norte':
                    speechText = 'Al fondo del pasillo hay una puerta con un candado.';
                    break;
                case 'sur':
                    speechText = 'Detrás de ti está la habitación.'
                    break;
                case 'este':
                    speechText = 'A la derecha hay un interruptor sobre una pared muy afectada por la humedad.'
                    break;
                case 'oeste':
                    speechText = 'A la izquierda ves un cuadro. El resto es pared, llena de una especie de moho bastante desagradable.'
                    break;
                case 'arriba':
                    speechText = 'Arriba solo está el techo. Nada de interés.' 
                    break;
                case 'abajo':
                    if(floorObjectsCorridor.length === 0){
                        speechText = 'Abajo solo está el suelo. No hay nada interesante.'
                    }else{
                        speechText = 'En el suelo encuentras: ' + floorObjectsCorridor;
                    }
                    break;
            }
        }else{
            speechText = 'El pasillo está muy oscuro y no ves nada. No quieres avanzar hasta que haya algo de luz.';
        }        
        return speechText;
    },
    interaction(object, conv){
        let speechText = 'No ves interés en hacer eso. Dime qué quieres hacer ahora. ';
        points = 0;
        switch(object){
            case 'cuadro':
                if(floorObjectsCorridor.indexOf('carta') === -1 && objectsCorridor.indexOf('carta') !== -1){
                    speechText = "<speak>"
                        + "Es un cuadro bastante peculiar. Aparecen unos gatos alrededor de una mesa jugando al póker. "
                        + "En lugar de apostar con dinero, utilizan chuches de gato. "
                        + "Miras detrás del cuadro y se cae una carta al suelo. "
                        + "Jurarías que uno de los gatos del cuadro te acaba de guiñar un ojo. Dime qué quieres hacer ahora. "
                        + "</speak>"
                    canTakeObjects.push('carta');
                    floorObjectsCorridor.push('carta');
                    conv.floorObjectsCorridor = floorObjectsCorridor;
                    points += 10;
                }else{
                    speechText = 'Ya no hay nada detrás del cuadro, pero la mirada de esos gatos te perturba un poco. Dime qué quieres hacer ahora.  '
                }
                break;
            case 'interruptor':
                if(corridorElements.indexOf('interruptor') === -1){
                    speechText = 
                        "<speak>"
                        + "Te acercas al interruptor y lo pulsas. "
                        + '<audio src="https://actions.google.com/sounds/v1/impacts/metal_crash.ogg"/>'
                        + 'Se escucha un ruido, pero no parece provenir de esta habitación. Dime qué quieres hacer ahora. '
                        + "</speak>";
                    corridorElements.push('interruptor');
                    conv.corridorElements = corridorElements;
                }else{
                    speechText = '<speak> Pulsas de nuevo el interruptor. '
                    + '<audio src="https://actions.google.com/sounds/v1/impacts/metal_crash.ogg"/>'
                    + 'Se oye un nuevo ruido. Sea lo que sea lo que activaste, lo acabas de desactivar. Dime qué quieres hacer ahora. </speak>';  
                    let index = corridorElements.indexOf('interruptor');
                    corridorElements.splice(index,1);
                    conv.corridorElements = corridorElements;
                }
                break;
            case 'candado':
                if(corridorElements.indexOf('candado') === -1){
                    speechText = 'El candado se abre con una combinación de cuatro números. Para probar una combinación, di introduce seguido de los números que quieras probar. Dime qué quieres hacer ahora.  '
                }else{
                    speechText = 'Ya has abierto el candado. Dime qué quieres hacer ahora.  ' 
                }
                break;
            case 'puerta':
                if(corridorElements.indexOf('puerta') === -1){
                    speechText = 
                        "<speak>"
                        + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                        + 'La puerta está cerrada. El candado impide que pueda abrirse. Necesitas una combinación de 4 números. '
                        + 'Para probar una combinación, di introduce seguido de los números que quieras probar. Dime qué quieres hacer ahora.  '
                        + "</speak>";
                }else{
                    speechText = 'La puerta está abierta y más allá hay una sala de lavadoras. Dime qué quieres hacer ahora.  ';    
                }
                break;
        }
        conv.canTakeObjectsCorridor = canTakeObjects;
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
    take(item, conv){
        let speechText = 'No puedes coger ' + item + '. Dime qué quieres hacer ahora.  ';
        points = 0;
        let success = false;
        if(objectsCorridor.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = '<speak> Has puesto ' + item + ' en el inventario.' ;
            let i = canTakeObjects.indexOf(item);
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsCorridor = canTakeObjects;
            if(item === 'carta'){
                speechText += ' Lees la carta para ver lo que pone: '
                    + "Llevo bastante tiempo observándote. Te estoy poniendo a prueba con una serie de desafíos. "
                    + 'Quiero ver si eres capaz de resolverlos para ser digno de la misión que quiero encomendarte. '
                    + 'Sigue avanzando para descubrir de qué trata todo esto. Solo puedo decirte que confío en ti para que llegues a ser el recipiente del que beba. '
                    + 'Firmado: <say-as interpret-as="characters">E</say-as>. '
                    + ' <say-as interpret-as="characters">C</say-as>. '
                    + ' <say-as interpret-as="characters">B</say-as>. '
                    + ' <say-as interpret-as="characters">I</say-as>. '
                    +  ' Dime qué quieres hacer ahora. </speak>'
            }else{
                speechText += ' Dime qué quieres hacer ahora. </speak>';
            }
            let index = objectsCorridor.indexOf(item);
            objectsCorridor.splice(index,1);
            conv.objectsCorridor = objectsCorridor;
            if(floorObjectsCorridor.indexOf(item) !== -1){
                let index2 = floorObjectsCorridor.indexOf(item);
                floorObjectsCorridor.splice(index2,1);
                conv.floorObjectsCorridor = floorObjectsCorridor;
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
        objectsCorridor.push(item);
        floorObjectsCorridor.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsCorridor = canTakeObjects;
        conv.floorObjectsCorridor = floorObjectsCorridor;
        conv.objectsCorridor = objectsCorridor;
        return speechText;
    },
    useObject(conv){
        let speakOutput = 'Ya la has encendido.';
        points = 0;
        if(!light){
            speakOutput = 'Has usado la linterna y ahora puedes ver el pasillo. Se trata de un pasadizo que se va estrechando hasta terminar en una puerta.';
            light = true; 
            conv.lightCorridor = true;
            if(!firstUse){
                firstUse = true;
                points += 10;
                conv.firstUseCorridor = firstUse;
            }
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    numberCode(number, conv){
        points = 0;
        let speakOutput = '<speak> <say-as interpret-as="digits">'+ number +'</say-as>. '
                        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                        + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
                        + 'Esa no es la clave. Sigue intentándolo. Dime qué quieres hacer ahora. </speak>';
        if(corridorElements.indexOf('puerta') !== -1){
            speakOutput = 'Ya has abierto la puerta. Delante hay una sala de lavadoras. Dime qué quieres hacer ahora.  '
        }
            
        if(number === '5329' && corridorElements.indexOf('puerta') === -1){
            speakOutput = '<speak> <say-as interpret-as="digits">'+number+'</say-as>. '
            + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
            + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
            + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
            + '<audio src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg"/>'
            + "<say-as interpret-as='interjection'>Enhorabuena</say-as> "
            + '<break time = "0.5s" />'
            + " Esa era la combinación correcta. La puerta se ha abierto. "
            + "Delante ves una sala de lavadoras. Dime qué quieres hacer ahora. </speak>";
            corridorElements.push('puerta');
            corridorElements.push('candado');
            conv.corridorElements = corridorElements;
            points += 20;
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    go(place){
        let speakOutput = 'No puedes ir ahí. Dime qué quieres hacer ahora.  ';
        let r = 'pasillo';
        if(place === 'habitación'){
            speakOutput = 'Ahora estás en la habitación. Dime qué quieres hacer ahora.  ';
            r = 'habitación';
        }else if(place === 'sala de lavadoras' && corridorElements.indexOf('puerta') !== -1){
            speakOutput = '<speak> Ahora estás en la sala de lavadoras.';
            r = 'sala de lavadoras';
        }
        
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    setLight(state, conv){
        light = state;
        conv.lightCorridor = light;
    },
    clue(conv){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'Hay una carta cuya firma tiene una importancia esencial. ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Prueba a sustituir las letras de la firma por el número de su posición en el alfabeto. ';
            n = 0;
        }
        conv.corridorClue = n;
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