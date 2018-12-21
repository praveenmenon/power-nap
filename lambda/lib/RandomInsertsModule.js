module.exports.launch = [
'<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/FullWelcomeMessagePN_1.mp3\"/>',
'<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/FullWelcomeMessagePN_2.mp3\"/>',
'<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/FullWelcomeMessagePN_3.mp3\"/>',
'<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/FullWelcomeMessagePN_4.mp3\"/>'
];

module.exports.launchEnd = [
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/FullWelcomeMessagePN_5.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/WelcomeBackPN_5.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ResumeMessagePN_5.mp3\"/>'
];

module.exports.subsequentLaunch = [
'<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/WelcomeBackPN_1.mp3\"/>',
'<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/WelcomeBackPN_2.mp3\"/>',
'<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/WelcomeBackPN_3.mp3\"/>',
'<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/WelcomeBackPN_4.mp3\"/>'
];

module.exports.resumeOptions = [
 '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/ResumeMessagePN_2.mp3\"/>'
];

module.exports.stop = [
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/OK.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/GotIt.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/SureThing.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/NoProblem.mp3\"/>'
];

module.exports.stopLast = [
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/PeacefulDay.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/PositiveDay.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/WonderfulDay.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/RelaxedDay.mp3\"/>',
];

module.exports.startOver = [
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/Launching.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/Starting.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/KickingOff.mp3\"/>'
];

module.exports.repeat = [
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/Launching.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/Starting.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/KickingOff.mp3\"/>'
];

module.exports.meditationFirst = [
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/Launching.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/Starting.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/KickingOff.mp3\"/>'
];

module.exports.meditationStarts = [
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/PrePlayMessagePN_3.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/PrePlayMessagePN_4.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/PrePlayMessagePN_5.mp3\"/>'
];

module.exports.meditationLast = [
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/PrePlayMessagePN_6.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/PrePlayMessagePN_7.mp3\"/>',
    '<audio src=\"https://s3.amazonaws.com/power-nap-audio/voiceover/PrePlayMessagePN_8.mp3\"/>'
];

module.exports.displayListTemplateHint = [
    "play a meditation by Franko Heke.",
    "play a meditation by Faith Hunter.",
    "play the first one.",
    "play the second one.",
    "play the last one."
];

module.exports.displayBodyTemplateHint = [
    "play a meditation by Franko Heke.",
    "play a meditation by Faith Hunter.",
    "pause.",
    "stop.",
    "start over.",
    "play next.",
    "play previous"
];
