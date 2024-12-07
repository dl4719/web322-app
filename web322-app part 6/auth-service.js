const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName:{
    type: String,
    unique: true,
    required: true,
  },
  password:{
    type: String,
    required: true,
  },
  password2:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  } ,
  loginHistory:[{
    dateTime: {
        type: Date,
        required: true,
    },
    userAgent: {
        type: String,
        required: true,
    },
  }],
});

let User = mongoose.model('users', userSchema);


function initialize() { 

    return new Promise(function (resolve, reject) { 

        let db = mongoose.createConnection("mongodb+srv://daniel05lu:kB7MukkOh23kSHHx@cluster0.2wc9f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"); 

        db.on('error', (err)=>{ 

            return reject(err); // reject the promise with the provided error 

        }); 

        db.once('open', ()=>{ 

           User = db.model("users", userSchema); 

           return resolve(); 

        }); 

    }); 

};

function registerUser(userData) {

    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2) {
            return reject("Passwords do not match,");
        }

        let newUser = new User (userData);

        newUser.save((err) => {
            if (err) {
                if (err.code === 11000) { // Check for duplicate key
                    return reject ("User Name already taken");
                } 
                return reject (`There was an error creating the user: ${err}`); // Other errors
            }
            resolve();
        })
    });
};

function checkUser(userData) {

    return new Promise ((resolve, reject) => {
        User.find({ userName: userData.userName }).then((users) => {
            if (users.length === 0){
                return reject (`Unable to find user: ${userData.userName}`);
            }
            
            if (users[0].password !== userData.password){
                return reject (`Incorrect Password for user: ${userName}`);
            }

            users[0].loginHistory.push({ 
                dateTime: new Date().toString(),
                userAgent: userData.userAgent,
            });

            User.updateOne(
                {userName: users[0].userName},
                {$set: {loginHistory: users[0].loginHistory}}
            ).then(() => {
                return resolve (users[0]);
            }).catch((err) => {
                return reject (`There was an error verifying the user: ${err}`);
            });

        }).catch(() => {
            reject (`Unable to find user: ${userData.userName}`);
        });

    });
};



module.exports = {initialize, registerUser, checkUser};