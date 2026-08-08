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
  store.getListFood().then((result) => {
    ctx.reply(result.food.map(food => food.name).join("\n"));
  }, (error) => {
    ctx.reply("Terjadi kesalahan")
  })
})

bot.command('tambah', (ctx) => {
  const name = extractArgs(ctx);
  if (!name) {
    ctx.reply("Gunakan format: /tambah <nama makanan>");
    return;
  }
  store.addFood(name).then(() => {
    ctx.reply(`Berhasil menambahkan "${name}"`);
  }, (error) => {
    console.log(error);
    ctx.reply("Terjadi kesalahan");
  })
})

bot.command('hapus', (ctx) => {
  const name = extractArgs(ctx);
  if (!name) {
    ctx.reply("Gunakan format: /hapus <nama makanan>");
    return;
  }
  store.removeFood(name).then((removed) => {
    if (removed) {
      ctx.reply(`Berhasil menghapus "${removed.name}"`);
    } else {
      ctx.reply(`Tidak ditemukan makanan dengan nama "${name}"`);
    }
  }, (error) => {
    console.log(error);
    ctx.reply("Terjadi kesalahan");
  })
})

bot.command('cari', (ctx) => {
  const query = extractArgs(ctx);
  if (!query) {
    ctx.reply("Gunakan format: /cari <kata kunci>");
    return;
  }
  store.searchFood(query).then((results) => {
    if (results.length === 0) {
      ctx.reply(`Tidak ditemukan makanan dengan kata kunci "${query}"`);
    } else {
      ctx.reply(results.map(food => `${food.name} (${food.is_active ? "aktif" : "nonaktif"})`).join("\n"));
    }
  }, (error) => {
    console.log(error);
    ctx.reply("Terjadi kesalahan");
  })
})

app.get('/semua', function (req, res) {
  store.getListFood().then((result) => {
    res.send(result.food.map(food => food.name).join("\n"));
  }, (error) => {
    res.send("Terjadi kesalahan")
  })
});

app.get('/', function (req, res) {
  store.getListFood().then((result) => {
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
  const textMessage = ctx.message.text.toLowerCase();
  if (textMessage.includes("makan apa") ||
    textMessage.includes("maem apa") ||
    textMessage.includes("lapar") ||
    textMessage.includes("laper")
  ) {
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

function extractArgs(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

function pickOneFood(ctx) {
  store.getListFood().then((result) => {
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
