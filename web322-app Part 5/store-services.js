const mongoose = require('mongoose');
const connectionString = "mongodb+srv://daniel05lu:kB7MukkOh23kSHHx@cluster0.2wc9f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let Schema = mongoose.Schema;

let itemSchema = new Schema({
    id: Number,
    body: String,
    title: String,
    postDate: Date,
    featureImage: String,
    published: Boolean,
    price: Number,
    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    default: null,
    },
});
let Item = mongoose.model('items', itemSchema);

let categorySchema = new Schema({
    id: Number,
    category: String,
})
let Category = mongoose.model('categories', categorySchema);

function initialize() {
    return new Promise ((resolve, reject) => {
        mongoose.connect(connectionString).then(() =>{
            console.log(`Successful sync to Mongoose database.`);
        }).then(() =>{
            resolve(`Successful sync to Mongoose database.`);
        }).catch((err) =>{
            reject(`Unable to establish a connection with the database. Error: ${err}`);
        });
    });
}

function getAllItems(){
    return new Promise ((resolve, reject) => {
        Item.find({}).then((listOfItems) => {
            if (listOfItems.length != 0) {
                resolve(listOfItems, `The list of item(s) was retrieved.`);
            }
            else {
                reject(`No items data can be retrieved at this time.`);
            }
        }).catch((err) => {
            reject(`No items data can be retrieved at this time: ${err}`);
        });
        
     });
}

function getPublishedItems() {
    return new Promise((resolve, reject) => {
        Item.find({published: true}).then((publishedList) => {
            if (publishedList.length > 0) {
                resolve(published, `Retrieved list of published items.`);
            }
            else {
                reject(`No items were published yet.`);
            }
        }).catch((err) => {
            reject(`There was a problem finding the list of published items: ${err}`);
        });
    });
}

function getCategories()
{
    return new Promise ((resolve, reject) => {
        Category.find().then((categoryList) => {
            if (categoryList.length > 0) {
                resolve(categoryList, `Retrieved a list of categories.`);
            }
            else {
                reject(`There were no categories found.`);
            }
        }).catch((err) => {
            reject(`There was an issue fetching the categories: ${err}`);
        });
     });
}

function getItemsByCategory(categoryNum)
{
    return new Promise ((resolve, reject) => {
        Item.find({category: categoryNum}).then((filteredItems) => {
            if (filteredItems.length > 0){
                resolve(filteredItems, `Item(s) of category number < ${categoryNum} > has been found.`)
            }
            else {
                reject(`Unable to fetch items under the category number: ${categoryNum}.`)
            }
        }).catch((err) => {
            reject(`Unable to fetch items under the category number: ${categoryNum}.\n Error: ${err}`);
        });
     });
}

function getItemsByMinDate(minDateStr)
{
    return new Promise ((resolve, reject) => {
        const minDate = new Date(minDateStr);
        Item.find({postDate: { $gte: minDate}}).then((filteredDates) => {
            if (filteredDates.length > 0){
                resolve(filteredDates, `Retrieved items posted from < ${minDate} > and later.`);
            }
            else {
                reject(`No items posted on < ${minDate} > or later.`);
            }
        }).catch((err) => {
            reject(`Problem fetching data: ${err}`);
        });
     });
}

function getItemById(itemID)
{
    return new Promise ((resolve, reject) => {
        Item.find({id: itemID}).then((uniqueID) => {
            if (uniqueID){
                resolve(uniqueID, `Found item with the unique id: ${itemID}`);
            }
            else {
                reject(`No items with the id: ${itemID} were found.`);
            }
        }).catch((err) => {
            reject(`Problem fetching data: ${err}`);
        });
     });
}

function addItem(itemData) 
{
    return new Promise((resolve, reject) => {
        itemData.published = itemData.published? true : false;

        for (const property in itemData){
            if (itemData[property] === ""){
                itemData[property] = null;
            }
        }
        itemData.postDate = new Date();

        const itemToAdd = new Item(itemData);

        itemToAdd.save().then(() => {
            resolve(`Item has been added to the list.`);
        }).catch((err) => {
            reject(`Unable to add the item: ${err}`);
        });
    });
}

function getPublishedItemsByCategory(categoryNum)
{
    return new Promise ((resolve, reject) => {
        Items.find({published: true, category: categoryNum}).then((publishedItems) => {
            if (publishedItems.length > 0){
                resolve(publishedItems, `Retrieved list of items under the category number: ${categoryNum} that are published.`);
            }
            else {
                reject(`There were no published items found under the category number: ${categoryNum}.`);
            }
        }).catch((err) => {
            reject(`There was a problem retrieving data: ${err}`);
        });
     });
}

module.exports = {initialize, getAllItems, getPublishedItems, getCategories, getItemsByCategory, getItemsByMinDate, getItemById, addItem, getPublishedItemsByCategory};