// We import the room
const room_es = require('./room-es')

// Room
let room = '';

// Inventory of the player
let inventory = [];

// Player
let points = '';
let name = '';

// Boolean to know if you are hurt
let dead;

// Boolean to know if the game has been finished
let finished;

module.exports = {
    initialize(){
        room_es.initialize();
        
        // Inventory of the player
        inventory = [];
        
        // Player
        points = 0;
        name = '';
        dead = false;
        
        // Boolean to know if the game is over
        finished = false;
        
        room = room_es.getRoom();
    },
    setName(n){
      name = n;  
    },
    getName(){
        return name;  
    },
    getPoints(){
        let speechText = 'Tienes ' + points + ' puntos';
        if(points === ''){
            speechText = 'No tienes puntos aún';
        }
        return speechText;  
    },
    look(orientation){
        let speechText = 'No puedes mirar nada porque no estás en ninguna habitación. ';
        if(room === room_es.getRoom()){
            speechText = room_es.look(orientation);
        }
        return speechText;                                                                                                                                                                                                                             return speechText ; 
    },
    interaction(object){
        let speechText = 'No hay nada de interés en eso.';
        if(room === room_es.getRoom()){
            speechText = room_es.interaction(object).speechText;
            points += room_es.interaction(object).points;
        }
        return speechText;
    },
    inventory(){
        let speechText = ''
        if(inventory.length === 0){
            speechText = 'No tienes nada en el inventario.'
        }else{
            speechText = 'En el inventario tienes: ' + inventory;
        }
        return speechText;
    },
    take(item){
        let speechText = 'No puedes coger ' + item;
        
        if(room === room_es.getRoom()){
            speechText = room_es.take(item).speechText;
            inventory.push(item);
            points += room_es.take(item).points;
        }
        return speechText;
    },
    release(item){
        let speechText = 'No puedes soltar ' + item;
        
        if(inventory.indexOf(item) !== -1){
            if(room === room_es.getRoom()){
                speechText = room_es.release(item);
            }
            let index = inventory.indexOf(item)
            inventory.splice(index,1)
        }
        return speechText;
    },
    use(object, element){
        let speakOutput = 'No puedes hacer eso. Recuerda que para usar un objeto tienes que tenerlo en el inventario.';
    
        if(inventory.indexOf(object) !== -1){
            if(room === room_es.getRoom()){
                speakOutput = room_es.use(object,element).speakOutput;
                finished = room_es.use(object,element).finished;
                dead = room_es.use(object,element).dead;
                points += room_es.use(object,element).points;
            }
        }
        if(dead){
            speakOutput = speakOutput + '¡Oh, oh! ¡Estás muerto!';
        }
        if(finished){
            speakOutput = speakOutput + ' Tu puntuación ha sido de ' 
            + points + ' puntos, ' + name + '</speak>';
        }
        
        return {
            speakOutput: speakOutput,
            dead: dead,
            finished: finished
        }
    },
    where(){
        let speakOutput = 'Aún no has empezado el juego.';
        if (room !== ''){
            speakOutput = 'Estás en ' + room;
        }
        return speakOutput;
    },
    clue(){
        let speakOutput = 'No puedo darte pistas porque aún no estás en ninguna habitación.'
        
        if(room === room_es.getRoom()){
            speakOutput = room_es.clue();
        }
        points -= 10;
        return speakOutput;
    },
    choose(option){
        let speakOutput = 'No es el momento de hacer eso.';
        if(room === room_es.getRoom()){
            let take = false;
            speakOutput = room_es.choose(option).speakOutput;
            points += room_es.choose(option).points;
            take = room_es.choose(option).take;
            if(take){
                speakOutput = this.take('comida de gato');
            }
        }
        return speakOutput;
    }
}