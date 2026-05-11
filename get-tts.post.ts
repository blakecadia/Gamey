import { ElevenLabsClient, play } from "elevenlabs";
import { createWriteStream } from "fs";
import path from "path";

import { v4 as uuid } from "uuid";

const runtimeConfig = useRuntimeConfig();
const eleven = new ElevenLabsClient({
    apiKey: runtimeConfig.ELEVEN_KEY,
});

export default defineEventHandler(async (event) => {
    if (!event.context.user)
        throw createError({
            statusCode: 401,
            statusMessage: "Not logged in",
        });

    if (event.context.user.audioRegenerations <= 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Ran out of audio regenerations",
        });
    }

    const body: any = await readBody(event);

    const premiumVoices = [
        { name: "Brittney", id: "Brittney - Young, Peppy Female - Social Media, How To's, Explainers", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Haily", id: "Halley McClure", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Parker", id: "Parker", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Blake", id: "Blake", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Ace", id: "Ace", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Magic", id: "VA28WhTpCV3wdrzy4Rhb", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Hope", id: "tnSpp4vdxKPjI9w0GnoV", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
    ];

    const basicVoices = [
        { name: "Archer", id: "Archer", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Alex", id: "Alex - Young American Male", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Arthur", id: "Arthur - Energetic American Male Narrator", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Axell", id: "2mltbVQP21Fq8XgIfRQJ", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "SlatePlays", id: "SlatePlays", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
        { name: "Harry", id: "Harry", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
    ];
    if (!(basicVoices.find((i) => i.id == body.voice) || (premiumVoices.find((i) => i.id == body.voice) && event.context.user.plan == "premium"))) {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid voice ",
        });
    }

    event.context.user.audioRegenerations--;
    await event.context.user.save();

    return await new Promise(async (resolve, reject) => {
        var attempt = 1;
        var audio;

        while (attempt++ < 20) {
            try {
                audio = await generateAudio(body.text, body.voice);

                if (audio) break;
                else await new Promise((resolve, reject) => setTimeout(resolve, 500));
            } catch (e) {
                // console.log(e);
            }
        }

        if (!audio) return reject();

        const fileName = `${uuid()}.mp3`;
        const filePath = path.join(runtimeConfig.AUDIO_DIR, fileName);
        const fileStream = createWriteStream(filePath);

        audio.pipe(fileStream);
        fileStream.on("finish", () => resolve(`/audios/${fileName}`));
        fileStream.on("error", reject);
    });
});

async function generateAudio(text: string, voice: string) {
    return await eleven.generate({
        voice: voice,
        text: text,
        model_id: "eleven_multilingual_v2",
    });
}
