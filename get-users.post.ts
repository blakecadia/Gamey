export default defineEventHandler(async (event) => {
    if (!event.context.user || !event.context.user.admin) {
        throw createError({
            statusCode: 400,
            statusMessage: "Not admin!",
        });
    }

    const users = await User.find();

    return {
        users,
    };
});
