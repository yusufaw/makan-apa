const express = require('express');
const store = require('./src/store.js')

var app = express();

const portAvailable = process.env.PORT || 3000
app.listen(portAvailable, function () {
  console.log('Listening on port ' + portAvailable);
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

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}
