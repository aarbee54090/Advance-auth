import { transporter } from "./emailConfig.js"
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, Verification_Email_Template, Welcome_Email_Template } from "./EmailTemplate.js";


export const sendVerificationCode = async(email,VerificationCode)=>{
    try{
        const response = await transporter.sendMail({
            from: '"Green Zone"<GreenZone540290@gmail.com>', // sender address,
            to: email, // list of receivers
            subject: "verify your Account", // Subject line
            text: "verify your email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",VerificationCode), // html body
          });
          console.log("Email send succesfully",response)
        }catch(error){
           console.log("Email error")
        }
    }

    //weclome email send:
    
export const WelcomeEmail = async(email,name)=>{
  try{
      const response = await transporter.sendMail({
          from: '"Green Zone"<GreenZone540290@gmail.com>', // sender address,
          to: email, // list of receivers
          subject: "verified Successfull", // Subject line
          text: "Welcome Back", // plain text body
          html: Welcome_Email_Template.replace("{name}",name), // html body
        });
        console.log("Email send succesfully",response)
      }catch(error){
         console.log("Email error")
      }
  }

export const sendPasswordResetEmail = async(email,resetURL)=>{
  try{
      const response = await transporter.sendMail({
          from: '"Green Zone"<GreenZone540290@gmail.com>', // sender address,
          to: email, // list of receivers
          subject: "Reset your password", // Subject line
          text: "Click on link and reset your password bro", // plain text body
          html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
          category: "Password Reset",
        });
 
      }catch(error){
        console.error(`Error sending password reset email`,error);
      }
    }

    export const sendResetSuccessEmail = async(email)=>{
      try{
        const response = await transporter.sendMail({
          from:"Green Zone",
          to: email,
          subject: "Password Reset Successful",
          html: PASSWORD_RESET_SUCCESS_TEMPLATE
      });
      }catch(error){
        console.error(`Error sending password reset Successfull email`,error);
      }
    }