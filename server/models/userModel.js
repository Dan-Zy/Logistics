import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    user_name: {
        type: String,
        required: true,
        min: 3,
        max: 50,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    },

    full_name: {
        type: String,
        required: true,
        min: 3,
        max: 50,
    },

    cnic: {
        type: String,
        required: true,
        min: 13,
        max: 13
    },

    phone: {
        type: String,
        required: true,
    },

    // role: {
    //     type: String,
    //     required: true,
    //     enum: ['Student' , 'Faculty' , 'Industrial']
    // },

    profilePicture: {
        type: String,
        default: "",
    },

    verificationOtp: {
        type: String,
        required: false
    },
    verificationOtpExpires: {
        type: Date,
        required: false
    }

}, 

{ timestamps: true }

);


const User = mongoose.model('User' , userSchema , 'users');

export default User;