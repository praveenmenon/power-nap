const alexa = require('ask-sdk');
const constants = require('./lib/Audio');
const RandomModule = require('./lib/RandomInsertsModule');
const moment = require('moment');
const show = require('./lib/EchoShowTemplates');


/* INTENT HANDLERS */

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('launch request attributes:', attributes);
        console.log("playbackInfo in launch request:", JSON.stringify(playbackInfo));

        let prompt, promptOne, promptTwo, random, template, reprompt, end;

        if (playbackInfo.visitCount === 0) {
            console.log("first time [new] user");

            playbackInfo.visitCount++;

            // Prompt Text
            const WelcomePrompt = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/FullWelcomeMessagePN.mp3\"/>';
            const  errorPrompt = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ErrorMessagePN.mp3\"/>';
            promptOne = RandomModule.launch[Math.floor(Math.random() * RandomModule.launch.length)];
            promptTwo = RandomModule.launchEnd[Math.floor(Math.random() * RandomModule.launchEnd.length)];
            prompt = `${WelcomePrompt} ${promptOne} ${promptTwo}`;
            // Re-Prompt Text
            reprompt = `${errorPrompt}`;

            // setting sessions and repeat option
            attributes.cancelSession = 'cancel_true';
            handlerInput.attributesManager.setSessionAttributes(attributes);
            attributes.repeatResponse = prompt;

            // check if device supports display
            if (supportsDisplay(handlerInput)) {
                template = show.getTemplate('ListTemplate2');
                console.log("list template 2");
                handlerInput.responseBuilder.addRenderTemplateDirective(template);
                attributes.responseTemplateSatue = true;
                attributes.responseTemplate = template;
                handlerInput.responseBuilder.addHintDirective(RandomModule.displayListTemplateHint[Math.floor(Math.random() * RandomModule.displayListTemplateHint.length)]);
            }

            return handlerInput.responseBuilder
            .speak(prompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse();
        } else if (!playbackInfo.hasPreviousPlaybackSession && playbackInfo.visitCount > 0) {
            console.log("No previous session");

            playbackInfo.visitCount++;
            const welcomeBack = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/WelcomeBackPN.mp3\"/>';
            const milestoneEnd = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/MilestoneMessagePN-A_2.mp3\"/>';

            switch (playbackInfo.visitCount) {
                case 5:
                case 10:
                case 15:
                case 20:
                case 25:
                case 30:
                const midDaySnooze = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/MilestoneMessagePN-A.mp3\"/>';
                const wayToGo = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/MilestoneMessagePN-A_1.mp3\"/>';
                prompt = welcomeBack + midDaySnooze + wayToGo + milestoneEnd;
                break;

                default:

                random = RandomModule.subsequentLaunch[Math.floor(Math.random() * RandomModule.subsequentLaunch.length)];
                promptTwo = RandomModule.launchEnd[Math.floor(Math.random() * RandomModule.launchEnd.length)];
                prompt = welcomeBack + random + promptTwo;
            }

            if (playbackInfo.listenCount == 10) {
                const superSnoozer = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/MilestoneMessagePN-B.mp3\"/>';
                prompt = welcomeBack + superSnoozer;
            } else if ((playbackInfo.listenCount != 0) && (playbackInfo.listenCount % 25) == 0) {
                random = RandomModule.greetings[Math.floor(Math.random() * RandomModule.greetings.length)];
                prompt = `${random} ${welcomeBack} You\'re a morning meditation master! ${milestoneEnd}`;
            }

            // generic re-prompt

            reprompt = errorPrompt;

            // check if display is supported
            if (supportsDisplay(handlerInput)) {
                template = show.getTemplate('ListTemplate2');
                console.log("list template 2");
                handlerInput.responseBuilder.addRenderTemplateDirective(template);
                attributes.responseTemplateSatue = true;
                attributes.responseTemplate = template;
                handlerInput.responseBuilder.addHintDirective(RandomModule.displayListTemplateHint[Math.floor(Math.random() * RandomModule.displayListTemplateHint.length)]);
            }

            console.log("prompt:", prompt);
            console.log("reprompt:", reprompt);

            // set sessions and repeat text
            attributes.cancelSession = 'cancel_true';
            attributes.repeatResponse = prompt;
            handlerInput.attributesManager.setSessionAttributes(attributes);

            return handlerInput.responseBuilder
            .speak(prompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse();
        } else {
            console.log("session already exist");
            const welcomeBack = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/WelcomeBackPN.mp3\"/>';
            switch (playbackInfo.visitCount) {
                case 5:
                case 10:
                case 15:
                case 20:
                case 25:
                case 30:
                end = RandomModule.resumeOptions[Math.floor(Math.random() * RandomModule.resumeOptions.length)];
                prompt = welcomeBack + ' You\'ve taken quite a few mid day snoozes!' + constants.audioData[playbackInfo.index.toString()].taglineVoiceoverResume + end;
                break;

                default:
                end = RandomModule.resumeOptions[Math.floor(Math.random() * RandomModule.resumeOptions.length)];
                prompt = welcomeBack + constants.audioData[playbackInfo.index.toString()].taglineVoiceoverResume + end;
            }

            reprompt = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ErrorMessagePN.mp3\"/>';

            console.log("prompt:", prompt);
            console.log("reprompt:", reprompt);

            playbackInfo.visitCount++;
            playbackInfo.inPlaybackSession = false;

            // check if device supports display
            if (supportsDisplay(handlerInput)) {
                console.log("display device");
                template = show.getTemplate('ResumeBodyTemplate1', constants.audioData[playbackInfo.index.toString()]);
                handlerInput.responseBuilder.addRenderTemplateDirective(template);
                attributes.responseTemplateSatue = true;
                attributes.responseTemplate = template;
            }

            // setting sessions and repeat text
            attributes.intentName = 'launchIntent';
            handlerInput.attributesManager.setSessionAttributes(attributes);
            attributes.repeatResponse = prompt;

            return handlerInput.responseBuilder
            .speak(prompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse();
        }

    },
};

const AudioPlayerEventHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.');
    },
    async handle(handlerInput) {
        const {
            requestEnvelope,
            attributesManager,
            responseBuilder
        } = handlerInput;
        const audioPlayerEventName = requestEnvelope.request.type.split('.')[1];
        const {
            playbackSetting,
            playbackInfo
        } = await attributesManager.getPersistentAttributes();

        switch (audioPlayerEventName) {
            case 'PlaybackStarted':
                playbackInfo.token = getToken(handlerInput);
                playbackInfo.index = await getIndex(handlerInput);
                playbackInfo.inPlaybackSession = true;
                playbackInfo.hasPreviousPlaybackSession = true;
                break;
            case 'PlaybackFinished':
                playbackInfo.inPlaybackSession = false;
                playbackInfo.hasPreviousPlaybackSession = false;
                playbackInfo.nextStreamEnqueued = false;
                playbackInfo.listenCount++;
                break;
            case 'PlaybackStopped':
                playbackInfo.token = getToken(handlerInput);
                playbackInfo.index = await getIndex(handlerInput);
                playbackInfo.offsetInMilliseconds = getOffsetInMilliseconds(handlerInput);
                break;
            case 'PlaybackNearlyFinished': {

                if (!playbackInfo.nextStreamEnqueued && !playbackSetting.loop) {
                    break;
                }

                playbackInfo.nextStreamEnqueued = true;

                const enqueueToken = enqueueIndex;
                const playBehavior = 'ENQUEUE';
                const podcast = constants.audioData[enqueueIndex];
                const expectedPreviousToken = playbackInfo.token;
                const offsetInMilliseconds = 0;

                responseBuilder.addAudioPlayerPlayDirective(
                    playBehavior,
                    podcast.url,
                    enqueueToken,
                    offsetInMilliseconds,
                    expectedPreviousToken,
                );
                break;
            }
            case 'PlaybackFailed':
                playbackInfo.inPlaybackSession = false;
                console.log('Playback Failed : %j', handlerInput.requestEnvelope.request.error);
                return;
            default:
                throw new Error('Should never reach here!');
        }

        return responseBuilder.getResponse();
    },
};

