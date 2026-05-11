<template>
    <div class="voice-list">
        <!-- <div v-for="music in musicOptions" :class="`font${selectedMusic == music ? '-selected' : ''}`" @click="selectMusic(music)">
            {{ formatMusicName(music) }}
        </div> -->
        <ShortCreatorTabMusicTrack v-for="music in musicOptions" :name="music" @select="selectedMusic = music" :selected="selectedMusic == music" />
        <ShortCreatorTabMusicTrack @select="selectedMusic = null" :selected="!selectedMusic" />
    </div>
</template>

<style lang="scss" scoped>
.font {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 5rem;
    width: 100%;

    margin: 0 auto;

    border-radius: 10px;

    font-size: 1.5rem;
    font-weight: 400;
    background-color: rgba(white, 0.05);
    color: rgba(white, 0.4);

    &:hover {
        cursor: pointer;
    }

    &-selected {
        @extend .font;

        background-color: rgba($pink, 0.4);
        color: rgba(white, 1);
    }
}

.voice-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    gap: 1rem;

    width: 100%;

    @media (max-width: 500px) {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 1.5rem;
    }
}
</style>

<script setup>
const shortInfo = useState("shortInfo", shortInfoSettings);
const selectedMusic = ref("music", shortInfo.value.music);
// const playing = ref();
const { data: musicOptions } = useFetch("/api/get-music", {
    method: "GET",
});

const tab = useState("active-tab", () => "script");

watch(
    tab,
    () => {
        selectedMusic.value = shortInfo.value.music;
    },
    {
        immediate: true,
    }
);

watch(selectedMusic, () => {
    shortInfo.value.music = selectedMusic.value;
});
</script>
