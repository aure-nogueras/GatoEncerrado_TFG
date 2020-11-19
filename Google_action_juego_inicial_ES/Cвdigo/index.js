// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {dialogflow} = require ('actions-on-google');//

// Intents
const INVOCATION = 'Invocation'; 
const NEW_GAME = 'New Game';
const LOOK = 'Look Intent';
const INTERACTION = 'Interaction Intent';
const DEFAULT_INTERACTION = 'Default Interaction Intent';
const INVENTORY = 'Inventory Intent';
const TAKE = 'Take Intent';
const RELEASE = 'Release Intent';
const USE = 'Use Intent';
const WHERE = 'Where Intent';
const TELL_NAME = 'Tell Name';
const TELL_SCORE = 'Tell Score';
const CLUE = 'Clue Intent';
const CHOOSE = 'Choose Intent';
const HELP = 'Help Intent';

// Entities
const STILL_OBJECTS_ENTITY = 'StillObjects';
const ORIENTATION_ENTITY = 'Orientation';
const OBJECTS_ENTITY = 'Objects';
const ANY_ENTITY = 'any';
const NAME_ENTITY = 'name';
const CHOOSE_ENTITY = 'Choose';

const app = dialogflow(); 

// Variable that indicates if there is enough light to explore the room
let light;

// Inventory of the player
let inventory = [];

// Player
let points = '';
let name = '';

// Room
let room;

// Objects in the room
let objectsRoom = [];

// Objects in the floor of the rooms
let floorObjectsRoom = [];

// Array that indicates if an object can be taken 
let canTakeObjects = new Map();

// Array with accomplished interactions with the objects of the rooms
let roomElements = [];

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

// Boolean to know if it is the first time an object is taken
let firstTime;

function initialize(n){
    // Variable that indicates if there is enough light to explore the room
    light = false;
        
    // Inventory of the player
    inventory = [];
      
    // Player
    points = 0;
    name = n;
    dead = false;
      
    // Objects in the room
    objectsRoom = ['llave', 'martillo', 'comida de gato', 'silla'];
      
    // Objects in the floor of the rooms
    floorObjectsRoom = ['silla'];
      
    // Array that indicates if an object can be taken 
    canTakeObjects.set('llave',false);
    canTakeObjects.set('martillo',false);
    canTakeObjects.set('comida de gato',false);
    canTakeObjects.set('silla',true);
      
    // Array with accomplished interactions with the objects of the rooms
    roomElements = [];
     
    // Boolean to know if the game is over
    finished = false;
      
    // Boolean to know if it is the first time an object is taken
    firstTime = true;
      
    room = 'habitación';
}

function take (item){
	let speechText = 'No puedes coger ' + item;
        
    if((objectsRoom.indexOf(item) !== -1 && room === 'habitación') && canTakeObjects.get(item) === true){
        speechText = 'Has puesto ' + item + ' en el inventario.' ;
        if(item === 'comida de gato' && firstTime === true){
            points += 20;
            firstTime = false;
        }
        inventory.push(item);
        canTakeObjects.set(item,false);
        let index = objectsRoom.indexOf(item);
        objectsRoom.splice(index,1);
        if(floorObjectsRoom.indexOf(item) !== -1){
            let index2 = floorObjectsRoom.indexOf(item);
            floorObjectsRoom.splice(index2,1);
        }
    }
  	return speechText;
}

app.intent(INVOCATION, (conv) =>{
  	conv.ask('Bienvenido a tu aventura. Puedes elegir entre nuevo juego, reiniciar juego o ayuda. También puedes preguntar dónde estoy, cómo me llamo, cuántos puntos tengo o qué hay en el inventario para comprobar si tienes alguna partida anterior a medias.');
});

app.intent(NEW_GAME, (conv) =>{
  	const name = conv.parameters[NAME_ENTITY].toLowerCase();
    initialize(name);
	conv.ask('Te despiertas sudando, presa de una pesadilla. Parece que estuvieras en tu cama, en tu habitación, pero hay algo que no cuadra del todo. La poca luz que entra por la ventana te permite ver un interruptor en la pared...');
});

