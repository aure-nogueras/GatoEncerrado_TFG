'use strict';

const functions = require('firebase-functions');
const {dialogflow} = require ('actions-on-google');

// Intents
const INVOCATION = 'Invocation'; 
const NEW_GAME = 'New Game - custom';
const CONTINUE = 'Continue Game Intent';
const TELL_NAME = 'Tell Name Intent';
const CHANGE_NAME = 'Change Name Intent - custom';
const TELL_POINTS = 'Tell Score Intent';
const LOOK = 'Look Intent';
const INTERACTION = 'Interaction Intent';
const DEFAULT_INTERACTION = 'Default Interaction Intent';
const INTERACTION_OBJECTS = 'Interaction Objects Intent';
const INVENTORY = 'Inventory Intent';
const TAKE = 'Take Intent';
const DEFAULT_TAKE = 'Default Take Intent';
const TAKE_OBJECTS = 'Take Objects Intent';
const RELEASE = 'Release Intent';
const DEFAULT_RELEASE = 'Default Release Intent';
const RELEASE_OBJECTS = 'Release Objects Intent';
const USE = 'Use Intent';
const USE_OBJECT = 'Use Object Intent';
const COMBINE = 'Combine Objects Intent';
const NUMBER_CODE = 'Number Code Intent';
const PUSH_SYMBOL = 'Push Symbols Intent';
const READ = 'Read Intent';
const GIVE_CATS = 'Give Cat Intent';
const WHERE = 'Where Intent';
const GO_TO = 'Go To Intent';
const CLUE = 'Clue Intent';
const CHOOSE = 'Choose Intent';
const CHOOSE_OBJECT = 'Choose Object Intent';
const HELP = 'Help Intent';

// Entities
const STILL_OBJECTS_ENTITY = 'StillObjects';
const ORIENTATION_ENTITY = 'Orientation';
const OBJECTS_ENTITY = 'Objects';
const AUTHOR_ENTITY = 'Author';
const CAT_ENTITY = 'CatObjects';
const PLACES_ENTITY = 'Places';
const SYMBOL_ENTITY = 'Symbol';
const NUMBER_ENTITY = 'number';
const ANY_ENTITY = 'any';
const NAME_ENTITY = 'name';
const CHOOSE_ENTITY = 'choose';
const OBJECTS_CHOOSE_ENTITY = 'objectschoose';
const HELP_ENTITY = 'HelpType';

const app = dialogflow(); 

const languageStrings = require('./text');
const logic_en = require('./logic_en/logic-en');

app.intent(INVOCATION, (conv) =>{
    logic_en.launch();
	conv.ask(languageStrings.en.translation.WELCOME_MSG);
});

app.intent(NEW_GAME, (conv) =>{
    const name = conv.parameters[NAME_ENTITY];
    logic_en.initialize(conv.user.storage);
    logic_en.setName(name, conv.user.storage); 
    conv.ask(languageStrings.en.translation.INIT_MSG);
});

app.intent(CONTINUE, (conv) =>{
    let speakOutput = '';
    let n = conv.user.storage.name;
    let p = conv.user.storage.points;
    let r = conv.user.storage.room;
    if (conv.user.verification === 'VERIFIED') {
        if(n === undefined || p === undefined || r === undefined){
            speakOutput = languageStrings.en.translation.UNDEFINED;
        }else{
            if(conv.user.storage.dead === true || conv.user.storage.finished === true){
                speakOutput = languageStrings.en.translation.ENDED_GAME;
            }else{
                if(conv.user.storage.room !== '' && conv.user.storage.name !== ''){
                    speakOutput = languageStrings.en.translation.CONTINUE_MSG.replace('%s', n).replace('%p',p).replace('%r',r);
                    logic_en.continueGame(conv.user.storage);
                }else{
                    speakOutput = languageStrings.en.translation.NO_GAME_SAVED;
                }
            }
        }
    } else {
        speakOutput = languageStrings.en.translation.USER_VERIFICATION;
    }
    conv.ask(speakOutput);
});

app.intent(TELL_NAME, (conv) =>{
    let name = logic_en.getName();
    let speakOutput = languageStrings.en.translation.NO_NAME_MSG;
    if(name !== ''){
        speakOutput = languageStrings.en.translation.NAME_MSG.replace('%s', name);
    }
    conv.ask(speakOutput);
});

app.intent(CHANGE_NAME, (conv) =>{
    const name = conv.parameters[NAME_ENTITY].toLowerCase();
    logic_en.setName(name, conv.user.storage);
    let speakOutput = languageStrings.en.translation.CHANGE_MSG.replace('%s', name);
    conv.ask(speakOutput);
});

