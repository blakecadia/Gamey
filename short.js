import { defineMongooseModel } from "#nuxt/mongoose";
import { Types } from "mongoose";

export const Short = defineMongooseModel("Short", {
    owner: {
        type: Types.ObjectId,
        required: true,
        ref: "User",
    },
    link: {
        type: "string",
        required: true,
    },
    serverName: {
        type: "string",
        required: true,
    },
    serverIp: {
        type: "string",
        required: true,
    },
    serverPort: {
        type: "string",
        required: true,
    },
    serverVersion: {
        type: "string",
        require: true,
    },
    serverIcon: {
        type: "string",
        required: true,
    },
    expires: {
        type: "number",
        require: true,
    },
});
