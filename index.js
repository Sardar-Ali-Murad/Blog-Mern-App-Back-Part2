import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';
import morgan from 'morgan';
import cors from "cors"


import fileUpload from "express-fileupload"


import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
// hello
// db and authenticateUser
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRoutes.js';  
import blogRouter from "./routes/blogRoute.js"
// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

import cloudinary from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(fileUpload({ useTempFiles: true }));


app.use(cors({
  credentials: true,  
  origin: ["http://127.0.0.1:5173","https://blog-front-pi-eight.vercel.app"]

}))

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/blog',authenticateUser, blogRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
