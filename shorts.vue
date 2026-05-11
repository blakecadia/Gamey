<template>
    <div class="page-container">
        <div class="header">
            <div class="header-text">
                <p class="header-title">Your Shorts</p>
                <p class="header-subtitle">Download your old shorts</p>
            </div>
        </div>
        <div class="short-list">
            <ShortPreview v-for="short of [...user.shorts].reverse()" :_id="short._id" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: 100%;
    width: 100%;

    padding: 2rem 3rem;

    @media (max-width: 500px) {
        height: fit-content;

        padding: 1rem 2rem;
    }
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
}

.header-title {
    margin: 0 0 0.5rem;

    font-size: 2.5rem;
    font-weight: 700;
    color: white;
}

.header-subtitle {
    margin: 0;

    font-size: 1.5rem;
    color: rgba(white, 0.4);
}

.header-button {
    padding: 1rem 3rem;

    border-radius: 5px;

    background-color: $pink;

    &:hover {
        cursor: pointer;
    }
}

// HEADER END

.short-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 2rem;

    height: 100%;

    margin-top: 2rem;

    overflow-y: scroll;

    @media (max-width: 500px) {
        height: fit-content;
        overflow-y: auto;
    }
}
</style>

<script setup>
const user = useUserStore();

useHead({
    title: "Gamey - Shorts",
    meta: [{ name: "description", content: "#1 Growth Tool For Minecraft Servers" }],
});
</script>
