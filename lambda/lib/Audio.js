/* CONSTANTS */
const PowerNapSkillConfig = require('../skillconfig.json');

module.exports.skill = {
    appId: PowerNapSkillConfig.appId,
    dynamoDBTableName: "power-nap-production",
};

module.exports.audioData = {
    "0": {
        'title': 'faith hunter',
        'type': 'freeMeditation',
        'id': 0,
        'tagline': 'Power Nap, a six minute meditation by Faith Hunter.',
        'taglineVoiceover': '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/MeditationNameMessagePN.mp3\"/>' + '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ByFaithHunter.mp3\"/>',
        'taglineVoiceoverResume': '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ResumeMessagePN.mp3\"/>',
        'prePlayText': 'Now playing Power Nap, a six minute meditation.',
        'url': 'https://s3.amazonaws.com/power-nap-audio/Power_Nap_Faith.mp3',
        'audioName': 'Power Nap by Faith Hunter',
        'cardTitle': 'faith hunter',
        'backgroundImage': 'https://s3.amazonaws.com/power-nap-prod/GUI/BG-Images/MS_Alexa_Skill_Power_Nap_PowerNapFaith_EchoShow_FireTV_Audioplayer_BG.png',
        'audioImage': 'https://s3.amazonaws.com/power-nap-prod/GUI/Audio-Images/MS_Alexa_Skill_Power_Nap_PowerNapFaith_EchoShow_FireTV_AudioPlayer_Art_Image.png',
        'cardText': 'Power Nap, a six minute meditation.'
    },
    "1": {
        'title': 'franko heke',
        'type': 'freeMeditation',
        'id': 1,
        'tagline': 'Power Nap, a nine minute meditation by Franko Heke.',
        'taglineVoiceover': '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/MeditationNameMessagePN_1.mp3\"/>' + '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ByFrankoHeke.mp3\"/>',
        'taglineVoiceoverResume': '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ResumeMessagePN_1.mp3\"/>',
        'prePlayText': 'Now playing Power Nap, a nine minute meditation.',
        'url': 'https://s3.amazonaws.com/power-nap-audio/Power_Nap_Franko.mp3',
        'audioName': 'Power Nap by Franko Heke.',
        'cardTitle': 'franko heke',
        'backgroundImage': 'https://s3.amazonaws.com/power-nap-prod/GUI/BG-Images/MS_Alexa_Skill_Power_Nap_PowerNapFran_EchoShow_FireTV_Audioplayer_BG.png',
        'audioImage': 'https://s3.amazonaws.com/power-nap-prod/GUI/Audio-Images/MS_Alexa_Skill_Power_Nap_PowerNapFran_EchoShow_FireTV_AudioPlayer_Art_Image.png',
        'cardText': 'Morning Practice, a nine minute meditation.'
    }
};

module.exports.meditation = {
    'faith hunter': 0,
    'franko heke': 1
};

exports.freeMeditations = [0, 1];
