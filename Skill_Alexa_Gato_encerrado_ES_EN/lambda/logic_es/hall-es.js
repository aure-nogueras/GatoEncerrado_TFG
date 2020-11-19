// Objects in the room
let objectsHall = [];
        
// Objects in the floor of the room
let floorObjectsHall = [];

// Array with accomplished interactions with the objects of the room
let hallElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;

// Number used to choose the clue
let n;

// Boolean to know if the game has been finished
let finished;

module.exports = {
    initialize(sessionAttributes){
        objectsHall = ['veneno', 'llave dorada', 'gato'];
        floorObjectsHall = [];
        hallElements = [];
        canTakeObjects = [];
        finished = false;
        firstTime = true;
        points = 0;
        n = 0;
        
        sessionAttributes['objectsHallEs'] = objectsHall;
        sessionAttributes['floorObjectsHallEs'] = floorObjectsHall;
        sessionAttributes['hallElementsEs'] = hallElements;
        sessionAttributes['canTakeObjectsHallEs'] = canTakeObjects;
        sessionAttributes['firstTimeHallEs'] = firstTime;
        sessionAttributes['hallClueEs'] = n;
    },
    continueGame(sessionAttributes){
        objectsHall = sessionAttributes['objectsHallEs'];
        floorObjectsHall = sessionAttributes['floorObjectsHallEs'];
        hallElements = sessionAttributes['hallElementsEs'];
        canTakeObjects = sessionAttributes['canTakeObjectsHallEs'];
        finished = sessionAttributes['finishedEs'];
        firstTime = sessionAttributes['firstTimeHallEs'];
        points = 0;
        n = sessionAttributes['hallClueEs'];
    },
    getRoom(){
        let room = 'recibidor';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'norte':
                speechText = 'Al fondo ves una puerta muy grande.';
                break;
            case 'sur':
                speechText = 'Al sur está la habitación secreta.'
                break;
            case 'este':
                speechText = 'A la derecha hay una mesa.'
                break;
            case 'oeste':
                speechText = 'A la izquierda ves un cuadro colgado en la pared.'
                break;
            case 'arriba':
                speechText = 'Arriba solo está el techo. Nada de interés. Curiosamente, la habitación está iluminada, pero no hay lámpara ni ventanas por las que pueda entrar.' 
                break;
            case 'abajo':
                if(floorObjectsHall.length === 0){
                    speechText = 'El suelo está cubierto de un líquido viscoso. Parece vómito. ¡Oh, no! Junto a ese charco ves el cuerpo sin vida de un gato blanco. '
                }else{
                    speechText = 'El suelo está cubierto de un líquido viscoso. Parece vómito. ¡Oh, no! Junto a ese charco ves el cuerpo sin vida de un gato blanco. Además, en el suelo encuentras: ' + floorObjectsHall;
                }
                break;
        }
        return speechText;
    },
    interaction(object, sessionAttributes){
        let speechText = 'No ves interés en hacer eso.';
        points = 0;
        switch(object){
            case 'puerta':
                if(hallElements.indexOf('puerta') === -1){
                    speechText = 
                    "<speak>"
                    + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                    + 'La puerta está cerrada.'
                    + "</speak>";
                }else{
                    speechText = 'La puerta está abierta.';    
                }
                break;
            case 'mesa':
                speechText = 'Te acercas a la mesa y ves un montón de papeles. Uno de ellos es una ficha de un gato. La lees con detenimiento. Nombre: Blanquito, Edad: 3 años, Alergias: atún.'
                break;
            case 'cuadro':
                if(hallElements.indexOf('cuadro') === -1){
                    speechText = 'Es un cuadro de un gato blanco. Tiene las pupilas dilatadas y la imagen parece suplicarte que lo acaricies. '
                    + '<audio src="soundbank://soundlibrary/horror/horror_04"/>'
                    + 'El fantasma que viste antes emerge del cuadro y se sitúa frente a ti. Es el gato del cuadro, el gato que yace en el suelo. '
                    + 'Te mira con intriga y deja caer algo al suelo: un frasco de veneno. Tienes dos opciones: derramarlo o bebértelo. '
                    + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_meow_1x_01"/>';
                    hallElements.push('cuadro');
                    floorObjectsHall.push('veneno');
                    canTakeObjects.push('veneno');
                    sessionAttributes['canTakeObjectsHallEs'] = canTakeObjects;
                    sessionAttributes['floorObjectsHallEs'] = floorObjectsHall;
                    sessionAttributes['hallElementsEs'] = hallElements;
                    points += 10;
                }else{
                    speechText = 'Es un cuadro de un gato blanco con las pupilas dilatadas. Parece pedirte que lo acaricies aunque solo se trate de una imagen.'
                }
                break;
            case 'cadáver':
                speechText = 'Es el cadáver de un gato. Parece llevar algún tiempo ahí. El vómito del suelo parece haber sido atún en algún momento. Pobre gatito. Sin duda alguien lo envenenó.';
                break;
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsHall.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsHall.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsHallEs'] = canTakeObjects;
            let index = objectsHall.indexOf(item)
            objectsHall.splice(index,1)
            sessionAttributes['objectsHallEs'] = objectsHall;
            if(item === 'gato' && firstTime){
                points += 50;
                firstTime = false;
                sessionAttributes['firstTimeHallEs'] = firstTime;
            }
            if(floorObjectsHall.indexOf(item) !== -1){
                let index2 = floorObjectsHall.indexOf(item)
                floorObjectsHall.splice(index2,1)
                sessionAttributes['floorObjectsHallEs'] = floorObjectsHall;
            }
            success = true;
        }
        if(item === 'llave' && objectsHall.indexOf(item) === -1 && objectsHall.indexOf('llave dorada') !== -1){
            speechText += ' Quizás quisiste decir llave dorada.';
        }
        return {
            speechText: speechText,
            points: points,
            success: success
        }
    },
    release(item, sessionAttributes){
        let speechText = 'Has puesto ' + item + ' en el recibidor'; 
        objectsHall.push(item);
        floorObjectsHall.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsHallEs'] = canTakeObjects;
        sessionAttributes['floorObjectsHallEs'] = floorObjectsHall;
        sessionAttributes['objectsHallEs'] = objectsHall;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = 'No puedes hacer eso.';
        if(object === 'llave dorada' && element === 'puerta'){
            if(hallElements.indexOf('puerta') === -1){
                points+=10;
                speakOutput = "<audio src='soundbank://soundlibrary/doors/doors_squeaky/squeaky_02'/>"
                + '<say-as interpret-as="interjection">Eureka</say-as>'
                + '<break time = "0.5s" />'
                + ' ¡La puerta está abierta! Has conseguido escapar. ';
                hallElements.push('puerta');
                sessionAttributes['hallElementsEs'] = hallElements;
                finished = true;
            }else{
                speakOutput = 'La puerta está ya abierta.';
            }
        }
        return{
            speakOutput: speakOutput,
            finished: finished,
            points: points
        }        
    },
    go(place){
        let speakOutput = 'No puedes ir ahí.';
        let r = 'recibidor';
        
        if(place === 'habitación secreta'){
            speakOutput = 'Ahora estás en la habitación secreta.';
            r = 'habitación secreta';
        }
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = '¿Has mirado el cuadro? ';
            n = 1;
        }else if(n === 1){
            speakOutput = 'La opción menos lógica puede ser también la más acertada. ';
            n = 0;
        }
        sessionAttributes['hallClueEs'] = n;
        return speakOutput;
    },
    choose(option, sessionAttributes){
        points = 0;
        let speakOutput = '';
        if(hallElements.indexOf('cuadro') !== -1 && canTakeObjects.indexOf('veneno') !== -1 && objectsHall.indexOf('veneno') !== -1 && floorObjectsHall.indexOf('veneno') !== -1){
            if(option === 'beber'){
                speakOutput = 'Te bebes el veneno. El gato fantasma parece feliz de que te unas a él. Deja caer una llave dorada delante de ti. '
                + "<audio src='soundbank://soundlibrary/metal/metal_12'/>";
                points += 30;
                let i = canTakeObjects.indexOf('veneno')
                canTakeObjects.splice(i,1)
                let index = objectsHall.indexOf('veneno');
                objectsHall.splice(index,1);
                sessionAttributes['objectsHallEs'] = objectsHall;
                let index2 = floorObjectsHall.indexOf('veneno');
                floorObjectsHall.splice(index2,1);
                canTakeObjects.push('llave dorada');
                floorObjectsHall.push('llave dorada');
                canTakeObjects.push('gato');
                floorObjectsHall.push('gato');
                sessionAttributes['canTakeObjectsHallEs'] = canTakeObjects;
                sessionAttributes['floorObjectsHallEs'] = floorObjectsHall;
            }else if(option === 'derramar'){
                speakOutput = 'El gato fantasma se enfada contigo por rechazar su regalo. Él solo quería reunirse contigo. Empieza a gritar muy fuerte, enfadado. '
                + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_01"/>'
                + ' No lo soportas y te desmayas.'
                finished = true;
                sessionAttributes['deadEs'] = true;
                points -= 30;
            }
        }
        return{
            speakOutput: speakOutput,
            points: points,
            finished: finished
        }
    }
    
}