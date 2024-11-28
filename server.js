// server.js  
import express from "express";  
import cors from "cors";  
import bodyParser from "body-parser";  
import mongoose from "mongoose";  
import twilio from 'twilio';  
import vision from '@google-cloud/vision';
import bcrypt from 'bcrypt';
import axios from 'axios';
import path from "path";  
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';  
import console from "console";
import { type } from "os";
import multer from 'multer';
import { MachineLearningModel } from './machineLearningModel.js';


dotenv.config(); // Load environment variables  

const app = express();  
 
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
// Serve static files from the frontend 'public' directory  
app.use(express.static(path.join(dirname, '../frontend/public')));

// Environment variables   
const accountSid = process.env.TWILIO_ACCOUNT_SID;  
const authToken = process.env.TWILIO_AUTH_TOKEN;  // Use the correct auth token 
const twilioNumber = process.env.TWILIO_NUMBER;  
const emergencyContact = process.env.EMERGENCY_CONTACT;
const emailpassword = process.env.EMAIL_PASSWORD;
const mongourl = process.env.MONGODB_URI;
const nasaApi = process.env.NASA_API_KEY;  


const client = new twilio(accountSid, authToken);  

// Example to send a message (this will only work with test numbers)  
client.messages  
  .create({  
    body: 'Hello from Twilio!',  
    from: '+2349065692168', // Your Twilio test number  
    to: '+234 814 314 6543', // A test number  
  })  
  .then((message) => console.log(message.sid))  
  .catch((error) => console.error(error));  

if (!accountSid || !authToken) {  
  console.error('Twilio credentials are missing.');  
  process.exit(1);  
}  

// Middleware  
app.use(cors());  
app.use(bodyParser.json());  



// Connect to MongoDB  
mongoose.connect(mongourl, {  
  // useNewUrlParser: true,  
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds  
  socketTimeoutMS: 450000, // Increase socket timeout    
})  
.then(() => console.log("MongoDB connected successfully"))  
.catch((err) => console.error("MongoDB connection error:", err));   

const userSchema = new mongoose.Schema({  
  name: String,  
  email: String,  
  password: String  
});  

// Define schema for SOS messages  
const sosMessageSchema = new mongoose.Schema({  
  message: String,
  dateSent: { type: Date, default: Date.now },  
});  

// Create models  
const User = mongoose.model('User', userSchema);  
const SosMessage = mongoose.model('SosMessage', sosMessageSchema);  

// Generating password reset token
function generatePasswordResetToken() {
  return Math.random().toString(36).substr(2, 10);
}

// Send password reset email
function sendPasswordResetEmail( email, token) {
  const transporter = nodemailer.createTransport({
    host: '(link unavailable)',
    port: 587,
    secure: false,
    auth: {
      user: 'mathewoloyede100@gmail.com',
      pass: emailpassword
    }
  });

  const mailOptions = {
    from: 'mathewoloyede100@gmail.com',
    to: email,
    subject: 'Password Reset',
    text: `Reset your password: http://localhost:3000/reset-password?token=${token}`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email sent', info.response);
    }
  });
}

// Forgot Password Route 
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send('User not found');
  }
  const token = generatePasswordResetToken();
  await User.updateOne({ email }, { passwordResetToken: token });
  sendPasswordResetEmail(user.email, token);
  res.send('Password reset email sent');
});

// Reset Password Route
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({ passwordResetToken: token });
  if (!user) {
    return res.status(404).send("Invalid token");
  }
  user.password = bcrypt.hashSync(newPassword, 10);
  user.passwordResetToken = null;
  await user.save();
  res.send('Password updated successfully');
})

// Middleware  
app.use(cors());  
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 

// Serve index.html on the root route  
app.get('/', (req, res) => {  
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));  
});

// SignIn API  
app.post("/Signin", async (req, res) => {  
  const { email, password } = req.body;  
  try {  
    const user = await User.findOne({ email });  
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });  

    const isValidPassword = await bcrypt.compare(password, user.password);  
    if (!isValidPassword) return res.status(401).json({ error: 'Invalid email or password' });  

    res.json({ message: 'Signed in successfully', redirect: '/index' });
  
  } catch (error) {  
    console.error('An error occurred:', error.message);
    // res.status(500).json({ error: 'Failed to sign in' });  
  }  
});  

app.post('/Signup', async (req, res) => {  
  const { signUpname, signUpemail, signUppassword } = req.body;  
  try {  
    const hashedPassword = await bcrypt.hash(signUppassword, 10);  
    const user = new User({ signUpname, signUpemail, signUppassword: hashedPassword });  
    await user.save();  
    res.json({ message: 'Signed up successfully', redirect: '/signin' });
   
  } catch (error) {  
    console.error('An error occurred:', error.message);
    // res.status(500).json({ error: 'Failed to sign up' });  
  }  
}); 


