const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Trims whitespace from the name
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures that email addresses are unique
        lowercase: true, // Converts email to lowercase
        trim: true, // Trims whitespace from the email
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Ensures the password is at least 6 characters long
    },
    date: {
        type: Date,
        default: Date.now
    },
});

// Export the model
module.exports = mongoose.model('User', userSchema);
