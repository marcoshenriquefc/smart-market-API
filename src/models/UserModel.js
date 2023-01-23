import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        id: String,
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        lists_product: {
            type: Array
        }
    }
)

const UserModel = mongoose.model('user', UserSchema);

export default UserModel