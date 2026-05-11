import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
    const base = "public";
    if (event.context.params.name.includes(".."))
        createError({
            statusCode: 400,
            statusMessage: "Haha",
        });
    const filePath = path.join(base, event.context.params.name.replaceAll("MONKEYBRANCH", "/"));

    return sendStream(event, fs.createReadStream(filePath));
});
