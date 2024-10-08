const fs = require('fs');
const path = require('path');

let items = [];
let categories = [];

function initialize() {
    return new Promise ((resolve, reject) => {
        fs.readFile('./data/items.json', 'utf8', (err, data) => {
            if (err){
                reject(err);
            }
            else {
                items = JSON.parse(data);
                //console.log(items);
                
            }

        });

        fs.readFile('./data/categories.json', 'utf8', (err, data) => {
            if (err){
                reject(err);
            }
            else {
                categories = JSON.parse(data);
                console.log(categories);
            }

        });

        resolve ("Both JSON files are successfully read and entered into their respective arrays.");
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