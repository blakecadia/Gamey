<template>
    <div class="description">Add a cool sound effect between gameplay clips</div>
    <div class="voice-list">
        <ShortCreatorTabSoundEffectTrack v-for="soundEffect in soundEffectOptions" :name="soundEffect" @select="selectedSoundEffect = soundEffect" :selected="selectedSoundEffect == soundEffect" />
        <ShortCreatorTabSoundEffectTrack @select="selectedSoundEffect = null" :selected="!selectedSoundEffect" />
    </div>
</template>

<style lang="scss" scoped>
.description {
    width: 80%;

    margin: 0 0 2rem;

    line-height: 160%;
    color: rgba(white, 0.6);

    @media (max-width: 500px) {
        width: 100%;
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
const user = useUserStore();
const shortInfo = useState("shortInfo", shortInfoSettings);
const selectedSoundEffect = ref("music", shortInfo.value.soundEffect);

const { data: soundEffectOptions } = useFetch("/api/get-sound-effects", {
    method: "GET",
});

watch(selectedSoundEffect, () => {
    shortInfo.value.soundEffect = selectedSoundEffect.value;
});
</script>
