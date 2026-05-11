import { defineMongooseModel } from "#nuxt/mongoose";
import { Types } from "mongoose";

export const Server = defineMongooseModel("Server", {
    owner: {
        type: Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: "string",
        required: true,
    },
    ip: {
        type: "string",
        required: true,
    },
    port: {
        type: Types.Decimal128,
        required: true,
    },
    version: {
        type: "string",
        required: true,
    },
    // iconPath: {
    //     type: "string",
    //     required: true,
    // },
});
