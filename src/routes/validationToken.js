
import jwt from "jsonwebtoken"
import UserModel from "../models/UserModel.js"

//Verify if token is valid
    export default class ValidationAuth{

        static checkToken = async (req, res, next) => {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]

            if(!token){
                return res
                    .status(401)
                    .send({
                        err: 'noToken',
                        msg: 'Acesso Negado'
                    });
            }
    
            try{
                const secret = process.env.SECRET;
                const verify = jwt.verify(token, secret);
                const user = await UserModel.findById(verify.id, '-password');

                if (user) {
                    req.user = user;
                    return next();
                }
                else {
                    return res
                    .status(404)
                    .send({
                        err: 'noUser',
                        msg: 'Usuário não encontrado.'
                    });
                }
            }
            catch(err){
                return res
                    .status(401)
                    .send({
                        err: 'invalidToken',
                        msg: 'Token inválido'
                    })
            }
        }
    }