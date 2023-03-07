import UserModel from '../models/UserModel.js';
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import dotenv from "dotenv"

dotenv.config()


export class UserController {

    // to POST Method - Register new user
    static registerNewUser = async (req, res) => {
        const {
            name,
            email,
            password,
            confirmPassword
        } = req.body

        // Field Validation's
        if (!name) {
            return res
                .status(422)
                .send({
                    errCamp: 'name',
                    msg: "Campo de nome obrigatório"
                })
        }
        if (!email) {
            return res
                .status(422)
                .send({
                    errCamp: 'email',
                    msg: "Campo de senha obrigatório"
                })
        }

        if (!password) {
            return res
                .status(422)
                .send({
                    errCamp: 'password',
                    msg: "Insira uma senha válida"
                })
        }
        else if (password != confirmPassword) {
            return res
                .status(422)
                .send({
                    errCamp: 'confirmPassword',
                    msg: "As senhas não conferem"
                })
        }


        // User exist
        const userEmailExist = await UserValidation.verifyEmail(email);
        if (userEmailExist) {
            return resverifyEmail
                .status(422)
                .send({
                    err: "userExist",
                    msg: "E-mail ja cadastrado"
                })
        }

        // Create password HASH
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt)

        // Create Object user
        const User = new UserModel({
            name,
            email,
            password: passwordHash
        })

        // Save user on the DB
        User.save((err) => {
            if (!err) {
                res
                    .status(201)
                    .send({
                        err: null,
                        msg: 'Usuario Cadastrado com sucesso'
                    })
            }
            else {
                res
                    .status(500)
                    .send({
                        err: `${err.message} - newRegister`,
                        msg: 'Falha ao cadastrar novo usuário'
                    })
            }
        })
    }

    // to POST Method - Login a user
    static loginUser = async (req, res) => {
        const { email, password, } = req.body

        // Verify field's - E-mail and Password
        if (!email) {
            return res
                .status(422)
                .send({
                    err: 'email',
                    msg: "Campo de senha obrigatório"
                })
        }
        if (!password) {
            return res
                .status(422)
                .send({
                    err: 'password',
                    msg: "Insira uma senha válida"
                })
        }

        //Verify if User exist on DB
        const user = await UserValidation.verifyEmail(email);
        if (!user) {
            return res
                .status(404)
                .send({
                    err: 'userDontExist',
                    msg: "Usuário não existe ou não foi encontrado"
                })
        }

        //Veryfy password match
        const checkPassword = await UserValidation.verifyPassword(password, user.password)
        if (!checkPassword) {
            return res
                .status(404)
                .send({
                    err: 'passwordError',
                    msg: "Senha inválida"
                })
        }

        try {
            const idUser = user;
            const token = UserValidation.createToken(user._id);

            res
                .status(200)
                .send({
                    err: null,
                    msg: "Autenticação realizada com sucesso",
                    token: token,
                    idUser: idUser._id,
                })
        }
        catch (err) {
            console.log(err)
        }
    }
    
    // to POST Method - Validate Token on cookie's
    static validateUserToken = async (req, res) => {
        try {
            const idClient = req.body.idUser
            const tokenClient = req.body.tokenUser;
            const secret = process.env.SECRET

            const userDB = await UserModel.findOne({ _id: idClient })


            //Decode Token 
            try {
                const decodeToken = jwt.verify(tokenClient, secret);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decodeToken && decodeToken.exp > currentTime && currentTime > decodeToken.nbf) {
                    res
                        .status(200)
                        .send({
                            err: null,
                            msg: "Autenticação realizada com sucesso",
                            token: tokenClient,
                            nameUser: userDB.name,
                            idUser: userDB._id,
                        })

                } else {
                    res
                        .status(500)
                        .send({
                            err: "TOKEN_EXPIRED",
                            msg: "ERRO NA VALICAÇÃO"
                        })
                }
            }
            catch {
                res
                    .status(400)
                    .send({
                        err: 'INVALID_TOKEN',
                        msg: "TOKEN INVALIDO"
                    })
            }
        }
        catch (err) {
            console.log(err)
        }
    }

    // to GET Method - Take user date
    static userPage = async (req, res) => {
        const id = req.user._id;

        const user = await UserModel.findOne({ _id: id }, '-password');

        if (!user) {
            return res
                .status(404)
                .send({
                    err: 'userDontExist',
                    msg: 'Usuário não encontrado'
                })
        }

        return res
            .status(200)
            .json(user)
    }

    // to PUT Method - Update user list
    static addListToUser = async (req, res) => {
        const idUser = req.body.idUser;
        const idList = req.body.idList;

        UserModel.updateOne(
            {
                _id: idUser 
            },
            {
                $push: { "lists_product": { idList } }
            },
            (err) => {
                if (!err) {
                    res
                        .status(200)
                        .send({
                            err: null,
                            msg: "Lista adicionada com sucesso"
                        })
                }
                else{
                    res
                    .status(200)
                    .send({
                        err: null,
                        msg: "Erro ao adicionar lista"
                    })
                }
            }
        )
    }


    static verifyUserExist = async (req, res) => {
        const user = req.user

        try {
            const token = UserValidation.createToken(user._id)
            return res
                .status(201)
                .send({
                    err: null,
                    msg: 'Autenticado com sucesso',
                    token: token
                })
        }
        catch {
            return res
                .status(500)
                .send({
                    err: 'failAutentication',
                    msg: 'Falha ao autenticar usuário'
                })
        }
    }


    //TEMP
    static getUser = (req, res) => {
        UserModel
            .find()
            .exec((err, booksFind) => {
                res.status(200).json(booksFind)
            })
    }
}



export class UserValidation {

    static async verifyPassword(pass, userPass) {
        return await bcrypt.compare(pass, userPass)
    }

    static async verifyEmail(emailUser, remove = '') {
        return await UserModel.findOne({ email: emailUser }, remove)
    }

    static createToken(idUser) {
        const secret = process.env.SECRET
        const dataToEncode = {
            id: idUser,
            exp: Math.floor(Date.now() / 1000) + ((60 * 60) + (30 * 60)),
            nbf: Math.floor(Date.now() / 1000),
        }


        const token = jwt.sign(
            dataToEncode,
            secret
        )
        
        return token
    }
}