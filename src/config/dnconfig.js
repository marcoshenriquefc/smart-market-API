import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const userDB = process.env.DB_USER;
const passDB = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${userDB}:${passDB}@smartmarket.ymstrgv.mongodb.net/smartMarket-data`);

const db = mongoose.connection;

export default db;