const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

function initialize() {
    return new Promise ((resolve, reject) => {
        let itemsPath = path.join(__dirname, '/data/items.json');
        let categoriesPath = path.join(__dirname, '/data/categories.json');
        fs.readFile(itemsPath, 'utf8', (err, data) => {
            if (err){
                reject(err);
            }
            else {
                items = JSON.parse(data);
                
            }
            fs.readFile(categoriesPath, 'utf8', (err, data) => {
                if (err){
                    reject(err);
                }
                else {
                    categories = JSON.parse(data);
                }
                resolve (items, categories);
            });
        });
    });
}
function getAllItems(){
    return new Promise ((resolve, reject) => {
        if (items.length < 1){
            reject('No data found in items file.');
        }
        else {
            resolve(items);
        }
    });
}

function getPublishedItems() {
    return new Promise ((resolve, reject) => {
        let publishedList = items.filter(product => product.published === true);

        if (publishedList.length < 1){
            reject('No published products were found.');
        }
        else {
            resolve(publishedList);

        }
    });
}

function getCategories() {
    return new Promise ((resolve, reject) => {
        if (categories.length < 1){
            reject('No data found in categories file.');
        }
        else {
            resolve(categories);
        }
    });
}

module.exports = {initialize, getAllItems, getPublishedItems, getCategories};