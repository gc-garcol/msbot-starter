const translator = require('@vitalets/google-translate-api');

class TranslateStrategy {

    constructor() {

    }

    translate = (text, source, target, callback) => {
        translator(text, {from: source, to: target})
        .then((res) => {
            console.log(res.text);
            callback(res.text);
        });
    }

}

const INSTANCE = new TranslateStrategy();
module.exports = INSTANCE;