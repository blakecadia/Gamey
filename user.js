import { defineMongooseModel } from "#nuxt/mongoose";
import { Types } from "mongoose";

export const User = defineMongooseModel("User", {
    email: {
        type: "string",
        required: true,
        unique: true,
    },
    name: {
        type: "string",
        required: true,
    },
    credits: {
        type: [
            {
                amount: "number",
                expires: "number",
            },
        ],
        default: [],
    },
    stripeCustomer: {
        type: "string",
        required: true,
        unique: true,
    },
    plan: {
        type: "string",
    },
    audioRegenerations: {
        type: "number",
        default: 3,
    },
    clips: {
        type: ["string"],
        default: [],
    },
    admin: {
        type: "boolean",
        default: false,
    },
});
