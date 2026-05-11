import fs, { createWriteStream } from "fs";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { FFScene, FFText, FFVideo, FFImage, FFCreator } from "ffcreator";
import { ElevenLabsClient, play } from "elevenlabs";
import OpenAI from "openai";

import { v4 as uuid } from "uuid";

interface TempVideo {
    location: string;
    index: number;
}

const baseUrl = "https://api.assemblyai.com/v2";
const headers = {
    authorization: process.env.NUXT_ASSEMBLY_KEY,
};

const runtimeConfig = useRuntimeConfig();
const eleven = new ElevenLabsClient({
    apiKey: runtimeConfig.ELEVEN_KEY,
});
const openai = new OpenAI({
    apiKey: runtimeConfig.OPENAI_KEY,
});

export default defineEventHandler(async (event) => {
    const body: any = await readBody(event);
    if (!event.context.user)
        throw createError({
            statusCode: 401,
            statusMessage: "Not logged in",
        });

    if (!event.context.user.plan)
        throw createError({
            statusCode: 400,
            statusMessage: "No plan selected",
        });

    if (body.script.length > 500 || body.script.split("\n").length > 15) {
        throw createError({
            statusCode: 400,
            statusMessage: "Script too long",
        });
    }

    if (event.context.user.credits.reduce((acc: any, cur: any) => acc + (cur.expires < Date.now() ? 0 : cur.amount), 0) < 1) {
        throw createError({
            statusCode: 400,
            statusMessage: "Ran out of credits!",
        });
    }
    console.log("Starting short creation");

    const endCard = `./public/end-cards/${uuid()}.png`;
    fs.writeFileSync(endCard, Buffer.from(body.endScreenImage.split(",")[1], "base64"));

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
    if (!(basicVoices.find((i) => i.id == body.voice) || (premiumVoices.find((i) => i.id == body.voice) && (event.context.user.plan == "premium" || event.context.user.plan == "trial")))) {
        throw createError({
            statusCode: 401,
            statusMessage: "Invalid voice ",
        });
    }

    for (var line of body.voiceover) {
        console.log(`Generating audio ${body.voiceover.indexOf(line) + 1} / ${body.voiceover.length}`);
        const index = body.voiceover.indexOf(line);

        const audio = await generateAudioToFile(line.pronunciation, body.voice);

        body.voiceover[index].audio = audio;
    }

    console.log("Merging all");
    var final = await mergeVideos(body.voiceover);
    var voiceover = await mergeMp3Files(body.voiceover.map((line: any) => `./public${line.audio}`));
    console.log(`Merged voiceover at ${voiceover}`);
    var finalVoiceover = await mergeVideoAndAudio(final, voiceover);
    console.log("Done merging all");

    const { width, height } = await getVideoResolution(final);
    const finalDuration = await getVideoDuration(final);

    console.log("Starting subtitle generation");
    var subtitles = await getSubtitlesForMp4(finalVoiceover);

    // var attempts = 0;

    // while (attempts++ < 8) {
    //     const prompt = `This is automatically generated subtitle data, split into lines:

    // ${subtitles.reduce((acc: any, cur: any) => acc + "\n" + cur.text, "")}

    // Could you keep the exact same line structure, just change the text to match the following text where it messes up:

    // ${body.voiceover.reduce((acc: any, cur: any) => acc + "\n" + cur.text, "")}

    // Your output is going to be used for a computer program, so please only give me corrected version, no filler text, and in the exact same pattern as I provided you. Do not merge lines, the number of text lines you give me should be the exact same as the original subtitle line count ${subtitles.length}. GIVE ME ${subtitles.length} LINES!!!`;

    //     console.log(prompt);
    //     const aiRes = await pingGPT(prompt);
    //     console.log(aiRes);
    //     // console.log(aiRes?.split("\n"));

    //     if (aiRes?.split("\n").length == subtitles.length) {
    //         var i = 0;
    //         for (var subtitle of subtitles) {
    //             subtitle.text = aiRes?.split("\n")[i++];
    //         }

    //         // subtitles = JSON.parse((await pingGPT(prompt)) as string);
    //         // console.log(subtitles);
    //         break;
    //     }
    // }

    console.log("Finished subtitle generation");

    const outroDuration = await getVideoDuration(`./public${body.voiceover[body.voiceover.length - 1].audio}`);

    const creator = new FFCreator({
        cacheDir: "public/tmp",
        outputDir: "public/tmp",
        width,
        height,
    });
    const scene = new FFScene();
    scene.setDuration(finalDuration);

    const video = new FFVideo({
        path: final,
        width,
        height,
        x: width / 2,
        y: height / 2,
    });
    video.setAudio(true);
    scene.addChild(video);
    scene.addAudio("./public/silent.mp3");

    for (var subtitleData of subtitles) {
        if (subtitleData.start / 1000 > finalDuration - outroDuration - 0.25) continue;

        const text = new FFText({
            text: subtitleData.text + "‎ ",
            x: width / 2,
            y: height / 1.5,
            fontSize: 96 + 16,
        });
        text.alignCenter();
        text.setStyle({
            fontWeight: "400",
            stroke: body.outlineColor,
            strokeThickness: "7",
        });
        text.setFont(`./public/fonts/${body.font}`);
        text.setColor(body.fontColor);
        text.addAnimate({
            from: { scale: 0.7, alpha: 0 },
            to: { scale: 0.7, alpha: 1 },
            time: 0.02,
            delay: subtitleData.start / 1000,
            ease: "Back.Out",
        });
        text.addAnimate({
            from: { scale: 0.7, alpha: 1 },
            to: { scale: 0.73, alpha: 1 },
            time: (subtitleData.end - subtitleData.start) / 1000 - 0.02,
            delay: subtitleData.start / 1000 + 0.02,
            ease: "Back.Out",
        });

        text.addEffect("fadeOut", 0.01, subtitleData.end / 1000);

        scene.addChild(text);
    }

    console.log("Generating sound effects");
    if (body.soundEffect) {
        const videoDurations = await Promise.all(body.voiceover.map(async (i: any) => await getVideoDuration(`./public${i.audio}`)));
        for (var line of body.voiceover) {
            if (body.voiceover.indexOf(line) == 0) continue;
            const delay = videoDurations.reduce((acc, cur, index) => acc + (index < body.voiceover.indexOf(line) ? cur : 0), 0);
            scene.addAudio({ path: `./public/sound-effects/${body.soundEffect}`, start: delay, volume: 2.4 });
        }
    }
    console.log("Finished generating sound effects");

    const serverLogo = new FFImage({
        path: endCard,
        height: body.endScreenImageHeight * 0.75,
        width: body.endScreenImageWidth * 0.75,
        duration: finalDuration - outroDuration,
    });
    serverLogo.addEffect("fadeIn", 0.01, finalDuration - outroDuration);
    serverLogo.addEffect("fadeOut", 0.01, finalDuration);
    serverLogo.setXY(width / 2, 350);
    scene.addChild(serverLogo);

    creator.addChild(scene);

    var output = `./public/tmp/${uuid()}.mp4`;
    var outputFFCreator = output;
    creator.output(output);
    creator.start();
    creator.closeLog();

    await new Promise((resolve, reject) => {
        creator.on("start", () => {
            console.log(`FFCreator start`);
        });
        creator.on("error", (e) => {
            console.log(`FFCreator error: ${JSON.stringify(e)}`);
            reject();
        });
        creator.on("progress", (e) => {
            console.log(`FFCreator progress: ${(e.percent * 100) >> 0}%`);
        });
        creator.on("complete", (e) => {
            console.log(`FFCreator completed: \n USAGE: ${e.useage} \n PATH: ${e.output} `);
            resolve(null);
        });
    });

    output = await enhanceAudioQuality(output);
    var outputHighQuality = output;

    var outputWithVoice: any = await mergeVideoAndExistingAudio(output, voiceover, 2);
    output = outputWithVoice;
    console.log("Merged video audio at " + outputWithVoice);

    var outputWithMusic: any = output;
    if (body.music) {
        outputWithMusic = await mergeVideoAndExistingAudio(output, `./public/music/${body.music}`, 0.2);
        output = outputWithMusic;
    }
    console.log("Merged music at " + outputWithMusic);

    console.log("Finished short generation");
    await new Promise((resolve, reject) => {
        fs.copyFile(outputWithMusic, outputWithMusic.replaceAll("/tmp/", "/finished/"), resolve);
        output = outputWithMusic.replaceAll("/tmp/", "/finished/");
        output = output.replaceAll("./public/", "");
    });
    console.log(`Final short at ` + output);

    for (var line of body.voiceover) {
        fs.unlinkSync(`./public${line.audio}`);
    }

    console.log(`unlinking final ${final}`);
    fs.unlinkSync(final);
    console.log(`unlinking voiceover ${voiceover}`);
    fs.unlinkSync(voiceover);
    console.log(`unlinking finalVoiceover ${finalVoiceover}`);
    fs.unlinkSync(finalVoiceover);
    console.log(`unlinking outputFFCreator ${outputFFCreator}`);
    fs.unlinkSync(outputFFCreator);
    console.log(`unlinking outputWithVoice ${outputWithVoice}`);
    fs.unlinkSync(outputWithVoice);
    console.log(`unlinking outputHighQuality ${outputHighQuality}`);
    fs.unlinkSync(outputHighQuality);
    if (body.music) {
        fs.unlinkSync(outputWithMusic);
    }

    event.context.user.credits = event.context.user.credits.filter((i: any) => i.expires > Date.now());
    event.context.user.credits.sort((a: any, b: any) => a.expires - b.expires);

    event.context.user.credits[0].amount--;
    event.context.user.credits = event.context.user.credits.filter((i: any) => i.amount > 0);
    event.context.user.audioRegenerations = 3;

    await event.context.user.save();

    const newShort = new Short({
        owner: event.context.user._id,
        link: output,
        serverName: body.serverName,
        serverIp: body.serverIp,
        serverPort: body.serverPort,
        serverVersion: body.serverVersion,
        serverIcon: body.serverIcon,
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    await newShort.save();

    return output;
});

async function getSubtitlesForMp4(filename: string, attempt: number = 0) {
    console.log(`Generating attempt ${attempt + 1} / 3`);
    const audioData = await fs.readFileSync(filename);
    const uploadResponse = await axios.post(`${baseUrl}/upload`, audioData, {
        headers,
    });
    const uploadUrl = uploadResponse.data.upload_url;

    const data = {
        audio_url: uploadUrl,
    };

    const url = `${baseUrl}/transcript`;
    const response = await axios.post(url, data, { headers: headers });

    const transcriptId = response.data.id;
    const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`;

    while (true) {
        const pollingResponse = await axios.get(pollingEndpoint, {
            headers: headers,
        });
        const transcriptionResult = pollingResponse.data;

        if (transcriptionResult.status === "completed") {
            for (var word of transcriptionResult.words) {
                if (attempt + 1 < 3 && word.text.includes("@")) return await getSubtitlesForMp4(filename, attempt + 1);
                else if (word.text.includes("@")) word.text = word.text.replaceAll("@", " at ");
            }
            return transcriptionResult.words;
        } else if (transcriptionResult.status === "error") {
            throw new Error(`Transcription failed: ${transcriptionResult.error}`);
        } else {
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
}

function getVideoDuration(audioPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(audioPath, (err, metadata) => {
            if (err) {
                return reject(err);
            }
            // Get the duration of the audio in seconds
            const duration: number = metadata.format.duration || 0;
            resolve(duration);
        });
    });
}

function getVideoResolution(videoPath: string): any {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) return reject();

            // Find the video stream (stream with codec_type === 'video')
            const videoStream = metadata.streams.find((stream) => stream.codec_type === "video");

            if (videoStream) {
                const width = videoStream.width;
                const height = videoStream.height;

                return resolve({ width, height });
            }
            return reject();
        });
    });
}

function mergeVideoAndAudio(video: string, audio: string, audioVolume: number = 1): Promise<string> {
    return new Promise((resolve, reject) => {
        const name = `./public/tmp/${uuid()}.mp4`;
        ffmpeg()
            .addInput(video)
            .addInput(audio)
            .addOptions(["-map 0:v", "-map 1:a", "-c:v copy", "-shortest", `-filter:a volume=${audioVolume}`])
            .format("mp4")
            .on("error", (error) => reject(error))
            .on("end", () => resolve(name))
            .saveToFile(name);
    });
}

function enhanceAudioQuality(inputVideo: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const outputVideo = `./public/tmp/${uuid()}.mp4`;
        ffmpeg(inputVideo)
            .audioCodec("aac") // Use AAC codec for audio
            .audioBitrate("192k") // Set audio bit rate to 192 kbps
            .audioChannels(2) // Set the number of audio channels to 2 (stereo)
            .audioFrequency(44100) // Set the audio sample rate to 44.1 kHz
            .videoCodec("copy") // Copy the video stream without re-encoding
            .on("error", (error) => reject(error))
            .on("end", () => resolve(outputVideo))
            .save(outputVideo);
    });
}

function mergeVideoAndExistingAudio(video: string, audio: string, audioVolume: number = 1) {
    return new Promise((resolve, reject) => {
        const name = `./public/tmp/${uuid()}.mp4`;
        ffmpeg()
            .addInput(video)
            .addInput(audio)
            .complexFilter([
                `[1:a]volume=${audioVolume}[a1]`, // Adjust the volume of the new audio
                `[0:a][a1]amix=inputs=2:duration=shortest[a]`, // Mix the original and new audio
            ])
            .addOptions([
                "-map 0:v", // Use the video stream from the first input
                "-map [a]", // Use the mixed audio stream
                "-c:v copy", // Copy the video codec
                "-c:a aac", // Use AAC codec for audio
                "-b:a 192k", // Set audio bit rate to 192 kbps for higher quality
                "-ac 2", // Set the number of audio channels to 2 (stereo)
                "-ar 44100", // Set the audio sample rate to 44.1 kHz
                "-shortest", // Ensure the output is the shortest of the inputs
            ])
            .format("mp4")
            .on("error", (error) => reject(error))
            .on("end", () => resolve(name))
            .saveToFile(name);
    });
}

function mergeFinalVideoAudio(video: string, audio: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const name = `./public/tmp/${uuid()}.mp4`;
        ffmpeg()
            .addInput(video)
            .addInput(audio)
            .complexFilter([
                {
                    filter: "volume",
                    options: { volume: 1 },
                    inputs: "0:a",
                    outputs: "louder_audio",
                },
                {
                    filter: "volume",
                    options: { volume: 2 },
                    inputs: "1:a",
                    outputs: "quieter_audio",
                },
                {
                    filter: "amix",
                    inputs: ["louder_audio", "quieter_audio"],
                    options: { inputs: 2 },
                    outputs: "mixed_audio",
                },
            ])
            .addOptions(["-map 0:v", "-map [mixed_audio]", "-c:v copy", "-shortest"])
            .format("mp4")
            .on("error", (error) => reject(error))
            .on("end", () => resolve(name))
            .saveToFile(name);
    });
}

function mergeMp3Files(inputFiles: any): Promise<string> {
    console.log(inputFiles);
    var output = `./public/tmp/${uuid()}.mp3`;
    return new Promise(async (resolve, reject) => {
        const command = ffmpeg();
        inputFiles.forEach((file: any) => {
            command.input(file);
        });

        // Command to merge the files
        command
            .on("end", () => {
                resolve(output);
            })
            .on("error", (err) => {
                reject(err);
            })
            .mergeToFile(output, "./public/tmp");
    });
}

async function mergeVideos(lines: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
        var output = `./public/tmp/${uuid()}.mp4`;
        const creator = new FFCreator({
            cacheDir: "public/tmp",
            outputDir: "public/tmp",
            output,
            width: 1080,
            height: 1920,
        });

        const videoDurations = await Promise.all(lines.map(async (i: any) => await getVideoDuration(`./public${i.audio}`)));

        for (var line of lines) {
            const clipScene = new FFScene();
            const video = `./public${line.clip}`;
            const audio = `./public${line.audio}`;
            const duration = videoDurations[lines.indexOf(line)];
            const wait = videoDurations.reduce((acc, cur, index) => acc + (index < lines.indexOf(line) ? cur : 0), 0);
            clipScene.setDuration(duration);
            console.log(`Video duration ${duration}, wait ${wait}, video ${video}, audio ${audio}`);
            const ffVideo = new FFVideo({
                path: video,
                width: 1080,
                height: 1920,
                x: 1080 / 2,
                y: 1920 / 2,
            });

            ffVideo.setAudio(false);
            clipScene.addChild(ffVideo);
            creator.addChild(clipScene);
        }

        creator.start(); // start processing
        creator.closeLog(); // Close log (including perf)
        creator.on("start", () => {
            console.log(`FFCreator start`);
        });
        creator.on("error", (e) => {
            reject(e);
            console.log(`FFCreator error: ${JSON.stringify(e)}`);
        });
        creator.on("progress", (e) => {
            console.log(`FFCreator progress: ${e.percent * 100}%`);
        });
        creator.on("complete", (e) => {
            resolve(output);
            console.log(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `);
        });
    });
}

