<template>
    <div>
        <div class="clips-label" :style="{ color: getColor(special) }" v-if="special || shortInfo.voiceover.findIndex((i) => id == i.id) == 1">
            {{ toTitleCase(special || "gameplay") }}
        </div>

        <div :class="selectedLine == id ? 'clip-line-container-selected' : 'clip-line-container'">
            <div class="clip-video">
                <img v-if="line.clip" :src="`/api/get/` + line.clip.slice(1).replaceAll('.mp4', '.jpg').replaceAll('.mov', '.jpg').replaceAll('clips', 'clips-preview').replaceAll('server-icons', 'clips-preview/uploads').replaceAll('/', 'MONKEYBRANCH')" />
            </div>
            <div class="line-text">{{ line.text }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.clips-label {
    margin-bottom: 0.5rem;

    font-size: 0.85rem;
    font-weight: 400;
}

.clip-line-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;

    border-radius: 10px;

    padding: 0.75rem;
    background-color: rgba(white, 0.05);

    &:hover {
        cursor: pointer;
        background-color: rgba(white, 0.1);
    }

    &-selected {
        @extend .clip-line-container;
        background-color: rgba(white, 0.1);

        & .line-text {
            color: rgba(white, 1);
        }
    }
}

.line-text {
    font-size: 0.85rem;
    color: rgba(white, 0.4);
}

.clip-video {
    height: 3rem;
    width: 2rem;

    border-radius: 5px;

    background-color: rgba(white, 0.05);

    overflow: hidden;

    & img {
        height: 100%;
        width: 100%;
    }

    & video {
        height: 100%;
        width: 100%;
    }
}
</style>

<script setup>
const user = useUserStore();

const props = defineProps({
    id: Number,
});

const shortInfo = useState("shortInfo", shortInfoSettings);
const selectedLine = useState("selected-line", () => shortInfo.value.voiceover[0].id);
const selectedClip = useState("selected-clip");

const line = computed(() => {
    return shortInfo.value.voiceover.find((i) => i.id == props.id);
});

const special = computed(() => {
    if (shortInfo.value.voiceover.findIndex((i) => i.id == props.id) == 0) return "intro";
    if (shortInfo.value.voiceover.findIndex((i) => i.id == props.id) == shortInfo.value.voiceover.length - 1) return "outro";
});

watch([selectedClip], () => {
    if (selectedLine.value == props.id) {
        shortInfo.value.voiceover.find((i) => i.id == props.id).clip = selectedClip.value;
    }
});

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

function getColor(special) {
    switch (special) {
        case "intro":
            return "#00ff1e";
        case "outro":
            return "#FFCC00";
        default:
            return "#00AAFF";
    }
}
</script>