app.intent(TELL_NAME, (conv) =>{
    let speechText = 'Aún no tienes nombre';
    if(name !== ''){
        speechText = 'Te llamas ' + name;
    }
    conv.ask(speechText);
});

app.intent(TELL_SCORE, (conv) =>{
    let speechText = 'Tienes ' + points + ' puntos.';
    if(points === ''){
        speechText = 'Aún no tienes puntos.';
    }
    conv.ask(speechText);
});

app.intent(LOOK, (conv) =>{
    const orientation = conv.parameters[ORIENTATION_ENTITY].toLowerCase();
    let speechText = 'No puedes mirar nada porque no estás en ninguna habitación. ';
    if(light){
        switch(orientation){
            case 'norte':
                if(room === 'habitación'){
                    speechText = 'Al norte está el interruptor que has pulsado y la puerta de la habitación.';
                }
                break;
            case 'sur':
                if(room === 'habitación'){
                    speechText = 'Al sur puedes ver un escritorio y una ventana.';
                }
                break;
            case 'este':
                if(room === 'habitación'){
                    speechText = 'Al este se encuentra la cama. En ella hay una almohada algo estropeada.';
                }
                break;
            case 'oeste':
                if(room === 'habitación'){
                    speechText = 'Al oeste hay un armario con estantes y un cuadro muy bonito.';
                }
                break;
            case 'arriba':
                if(room === 'habitación'){
                    speechText = 'Arriba está la lámpara que ilumina la habitación.';
                }
                break;
            case 'abajo':
                if(room === 'habitación'){
                    if(floorObjectsRoom.length === 0){
                        speechText = 'Abajo solo está el suelo. No hay nada interesante.';
                    }else{
                        speechText = 'En el suelo encuentras: ' + floorObjectsRoom;
                    }
                }
                break;
        }
    }else{
        if(room === 'habitación'){
            speechText = 'La poca luz que entra por la ventana te permite ver un interruptor en la pared...'; 
        }
    }
    conv.ask(speechText);                 
});

app.intent(INTERACTION, (conv) =>{
  	const object = conv.parameters[STILL_OBJECTS_ENTITY].toLowerCase();
  	let speechText = 'No hay nada de interés en eso.';
    if(room === 'habitación'){
        switch(object){
        	case 'cama':
                speechText = 'Tu cama no tiene nada de especial. Las sábanas están algo sudadas.';
                break;
            case 'interruptor':
                if(!light){
                    speechText = "<speak>"
                    + "Parece el interruptor de la lámpara."
                    + "<audio src='https://actions.google.com/sounds/v1/office/button_push.ogg'/>"
                    + "Lo pulsas y se hace la luz. Ahora podrás explorar mejor la habitación."
                    + "</speak>";
                    light = true;
                    roomElements.push('interruptor');
                    points += 10;
                }else{
                    speechText = 'Ya has pulsado el interruptor. A diferencia de los gatos no puedes ver en la oscuridad, así que mejor no pulsarlo de nuevo.';
                }
                break;
            case 'lámpara':
                speechText = 'La lámpara está muy alta y no puedes verla bien.' ;
                break;
            case 'trampilla':
                if(roomElements.indexOf('trampilla') === -1){
                    speechText = 'La trampilla está atascada. Quizás podría romperse con algo.';
                }else{
                    speechText = "Ya has roto la trampilla.";
                    if(inventory.indexOf('comida de gato') === -1 && floorObjectsRoom.indexOf('comida de gato') === -1 && objectsRoom.indexOf('comida de gato') !== -1){
                        speechText += ' Al fondo hay comida de gato. Desde luego es un sitio curioso para guardarla. Puedes elegir entre comer o guardar la comida.';
                    }
                }
                break;
            case 'puerta':
                if(roomElements.indexOf('puerta') === -1){
                    speechText = 'La puerta está cerrada. Habría sido demasiado fácil salir tan rápido.';
                }else{
                    speechText = 'La puerta está abierta.';    
                }
                break;
            case 'estantería':
                speechText = 'La estantería tiene dos baldas. En la primera solo hay ropa, y en la segunda hay una pequeña trampilla.';
                break;
            case 'armario':
                speechText = 'El armario no es muy grande. Puedes ver una estantería y bastante polvo. A parte de eso, está bastante vacío.';
                break;
            case 'almohada':
                if(inventory.indexOf('martillo') === -1 && floorObjectsRoom.indexOf('martillo') === -1 && objectsRoom.indexOf('martillo') !== -1){
                    speechText = 'La almohada está algo abultada. La levantas y debajo encuentras un martillo. ¿Quién pone un martillo debajo de su almohada mientras duerme?';
                    canTakeObjects.set('martillo',true);
                }else{
                    speechText = 'Solo es una almohada. No hay nada más.';
                }
                break;
            case 'cajón':
                speechText = 'El cajón está vacío.';
                break;
            case 'escritorio':
                speechText = 'Encima del escritorio hay unos cuantos papeles, pero nada interesante. En un lateral hay un cajón.';
                break;
            case 'cuadro':
                if(inventory.indexOf('llave') === -1 && floorObjectsRoom.indexOf('llave') === -1 && objectsRoom.indexOf('llave') !== -1){
                    speechText = "Es un cuadro de la Alhambra. Está un poco descolgado. Te acercas a ponerlo bien y se cae una llave al suelo.";
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
                    speechText = 'Has roto la ventana y te has caído por ella.';
                }
        }
    }
	conv.ask(speechText);
});

