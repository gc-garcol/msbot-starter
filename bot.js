// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory, TurnContext } = require('botbuilder');
const TranslateStrategy = require('./TranslateStrategy');

const JAPANESE = 'ja';
const VIETNAMESE = 'vi';

const translator = require('@vitalets/google-translate-api');

let conversationReferences = {};
let adapter;

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            // TranslateStrategy.translate(context.activity.text, VIETNAMESE, JAPANESE, afterTranslate.bind(null, context, next));

            const currentUser = context.activity.from.id;
            conversationReferences[currentUser] = TurnContext.getConversationReference(context.activity);
            adapter = context.adapter;

            translator(context.activity.text, {from: VIETNAMESE, to: JAPANESE})
            .then(async (res) => {
                await adapter.continueConversation(conversationReferences[currentUser], async turnContext => {
                    await turnContext.sendActivity(res.text);
                });
                // By calling next() you ensure that the next BotHandler is run.
                await next();
            });
        });


        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
