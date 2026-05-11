import fs from "fs";

export default defineEventHandler((event) => {
    if (!event.context.user)
        throw createError({
            statusCode: 401,
            statusMessage: "Not logged in",
        });

    var data: any = {};
    const categories = fs.readdirSync("public/clips");
    for (var category of categories) {
        const gamemodes = fs.readdirSync(`public/clips/${category}`);

        data[category] = {};
        for (var gamemode of gamemodes) {
            const files = fs.readdirSync(`public/clips/${category}/${gamemode}`);
            data[category][gamemode] = files;
        }
    }

    return data;
});
