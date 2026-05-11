<template>
    <div class="creator-container" v-if="user?.data?.credits && user.getCredits() > 0">
        <ShortCreatorTabs @setTab="setTab" />
        <!-- <img :src="shortImage?.src" :style="{ width: '600px' }" /> -->
        <div class="creator-content">
            <!-- <input v-model="tempData" />
            <button @click="manuallyFinish">Manually generate</button> -->
            <div class="header">
                <div class="header-text">
                    <p class="header-title">Short Creator</p>
                    <p class="header-subtitle">Create a new short</p>
                    <!-- <p class="header-subtitle">{{ tab }}</p> -->
                </div>
            </div>
            <ShortCreatorTabScript v-if="tab == 'script'" />
            <ShortCreatorTabPronunciation v-if="tab == 'pronunciation'" />
            <ShortCreatorTabVoice v-if="tab == 'voice'" />
            <ShortCreatorTabFont v-if="tab == 'font'" />
            <ShortCreatorTabClips v-if="tab == 'clips'" />
            <ShortCreatorTabMusic v-if="tab == 'music'" />
            <ShortCreatorTabSoundEffect v-if="tab == 'sound'" />
            <ShortCreatorTabLoading v-if="!tab" />
            <ShortCreatorTabFinished v-if="tab == 'finished'" />
            <div class="buttons">
                <button class="button-back" @click="toggleTab(false)" :disabled="!tab">Go Back</button>
                <button class="button-continue" @click="toggleTab(true)" :disabled="tabsDisabled">
                    {{ tab == "music" ? "Finish" : tab == "finished" ? "Finished" : !tab ? "" : "Continue" }}
                </button>
            </div>
        </div>
    </div>
    <div v-if="!user?.data?.plan">
        <div class="page-container">
            <p class="no-credits big">You are not subscribed</p>
            <p class="no-credits gray">You must <nuxt-link to="/select-plan">select a plan first</nuxt-link> in order to use the shorts creator.</p>
        </div>
    </div>
    <div v-if="user?.data?.plan && user?.data?.credits?.filter((i) => i.expires > Date.now()).reduce((acc, cur) => acc + cur.amount, 0) <= 0">
        <div class="page-container">
            <p class="no-credits big">You have no credits</p>
            <p class="no-credits gray">You can visit the <nuxt-link to="/credits">credits page</nuxt-link> in order to purchase more credits.</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.creator-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    height: 100%;
    width: 100%;
}

.shortInfo {
    font-size: 0.75rem;
}

.creator-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: 100%;
    width: 100%;

    padding: 3rem;

    @media (max-width: 500px) {
        padding: 2rem;
    }
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    margin-bottom: 1.5rem;

    @media (max-width: 500px) {
        display: none;
    }
}

.header-title {
    margin: 0 0 0.5rem;

    font-size: 2.5rem;
    font-weight: 700;
    color: white;
}

.header-subtitle {
    margin: 0;

    font-size: 1.5rem;
    color: rgba(white, 0.4);
}

.buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1.5rem;

    margin-top: auto;
}

.button {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 2.5rem;
    width: 9rem;

    margin-top: 2rem;

    border: none;
    border-radius: 5px;

    font-size: 0.85rem;
    color: white;

    &:hover {
        cursor: pointer;
    }

    &:disabled {
        opacity: 0.4 !important;

        &:hover {
            cursor: default;
        }
    }

    &-back {
        @extend .button;

        background-color: rgba($pink, 0.1);
    }

    &-continue {
        @extend .button;

        background-color: $pink;
    }
}

.page-container {
    width: 100%;
    height: 100vh;

    align-items: center;

    display: flex;
    flex-direction: column;
}

.no-credits {
    font-size: 2.5rem;
    margin: 0;
}

.no-credits.gray {
    color: rgba(white, 0.6);
    font-size: 1rem;
}

.no-credits.big {
    font-weight: 700;
    margin-top: 7rem;
}

.no-credits a {
    color: rgba(white, 0.6);
    text-decoration: underline;
    transition-duration: 0.3s;
}

.no-credits a:hover {
    color: rgba(white, 1);
}
</style>

<script setup>
const user = useUserStore();
const tab = useState("active-tab", () => "script");

useHead({
    title: "Gamey - Short Creator",
    meta: [{ name: "description", content: "#1 Growth Tool For Minecraft Servers" }],
});