app.intent(DEFAULT_INTERACTION, (conv) =>{
    const object = conv.parameters[ANY_ENTITY].toLowerCase();
    const speakOutput = 'No hay ' + object + ' o no hay nada que examinar en dicho objeto.';
    conv.ask(speakOutput);
}); 

app.intent(INVENTORY, (conv) =>{
    let speechText = '';
    if(inventory.length === 0){
        speechText = 'No tienes nada en el inventario.';
    }else{
        speechText = 'En el inventario tienes: ' + inventory;
    }
    conv.ask(speechText);
});  

app.intent(TAKE, (conv) =>{
    const item = conv.parameters[OBJECTS_ENTITY].toLowerCase();
    let speechText = take(item);
    conv.ask(speechText);
});   

app.intent(RELEASE, (conv) =>{
    const item = conv.parameters[OBJECTS_ENTITY].toLowerCase();
    let speechText = 'No puedes soltar ' + item;
          
    if(inventory.indexOf(item) !== -1){
        speechText = 'Has puesto ' + item + ' en ' + room; 
        if(room === 'habitación'){
            objectsRoom.push(item);
            floorObjectsRoom.push(item);
        }
        canTakeObjects.set(item,true);
        let index = inventory.indexOf(item);
        inventory.splice(index,1);
    }
    conv.ask(speechText);
});

app.intent(USE, (conv) =>{
    const object = conv.parameters[OBJECTS_ENTITY].toLowerCase();
    const element = conv.parameters[STILL_OBJECTS_ENTITY].toLowerCase();
    let speakOutput = 'No puedes hacer eso. Recuerda que para usar un objeto tienes que tenerlo en el inventario.';
        
    if(inventory.indexOf(object) !== -1){
        if(room === 'habitación'){
            if(object === 'silla' && element === 'lámpara'){
                speakOutput = 'Te subes a la silla y te asomas para ver lo que hay dentro de la lámpara, pero no hay nada.';
                points+=10;
            }
            if(object === 'martillo' && element === 'trampilla'){
                if(roomElements.indexOf('trampilla') === -1){
                  	canTakeObjects.set('comida de gato',true);
                    roomElements.push('trampilla');
                    points+=10;
                    speakOutput = 'Rompes la trampilla con la ayuda del martillo.' 
                    + 'Ves algo al fondo. Un momento... ¿Eso es comida de gato? Qué raro, tú nunca has tenido un gato...'
                    + 'Puedes guardar o comer la comida.';
                }else{
                    speakOutput = 'La trampilla está rota. ';
                    if(inventory.indexOf('comida de gato') === -1 && floorObjectsRoom.indexOf('comida de gato') === -1 && objectsRoom.indexOf('comida de gato') !== -1){
                        speakOutput += 'Aún está la comida de gato al fondo. Puedes elegir comer o guardar la comida.';
                    }
                }
            }
            if(object === 'llave' && element === 'puerta'){
                if(roomElements.indexOf('puerta') === -1){
                    points+=10;
                    speakOutput = "¡Bingo!"
                    + ' ¡La puerta se ha abierto! Tu puntuación ha sido de ' 
                    + points + ' puntos, ' + name;
                    initialize('');
                    roomElements.push('puerta');
                    finished = true;
                }else{
                    speakOutput = 'La puerta está ya abierta.';
                }
            }
            if(object === 'martillo' && element === 'ventana'){
                if(roomElements.indexOf('ventana') === -1){
                    points -= 20;
                    speakOutput = 'Has roto la ventana con tan mala suerte que pierdes el equilibrio y te precipitas por ella.'
                    + ' Estás muerto y tienes '
                    + points + ' puntos, ' + name;
                    roomElements.push('ventana');
                    initialize('');
                    dead = true;
                    finished = true;
                }else{
                    speakOutput = 'La ventana ya está rota.';
                }
            }
        }
    }
    conv.ask(speakOutput);
});

