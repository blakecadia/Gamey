<template>
    <div class="credits-option">
        <div class="credits-header">
            <h3 class="credits-title">
                {{ name }}
            </h3>
            <p class="credits-desc">Purchase credits to generate more shorts</p>
        </div>
        <button class="credits-buy" @click="buyCredits">
            ${{ price.toFixed(2) }}
            <nuxt-img src="/icons/icon-cart-buy.svg" class="credits-buy-icon" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
.credits-option {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    width: 23rem;

    padding: 1rem 1.5rem 1.5rem;

    border-radius: 10px;

    background-color: rgba(white, 0.05);

    @media (max-width: 500px) {
        width: 100%;
    }
}

.credits-header {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.5rem;
}

.credits-title {
    margin: 0;

    font-size: 1.75rem;
    font-weight: 700;
}

.credits-desc {
    margin: 0;

    font-size: 0.85rem;
    font-weight: 400;
    color: rgba(white, 0.4);
}

.credits-price {
    margin: 0;

    font-size: 1.25rem;
    font-weight: 400;
}

.credits-buy {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    width: 8rem;

    margin-top: 2rem;
    padding: 0.5rem 0;

    border: 1px solid $pink;
    border-radius: 5px;

    font-size: 0.85rem;
    font-weight: 400;
    background-color: transparent;
    color: $pink;

    transition: 100ms ease-out background-color;

    &-icon {
        width: 0.85rem;

        filter: invert(33%) sepia(63%) saturate(1698%) hue-rotate(243deg) brightness(105%) contrast(103%);
        & path {
            stroke: white;
        }
    }

    &:hover {
        background-color: $pink;
        color: white;
        cursor: pointer;

        & .credits-buy-icon {
            filter: invert(100%);
        }
    }
}
</style>

<script setup>
const props = defineProps({
    name: String,
    lookupKey: String,
    price: Number,
});

async function buyCredits() {
    const res = await $fetch("/api/stripe/buy-credits", {
        method: "POST",
        body: {
            lookup_key: props.lookupKey,
            success_url: window.location.origin + "/dashboard",
            error_url: window.location.origin + "/dashboard",
        },
    });

    if (res.url) {
        await navigateTo(res.url, {
            external: true,
        });
    }
}
</script>