async function generateAudio(text: string, voice: string) {
    return await eleven.generate(
        {
            voice: voice,
            text: text,
            model_id: "eleven_multilingual_v2",
        },
        {
            maxRetries: 10,
        }
    );
}

function generateAudioToFile(text: string, voice: string) {
    return new Promise(async (resolve, reject) => {
        var fileName1 = `${uuid()}.mp3`;
        const filePath = path.join(runtimeConfig.AUDIO_DIR, fileName1);
        const audio: string = await new Promise(async (resolve, reject) => {
            var audio;
            audio = await generateAudio(text, voice);

            const fileStream = createWriteStream(filePath);

            audio.pipe(fileStream);
            fileStream.on("finish", () => resolve(`/audios/${fileName1}`));
            fileStream.on("error", reject);
        });
        console.log(`Done at ${audio}`);

        const fileName2 = `${uuid()}.mp3`;
        ffmpeg(`./public${audio}`)
            .audioFilters("loudnorm")
            .on("end", () => {
                console.log("Audio normalization finished.");
                fs.unlinkSync(filePath);
                resolve(`/audios/${fileName2}`);
            })
            .on("error", (err) => {
                console.error("An error occurred:", err.message);
                reject();
            })
            .save(`./public/audios/${fileName2}`);
    });
}

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
}
