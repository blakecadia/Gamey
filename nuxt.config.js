// import { ElevenLabsClient, play } from "elevenlabs";
// import { createWriteStream } from "fs";
// import path from "path";

// const eleven = new ElevenLabsClient({
//     apiKey: process.env.NUXT_ELEVEN_KEY,
// });

// async function generateAudio(text, voice) {
//     return await eleven.generate(
//         {
//             voice: voice,
//             text: text,
//             model_id: "eleven_multilingual_v2",
//         },
//         {
//             maxRetries: 10,
//         }
//     );
// }

// function generateAudioToFile(text, voice, fileName) {
//     return new Promise(async (resolve, reject) => {
//         var attempt = 1;
//         var audio;

//         // while (attempt++ < 20) {
//         //     try {
//         //         console.log(voice, text);
//         audio = await generateAudio(text, voice);

//         //         if (audio) break;
//         //         else await new Promise((resolve, reject) => setTimeout(resolve, 500));
//         //     } catch (e) {
//         //         if (attempt > 10) console.log(e);
//         //     }
//         // }

//         // if (!audio) return reject();

//         const filePath = path.join("/home/dladeira/Projects/gameyai", fileName);
//         const fileStream = createWriteStream(filePath);

//         audio.pipe(fileStream);
//         fileStream.on("finish", () => resolve(`/audios/${fileName}`));
//         fileStream.on("error", reject);
//     });
// }

// generateAudioToFile("the flying fish", "Rachel", "rachel-1.mp3").then(() => {
//     generateAudioToFile("go really fast", "Rachel", "rachel-2.mp3").then(() => {
//         generateAudioToFile("the flying fish go really fast", "Rachel", "rachel-3.mp3").then(() => {
//             generateAudioToFile("the flying fish", "2mltbVQP21Fq8XgIfRQJ", "axell-1.mp3").then(() => {
//                 generateAudioToFile("go really fast", "2mltbVQP21Fq8XgIfRQJ", "axell-2.mp3").then(() => {
//                     generateAudioToFile("the flying fish go really fast", "2mltbVQP21Fq8XgIfRQJ", "axell-3.mp3");
//                 });
//             });
//         });
//     });
// });

// const premiumVoices = [
//     { name: "Brittney", id: "Brittney - Young, Peppy Female - Social Media, How To's, Explainers", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Haily", id: "Halley McClure", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Parker", id: "Parker", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Blake", id: "Blake", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Ace", id: "Ace", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Magic", id: "VA28WhTpCV3wdrzy4Rhb", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Hope", id: "tnSpp4vdxKPjI9w0GnoV", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
// ];

// const basicVoices = [
//     { name: "Archer", id: "Archer", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Alex", id: "Alex - Young American Male", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Arthur", id: "Arthur - Energetic American Male Narrator", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Axell", id: "2mltbVQP21Fq8XgIfRQJ", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "SlatePlays", id: "SlatePlays", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
//     { name: "Harry", id: "Harry", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore." },
// ];
// async function bootstrap() {
//     for (var voice of basicVoices.concat(premiumVoices)) {
//         console.log("generating " + voice.name);
//         await new Promise(async (resolve, reject) => {
//             var attempt = 1;
//             var audio;

//             while (attempt++ < 10) {
//                 try {
//                     audio = await eleven.generate({
//                         voice: voice.id,
//                         text: "Use me to Advertise your minecraft server! This is my voice!",
//                         model_id: "eleven_multilingual_v2",
//                     });

//                     if (audio) break;
//                     else await new Promise((resolve, reject) => setTimeout(resolve, 3000));
//                 } catch (e) {}
//             }

//             if (!audio) return reject();

//             const fileName = `${voice.name.replaceAll(" ", "_")}.mp3`;
//             const filePath = path.join("./public/audio-preview", fileName);
//             const fileStream = createWriteStream(filePath);

//             audio.pipe(fileStream);
//             fileStream.on("finish", () => resolve(`/audio-preview/${fileName}`));
//             fileStream.on("error", (err) => {
//                 console.log(`failed ${voice.name}`);
//                 reject(err);
//             });
//         });
//     }
// }

// bootstrap();

// import fs from "fs-extra";
// import path from "path";
// import { exec } from "child_process";

// const clipsDir = path.resolve("clips");
// const publicClipsPreviewDir = path.resolve("public/clips-preview");

// // Function to create directories recursively and handle mp4 files
// async function processDirectory(srcDir, destDir) {
//     try {
//         // Ensure destination directory exists
//         await fs.ensureDir(destDir);

//         // Read directory contents
//         const files = await fs.readdir(srcDir);

//         for (const file of files) {
//             const srcFilePath = path.join(srcDir, file);
//             const destFilePath = path.join(destDir, file);

//             const stat = await fs.stat(srcFilePath);

//             if (stat.isDirectory()) {
//                 // If the current file is a directory, process it recursively
//                 await processDirectory(srcFilePath, destFilePath);
//             } else if (stat.isFile()) {
//                 const fileExtension = path.extname(file).toLowerCase();
//                 // Process both .mp4 and .mov files
//                 if (fileExtension === ".mp4" || fileExtension === ".mov") {
//                     const previewImagePath = path.join(destDir, `${path.basename(file, fileExtension)}.jpg`);
//                     await generateVideoThumbnail(srcFilePath, previewImagePath);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error("Error processing directory:", error);
//     }
// }

// // Function to generate a thumbnail using ffmpeg
// function generateVideoThumbnail(videoPath, outputImagePath) {
//     return new Promise((resolve, reject) => {
//         // Use ffmpeg to extract the first frame as an image
//         const command = `ffmpeg -i "${videoPath}" -ss 00:00:01 -frames:v 1 "${outputImagePath}"`;

//         exec(command, (error, stdout, stderr) => {
//             if (error) {
//                 console.error("Error generating video thumbnail:", error);
//                 return reject(error);
//             }
//             resolve(stdout);
//         });
//     });
// }

// console.log("Processing clips directory");
// processDirectory("public/clips", "public/clips-preview").then(() => {
//     console.log("Finished processing clips directory");
// });

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devServer: {
        port: 3042,
    },
    css: ["@/assets/css/global.scss"],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "sass:color";@import "@/assets/css/variables.scss";',
                    api: "modern-compiler",
                },
            },
        },
    },
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["nuxt-mongoose", "@nuxt/image", "nuxt-file-storage", "@pinia/nuxt", "nuxt-auth-utils"],
    fileStorage: {
        mount: process.env.NUXT_MOUNT,
    },
    mongoose: {
        uri: process.env.NUXT_MONGOOSE_URI,
    },
    runtimeConfig: {
        MONGOOSE_URI: process.env["NUXT_MONGOOSE_URI"],
        ELEVEN_KEY: process.env["NUXT_ELEVEN_KEY"],
        ASSEMBLY_KEY: process.env["NUXT_ASSEMBLY_KEY"],
        OAUTH_GOOGLE_REDIRECT: process.env["NUXT_OAUTH_GOOGLE_REDIRECT"],
        OPENAI_KEY: process.env["NUXT_OPENAI_KEY"],
        AUDIO_DIR: process.env["NUXT_AUDIO_DIR"],
        STRIPE_KEY: process.env["NUXT_STRIPE_KEY"],
        STRIPE_SECRET: process.env["NUXT_STRIPE_KEY"],
        STRIPE_WEBHOOK: process.env["NUXT_STRIPE_WEBHOOK"],
        MOUNT: process.env["NUXT_MOUNT"],
    },
});
