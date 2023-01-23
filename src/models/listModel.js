import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
    {
        id: String,
        user_id: {
            type    : mongoose.Schema.Types.ObjectId,
            ref: "user",
            required : true
        },
        user_can_view: {
            typeof  : Array,
        },
        year_save: {
            type    : Number,
            required : true
        },
        mounth_save: {
            type    : String,
            required : true
        },
        itens_list: {
            type    : Array,
            required : true
        },
        total: {
            type    : Number,
            required : true
        }
    }
);

const ListModel = mongoose.model( "list_itens" , ListSchema);

export default ListModel;