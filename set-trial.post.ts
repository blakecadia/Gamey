export default defineEventHandler(async (event) => {
    if (!event.context.user || !event.context.user.admin) {
        throw createError({
            statusCode: 400,
            statusMessage: "Not admin!",
        });
    }

    const body = await readBody(event);

    const targetUser: any = await User.findOne({ _id: body.targetId });

    targetUser.plan = "trial";
    targetUser.credits = [
        {
            expires: Date.now() + +2 * 30 * 24 * 60 * 60 * 1000,
            amount: 5,
        },
    ];

    await targetUser?.save();

    return true;
});
