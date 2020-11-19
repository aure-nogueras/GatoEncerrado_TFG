// Objects in the room
let objectsKitchen = [];
        
// Objects in the floor of the room
let floorObjectsKitchen = [];

// Array that indicates if an object can be taken
let canTakeObjects;

// Points of the player
let points;

// Boolean to know if it is the first time an object is taken
let firstTime;

module.exports = {
    initialize(sessionAttributes){
        objectsKitchen = ['nota'];
        floorObjectsKitchen = [];
        canTakeObjects = [];
        points = 0;
        firstTime = true;
        
        sessionAttributes['objectsKitchenEs'] = objectsKitchen;
        sessionAttributes['floorObjectsKitchenEs'] = floorObjectsKitchen;
        sessionAttributes['canTakeObjectsKitchenEs'] = canTakeObjects;
        sessionAttributes['firstTimeKitchenEs'] = firstTime;
    },
    continueGame(sessionAttributes){
        objectsKitchen = sessionAttributes['objectsKitchenEs'];
        floorObjectsKitchen = sessionAttributes['floorObjectsKitchenEs'];
        canTakeObjects = sessionAttributes['canTakeObjectsKitchenEs'];
        firstTime = sessionAttributes['firstTimeKitchenEs'];
        points = 0;
    },
    getRoom(){
        let room = 'cocina';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'norte':
                speechText = 'Al norte solo hay una pared estropeada que no tiene mucho interés.';
                break;
            case 'sur':
                speechText = 'Al sur hay unos fogones y una encimera con cajones.'
                break;
            case 'este':
                speechText = 'A la derecha está la pared por la que acabas de entrar, pero no hay ni rastro del agujero que se ha abierto para darte paso.'
                break;
            case 'oeste':
                speechText = 'A la izquierda ves un frigorífico.'
                break;
            case 'arriba':
                speechText = 'Arriba solo está el techo. Nada de interés.' 
                break;
            case 'abajo':
                if(floorObjectsKitchen.length === 0){
                    speechText = 'Abajo ves una trampilla.'
                }else{
                    speechText = 'Además de la trampilla, en el suelo encuentras: ' + floorObjectsKitchen;
                }
                break;
        }
        return speechText;
    },
    interaction(object, lintern, sessionAttributes){
        let speechText = 'No ves interés en hacer eso.';
        let room = 'cocina';
        let url = '';
        switch(object){
            case 'fogones':
                speechText = 'Son unos fogones muy antiguos. Están muy oxidados y no parece que funcionen.'
                break;
            case 'encimera':
                speechText = 'La encimera está llena de grasa. Mejor no tocarla. Debajo hay unos cajones.'
                break;
            case 'cajón':
                speechText = 'Examinas los cajones y en uno de ellos encuentras una nota.' 
                canTakeObjects.push('nota');
                sessionAttributes['canTakeObjectsKitchenEs'] = canTakeObjects;
                break;
            case 'trampilla':
                speechText = 'Miras la trampilla más de cerca. Te pones sobre ella... <audio src="soundbank://soundlibrary/explosions/explosions/explosions_02"/>'
                + ' ¡Oh, no! La trampilla se ha roto y has caído por el agujero. Ya no podrás volver a la cocina... Miras a tu alrededor. Apenas ves nada. Todo está muy oscuro. '
                if(lintern){
                    speechText += 'La linterna ya no te funciona, así que avanzas a tientas por un extraño túnel que se abre ante ti.' 
                }else{
                    speechText += 'No tienes nada para iluminarte, así que avanzas a tientas por un extraño túnel que se abre ante ti.'  
                }
                url = "https://soundgato.s3.eu-west-3.amazonaws.com/secret.jpg";
                speechText += ' El suelo está encharcado y oyes tus pisadas. '
                    + '<audio src="soundbank://soundlibrary/footsteps/water/water_06"/> La situación empieza a producirte escalofríos. No te atreves a tocar la pared, por si está igual de '
                    + 'sucia que el suelo. Al fin llegas al final del túnel y ves una puerta. Le das un toque con cuidado y se abre ante ti. '
                    + '<audio src="soundbank://soundlibrary/doors/doors_squeaky/squeaky_08"/> Avanzas un poco más y apareces en un extraño lugar. Parece una habitación secreta. Nada más entrar'
                    + ' vuelves a ver algo. ¡Es un fantasma! Vuelve a atravesar la pared y desaparece ante tus ojos. <audio src="soundbank://soundlibrary/horror/horror_04"/> '
                room = 'habitación secreta';
                break;
            case 'frigorífico':
                speechText = 'Abres el frigorífico. Está bastante vacío. Solo ves una raspa de pescado y algo que parece llevar caducado meses. Nadie parece haber tocado este frigorífico en mucho tiempo.'
                break;
        }
        return {
            speechText: speechText,
            room: room,
            url: url
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsKitchen.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        let success = false;
        points = 0;
        if(objectsKitchen.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.' 
            if(item === 'nota'){
                speechText += ' Lees la nota para ver lo que pone. Ves una palabra escrita: miau. Abajo pone comprar atún, pero está tachado.';
                if(firstTime){
                    points += 10;
                    firstTime = false;
                    sessionAttributes['firstTimeKitchenEs'] = firstTime;
                }
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsKitchenEs'] = canTakeObjects;
            let index = objectsKitchen.indexOf(item)
            objectsKitchen.splice(index,1)
            sessionAttributes['objectsKitchenEs'] = objectsKitchen;
            if(floorObjectsKitchen.indexOf(item) !== -1){
                let index2 = floorObjectsKitchen.indexOf(item)
                floorObjectsKitchen.splice(index2,1)
                sessionAttributes['floorObjectsKitchenEs'] = floorObjectsKitchen;
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
        let speechText = 'Has puesto ' + item + ' en la cocina'; 
        objectsKitchen.push(item);
        floorObjectsKitchen.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsKitchenEs'] = canTakeObjects;
        sessionAttributes['floorObjectsKitchenEs'] = floorObjectsKitchen;
        sessionAttributes['objectsKitchenEs'] = objectsKitchen;
        return speechText;
    },
    clue(){
        let speakOutput = 'La trampilla parece interesante. Deberías examinarla.';
        return speakOutput;
    }
    
}