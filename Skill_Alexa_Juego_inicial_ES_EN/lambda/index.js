// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// We create a language strings object containing all of our strings. 
// The keys for each string will then be referenced in our code
// e.g. requestAttributes.t('WELCOME_MSG')
const languageStrings = require('./text')
const logic_es = require('./logic-es')
const logic_en = require('./logic-en')

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MSG');
        const reprompt = requestAttributes.t('REPROMPT_MSG');
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
        
        const {intent} = handlerInput.requestEnvelope.request;
        const name = intent.slots.name.value;
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            logic_es.initialize()
            logic_es.setName(name)
        }else if(language === 'en-US'){
            logic_en.initialize()
            logic_en.setName(name)
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
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            logic_es.setName(name)
        }else if(language === 'en-US'){
            logic_en.setName(name)
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
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.look(orientation)
        }else if(language === 'en-US'){
            speakOutput = logic_en.look(orientation)
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
        
        const language = handlerInput.requestEnvelope.request.locale;
        let speakOutput = ''
        if(language === 'es-ES'){
            speakOutput = logic_es.interaction(object)
        }else if(language === 'en-US'){
            speakOutput = logic_en.interaction(object)
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
const InventoryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'InventoryIntent';
    },
    handle(handlerInput) {
        let speechText = '';
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speechText = logic_es.inventory()
        }else if(language === 'en-US'){
           speechText = logic_en.inventory()
        }
        
        
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
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speechText = logic_es.take(item)
        }else if(language === 'en-US'){
            speechText = logic_en.take(item)
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
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speechText = logic_es.release(item)
        }else if(language === 'en-US'){
            speechText = logic_en.release(item)
        }
        
        return handlerInput.responseBuilder
            .speak(speechText)
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
        
        let speakOutput = ''
        let finished = false;
        let dead = false;
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.use(object, element).speakOutput
            finished = logic_es.use(object, element).finished
            dead = logic_es.use(object, element).dead
        }else if(language === 'en-US'){
            speakOutput = logic_en.use(object, element).speakOutput
            finished = logic_en.use(object, element).finished
            dead = logic_en.use(object, element).dead
        }
        
        if(finished){
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
            speakOutput = logic_es.where()
        }else if(language === 'en-US'){
            speakOutput = logic_en.where()
        }
        
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
    },
    handle(handlerInput) {
        let speakOutput = ''
        
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const reprompt = requestAttributes.t('REPROMPT_MSG');
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.clue()
        }else if(language === 'en-US'){
            speakOutput = logic_en.clue()
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
        
        const language = handlerInput.requestEnvelope.request.locale;
        if(language === 'es-ES'){
            speakOutput = logic_es.choose(option);
        }else if(language === 'en-US'){
            speakOutput = logic_en.choose(option);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(reprompt)
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const {attributesManager} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MSG');
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

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
/*const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};*/

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

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        NewGameIntentHandler,
        TellNameIntentHandler,
        ChangeNameIntentHandler,
        TellPointsIntentHandler,
        LookIntentHandler,
        InteractionIntentHandler,
        InventoryIntentHandler,
        TakeIntentHandler,
        ReleaseIntentHandler,
        DefaultInteractionIntentHandler,
        UseIntentHandler,
        WhereIntentHandler,
        ClueIntentHandler,
        ChooseIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackRequestHandler,
        SessionEndedRequestHandler
        //IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .addRequestInterceptors(
        LoggingRequestInterceptor,
        LocalizationRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .lambda();
