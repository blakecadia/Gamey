import fs from "fs";

export default defineEventHandler((event) => {
    if (!event.context.user)
        throw createError({
            statusCode: 401,
            statusMessage: "Not logged in",
        });

    const files = fs.readdirSync("public/music");

    return files;
});
