import fs from "fs";

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        throw createError({
            statusCode: 401,
            statusMessage: "Not logged in",
        });

    if (event.context.user.plan != "premium" && event.context.user.plan != "trial")
        throw createError({
            statusCode: 401,
            statusMessage: "Premium only",
        });

    const body: any = await readBody(event);

    var found = false;
    const index = event.context.user.clips.findIndex((i: string) => i == body.clip);

    if (index == -1) {
        throw createError({
            statusCode: 404,
            statusMessage: "Clip not found",
        });
    }

    try {
        fs.unlinkSync(`./public${event.context.user.clips[index]}`);
    } catch {}
    try {
        fs.unlinkSync(`./public${event.context.user.clips[index].replaceAll("/server-icons", "/clips-preview/uploads").replaceAll(".mp4", ".jpg").replaceAll(".mov", ".jpg")}`);
    } catch {}

    event.context.user.clips = event.context.user.clips.filter((i: string) => i != body.clip);
    await event.context.user.save();

    return true;
});
