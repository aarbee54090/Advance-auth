import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",

    
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "aarbee616@gmail.com",
      pass: "oaqg iqmk rzry gaqf",//
    },
  });

  // const SendEmail=async()=>{
  //   try{
  //       const info = await transporter.sendMail({
  //           from: '"Green Zone" <aarbee616@gmail.com>', // sender address
  //           to: email, // list of receivers
  //           subject: "verify your account", // Subject line
  //           text: "Hello world?", // plain text body
  //           html: "<b>Hello world?</b>", // html body
  //         });
  //         console.log(info)
        
  //   }catch(error){
  //      console.log(error) 
  //   }
  // }
  // SendEmail()