const CheckAudioInterfaceHandler = {
    async canHandle(handlerInput) {
        const audioPlayerInterface = ((((handlerInput.requestEnvelope.context || {}).System || {}).device || {}).supportedInterfaces || {}).AudioPlayer;
        return audioPlayerInterface === undefined;
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Sorry, this skill is not supported on this device')
            .withShouldEndSession(true)
            .getResponse();
    },
};

const meditationIntent = {
    async canHandle(handlerInput) {
        console.log("handlerInput in meditationIntent", handlerInput);
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        if (request.type === 'Display.ElementSelected') {
            return true;
        }

        if (!playbackInfo.inPlaybackSession) {
            return request.type === 'IntentRequest' && (request.intent.name === 'meditationIntent' || request.intent.name === 'meditationOnlyIntent');
        }
        if (request.type === 'PlaybackController.PlayCommandIssued') {
            return true;
        }

        if (request.type === 'IntentRequest') {
            return request.intent.name === 'meditationIntent' || request.intent.name === 'meditationOnlyIntent';
        }
    },
    handle(handlerInput) {

        const attributes = handlerInput.attributesManager.getSessionAttributes();
        let meditationID, audioName, prompt, reprompt;

        const meditationName = getResolvedValue(handlerInput.requestEnvelope, 'MeditationNameSlot') || getResolvedValue(handlerInput.requestEnvelope, 'MeditationOnlyNameSlot');
        console.log("meditation name:", meditationName);
        const selectedToken = handlerInput.requestEnvelope.request.token;

        console.log("selectedToken", selectedToken);
        console.log('meditationName:', meditationName);

        if (meditationName === 'faith hunter' || meditationName === 'franko heke' || meditationName === "first" || meditationName === "second" || meditationName === "last") {
            if (meditationName === "first") {
                return controller.play(handlerInput, "", "faith hunter");
            } else if (meditationName === "second" || meditationName === "last") {
                return controller.play(handlerInput, "", "franko heke");
            }
            return controller.play(handlerInput);
        } else if (selectedToken) {
            podcast = constants.audioData[selectedToken.toString()];
            return controller.play(handlerInput, "", podcast.cardTitle);
        } else {

            if (attributes.wrongMeditationCount) {
                meditationID = constants.freeMeditations[Math.floor(Math.random() * constants.freeMeditations.length)];
                prompt = 'I couldn\'t find that meditation, but I think you will like this one.';
                audioName = constants.audioData[meditationID.toString()].cardTitle;

                attributes.wrongMeditationCount = false;
                attributes.repeatResponse = prompt;
                handlerInput.attributesManager.setSessionAttributes(attributes);

                return controller.play(handlerInput, prompt, audioName);
            } else {
                prompt = reprompt = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ErrorMessagePN.mp3\"/>';

                attributes.wrongMeditationCount = true;
                attributes.repeatResponse = prompt;
                handlerInput.attributesManager.setSessionAttributes(attributes);

                return handlerInput.responseBuilder
                    .speak(prompt)
                    .reprompt(reprompt)
                    .withShouldEndSession(false)
                    .getResponse();
            }
        }
    },
};

