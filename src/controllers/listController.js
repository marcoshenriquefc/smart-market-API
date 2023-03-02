import ListModel from '../models/listModel.js'
import { UserValidation } from './userController.js';

export default class ListController {
    //to GET Method - list all products
    static listAllProduct = (req, res) => {
        const id = {
            user_id: req.user._id
        }
        const queryData = req.query;
        const dataBody = Object.assign(id,queryData)

        ListModel.find(dataBody)
            .populate("user_id", "email")
            .populate("user_can_view", "email")
            .exec((err, ListFind) => {
                res
                    .status(200)
                    .send(ListFind)
            })
    }

    //to GET Method - list all products
    static singleListProduct = (req, res) => {
        // const queryData = req.body;
        const userType = req.userType;
        const data = {
            _id: req.query.list_id
        }

        ListModel.findOne(data)
            .populate("user_id", "email")
            .populate("user_can_view", "email")
            .exec((err, ListFind) => {
                const list = Object.assign(ListFind, userType)
                res
                    .status(200)
                    .send({
                        list        : ListFind,
                        userType    : userType,
                        teste       : list
                    })
            })
    }

    //to POST Method - Create a new List to product
    static createNewList = (req, res) => {
        const dataList = Object.assign({user_id : req.user._id}, req.body )
        const list = new ListModel(dataList);

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

    //to PUT Method - Update a list
    static updateTotalList = async (req, res) => {
        const { list_id, total } = req.body;


        if (total < 0 || typeof total != "number") {
            return res
                .status(500)
                .send({
                    err : "totalError",
                    msg : "Valor total invalido"
                })
        }
        else {
            const listExist = await Validation.verifyIDList(list_id);

            if(listExist) {
                ListModel.updateOne(
                    { _id: list_id },
                    {
                        $set: {
                            'total' : total
                        }
                    },
                    (err) => {
                        if(!err) {
                            res
                                .status(200)
                                .send({
                                    err: null,
                                    msg: 'Valor total atualizado'
                                })
                        }
                        else {
                            res
                                .status(500)
                                .send({
                                    err: "editTotal",
                                    msg: "Erro ao editar valor total"
                                })
                        }
                    }
                )
            }
            else {
                res
                    .status(404)
                    .send({
                        err : "listNotFount",
                        msg : "Lista não encontrada"
                    })
            }
        }
        
    }

    //to PUT Method - Close/save list
    static saveList = async (req, res) => {
        const { list_id } = req.body;

        const listExist = await Validation.verifyIDList(list_id);

        if(listExist) {
            ListModel.updateOne(
                { _id: list_id },
                {
                    $set: {
                        'saved_list' : true
                    }
                },
                (err) => {
                    if(!err) {
                        res
                            .status(200)
                            .send({
                                err: null,
                                msg: 'Lista salva com sucesso'
                            })
                    }
                    else {
                        res
                            .status(500)
                            .send({
                                err: "failedSaveList",
                                msg: "Erro salvar a lista"
                            })
                    }
                }
            )
        }
        else {
            res
                .status(404)
                .send({
                    err : "listNotFount",
                    msg : "Lista não encontrada"
                })
        }
    }

    //to POST Methods - Add itens in itens_list
    static addItensList = async (req, res) => {
        const { list_id, ...product } = req.body;
        const prodCheck = Validation.verifyObjectToSend(product);

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
        const { list_id, itemUpdate } = req.body

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


    //Function's to share list

    //to POST Method - Change who can view
    static addWhoCanView = async (req, res) => {
        const { list_id, email_user } = req.body;

        if(list_id && email_user){
            const data = await Promise.all([
                Validation.verifyIDList(list_id),
                UserValidation.verifyEmail(email_user),
            ])

            if(!data[0]) {
                res
                    .status(404)
                    .send({
                        err: 'listNotFound',
                        msg: 'This list is not found'
                    })
            }
            else{
                const dataUser = JSON.parse(JSON.stringify(data[1]));
                const userExist = await Validation.verifyIfuserCanView(list_id, dataUser._id );
                const userIsOwner = await Validation.verifyUserIsOwner(list_id, dataUser._id)
    
                if(userIsOwner){
                    res
                        .status(500)
                        .send({
                            err: 'userIsOwner',
                            msg: 'Usuário ja é o dono da lista'
                        })
                }
                else{
                    if(!userExist) {
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
                    else{
                        res
                            .status(500)
                            .send({
                                err: 'userExist',
                                msg: 'Usuário ja existe'
                            })
                    }
                }
            }



        }
    }

    //to PUT Method - Remove who can view
    static removeWhoCanView = async (req, res) => {
        const { list_id, email_user } = req.body;

        if(list_id && email_user){
            const data = await Promise.all([
                Validation.verifyIDList(list_id),
                UserValidation.verifyEmail(email_user),
            ])
            const dataUser = JSON.parse(JSON.stringify(data[1]));
            const userExist = await Validation.verifyIfuserCanView(list_id, dataUser._id);

            if(userExist && data[0]){
                ListModel.updateOne(
                    { _id: list_id },
                    {
                        $pull: { "user_can_view": dataUser._id }
                    },
                    (err) => {
                        if (!err) {
                            res
                                .status(200)
                                .send({
                                    err: null,
                                    msg: "Usuário removido com sucesso"
                                })
                        }
                    }
                )
            }
            else{
                res
                    .status(500)
                    .send({
                        err: 'userOrListNotFound',
                        msg: 'Usuário ou lista não encontrado'
                    })
            }
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

    //to GET Method - Get all user who can view
    static getWhoCanView = async (req, res) => {
        const { list_id } = req.body;

        ListModel.findById(list_id,
            {"_id" : 0 ,"user_can_view" : 1},            
        )
        .populate("user_can_view", "email")
        .exec(
                (err, listUser) => {
                    if(!err){
                        
                        res
                            .status(200)
                            .send(listUser)
                    }
                    else{
                        res
                            .status(404)
                            .send({
                                err: 'notFound',
                                msg: err.message
                            })
                    }
                }
            )
    }

    //to GET Methods - Lists all lists shared 
    static getListShared = async (req, res) => {
        // const {user_id} = req.body;
        // const {user_id} = req.query
        const user_id = req.user._id

        ListModel
            .find(
                {"user_can_view": user_id }, "-user_can_view -user_id"
            )
            .exec((err, shared) => {
                res.status(200).json(shared);
            })

    }

    //to VERIFY Methods - Verify if user can edit list
    static verifyifCanEdit = async (req, res, next) => {
        
        let { list_id } = req.body;
        if(!list_id) {
            list_id = req.query.list_id
        }
        const user_id = req.user._id;
        const isMyList = await Validation.verifyMyList(list_id, user_id);

        if(!isMyList) {
            ListModel.findOne(
                { _id: list_id, "user_can_view": user_id },
                { "_id": 1 },            
            )
            .populate("user_can_view", "email")
            .exec(
                    (err, listUser) => {
                        if(!err){
                            if(listUser) {
                                req.userType = 'shared';
                                return next();
                            }
                            else {
                                res
                                    .status(401)
                                    .send({
                                        err: 'notAuthorization',
                                        msg: 'User cant change list'
                                    })
                            }
                        }
                        else{
                            res
                                .status(404)
                                .send({
                                    err: 'notFound',
                                    msg: err.message
                                })
                        }
                    }
                )
        }
        else {
            console.log('is my list', user_id);
            req.userType = 'owner';
            next()
        }
    }

    static verifyIfisOwner = async (req, res, next) => {
        const { list_id } = req.body;
        const user_id = req.user._id;
        const isMyList = await Validation.verifyMyList(list_id, user_id);

        if(isMyList) {
            console.log('is my list', user_id);
            next()
        }
        else {
            res
                .status(401)
                .send({
                    err: 'notAutorization',
                    msg: 'Usuário não pode alterar'
                })
        }
    }
}

class Validation {
    // to Verify object item to list
    static verifyObjectToSend(prod) {
        if (
            prod.id_item &&
            prod.quantity &&
            prod.name &&
            prod.price >= 0 &&
            prod.total >= 0 &&
            prod.checked != null &&
            prod.checked != undefined
        ) {
            return true
        }
        else {
            return false
        }
    }

    // to verify id List exist
    static async verifyIDList(idList) {

        try {
            const item = await ListModel.findOne(
                { _id: idList },
            )

            // if list dont exist return false
            if(item === null) {
                return false
            }
            // if list exist return true
            else {
                return true
            }
        } catch (error) {
            return false   
        }

    }

    static async verifyIDItem(idList, idItem) {
        const item = await ListModel.findOne(
            { _id: idList, "itens_list.id_item": idItem },
            { "itens_list.$": 1 }
        );
        
        if (item === null) {
            return false;
        }
        else {
            return true;
        }
    }

    static async verifyIfuserCanView(idList, idUser){
        const item = await ListModel.findOne(
            { _id: idList, "user_can_view": idUser },
            { "user_can_view.$": 1 }
        );
        if(item === null){
            return false
        }

        
        const idUserCanView = JSON.parse(JSON.stringify(item.user_can_view))[0];

        if (idUserCanView === idUser) {
            return true;
        }
        else {
            return false;
        }
    }

    static async verifyUserIsOwner(idList, idUser){
        const item = await ListModel.findOne(
            { _id: idList},
            { "_id" : 0, "user_id": 1 }
        );

        const userIdList = JSON.parse(JSON.stringify(item.user_id));

        if(userIdList === idUser){
            return true
        }
        else{
            return false
        }
    }


    static async verifyMyList(idList, idUser) {
        const myList = await ListModel.findOne(
            { _id: idList, "user_id": idUser },
            { "_id": 1 },            
        )

        if(myList) {
            return true
        }
        else {
            return false
        }
    }
}