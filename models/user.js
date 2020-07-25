const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

//Define our model
const userSchema = new Schema({
    email: { 
        type: String, 
        unique: true, 
        lowercase: true 
    },
    password: String
});

//On Save Hook, ecrypt password
//Before saving  a model, run this function
userSchema.pre('save', function(next) {

    //Getting access to the user model
    const user = this;

    //generate a salt, then run callback
    bcrypt.genSalt(10, function(err, salt) {
        if(err){return next(err);}

        //hash our password using the salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err){return next(err);}

            //overwrite plain text password with encrypted one
            user.password = hash;
            next();
        });
    });
});

//Compare passwords method
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err){return callback(err);}

        callback(null, isMatch);
    });
}

//Create the model Class of users
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;