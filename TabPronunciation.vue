<template>
    <div class="description">The speech AI often makes mistakes when it comes to pronunciating Minecraft terminology, for example reading CrustyMC as CrustyMac, instead of CrustyEmSee, or /f being read as just f instead of slash f. On this page test out all the verses, and correct the pronunciation where necessary.</div>
    <p class="description">
        Audio plays left (refreshes on finish): <span :style="{ color: 'white' }">{{ user.data.audioRegenerations }}</span>
    </p>

    <div class="lines-container">
        <ShortCreatorTabPronunciationLine v-for="line of shortInfo.voiceover" :id="line.id" />
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

.lines-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1.75rem;

    height: 68%;
    width: 100%;

    padding-right: 0.75rem;

    overflow-y: scroll;

    & div {
        direction: ltr;
    }
}
</style>

<script setup>
const user = useUserStore();

const shortInfo = useState("shortInfo", shortInfoSettings);

const script = ref(shortInfo.value.script);
const gamemode = ref(shortInfo.value.gamemode);
const server = ref(shortInfo.value.server);

watch([gamemode, script, server], () => {
    shortInfo.value.gamemode = gamemode.value;
    shortInfo.value.script = script.value;
    shortInfo.value.server = server.value;
});
</script>
