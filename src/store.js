'use strict';

const fs = require('fs').promises;

const NAMES_PATH = 'food.json';

async function getListFood() {
    const content = await fs.readFile(NAMES_PATH, 'utf-8');
    return JSON.parse(content);
}

async function saveListFood(data) {
    await fs.writeFile(NAMES_PATH, JSON.stringify(data, null, 4));
}

async function addFood(name) {
    const data = await getListFood();
    data.food.push({ name, is_active: true });
    await saveListFood(data);
    return data;
}

async function removeFood(name) {
    const data = await getListFood();
    const index = data.food.findIndex((food) => food.name.toLowerCase() === name.toLowerCase());
    if (index === -1) {
        return null;
    }
    const [removed] = data.food.splice(index, 1);
    await saveListFood(data);
    return removed;
}

async function searchFood(query) {
    const data = await getListFood();
    return data.food.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()));
}

exports.getListFood = getListFood;
exports.addFood = addFood;
exports.removeFood = removeFood;
exports.searchFood = searchFood;
