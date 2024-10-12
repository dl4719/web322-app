let services = require('./store-services.js');

const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const path = require('path');

app.use(express.static('public'));

services.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`Express http server listening on: ${HTTP_PORT}`));
    })
    .then(() => {
        services.getAllItems()
            .then(() => {
            services.getPublishedItems();
        })
    })
    .then (() => {
        services.getCategories();
    })
    .catch((err) => {
        console.error(`An error has occurred: ${err}`);
    });

/// Redirects the user to the About page.
app.get('/', (req, res) => {
    res.redirect("/about");

});

/// Shop page
app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/shop.html'));
    
});

/// About page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));

});

/// Items page
app.get('/items', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/items.html'));

});

/// Categories page
app.get('/categories', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/categories.html'));

});

/// Add item page
app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/addItem.html'));
    
});

/// 404 Error handler
app.use((req, res, next) => {
    res.status(404).send("404 - We're unable to find what you're looking for...");
})
