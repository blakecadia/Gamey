import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

const runtimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event) => {
    console.log("Upload clip thrown!");
    if (!event.context.user)
        throw createError({
            statusCode: 401,
            statusMessage: "Not logged in",
        });

    if (event.context.user.plan != "premium" && event.context.user.plan != "trial")
        throw createError({
            statusCode: 401,
            statusMessage: "Premium only",
        });

    if (event.context.user.clips.length > 49)
        throw createError({
            statusCode: 400,
            statusMessage: "Ran out of clip storage",
        });

    const { files }: any = await readBody<{ files: File[] }>(event);

    if (files[0].type != "video/mp4") return false;

    files[0];

    const clipName = await storeFileLocally(files[0], 16);

    if (((await getMp4Duration(`${runtimeConfig.MOUNT}/${clipName}`)) as number) > 20) {
        fs.unlinkSync(`${runtimeConfig.MOUNT}/${clipName}`);
        throw createError({
            statusCode: 401,
            statusMessage: "Max 20 seconds",
        });
    }

    event.context.user.clips.push(`/server-icons/${clipName}`);
    await generateVideoThumbnail(`${runtimeConfig.MOUNT}/${clipName}`, `${runtimeConfig.MOUNT.replaceAll("/server-icons", "/clips-preview")}/uploads/${clipName.replaceAll(".mp4", ".jpg".replaceAll(".mov", ".jpg"))}`);
    await event.context.user.save();
    console.log("Done!");

    return clipName;
});

import { exec } from "child_process";

// Function to generate a thumbnail using ffmpeg
function generateVideoThumbnail(videoPath: string, outputImagePath: string) {
    return new Promise((resolve, reject) => {
        // Use ffmpeg to extract the first frame as an image
        const command = `ffmpeg -i "${videoPath}" -ss 00:00:00.5 -frames:v 1 "${outputImagePath}"`;

        exec(command, (error: any, stdout: any, stderr: any) => {
            if (error) {
                console.error("Error generating video thumbnail:", error);
                return reject(error);
            }
            resolve(stdout);
        });
    });
}

/**
 * Get the duration of an MP4 file in seconds.
 * @param {string} filePath - The path to the MP4 file.
 * @returns {Promise<number>} - The duration of the video in seconds.
 */
function getMp4Duration(filePath: string) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                const duration = metadata.format.duration;
                resolve(duration);
            }
        });
    });
}
