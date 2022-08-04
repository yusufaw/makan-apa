'use strict';

const fs = require('fs');

const NAMES_PATH = 'food.json';

exports.getListEvent = new Promise((resolve, reject) => {
    fs.readFile(NAMES_PATH, (err, content) => {
        if (err) {
            console.log('Error loading events file:', err);
            reject(err);
        }
        else {
            resolve(JSON.parse(content));
        }
    });
})