import express from "express";

import { connect, connection } from "mongoose";
import { configDotenv } from "dotenv";
import { compare, compareSync, hash, hashSync } from "bcrypt";
import { usersModel, registerZodSchema, loginZodSchema } from "../controllers/users.model";
import { validate } from "../utils/zodValidation";
import { z } from "zod";

import { connectDB as connectDBNative } from "../utils/mongodbConnection";

import cors  from "cors";

import { sign } from "jsonwebtoken";
import { error } from "console";
import morgan from "morgan";
import validateToken from "../middleware/checkToken";
import { ObjectId } from "mongodb";

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
// app.use((err: Error, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({message: err.message, stack:err.stack} )
// })
//This middleware will allow us to pull req.body.<params>
const port = process.env.TOKEN_SERVER_PORT;



app.get("/", async (req, res) => {
  if(req.body.env){
    return res.json({
      ...process.env
    });
  }
  return res.send("Express on Vercel123");
});

// REGISTER A USER
app.post("/register", validate(registerZodSchema), async (req, res, next) => {
  const {db,close} = await connectDBNative()
  const users = db.collection("users");
  try {
    const {username, password, email} = (req as z.infer<typeof registerZodSchema>).body;
    const hashedPassword = hashSync(password, 10);
    if(!username&& !password&& !email){
      res.status(400)  
      throw new Error('All fields are mandatory.')
    }
    if(await users.findOne({email: email})){
      res.status(400)  
      throw new Error('User already registered.')
    }
    const user = await users.insertOne({  username, password: hashedPassword, email  });
    res.status(201).send(await users.findOne({_id:user.insertedId}));
    close()
  } catch (error) {
    next(error)
    close()
  }
});

// LOGIN A USER
app.post('/login',validate(loginZodSchema),async (req,res,next) =>{
  const {db,close} = await connectDBNative()
  const users = db.collection('users')
  try {
    const { password, email} = (req as z.infer<typeof loginZodSchema>).body;
    const user = await users.findOne({email})
    if (!user) {
      res.status(400)
      throw new Error('Email not found')
    }
    if(await compare(password,user.password)){
      const token = sign({
        user:{
          email: user.email,
          username: user.username,
          id: user._id
        }
      },process.env.ACCESS_TOKEN_SECRET ?? '',{expiresIn:'10m'})
      res.status(200).json({
        token,
        id:user._id
      })
      close()
    }else{
      res.status(401)
      throw new Error('Password mismatch!')
    }
  } catch (error) {
    next(error)
    close()
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
  const {db,close} = await connectDBNative()
  const users = db.collection('users')
  try {
    const usersData = await users.find({})
    res.status(201).send(usersData);
    close()
  } catch (error) {
    next(error)
    close()
  }
});

app.get("/currentuser",validateToken, async (req, res, next) => {
  const {db,close} = await connectDBNative()
  const users = db.collection('users')
  try {
    const user = await users.findOne({_id: ObjectId.createFromHexString((req as any).user.id)})
    res.status(200).send(user);
    close()
  } catch (error) {
    next(error)
    close()
  }
});

app.listen(4000, async () => await connectDB())

export default app;