const tabsDisabled = computed(() => {
    if (tab.value == "script") {
        if (!shortInfo.value.serverName || !shortInfo.value.serverIp || !shortInfo.value.serverPort || !shortInfo.value.serverVersion || !shortInfo.value.script) {
            return true;
        }
    }

    if (tab.value == "voice") {
        if (!shortInfo.value.voice) return true;
    }

    if (tab.value == "clips") {
        if (shortInfo.value.voiceover.find((i) => !i.clip)) return true;
    }

    if (tab.value == "font") {
        if (!shortInfo.value.font) return true;
    }

    // if (tab.value == "music") {
    //     if (!shortInfo.value.music) return true;
    // }

    return !tab.value;
});

const tabs = ["script", "voice", "pronunciation", "sound", "clips", "font", "music", "finished"];
const shortInfo = useState("shortInfo", shortInfoSettings);

const selectedClip = useState("selected-clip");
const selectedLine = useState("selected-line");

function toggleTab(forward) {
    if (tab.value == "finished" && forward) {
        tab.value = "script";
        selectedClip.value = null;
        selectedLine.value = null;
        shortInfo.value = shortInfoSettings();
        return navigateTo("/shorts");
        // return finish();
    }

    const currentStage = tabs.indexOf(tab.value);

    if (currentStage == 0 && !forward) return;
    if (currentStage == tabs.length - 2 && forward && tab.value != "loading") {
        return finish();
    }

    setTab(tabs[currentStage + (forward ? 1 : -1)]);
}

// const shortImage = ref();
// onMounted(() => {
//     getShortEndImage().then((i) => (shortImage.value = i));
// });

// watch(
//     () => JSON.stringify(shortInfo.value),
//     async () => {
//         console.log("regenrating short end image");
//         const endImage = await getShortEndImage();
//         shortImage.value = endImage;
//     }
// );

async function finish() {
    tab.value = "";
    const body = { ...shortInfo.value };
    const imageData = await getShortEndImage(shortInfo);
    body.endScreenImage = imageData.src;
    body.endScreenImageHeight = imageData.height;
    body.endScreenImageWidth = imageData.width;

    console.log("FINISHING!!!");
    console.log(JSON.stringify(shortInfo.value));
    const res = await $fetch("/api/generate-short", {
        method: "POST",
        body: body,
        timeout: 600 * 1000,
    });
    console.log(res);

    if (res) {
        console.log(res);
        shortInfo.value.finished = res;
        tab.value = "finished";
    }
}

const tempData = ref(
    `{"gamemode":"skyblock","script":"Are you ready for flying fish in Minecraft?Join the ultimate Skyblock experience on Hypixel!Create your island and float high above the world.Catch flying fish to boost your economy!Trade resources and build epic farms.Team up with friends for unforgettable adventures.Jump into the fun at play.hypixel.net!Don't miss out—your island awaits!","server":"","font":"catfiles.ttf","voiceover":[{"id":0.12331372234025895,"text":"Are you ready for flying fish in Minecraft?","audio":"","pronunciation":"Are you ready for flying fish in Minecraft?","clip":"/clips/intro/skyblock/1.mp4"},{"id":0.47016866914007593,"text":"Join the ultimate Skyblock experience on Hypixel!","audio":"","pronunciation":"Join the ultimate Skyblock experience on Hypixel!","clip":"/clips/gameplay/skyblock/1.mov"},{"id":0.537955872006588,"text":"Create your island and float high above the world.","audio":"","pronunciation":"Create your island and float high above the world.","clip":"/clips/gameplay/skyblock/10.mp4"},{"id":0.10961078754288778,"text":"Catch flying fish to boost your economy!","audio":"","pronunciation":"Catch flying fish to boost your economy!","clip":"/clips/gameplay/skyblock/11.mov"},{"id":0.27311501667029936,"text":"Trade resources and build epic farms.","audio":"","pronunciation":"Trade resources and build epic farms.","clip":"/clips/gameplay/skyblock/12.mov"},{"id":0.6706987555797601,"text":"Team up with friends for unforgettable adventures.","audio":"","pronunciation":"Team up with friends for unforgettable adventures.","clip":"/clips/gameplay/skyblock/13.mp4"},{"id":0.5383105760392619,"text":"Jump into the fun at play.hypixel.net!","audio":"","pronunciation":"Jump into the fun at play.hypixel.net!","clip":"/clips/gameplay/skyblock/14.mp4"},{"id":0.2177320820065496,"text":"Don't miss out—your island awaits!","audio":"","pronunciation":"Don't miss out—your island awaits!","clip":"/clips/outro/skyblock/1.mp4"}],"clips":{},"music":"elevator-music.mkv","finished":"","serverName":"Hypixel","serverIp":"play.hypixel.net","serverPort":"25565","serverVersion":"1.8.9","serverIcon":"/server-icons/27jONfq1ZWU8e458.png","fontColor":"#ffffff","outlineColor":"#000000","voice":"2mltbVQP21Fq8XgIfRQJ"}`
);
async function manuallyFinish() {
    tab.value = "";
    console.log(tempData.value);
    const body = JSON.parse(tempData.value);
    const imageData = await getShortEndImage({ value: JSON.parse(tempData.value) });
    body.endScreenImage = imageData.src;
    body.endScreenImageHeight = imageData.height;
    body.endScreenImageWidth = imageData.width;

    console.log("STARTING TO FETCH");
    var { data } = await useFetch("/api/generate-short", {
        method: "POST",
        body,
        timeout: 600 * 1000,
    });
    console.log("FETCHING???");

    if (data.value) {
        shortInfo.value.finished = data.value;
        tab.value = "finished";
    }
}

