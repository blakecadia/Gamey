export default defineEventHandler(async (event) => {
    if (!event.context.user)
        throw createError({
            statusCode: 401,
            statusMessage: "Not logged in",
        });

    const { files }: any = await readBody<{ files: File[] }>(event);

    if (files[0].type != "image/png" && files[0].type != "image/jpeg" && files[0].type != "image/jpg") return false;

    const iconPath = await storeFileLocally(files[0], 16);

    return iconPath;
});
