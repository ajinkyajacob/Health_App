import express from "express";

import { connect, model, Schema } from "mongoose";
import { configDotenv } from "dotenv";
import { hash, hashSync } from "bcrypt";
import { config } from "dotenv";


configDotenv();

// await connectDB()

async function connectDB() {
  try {
    await connect(process.env.mongodbURI ?? "",);
    console.log('Connected DB')
  } catch (error) {
    console.dir(error);
  }
}

const app = express();

//this will allow us to pull params from .env file
app.use(express.json());
//This middleware will allow us to pull req.body.<params>
const port = process.env.TOKEN_SERVER_PORT;

const usersModel = model(
  "BE_Health",
  new Schema({ user: {type:String, required:true,unique:true}, password: {type:String, required:true} }),
  'users'
);

app.get("/", async (req, res) => {
  return res.send("Express on Vercel123");
});

// REGISTER A USER
app.post("/register", async (req, res) => {
    try {
        // await connectDB();
        await usersModel.createCollection()
        const userName = req.body.user;
        const hashedPassword = hashSync(req.body.password, 10);
        const user = await usersModel.create({ user: userName, password: hashedPassword });
        console.log(user);
        res.status(201).send(user);
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});


app.get("/users", async (req, res) => {
    try {
        // await connectDB();
        const userName = req.body.name;
        const hashedPassword = await hash(req.body.password, 10);
        const users = await usersModel.find({user:'ajinkya'})
        console.log(users);
        res.status(201).send(users);
    } catch (error) {
        res.status(500)
    }
});

app.listen(4000,async () => await connectDB())

export default app;
