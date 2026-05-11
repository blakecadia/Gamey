<template>
    <div class="clips-page-container">
        <div class="lines-list">
            <ShortCreatorTabClipsClip :id="line.id" v-for="line of shortInfo.voiceover" @click="switchSelectedLine(line.id)" />
        </div>

        <div class="clips-container">
            <div class="clips-tabs">
                <div @click="clipTab = 'gamey'" :class="`clip-tab${clipTab == 'gamey' ? '-selected' : ''}`">Gamey Clips</div>
                <div @click="clipTab = user.data.plan == 'premium' || user.data.plan == 'trial' ? 'own' : 'gamey'" :class="`clip-tab${clipTab == 'own' ? '-selected' : ''}`">
                    <p class="clip-tab-premium">Premium</p>
                    <div>Your Clips</div>
                </div>
            </div>
            <div class="category" v-if="clipTab == 'gamey'" v-for="category of clips ? Object.keys(clips).filter((i) => (special ? i == special : !specialValues.includes(i))) : []">
                <div class="clips">
                    <div class="clip" v-for="clip of clips[category][shortInfo.gamemode]" @click="selectedClip = `/clips/${category}/${shortInfo.gamemode}/${clip}`">
                        <!-- <video :id="`video-${category}-${clip}`" :src="`/clips/${category}/${shortInfo.gamemode}/${clip}`" type="video/mp4" @mouseenter="videoMouseEnter" @mouseleave="videoMouseLeave" muted></video> -->
                        <img :id="`video-${category}-${clip}`" :src="`/clips-preview/${category}/${shortInfo.gamemode}/${clip.replaceAll('.mp4', '.jpg').replaceAll('.mov', '.jpg')}`" />
                    </div>
                </div>
            </div>
            <div class="own-clips" v-if="clipTab == 'own'">
                <div class="upload-row">
                    <label for="file" class="upload-button" v-if="user.data.clips.length < 50">Upload</label>
                    <p class="upload-info">1080px x 1920px, max 20 sec<br />{{ user.data.clips.length }} / 50 clips uploaded</p>
                </div>
                <p class="upload-limit"></p>
                <input style="display: none" id="file" type="file" @input="handleFileInput" accept="video/mp4" />
                <div class="clips">
                    <div class="clip clip-own" v-for="clip of user.data.clips" @click="selectClip(clip)">
                        <img :id="`video-own-${clip}`" :src="`/api/get/clips-previewMONKEYBRANCHuploadsMONKEYBRANCH${clip.replaceAll('/server-icons', 'MONKEYBRANCH').replaceAll('/', 'MONKEYBRANCH').replaceAll('.mp4', '.jpg').replaceAll('.mov', '.jpg')}`" />
                        <div class="clip-own-trash-wrapper">
                            <img class="clip-own-trash" src="/icons/icon-trash.svg" @click="deleteMyClip(clip)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="clips-player">
            <video v-if="selectedClip" autoplay controls width="250" :src="selectedClip ? '/api/get/' + selectedClip.slice(1).replaceAll('/', 'MONKEYBRANCH') : ''" type="video/mp4"></video>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.clips-page-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: 3rem;

    height: 70%;
    width: 100%;

    @media (max-width: 500px) {
        flex-direction: column;
        gap: 1rem;
    }
}

.lines-list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 1rem;

    height: 100%;

    width: 40%;

    padding-right: 1rem;

    overflow-y: scroll;

    @media (max-width: 500px) {
        height: 70%;
        width: 100%;
    }
}

.clips-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;

    height: 100%;
    width: 25%;

    padding: 1rem;

    border-radius: 10px;

    background-color: rgba(white, 0.05);

    overflow-y: scroll;

    @media (max-width: 500px) {
        width: 100%;
    }
}

.clips-tabs {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;

    width: 100%;

    color: $pink;
}

.clip-tab {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 4rem;
    width: 100%;

    border-radius: 5px;

    background-color: rgba($pink, 0.1);

    &:hover {
        cursor: pointer;

        background-color: rgba($pink, 0.15);
    }

    &-selected {
        @extend .clip-tab;

        background-color: $pink;
        color: white;

        &:hover {
            background-color: $pink;
        }
    }
}

