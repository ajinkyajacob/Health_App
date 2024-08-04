import { configDotenv } from "dotenv";

import { MongoClient, ServerApiVersion } from 'mongodb';


configDotenv()
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(process.env.mongodbURI ?? '', {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}); 
export async function connectDB() {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("DB_Health").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    return {db:client.db('DB_Health'),close:async () => {
      await client.close()
      console.log('connectionc successfully closed')
    }}
}
