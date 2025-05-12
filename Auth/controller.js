import { sendVerificationCode, WelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail } from '../utils/Email.js';
import Usermodel from './model.js';
import bcryptjs from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';
import crypto from 'crypto';
import UserModel from './model.js';



// Signup controller
export const signup = async (req, res) => {
    try {
        const{email,password,name} = req.body;

     //validation
        if(!email || !password || !name) {
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        //if user already exists:
            const userAlreadyExists = await UserModel.findOne({ email });
            console.log("userAlreadyExists", userAlreadyExists);
    
            //if user already exists & verified:
            if (userAlreadyExists && userAlreadyExists.isVerified===true) {
                return res.status(400).json({ success: false, message: "User already exists please log In" });
            }
            
            //if user already exists & not verified :

            if(userAlreadyExists && userAlreadyExists.isVerified === false){
                    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                    userAlreadyExists.verificationCode = newCode;
                    await userAlreadyExists.save();
                    await sendVerificationCode(userAlreadyExists.email, newCode);
                    return res.status(200).json({success: true, message:"Verification code send successfully to to you email"});
            }
        const hashPassword = await bcryptjs.hashSync(password,10)
        const plainPassword = password
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const user = new Usermodel({
            email,
            plainPassword,
            password:hashPassword,
            name,
            verificationCode
            })
        await user.save()
        sendVerificationCode(user.email,verificationCode)
        return res.status(200).json({success:true,message:"Email Verification Code sent successfully",user})
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ error: "Internal serverr error" });
    }
    }
//Verify-Email -Code/OTP
export const verifyemail = async(req,res)=>{
    try{
        const {code}=req.body
        const user = await Usermodel.findOne({
            verificationCode:code
        })
        if(!user) {
            return res.status(400).json({success:false,message:"Invalid or Expired Code"})
        }
        user.isVerified=true,
        user.verificationCode=undefined;
        await user.save()
        await WelcomeEmail(user.email,user.name);
        return res.status(200).json({success:true,user})
    
    }catch(error){
        console.error("verify error:", error.message);
        res.status(500).json({ error: "Internal serverr error" });
    }
};
//Log IN setCookie:
export const login = async(req,res)=>{
    
        const {email,password} = req.body;
        try{
        const user = await Usermodel.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"User not found"})
        }
        const isPasswordValid = await bcryptjs.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({success:false, message:"Invalid creditinals"});
        }
        if(!user.isVerified){
            return res.status(400).json({success:false,message:"LogIn Failed User not Verifed"})
        }
    
        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();
        res.status(200).json({
            success: true,
            message:"Logged in successfully",
            // user:{user,password:undefined,},
        });
    }catch(error){
        res.status(500).json({error:"Internal server error cant login",message:error.message})
    }
}
export const logout = async(req,res)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,message:"Logged out successfully"});

};
//Forgot Password & get Link in mail
export const forgotPassword = async(req,res)=>{
    const {email}= req.body;
    try{
        const user = await Usermodel.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:"user not found"})

        }if(!user.isVerified){
            return res.status(400).json({success:false,message:"Verify your Email"});
        }
        //Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now()+1*60*60*1000;
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiresAt;
        await user.save();
        //send email
        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/-password/${resetToken}`);
res.status(200).json({success:true,message:"reset link sent to your email"});
    }catch(err){
 res.status(400).json({success:false,message: error.message});
 console.log("Error in reset password",err);
    }
}
//Reset Password: after fogot passsword:
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        // Check if password is provided
        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }
        // Find the user by token
        const user = await Usermodel.findOne({ resetPasswordToken: token });
        if (!user) {
            return res.status(400).json({ success: false, message: "Reset token is invalid. User not found." });
        }
        // Check if token is expired
        if (user.resetPasswordExpiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Reset token has expired." });
        }
        // Hash and update the password
        const hashPassword = await bcryptjs.hash(password, 10);
        user.password = hashPassword;
        user.plainPassword = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();
        // Optionally send a success email
        await sendResetSuccessEmail(user.email);
        return res.status(200).json({ success: true, message: "Password has been reset successfully." });
    } catch (error) {
        console.error("Reset Password Error:", error); // For debugging
        return res.status(500).json({ success: false, message: "Server error. " + error.message });
    }
};
//Check the Authnecation by cookie- if user login got cookie & can access if that route another which is 
//not valid then they cant acceess:
export const checkAuth = async (req, res) => {
    try {
        const userId = req.user?.id;

        const user = await Usermodel.findById(userId).select("-password");

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.log("Error in checkAuth:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

