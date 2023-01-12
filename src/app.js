import express from "express";
import db from "./config/dnconfig.js";
import routes from "./routes/index.js";

db.on("error", console.log.bind(console, "====== <> ERRO NA CONEXÃO <> ======"));
db.once("open", () => {
    console.log("====== <> CONEXÃO REALIZADA COM SUCESSO <> ======");
});

const app = express();
app.use(express.json());

routes(app);

export default app