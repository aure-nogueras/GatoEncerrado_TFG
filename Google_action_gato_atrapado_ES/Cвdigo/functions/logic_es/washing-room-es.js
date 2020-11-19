// Objects in the room
let objectsWashingRoom = [];
        
// Objects in the floor of the room
let floorObjectsWashingRoom = [];

// Array with accomplished interactions with the objects of the room
let washingRoomElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

// Number used to choose the clue
let n;

// Boolean to know if it is the first time an object is taken
let firstTime;

// Indicates if you can take the wool
let wool;

module.exports = {
    initialize(conv){
        objectsWashingRoom = ['ovillo de lana'];
        floorObjectsWashingRoom = [];
        washingRoomElements = [];
        canTakeObjects = [];
        points = 0;
        firstTime = true;
        wool = true;
        n = 0;
        
        conv.objectsWashingRoom = objectsWashingRoom;
        conv.floorObjectsWashingRoom = floorObjectsWashingRoom;
        conv.canTakeObjectsWashingRoom = canTakeObjects;
        conv.washingRoomElements = washingRoomElements;
        conv.firstTimeWashingMachine = firstTime;
        conv.wool = wool;
        conv.washingRoomClue = n;
    },
    continueGame(conv){
        objectsWashingRoom = conv.objectsWashingRoom;
        floorObjectsWashingRoom = conv.floorObjectsWashingRoom;
        canTakeObjects = conv.canTakeObjectsWashingRoom;
        washingRoomElements = conv.washingRoomElements;
        firstTime = conv.firstTimeWashingMachine;
        wool = conv.wool;
        points = 0;
        n = conv.washingRoomClue;
    },
    getRoom(){
        let room = 'sala de lavadoras';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'norte':
                speechText = 'Puedes ver dos puertas. La de la izquierda es de cristal. La de la derecha es una puerta con un cerrojo.'
                break;
            case 'sur':
                speechText = 'Ves el pasillo.'
                break;
            case 'este':
                speechText = 'A tu derecha hay una lavadora y una secadora.'
                break;
            case 'oeste':
                speechText = 'A tu izquierda está el teléfono que has oído antes sonar y una pared un tanto peculiar.'
                break;
            case 'arriba':
                speechText = 'Encima de ti está el techo. Hay una inmensa claraboya que permite la entrada de la luz. '
                break;
            case 'abajo':
                if(floorObjectsWashingRoom.length === 0){
                    speechText = 'Abajo solo está el suelo. No hay nada interesante.'
                }else{
                    speechText = 'En el suelo encuentras: ' + floorObjectsWashingRoom;
                    if(!wool){
                        speechText += ' El ovillo está deshecho. No puedes cogerlo.';
                    }
                }
                break;
            }
        return speechText;
    },
    interaction(object, dryer, conv){
        let speechText = 'No ves interés en hacer eso. Dime qué quieres hacer ahora. ';
        let r = 'sala de lavadoras';
        points = 0;
        switch(object){
                case 'lavadora':
                    speechText = 'Es una lavadora antigua, un poco oxidada. No hay nada más de interés en ella. Dime qué quieres hacer ahora. '
                    break;
                case 'secadora':
                    if(floorObjectsWashingRoom.indexOf('ovillo de lana') === -1 && objectsWashingRoom.indexOf('ovillo de lana') !== -1){
                        if(dryer){
                            speechText = 'Se trata de una secadora que está parada. Parece que el interruptor del pasillo servía para detenerla. Te acercas y ves algo en su interior. Espera, ¿eso es un ovillo de lana? A lo mejor has sido un gato en otra vida. Puedes guardarlo o jugar con él.'
                            + 'Dime qué quieres hacer ahora. '
                            canTakeObjects.push('ovillo de lana');
                            conv.canTakeObjectsWashingRoom = canTakeObjects;
                        }else{
                            speechText = 'La secadora está en movimiento. Deberías pararla para ver lo que tiene dentro. Dime qué quieres hacer ahora. '
                        }
                    }else{
                        speechText = 'Ya no hay nada dentro de la secadora. Dime qué quieres hacer ahora. '
                    }
                    break;
                case 'puerta de cristal':
                    if(washingRoomElements.indexOf('puerta de cristal') === -1){
                        speechText = 'La puerta de cristal está atascada y no puede abrirse. Dime qué quieres hacer ahora. '
                    }else{
                        speechText = 'La puerta de cristal está rota y ves un baño. Dime qué quieres hacer ahora. ' 
                    }
                    break;
                case 'puerta con cerrojo':
                    if(washingRoomElements.indexOf('puerta con cerrojo') === -1){
                        speechText = "<speak> <audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                        + 'La puerta está cerrada. Tiene un cerrojo que está atornillado a la puerta. Dime qué quieres hacer ahora.</speak>';
                    }else{
                        speechText = 'La puerta está abierta y el cerrojo desatornillado. Delante tienes un patio interior. Dime qué quieres hacer ahora. ';    
                    }
                    break;
                case 'cerrojo':
                    if(washingRoomElements.indexOf('puerta con cerrojo') === -1){
                        speechText = 'Es un cerrojo atornillado a la puerta. Dime qué quieres hacer ahora. '; 
                    }else{
                        speechText = 'El cerrojo está desatornillado. Dime qué quieres hacer ahora. ';
                    }
                    break;
                case 'puerta':
                    speechText = 'Debes indicar cuál de las puertas quieres examinar, la de la derecha o con cerrojo, o la de la izquierda o de cristal. Dime qué quieres hacer ahora. '
                    break;
                case 'teléfono':
                    speechText = 'Es un teléfono antiguo, anclado en la pared. Lo coges y escuchas algo al otro lado: '
                    + "Tengo mucha hambre, un apetito felino diría yo. "
                    + 'Más vale que te des prisa. '
                    + ' Te parece tan extraño lo que has oído que lo apuntas en un papel que has encontrado en tu bolsillo y lo guardas en tu inventario. Dime qué quieres hacer ahora. ';    
                    break;
                case 'pared':
                    speechText = '<speak> La pared tiene una textura muy extraña. Casi parece como si pudiera atravesarse. Te acercas y... la atraviesas. '
                    + '<audio src="https://actions.google.com/sounds/v1/horror/synthetic_insects.ogg"/> ¿Qué ha sido eso? Miras a tu alrededor y estás en una especie de cocina. '
                    + 'La pared se ha cerrado detrás de ti y ya no puedes volver atrás. Sin duda, no recuerdas que tu casa hiciera esto. Dime qué quieres hacer ahora. </speak>';
                    r = 'cocina';
                    break;
                case 'claraboya':
                    speechText = 'La claraboya deja entrar mucha luz. Sin duda es la habitación más luminosa en la que has estado de momento. Dime qué quieres hacer ahora. ';   
                    break;
            }
        return {
            speechText: speechText,
            points: points,
            room: r
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsWashingRoom.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, conv){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsWashingRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'ovillo de lana' && firstTime === true){
                points += 20;
                firstTime = false;
                conv.firstTimeWashingMachine = firstTime;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            conv.canTakeObjectsWashingRoom = canTakeObjects;
            let index = objectsWashingRoom.indexOf(item)
            objectsWashingRoom.splice(index,1)
            conv.objectsWashingRoom = objectsWashingRoom;
            if(floorObjectsWashingRoom.indexOf(item) !== -1){
                let index2 = floorObjectsWashingRoom.indexOf(item);
                floorObjectsWashingRoom.splice(index2,1);
                conv.floorObjectsWashingRoom = floorObjectsWashingRoom;
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
        objectsWashingRoom.push(item);
        floorObjectsWashingRoom.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsWashingRoom = canTakeObjects;
        conv.floorObjectsWashingRoom = floorObjectsWashingRoom;
        conv.objectsWashingRoom = objectsWashingRoom;
        return speechText;
    },
    use(object, element, conv){
        points = 0;
        let speakOutput = 'No puedes hacer eso. Dime qué quieres hacer ahora. ';
        if(object === 'martillo' && element === 'puerta de cristal'){
            if(washingRoomElements.indexOf('puerta de cristal') === -1){
                speakOutput = 
                    '<speak> Rompes la puerta de cristal con el martillo.' 
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/crash.ogg'/>"
                    + 'Delante de ti ves un baño. Dime qué quieres hacer ahora. </speak>'; 
                washingRoomElements.push('puerta de cristal');
                conv.washingRoomElements = washingRoomElements;
                points += 10;
            }else{
                speakOutput = 'La puerta de cristal está rota. Puedes acceder al baño. Dime qué quieres hacer ahora. '
            }
        } 
        if(object === 'destornillador' && element === 'puerta con cerrojo'){
            if(washingRoomElements.indexOf('puerta con cerrojo') === -1){
                speakOutput = "<speak> <audio src='https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'/>"
                    + '<say-as interpret-as="interjection">genial</say-as>'
                    + '<break time = "0.5s" />'
                    + ' ¡La puerta se ha abierto! Detrás de la puerta hay un patio interior. Dime qué quieres hacer ahora. </speak>';
                washingRoomElements.push('puerta con cerrojo');
                conv.washingRoomElements = washingRoomElements;
                points += 10;
            }else{
                speakOutput = 'La puerta con cerrojo está abierta y te deja ver un patio interior. Dime qué quieres hacer ahora. '
            }
        }
        return{
            speakOutput: speakOutput,
            points: points
        }        
    },
    go(place){
        let speakOutput = 'No puedes ir ahí.';
        let r = 'sala de lavadoras';
        if(place === 'pasillo'){
            speakOutput = 'Ahora estás en el pasillo.';
            r = 'pasillo';
        }else if(place === 'baño' && washingRoomElements.indexOf('puerta de cristal') !== -1){
            speakOutput = 'Ahora estás en el baño. No huele muy bien.';
            r = 'baño';
        }else if(place === 'patio' && washingRoomElements.indexOf('puerta con cerrojo') !== -1){
            speakOutput = 'Ahora estás en el patio. La luz del sol te anima un poco.';
            r = 'patio';
        }

        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    getEnterSpeak(conv){
        let speakOutput = '</speak>';
        if(washingRoomElements.indexOf('teléfono') === -1){
            speakOutput = '<audio src="https://actions.google.com/sounds/v1/household/phone_ringing.ogg"/>'
            + ' Oyes un teléfono. Quizás deberías ver quién llama. Espera... ¿qué es eso? ' 
            + 'Acabas de ver algo que ha... ¿atravesado la pared? Dime qué quieres hacer ahora. </speak>'
            washingRoomElements.push('teléfono');
            conv.washingRoomElements = washingRoomElements;
        }
        return speakOutput;
    },
    choose(option, dryer, conv){
        points = 0;
        let speakOutput = 'Esa acción ya no es posible. Dime qué quieres hacer ahora. ';
        if(dryer && canTakeObjects.indexOf('ovillo de lana') !== -1 && objectsWashingRoom.indexOf('ovillo de lana') !== -1 && floorObjectsWashingRoom.indexOf('ovillo de lana') === -1){
            if(option === 'jugar'){
                speakOutput = 'Juegas con el ovillo y se deshace. Ahora no podrás cogerlo. Pierdes 20 puntos. Dime qué quieres hacer ahora. ';
                points -= 20;
                let i = canTakeObjects.indexOf('ovillo de lana')
                canTakeObjects.splice(i,1)
                conv.canTakeObjectsWashingRoom = canTakeObjects;
                floorObjectsWashingRoom.push('ovillo de lana');
                conv.floorObjectsWashingRoom = floorObjectsWashingRoom;
                wool = false;
                conv.wool = wool;
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
            speakOutput = 'La puerta de cristal puede romperse con algo que deberías haber cogido en una habitación anterior.';
            n = 1;
        }else if(n === 1){
            speakOutput = 'La puerta con cerrojo puede abrirse con algo que encontrarás en la habitación de la puerta de cristal.';
            n = 2;
        }else if(n === 2){
            speakOutput = 'Tal vez podrías parar la secadora con algún interruptor que ya has visto. ';
            n = 3;
        }else if(n === 3){
            speakOutput = 'No es buena idea jugar con cosas ajenas. ';
            n = 0;
        }
        conv.washingRoomClue = n;
        return speakOutput;
    }
    
}