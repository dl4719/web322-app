let services = require('./store-services.js');

const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const path = require('path');
const { NOTIMP } = require('dns');

const upload = multer(); // no { storage: storage } since we are not using disk storage

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'davd2bevq',
    api_key: '572934367661218',
    api_secret: 'rs5kJAL16dF7Lbe1PXceDURw-jI',
    secure: true
});

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
    services.getPublishedItems()
        .then((publishedList) => {
            res.json(publishedList);
        })
        .catch((err) => {
            console.error(`An error has occurred: ${err}`);
        });
    
});

/// About page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));

});

/// Items page
app.get('/items', (req, res) => {
    let categoryNum = parseInt(req.query.category);
    let postedDate = req.query.minDate;

    if (categoryNum) {
        services.getItemsByCategory(categoryNum)
            .then((filteredList) => {
                res.json(filteredList);
            })
            .catch((err) => {
                console.error(`An error has occurred: ${err}`);
            });
    }
    else if (postedDate) {
        services.getItemsByMinDate(postedDate)
            .then((filteredPosts) => {
                res.json(filteredPosts);
            })
            .catch((err) => {
                console.error(`An error has occurred: ${err}`);
            });
    }
    else {
    services.getAllItems()
        .then((itemList) => {
        res.json(itemList);
        })
        .catch((err) => {
        console.error(`An error has occurred: ${err}`);
        });
    }
});

app.get('/item/:value', (req, res) => {
    let requestedProductID = parseInt (req.params.value);

    services.getItemById(requestedProductID)
        .then((requestedItem) => {
            res.send(requestedItem);
        })
        .catch((err) => {
            console.error(`An error has occurred: ${err}`);
        });
})

/// Categories page
app.get('/categories', (req, res) => {
    services.getCategories()
        .then((categoryList) => {
            res.json(categoryList);
        })
        .catch((err) => {
            console.error(`An error has occurred: ${err}`);
        });

});

/// Add item page
app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/addItem.html'));
    
});

/// Post item
app.post('/items/add', upload.single("featureImage"), (req, res) => {
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded)=>{
            processItem(uploaded.url);
        });
    }else{
        processItem("");
    }
    function processItem(imageUrl){
        req.body.featureImage = imageUrl;
        
        services.addItem(req.body)
        .then((newItem) => {
            res.redirect('/items');
        })
        .catch((err) => {
            console.log('An error has occurred when adding an item to the list.\nError msg: ', err);
        });
    }
    
});

/// 404 Error handler
app.use((req, res, next) => {
    res.status(404).send("404 - We're unable to find what you're looking for...");
})
