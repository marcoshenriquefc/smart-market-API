import app from './src/app.js'

const port = 3000 || process.env.PORT;

app.listen(port, () => {
    console.log("====== <> CONEXÃO REALIZADA COM SUCESSO <> ======")
    console.log(`Servidor sendo escutado: http://localhost:${port}`)
})