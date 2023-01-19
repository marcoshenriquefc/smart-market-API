import ListModel from '../models/listModel.js'

export default class ListController {

    //to GET Method - list all products
    static listAllProduct = (req, res) => {
        const dataToFilter = req.query;
        const id = req.query;

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
                        .send(`${err} - Houve um erro ao cadastrar`)
                }
            })
        }
    }

    //to POST Methods - Change itens in itens_list
    static updateItensList = async (req, res) => {
        const { list_id, ...product } = req.body

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
                    err: 'invalidCamp',
                    msg: `Erro ao cadastrar o produto, verifique os campos enviados`
                })
        }
    }

    //to PUT Method - Delete item in itens_list
    static deleteItemList = async (req, res) => {
        const { list_id, id_item } = req.body

        if (id_item && list_id) {

            Validation.verifyIDList(list_id);
            Validation.verifyIDItem(list_id, id_item);

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

    //to PUT Method -
    static updateItemList = async (req, res) => {
        const { list_id, ...itemUpdate } = req.body

        // const checkIdList = await Validation.verifyIDList(list_id, res);
        const checkIdItem = await Validation.verifyIDItem(list_id, itemUpdate.id_item);

        if (checkIdItem) {
            //Take object in DB
            const itemList = await ListModel.findOne(
                { _id: list_id, "itens_list.id_item": itemUpdate.id_item },
                { "itens_list.$": 1 }
            )

            //Cross the object
            const newProduct = Object.assign(itemList.itens_list[0], itemUpdate);

            // ListModel.findById(
            //     {_id : list_id },
            //     (err)=> {
            //         if(err){
            //             res
            //                 .status(404)
            //                 .send({
            //                     err: '',
            //                     msg: err + ' - Erro ao encontrar a lista'
            //                 })
            //         }
            //     })

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
}

class Validation {

    static verifyObjectToSend(prod) {
        if (
            prod.id_item &&
            prod.quantity &&
            prod.name &&
            prod.price &&
            prod.total &&
            prod.checked != null
        ) {
            return true
        }
        else {
            return false
        }
    }

    // static async verifyIDList(idList, res) {

    //     try {
    //         ListModel.findById(
    //             { _id: idList }
    //         )

    //         return true
    //     }
    //     catch(err) {
    //         return false
    //     }

    // }

    static async verifyIDItem(idList, idItem) {
        const i = await ListModel.findOne(
            { _id: idList, "itens_list.id_item": idItem },
            { "itens_list.$": 1 }
        )

        if (i === null) {
            return false
        }
        else {
            return true
        }
    }
}