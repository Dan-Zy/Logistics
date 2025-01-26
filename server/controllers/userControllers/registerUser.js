import jwt from "jsonwebtoken";
import { hashPassword } from "../../helpers/userHelper.js";
import User from "../../models/userModel.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const registerUser = async (req, res) => {
  try {
    let { user_name, email, password, full_name, cnic, phone } = req.body;

    console.log("User_Name: ", user_name);
    console.log("Email: ", email);
    console.log("password: ", password);
    console.log("Full_Name: ", full_name);
    console.log("CNIC: ", cnic);
    console.log("Phone: ", phone);
    

    // Check user must enter essential fields
    if (!user_name || !email || !password || !full_name || !cnic || !phone) {
      console.log("Missing required fields");
      return res.status(400).send({ 
        success: false,
        message: "All fields are required" });
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("User already exists");
      return res.status(200).send({
        success: true,
        message: "User already exists. Please login.",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    console.log("Hashed Password:", hashedPassword);

    // // Profile picture path
    // const profilePicture =
    //   req.files && req.files.profilePhoto ? req.files.profilePhoto[0].path : "";
    // console.log("Profile Picture Path:", profilePicture);

    // Generate 6-digit OTP and expiration time
    const verificationOtp = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit number
    const verificationOtpExpires = Date.now() + 300000; // OTP valid for 5 minutes

    // Create new user object
    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
      full_name,
      cnic,
      phone,
    //   profilePicture,
      verificationOtp,
      verificationOtpExpires,
    });

    console.log("New User Data:", newUser);

    // Save user to the database
    const savedUser = await newUser.save();
    console.log("Saved User:", savedUser);

    // Create a JWT token
    const token = await jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content for OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: savedUser.email,
      subject: "Email Verification OTP for CollabLearn",
      text: `Your verification code is: ${verificationOtp}. This code will expire in 5 minutes.`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({
          success: false,
          message: "Error sending OTP email",
        });
      }
      console.log("Verification OTP email sent:", info.response);
      res.status(201).send({
        success: true,
        message:
          "User registered successfully. Please check your email for the OTP code to verify your account.",
        user: savedUser,
        token,
      });
    });
  } catch (error) {
    console.log("Error in Signup: ", error);
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export { registerUser };
