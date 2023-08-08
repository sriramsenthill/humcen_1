const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, tableData,attachments) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with the email service you want to use (e.g., Gmail, Outlook, etc.)
      auth: {
        user: 'senthilnathan.shanmugam2003@gmail.com', // Replace with your email username
        pass: 'dddfacyznuiwpjyw', // Replace with your email password
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });
   
 // Prepare the HTML table from tableData
 const tableRows = tableData.map((row) => {
  return `<tr><td>${row.label}</td><td>${row.value}</td></tr>`;
});

// Prepare the email body with the table and text
const emailBody = `<p>${text}</p>
  <table style="border-collapse: collapse; width: 100%;">
    <tbody>${tableRows.join('')}</tbody>
  </table>`;

const mailOptions = {
  from: 'senthilnathan.shanmugam2003@gmail.com', // Replace with your email address
  to: to, // The user's email address fetched from MongoDB
  subject: subject,
  html: emailBody,
  attachments:attachments,
};

const info = await transporter.sendMail(mailOptions);
console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

module.exports = sendEmail;