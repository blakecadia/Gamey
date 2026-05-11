<template>
    <div class="input-container">
        <p class="input-title">Verse {{ shortInfo.voiceover.indexOf(verse) + 1 }}</p>
        <div class="input-content">
            <div class="input-content-inner">
                <p class="input-text-subtitles">{{ text }}</p>
                <input :class="`input-input${changed ? '-active' : ''}`" type="text" v-model="pronunciation" :disabled="disabled" />
            </div>
            <div :class="disabled || user.data.audioRegenerations <= 0 ? 'play-button-disabled' : playing ? 'play-button-playing' : 'play-button'" @click="playAudio">
                <nuxt-img :class="playing ? 'play-button-icon-pause' : 'play-button-icon-play'" :src="playing ? '/icons/media-pause.svg' : '/icons/media-play.svg'" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.input-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.5rem;

    direction: ltr;

    width: 100%;
}

.input-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: 1rem;

    height: 100%;
    width: 100%;
}

.input-content-inner {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 1rem;

    height: 100%;
    width: 80%;

    &-button {
        @extend .input-content-inner;

        width: 20%;
    }

    &-text {
        @extend .input-content-inner;

        width: fit-content;
    }
}

.input-title-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    height: 100%;
}

.input-title {
    margin: 0 0 0 1rem;

    font-size: 0.75rem;
    font-weight: 400;
    color: rgba(white, 0.4);
}

.input-subtitle {
    margin: 0;

    font-size: 0.75rem;
    white-space: nowrap;
    color: rgba(white, 0.4);
}

.input-input {
    width: 100%;

    border: 1px solid transparent;
    border-radius: 5px;

    padding: 0.75rem 1rem;

    font-family: inherit;
    font-size: 1rem;
    background-color: rgba(white, 0.05);
    color: white;

    &-active {
        @extend .input-input;

        background-color: rgba(white, 0.05);
    }

    &:focus {
        outline: none;
    }

    &::placeholder {
        color: rgba(white, 0.4);
    }

    & option {
        color: black;
    }

    &:disabled {
        opacity: 0.25;
    }
}

.input-text-subtitles {
    margin: 0.25rem 1rem;
    color: rgba(white, 0.4);
}

.play-button {
    display: flex;
    justify-content: center;
    align-items: center;

    margin-top: auto;

    height: 3rem;
    width: 3rem;

    border-radius: 1000px;

    background-color: $pink;

    user-select: none;

    &:hover {
        background-color: color.adjust($pink, $lightness: 4%);
        cursor: pointer;
    }

    &-disabled {
        @extend .play-button;

        opacity: 0.2;

        &:hover {
            background-color: $pink;
            cursor: default;
        }
    }

    &-playing {
        @extend .play-button;
    }
}

.play-button-icon {
    height: 1.15rem;

    &-play {
        @extend .play-button-icon;

        margin-left: 3px;
    }

    &-pause {
        @extend .play-button-icon;
    }
}
</style>

<script setup>
const user = useUserStore();

const props = defineProps({
    id: String,
});

const shortInfo = useState("shortInfo", shortInfoSettings);

const verse = computed(() => {
    for (var line of shortInfo.value.voiceover) {
        // @ts-ignore
        if (line.id == props.id) return line;
    }
});

const changed = ref(false);
const text = ref(verse.value.text);
const pronunciation = ref(verse.value.pronunciation);
const audio = ref(verse.value.audio);
const disabled = ref(false);
const playing = ref(false);
const audioToListen = ref();
const globalAudioPlaying = useState("globalAudioPlaying");

watch(globalAudioPlaying, () => {
    if (globalAudioPlaying.value != props.id)
        if (audioToListen.value) {
            audioToListen.value.pause();
            playing.value = false;
        }
});

async function playAudio() {
    if (disabled.value || user.data.audioRegenerations <= 0) return;

    if (changed.value || !audio.value) {
        disabled.value = true;

        user.data.audioRegenerations--;
        const res = await $fetch("/api/get-tts", {
            method: "POST",
            body: JSON.stringify({
                text: pronunciation.value,
                voice: shortInfo.value.voice,
            }),
        });
        audio.value = res;
        disabled.value = false;
        changed.value = false;
    }

    if (playing.value) {
        audioToListen.value.pause();
        playing.value = false;
        return;
    }

    globalAudioPlaying.value = props.id;

    audioToListen.value = new Audio(`/api/get/${audio.value.slice(1).replaceAll("/", "MONKEYBRANCH")}`);
    audioToListen.value.volume = 0.1;

    audioToListen.value.play();
    playing.value = true;
    audioToListen.value.addEventListener("ended", () => {
        playing.value = false;
    });
}

watch(pronunciation, () => {
    changed.value = true;
    // disabled.value = true;

    // clearTimeout(loop.value);

    // loop.value = setTimeout(() => {
    //     regenerate();
    // }, 1000);
});

watch([text, pronunciation, audio, changed], () => {
    shortInfo.value.voiceover.find((i) => i.id == props.id).text = text;
    shortInfo.value.voiceover.find((i) => i.id == props.id).pronunciation = pronunciation;
    shortInfo.value.voiceover.find((i) => i.id == props.id).audio = audio;
    shortInfo.value.voiceover.find((i) => i.id == props.id).changed = changed;
});
</script>
