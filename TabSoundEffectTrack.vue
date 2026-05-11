<template>
    <div :class="`container ${selected ? 'container-selected' : ''} ${locked ? 'container-locked' : ''}`" @click="onMusicClick">
        <div class="header">
            <p class="voice-title">{{ name ? formatMusicName(name) : "None" }}</p>
            <div class="play-container" v-if="name">
                <nuxt-img class="play-icon play-icon-play" v-if="!playing" src="/icons/media-play.svg" />
                <nuxt-img class="play-icon" v-else src="/icons/media-pause.svg" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.75rem;

    padding: 1.25rem;

    height: fit-content;

    border-radius: 10px;

    background-color: rgba(white, 0.05);

    &:hover {
        cursor: pointer;

        background-color: rgba(white, 0.07);
    }

    &-selected {
        @extend .container;
        background-color: $pink;

        &:hover {
            background-color: $pink;
        }

        & .voice-title {
            color: white;
        }

        & .play-container {
            background-color: white;
        }

        & .play-icon {
            filter: brightness(0) saturate(100%) invert(32%) sepia(96%) saturate(931%) hue-rotate(238deg) brightness(105%) contrast(110%);
        }

        & .desc {
            color: white;
        }
    }

    &-locked {
        @extend .container;

        opacity: 0.3;

        & .voice-title {
            color: rgba(white, 0.6);
        }

        & .play-container {
            display: none;
        }

        &:hover {
            cursor: default;
        }
    }

    @media (max-width: 500px) {
        width: 100%;
    }
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
}

.voice-title {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 600;
    color: $pink;
}

.play-container {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 2rem;
    width: 2rem;

    border-radius: 1000px;

    background-color: $pink;
}

.play-icon {
    height: 0.85rem;

    &-play {
        margin-left: 2px;
    }
}

.desc {
    margin: 0;

    font-size: 0.85rem;
    line-height: 160%;
    color: rgba(white, 0.6);
}
</style>

<script setup>
const props = defineProps({
    name: String,
    selected: Boolean,
    locked: Boolean,
});
const emit = defineEmits(["select"]);

const audioToListen = ref();
const playing = ref();
const globalPlaying = useState("music-currently-playing");

function onMusicClick() {
    if (props.locked) return;

    if (playing.value) {
        stopAudio();
    } else {
        playAudio();
        playing.value = true;
    }

    emit("select");
}

watch(globalPlaying, () => {
    if (globalPlaying.value != props.name) stopAudio();
});

onUnmounted(() => {
    stopAudio();
});

function stopAudio() {
    if (audioToListen.value) {
        audioToListen.value.pause();
    }
    playing.value = false;
}

function playAudio() {
    console.log(`Playing ${`/sound-effects/${props.name}`}`);
    audioToListen.value = new Audio(`/sound-effects/${props.name}`);
    audioToListen.value.volume = 1;

    globalPlaying.value = props.name;
    playing.value = true;
    audioToListen.value.play();

    audioToListen.value.addEventListener("ended", () => {
        if (playing.value) playing.value = false;
    });
}

function formatMusicName(string) {
    return string
        .replaceAll("-", " ")
        .split(".")[0]
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
</script>
