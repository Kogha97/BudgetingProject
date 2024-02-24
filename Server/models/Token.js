import mongoose from "mongoose"

const { Schema } = mongoose;

const tokenSchema = new Schema ({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    accessToken: {
        type: String,
        unique: true,
        required: true,
    },
    refreshToken:{
        type: String,
        unique: true,
        required: true,
    },
    expiresIn: {
        type: Date,
        required: true,
    }
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;