import ListModel from '../models/listModel.js'
import { UserValidation } from './userController.js';

export default class ListController {
    //to GET Method - list all products
    static listAllProduct = (req, res) => {
        const id = req.query;

        console.log()
        if(Object.keys(id).length <= 0 || !Object.keys(id).includes('user_id')) {
            return res
                .status(500)
                .send({
                    err : 'noParams',
                    msg : 'Nenhum parâmetro enviado ou falta ID'
                })
        }

        ListModel.find(id)
            .populate("user_id", "email")
            .exec((err, ListFind) => {
                res
                    .status(200)
                    .send(ListFind)
            })
    }

    //to POST Method - Create a new List to product
    static createNewList = (req, res) => {
        const list = new ListModel(req.body);

        if (list) {
            list.save((err) => {
                if (!err) {
                    res
                        .status(200)
                        .send(list)
                }
                else {
                    res
                        .status(500)
                        .send({
                            err: err.message,
                            msg: 'Houve um erro ao cadastrar'
                        })
                }
            })
        }
    }

    //to POST Methods - Add itens in itens_list
    static addItensList = async (req, res) => {
        const { list_id, ...product } = req.body;
        const prodCheck = Validation.verifyObjectToSend(product)

        if (list_id && prodCheck) {
            ListModel.findOneAndUpdate(
                { _id: list_id },
                {
                    $push: {
                        "itens_list": product
                    }
                },
                (err) => {
                    if (!err) {
                        res
                            .status(200)
                            .send({
                                err: null,
                                msg: "Produto adicionado com sucesso"
                            })
                    }
                }
            )
        }
        else {
            res
                .status(500)
                .send({
                    err: 'invalidField',
                    msg: `Erro ao cadastrar o produto, verifique os campos enviados`
                })
        }
    }

    //to PUT Method - Delete item in itens_list
    static deleteItemList = async (req, res) => {
        const { list_id, id_item } = req.body

        if (id_item && list_id) {

            await Promise.all([
                Validation.verifyIDList(list_id),
                Validation.verifyIDItem(list_id, id_item)
            ])

            ListModel.updateOne(
                { _id: list_id },
                {
                    $pull: { "itens_list": { id_item } }
                },
                (err) => {
                    if (!err) {
                        res
                            .status(200)
                            .send({
                                err: null,
                                msg: "Produto deletado com sucesso"
                            })
                    }
                }
            )
        }
        else {
            res
                .status(500)
                .send({
                    err: "noIDSend",
                    msg: "Não foi possível remover os itens, verifique se os dados"
                })
        }
    }

    //to PUT Method - Update item in itens_list
    static updateItemList = async (req, res) => {
        const { list_id, ...itemUpdate } = req.body

        // const checkIdList = await Validation.verifyIDList(list_id, res);
        const verifyIdItem = await Validation.verifyIDItem(list_id, itemUpdate.id_item);

        if (verifyIdItem) {
            //Take object in DB
            const itemList = await ListModel.findOne(
                { _id: list_id, "itens_list.id_item": itemUpdate.id_item },
                { "itens_list.$": 1 }
            )

            //Cross the object
            const newProduct = Object.assign(itemList.itens_list[0], itemUpdate);

            ListModel.updateOne(
                { _id: list_id, "itens_list.id_item": itemUpdate.id_item },
                {
                    $set: {
                        "itens_list.$": newProduct
                    }
                },
                (err) => {
                    if (!err) {
                        res
                            .status(200)
                            .send({
                                err: null,
                                msg: "Produto editado com sucesso"
                            })
                    }
                    else {
                        res
                            .status(500)
                            .send({
                                err: "editProduct",
                                msg: "Erro ao editar produto"
                            })
                    }
                }
            )

        }
        else {
            res
                .status(404)
                .send({
                    err: 'listItemIDNotFound',
                    msg: 'Item ou Lista não encontrado'
                })
        }
    }

    //to PUT Method - Change who can view
    static addWhoCanView = async (req, res) => {
        const { list_id, email_user } = req.body;

        if(list_id && email_user){
            const data = await Promise.all([
                Validation.verifyIDList(list_id),
                UserValidation.verifyEmail(email_user),
            ])

            const dataUser = JSON.parse(JSON.stringify(data[1]));

            if(data[0] && !!data[1]){
                ListModel.findOneAndUpdate(
                    { _id : list_id },
                    {
                        $push: {
                            "user_can_view": dataUser._id
                        }
                    },
                    (err) =>{
                        if(!err){
                            res
                                .status(200)
                                .send({
                                    err: null,
                                    msg: "Adicionado com sucesso"
                                })
                        }
                        else{
                            res
                                .status(500)
                                .send({
                                    err: err.message,
                                    msg: 'erro'
                                })
                        }
                    }
                )
            }
            else{
                res
                    .status(200)
                    .send({
                        err: 'listOrUserNotFound',
                        msg: 'Lista ou usuario nao encontrado'
                    })
                
            }

        }
    }
}

class Validation {

    static verifyObjectToSend(prod) {
        if (
            prod.id_item &&
            prod.quantity &&
            prod.name &&
            prod.price &&
            prod.total &&
            prod.checked != null &&
            prod.checked != undefined
        ) {
            return true
        }
        else {
            return false
        }
    }

    static async verifyIDList(idList) {

        const item = await ListModel.findOne(
            { _id: idList }
        )

        if(item === null) {
            return false
        }
        else {
            return true
        }
    }

    static async verifyIDItem(idList, idItem) {
        const item = await ListModel.findOne(
            { _id: idList, "itens_list.id_item": idItem },
            { "itens_list.$": 1 }
        )

        if (item === null) {
            return false
        }
        else {
            return true
        }
    }
}