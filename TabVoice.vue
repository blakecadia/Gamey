<template>
    <div class="tab-voice-container">
        <div class="voice-group">
            <div class="voice-header">Basic Voices</div>
            <div class="voice-list">
                <ShortCreatorTabVoiceOption v-for="voice in basicVoices" :selected="selectedVoice == voice.id" @select="selectVoice(voice)" :voiceName="voice.name" :voiceDescription="voice.description" />
            </div>
        </div>

        <div class="voice-group">
            <div class="voice-header">Premium Voices</div>
            <div class="voice-list">
                <ShortCreatorTabVoiceOption v-for="voice in premiumVoices" :locked="user.data.plan != 'premium' && user.data.plan != 'trial'" :selected="selectedVoice == voice.id" @select="user.data.plan == 'premium' || user.data.plan == 'trial' ? (selectedVoice = voice.id) : ''" :voiceName="voice.name" :voiceDescription="voice.description" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tab-voice-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2rem;

    height: 77%;
    width: 100%;

    padding-right: 0.75rem;

    overflow-y: scroll;
}

.voice-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;

    width: 100%;
}

.voice {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 5rem;
    width: 100%;

    margin: 0 auto;

    border-radius: 10px;

    font-size: 1.25rem;
    font-weight: 400;
    background-color: rgba(white, 0.05);
    color: rgba(white, 0.4);

    &:hover {
        cursor: pointer;
    }

    &-selected {
        @extend .voice;

        background-color: rgba($pink, 0.4);
        color: rgba(white, 1);
    }

    &-locked {
        @extend .voice;

        opacity: 0.2;

        &:hover {
            cursor: default;
        }
    }
}

.voice-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 1rem;

    width: 100%;

    @media (max-width: 500px) {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }
}

.voice-header {
    margin: 0;

    color: rgba(white, 0.4);
}
</style>

<script setup>
const user = useUserStore();

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

const shortInfo = useState("shortInfo", shortInfoSettings);
const selectedVoice = ref(shortInfo.value.voice);

watch(selectedVoice, () => {
    shortInfo.value.voice = selectedVoice.value;
});

function selectVoice(voice) {
    selectedVoice.value = voice.id;
}
</script>
