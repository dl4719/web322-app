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

function getItemsByCategory(categoryNum)
{
    let itemCategoryList = [];

    return new Promise ((resolve, reject) => {
        if (categoryNum < 1 || categoryNum > categories.length){
            reject('This category does not exist in our files. Search for another category.');
        }
        else {
            itemCategoryList = items.filter(itemCat => itemCat.category === categoryNum);
            
            if (itemCategoryList.length > 0){
                console.log("An array of the filtered category number was successfully created.");
                resolve(itemCategoryList);
            }
            else {
                reject(`No items were found in category #${categoryNum}`);
            }
        }
    });
}

function getItemsByMinDate(minDateStr)
{
    let itemPostDateList = [];

    return new Promise ((resolve, reject) => {
        for (let i = 0; i < items.length; i++) {
            if(new Date(items[i].postDate) >= new Date(minDateStr)){
                console.log(`The postDate value is greater than minDateStr: ${items[i].postDate}`);
                itemPostDateList.push(items[i]);
            }
            else {
                console.log(`The postDate value is less than minDateStr: ${items[i].postDate}`);
            }
        }

        if (itemPostDateList.length < 1) {
            console.error(`There is no item that has been posted for ${minDatestr}`);
            reject(itemPostDateList);
        }

        resolve(itemPostDateList);
        
    });

}

function getItemById(id)
{
    let uniqueItem = items.filter(specialItem => specialItem.id === id);

    return new Promise ((resolve, reject) => {
        if (uniqueItem) {
            console.log(`The item with the unique id: ${id} was found.`);
            resolve(uniqueItem);
        }
        else {
            console.error(`The item with the unique id: ${id} could not be found. Try another product ID.`);
            reject(uniqueItem);
        }
    });

}

function addItem(itemData) 
{
    let currentDate, formattedDate;
    return new Promise ((resolve, reject) => {
        if (itemData.published === undefined){
            itemData.published = false;
            reject(err);
        }
        else {
            itemData.published = true;
            currentDate = new Date();
            formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
            itemData.postDate = formattedDate;
        }

        itemData.id = itemData.length + 1;
        items.push(itemData);

        resolve(itemData);

    });
}

function getPublishedItemsByCategory(categoryNum)
{
    return new Promise ((resolve, reject) => {
        let publishedCategory = items.filter(product => product.published === true && product.category === categoryNum);

        if (publishedCategory.length < 1){
            reject('No published products were found.');
        }
        else {
            resolve(publishedCategory);
            
        }
    });
}

module.exports = {initialize, getAllItems, getPublishedItems, getCategories, getItemsByCategory, getItemsByMinDate, getItemById, addItem, getPublishedItemsByCategory};