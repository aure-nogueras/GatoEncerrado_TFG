// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
var persistenceAdapter = getPersistenceAdapter();

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// We create a language strings object containing all of our strings. 
// The keys for each string will then be referenced in our code
// e.g. requestAttributes.t('WELCOME_MSG')
const languageStrings = require('./text')
const logic_es = require('./logic_es/logic-es')
const logic_en = require('./logic_en/logic-en')
const apl = require('./apl_screens')


function getPersistenceAdapter() {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MSG');
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        const header = requestAttributes.t('TITLE_MSG');
        const hint = requestAttributes.t('HINT');
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            logic_es.launch();
        }else if(language === 'en-US'){
            logic_en.launch();
        }
        
        apl.launchScreen(handlerInput, header, hint);
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const NewGameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NewGameIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('INIT_MSG');
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const title1 = requestAttributes.t('BUTTON_INVENTORY');
        const title2 = requestAttributes.t('BUTTON_CLUE');
        
        const {intent} = handlerInput.requestEnvelope.request;
        const name = intent.slots.name.value;
        
        const sessionAttributes = attributesManager.getSessionAttributes();
        let room = '';
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            logic_es.initialize(sessionAttributes);
            logic_es.setName(name, sessionAttributes);
            room = sessionAttributes['roomEs'];
        }else if(language === 'en-US'){
            logic_en.initialize(sessionAttributes);
            logic_en.setName(name, sessionAttributes);
            room = sessionAttributes['roomEn'];
        }
        
        const url = "https://soundgato.s3.eu-west-3.amazonaws.com/bedroom.jpg";
        apl.getRoom(handlerInput, room, url, title1, title2);
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const ContinueGameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ContinueGameIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const title1 = requestAttributes.t('BUTTON_INVENTORY');
        const title2 = requestAttributes.t('BUTTON_CLUE');
        
        const sessionAttributes = attributesManager.getSessionAttributes();
        const language = handlerInput.requestEnvelope.request.locale;
        
        let name;
        let points;
        let room;
        let speakOutput = '';
        let end;
        let url = '';
        
        if(language === 'es-ES'){
            name = sessionAttributes['nameEs'];
            points = sessionAttributes['pointsEs'];
            room = sessionAttributes['roomEs'];
            end = sessionAttributes['deadEs'] || sessionAttributes['finishedEs'];
        }else if(language === 'en-US'){
            name = sessionAttributes['nameEn'];
            points = sessionAttributes['pointsEn'];
            room = sessionAttributes['roomEn'];
            end = sessionAttributes['deadEn'] || sessionAttributes['finishedEn'];
        }
        
        if(end){
            speakOutput = requestAttributes.t('ENDED_GAME');
        }else{
            if(room && name){
                speakOutput = requestAttributes.t('CONTINUE_MSG', name, points, room);
                if(language === 'es-ES'){
                    url = logic_es.continueGame(sessionAttributes);    
                }else if(language === 'en-US'){
                    url = logic_en.continueGame(sessionAttributes);
                }
                apl.getRoom(handlerInput, room, url, title1, title2);
            }else{
                speakOutput = requestAttributes.t('NO_GAME_SAVED');
            }
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const TellNameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TellNameIntent';
    },
    handle(handlerInput) {
        const language = handlerInput.requestEnvelope.request.locale;
        let name = '';
        if(language === 'es-ES'){
            name = logic_es.getName()
        }else if(language === 'en-US'){
            name = logic_en.getName()
        }
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        let speakOutput = requestAttributes.t('NO_NAME_MSG');
        if(name !== ''){
            speakOutput = requestAttributes.t('NAME_MSG',name);
        }
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const ChangeNameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeNameIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const {intent} = handlerInput.requestEnvelope.request;
        const name = intent.slots.name.value;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            logic_es.setName(name, sessionAttributes)
        }else if(language === 'en-US'){
            logic_en.setName(name, sessionAttributes)
        }
        const speakOutput = requestAttributes.t('CHANGE_MSG', name);
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const TellPointsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TellScoreIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        let speakOutput = '';
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.getPoints()
        }else if(language === 'en-US'){
            speakOutput = logic_en.getPoints()
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const LookIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LookIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const orientation = intent.slots.direction.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let speakOutput = ' '
       
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const title1 = requestAttributes.t('BUTTON_INVENTORY');
        const title2 = requestAttributes.t('BUTTON_CLUE');
        const title3 = requestAttributes.t('BUTTON_ROOM');
        let url = '';
        let room = '';
       
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            let value = logic_es.look(orientation);
            speakOutput = value.speechText;
            url = value.url;
            room = sessionAttributes['roomEs'];
        }else if(language === 'en-US'){
            let value = logic_en.look(orientation);
            speakOutput = value.speechText;
            url = value.url;
            room = sessionAttributes['roomEn'];
        }
        
        let header = orientation + ' ' + room;
        
        if(url !== ''){
            apl.getRoomSides(handlerInput, header, url, title1, title2, title3);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const InteractionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'InteractionIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const object = intent.slots.StillObjects.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        const title1 = requestAttributes.t('BUTTON_INVENTORY');
        const title2 = requestAttributes.t('BUTTON_CLUE');
        
        const language = handlerInput.requestEnvelope.request.locale;
        let speakOutput = ''
        let url = ''
        let room;
        
        if(language === 'es-ES'){
            let value = logic_es.interaction(object, sessionAttributes);
            speakOutput = value.speechText;
            url = value.url;
            room = sessionAttributes['roomEs'];
        }else if(language === 'en-US'){
            let value = logic_en.interaction(object, sessionAttributes);
            speakOutput = value.speechText;
            url = value.url;
            room = sessionAttributes['roomEn'];
        }
        
        if(url !== ''){
            apl.getRoom(handlerInput, room , url, title1, title2);
        }
        
           
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const DefaultInteractionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DefaultInteractionIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const something = intent.slots.query.value;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('DEFAULT_MSG',something);
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const InteractionObjectsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'InteractionObjectsIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const something = intent.slots.obj.value;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        let speakOutput = requestAttributes.t('DEFAULT2_MSG');
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        const language = handlerInput.requestEnvelope.request.locale;
        
        if(language === 'es-ES'){
            speakOutput += logic_es.interactionObjects(something);
        }else if(language === 'en-US'){
            speakOutput += logic_en.interactionObjects(something);
        }
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const InventoryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'InventoryIntent'
            
            || (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.arguments.length > 0
            && handlerInput.requestEnvelope.request.arguments[0] === 'inventory');
    },
    handle(handlerInput) {
        let speechText = '';
        let title = '';
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const title1 = requestAttributes.t('BUTTON_ROOM');
        const title2 = requestAttributes.t('BUTTON_RELOAD');
        
        let inventory;
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speechText = logic_es.inventory()
            title = 'Inventario';
            inventory = sessionAttributes['inventoryEs'];
        }else if(language === 'en-US'){
            speechText = logic_en.inventory()
            title = 'Inventory';
            inventory = sessionAttributes['inventoryEn'];
        }
        
        const imgs = requestAttributes.t('IMGS');
        
        apl.getInventory(handlerInput, inventory, title, imgs, title1, title2);
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(reprompt)
            .getResponse();
    }
};
const TakeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TakeIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const item = intent.slots.object.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        let speechText = '';
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speechText = logic_es.take(item, sessionAttributes);
        }else if(language === 'en-US'){
            speechText = logic_en.take(item, sessionAttributes);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(reprompt)
            .getResponse();
    }
};
const ReleaseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReleaseIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const item = intent.slots.object.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let speechText = ''
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speechText = logic_es.release(item, sessionAttributes);
        }else if(language === 'en-US'){
            speechText = logic_en.release(item, sessionAttributes);
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(reprompt)
            .getResponse();
    }
};
const DefaultTakeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DefaultTakeIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const something = intent.slots.query.value;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('DEFAULT_TAKE_MSG',something);
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const DefaultReleaseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DefaultReleaseIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const something = intent.slots.query.value;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('DEFAULT_RELEASE_MSG',something);
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const TakeObjectsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TakeObjectsIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const object = intent.slots.StillObjects.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('TAKE_OBJECTS_MSG',object);
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const ReleaseObjectsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReleaseObjectsIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const object = intent.slots.StillObjects.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('RELEASE_OBJECTS_MSG',object);
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const UseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UseIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const object = intent.slots.object.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const element = intent.slots.element.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
       
        let speakOutput = ''
        let finished = false;
        let dead = false;
        let title = requestAttributes.t('TITLE_MSG');
        
        const language = handlerInput.requestEnvelope.request.locale;
        let name;
        let points;
        
        if(language === 'es-ES'){
            let value = logic_es.use(object, element, sessionAttributes);
            speakOutput = value.speakOutput;
            finished = value.finished;
            dead = value.dead;
            name = sessionAttributes['nameEs'];
            points = sessionAttributes['pointsEs'];
        }else if(language === 'en-US'){
            let value = logic_en.use(object, element, sessionAttributes);
            speakOutput = value.speakOutput;
            finished = value.finished;
            dead = value.dead;
            name = sessionAttributes['nameEn'];
            points = sessionAttributes['pointsEn'];
        }
        let text = requestAttributes.t('WIN_MSG');
        if(dead === true){
            text = requestAttributes.t('LOSE_MSG');
        }
        
        let getName = requestAttributes.t('GET_NAME_MSG', name);
        let getPoints = requestAttributes.t('GET_POINTS_MSG', points);
    
        if(finished){
            apl.getEnd(handlerInput, title, text, getName, getPoints);
            if(language === 'es-ES'){
                logic_es.launch();
            }else if(language === 'en-US'){
                logic_en.launch();
            }
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }else{
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(reprompt)
                .getResponse();
        }
    }
};
const UseObjectIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'UseObjectIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const object = intent.slots.object.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let speakOutput = ''
        let faint = false; 
    
        const language = handlerInput.requestEnvelope.request.locale;
        let name;
        let points;
        
        if(language === 'es-ES'){
            let value = logic_es.useObject(object, sessionAttributes);
            speakOutput = value.speak;
            faint = value.faint;
            name = sessionAttributes['nameEs'];
            points = sessionAttributes['pointsEs'];
        }else if(language === 'en-US'){
            let value = logic_en.useObject(object, sessionAttributes);
            speakOutput = value.speak;
            faint = value.faint;
            name = sessionAttributes['nameEn'];
            points = sessionAttributes['pointsEn'];
        }
        let title = requestAttributes.t('TITLE_MSG');
        
        const getName = requestAttributes.t('GET_NAME_MSG', name);
        const getPoints = requestAttributes.t('GET_POINTS_MSG', points);
        
        if(faint){
            apl.getEnd(handlerInput, title, requestAttributes.t('LOSE_MSG'), getName, getPoints);
            if(language === 'es-ES'){
                logic_es.launch();
            }else if(language === 'en-US'){
                logic_en.launch();
            }
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }else{
        
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(reprompt)
                .getResponse();
        }
    }
};
const CombineObjectsIntentHandler = {
   canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CombineObjectsIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const object = intent.slots.item.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const object2 = intent.slots.itemsegundo.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let speakOutput = ''
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.combine(object, object2, sessionAttributes)
        }else if(language === 'en-US'){
            speakOutput = logic_en.combine(object, object2, sessionAttributes)
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const NumberCodeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NumberCodeIntent'
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const number = intent.slots.number.value;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        let speakOutput = ''
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
          speakOutput = logic_es.numberCode(number, sessionAttributes)
        }else if(language === 'en-US'){
          speakOutput = logic_en.numberCode(number, sessionAttributes)
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const PushSymbolsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PushSymbolsIntent'
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const symbol = intent.slots.symbol.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const symbol2 = intent.slots.symboltwo.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const symbol3 = intent.slots.symbolthree.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const symbol4 = intent.slots.symbolfour.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let speakOutput = ''
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.pushSymbol(symbol, symbol2, symbol3, symbol4, sessionAttributes)
        }else if(language === 'en-US'){
            speakOutput = logic_en.pushSymbol(symbol, symbol2, symbol3, symbol4, sessionAttributes)
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const ReadIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadIntent'
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const author = intent.slots.author.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        let speakOutput = ''
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.read(author)
        }else if(language === 'en-US'){
            speakOutput = logic_en.read(author)
        }
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const GiveCatsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GiveCatIntent'
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const element1 = intent.slots.elementone.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const element2 = intent.slots.elementtwo.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const element3 = intent.slots.elementthree.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const element4 = intent.slots.elementfour.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let speakOutput = '';
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.giveCats(element1, element2, element3, element4, sessionAttributes)
        }else if(language === 'en-US'){
            speakOutput = logic_en.giveCats(element1, element2, element3, element4, sessionAttributes)
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const GiveCats2IntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GiveCatIntentTwo'
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const element1 = intent.slots.elementone.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const element2 = intent.slots.elementtwo.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const element3 = intent.slots.elementthree.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let speakOutput = '';
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.giveCats2(element1, element2, element3, sessionAttributes)
        }else if(language === 'en-US'){
            speakOutput = logic_en.giveCats2(element1, element2, element3, sessionAttributes)
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const GiveCats3IntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GiveCatIntentThree'
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const element1 = intent.slots.elementone.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const element2 = intent.slots.elementtwo.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let speakOutput = '';
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.giveCats3(element1, element2, sessionAttributes)
        }else if(language === 'en-US'){
            speakOutput = logic_en.giveCats3(element1, element2, sessionAttributes)
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const GiveCats4IntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GiveCatIntentFour'
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const element1 = intent.slots.elementone.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        let speakOutput = '';
        let dead = false;
        let name;
        let points;
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            let value = logic_es.giveCats4(element1, sessionAttributes);
            speakOutput = value.speakOutput;
            dead = value.dead;
            name = sessionAttributes['nameEs'];
            points = sessionAttributes['pointsEs'];
        }else if(language === 'en-US'){
            let value = logic_en.giveCats4(element1, sessionAttributes);
            speakOutput = value.speakOutput;
            dead = value.dead;
            name = sessionAttributes['nameEn'];
            points = sessionAttributes['pointsEn'];
        }
        
        let title = requestAttributes.t('TITLE_MSG');
        
        const getName = requestAttributes.t('GET_NAME_MSG', name);
        const getPoints = requestAttributes.t('GET_POINTS_MSG', points);
        
        if(dead){
            apl.getEnd(handlerInput, title, requestAttributes.t('LOSE_MSG'), getName, getPoints);
            if(language === 'es-ES'){
                logic_es.launch();
            }else if(language === 'en-US'){
                logic_en.launch();
            }
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }else{
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(reprompt)
                .getResponse();
        }
    }
};
const WhereIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WhereIntent'
    },
    handle(handlerInput) {
        let speakOutput = '';
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.where();
        }else if(language === 'en-US'){
            speakOutput = logic_en.where();
        }
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const GoToIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GoToIntent'
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const place = intent.slots.place.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        const title1 = requestAttributes.t('BUTTON_INVENTORY');
        const title2 = requestAttributes.t('BUTTON_CLUE');
        
        let speakOutput = ''
        let room = ''
        let url = ''
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            let value = logic_es.go(place, sessionAttributes);
            speakOutput = value.speechText;
            room = value.room;
            url = value.url;
        }else if(language === 'en-US'){
            let value = logic_en.go(place, sessionAttributes);
            speakOutput = value.speechText;
            room = value.room;
            url = value.url;
        }
        
        apl.getRoom(handlerInput, room, url, title1, title2);
       
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const ClueIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ClueIntent'
            
            || (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.arguments.length > 0
            && handlerInput.requestEnvelope.request.arguments[0] === 'clue');
    },
    handle(handlerInput) {
        let speakOutput = ''
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.clue(sessionAttributes)
        }else if(language === 'en-US'){
            speakOutput = logic_en.clue(sessionAttributes)
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const BackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BackIntent'
        
            || (handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent'
            && handlerInput.requestEnvelope.request.arguments.length > 0
            && handlerInput.requestEnvelope.request.arguments[0] === 'back');
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        const title1 = requestAttributes.t('BUTTON_INVENTORY');
        const title2 = requestAttributes.t('BUTTON_CLUE');
        
        const sessionAttributes = attributesManager.getSessionAttributes();
        let room;
        
        let speakOutput = requestAttributes.t('NO_RETURN_MSG');
        
        const language = handlerInput.requestEnvelope.request.locale;
        let url = '';
        
        if(language === 'es-ES'){
            room = sessionAttributes['roomEs'];
        }else if(language === 'en-US'){
            room = sessionAttributes['roomEn'];
        }
        
        if(room){
            speakOutput = requestAttributes.t('RETURN_MSG');
            if(language === 'es-ES'){
                url = logic_es.getUrl(room);
            }else if(language === 'en-US'){
                url = logic_en.getUrl(room);
            }
            
            apl.getRoom(handlerInput, room, url, title1, title2);
        }
       
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const ChooseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChooseIntent'
    },
    handle(handlerInput) {
        let speakOutput = ''
        const {intent} = handlerInput.requestEnvelope.request;
        const option = intent.slots.choose.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        let name;
        let points;
        
        let finished = false;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            let value = logic_es.choose(option, sessionAttributes);
            speakOutput = value.speakOutput;
            finished = value.finished;
            name = sessionAttributes['nameEs'];
            points = sessionAttributes['pointsEs'];
        }else if(language === 'en-US'){
            let value = logic_en.choose(option, sessionAttributes);
            speakOutput = value.speakOutput;
            finished = value.finished;
            name = sessionAttributes['nameEn'];
            points = sessionAttributes['pointsEn'];
        }
        
        let title = requestAttributes.t('TITLE_MSG');
        
        const getName = requestAttributes.t('GET_NAME_MSG', name);
        const getPoints = requestAttributes.t('GET_POINTS_MSG', points);
        
        if(finished){
            apl.getEnd(handlerInput, title, requestAttributes.t('LOSE_MSG'), getName, getPoints);
            if(language === 'es-ES'){
                logic_es.launch();
            }else if(language === 'en-US'){
                logic_en.launch();
            }
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }else{
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(reprompt)
                .getResponse();
        }
    }
};
const ChooseObjectIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChooseObjectIntent'
    },
    handle(handlerInput) {
        let speakOutput = ''
        const {intent} = handlerInput.requestEnvelope.request;
        const option = intent.slots.choose.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const object = intent.slots.catobject.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        let finished = false;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        const language = handlerInput.requestEnvelope.request.locale;
        let name;
        let points;
        
        if(language === 'es-ES'){
            let value = logic_es.chooseObject(option, object, sessionAttributes);
            speakOutput = value.speakOutput;
            finished = value.finished;
            name = sessionAttributes['nameEs'];
            points = sessionAttributes['pointsEs'];
        }else if(language === 'en-US'){
            let value = logic_en.choose(option, object, sessionAttributes);
            speakOutput = value.speakOutput;
            finished = value.finished;
            name = sessionAttributes['nameEn'];
            points = sessionAttributes['pointsEn'];
        }
        
        let title = requestAttributes.t('TITLE_MSG');
        
        const getName = requestAttributes.t('GET_NAME_MSG', name);
        const getPoints = requestAttributes.t('GET_POINTS_MSG', points);
  
        if(finished){
            apl.getEnd(handlerInput, title, requestAttributes.t('LOSE_MSG'), getName, getPoints);
            if(language === 'es-ES'){
                logic_es.launch();
            }else if(language === 'en-US'){
                logic_en.launch();
            }
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }else{
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(reprompt)
                .getResponse();
        }
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelpIntent';
    },
    handle(handlerInput) {
        const {intent} = handlerInput.requestEnvelope.request;
        const help = intent.slots.help.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const language = handlerInput.requestEnvelope.request.locale;
        let speakOutput = '';
        
        if(language === 'es-ES'){
            if(help === 'corta'){
                speakOutput = requestAttributes.t('SHORT_HELP_MSG');
            }else{
                speakOutput = requestAttributes.t('HELP_MSG');  
            }
        }else if(language === 'en-US'){
            if(help === 'short'){
                speakOutput = requestAttributes.t('SHORT_HELP_MSG');
            }else{
                speakOutput = requestAttributes.t('HELP_MSG');  
            }
        }
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MSG');
       
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const FallbackRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getRequestType(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MSG');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationRequestInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){ //is this a new session?
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            //copy persistent attribute to session attributes
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);//is this a session end?
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') { // skill was stopped or timed out            
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NewGameIntentHandler,
        ContinueGameIntentHandler,
        TellNameIntentHandler,
        ChangeNameIntentHandler,
        TellPointsIntentHandler,
        LookIntentHandler,
        InteractionIntentHandler,
        InventoryIntentHandler,
        TakeIntentHandler,
        ReleaseIntentHandler,
        DefaultInteractionIntentHandler,
        InteractionObjectsIntentHandler,
        DefaultTakeIntentHandler,
        DefaultReleaseIntentHandler,
        TakeObjectsIntentHandler,
        ReleaseObjectsIntentHandler,
        UseIntentHandler,
        UseObjectIntentHandler,
        CombineObjectsIntentHandler,
        NumberCodeIntentHandler,
        PushSymbolsIntentHandler,
        GiveCatsIntentHandler,
        GiveCats2IntentHandler,
        GiveCats3IntentHandler,
        GiveCats4IntentHandler,
        ReadIntentHandler,
        WhereIntentHandler,
        GoToIntentHandler,
        ClueIntentHandler,
        BackIntentHandler,
        ChooseIntentHandler,
        ChooseObjectIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        FallbackRequestHandler
        //IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .addRequestInterceptors(
        LoggingRequestInterceptor,
        LocalizationRequestInterceptor,
        LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor,
        SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistenceAdapter)
    .lambda();