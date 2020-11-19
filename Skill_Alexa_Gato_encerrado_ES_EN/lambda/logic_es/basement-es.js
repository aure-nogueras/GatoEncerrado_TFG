// Objects in the room
let objectsBasement = [];
        
// Objects in the floor of the room
let floorObjectsBasement = [];

// Array with accomplished interactions with the objects of the room
let basementElements = [];
        
// Array that indicates if an object can be taken
let canTakeObjects;

// Points in this room
let points;

// Number used to choose the clue
let n;

// Time registers
let hour1, hour2;
let minutes1, minutes2;
let seconds1, seconds2;

// Boolean to know if it is the first time an object is taken
let firstTime;
let firstUse;

// Boolean to know if you are hurt
let harmed;

// Boolean to know if you are dead
let dead;

// Boolean to know if the game has finished
let finished;

// Boolean to know if you gave the cat four objects in correct order
let fourObjects;

module.exports = {
    initialize(sessionAttributes){
        floorObjectsBasement = [];
        objectsBasement = ['llaves coche', 'mando garaje', 'gato'];
        canTakeObjects = [];
        basementElements = [];
        harmed = false;
        dead = false;
        finished = false;
        firstUse = true;
        firstTime = true;
        points = 0;
        n = 0;
        fourObjects = false;
        
        sessionAttributes['objectsBasementEs'] = objectsBasement;
        sessionAttributes['floorObjectsBasementEs'] = floorObjectsBasement;
        sessionAttributes['canTakeObjectsBasementEs'] = canTakeObjects;
        sessionAttributes['basementElementsEs'] = basementElements;
        sessionAttributes['firstTimeBasementEs'] = firstTime;
        sessionAttributes['firstUseBasementEs'] = firstUse;   
        sessionAttributes['basementClueEs'] = n;
        sessionAttributes['harmedEs'] = harmed;
        sessionAttributes['fourObjectsEs'] = fourObjects;
    },
    continueGame(sessionAttributes){
        objectsBasement = sessionAttributes['objectsBasementEs'];
        floorObjectsBasement = sessionAttributes['floorObjectsBasementEs'];
        canTakeObjects = sessionAttributes['canTakeObjectsBasementEs'];
        basementElements = sessionAttributes['basementElementsEs'];
        firstTime = sessionAttributes['firstTimeBasementEs'];
        firstUse = sessionAttributes['firstUseBasementEs'];   
        finished = sessionAttributes['finishedEs'];
        dead = sessionAttributes['deadEs'];
        harmed = sessionAttributes['harmedEs'];
        fourObjects = sessionAttributes['fourObjectsEs'];
        
        points = 0;
        n = sessionAttributes['basementClueEs'];
    },
    getRoom(){
        let room = 'sótano';
        return room;
    },
    look(orientation){
        let speechText = '';
        switch(orientation){
            case 'norte':
                speechText = 'Delante ves la puerta y un interruptor.';
                break;
            case 'sur':
                speechText = 'Detrás de ti ves las escaleras que suben al salón.'
                break;
            case 'este':
                speechText = 'A la derecha hay un coche.'
                break;
            case 'oeste':
                speechText = 'A la izquierda hay una estantería y un arenero.'
                break;
            case 'arriba':
                speechText = 'Arriba hay una lámpara que está encendida.'
                break;
            case 'abajo':
                if(floorObjectsBasement.length === 0){
                    speechText = 'Abajo está el suelo. Ves unas huellas de nuevo.'
                }else{
                    speechText = 'Además de las huellas, en el suelo encuentras: ' + floorObjectsBasement;
                }
                break;
        }                                                                                                                                                                                                                                    
        return speechText;
    },
    interaction(object, sessionAttributes){
        let speechText = 'No ves interés en hacer eso. ';
        points = 0;
        switch(object){
            case 'estantería':
                speechText = 'Exploras la estantería y  encuentras un juego de mesa. Por lo demás, hay unos cuantos libros polvorientos, pero no son de tu interés.'
                break;
            case 'juego de mesa':
                speechText = 'Se trata de una extraña versión del Cluedo. Se ha cometido el asesinato de un gato. Alguien ha dejado una partida a medias. '
                    + 'Miras la solución. El gato ha sido asesinado por un perro, con atún envenenado en el arenero. Vaya, curiosa versión.'
                break;
            case 'arenero':
                if(floorObjectsBasement.indexOf('llaves coche') === -1 && objectsBasement.indexOf('llaves coche') !== -1){
                    speechText = 'No te resulta especialmente agradable, pero metes la mano en el arenero. Encuentras algo y deseas que no sea lo que estás pensando. Por suerte, sacas la mano y encuentras unas llaves de coche.'
                    canTakeObjects.push('llaves coche');
                    sessionAttributes['canTakeObjectsBasementEs'] = canTakeObjects;
                    if(firstTime){
                        points += 10;
                        firstTime = false;
                        sessionAttributes['firstTimeBasementEs'] = firstTime;
                    }
                }else{
                    speechText = 'No hay nada en el arenero.'
                }
                break;
            case 'coche':
                if(basementElements.indexOf('coche') === -1){
                    speechText = 'Se trata de un coche rojo. Está cerrado y no puedes ver nada de su interior.'
                }else{
                    speechText = 'Se trata de un coche rojo. Está abierto. Miras el maletero. '
                    if(floorObjectsBasement.indexOf('gato') === -1 && objectsBasement.indexOf('gato') !== -1){
                        speechText += 'Dentro hay un gato. '
                        if(basementElements.indexOf('gato') === -1){
                            speechText += 'Te mira esperando que le des algo. Para darle objetos, di dar y los objetos que quieras darle. Puedes darle entre uno y cuatro objetos al gato. '
                            + ' Si le das cuatro objetos, debes seguir un orden específico que has ido descubriendo a lo largo de tu aventura.'
                        }
                    }
                }
                break;
            case 'interruptor':
                speechText = 'Pulsas el interruptor, pero no funciona. '
                break;
            case 'escaleras':
                speechText = 'Las escaleras suben hasta el salón.';    
                break;
            case 'lámpara':
                speechText = 'La lámpara está encendida. No hay nada especial en ella.';    
                break;
            case 'puerta':
                if(basementElements.indexOf('puerta') === -1){
                    speechText = "<speak>"
                        + "<audio src='soundbank://soundlibrary/doors/doors_handles/handle_04'/>"
                        + 'La puerta está cerrada. '
                        + "</speak>";
                }
                break;
        }
        return {
            speechText: speechText,
            points: points
        }
    },
    interactionObjects(object){
        let speechText = '';
        if(objectsBasement.indexOf(object) !== -1 && canTakeObjects.indexOf(object) !== -1){
            speechText += 'Quizás puedas cogerlo. Una vez que lo tengas en el inventario, también puede ser útil usarlo. ';
        }
        return speechText;
    },
    take(item, sessionAttributes){
        let speechText = 'No puedes coger ' + item;
        points = 0;
        let success = false;
        if(objectsBasement.indexOf(item) !== -1 && canTakeObjects.indexOf(item) !== -1){
            speechText = 'Has puesto ' + item + ' en el inventario.';
            if(item === 'gato' && firstUse === true){
                points += 50;
                firstUse = false;
                sessionAttributes['firstUseBasementEs'] = firstUse;
            }
            let i = canTakeObjects.indexOf(item)
            canTakeObjects.splice(i,1)
            sessionAttributes['canTakeObjectsBasementEs'] = canTakeObjects;
            let index = objectsBasement.indexOf(item)
            objectsBasement.splice(index,1)
            sessionAttributes['objectsBasementEs'] = objectsBasement;
            if(floorObjectsBasement.indexOf(item) !== -1){
                let index2 = floorObjectsBasement.indexOf(item)
                floorObjectsBasement.splice(index2,1)
                sessionAttributes['floorObjectsBasementEs'] = floorObjectsBasement;
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
        objectsBasement.push(item);
        floorObjectsBasement.push(item);
        canTakeObjects.push(item);
        sessionAttributes['canTakeObjectsBasementEs'] = canTakeObjects;
        sessionAttributes['floorObjectsBasementEs'] = floorObjectsBasement;
        sessionAttributes['objectsBasementEs'] = objectsBasement;
        return speechText;
    },
    use(object, element, sessionAttributes){
        points = 0;
        let speakOutput = 'No puedes hacer eso.';
        if(object === 'llaves coche' && element === 'coche'){
            if(basementElements.indexOf('coche') === -1){
                speakOutput = 'Abres el coche.' 
                    + '<audio src="soundbank://soundlibrary/alarms/car_alarms/car_alarm_05"/>'
                basementElements.push('coche');
                sessionAttributes['basementElementsEs'] = basementElements;
                points += 10;
            }else{
                speakOutput = 'El coche está abierto. ';
            }
            if(floorObjectsBasement.indexOf('gato') === -1 && objectsBasement.indexOf('gato') !== -1){
                speakOutput += 'Miras dentro. En el maletero hay un gato muy mono. Te enamoras de él nada más verlo. ';
                if(basementElements.indexOf('gato') === -1){
                    speakOutput += 'Te mira esperando que le des algo. Para darle objetos, di dar y los objetos que quieras darle. Puedes darle entre uno y cuatro objetos al gato. '
                    + ' Si le das cuatro objetos, debes seguir un orden específico que has ido descubriendo con pistas a lo largo de tu aventura. '
                }
            }else{
                speakOutput += 'Ya no hay nada dentro.'
            }
        }
        if(object === 'mando garaje' && element === 'puerta'){
            if(basementElements.indexOf('puerta') === -1){
                speakOutput = 
                    'Usas el mando del garaje y abres la puerta.' 
                    + '<audio src="soundbank://soundlibrary/doors/doors_metal/metal_12"/>'
                    + '¡Eres libre!'; 
                finished = true;
                basementElements.push('puerta');
                sessionAttributes['basementElementsEs'] = basementElements;
                points += 20;
            }else{
                speakOutput = 'La puerta está abierta. ¡Ves la salida! '
            }
        }
        return{
            speakOutput: speakOutput,
            finished: finished,
            points: points,
            fourObjects: fourObjects
        }        
    },
    useObject(sessionAttributes){
        let speakOutput = 'No es el momento de usar el alcohol.';
        if(basementElements.indexOf('coche') !== -1 && harmed){
            hour2 = new Date().getHours()
            minutes2 = new Date().getMinutes()
            seconds2 = new Date().getSeconds()
            sessionAttributes['hour2Es'] = hour2;
            sessionAttributes['minutes2Es'] = minutes2;
            sessionAttributes['seconds2Es'] = seconds2;
            let seconds = seconds2 - seconds1
            if((hour1 === hour2 && minutes1 === minutes2 && seconds < 30) || ((hour1 === hour2 || hour2-hour1 === 1 || (hour2 === 0 && hour1 === 23)) && minutes2-minutes1 === 1 && seconds1 >= 30 && seconds2 <= (seconds1+30)%60)){
                speakOutput = 'Usas el alcohol y te curas a tiempo.'
                harmed = false;
                sessionAttributes['harmedEs'] = false;
            }else{
                speakOutput = 'Te has desmayado antes de poder usar el alcohol.'
                dead = true;
                points -= 30;
            }
        }   
        return{
            speakOutput: speakOutput,
            dead: dead,
            points: points
        }
    },
    giveCats(element1, element2, element3, element4, sessionAttributes){
        let speakOutput = 'El coche está cerrado.';
        points = 0;
        let success = false;
        if(basementElements.indexOf('coche') !== -1){
            if(basementElements.indexOf('gato') === -1){
                if(harmed){
                    speakOutput = 'No puedes probar otra vez. Estás herido...';
                }else{
                    if(element1 === 'cuenco' && element2 === 'comida de gato' && element3 === 'ovillo de lana' && element4 === 'ratón de juguete'){
                        speakOutput = "<speak>" 
                            +  element1 + ' ' + element2 + ' ' + element3 + ' ' + element4 + ' '
                            + "Le has dado los objetos en orden al gato. "
                            + "Ahora está feliz y se acerca a ti."
                            + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_purr_01"/>'
                            + ' El gato deja caer al suelo el mando del garaje.'
                            + "</speak>";
                        basementElements.push('gato');
                        success = true;
                        fourObjects = true;
                        canTakeObjects.push('gato');
                        canTakeObjects.push('mando garaje');
                        floorObjectsBasement.push('mando garaje');
                        sessionAttributes['basementElementsEs'] = basementElements;
                        sessionAttributes['canTakeObjectsBasementEs'] = canTakeObjects;
                        sessionAttributes['floorObjectsBasementEs'] = floorObjectsBasement;
                        sessionAttributes['fourObjectsEs'] = fourObjects;
                        points += 30;
                    }else{
                        if(!harmed){
                            speakOutput = element1 + ' ' + element2 + ' ' + element3 + ' ' + element4 + ' '
                                + 'Ese no es el orden en el que debes darle las cosas al gato. Parece bastante enfadado. '
                                + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_02"/>'
                                + 'Se acerca a ti y te araña. Oh, no, estás sangrando. '
                                + 'Debes detener la sangre de alguna forma o te desmayarás.';
                            hour1 = new Date().getHours();
                            minutes1 = new Date().getMinutes();
                            seconds1 = new Date().getSeconds();
                            sessionAttributes['hour1Es'] = hour1;
                            sessionAttributes['minutes1Es'] = minutes1;
                            sessionAttributes['seconds1Es'] = seconds1;
                            points -= 30;
                        }
                        harmed = true;
                        sessionAttributes['harmedEs'] = harmed;
                    }
                    
                }
            }else{
               speakOutput = 'Ya le has dado los objetos al gato de forma correcta. Está feliz.'; 
            }
        }
        return {
            speakOutput: speakOutput,
            success: success,
            points: points
        }
    },
    giveCats2(element1, element2, element3, sessionAttributes){
        let speakOutput = 'El coche está cerrado.';
        points = 0;
        let success = false;
        if(basementElements.indexOf('coche') !== -1){
            if(basementElements.indexOf('gato') === -1){
                if(harmed){
                    speakOutput = 'No puedes probar otra vez. Estás herido...';
                }else{
                    if(element1 !== element2 && element2 !== element3 && element1 !== element3){
                        speakOutput = "<speak>" 
                            +  element1 + ' ' + element2 + ' ' + element3 + ' '
                            + "Le has dado tres objetos de cuatro al gato. "
                            + "Te dedica una mirada de leve aceptación y se acerca a ti."
                            + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_purr_01"/>'
                            + ' El gato deja caer al suelo el mando del garaje.'
                            + "</speak>";
                            basementElements.push('gato');
                            success = true;
                            canTakeObjects.push('gato');
                            canTakeObjects.push('mando garaje');
                            floorObjectsBasement.push('mando garaje');
                            sessionAttributes['basementElementsEs'] = basementElements;
                            sessionAttributes['canTakeObjectsBasementEs'] = canTakeObjects;
                            sessionAttributes['floorObjectsBasementEs'] = floorObjectsBasement;
                            points += 10;
                    }else{
                        speakOutput = 'Los objetos no pueden repetirse. ';
                    }
                }
            }else{
               speakOutput = 'Ya le has dado los objetos al gato de forma correcta. Está feliz.'; 
            }
        }
        return {
            speakOutput: speakOutput,
            success: success,
            points: points
        }
    },
    giveCats3(element1, element2, sessionAttributes){
        let speakOutput = 'El coche está cerrado.';
        points = 0;
        if(basementElements.indexOf('coche') !== -1){
            if(basementElements.indexOf('gato') === -1){
                if(harmed){
                    speakOutput = 'No puedes probar otra vez. Estás herido...';
                }else{
                    if(element1 !== element2){
                        speakOutput = element1 + ' ' + element2 + ' '
                                    + 'Solo le has dado dos de cuatro objetos al gato. Parece bastante enfadado. '
                                    + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_02"/>'
                                    + 'Se acerca a ti y te araña. Oh, no, estás sangrando. '
                                    + 'Debes detener la sangre de alguna forma o te desmayarás.';
                        hour1 = new Date().getHours();
                        minutes1 = new Date().getMinutes();
                        seconds1 = new Date().getSeconds();
                        sessionAttributes['hour1Es'] = hour1;
                        sessionAttributes['minutes1Es'] = minutes1;
                        sessionAttributes['seconds1Es'] = seconds1;
                        points -= 30;
                        harmed = true;
                        sessionAttributes['harmedEs'] = harmed;
                    }else{
                        speakOutput = 'Los objetos no pueden repetirse. ';
                    }
                }
            }else{
               speakOutput = 'Ya le has dado los objetos al gato de forma correcta. Está feliz.'; 
            }
        }
        return {
            speakOutput: speakOutput,
            points: points
        }
    },
    giveCats4(element1){
        let speakOutput = 'El coche está cerrado.';
        points = 0;
        let success = false;
        if(basementElements.indexOf('coche') !== -1){
            if(basementElements.indexOf('gato') === -1){
                if(harmed){
                    speakOutput = 'No puedes probar otra vez. Estás herido...';
                }else{
                    speakOutput = 'Solo le has dado un objeto de cuatro al gato. '
                    + '<audio src="soundbank://soundlibrary/animals/amzn_sfx_cat_angry_meow_1x_02"/>'
                    + 'Se enfada contigo y te araña. Te pilla por sorpresa y te desmayas sin tiempo a nada más. ';
                    points -= 30;
                    dead = true;
                }
            }else{
               speakOutput = 'Ya le has dado los objetos al gato de forma correcta. Está feliz.'; 
            }
        }
        return {
            speakOutput: speakOutput,
            dead: dead,
            points: points
        }
    },
    go(place){
        let speakOutput = 'No puedes ir ahí.';
        let r = 'sótano';
        if(place === 'salón'){
            speakOutput = 'Estás en el salón.';
            r = 'salón';    
        }
        return {
            speakOutput: speakOutput,
            room: r
        }
    },
    clue(sessionAttributes){
        let speakOutput = '';
        if(n === 0){
            speakOutput = '¿Has mirado en el arenero?';
            n = 1;
        }else if(n === 1){
            speakOutput = 'Necesitas tener a mano algo que has visto en el baño en caso de que las cosas se compliquen.';
            n = 2;
        }else if(n === 2){
            speakOutput = 'Un gato siempre es feliz con más. ';
            n = 3;
        }else if(n === 3){
            speakOutput = 'La clave del orden está en una voz misteriosa. ';
            n = 4;
        }else if(n === 4){
            speakOutput = 'Hay objetos que has ido encontrando durante tu aventura que te daban las pistas del orden en el que debes darle las cosas al gato: una carta, una foto, un teléfono y un reproductor. ';
            n = 0;
        }
        sessionAttributes['basementClueEs'] = n;
        return speakOutput;
    }
    
}