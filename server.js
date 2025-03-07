require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Contact Form Endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, service, message } = req.body;
  const formattedService = service
  .split("-") 
  .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
  .join(" "); 

  if (!name || !email || !service || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Create transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    let mailOptions = {
      from: `"${name}" <${email}>`, 
      to: process.env.EMAIL_USER, 
      subject: `New Form Submission from ${name}`,
      text: message,
      html: `<p><strong>Name: </strong> ${name}</p>
             <p><strong>Email: </strong> ${email}</p>
             <P><strong>Service: </strong>${formattedService}</p>
             <p><strong>Message: </strong> ${message}</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.json({ message: "Message sent successfully! Thank you for contacting us. We will be in touch with you very soon." });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
