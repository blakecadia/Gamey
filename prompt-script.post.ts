import OpenAI from "openai";

const runtimeConfig = useRuntimeConfig();

const openai = new OpenAI({
    apiKey: runtimeConfig.OPENAI_KEY,
});

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        throw createError({
            statusCode: 401,
            statusMessage: "Not logged in",
        });

    const body = await readBody(event);

    const script = await pingGPT(`Please write me a script for a 30 sec short about a minecraft server featuring the ${body.gamemode} gamemode, with the ip ${body.serverIp}. Your output should only be the script, max 8 lines, split it into 7-8 lines like in the example, max 300 characters, NO MORE THAN 300 CHARACTERS, no emojis, no empty lines, with the first one being a hook, and the last one being a call to action, here's some examples of a good script, with good pacing and hooks: 
          
This is how you can join Minecraft's best Skyblock Server!
The server is called ManaCube, you'll first join in and need to create an island!
Then you can start making money! 
Wheat and Cactus are some of the best Early Money Making Methods!
You can also invite your friends with /island invite and then their name!
This server is so much fun and absolutely blowing up!
If you want to log on, the information is on your screen right now!

And another example:
     
Join this epic minecraft server 
It's got custom mob spawners
Custom levelings
Lots of players
A very active community
Active staff
No cheaters
A huge community
And we all have lots of fun
Join now at play.minearcade.com

Make sure the videos flow, and are generic enough for any skyblock server to use the script, but still attract players and good pacing so it works for a YouTube short and captures a high retention. 
Make sure the video is only 7-8 LINES, MAKE SURE ITS LINES, DONT GIVE ME ANY OTHER INFO, format it in lines for each sentence. MAKE SURE INTROS HAVE A GOOD HOOK, FOR EXAMPLE:
"Are you looking for a Brand New Skyblock Server?"
"Is this Minecraft's best Skyblock Server?"
etc
Make sure the video is only 7-8 LINES, MAKE SURE ITS LINES, DONT GIVE ME ANY OTHER INFO, format it in lines for each sentence. MAKE SURE INTROS HAVE A GOOD HOOK

This short should be more about the following hook and idea: "${body.prompt}"`);

    return script;
});

async function pingGPT(message: string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a script generator for youtube videos",
            },
            {
                role: "user",
                content: message,
            },
        ],
    });

    return completion.choices[0].message.content?.replaceAll("  \n", "\n");
    // return completion.choices[0].message.content?.replaceAll("  \n", ". ");
}
