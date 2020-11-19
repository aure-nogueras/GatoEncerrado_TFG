// Objects in the room
let objectsRoom = [];
        
// Objects in the floor of the rooms
let floorObjectsRoom = [];

// Array with accomplished interactions with the objects of the rooms
let roomElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Variable that indicates if there is enough light to explore the room
let light; 

// Points in this room
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;
let firstUse;

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

// Number used to choose the clue
let n;

module.exports = {
    initialize(sessionAttributes){
        light = false;
        sessionAttributes['lightRoomEs'] = light;
        
        objectsRoom = ['llave', 'linterna', 'pilas', 'martillo', 'comida de gato', 'silla'];
        sessionAttributes['objectsRoomEs'] = objectsRoom;
        
        floorObjectsRoom = ['silla'];
        sessionAttributes['floorObjectsRoomEs'] = floorObjectsRoom;
        
        canTakeObjects = ['silla'];
        
        sessionAttributes['canTakeObjectsRoomEs'] = canTakeObjects;
        
        roomElements = [];
        sessionAttributes['roomElementsEs'] = roomElements;
        points = 0;
        
        firstTime = true;
        sessionAttributes['firstTimeRoomEs'] = firstTime;
        firstUse = true;
        sessionAttributes['firstUseRoomEs'] = firstUse;
        
        dead = false;
        finished = false;
        n = 0;
        sessionAttributes['roomClueEs'] = n;
    },
    continueGame(sessionAttributes){
        light = sessionAttributes['lightRoomEs'];
        
        objectsRoom = sessionAttributes['objectsRoomEs'];
        
        floorObjectsRoom = sessionAttributes['floorObjectsRoomEs'];
        
        canTakeObjects = sessionAttributes['canTakeObjectsRoomEs'];
         
        roomElements = sessionAttributes['roomElementsEs'];
    
        points = 0;
        
        firstTime = sessionAttributes['firstTimeRoomEs'];
        firstUse = sessionAttributes['firstUseRoomEs'];
        
        dead = sessionAttributes['deadEs'];
        finished = sessionAttributes['finishedEs'];
        n = sessionAttributes['roomClueEs'];
    },
    getRoom(){
        let room = 'habitación';
        return room;
    },
    look(orientation){
        let speechText = '';
        let url = '';
        if(light){
            switch(orientation){
                case 'norte':
                    speechText = 'Al norte está el interruptor que has pulsado y la puerta de la habitación.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/north_room.png';
                    break;
                case 'sur':
                    speechText = 'Al sur puedes ver un escritorio y una ventana.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/south_room.png';
                    break;
                case 'este':
                    speechText = 'Al este se encuentra la cama. En ella hay una almohada algo estropeada.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/east_room.png';
                    break;
                case 'oeste':
                    speechText = 'Al oeste hay un armario con estantes y un cuadro muy bonito.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/west_room.png';
                    break;
                case 'arriba':
                    speechText = 'Arriba está la lámpara que ilumina la habitación.';
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/up_room.png';
                    break;
                case 'abajo':
                    url = 'https://soundgato.s3.eu-west-3.amazonaws.com/down.png';
                    if(floorObjectsRoom.length === 0){
                        speechText = 'Abajo solo está el suelo. No hay nada interesante.';
                    }else{
                        speechText = 'En el suelo encuentras: ' + floorObjectsRoom;
                        if(floorObjectsRoom.indexOf('silla') !== -1){
                            url = 'https://soundgato.s3.eu-west-3.amazonaws.com/down_room.png'; 
                        }
                    }
                    break;
            }
        }else{
            speechText = 'La poca luz que entra por la ventana te permite ver un interruptor en la pared...'; 
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
            case 'cama':
                speechText = 'Tu cama no tiene nada de especial. Las sábanas están algo sudadas.'
                break;
            case 'interruptor':
                if(!light){
                    speechText = 
                    "<speak>"
                    + "Parece el interruptor de la lámpara."
                    + "<audio src='soundbank://soundlibrary/switches_levers/switches_levers_01'/>"
                    + "Lo pulsas y se hace la luz. Ahora podrás explorar mejor la habitación."
                    + "</speak>";
                    light = true;
                    points += 10;
                    roomElements.push('interruptor');
                    sessionAttributes['roomElementsEs'] = roomElements;
                    sessionAttributes['lightRoomEs'] = true;
                }else{
                    speechText = 'Ya has pulsado el interruptor. A diferencia de los gatos no puedes ver en la oscuridad, así que mejor no pulsarlo de nuevo.'
                }
                break;
            case 'lámpara':
                if(floorObjectsRoom.indexOf('pilas') === -1 && objectsRoom.indexOf('pilas') !== -1){
                    speechText = 'La lámpara está muy alta y no puedes verla bien. Parece que hay algo en su interior.'
                }else{
                    speechText = 'La lámpara está muy alta y no puedes verla bien.' 
                }
                break;
            case 'trampilla':
                if(roomElements.indexOf('trampilla') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_glass/glass_06'/>"
                    + 'La trampilla está atascada. Quizás podría romperse con algo.'
                    + "</speak>"
                }else{
                    speechText = "Ya has roto la trampilla."
                    if(floorObjectsRoom.indexOf('comida de gato') === -1 && objectsRoom.indexOf('comida de gato') !== -1){
                        speechText += ' Al fondo hay comida de gato. Desde luego es un sitio curioso para guardarla. Puedes comértela o cogerla.';
                    }
                }
                break;
            case 'puerta':
                if(roomElements.indexOf('puerta') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                    + 'La puerta está cerrada. Habría sido demasiado fácil salir tan rápido.'
                    + "</speak>";
                }else{
                    speechText = 'La puerta está abierta y da paso a un pasillo.';    
                }
                break;
            case 'estantería':
                speechText = 'La estantería tiene dos baldas. En la primera solo hay ropa, y en la segunda hay una pequeña trampilla.'
                break;
            case 'armario':
                speechText = 'El armario no es muy grande. Puedes ver una estantería y bastante polvo. A parte de eso, está bastante vacío.'
                break;
            case 'almohada':
                if(floorObjectsRoom.indexOf('martillo') === -1 && objectsRoom.indexOf('martillo') !== -1){
                    speechText = 'La almohada está algo abultada. La levantas y debajo encuentras un martillo. ¿Quién pone un martillo debajo de su almohada mientras duerme?'
                    canTakeObjects.push('martillo');
                }else{
                    speechText = 'Solo es una almohada. No hay nada más.'
                }
                break;
            case 'cajón':
                if(floorObjectsRoom.indexOf('linterna') === -1 && objectsRoom.indexOf('linterna') !== -1){
                    speechText = 'Dentro del cajón hay una linterna. No tiene pilas. '
                    canTakeObjects.push('linterna');
                }else{
                    speechText = 'El cajón está vacío.'
                }
                break;
            case 'escritorio':
                speechText = 'Encima del escritorio hay unos cuantos papeles, pero nada interesante. En un lateral hay un cajón.'
                break;
            case 'cuadro':
                if(floorObjectsRoom.indexOf('llave') === -1 && objectsRoom.indexOf('llave') !== -1){
                    speechText = "<speak>"
                    + "Es un cuadro de la Alhambra. Está un poco descolgado."
                    + "<audio src='soundbank://soundlibrary/metal/metal_12'/>"
                    + "Te acercas a ponerlo bien y se cae una llave al suelo."
                    + "</speak>"
                    canTakeObjects.push('llave');
                    floorObjectsRoom.push('llave');
                    sessionAttributes['floorObjectsRoomEs'] = floorObjectsRoom;
                    points += 10;
                }else{
                    speechText = 'El cuadro sigue descolgado, pero ya no hay nada detrás de él.'
                }
                break;
            case 'ventana':
                if(roomElements.indexOf('ventana') === -1){
                    speechText = 'La ventana es de cristal. Quizás podría romperse con algo.';
                }else{
                    speechText = 'Has roto la ventana y te has caído por ella.'
                }
                break;
        }
        sessionAttributes['canTakeObjectsRoomEs'] = canTakeObjects;
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsRoom.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'comida de gato' && firstTime === true){
                points += 20;
                firstTime = false;
                sessionAttributes['firstTimeRoomEs'] = firstTime;
            }
            let i = canTakeObjects.indexOf(item);
            canTakeObjects.splice(i,1);
            sessionAttributes['canTakeObjectsRoomEs'] = canTakeObjects;
            let index = objectsRoom.indexOf(item)
            objectsRoom.splice(index,1)
            sessionAttributes['objectsRoomEs'] = objectsRoom;
            if(floorObjectsRoom.indexOf(item) !== -1){
                let index2 = floorObjectsRoom.indexOf(item)
                floorObjectsRoom.splice(index2,1)
                sessionAttributes['floorObjectsRoomEs'] = floorObjectsRoom;
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
        objectsRoom.push(item);
        floorObjectsRoom.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsRoomEs'] = canTakeObjects;
        sessionAttributes['floorObjectsRoomEs'] = floorObjectsRoom;
        sessionAttributes['objectsRoomEs'] = objectsRoom;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = 'No puedes hacer eso.';
        if(object === 'silla' && element === 'lámpara'){
            if(floorObjectsRoom.indexOf('pilas') === -1 && objectsRoom.indexOf('pilas') !== -1){
                speakOutput = 'Te subes a la silla y te asomas para ver lo que hay dentro de la lámpara. Ves unas pilas.';
                canTakeObjects.push('pilas');
                sessionAttributes['canTakeObjectsRoomEs'] = canTakeObjects;
            }else{
                speakOutput = 'Te subes a la silla y te asomas para ver lo que hay dentro de la lámpara, pero no hay nada.';
            }
            if(firstUse){
                points+=10;
                firstUse = false;
                sessionAttributes['firstUseRoomEs'] = firstUse;
            }
        }
        if(object === 'martillo' && element === 'trampilla'){
            if(roomElements.indexOf('trampilla') === -1){
                speakOutput = 
                'Rompes la trampilla con la ayuda del martillo.' 
                + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                + 'Ves algo al fondo. Un momento... ¿Eso es comida de gato? Qué raro, tú nunca has tenido un gato...'
                + 'Puedes guardar o comer la comida.'; 
                canTakeObjects.push('comida de gato');
                sessionAttributes['canTakeObjectsRoomEs'] = canTakeObjects;
                roomElements.push('trampilla');
                sessionAttributes['roomElementsEs'] = roomElements;
                points+=10;
            }else{
                speakOutput = 'La trampilla está rota. '
                if(floorObjectsRoom.indexOf('comida de gato') === -1 && objectsRoom.indexOf('comida de gato') !== -1){
                    speakOutput += 'Aún está la comida de gato al fondo. Puedes elegir comer o guardar la comida.';
                }
            }
        }
        if(object === 'llave' && element === 'puerta'){
            if(roomElements.indexOf('puerta') === -1){
                points+=10;
                speakOutput = "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                + '<say-as interpret-as="interjection">bingo</say-as>'
                + '<break time = "0.5s" />'
                + ' ¡La puerta se ha abierto! Delante ves un pasillo oscuro.';
                roomElements.push('puerta');
                sessionAttributes['roomElementsEs'] = roomElements;
            }else{
                speakOutput = 'La puerta está ya abierta.';
            }
        }
        if(object === 'martillo' && element === 'ventana'){
            if(roomElements.indexOf('ventana') === -1){
                points -= 20;
                speakOutput = 
                " <audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/> "
                + 'Has roto la ventana con tan mala suerte que pierdes el equilibrio y te precipitas por ella.'
                + '<break time = "0.5s" />';
                roomElements.push('ventana');
                sessionAttributes['roomElementsEs'] = roomElements;
                dead = true;
                finished = true;
            }else{
                speakOutput = 'La ventana ya está rota.';
            }
        }
        return{
            speakOutput: speakOutput,
            dead: dead,
            finished: finished,
            points: points
        }        
    },
    go(place){
        let speakOutput = 'No puedes ir ahí.';
        let r = 'habitación';
        
        if(place === 'pasillo' && roomElements.indexOf('puerta') !== -1){
            speakOutput = 'Ahora estás en el pasillo.';
            r = 'pasillo';
        }
        
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = 'Ese cuadro puede tener algo que te interesa además de ser tan bonito.';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Puede que no sea buena idea acercarse mucho a esa ventana.';
            n = 2;
        }else if(n === 2){
            speakOutput = 'La comida de gato no te suele sentar bien...';
            n = 0;
        }
        sessionAttributes['roomClueEs'] = n;
        return speakOutput;
    },
    choose(option, sessionAttributes){
        points = 0;
        let speakOutput = 'Esa acción ya no es posible.';
        if(roomElements.indexOf('trampilla') !== -1 && canTakeObjects.indexOf('comida de gato') !== -1 && objectsRoom.indexOf('comida de gato') !== -1 && floorObjectsRoom.indexOf('comida de gato') === -1){
            if(option === 'comer'){
                speakOutput = 'La comida no te sienta muy bien y pierdes 20 puntos';
                points -= 20;
                let i = canTakeObjects.indexOf('comida de gato');
                canTakeObjects.splice(i,1)
                sessionAttributes['canTakeObjectsRoomEs'] = canTakeObjects;
                let index = objectsRoom.indexOf('comida de gato');
                objectsRoom.splice(index,1);
                sessionAttributes['objectsRoomEs'] = objectsRoom;
            }
        }
        return{
            speak: speakOutput,
            points: points
        }
    }
    
}