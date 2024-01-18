import nodemailer from "nodemailer";



const sendMail=(mailId, name, sponserid,transactionPassword, password) => {
  const recipient = mailId;
  
  const transporter=nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "shyamkumarbeypore@gmail.com",
        pass: "jurnygdvijzxbpdf",
      },
  })
  const mailOptions = {
    from: `OCTA VIEW GROUP <shyamkumarbeypore@gmail.com>`,
    to: `${recipient}`,
    subject: `Hi ${name}, Registration successful.`,
    text: `Hi ${name}, Welcome to OCTA VIEW`,
    html: `<h4>Congrats! You have joined the OCTA VIEW Group.</h4><p>Your sponserID is <strong>${sponserid}</strong><br/>Username: ${name}<br />Transaction Password: ${transactionPassword}<br />Password: ${password}</p>`,
  
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:-", info.response);
      }
    });
}

export default sendMail


