import express from "express";
import db from "./config/dnconfig.js";
import routes from "./routes/index.js";
import cors from 'cors'

db.on("error", console.log.bind(console, "====== <> ERRO NA CONEXÃO <> ======"));
db.once("open", () => {
});

const app = express();
app.use(
    express.json(),
    cors()
);

routes(app);

export default app