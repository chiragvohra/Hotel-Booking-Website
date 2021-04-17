import express from "express";
import { readdirSync } from "fs";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import auth from './routes/auth.js';
import hotel from './routes/hotel.js';
import booking from './routes/booking.js';
import stripe from './routes/stripe.js';
import morgan from 'morgan'
import path from 'path'


// const morgan = require("morgan");
dotenv.config();

const app = express();

// db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error: ", err));

// middlewares
app.use(cors());
app.use(express.json());
if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}

// route middleware

app.use('/api/users', auth);
app.use('/api/hotel', booking); 
app.use('/api/hotels', hotel); 
app.use('/api/stripe', stripe); 


const __dirname = path.resolve();
if(process.env.NODE_ENV === 'production')
{
    app.use(express.static(path.join(__dirname, '/client/build')));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}
else
{
    app.get('/', (req,res)=>{
        res.send('API is running');
    });        
}


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
