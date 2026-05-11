<template>
    <div class="tabs">
        <div :class="tab == 'script' ? 'tab-active' : 'tab'">
            <div class="tab-image-wrapper">
                <nuxt-img class="tab-image" src="/icons/tab-script.svg" />
            </div>
            <p class="tab-text">Script</p>
        </div>
        <div :class="tab == 'voice' ? 'tab-active' : 'tab'">
            <div class="tab-image-wrapper">
                <nuxt-img class="tab-image" src="/icons/tab-voice.svg" />
            </div>
            <p class="tab-text">Voice</p>
        </div>
        <div :class="tab == 'pronunciation' ? 'tab-active' : 'tab'">
            <div class="tab-image-wrapper">
                <nuxt-img class="tab-image" src="/icons/tab-pronunciation.svg" />
            </div>
            <p class="tab-text">Pronunciation</p>
        </div>
        <div :class="tab == 'sound' ? 'tab-active' : 'tab'">
            <div class="tab-image-wrapper">
                <nuxt-img class="tab-image" src="/icons/tab-sound-effect.svg" />
            </div>
            <p class="tab-text">Sound Effect</p>
        </div>
        <div :class="tab == 'clips' ? 'tab-active' : 'tab'">
            <div class="tab-image-wrapper">
                <nuxt-img class="tab-image" src="/icons/tab-clips.svg" />
            </div>
            <p class="tab-text">Clips</p>
        </div>
        <div :class="tab == 'font' ? 'tab-active' : 'tab'">
            <div class="tab-image-wrapper">
                <nuxt-img class="tab-image" src="/icons/tab-font.svg" />
            </div>
            <p class="tab-text">Font</p>
        </div>
        <div :class="tab == 'music' ? 'tab-active' : 'tab'">
            <div class="tab-image-wrapper">
                <nuxt-img class="tab-image" src="/icons/tab-music.svg" />
            </div>
            <p class="tab-text">Music</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tabs {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 2rem;

    height: 100%;

    padding: 3rem 2rem;

    background-color: $purple-mid;

    @media (max-width: 500px) {
        display: none;
    }
}

.tab {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;

    // &:hover {
    //     cursor: pointer;
    // }

    &-active {
        @extend .tab;

        .tab-text {
            opacity: 1;
        }

        .tab-image {
            background-color: rgba(white, 0.05);

            opacity: 1;
        }
    }
}

.tab-image-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 3.5rem;
    width: 3.5rem;

    padding: 1.2rem;

    border-radius: 1000px;

    background-color: rgba(white, 0.05);
}

.tab-image {
    height: 1.25rem;
    width: 1.25rem;

    opacity: 0.4;
}

.tab-text {
    margin: 0;

    font-size: 0.85rem;

    opacity: 0.5;
}
</style>

<script lang="ts" setup>
const emit = defineEmits(["setTab"]);
const tab = useState("active-tab", () => "script");

function setTab(text: string) {
    // emit("setTab", text);
}
</script>
