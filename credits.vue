<template>
    <div class="page-container">
        <div class="header">
            <div class="header-text">
                <p class="header-title">Purchase Credits</p>
                <p class="header-subtitle">Required to generate shorts</p>
            </div>
            <div class="header-button">{{ user.getCredits() }} Credits Left</div>
        </div>

        <div class="options-list">
            <CreditsOption v-for="price of prices?.filter((i) => i.lookup_key.startsWith('credits_'))?.sort((a, b) => a.price - b.price)" :price="price.price / 100" :lookupKey="price.lookup_key" :name="price.name" :key="price.lookupKey" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-container {
    height: 100%;
    width: 100%;

    padding: 2rem 3rem;

    @media (max-width: 500px) {
        padding: 1rem 2rem;
    }
}

.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    @media (max-width: 500px) {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 2rem;
    }
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

    font-weight: 700;
    background-color: $pink;
}

.options-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;

    margin-top: 3rem;

    @media (max-width: 500px) {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>

<script setup>
const user = useUserStore();

useHead({
    title: "Gamey | Credits",
    meta: [{ name: "description", content: "#1 Growth Tool For Minecraft Servers" }],
});

const { data: prices } = await useFetch("/api/stripe/get-prices", {
    method: "GET",
});
</script>
