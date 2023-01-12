import UserModel from '../models/UserModel.js';
import bcrypt from 'bcrypt';


export default class UserController {

    // to POST Method - Register new user
    static registerNewUser = async (req, res) => {

        const {
            name,
            email,
            password,
            confirmPassword
        } = req.body

        //VALIDATIONS 
        if (!name) {
            return res
                .status(422)
                .send({
                    errCamp: 'name',
                    msg: "Campo de nome obrigatório"
                })
        }
        if(!email){
            return res
                .status(422)
                .send({
                    errCamp: 'email',
                    msg: "Campo de senha obrigatório"
                })
        }

        if(!password){
            return res
                .status(422)
                .send({
                    errCamp: 'password',
                    msg: "Insira uma senha válida"
                })
        }
        else if(password != confirmPassword) {
            return res
                .status(422)
                .send({
                    errCamp: 'confirmPassword',
                    msg: "As senhas não conferem"
                })
        }


        //User exist
        const userEmailExist = await UserModel.findOne({ email : emailUser });
        if(userEmailExist){
            return res
                .status(422)
                .send({
                    err: "userExist",
                    msg: "E-mail ja cadastrado"
                })
        }

        //create password hash
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt)

        //create user
        const User = new UserModel({
            name,
            email,
            password: passwordHash
        })

        User.save((err) => {

            if(!err){
                res
                    .status(201)
                    .send({
                        err: null,
                        msg: 'Usuario Cadastrado com sucesso'
                    })
            }
            else{
                res
                    .status(500)
                    .send({
                        err: `${err.message} - newRegister`,
                        msg: 'Falha ao cadastrar novo usuário'
                    })
            }
        })
        

    }

    //to POST Method - Login a user
    static loginUser = async (req, res) => {
        const { email, password, } = req.body
        

        //Verify E-mail and Password
        if(!email){
            return res
                .status(422)
                .send({
                    err: 'email',
                    msg: "Campo de senha obrigatório"
                })
        }

        if(!password){
            return res
                .status(422)
                .send({
                    err: 'password',
                    msg: "Insira uma senha válida"
                })
        }

        //Verify if user exist on DB
        const user = await UserModel.findOne({ email : email })
        if(!user){
            return res
            .status(404)
            .send({
                err: 'userDontExist',
                msg: "Usuário não existe ou não foi encontrado"
            })
        }

        //Veryfy password match
        const checkPassword = await Validation.verifyPassword(password, user.password)
        
        if(!checkPassword){
            return res
            .status(404)
            .send({
                err: 'passwordError',
                msg: "Senha inválida"
            })
        }
    }

    //TEMP
    static getUser = (req, res) => {
        UserModel
            .find()
            .exec((err, booksFind) =>{
                res.status(200).json(booksFind)
            } )
    }
}

class Validation {

    static async verifyPassword(pass, userPass){
        return await bcrypt.compare(pass, userPass) 
    }
}