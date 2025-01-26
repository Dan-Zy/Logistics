 import User from '../../models/userModel.js';
 import jwt from 'jsonwebtoken';
 import { comparePassword } from '../../helpers/userHelper.js';

 export const loginUser = async (req , res) => {

    try {
        const {email , password} = req.body;

        // VALIDATION
        if(!email || !password){
            return res.status(400).send({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        // CHECK USER
        const user = await User.findOne({ email: email });

        if(!user){
            return res.status(401).send({
                success: false,
                message: "Email is not Registered"
            })
        }

         // Check if the user has verified their email
    if (user.verificationOtp) {
        console.log("Verification Required");
        return res.status(403).send({ 
            success: false,
            message: "Please verify your email to login" });
    }

        // PASSWORD CHECKING
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(401).send({
                success: false,
                message: "Incorrect Password"
            })
        }

        const token = await jwt.sign( {id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"} );

        res.status(200).send({
            success: true,
            message: "User Login Successfully",
            user: user,
            token,
        });

    } 
    
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        });
    }

};