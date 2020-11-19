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
    initialize(sessionAttributes){
        objectsWashingRoom = ['ovillo de lana'];
        floorObjectsWashingRoom = [];
        washingRoomElements = [];
        canTakeObjects = [];
        points = 0;
        firstTime = true;
        wool = true;
        n = 0;
        
        sessionAttributes['objectsWashingRoomEs'] = objectsWashingRoom;
        sessionAttributes['floorObjectsWashingRoomEs'] = floorObjectsWashingRoom;
        sessionAttributes['canTakeObjectsWashingRoomEs'] = canTakeObjects;
        sessionAttributes['washingRoomElementsEs'] = washingRoomElements;
        sessionAttributes['firstTimeWashingMachineEs'] = firstTime;
        sessionAttributes['woolEs'] = wool;
        sessionAttributes['washingRoomClueEs'] = n;
    },
    continueGame(sessionAttributes){
        objectsWashingRoom = sessionAttributes['objectsWashingRoomEs'];
        floorObjectsWashingRoom = sessionAttributes['floorObjectsWashingRoomEs'];
        canTakeObjects = sessionAttributes['canTakeObjectsWashingRoomEs'];
        washingRoomElements = sessionAttributes['washingRoomElementsEs'];
        firstTime = sessionAttributes['firstTimeWashingMachineEs'];
        wool = sessionAttributes['woolEs'];
        points = 0;
        n = sessionAttributes['washingRoomClueEs'];
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
    interaction(object, dryer, sessionAttributes){
        let speechText = 'No ves interés en hacer eso. ';
        let r = 'sala de lavadoras';
        points = 0;
        let url = '';
        switch(object){
                case 'lavadora':
                    speechText = 'Es una lavadora antigua, un poco oxidada. No hay nada más de interés en ella.'
                    break;
                case 'secadora':
                    if(floorObjectsWashingRoom.indexOf('ovillo de lana') === -1 && objectsWashingRoom.indexOf('ovillo de lana') !== -1){
                        if(dryer){
                            speechText = 'Se trata de una secadora que está parada. Parece que el interruptor del pasillo servía para detenerla. Te acercas y ves algo en su interior. Espera, ¿eso es un ovillo de lana? A lo mejor has sido un gato en otra vida. Puedes guardarlo o jugar con él.'
                            canTakeObjects.push('ovillo de lana');
                            sessionAttributes['canTakeObjectsWashingRoomEs'] = canTakeObjects;
                        }else{
                            speechText = 'La secadora está en movimiento. Deberías pararla para ver lo que tiene dentro.'
                        }
                    }else{
                        speechText = 'Ya no hay nada dentro de la secadora.'
                    }
                    break;
                case 'puerta de cristal':
                    if(washingRoomElements.indexOf('puerta de cristal') === -1){
                        speechText = 'La puerta de cristal está atascada y no puede abrirse.'
                    }else{
                        speechText = 'La puerta de cristal está rota y ves un baño.' 
                    }
                    break;
                case 'puerta con cerrojo':
                    if(washingRoomElements.indexOf('puerta con cerrojo') === -1){
                        speechText = "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                        + 'La puerta está cerrada. Tiene un cerrojo que está atornillado a la puerta.';
                    }else{
                        speechText = 'La puerta está abierta y el cerrojo desatornillado. Delante tienes un patio interior.';    
                    }
                    break;
                case 'cerrojo':
                    if(washingRoomElements.indexOf('puerta con cerrojo') === -1){
                        speechText = 'Es un cerrojo atornillado a la puerta.'; 
                    }else{
                        speechText = 'El cerrojo está desatornillado.';
                    }
                    break;
                case 'puerta':
                    speechText = 'Debes indicar cuál de las puertas quieres examinar, la de la derecha o con cerrojo, o la de la izquierda o de cristal.'
                    break;
                case 'teléfono':
                    speechText = 'Es un teléfono antiguo, anclado en la pared. Lo coges y escuchas algo al otro lado: '
                    + "<voice name='Enrique'> Tengo mucha hambre, un apetito felino diría yo. "
                    + 'Más vale que te des prisa.'
                    + '</voice> '
                    + ' Te parece tan extraño lo que has oído que lo apuntas en un papel que has encontrado en tu bolsillo y lo guardas en tu inventario. ';    
                    break;
                case 'pared':
                    speechText = 'La pared tiene una textura muy extraña. Casi parece como si pudiera atravesarse. Te acercas y... la atraviesas. '
                    + '<audio src="soundbank://soundlibrary/horror/horror_04"/> ¿Qué ha sido eso? Miras a tu alrededor y estás en una especie de cocina. '
                    + 'La pared se ha cerrado detrás de ti y ya no puedes volver atrás. Sin duda, no recuerdas que tu casa hiciera esto.';
                    r = 'cocina';
                    url = "https://soundgato.s3.eu-west-3.amazonaws.com/kitchen.jpg";
                    break;
                case 'claraboya':
                    speechText = 'La claraboya deja entrar mucha luz. Sin duda es la habitación más luminosa en la que has estado de momento.';   
                    break;
            }
        return {
            speechText: speechText,
            points: points,
            room: r,
            url: url
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsWashingRoom.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsWashingRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'ovillo de lana' && firstTime === true){
                points += 20;
                firstTime = false;
                sessionAttributes['firstTimeWashingMachineEs'] = firstTime;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsWashingRoomEs'] = canTakeObjects;
            let index = objectsWashingRoom.indexOf(item)
            objectsWashingRoom.splice(index,1)
            sessionAttributes['objectsWashingRoomEs'] = objectsWashingRoom;
            if(floorObjectsWashingRoom.indexOf(item) !== -1){
                let index2 = floorObjectsWashingRoom.indexOf(item);
                floorObjectsWashingRoom.splice(index2,1);
                sessionAttributes['floorObjectsWashingRoomEs'] = floorObjectsWashingRoom;
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
        objectsWashingRoom.push(item);
        floorObjectsWashingRoom.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsWashingRoomEs'] = canTakeObjects;
        sessionAttributes['floorObjectsWashingRoomEs'] = floorObjectsWashingRoom;
        sessionAttributes['objectsWashingRoomEs'] = objectsWashingRoom;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = 'No puedes hacer eso.';
        if(object === 'martillo' && element === 'puerta de cristal'){
            if(washingRoomElements.indexOf('puerta de cristal') === -1){
                speakOutput = 
                    'Rompes la puerta de cristal con el martillo.' 
                    + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                    + 'Delante de ti ves un baño.'; 
                washingRoomElements.push('puerta de cristal');
                sessionAttributes['washingRoomElementsEs'] = washingRoomElements;
                points += 10;
            }else{
                speakOutput = 'La puerta de cristal está rota. Puedes acceder al baño. '
            }
        } 
        if(object === 'destornillador' && element === 'puerta con cerrojo'){
            if(washingRoomElements.indexOf('puerta con cerrojo') === -1){
                speakOutput = "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                    + '<say-as interpret-as="interjection">genial</say-as>'
                    + '<break time = "0.5s" />'
                    + ' ¡La puerta se ha abierto! Detrás de la puerta hay un patio interior.';
                washingRoomElements.push('puerta con cerrojo');
                sessionAttributes['washingRoomElementsEs'] = washingRoomElements;
                points += 10;
            }else{
                speakOutput = 'La puerta con cerrojo está abierta y te deja ver un patio interior. '
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
    getEnterSpeak(sessionAttributes){
        let speakOutput = '';
        if(washingRoomElements.indexOf('teléfono') === -1){
            speakOutput = '<audio src="soundbank://soundlibrary/telephones/modern_rings/modern_rings_01"/>'
            + ' Oyes un teléfono. Quizás deberías ver quién llama. Espera... ¿qué es eso? ' 
            + 'Acabas de ver algo que ha... ¿atravesado la pared?'
            washingRoomElements.push('teléfono');
            sessionAttributes['washingRoomElementsEs'] = washingRoomElements;
        }
        return speakOutput;
    },
    choose(option, dryer, sessionAttributes){
        points = 0;
        let speakOutput = 'Esa acción ya no es posible.';
        if(dryer && canTakeObjects.indexOf('ovillo de lana') !== -1 && objectsWashingRoom.indexOf('ovillo de lana') !== -1 && floorObjectsWashingRoom.indexOf('ovillo de lana') === -1){
            if(option === 'jugar'){
                speakOutput = 'Juegas con el ovillo y se deshace. Ahora no podrás cogerlo. Pierdes 20 puntos. ';
                points -= 20;
                let i = canTakeObjects.indexOf('ovillo de lana')
                canTakeObjects.splice(i,1)
                sessionAttributes['canTakeObjectsWashingRoomEs'] = canTakeObjects;
                floorObjectsWashingRoom.push('ovillo de lana');
                sessionAttributes['floorObjectsWashingRoomEs'] = floorObjectsWashingRoom;
                wool = false;
                sessionAttributes['woolEs'] = wool;
            }
        }
        return{
            speak: speakOutput,
            points: points
        }
    },
    clue(sessionAttributes){
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
        sessionAttributes['washingRoomClueEs'] = n;
        return speakOutput;
    }
    
}