import express from 'express';
import connectDB from './config/db.js';
import router from './routes/authroutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
app.use(
    cors({
      origin: "http://localhost:5173", // Replace with your frontend URL
      credentials: true, // Allow cookies
    })
  );
  
  // Example protected route


app.use(express.json());
app.use(cookieParser());  
const PORT = 100;

connectDB();

app.get('/',(req,res)=>{
    res.send("Hell")
});
 
app.use('/api/',router);

app.get("/api/auth-check", (req, res) => {
    res.json({ user: req.user || null });
  });

app.listen(PORT,()=>{
console.log(`Server on http://localhost:${PORT}`)
});

  