const ResumeIntent = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        if (!playbackInfo.inPlaybackSession) {
            return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.ResumeIntent';
        }
        if (request.type === 'PlaybackController.PlayCommandIssued') {
            return true;
        }

        if (request.type === 'IntentRequest') {
            return request.intent.name === 'AMAZON.ResumeIntent';
        }
    },
    handle(handlerInput) {
        return controller.resume(handlerInput);
    },
};

const NextPlaybackHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        return playbackInfo.inPlaybackSession &&
            (request.type === 'PlaybackController.NextCommandIssued' ||
                (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NextIntent'));
    },
    handle(handlerInput) {
        return controller.playNext(handlerInput);
    },
};

const PreviousPlaybackHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        return playbackInfo.inPlaybackSession &&
            (request.type === 'PlaybackController.PreviousCommandIssued' ||
                (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.PreviousIntent'));
    },
    handle(handlerInput) {
        return controller.playPrevious(handlerInput);
    },
};

const PausePlaybackHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        return playbackInfo.inPlaybackSession &&
            request.type === 'IntentRequest' &&
            (request.intent.name === 'AMAZON.CancelIntent' ||
                request.intent.name === 'AMAZON.PauseIntent');
    },
    handle(handlerInput) {
        console.log('inside PausePlaybackHandler');
        return controller.stop(handlerInput);
    },
};

const LoopOnHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        return playbackInfo.inPlaybackSession &&
            request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.LoopOnIntent';
    },
    async handle(handlerInput) {
        const playbackSetting = await handlerInput.attributesManager.getPersistentAttributes().playbackSettings;

        playbackSetting.loop = true;

        let start = RandomModule.stop[Math.floor(Math.random() * RandomModule.stop.length)];
        const loopPrompt = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/LoopingPN.mp3\"/>';

        return handlerInput.responseBuilder
            .speak(start + loopPrompt)
            .getResponse();
    },
};

const LoopOffHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        return playbackInfo.inPlaybackSession &&
            request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.LoopOffIntent';
    },
    async handle(handlerInput) {
        const playbackSetting = await handlerInput.attributesManager.getPersistentAttributes().playbackSetting;

        playbackSetting.loop = false;

        let start = RandomModule.stop[Math.floor(Math.random() * RandomModule.stop.length)];
        const loopPrompt = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/StopLoopingPN.mp3\"/>'

        return handlerInput.responseBuilder
            .speak(start + loopPrompt)
            .getResponse();
    },
};

const ShuffleOnHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.ShuffleOnIntent';
    },
    async handle(handlerInput) {
        const {
            playbackInfo,
            playbackSetting,
        } = await handlerInput.attributesManager.getPersistentAttributes();

        playbackSetting.shuffle = true;
        playbackInfo.playOrder = await shuffleOrder();
        playbackInfo.index = 0;
        playbackInfo.offsetInMilliseconds = 0;
        playbackInfo.playbackIndexChanged = true;

        let start = RandomModule.stop[Math.floor(Math.random() * RandomModule.stop.length)];
        return handlerInput.responseBuilder
            .speak(start + '! Shuffling meditations now.')
            .getResponse();
    },
};

const ShuffleOffHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.ShuffleOffIntent';
    },
    async handle(handlerInput) {
        const {
            playbackInfo,
            playbackSetting,
        } = await handlerInput.attributesManager.getPersistentAttributes();

        if (playbackSetting.shuffle) {
            playbackSetting.shuffle = false;
            playbackInfo.index = playbackInfo.index;
        }

        let start = RandomModule.stop[Math.floor(Math.random() * RandomModule.stop.length)];
        return handlerInput.responseBuilder
            .speak(start + '! I\'ll stop shuffling your meditations.')
            .getResponse();

    },
};

const StartOverHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        return playbackInfo.inPlaybackSession &&
            request.type === 'IntentRequest' &&
            (request.intent.name === 'AMAZON.StartOverIntent' || request.intent.name === 'AMAZON.RepeatIntent');
    },
    async handle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);

        playbackInfo.offsetInMilliseconds = 0;

        return controller.play(handlerInput);
    },
};

const RepeatHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;
        console.log("request.intent.name:", request.intent.name);
        console.log("request.type:", request.type);
        console.log("playbackInfo.inPlaybackSession:", playbackInfo.inPlaybackSession);
        return request.type === 'IntentRequest' &&
            request.intent.name === 'RepeatHandler';
    },
    async handle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        if (playbackInfo.inPlaybackSession) {
            playbackInfo.offsetInMilliseconds = 0;
            return controller.play(handlerInput);
        } else {
            let response = attributes.repeatResponse;
            if (response !== '') {
                if (supportsDisplay(handlerInput) && attributes.responseTemplateSatue && attributes.responseTemplateSatue) {
                    let template = attributes.responseTemplate;
                    handlerInput.responseBuilder.addRenderTemplateDirective(template);
                }
                return handlerInput.responseBuilder
                    .speak(response)
                    .withShouldEndSession(false)
                    .getResponse();
            } else {
                return handlerInput.responseBuilder
                    .speak('I could not find any Meditation played previously to start over.')
                    .withShouldEndSession(true)
                    .getResponse();
            }
        }

    },
};

const YesHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;
        console.log("playbackInfo in YesHandler", playbackInfo);

        return !playbackInfo.inPlaybackSession && request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
    },
    async handle(handlerInput) {
        console.log("handleInput in YesHandler", handlerInput);
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        console.log("attributes in YesHandler", JSON.stringify(attributes));

        let prompt;

        if (attributes.intentName) {

            return controller.resume(handlerInput);

        } else {

            if (attributes.yesIntentPromptAgain) {
                meditationID = constants.freeMeditations[Math.floor(Math.random() * constants.freeMeditations.length)];
                prompt = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/FallbackIntentPN.mp3\"/>'
                audioName = constants.audioData[meditationID.toString()].cardTitle;

                attributes.yesIntentPromptAgain = false;
                attributes.repeatResponse = prompt;
                handlerInput.attributesManager.setSessionAttributes(attributes);

                return controller.play(handlerInput, prompt, audioName);
            } else {
                prompt = reprompt = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ErrorMessagePN.mp3\"/>';

                attributes.yesIntentPromptAgain = true;
                attributes.repeatResponse = prompt;
                handlerInput.attributesManager.setSessionAttributes(attributes);

                return handlerInput.responseBuilder
                    .speak(prompt)
                    .reprompt(reprompt)
                    .withShouldEndSession(false)
                    .getResponse();
            }
        }
    },
};

const NoHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;
        console.log("playbackInfo in NoHandler", playbackInfo);

        return !playbackInfo.inPlaybackSession && request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent';
    },
    async handle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        let random, prompt, reprompt;

        if (attributes.intentName) {
            playbackInfo.index = 0;
            playbackInfo.offsetInMilliseconds = 0;
            playbackInfo.playbackIndexChanged = true;
            playbackInfo.hasPreviousPlaybackSession = false;


            random = RandomModule.stop[Math.floor(Math.random() * RandomModule.stop.length)];
            prompt = reprompt = random + '. Would you like to listen to a meditation by Faith Hunter or Franko Heke?';

            // check if display is supported
            if (supportsDisplay(handlerInput)) {
                template = show.getTemplate('ListTemplate2');
                handlerInput.responseBuilder.addRenderTemplateDirective(template);
                attributes.responseTemplateSatue = true;
                attributes.responseTemplate = template;
                handlerInput.responseBuilder.addHintDirective(RandomModule.displayListTemplateHint[Math.floor(Math.random() * RandomModule.displayListTemplateHint.length)]);
            }

            // set sessions
            attributes.intentName = false;
            attributes.cancelSession = 'cancel_true';
            handlerInput.attributesManager.setSessionAttributes(attributes);
            attributes.repeatResponse = prompt;

            return handlerInput.responseBuilder
                .speak(prompt)
                .reprompt(reprompt)
                .withShouldEndSession(false)
                .getResponse();
        } else {

            if (attributes.noIntentPromptAgain) {

                prompt = RandomModule.stop[Math.floor(Math.random() * RandomModule.stop.length)] + '. Have a ' + RandomModule.stopLast[Math.floor(Math.random() * RandomModule.stopLast.length)] + ' day';

                return handlerInput.responseBuilder
                    .speak(prompt)
                    .withShouldEndSession(true)
                    .getResponse();
            } else {
                prompt = reprompt = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ErrorMessagePN.mp3\"/>';

                attributes.noIntentPromptAgain = true;
                attributes.repeatResponse = prompt;
                handlerInput.attributesManager.setSessionAttributes(attributes);

                return handlerInput.responseBuilder
                    .speak(prompt)
                    .reprompt(reprompt)
                    .withShouldEndSession(false)
                    .getResponse();
            }
        }
    },
};

const FallbackIntent = {
    async canHandle(handlerInput) {
        console.log("handlerInput in FallbackIntent", handlerInput);

        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' &&
            request.intent.name === 'AMAZON.FallbackIntent';

    },
    handle(handlerInput) {

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        let prompt = 'I didn\'t catch that. Would you like to listen to a meditation by Faith Hunter or Franko Heke?';
        attributes.repeatResponse = prompt;

        return handlerInput.responseBuilder
            .speak(prompt)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const HelpHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    async handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        let prompt, reprompt;
        const helpBegining = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ErrorMessagePN.mp3\"/>';
        const helpMiddle = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/HelpPN_2.mp3\"/>'
        const helpLast = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/HelpPN_3.mp3\"/>'
        prompt = reprompt = helpBegining + helpMiddle + helpLast;

        attributes.repeatResponse = prompt;
        attributes.responseTemplateSatue = false;

        return handlerInput.responseBuilder
            .speak(prompt)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse();
    },
};

const ExitHandler = {
    async canHandle(handlerInput) {
        const playbackInfo = await getPlaybackInfo(handlerInput);
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' &&
            (request.intent.name === 'AMAZON.StopIntent' ||
                request.intent.name === 'AMAZON.CancelIntent');
    },
    handle(handlerInput) {
        let goodbye = RandomModule.stop[Math.floor(Math.random() * RandomModule.stop.length)];

        return handlerInput.responseBuilder
            .speak(goodbye)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const SystemExceptionHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered';
    },
    handle(handlerInput) {
        console.log(`System exception encountered: ${handlerInput.requestEnvelope.request.reason}`);
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        const message = 'Sorry, this is not a valid command. Please say help to hear what you can say.';

        return handlerInput.responseBuilder
            .speak(message)
            .reprompt(message)
            .getResponse();
    },
};


