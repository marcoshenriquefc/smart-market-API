import ListModel from '../models/listModel.js'

export default class ListController {

    //to GET Method - list all products
    static listAllProduct = (req, res) => {
        const dataToFilter = req.query;
        const id = req.query;

        ListModel.find(id)
            .populate("user_id", "name")
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
    static updateItensList = (req, res) => {
        const { list_id, ...product } = req.body

        console.log(req.body)

        if (
            list_id &&
            product.id_item &&
            product.quantity &&
            product.name &&
            product.price &&
            product.total &&
            product.checked != null
        ) {
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
    static deleteItemList = (req, res) => {
        const { list_id, id_item } = req.body

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

    //to PUT Method - Delete item in itens_list
    static updateItemList = (req, res) => {
        const { list_id, ...itemUpdate} = req.body

        ListModel.updateOne(
            { _id: list_id, "itens_list.id_item": itemUpdate.id_item},
            {
                $set: {
                    "itens_list.$": itemUpdate 
                }
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
}