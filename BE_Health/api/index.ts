import express from "express";

import { connect, connection } from "mongoose";
import { configDotenv } from "dotenv";
import { compare, compareSync, hash, hashSync } from "bcrypt";
import { usersModel, registerZodSchema, loginZodSchema } from "../controllers/users.model";
import { validate } from "../utils/zodValidation";
import { z } from "zod";

import cors  from "cors";

import { sign } from "jsonwebtoken";
import { error } from "console";
import morgan from "morgan";
import validateToken from "../middleware/checkToken";

configDotenv();

// await connectDB()
let db: typeof import("mongoose")
async function connectDB() {
  try {
    if(db) return
    db = await connect(process.env.mongodbURI ?? "",);
    console.log('Connected DB')
  } catch (error) {
    console.dir(error);
  }
}

const app = express();

//this will allow us to pull params from .env file
app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
//This middleware will allow us to pull req.body.<params>
const port = process.env.TOKEN_SERVER_PORT;



app.get("/", async (req, res) => {
  return res.send("Express on Vercel123");
});

// REGISTER A USER
app.post("/register", validate(registerZodSchema), async (req, res, next) => {
  try {
    const {username, password, email} = (req as z.infer<typeof registerZodSchema>).body;
    const hashedPassword = hashSync(password, 10);
    if(!username&& !password&& !email){
      res.status(400)  
      throw new Error('All fields are mandatory.')
    }
    if(await usersModel.findOne({email})){
      res.status(400)  
      throw new Error('User already registered.')
    }
    const user = await usersModel.create({  username, password: hashedPassword, email  });
    res.status(201).send(user);
  } catch (error) {
    next(error)
  }
});

// LOGIN A USER
app.post('/login',validate(loginZodSchema),async (req,res,next) =>{
  try {
    const { password, email} = (req as z.infer<typeof loginZodSchema>).body;
    const user = await usersModel.findOne({email})
    if (!user) {
      res.status(400)
      throw new Error('Email not found')
    }
    if(await compare(password,user.password)){
      const token = sign({
        user:{
          email: user.email,
          username: user.username,
          id: user.id
        }
      },process.env.ACCESS_TOKEN_SECRET ?? '',{expiresIn:'10m'})
      res.status(200).json({
        token,
        id:user.id
      })
    }else{
      res.status(401)
      throw new Error('Password mismatch!')
    }
  } catch (error) {
    next(error)
  }
})

app.get('/dblist', async (req, res, next) => {
  try {
    res.send(connection.db.databaseName)
  } catch (error) {
    console.log(error)
    res.status(401)
    next(error)
  }
})


app.get("/users", async (req, res, next) => {
  try {
    const users = await usersModel.find({})
    console.log(users);
    res.status(201).send(users);
  } catch (error) {
    next(error)
  }
});

app.get("/currentuser",validateToken, async (req, res, next) => {
  try {
    const user = await usersModel.findById(req.user.id)
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    next(error)
  }
});

app.listen(4000, async () => await connectDB())

export default app;