/* INTERCEPTORS */

const LoadPersistentAttributesRequestInterceptor = {
    async process(handlerInput) {
        const persistentAttributes = await handlerInput.attributesManager.getPersistentAttributes();

        // Check if user is invoking the skill the first time and initialize preset values
        if (Object.keys(persistentAttributes).length === 0) {
            handlerInput.attributesManager.setPersistentAttributes({
                playbackSetting: {
                    loop: false,
                    shuffle: false,
                },
                playbackInfo: {
                    playOrder: [...Array(constants.freeMeditations.length).keys()],
                    index: 0,
                    meditationType: 'freeMeditation',
                    offsetInMilliseconds: 0,
                    playbackIndexChanged: true,
                    token: '',
                    nextStreamEnqueued: false,
                    inPlaybackSession: false,
                    hasPreviousPlaybackSession: false,
                    visitCount: 0,
                    listenCount: 0,
                    bedtimeChillDate: new Date(),
                    bedtimeChillMediaId: 0
                },
            });
        }
    },
};

const SavePersistentAttributesResponseInterceptor = {
    async process(handlerInput) {
        await handlerInput.attributesManager.savePersistentAttributes();
    },
};


/* HELPER FUNCTIONS */

// returns true if the skill is running on a device with a display (show|spot)
function supportsDisplay(handlerInput) {
    const hasDisplay =
        handlerInput.requestEnvelope.context &&
        handlerInput.requestEnvelope.context.System &&
        handlerInput.requestEnvelope.context.System.device &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
    console.log("hasDisplay:", JSON.stringify(handlerInput));
    return hasDisplay;
}

async function getPlaybackInfo(handlerInput) {
    const attributes = await handlerInput.attributesManager.getPersistentAttributes();
    return attributes.playbackInfo;
}

async function canThrowCard(handlerInput) {
    const {
        requestEnvelope,
        attributesManager
    } = handlerInput;
    const playbackInfo = await getPlaybackInfo(handlerInput);

    if (requestEnvelope.request.type === 'IntentRequest' && playbackInfo.playbackIndexChanged) {
        playbackInfo.playbackIndexChanged = false;
        return true;
    }
    return false;
}

