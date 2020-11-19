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
    initialize(conv){
        light = false;
        conv.lightRoom = light;
        
        objectsRoom = ['llave', 'linterna', 'pilas', 'martillo', 'comida de gato', 'silla'];
        conv.objectsRoom = objectsRoom;
        
        floorObjectsRoom = ['silla'];
        conv.floorObjectsRoom = floorObjectsRoom;
        
        canTakeObjects = ['silla'];
        
        conv.canTakeObjectsRoom = canTakeObjects;
        
        roomElements = [];
        conv.roomElements = roomElements;
        points = 0;
        
        firstTime = true;
        conv.firstTimeRoom = firstTime;
        firstUse = true;
        conv.firstUseRoom = firstUse;
        
        dead = false;
        finished = false;
        n = 0;
        conv.roomClue = n;
    },
    continueGame(conv){
        light = conv.lightRoom;
        
        objectsRoom = conv.objectsRoom;
        
        floorObjectsRoom = conv.floorObjectsRoom;
        
        canTakeObjects = conv.canTakeObjectsRoom;
         
        roomElements = conv.roomElements;
    
        points = 0;
        
        firstTime = conv.firstTimeRoom;
        firstUse = conv.firstUseRoom;
        
        dead = conv.dead;
        finished = conv.finished;
        n = conv.roomClue;
    },
    getRoom(){
        let room = 'habitación';
        return room;
    },
    look(orientation){
        let speechText = '';
        if(light){
            switch(orientation){
                case 'norte':
                    speechText = 'Al norte está el interruptor que has pulsado y la puerta de la habitación.'
                    break;
                case 'sur':
                    speechText = 'Al sur puedes ver un escritorio y una ventana.'
                    break;
                case 'este':
                    speechText = 'Al este se encuentra la cama. En ella hay una almohada algo estropeada.'
                    break;
                case 'oeste':
                    speechText = 'Al oeste hay un armario con estantes y un cuadro muy bonito.'
                    break;
                case 'arriba':
                    speechText = 'Arriba está la lámpara que ilumina la habitación.'
                    break;
                case 'abajo':
                    if(floorObjectsRoom.length === 0){
                        speechText = 'Abajo solo está el suelo. No hay nada interesante.'
                    }else{
                        speechText = 'En el suelo encuentras: ' + floorObjectsRoom;
                    }
                    break;
            }
        }else{
            speechText = 'La poca luz que entra por la ventana te permite ver un interruptor en la pared...'; 
        }
        return speechText;
    },
    interaction(object, conv){
        let speechText = 'No ves interés en hacer eso. Dime qué quieres hacer ahora. ';
        points = 0;
        switch(object){
            case 'cama':
                speechText = 'Tu cama no tiene nada de especial. Las sábanas están algo sudadas. Dime qué quieres hacer ahora.  '
                break;
            case 'interruptor':
                if(!light){
                    speechText = 
                    "<speak>"
                    + "Parece el interruptor de la lámpara."
                    + "<audio src='https://actions.google.com/sounds/v1/doors/deadbolt_lock.ogg'/>"
                    + "Lo pulsas y se hace la luz. Ahora podrás explorar mejor la habitación."
                    + 'Dime qué quieres hacer ahora.  '
                    + "</speak>";
                    light = true;
                    points += 10;
                    roomElements.push('interruptor');
                    conv.roomElements = roomElements;
                    conv.lightRoom = true;
                }else{
                    speechText = 'Ya has pulsado el interruptor. A diferencia de los gatos no puedes ver en la oscuridad, así que mejor no pulsarlo de nuevo. Dime qué quieres hacer ahora.  '
                }
                break;
            case 'lámpara':
                if(floorObjectsRoom.indexOf('pilas') === -1 && objectsRoom.indexOf('pilas') !== -1){
                    speechText = 'La lámpara está muy alta y no puedes verla bien. Parece que hay algo en su interior.'
                }else{
                    speechText = 'La lámpara está muy alta y no puedes verla bien.' 
                }
                speechText += ' Dime qué quieres hacer ahora.  '
                break;
            case 'trampilla':
                if(roomElements.indexOf('trampilla') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster.ogg'/>"
                    + 'La trampilla está atascada. Quizás podría romperse con algo. Dime qué quieres hacer ahora.  '
                    + "</speak>"
                }else{
                    speechText = "Ya has roto la trampilla."
                    if(floorObjectsRoom.indexOf('comida de gato') === -1 && objectsRoom.indexOf('comida de gato') !== -1){
                        speechText += ' Al fondo hay comida de gato. Desde luego es un sitio curioso para guardarla. Puedes comértela o cogerla.  ';
                    }
                    speechText += ' Dime qué quieres hacer ahora. ';
                }
                break;
            case 'puerta':
                if(roomElements.indexOf('puerta') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='https://actions.google.com/sounds/v1/impacts/dumpster_door_hit.ogg'/>"
                    + 'La puerta está cerrada. Habría sido demasiado fácil salir tan rápido.'
                    + ' Dime qué quieres hacer ahora.  '
                    + "</speak>";
                }else{
                    speechText = 'La puerta está abierta y da paso a un pasillo. Dime qué quieres hacer ahora.  ';    
                }
                break;
            case 'estantería':
                speechText = 'La estantería tiene dos baldas. En la primera solo hay ropa, y en la segunda hay una pequeña trampilla. Dime qué quieres hacer ahora.  '
                break;
            case 'armario':
                speechText = 'El armario no es muy grande. Puedes ver una estantería y bastante polvo. A parte de eso, está bastante vacío. Dime qué quieres hacer ahora.  '
                break;
            case 'almohada':
                if(floorObjectsRoom.indexOf('martillo') === -1 && objectsRoom.indexOf('martillo') !== -1){
                    speechText = 'La almohada está algo abultada. La levantas y debajo encuentras un martillo. ¿Quién pone un martillo debajo de su almohada mientras duerme? Dime qué quieres hacer ahora.  '
                    canTakeObjects.push('martillo');
                }else{
                    speechText = 'Solo es una almohada. No hay nada más. Dime qué quieres hacer ahora.  '
                }
                break;
            case 'cajón':
                if(floorObjectsRoom.indexOf('linterna') === -1 && objectsRoom.indexOf('linterna') !== -1){
                    speechText = 'Dentro del cajón hay una linterna. No tiene pilas. Dime qué quieres hacer ahora.  '
                    canTakeObjects.push('linterna');
                }else{
                    speechText = 'El cajón está vacío. Dime qué quieres hacer ahora.  '
                }
                break;
            case 'escritorio':
                speechText = 'Encima del escritorio hay unos cuantos papeles, pero nada interesante. En un lateral hay un cajón. Dime qué quieres hacer ahora.  '
                break;
            case 'cuadro':
                if(floorObjectsRoom.indexOf('llave') === -1 && objectsRoom.indexOf('llave') !== -1){
                    speechText = "Es un cuadro de la Alhambra. Está un poco descolgado."
                    + "Te acercas a ponerlo bien y se cae una llave al suelo. Dime qué quieres hacer ahora.  "
                    canTakeObjects.push('llave');
                    floorObjectsRoom.push('llave');
                    conv.floorObjectsRoom = floorObjectsRoom;
                    points += 10;
                }else{
                    speechText = 'El cuadro sigue descolgado, pero ya no hay nada detrás de él. Dime qué quieres hacer ahora.  '
                }
                break;
            case 'ventana':
                if(roomElements.indexOf('ventana') === -1){
                    speechText = 'La ventana es de cristal. Quizás podría romperse con algo. Dime qué quieres hacer ahora.  ';
                }else{
                    speechText = 'Has roto la ventana y te has caído por ella. Dime qué quieres hacer ahora.  '
                }
                break;
        }
        conv.canTakeObjectsRoom = canTakeObjects;
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
    take(item, conv){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsRoom.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'comida de gato' && firstTime === true){
                points += 20;
                firstTime = false;
                conv.firstTimeRoom = firstTime;
            }
            let i = canTakeObjects.indexOf(item);
            canTakeObjects.splice(i,1);
            conv.canTakeObjectsRoom = canTakeObjects;
            let index = objectsRoom.indexOf(item)
            objectsRoom.splice(index,1)
            conv.objectsRoom = objectsRoom;
            if(floorObjectsRoom.indexOf(item) !== -1){
                let index2 = floorObjectsRoom.indexOf(item)
                floorObjectsRoom.splice(index2,1)
                conv.floorObjectsRoom = floorObjectsRoom;
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
        objectsRoom.push(item);
        floorObjectsRoom.push(item);
        canTakeObjects.push(item);
        conv.canTakeObjectsRoom = canTakeObjects;
        conv.floorObjectsRoom = floorObjectsRoom;
        conv.objectsRoom = objectsRoom;
        return speechText;
    },
    use(object, element, conv){
        points = 0;
        let speakOutput = 'No puedes hacer eso. Dime qué quieres hacer ahora.  ';
        if(object === 'silla' && element === 'lámpara'){
            if(floorObjectsRoom.indexOf('pilas') === -1 && objectsRoom.indexOf('pilas') !== -1){
                speakOutput = 'Te subes a la silla y te asomas para ver lo que hay dentro de la lámpara. Ves unas pilas. Dime qué quieres hacer ahora.  ';
                canTakeObjects.push('pilas');
                conv.canTakeObjectsRoom = canTakeObjects;
            }else{
                speakOutput = 'Te subes a la silla y te asomas para ver lo que hay dentro de la lámpara, pero no hay nada. Dime qué quieres hacer ahora.  ';
            }
            if(firstUse){
                points+=10;
                firstUse = false;
                conv.firstUseRoom = firstUse;
            }
        }
        if(object === 'martillo' && element === 'trampilla'){
            if(roomElements.indexOf('trampilla') === -1){
                speakOutput = 
                '<speak> Rompes la trampilla con la ayuda del martillo.' 
                + "<audio src='https://actions.google.com/sounds/v1/impacts/small_glass_pane_shatter.ogg'/>"
                + 'Ves algo al fondo. Un momento... ¿Eso es comida de gato? Qué raro, tú nunca has tenido un gato...'
                + 'Puedes guardar o comer la comida. Dime qué quieres hacer ahora. </speak>'; 
                canTakeObjects.push('comida de gato');
                conv.canTakeObjectsRoom = canTakeObjects;
                roomElements.push('trampilla');
                conv.roomElements = roomElements;
                points+=10;
            }else{
                speakOutput = 'La trampilla está rota. Dime qué quieres hacer ahora.  '
                if(floorObjectsRoom.indexOf('comida de gato') === -1 && objectsRoom.indexOf('comida de gato') !== -1){
                    speakOutput += 'Aún está la comida de gato al fondo. Puedes elegir comer o guardar la comida. Dime qué quieres hacer ahora.  ';
                }
            }
        }
        if(object === 'llave' && element === 'puerta'){
            if(roomElements.indexOf('puerta') === -1){
                points+=10;
                speakOutput = "<speak> "
                +"<audio src='https://actions.google.com/sounds/v1/doors/wood_door_open.ogg'/>"
                + '<say-as interpret-as="interjection">bingo</say-as>'
                + '<break time = "0.5s" />'
                + ' ¡La puerta se ha abierto! Delante ves un pasillo oscuro. Dime qué quieres hacer ahora.</speak>';
                roomElements.push('puerta');
                conv.roomElements = roomElements;
            }else{
                speakOutput = 'La puerta está ya abierta. Dime qué quieres hacer ahora.  ';
            }
        }
        if(object === 'martillo' && element === 'ventana'){
            if(roomElements.indexOf('ventana') === -1){
                points -= 20;
                speakOutput = "<speak> "
                + "<audio src='https://actions.google.com/sounds/v1/impacts/crash.ogg'/> "
                + 'Has roto la ventana con tan mala suerte que pierdes el equilibrio y te precipitas por ella.'
                + '<break time = "0.5s" />';
                roomElements.push('ventana');
                conv.roomElements = roomElements;
                dead = true;
                finished = true;
            }else{
                speakOutput = 'La ventana ya está rota. Dime qué quieres hacer ahora.  ';
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
    clue(conv){
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
        conv.roomClue = n;
        return speakOutput;
    },
    choose(option, conv){
        points = 0;
        let speakOutput = 'Esa acción ya no es posible. Dime qué quieres hacer ahora.  ';
        if(roomElements.indexOf('trampilla') !== -1 && canTakeObjects.indexOf('comida de gato') !== -1 && objectsRoom.indexOf('comida de gato') !== -1 && floorObjectsRoom.indexOf('comida de gato') === -1){
            if(option === 'comer'){
                speakOutput = 'La comida no te sienta muy bien y pierdes 20 puntos. Dime qué quieres hacer ahora.  ';
                points -= 20;
                let i = canTakeObjects.indexOf('comida de gato');
                canTakeObjects.splice(i,1)
                conv.canTakeObjectsRoom = canTakeObjects;
                let index = objectsRoom.indexOf('comida de gato');
                objectsRoom.splice(index,1);
                conv.objectsRoom = objectsRoom;
            }
        }
        return{
            speak: speakOutput,
            points: points
        }
    }
    
}