
import jwt from "jsonwebtoken"

//Verify if token is valid
    export default class ValidationAuth{

        static checkToken = (req, res, next) => {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
    
            if(!token){
                res
                    .status(401)
                    .send({
                        err: 'noToken',
                        msg: 'Acesso Negado'
                    })
            }
    
            try{
                const secret = process.env.SECRET;
                jwt.verify(token, secret)
    
                next()
            }
            catch(err){
                res
                    .status(401)
                    .send({
                        err: 'invalidToken',
                        msg: 'Token inválido'
                    })
            }
        }
    }