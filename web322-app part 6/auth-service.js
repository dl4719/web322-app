const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


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

async function registerUser(userData) {
    if (userData.password !== userData.password2) {
        throw "Passwords do not match";
    }

    try {
        // Encrypt the password using bcrypt
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const newUser = new User(userData);

        // Save the new user to the database
        await newUser.save();
    } catch (err) {
        if (err.code === 11000) { // Check for duplicate key
            throw "User Name already taken";
        } else if (err.message.includes('encrypting the password')) {
            throw "There was an error encrypting the password";
        }
        throw `There was an error creating the user: ${err}`;
    }
};

async function checkUser(userData) {
    try {
        // Fetch the user from the database by userName
        const user = await User.findOne({ userName: userData.userName });
        
        if (!user) {
            throw `Unable to find user: ${userData.userName}`;
        }

        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(userData.password, user.password);

        if (!isPasswordMatch) {
            throw `Incorrect Password for user: ${userData.userName}`;
        }

        // Add the login history entry
        user.loginHistory.push({
            dateTime: new Date(),
            userAgent: userData.userAgent,
        });

        // Save the updated user data
        await user.save();

        return user; // Return the user data
    } catch (err) {
        throw `Error verifying user: ${err}`;
    }
};
module.exports = {initialize, registerUser, checkUser};