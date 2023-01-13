import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const userDB = process.env.DB_USER;
const passDB = process.env.DB_PASS;

console.log(userDB);

mongoose.connect(`mongodb+srv://smartMarketApi02267CI:WdUOX3NckoFRQYFF@smartmarket.ymstrgv.mongodb.net/smartMarket-data`);

const db = mongoose.connection;

export default db;