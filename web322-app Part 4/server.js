let services = require('./store-services.js');

const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const path = require('path');
const { NOTIMP } = require('dns');
const exphbs = require("express-handlebars");

const upload = multer(); // no { storage: storage } since we are not using disk storage

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'davd2bevq',
    api_key: '572934367661218',
    api_secret: 'rs5kJAL16dF7Lbe1PXceDURw-jI',
    secure: true
});


app.use(express.static('public'));

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return (
                '<li class="nav-item"><a ' +
                (url == app.locals.activeRoute ? ' class="nav-link active" ' : ' class="nav-link" ') +
                ' href="' +
                url +
                '">' +
                options.fn(this) +
                "</a></li>"
            );
        },
        equal: function (lvalue, rvalue, options) { 

            if (arguments.length < 3) 
        
                throw new Error("Handlebars Helper equal needs 2 parameters"); 
        
            if (lvalue != rvalue) { 
        
                return options.inverse(this); 
        
            } else { 
        
                return options.fn(this); 
        
            } 
        
        },
        safeHTML: function (context) {
            return new Handlebars.SafeString(context);
        },
    }
}));
app.set('view engine', '.hbs');

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

    app.use(function(req,res,next){ 

        let route = req.path.substring(1); 
    
        app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, "")); 
    
        app.locals.viewingCategory = req.query.category; 
    
        next(); 
    
    });

/// Redirects the user to the About page.
app.get('/', (req, res) => {
    res.redirect("/shop");

});

/// Shop page

app.get("/shop", async (req, res) => {
    // Declare an object to store properties for the view
    let viewData = {};
  
    try {
      // declare empty array to hold "item" objects
      let items = [];
  
      // if there's a "category" query, filter the returned items by category
      if (req.query.category) {
        // Obtain the published "item" by category
        items = await services.getPublishedItemsByCategory(req.query.category);
      } else {
        // Obtain the published "items"
        items = await services.getPublishedItems();
      }
  
      // sort the published items by itemDate
      items.sort((a, b) => new Date(b.itemDate) - new Date(a.itemDate));
  
      // get the latest item from the front of the list (element 0)
      let item = items[0];
  
      // store the "items" and "item" data in the viewData object (to be passed to the view)
      viewData.items = items;
      viewData.item = item;
    } catch (err) {
      viewData.message = "no results";
    }
  
    try {
      // Obtain the full list of "categories"
      let categories = await services.getCategories();
  
      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
    } catch (err) {
      viewData.categoriesMessage = "no results";
    }
  
    // render the "shop" view with all of the data (viewData)
    res.render("shop", { data: viewData });
  });

  
app.get('/shop/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};
  
    try{
  
        // declare empty array to hold "item" objects
        let items = [];
  
        // if there's a "category" query, filter the returned items by category
        if(req.query.category){
            // Obtain the published "items" by category
            items = await itemData.getPublishedItemsByCategory(req.query.category);
        }else{
            // Obtain the published "items"
            items = await itemData.getPublishedItems();
        }
  
        // sort the published items by itemDate
        items.sort((a,b) => new Date(b.itemDate) - new Date(a.itemDate));
  
        // store the "items" and "item" data in the viewData object (to be passed to the view)
        viewData.items = items;
  
    }catch(err){
        viewData.message = "no results";
    }
  
    try{
        // Obtain the item by "id"
        viewData.item = await itemData.getItemById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }
  
    try{
        // Obtain the full list of "categories"
        let categories = await itemData.getCategories();
  
        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }
  
    // render the "shop" view with all of the data (viewData)
    res.render("shop", {data: viewData})
  });

/// About page
app.get('/about', (req, res) => {
    res.render('about');

});

/// Items page
app.get('/items', (req, res) => {
    let categoryNum = parseInt(req.query.category);
    let postedDate = req.query.minDate;

    if (categoryNum) {
        services.getItemsByCategory(categoryNum)
            .then((filteredList) => {
                res.render("items", {items: filteredList});
            })
            .catch((err) => {
                res.render("posts", {message: err});
            });
    }
    else if (postedDate) {
        services.getItemsByMinDate(postedDate)
            .then((filteredPosts) => {
                res.render("items", {items: filteredPosts});
            })
            .catch((err) => {
                res.render("posts", {message: err});
            });
    }
    else {
    services.getAllItems()
        .then((itemList) => {
            res.render("items", {items: itemList});
        })
        .catch((err) => {
            res.render("posts", {message: err});
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
            res.render("categories", {categoryItem: categoryList});
        })
        .catch((err) => {
            res.render("posts", {message: err});
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