// Endpoint to forget password 
app.post('/forget-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if(!user) {
    return res.status(404).send('User not found');
  }
  const token = generatePasswordResetToken();
  await User.updateOne({ email }, { passwordResetToken: token });
  sendPasswordResetEmail( user.email, token);
  res.send('Password reset email sent')
});

// Endpoint to send SOS messages  
app.post("/api/sos", async (req, res) => {  
  try {  
    const sosMessage = new SosMessage({ message: req.body.message });  
    await sosMessage.save();  

    // Send SMS via Twilio  
    client.messages  
      .create({  
        body: sosMessage.message,  
        from: twilioNumber,  
        to: emergencyContact,   
      })  
      .then((message) => {  
        console.log("SOS message sent:", sosMessage.message);  
        res.json({ status: "SOS message sent!", message: sosMessage.message });  
      })  
      .catch((error) => {  
        console.error('An error occurred:', error.message);
        console.error('Twilio error:', error);  
        res.status(500).json({ error: "Failed to send SOS message" });  
      });  
  } catch (error) {  
    res.status(500).json({ error: "Failed to send SOS message" });  
  }  
});  


// Endpoint to fetch live coverage data
app.get("/api/live-coverage", async (req, res) => {
  try {
    const response = await axios.get('https://api.spacexdata.com/v4/launches/latest');
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch live coverage" });
  }
});


const upload = multer({ dest: './uploads' });

app.post('/api/ai-identifier', upload.single('image'),
 async (req, res) => {
  try {
    
    const image = req.file;
    const labels = await
    MachineLearningModel.predict(image);
    res.json({ labels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch AI identifier'});
  }
  
});

// Endpoint to fetch space guide data
app.get("/api/space-guide", async (req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${nasaApi}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch space guide" });
  }
});

// Endpoint to fetch Astronomy Picture of the Day  
app.get('/api/apod', async (req, res) => {  
  try {  
    const response = await axios.get("https://api.spacex.com/v4/rockets"
);  
    res.json(response.data);  
  } catch (error) {  
    res.status(500).json({ error: "Failed to fetch Astronomy Picture of the Day" });  
  }  
});  

// Endpoint to fetch space news  
app.get('/api/space-news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'space',  // Search query for space-related articles
        apiKey: nasaApi,
        pageSize: 5,  // Fetch only 5 articles
      },
    });

    // Log the full response data to see if it includes articles
    console.log("API Response Data:", JSON.stringify(response.data, null, 2));

    if (response.status !== 200) {
      return res.status(response.status).json({ error: "Failed to fetch space news" });
    }

    const articles = response.data.articles;
    
    if (!articles || articles.length === 0) {
      return res.status(404).json({ error: "No articles found" });
    }

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch space news" });
  }
});


// Endpoint to fetch Mars rover photos  
app.get('/api/mars-rover-photos', async (req, res) => {  
  try {  
    const sol = 1000; // Example sol (Martian day)  
    const response = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${nasaApi}`);  
    res.json(response.data.photos);  
  } catch (error) {  
    res.status(500).json({ error: "Failed to fetch Mars rover photos" });  
  }  
});  

// Endpoint to fetch upcoming space events (as per previous suggestions)  
app.get('/api/upcoming-events',async (req, res) => {  
  try {
    const response = await axios.get('https://launchlibrary.net/1/2/launch?next=1'); // NASA or other launch data
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching NASA launches:", error.message);
    res.status(500).json({ error: "Failed to fetch NASA launch data" });
  }
});  

// Endpoint to fetch NASA mission data
app.get('/api/nasa-missions', async(req, res) => {
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${nasaApi}`)
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching NASA missions:", error.message);
    res.status(500).json({ error: "Failed to fetch NASA missions data" });
  }
});

// Endpoint to fetch SpaceX launch data
app.get('/api/spacex-launches', async(req, res) => {
  try {
    const response = await axios.get('https://api.spacex.com/v4/launches')
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching SpaceX launches:", error.message);
    res.status(500).json({ error: "Failed to fetch SpaceX launches data" });
  }
});

// ESA spacecraft datm]a
app.get('/api/esa-spacecraft', async(req, res) => {
  try {
    const response = await axios.get('https://api.esa.int/spacecraft')
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching ESA spacecraft:", error.message);
    res.status(500).json({ error: "Failed to fetch ESA spacecraft data" });
  }
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




