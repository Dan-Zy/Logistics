import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";

const verifyEmail = async (req, res) => {
  try {
    const  token = req.header("Authorization");
    const { otp } = req.body; 

    // Check if token and OTP are provided
    if (!token || !otp) {
      return res.status(400).send({
        success: false,
        message: "Token and OTP are required.",
      });
    }

    // Decode the token to get the user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Find the user by the decoded ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found.",
      });
    }

    // Verify the OTP
    if (user.verificationOtp !== otp || user.verificationOtpExpires < Date.now()) {
      return res.status(400).send({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    // Update user to mark as verified
    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Email verified successfully. You can log in now",
    });

  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export { verifyEmail };
