require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api'),
  bot = new TelegramBot(process.env.BOT_TOKEN, {polling: true}),
  Promise = require('bluebird'),
  request = require('request-promise'),
  feed = Promise.promisify(require('feed-read'));

var feedList = [{
  site: 'Jovem Nerd',
  rss: 'http://jovemnerd.com.br/rss'
}, {
  site: 'Tecmundo',
  rss: 'http://rss.tecmundo.com.br/feed'
}, {
  site: 'Exame',
  rss: 'http://feeds.feedburner.com/EXAME-Noticias'
}];

var sites = feedList.map(item => [item.site]);
var answerCallbacks = [];

var options = {
  'reply_markup': {
    keyboard: sites,
    'one_time_keyboard': true
  }
};

bot.on('message', (msg) => {
  let callback = answerCallbacks[msg.chat.id];
  if (callback) {
    delete answerCallbacks[msg.chat.id];
    callback(msg);
  }
});

console.log('Começou!');

bot.onText(/\/start/, (msg) => {
  var chatId = msg.from.id;
  bot.sendMessage(chatId, 'Selecione a fonte RSS', options)
    .then(() => {
      answerCallbacks[chatId] = function(msg) {
        return feed({uri: feedList.find(obj => obj.site === msg.text).rss,
          encoding: 'utf8'})
          .then(articles => {
            console.log(articles);
            let voice = [];

            // todo: pego apenas os 3 primeiros artigos para dentro do
            // array voice.

            // todo: monto a request de sintetizaçao de voz

            // todo: realiza request de fato via promise
          });
          // todo: envia o arquivo via audio
      };
    });
});