.clip-tab-premium {
    margin: 0;

    font-size: 0.7rem;
    opacity: 0.5;
}

.upload-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;

    margin-bottom: 0.75rem;
}

.upload-button {
    padding: 0.75rem 1.25rem;

    border-radius: 5px;

    font-size: 0.75rem;
    background-color: rgba($pink, 0.1);

    &:hover {
        cursor: pointer;

        background-color: rgba($pink, 0.15);
    }
}

.upload-info {
    line-height: 160%;
    font-size: 0.75rem;
    opacity: 0.5;
}

.clips {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 1rem;
}

.clip {
    max-height: 8rem;
    max-width: 8rem;

    border-radius: 5px;

    &:hover {
        cursor: pointer;
    }

    overflow: hidden;

    & img:not(.clip-own-trash) {
        height: 100%;
        width: 100%;
    }

    & video {
        height: 100%;
        width: 100%;
    }
}

.clip-own {
    position: relative;
}

.clip-own-trash-wrapper {
    position: absolute;
    bottom: 0.2rem;
    right: 0.2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 1.25rem;
    width: 1.25rem;

    padding: 0.2rem;

    border-radius: 5px;

    background-color: rgba(red, 0.4);

    &:hover {
        background-color: rgba(red, 0.75);
    }
}

.clip-own-trash {
    height: 100%;
    width: 100%;
}

.clips-player {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 25%;

    border-radius: 10px;

    overflow: hidden;

    background-color: rgba(white, 0.05);

    & video {
        min-height: 100%;
        min-width: 100%;
    }

    @media (max-width: 500px) {
        width: 100%;
    }
}
</style>

<script setup>
const user = useUserStore();
const { data: clips } = useFetch("/api/get-clips", {
    method: "GET",
});

const { handleFileInput, files } = useFileStorage();

const clipTab = ref("gamey");

const shortInfo = useState("shortInfo", shortInfoSettings);

const selectedClip = useState("selected-clip");
const selectedLine = useState("selected-line", () => shortInfo.value.voiceover[0].id);

watch(files.value, async () => {
    if (files.value.length == 0) return;
    console.log("Files changed!");
    await $fetch("/api/upload-clip", {
        method: "POST",
        body: {
            files: files.value,
        },
    });

    console.log("Uploaded clip!");

    await user.fetchData();
    console.log("Fetch data!");
});

watch(
    selectedLine,
    () => {
        if (!shortInfo.value.voiceover.find((i) => i.id == selectedLine.value)) {
            selectedLine.value = shortInfo.value.voiceover[0].id;
        }
    },
    {
        immediate: true,
    }
);

const specialValues = ["intro", "outro"];
const special = computed(() => {
    if (shortInfo.value.voiceover.findIndex((i) => i.id == selectedLine.value) == 0) return "intro";
    if (shortInfo.value.voiceover.findIndex((i) => i.id == selectedLine.value) == shortInfo.value.voiceover.length - 1) return "outro";
});

function switchSelectedLine(id) {
    selectedLine.value = id;
}

watch(selectedLine, () => {
    selectedClip.value = shortInfo.value.voiceover.find((i) => i.id == selectedLine.value)?.clip;
});

const clipDeleteTimer = ref(Date.now());

function selectClip(clip) {
    setTimeout(() => {
        if (Date.now() - clipDeleteTimer.value < 200) return;
        selectedClip.value = clip;
    }, 100);
}

async function deleteMyClip(clip) {
    for (var info of shortInfo.value.voiceover) {
        if (info.clip == selectedClip.value) {
            info.clip = null;
        }
    }
    if (selectedClip.value == clip) selectClip.value = null;
    clipDeleteTimer.value = Date.now();
    await $fetch("/api/delete-clip", {
        method: "POST",
        body: {
            clip,
        },
    });
    await user.fetchData();
}

// watch(
//     clips,
//     () => {
//         if (clips.value) {
//             console.log(clips.value.intro.skyblock[0]);
//             for (var line of shortInfo.value.voiceover) {
//                 line.clip = `/clips/${"intro"}/${`skyblock`}/${"1.mp4"}`;
//             }
//         }
//     },
//     {
//         immediate: true,
//     }
// );
</script>