const controller = {
    async play(handlerInput, message = '', audioName = null) {
        console.log("handlerInput in controller play", handlerInput);

        const {
            attributesManager,
            responseBuilder
        } = handlerInput;

        const playbackInfo = await getPlaybackInfo(handlerInput);
        const meditationName = audioName || getResolvedValue(handlerInput.requestEnvelope, 'MeditationNameSlot') || getResolvedValue(handlerInput.requestEnvelope, 'MeditationOnlyNameSlot');
        const selectedToken = handlerInput.requestEnvelope.request.token;
        const attributes = attributesManager.getSessionAttributes();

        console.log("MeditationNameSlot:", meditationName);

        playbackInfo.offsetInMilliseconds = 0;

        const {
            playOrder,
            offsetInMilliseconds,
            index
        } = playbackInfo;

        var podcast, token, start;
        const playBehavior = 'REPLACE_ALL';

        if (selectedToken || meditationName) {
            if (constants.meditation[meditationName] !== undefined) {
                podcast = constants.audioData[constants.meditation[meditationName].toString()];
                console.log("podcast meditationName", podcast);
                token = podcast.id;
            } else if (selectedToken) {
                podcast = constants.audioData[selectedToken.toString()];
                console.log("podcast selectedToken", podcast);
                token = podcast.id;
            }
            start = RandomModule.meditationFirst[Math.floor(Math.random() * RandomModule.meditationFirst.length)];
        } else {
            console.log("inside play else, index value:", index);
            podcast = constants.audioData[index.toString()];
            token = index;
            start = RandomModule.meditationFirst[Math.floor(Math.random() * RandomModule.meditationFirst.length)];
        }

        playbackInfo.nextStreamEnqueued = false;
        playbackInfo.meditationType = podcast.type;

        if (message === '') {
            const response = podcast.taglineVoiceover;
            const first = RandomModule.meditationStarts[Math.floor(Math.random() * RandomModule.meditationStarts.length)];
            const end = RandomModule.meditationLast[Math.floor(Math.random() * RandomModule.meditationLast.length)];
            message = start + response + first + end + ' <break time=\"3.00s\"/>';
            console.log("message inside", message);
        }


        console.log('message outside:', message);
        console.log('playbackInfo inside play controller:', JSON.stringify(playbackInfo));
        console.log('podcast inside play controller:', podcast);

        // check display support
        if (supportsDisplay(handlerInput)) {
            template = show.getTemplate('BodyTemplate1', podcast);
            responseBuilder.addRenderTemplateDirective(template);
            attributes.responseTemplateSatue = true;
            attributes.responseTemplate = template;
            handlerInput.responseBuilder.addHintDirective(RandomModule.displayBodyTemplateHint[Math.floor(Math.random() * RandomModule.displayBodyTemplateHint.length)]);
        }

        let title = podcast.title;

        const metadata = {
            "title": 'Power Nap',
            "subtitle": 'By ' + title.toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' '),
            "art": {
                "sources": [{
                    "url": podcast.audioImage
                }]
            },
            "backgroundImage": {
                "sources": [{
                    "url": podcast.backgroundImage
                }]
            }
        };

        attributes.repeatResponse = message;

        responseBuilder
            .speak(message)
            .withShouldEndSession(true)
            .addAudioPlayerPlayDirective(playBehavior, podcast.url, token, offsetInMilliseconds, null, metadata);

        if (await canThrowCard(handlerInput)) {
            const cardTitle = `Playing ${podcast.tagline}`;
            const cardContent = `Playing ${podcast.tagline}`;
            responseBuilder.withSimpleCard(cardTitle, cardContent);
        }

        return responseBuilder.getResponse();
    },

    async resume(handlerInput) {
        console.log("handlerInput in controller resume", handlerInput);
        const {
            attributesManager,
            responseBuilder
        } = handlerInput;

        const playbackInfo = await getPlaybackInfo(handlerInput);
        const attributes = attributesManager.getSessionAttributes();

        const {
            playOrder,
            offsetInMilliseconds,
            index
        } = playbackInfo;

        let podcast, token;
        const playBehavior = 'REPLACE_ALL';

        podcast = constants.audioData[index.toString()];
        token = index;

        playbackInfo.nextStreamEnqueued = false;
        playbackInfo.meditationType = podcast.type;

        let end = RandomModule.meditationLast[Math.floor(Math.random() * RandomModule.meditationLast.length)];
        const resuming = '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/Resuming.mp3\"/>'
        let message = `${resuming} ${podcast.taglineVoiceover} ${end} <break time=\"2.00s\"/>`;

        console.log('message outside:', message);
        console.log('playbackInfo inside play controller:', JSON.stringify(playbackInfo));

        if (supportsDisplay(handlerInput)) {
            let template = show.getTemplate('BodyTemplate1', podcast);
            responseBuilder.addRenderTemplateDirective(template);
            attributes.responseTemplateSatue = true;
            attributes.responseTemplate = template;
            handlerInput.responseBuilder.addHintDirective(RandomModule.displayBodyTemplateHint[Math.floor(Math.random() * RandomModule.displayBodyTemplateHint.length)]);
        }

        let title = podcast.title;

        const metadata = {
            "title": 'Power Nap',
            "subtitle": 'By ' + title.toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' '),
            "art": {
                "sources": [{
                    "url": podcast.audioImage
                }]
            },
            "backgroundImage": {
                "sources": [{
                    "url": podcast.backgroundImage
                }]
            }
        };
        attributes.repeatResponse = message;

        responseBuilder
            .speak(message)
            .withShouldEndSession(true)
            .addAudioPlayerPlayDirective(playBehavior, podcast.url, token, offsetInMilliseconds, null, metadata);

        if (await canThrowCard(handlerInput)) {
            const cardTitle = `Playing ${podcast.tagline}`;
            const cardContent = `Playing ${podcast.tagline}`;
            responseBuilder.withSimpleCard(cardTitle, cardContent);
        }

        return responseBuilder.getResponse();
    },

    async stop(handlerInput) {
        console.log('inside controller stop');

        const playbackInfo = await getPlaybackInfo(handlerInput);

        const {
            playOrder,
            offsetInMilliseconds,
            index
        } = playbackInfo;

        let podcast;
        podcast = constants.audioData[index.toString()];

        let goodbye = RandomModule.stop[Math.floor(Math.random() * RandomModule.stop.length)];
        return handlerInput.responseBuilder
            .speak(goodbye)
            .withShouldEndSession(true)
            .addAudioPlayerStopDirective()
            .getResponse();
    },

    async playNext(handlerInput) {
        const {
            playbackInfo,
            playbackSetting,
        } = await handlerInput.attributesManager.getPersistentAttributes();

        let nextIndex;

        if (playbackInfo.meditationType === 'freeMeditation') {
            if (playbackSetting.shuffle) {
                nextIndex = generateRandomMeditation(constants.freeMeditations, playbackInfo.index);
            } else {
                nextIndex = (playbackInfo.index + 1) % constants.freeMeditations.length;
            }
        }

        console.log('inside next:', nextIndex);
        playbackInfo.index = nextIndex;
        playbackInfo.offsetInMilliseconds = 0;
        playbackInfo.playbackIndexChanged = true;

        return this.play(handlerInput);
    },

    async playPrevious(handlerInput) {
        const {
            playbackInfo,
            playbackSetting,
        } = await handlerInput.attributesManager.getPersistentAttributes();

        let previousIndex = playbackInfo.index - 1;


        if (previousIndex === -1) {
            previousIndex += constants.freeMeditations.length;
        }

        playbackInfo.index = previousIndex;
        playbackInfo.offsetInMilliseconds = 0;
        playbackInfo.playbackIndexChanged = true;

        return this.play(handlerInput);
    },
};

