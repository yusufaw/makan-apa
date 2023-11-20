const express = require('express');
const store = require('./src/store.js');
const { Telegraf } = require('telegraf')
const { performance } = require("perf_hooks");
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

var app = express();

const portAvailable = process.env.PORT || 3000
app.listen(portAvailable, function () {
  console.log('Listening on port ' + portAvailable);
});

bot.start((ctx) => ctx.reply('Welcome'))

bot.command('about', (ctx) => {
  ctx.reply('https://github.com/yusufaw/makan-apa')
})

bot.command('apa', (ctx) => {
  pickOneFood(ctx);
})

bot.command('semua', (ctx) => {
  store.getListEvent.then((result) => {
    ctx.reply(result.food.join("\n"));
  }, (error) => {
    ctx.reply("Terjadi kesalahan")
  })
})

app.get('/semua', function (req, res) {
  store.getListEvent.then((result) => {
    res.send(result.food.join("\n"));
  }, (error) => {
    res.send("Terjadi kesalahan")
  })
});

app.get('/', function (req, res) {
  store.getListEvent.then((result) => {
    const randomIndex = between(0, result.food.length - 1);
    const randomFood = result.food[randomIndex]
    console.log(randomFood);
    res.send(randomFood);
  }, (error) => {
    res.send("Terjadi kesalahan")
  })
});

bot.on('text', ctx => {
  const start = performance.now();
  if (ctx.message.text.toLowerCase().includes("makan apa") || ctx.message.text.toLowerCase().includes("maem apa")) {
    pickOneFood(ctx);
  }
  const end = performance.now();
  console.log(`time taken: ${end - start}ms`);
})

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

function pickOneFood(ctx) {
  store.getListFood.then((result) => {
    const activeFood = result.food.filter(food => food.is_active);
    const randomIndex = between(0, activeFood.length - 1);
    const randomFood = activeFood[randomIndex]
    console.log(randomFood);
    ctx.reply(randomFood.name);
  }, (error) => {
    console.log(error);
    ctx.reply("Terjadi kesalahan");
  })
}

bot.launch()
