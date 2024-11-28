const fs = require('fs');
const path = require('path');

let items = [
    {
       id:1,
       category:1,
       postDate:"2023-05-14",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:9.99,
       title:"Lawnmower",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
    {
       id:2,
       category:1,
       postDate:"2023-05-15",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:19.99,
       title:"Weber BBQ",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
    {
       id:3,
       category:2,
       postDate:"2023-05-16",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:439.99,
       title:"PS5",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
    {
       id:4,
       category:2,
       postDate:"2023-05-17",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:459.99,
       title:"XBOX",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
    {
       id:5,
       category:3,
       postDate:"2023-05-18",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:39.99,
       title:"TShirt",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
    {
       id:6,
       category:3,
       postDate:"2023-05-19",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:29.99,
       title:"Shorts",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
    {
       id:7,
       category:4,
       postDate:"2023-05-20",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:19.99,
       title:"Baseball",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
    {
       id:8,
       category:4,
       postDate:"2023-05-21",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:99.99,
       title:"Soccer Ball",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
    {
       id:9,
       category:5,
       postDate:"2023-05-16",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:99.99,
       title:"Dog Food",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
    {
       id:10,
       category:5,
       postDate:"2023-05-16",
       featureImage:"https://dummyimage.com/200x200/000/fff",
       price:9.99,
       title:"Fish Food",
       body:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis fringilla sem efficitur congue. Vestibulum efficitur blandit ultricies. Sed tempus mollis orci id facilisis. Aliquam placerat, ipsum eget egestas malesuada, neque nunc scelerisque felis, ut egestas turpis augue ut nisi. Curabitur vel convallis augue.",
       published:true
    },
 ];

 let categories = [
    { id: 1, name: 'Home, Garden' },
    { id: 2, name: 'Electronics, Computers, Video Games' },
    { id: 3, name: 'Clothing' },
    { id: 4, name: 'Sports & Outdoors' },
    { id: 5, name: 'Pets' }
];
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
        let publishedList = items.filter(product => product.published);

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
            
        }
        else {
            itemData.published = true;
        }
        
        currentDate = new Date();
        formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        itemData.postDate = formattedDate;
        const newId = items.length ? items[items.length - 1].id + 1 : 1;
        itemData.id = newId;
        items.push(itemData);

        resolve(itemData);

    });
}

function getPublishedItemsByCategory(categoryNum)
{
    return new Promise ((resolve, reject) => {
        let publishedCategory = items.filter(product => product.published === true && product.category == categoryNum);

        if (publishedCategory.length < 1){
            reject('No published products were found.');
        }
        else {
            resolve(publishedCategory);
            
        }
    });
}

module.exports = {initialize, getAllItems, getPublishedItems, getCategories, getItemsByCategory, getItemsByMinDate, getItemById, addItem, getPublishedItemsByCategory};