'use strict';

module.exports.getTemplate = (type, params = null) => {
    let d = {};


    switch (type) {

        case 'BodyTemplate1':
            let title = params.title;
            d = {
                'type': 'BodyTemplate1',
                'token': params.id,
                'backButton': 'VISIBLE',
                'backgroundImage': {
                    'contentDescription': 'Background Image',
                    'sources': [{
                        'url': params.backgroundImage
                    }]
                },
                'title': title.toLowerCase()
                    .split(' ')
                    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(' '),
                'textContent': {
                    'primaryText': {
                        'text': params.prePlayText,
                        'type': 'PlainText'
                    }
                }
            };
            break;

        case 'ResumeBodyTemplate1':
            d = {
                'type': 'BodyTemplate1',
                'token': params.id,
                'backButton': 'VISIBLE',
                'backgroundImage': {
                    'contentDescription': 'Background Image',
                    'sources': [{
                        'url': params.backgroundImage
                    }]
                },
                'title': 'Would you like to resume',
                'textContent': {
                    'primaryText': {
                        'text': params.tagline.replace('.', '?'),
                        'type': 'PlainText'
                    }
                }
            };
            break;


        case 'ListTemplate2':
            d = {
                'type': 'ListTemplate2',
                'token': 'listToken1',
                'title': 'Power Nap',
                'backButton': 'VISIBLE',
                'backgroundImage': {
                    'contentDescription': 'Background Image',
                    'sources': [{
                        'url': 'https://s3.amazonaws.com/power-nap-prod/GUI/BG-Images/MS_Alexa_Skill_Power_Nap_Default_FireTV_BodyTemplate7_BG.png'
                    }]
                },
                'listItems': [{
                    'token': 0,
                    'image': {
                        'sources': [{
                            'url': 'https://s3.amazonaws.com/power-nap-prod/GUI/list-templates/MS_Alexa_Skill_Power_Nap_PowerNapFaith_FireTV_ListTemplate2.png'
                        }],
                        'contentDescription': 'Faith Hunter'
                    },
                    'textContent': {
                        'primaryText': {
                            'text': 'Power Nap',
                            'type': 'PlainText'
                        },
                        'secondaryText': {
                            'text': 'By Faith Hunter',
                            'type': 'PlainText'
                        }
                    }
                }, {
                    'token': 1,
                    'image': {
                        'sources': [{
                            'url': 'https://s3.amazonaws.com/power-nap-prod/GUI/list-templates/MS_Alexa_Skill_Power_Nap_PowerNapFran_FireTV_ListTemplate2.png'
                        }],
                        'contentDescription': 'Franko Heke'
                    },
                    'textContent': {
                        'primaryText': {
                            'text': 'Power Nap',
                            'type': 'PlainText'
                        },
                        'secondaryText': {
                            'text': 'By Franko Heke',
                            'type': 'PlainText'
                        }
                    }

                }]
            };
            break;
    }
    return d;
};