async function setTab(text) {
    if (tab.value == "") return;

    const oldTab = tab.value;
    tab.value = "";
    if (oldTab == "voice" && text == "pronunciation") {
        await generateVoiceover();
    }

    tab.value = text;
}

async function generateVoiceover() {
    var textArray = shortInfo.value.script.split("\n").map((i) => ({
        id: Math.random(),
        text: i,
        audio: "",
        pronunciation: i,
    }));

    // await Promise.all(
    //     textArray.map(async (i) => {
    //         const res = await $fetch("/api/get-tts", {
    //             method: "POST",
    //             body: JSON.stringify({
    //                 text: i.text,
    //                 voice: shortInfo.value.voice,
    //             }),
    //         });
    //         textArray[textArray.indexOf(i)].audio = res;
    //     })
    // );

    shortInfo.value.voiceover = textArray;
}

async function getShortEndImage(shortInfo, WIDTH = 900, HEIGHT = 300) {
    // const WIDTH = 900;
    // const HEIGHT = 300;
    const toFontName = (s) => s.replaceAll(".ttf", "").replace(/^_*(.)|_+(.)/g, (s, c, d) => (c ? c.toUpperCase() : " " + d.toUpperCase()));
    const fontName = toFontName(shortInfo.value.font);
    const fontSource = "url(" + window.location.origin + `/fonts/` + shortInfo.value.font + ")";
    const font = new FontFace(fontName, fontSource);
    await font.load();

    document.fonts.add(font);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    canvas.style.imageRendering = "pixelated";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.roundRect(0, 0, WIDTH, HEIGHT, 20);
    ctx.fill();
    canvas.style.width = WIDTH + "px";
    canvas.style.height = HEIGHT + "px";

    const yPadding = 40;
    const xPadding = 40;
    const textHeightPadding = 60;
    const imageGap = 60;
    const rightPadding = 20;

    const icon = new Image(HEIGHT - yPadding * 2, HEIGHT - yPadding * 2);
    icon.src = `/api/get/${shortInfo.value.serverIcon.replaceAll("/", "MONKEYBRANCH")}`;
    const text = ["IP: " + shortInfo.value.serverIp, "JAVA: " + shortInfo.value.serverVersion, "BEDROCK PORT: " + shortInfo.value.serverPort];
    ctx.font = `400 56px ${toFontName(shortInfo.value.font)}`;
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";

    var textHeight = text.map((i) => {
        let metrics = ctx.measureText(text[i]);
        return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    });

    const freeSpace = HEIGHT - textHeightPadding * 2 - textHeight.reduce((acc, cur) => acc + cur, 0);
    var maxTextWidth = 0;

    for (let i = 0; i < 3; i++) {
        let metrics = ctx.measureText(text[i]);
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        let actualWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
        maxTextWidth = Math.max(actualWidth, maxTextWidth);

        ctx.fillText(text[i], imageGap + xPadding + icon.width, textHeightPadding + actualHeight + (freeSpace / 2) * i + textHeight.reduce((acc, cur, index) => (index < i ? acc + cur : acc), 0));
        ctx.strokeStyle = "black";
        ctx.lineWidth = "1";
        ctx.strokeText(text[i], imageGap + xPadding + icon.width, textHeightPadding + actualHeight + (freeSpace / 2) * i + textHeight.reduce((acc, cur, index) => (index < i ? acc + cur : acc), 0));
    }

    var newCanvasWidth = maxTextWidth + imageGap + xPadding * 2 + icon.width + rightPadding;

    if (newCanvasWidth != WIDTH) {
        return await getShortEndImage(shortInfo, newCanvasWidth, HEIGHT);
    }

    await new Promise((resolve, reject) => {
        icon.onload = resolve;
    });

    ctx.drawImage(icon, xPadding, yPadding, icon.width, icon.height);
    const result = new Image(WIDTH, HEIGHT);
    result.src = canvas.toDataURL("image/png");
    return { src: result.src, height: HEIGHT, width: WIDTH };
}
</script>