app.intent(WHERE, (conv) =>{
    let speakOutput = 'Estás en ' + room;
        
    if(room === ''){
        speakOutput = 'Aún no has empezado el juego';
    }
    conv.ask(speakOutput);
}); 

app.intent(CLUE, (conv) =>{
    let speakOutput = 'No puedo darte pistas porque aún no estás en ninguna habitación.';
        
    if(room === 'habitación'){
        speakOutput = 'Ese cuadro puede tener algo que te interesa además de ser tan bonito.';
        points -= 10;
    }
    conv.ask(speakOutput);
}); 

app.intent(CHOOSE, (conv) =>{
    const option = conv.parameters[CHOOSE_ENTITY].toLowerCase();
    let speakOutput = 'No es el momento de hacer eso.';
    if(room === 'habitación'){
        if(roomElements.indexOf('trampilla') !== -1 && canTakeObjects.get('comida de gato') === true && objectsRoom.indexOf('comida de gato') !== -1 && inventory.indexOf('comida de gato') === -1 && floorObjectsRoom.indexOf('comida de gato') === -1){
            if(option === 'comer'){
                speakOutput = 'La comida no te sienta muy bien y pierdes 20 puntos';
                points -= 20;
              	canTakeObjects.set('comida de gato',false);
                let index = objectsRoom.indexOf('comida de gato');
                objectsRoom.splice(index,1);
            }else if(option === 'guardar'){
                speakOutput = take('comida de gato');
            }
        }
    }
  	conv.ask(speakOutput);

});

app.intent(HELP, (conv) =>{
    const speakOutput = 'Para jugar debes tener en cuenta que existen dos tipos de objetos: aquellos que puedes guardar en el inventario, como una linterna o una llave, y aquellos que permanecen en la habitación, como una cama, un cuadro... ' 
        +'En el caso de los objetos que no pueden ser almacenados, puedes decir inspeccionar o mirar para obtener más información sobre los mismos. Para aquellos objetos que sí puedes guardar, puedes decir coger, soltar o usar. '
        +' Para explorar la habitación, puedes mirar en cualquier dirección: norte, sur, este, oeste, arriba y abajo. Esto te dará la información necesaria para inspeccionar los objetos que veas del modo explicado. ' 
        +' Puedes usar un objeto del inventario con uno de la habitación diciendo, por ejemplo: usar llave en puerta. '
        + ' También puedes obtener una pista, preguntar dónde estás, cómo te llamas, cuántos puntos tienes, cambiar tu nombre o saber qué tienes en el inventario. '
        + ' Algunos ejemplos de las posibles acciones son: mirar arriba, mirar cama, coger llave, soltar llave, usar llave en puerta, '
        + ' dónde estoy, qué tengo en el inventario, dame una pista, cómo me llamo, cambiar nombre, cuál es mi puntuación... Si necesitas que te repita los controles vuelve a solicitar ayuda. ';

    conv.ask(speakOutput);
}); 

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