app.intent(TELL_POINTS, (conv) =>{
    let speakOutput = logic_en.getPoints();
    conv.ask(speakOutput  + languageStrings.en.translation.REPROMPT_MSG);
});

app.intent(LOOK, (conv) =>{
    const orientation = conv.parameters[ORIENTATION_ENTITY].toLowerCase();
    let speechText = logic_en.look(orientation);
    conv.ask(speechText  + languageStrings.en.translation.REPROMPT_MSG);                 
});

app.intent(INTERACTION, (conv) =>{
  	const object = conv.parameters[STILL_OBJECTS_ENTITY].toLowerCase();
  	const speechText = logic_en.interaction(object, conv.user.storage);
	conv.ask(speechText);
});

app.intent(DEFAULT_INTERACTION, (conv) =>{
    const something = conv.parameters[ANY_ENTITY].toLowerCase();
    conv.ask(languageStrings.en.translation.DEFAULT_MSG.replace('%s',something));
}); 

app.intent(INTERACTION_OBJECTS, (conv) =>{
    const object = conv.parameters[OBJECTS_ENTITY].toLowerCase();
    let speechText = languageStrings.en.translation.DEFAULT2_MSG;
    speechText += logic_en.interactionObjects(object);
    conv.ask(speechText);
});

app.intent(INVENTORY, (conv) =>{
    const speechText = logic_en.inventory();
    conv.ask(speechText);
});  

app.intent(TAKE, (conv) =>{
    const item = conv.parameters[OBJECTS_ENTITY].toLowerCase();
    const speechText = logic_en.take(item, conv.user.storage);
    conv.ask(speechText);
});   

app.intent(RELEASE, (conv) =>{
    const item = conv.parameters[OBJECTS_ENTITY].toLowerCase();
    const speechText = logic_en.release(item, conv.user.storage);
    conv.ask(speechText);
});

app.intent(DEFAULT_TAKE, (conv) =>{
    const any = conv.parameters[ANY_ENTITY].toLowerCase();
    conv.ask(languageStrings.en.translation.DEFAULT_TAKE_MSG.replace('%s', any));
});   

app.intent(DEFAULT_RELEASE, (conv) =>{
    const any = conv.parameters[ANY_ENTITY].toLowerCase();
    conv.ask(languageStrings.en.translation.DEFAULT_RELEASE_MSG.replace('%s', any));
}); 

app.intent(TAKE_OBJECTS, (conv) =>{
    const obj = conv.parameters[STILL_OBJECTS_ENTITY].toLowerCase();
    conv.ask(languageStrings.en.translation.TAKE_OBJECTS_MSG.replace('%s', obj));
});   

app.intent(RELEASE_OBJECTS, (conv) =>{
    const obj = conv.parameters[STILL_OBJECTS_ENTITY].toLowerCase();
    conv.ask(languageStrings.en.translation.RELEASE_OBJECTS_MSG.replace('%s', obj));
}); 

app.intent(USE, (conv) =>{
    const object = conv.parameters[OBJECTS_ENTITY].toLowerCase();
    const element = conv.parameters[STILL_OBJECTS_ENTITY].toLowerCase();
    let finished = false;
    let dead = false;
    let value = logic_en.use(object, element, conv.user.storage);
    let speakOutput = value.speakOutput;
    finished = value.finished;
    dead = value.dead;
    if(finished){
        logic_en.launch();
        conv.close(speakOutput);
    }else{          
        conv.ask(speakOutput);
    }
});

app.intent(USE_OBJECT, (conv) =>{
    const object = conv.parameters[OBJECTS_ENTITY].toLowerCase();
    let faint = false;
    let value = logic_en.useObject(object, conv.user.storage);
    let speakOutput = value.speak;
    let read = value.read;
    faint = value.faint;
    if(faint){
        logic_en.launch();
        conv.close(speakOutput);
    }else{
        speakOutput += languageStrings.en.translation.REPROMPT_MSG;
        if(read){
            speakOutput += '</speak>';
        }
        conv.ask(speakOutput);
    }
});

app.intent(COMBINE, (conv) =>{
    const object = conv.parameters[OBJECTS_ENTITY][0].toLowerCase();
    const object2 = conv.parameters[OBJECTS_ENTITY][1].toLowerCase();
    const speakOutput = logic_en.combine(object, object2, conv.user.storage);
    conv.ask(speakOutput  + languageStrings.en.translation.REPROMPT_MSG);
});

