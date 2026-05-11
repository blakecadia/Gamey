<template>
    <div class="pickers">
        <div class="picker-container">
            <p class="picker-text">Font color</p>
            <input class="picker-input" id="picker" type="color" v-model="color" />
        </div>
        <div class="picker-container">
            <p class="picker-text">Outline color</p>
            <input class="picker-input" id="picker" type="color" v-model="outlineColor" />
        </div>
    </div>
    <div class="font-list">
        <div v-for="font in fonts" :class="`font${selectedFont == font ? '-selected' : ''}`" :style="{ fontFamily: toFontName(font), color, '-webkit-text-stroke': `${outlineColor} 1px` }" @click="selectedFont = font">
            {{ toFontName(font) }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.pickers {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 2rem;

    margin-bottom: 0.5rem;
}

.picker-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;

    margin-bottom: 1rem;
}

.picker-text {
    margin: 0;
    color: rgba(white, 0.5);
}

.picker-input {
    height: 2rem;
    width: 2rem;

    margin: 0;
    padding: 0.25rem;

    border: none;
    border-radius: 5px;

    background-color: rgba(white, 0.05);

    overflow: hidden;
}

.font-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 1rem;

    height: 100%;
    width: 100%;

    overflow-y: scroll;

    @media (max-width: 500px) {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 1.5rem;
    }
}

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
</style>

<script setup>
const { data: fonts } = useFetch("/api/get-fonts");
const shortInfo = useState("shortInfo", shortInfoSettings);
const tab = useState("active-tab", () => "script");
const selectedFont = ref(shortInfo.value.font);
const color = ref("#ffffff");
const outlineColor = ref("#000000");

watch([selectedFont, color], () => {
    shortInfo.value.font = selectedFont.value;
    shortInfo.value.fontColor = color.value;
    shortInfo.value.outlineColor = outlineColor.value;
});

watch(
    tab,
    () => {
        selectedFont.value = shortInfo.value.font;
        color.value = shortInfo.value.fontColor;
        outlineColor.value = shortInfo.value.outlineColor;
    },
    {
        immediate: true,
    }
);

watch(fonts, async () => {
    if (fonts.value) {
        await Promise.all(
            fonts.value.map(async (fontPath) => {
                const fontName = toFontName(fontPath);
                const fontSource = "url(" + window.location.origin + `/fonts/` + fontPath + ")";
                const font = new FontFace(fontName, fontSource);
                await font.load();
                document.fonts.add(font);
            })
        );
    }
});

const toFontName = (s) => s.replaceAll(".ttf", "").replace(/^_*(.)|_+(.)/g, (s, c, d) => (c ? c.toUpperCase() : " " + d.toUpperCase()));
</script>