function getToken(handlerInput) {
    // Extracting token received in the request.
    return handlerInput.requestEnvelope.request.token;
}

function getResolvedValue(requestEnvelope, slotName) {
    if (requestEnvelope &&
        requestEnvelope.request &&
        requestEnvelope.request.intent &&
        requestEnvelope.request.intent.slots &&
        requestEnvelope.request.intent.slots[slotName] &&
        requestEnvelope.request.intent.slots[slotName].resolutions &&
        requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority &&
        requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0] &&
        requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values &&
        requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0]
            .values[0] &&
        requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0]
            .value &&
        requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0]
            .value.name) {
        return requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }
    return undefined;
}

async function getIndex(handlerInput) {
    // Extracting index from the token received in the request.
    const tokenValue = parseInt(handlerInput.requestEnvelope.request.token, 10);
    const attributes = await handlerInput.attributesManager.getPersistentAttributes();

    return tokenValue;
}

function getOffsetInMilliseconds(handlerInput) {
    // Extracting offsetInMilliseconds received in the request.
    return handlerInput.requestEnvelope.request.offsetInMilliseconds;
}

function shuffleOrder() {
    const array = [...Array(constants.freeMeditations.length).keys()];
    let currentIndex = array.length;
    let temp;
    let randomIndex;
    // Algorithm : Fisher-Yates shuffle
    return new Promise((resolve) => {
        while (currentIndex >= 1) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temp;
        }
        resolve(array);
    });
}

function generateRandomMeditation(array, value) {
    var num = array[Math.floor(Math.random() * array.length)];
    return (num === value) ? generateRandom(array, value) : num;
}

const skillBuilder = alexa.SkillBuilders.standard();

exports.handler = skillBuilder
    .addRequestHandlers(
        CheckAudioInterfaceHandler,
        LaunchRequestHandler,
        HelpHandler,
        SystemExceptionHandler,
        SessionEndedRequestHandler,
        YesHandler,
        NoHandler,
        meditationIntent,
        NextPlaybackHandler,
        PreviousPlaybackHandler,
        PausePlaybackHandler,
        ResumeIntent,
        LoopOnHandler,
        LoopOffHandler,
        ShuffleOnHandler,
        ShuffleOffHandler,
        StartOverHandler,
        ExitHandler,
        AudioPlayerEventHandler,
        FallbackIntent,
        RepeatHandler
    )
    .addRequestInterceptors(LoadPersistentAttributesRequestInterceptor)
    .addResponseInterceptors(SavePersistentAttributesResponseInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withAutoCreateTable(true)
    .withTableName(constants.skill.dynamoDBTableName)
    .lambda();