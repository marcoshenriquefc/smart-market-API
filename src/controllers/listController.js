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

        if(list){
            list.save((err) => {
                if(!err){
                    res
                        .status(200)
                        .send(list)
                }
                else{
                    res
                    .status(500)
                    .send(`${err} - Houve um erro ao cadastrar`)
                }
            })
        }
    }
}