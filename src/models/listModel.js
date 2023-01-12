import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
    {
        id: String,
        user_id: {
            type    : Number,
            require : true
        },
        year_save: {
            type    : Number,
            require : true
        },
        mounth_save: {
            type    : String,
            require : true
        },
        itens_list: {
            type    : Array,
            require : true
        },
        total: {
            type    : Number,
            require : true
        }
    }
);

const ListModel = mongoose.model( "list_item" , ListSchema);

export default ListModel;