// import { getServerSession } from "#auth";
import { stripe } from "~/server/utils/stripe";

export default eventHandler(async (e) => {
    const { email, name } = await getUserSession(e);
    var user = await User.findOne({ email });
    if (!user && email) {
        const customer = await stripe.customers.create({
            // @ts-ignore
            email,
        });
        user = new User({
            email,
            name,
            stripeCustomer: customer.id,
        });
        await user.save();
    }
    e.context.user = user;
});
