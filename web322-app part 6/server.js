const services = require('./store-services.js');
const authData = require('./auth-service.js');

const clientSessions = require("client-sessions");
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

app.use(
    clientSessions({
      cookieName: 'userLogin', // this is the object name that will be added to 'req'
      secret: 'o6LjQ5EVNC28ZgK64hDELM18ScpFQr', // this should be a long un-guessable string.
      duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
      activeDuration: 1000 * 60, // the session will be extended by this many ms each request (1 minute)
    })
  );

app.use(express.urlencoded({extended: true})); 
app.use(express.static('public'));
app.use(function(req, res, next) { 
    res.locals.userLogin = req.userLogin; 
    next(); 
  }); 

  function ensureLogin(req, res, next) {
    if (!req.userLogin.user) {
      res.redirect('/login');
    } else {
      next();
    }
  }

app.set('view engine', 'ejs');

services.initialize().then(authData.initialize()).then(() => {
        return app.listen(HTTP_PORT, () => console.log(`Express http server listening on: ${HTTP_PORT}`));
    // }).then(() => {
    //     return services.getAllItems();
    // }).then(() => {
    //     return services.getPublishedItems();
    // }).then (() => {
    //     return services.getCategories();
    }).catch((err) => {
        console.error(`An error has occurred: ${err}`);
    });

app.use(function(req,res,next){ 

    let route = req.path.substring(1); 

    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, "")); 

    app.locals.viewingCategory = req.query.category; 

    next(); 
});

const formatDate = (dateObj) => {
    let year = dateObj.getFullYear();
    let month = (dateObj.getMonth() + 1).toString();
    let day = dateObj.getDate().toString();
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
app.locals.formatDate = formatDate;

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
    // console.log(viewData.categories);
    // console.log(viewData.items);
    // console.log(viewData.item);
    res.render("shop", { data: viewData });
  });

  app.get('/shop/:id', async (req, res) => {

    // Declare an object to store properties for the view
    let viewData = {};
  
    try{
  
        // declare empty array to hold "item" objects
        let items = [];
  
        // if there's a "category" query, filter the returned posts by category
        if(req.query.category){
            // Obtain the published "posts" by category
            items = await services.getPublishedItemsByCategory(req.query.category);
        }else{
            // Obtain the published "posts"
            items = await services.getPublishedItems();
        }
  
        // sort the published items by postDate
        items.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
  
        // store the "items" and "item" data in the viewData object (to be passed to the view)
        viewData.items = items;
        
  
    }catch(err){
        viewData.message = "no results";
    }
  
    try{
        // Obtain the item by "id"
        viewData.item = await services.getItemByID(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }
  
    try{
        // Obtain the full list of "categories"
        let categories = await services.getCategories();
  
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
app.get('/items', ensureLogin, (req, res) => {
    const categoryNum = parseInt(req.query.category);
    const postedDate = req.query.minDate;

    if (categoryNum) {
        services.getItemsByCategory(categoryNum)
            .then(filteredList => {
                res.render("items", { items: filteredList || [] });
            })
            .catch(err => {
                console.error("Error fetching items by category:", err);
                res.render("items", { items: [] });
            });
    } else if (postedDate) {
        services.getItemsByMinDate(postedDate)
            .then(filteredPosts => {
                res.render("items", { items: filteredPosts || [] });
            })
            .catch(err => {
                console.error("Error fetching items by date:", err);
                res.render("items", { items: [] });
            });
    } else {
        services.getAllItems()
            .then(itemList => {
                res.render("items", { items: itemList || [] });
            })
            .catch(err => {
                console.error("Error fetching all items:", err);
                res.render("items", { items: [] });
            });
    }
});


app.get('/item/value', ensureLogin, (req, res) => {
    let requestedProductID = parseInt (req.params.value);

    services.getItemById(requestedProductID)
        .then((requestedItem) => {
            res.render(requestedItem);
        })
        .catch((err) => {
            res.render("errors", {error: err});
        });
});

/// Add item page
app.get('/items/add', ensureLogin, (req, res) => {
    services.getCategories().then((data) => {
        res.render('addItem', { categories: data });
    }).catch(() => {
        res.render('addItem', { categories: [] });
    });
});

/// Post item
app.post('/items/add', ensureLogin, upload.single("featureImage"), (req, res) => {
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
        .then(() => {
            res.redirect('/items');
        })
        .catch((err) => {
            res.render("errors", {error: err});
        });
    }
});

/// Deletes/removes an item by item id
app.post('/Items/delete/:id', ensureLogin, (req, res) => {

    const itemId = req.params.id;
    services.deletePostById(itemId).then(() => {
        res.redirect('/Items');
    }).catch((err) => {
        console.error(`Error deleting item with ID ${itemId}: ${err}`);
        res.render("errors", { message: "Unable to remove item" });
    });
});

/// Categories page
app.get('/categories', ensureLogin, (req, res) => {
    services.getCategories()
        .then(categoryList => {
            // Ensure categoryList is always an array
            res.render("categories", { categoryItem: categoryList || [] });
        })
        .catch(err => {
            console.error("Error fetching categories:", err);
            res.render("categories", { categoryItem: [] }); // Pass an empty array on error
        });
});

/// Add a category
app.get("/categories/add", ensureLogin, (req, res) => {
    res.render("addCategory");
});

/// Post a category
app.post('/categories/add', ensureLogin, (req, res) => {
    processCategory();

    function processCategory() {
        services.addCategory(req.body).then(() => {
            res.redirect('/categories'); 
        }).catch((err) => {
            console.error(`Error adding category: ${err}`);
            res.render("errors", { message: "Unable to add category" });
        });
    }
});

/// Deletes/removes a category by catregory id
app.post('/categories/delete/:id', ensureLogin, (req, res) => {
    
    const categoryId = req.params.id; 
    services.deleteCategoryById(categoryId).then(() => {
            res.redirect("/categories");
        }).catch((err) => {
            console.error(`Error deleting category with ID ${categoryId}: ${err}`);
            res.render("errors", {message: "Unable to delete category."});
        });
});

/// User authentication and authorization routes
app.get("/login", (req, res) => {
    res.render("login", {errorMessage: null, userName: ""}); 
});

app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent');

    let userData = req.body;
    
    authData.checkUser(userData).then((user) => { 

        req.userLogin.user = { 
    
            userName: user.userName,
    
            email: user.email,
    
            loginHistory: user.loginHistory, 
    
        }
        res.redirect('/items'); 
    
    })
    .catch((err) => {
        res.render("login", {errorMessage: err, userName: req.body.userName});
    });
});



app.get("/register", (req, res) => {
    res.render("register", {successMessage: null, errorMessage: null, userName: ""});
});

app.post("/register", async (req, res) => {
    try {
      const userData = req.body;
  
      // Attempt to register the user
      await authData.registerUser(userData);
  
      // On success, render the login page with a success message
      return res.render("login", { successMessage: "User created", errorMessage: null, userName: req.body.userName});
    } catch (err) {
      // On failure, render the register page with an error message
      return res.render("register", {
        successMessage: null,
        errorMessage: err,
        userName: req.body.userName || "",
      });
    }
  });


app.get("/logout", (req, res) => {
    req.userLogin.reset();
    res.redirect('/');
});

app.get("/userHistory", ensureLogin, (req, res) => {
   res.render("userHistory") ;
});

/// 404 Error handler
app.use((req, res, next) => {
    res.status(404).render("errors");
});