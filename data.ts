import fs from "fs";

export default defineEventHandler(async (e) => {
    const user = await User.findOne({ _id: e.context.user?._id });
    const servers = await Server.find({ owner: user?._id });
    var shorts = await Short.find({ owner: user?._id });

    for (var short of shorts) {
        if (Date.now() > (short.expires as unknown as number)) {
            fs.unlinkSync("./public/" + short.link);
            await Short.deleteOne({ _id: short._id });
        }
    }

    shorts = shorts.filter((i) => (short.expires as unknown as number) > Date.now());

    return {
        user,
        servers,
        shorts,
    };
});
