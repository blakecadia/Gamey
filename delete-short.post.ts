import fs from "fs";

export default defineEventHandler(async (event) => {
    const body: any = await readBody(event);
    const short = await Short.findOne({ _id: body._id });
    if (!short)
        throw createError({
            statusCode: 404,
            statusMessage: "Short not found",
        });

    try {
        fs.unlinkSync("./public/" + short.link);
    } catch {}
    await Short.deleteOne({ _id: body._id });
});
