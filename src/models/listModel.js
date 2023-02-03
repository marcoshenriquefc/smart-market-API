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
            type  : [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            }],
        },
        year_created: {
            type    : Number,
            required : true
        },
        mounth_created: {
            type    : Number,
            required : true
        },
        itens_list : {
            type    : Array,
            required : true
        },
        total: {
            type    : Number,
            required : true
        },
        savedList: {
            type: Boolean,
            required: true
        }
    }
);

const ListModel = mongoose.model( "list_itens" , ListSchema);

export default ListModel;