import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // The user that is subscribing
        ref: "User",
        required: true
    }, 
    channel: {
        type: mongoose.Schema.Types.ObjectId, // The channel that is being subscribed
        ref: "User",
        required: true
    }
}, {timestamps: true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema)