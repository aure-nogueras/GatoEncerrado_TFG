let room = 'habitación';

// Objects in the room
let objectsRoom = [];
        
// Objects in the floor of the rooms
let floorObjectsRoom = [];

// Array with accomplished interactions with the objects of the rooms
let roomElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects = new Map();

// Variable that indicates if there is enough light to explore the room
let light; 

// Points in this room
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

module.exports = {
    initialize(){
        light = false;
        objectsRoom = ['llave', 'martillo', 'comida de gato', 'silla'];
        floorObjectsRoom = ['silla'];
        canTakeObjects.set('llave',false);
        canTakeObjects.set('martillo',false);
        canTakeObjects.set('comida de gato',false);
        canTakeObjects.set('silla',true);
        roomElements = [];
        points = 0;
        firstTime = true;
        dead = false;
        finished = false;
    },
    getRoom(){
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
    interaction(object){
        let speechText = '';
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
                    roomElements.push('interruptor');
                    points += 10;
                }else{
                    speechText = 'Ya has pulsado el interruptor. A diferencia de los gatos no puedes ver en la oscuridad, así que mejor no pulsarlo de nuevo.'
                }
                break;
            case 'lámpara':
                speechText = 'La lámpara está muy alta y no puedes verla bien.' 
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
                    if(/*inventory.indexOf('comida de gato') === -1 &&*/ floorObjectsRoom.indexOf('comida de gato') === -1 && objectsRoom.indexOf('comida de gato') !== -1){
                        speechText += ' Al fondo hay comida de gato. Desde luego es un sitio curioso para guardarla. Puedes elegir entre comer o guardar la comida.'
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
                    speechText = 'La puerta está abierta.';    
                }
                break;
            case 'estantería':
                speechText = 'La estantería tiene dos baldas. En la primera solo hay ropa, y en la segunda hay una pequeña trampilla.'
                break;
            case 'armario':
                speechText = 'El armario no es muy grande. Puedes ver una estantería y bastante polvo. A parte de eso, está bastante vacío.'
                break;
            case 'almohada':
                if(/*inventory.indexOf('martillo') === -1 &&*/ floorObjectsRoom.indexOf('martillo') === -1 && objectsRoom.indexOf('martillo') !== -1){
                    speechText = 'La almohada está algo abultada. La levantas y debajo encuentras un martillo. ¿Quién pone un martillo debajo de su almohada mientras duerme?'
                    canTakeObjects.set('martillo',true);
                }else{
                    speechText = 'Solo es una almohada. No hay nada más.'
                }
                break;
            case 'cajón':
                speechText = 'El cajón está vacío.'
                break;
            case 'escritorio':
                speechText = 'Encima del escritorio hay unos cuantos papeles, pero nada interesante. En un lateral hay un cajón.'
                break;
            case 'cuadro':
                if(/*inventory.indexOf('llave') === -1 &&*/ floorObjectsRoom.indexOf('llave') === -1 && objectsRoom.indexOf('llave') !== -1){
                    speechText = "<speak>"
                    + "Es un cuadro de la Alhambra. Está un poco descolgado."
                    + "<audio src='soundbank://soundlibrary/metal/metal_12'/>"
                    + "Te acercas a ponerlo bien y se cae una llave al suelo."
                    + "</speak>"
                    canTakeObjects.set('llave',true);
                    floorObjectsRoom.push('llave');
                    points += 10;
                }else{
                    speechText = 'El cuadro sigue descolgado, pero ya no hay nada detrás de él.';
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
        return {
            speechText: speechText,
            points: points
        }
    },
    take(item){
        let speechText = '';
        points = 0;
        if(objectsRoom.indexOf(item) !== -1 && canTakeObjects.get(item) === true){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'comida de gato' && firstTime === true){
                points += 20;
                firstTime = false;
            }
            canTakeObjects.set(item,false)
            let index = objectsRoom.indexOf(item)
            objectsRoom.splice(index,1)
            if(floorObjectsRoom.indexOf(item) !== -1){
                let index2 = floorObjectsRoom.indexOf(item)
                floorObjectsRoom.splice(index2,1)
            }
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    release(item){
        let speechText = 'Has puesto ' + item + ' en ' + room; 
        objectsRoom.push(item);
        floorObjectsRoom.push(item);
        canTakeObjects.set(item,true);
        return speechText;
    },
    use(object, element){
        points = 0;
        let speakOutput = '';
        if(object === 'silla' && element === 'lámpara'){
            speakOutput = 'Te subes a la silla y te asomas para ver lo que hay dentro de la lámpara, pero no hay nada.';
            points+=10;
        }
        if(object === 'martillo' && element === 'trampilla'){
            if(roomElements.indexOf('trampilla') === -1){
                speakOutput = "<speak>" +
                'Rompes la trampilla con la ayuda del martillo.' 
                + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                + 'Ves algo al fondo. Un momento... ¿Eso es comida de gato? Qué raro, tú nunca has tenido un gato...'
                + 'Puedes guardar o comer la comida.'
                + "</speak>"; 
                canTakeObjects.set('comida de gato',true);
                roomElements.push('trampilla');
                points+=10;
            }else{
                speakOutput = 'La trampilla está rota. '
                if(/*inventory.indexOf('comida de gato') === -1 && */floorObjectsRoom.indexOf('comida de gato') === -1 && objectsRoom.indexOf('comida de gato') !== -1){
                    speakOutput += 'Aún está la comida de gato al fondo. Puedes elegir comer o guardar la comida.';
                }
            }
        }
        if(object === 'llave' && element === 'puerta'){
            if(roomElements.indexOf('puerta') === -1){
                points+=10;
                speakOutput = "<speak>"
                + "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                + '<say-as interpret-as="interjection">bingo</say-as>'
                + '<break time = "0.5s" />'
                + ' ¡La puerta se ha abierto!';
                this.initialize();
                roomElements.push('puerta');
                finished = true;
            }else{
                speakOutput = 'La puerta está ya abierta.';
            }
        }
        if(object === 'martillo' && element === 'ventana'){
            if(roomElements.indexOf('ventana') === -1){
                points -= 20;
                speakOutput = "<speak>"
                + "<audio src='soundbank://soundlibrary/glass/break_shatter_smash/break_shatter_smash_04'/>"
                + 'Has roto la ventana con tan mala suerte que pierdes el equilibrio y te precipitas por ella.'
                + '<break time = "0.5s" />';
                roomElements.push('ventana');
                this.initialize();
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
    clue(){
        let speakOutput = 'Ese cuadro puede tener algo que te interesa además de ser tan bonito.';
        return speakOutput;
    },
    choose(option){
        points = 0;
        let speakOutput = '';
        let take = false;
        if(roomElements.indexOf('trampilla') !== -1 && canTakeObjects.get('comida de gato') === true && objectsRoom.indexOf('comida de gato') !== -1 /*&& inventory.indexOf('comida de gato') === -1*/ && floorObjectsRoom.indexOf('comida de gato') === -1){
            if(option === 'comer'){
                speakOutput = 'La comida no te sienta muy bien y pierdes 20 puntos';
                points -= 20;
                canTakeObjects.set('comida de gato',false);
                let index = objectsRoom.indexOf('comida de gato');
                objectsRoom.splice(index,1);
            }else if(option === 'guardar'){
                take = true;
                //speakOutput = this.take('comida de gato').speechText;
            }
        }
        return{
            speakOutput: speakOutput,
            points: points,
            take: take
        }
    }
    
}