app.intent(NUMBER_CODE, (conv) =>{
    const number = conv.parameters[NUMBER_ENTITY];
    const speakOutput = logic_en.numberCode(number, conv.user.storage);
    conv.ask(speakOutput);
}); 

app.intent(PUSH_SYMBOL, (conv) =>{
    const symbol = conv.parameters[SYMBOL_ENTITY][0];
  	const symbol2 = conv.parameters[SYMBOL_ENTITY][1];
  	const symbol3 = conv.parameters[SYMBOL_ENTITY][2];
  	const symbol4 = conv.parameters[SYMBOL_ENTITY][3];
  	const speakOutput = logic_en.pushSymbol(symbol, symbol2, symbol3, symbol4, conv.user.storage);
    conv.ask(speakOutput);
}); 

app.intent(READ, (conv) =>{
    const author = conv.parameters[AUTHOR_ENTITY].toLowerCase();
    const speakOutput = logic_en.read(author);
  	conv.ask(speakOutput);
}); 

app.intent(GIVE_CATS, (conv) =>{
    let element2;
  	let element3;
    let element4;
    let speakOutput = languageStrings.en.translation.CAT_GIVE_MSG;
    const size = conv.parameters[CAT_ENTITY].length;
    const element1 = conv.parameters[CAT_ENTITY][0].toLowerCase();

  	if(size === 2){
        element2 = conv.parameters[CAT_ENTITY][1].toLowerCase();
        speakOutput = logic_en.giveCats3(element1, element2, conv.user.storage);
    }else if(size === 3){
        element2 = conv.parameters[CAT_ENTITY][1].toLowerCase();
        element3 = conv.parameters[CAT_ENTITY][2].toLowerCase();
        speakOutput = logic_en.giveCats2(element1, element2, element3, conv.user.storage);
    }else if(size === 4){
        element2 = conv.parameters[CAT_ENTITY][1].toLowerCase();
        element3 = conv.parameters[CAT_ENTITY][2].toLowerCase();
        element4 = conv.parameters[CAT_ENTITY][3].toLowerCase();
        speakOutput = logic_en.giveCats(element1, element2, element3, element4, conv.user.storage);
    }else{
        let value = logic_en.giveCats4(element1, conv.user.storage);
        speakOutput = value.speakOutput;
        let dead = value.dead;
        if(dead){
            logic_en.launch();
            conv.close(speakOutput);
        }
    }
    conv.ask(speakOutput);
});

app.intent(WHERE, (conv) =>{
    const speakOutput = logic_en.where();
    conv.ask(speakOutput + languageStrings.en.translation.REPROMPT_MSG);
}); 

app.intent(GO_TO, (conv) =>{
    const place = conv.parameters[PLACES_ENTITY].toLowerCase();
    const speakOutput = logic_en.go(place, conv.user.storage); 
    conv.ask(speakOutput);
}); 

app.intent(CLUE, (conv) =>{
    const speakOutput = logic_en.clue(conv.user.storage);
    conv.ask(speakOutput + languageStrings.en.translation.REPROMPT_MSG);
}); 

app.intent(CHOOSE, (conv) =>{
    const choose = conv.parameters[CHOOSE_ENTITY].toLowerCase();
    let value = logic_en.choose(choose, conv.user.storage);
    let speakOutput = value.speakOutput;
    let finished = value.finished;
    if(finished){
        logic_en.launch();
        conv.close(speakOutput);
    }else{
        conv.ask(speakOutput);
    }
}); 

app.intent(CHOOSE_OBJECT, (conv) =>{
    const choose = conv.parameters[CHOOSE_ENTITY].toLowerCase();
    const object = conv.parameters[OBJECTS_CHOOSE_ENTITY].toLowerCase();
    let value = logic_en.chooseObject(choose, object, conv.user.storage);
    let speakOutput = value.speakOutput;
    let finished = value.finished;
    if(finished){
        logic_en.launch();
        conv.close(speakOutput);
    }else{
        conv.ask(speakOutput);
    }
}); 

app.intent(HELP, (conv) =>{
    const help = conv.parameters[HELP_ENTITY].toLowerCase();
    let speakOutput = '';
    if(help === 'short'){
        speakOutput = languageStrings.en.translation.SHORT_HELP_MSG;
    }else if(help === 'long'){
        speakOutput = languageStrings.en.translation.HELP_MSG;
    }
    conv.ask(speakOutput);
}); 

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);