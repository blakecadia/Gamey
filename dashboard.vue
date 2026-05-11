<template>
    <div class="page-container">
        <div class="header">
            <div class="header-text">
                <p class="header-title">Welcome Back</p>
                <p class="header-subtitle">Pick up where you left off</p>
            </div>
        </div>

        <div class="page-content">
            <div class="category-wrapper">
                <p class="category-text">Quick actions</p>
                <div class="actions">
                    <nuxt-link to="/short-creator" class="action">
                        <div class="action-text">
                            <p class="action-title">Create Youtube Short</p>
                            <p class="action-subtitle">Generate content for your server in seconds using our custom editor</p>
                        </div>
                        <nuxt-img class="action-icon" src="/icons/action-short.svg" />
                    </nuxt-link>
                    <nuxt-link to="/credits" class="action">
                        <div class="action-text">
                            <p class="action-title">Purchase Credits</p>
                            <p class="action-subtitle">Stock up on credits so you can use our custom creditor</p>
                        </div>
                        <nuxt-img class="action-icon" src="/icons/action-credits.svg" />
                    </nuxt-link>
                    <nuxt-link to="/plan" class="action">
                        <div class="action-text">
                            <p class="action-title">Manage Your Plan</p>
                            <p class="action-subtitle">Manage your billing and your current selected plan for GameyAI</p>
                        </div>
                        <nuxt-img class="action-icon" src="/icons/action-plan.svg" />
                    </nuxt-link>
                </div>
            </div>
            <!-- <div class="category-wrapper shorts-wrapper">
                <p class="category-text">Your most recent shorts</p>
                <div class="shorts-list">
                    <ShortPreview v-if="user.shorts.length > 0" :_id="user.shorts[0]._id" />
                    <div class="shorts-nothing" v-else>No shorts generated yet</div>
                    <ShortPreview v-if="user.shorts.length > 1" :_id="user.shorts[1]._id" />
                    <ShortPreview v-if="user.shorts.length > 2" :_id="user.shorts[2]._id" />
                    <ShortPreview v-if="user.shorts.length > 3" :_id="user.shorts[3]._id" />
                </div>
            </div> -->
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

// NOT HEADER

.page-content {
    display: grid;
    grid-template-columns: min-content minmax(0, 1fr);
    gap: 2rem;

    width: 100%;

    margin-top: 2rem;

    @media (max-width: 500px) {
        grid-template-columns: minmax(0, 1fr);

        width: 100%;

        margin-top: 2rem;
    }
}

.category-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;
}

.category-text {
    height: 1.5rem;

    margin: 0;

    color: rgba(white, 0.5);
}

// ACTIONS

.actions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2rem;

    @media (max-width: 500px) {
        width: 100%;
    }
}

.action {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;

    width: fit-content;

    padding: 1.5rem 2rem;

    border-radius: 10px;

    background-color: rgba(white, 0.05);
    transition: 100ms ease-out background-color;

    @media (max-width: 500px) {
        width: 100%;

        padding: 1rem 1.5rem;
    }

    &:hover {
        cursor: pointer;

        background-color: rgba(white, 0.1);
    }
}

.action-text {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.25rem;

    width: 18rem;

    @media (max-width: 500px) {
        width: 70%;
    }
}

.action-title {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 700;
    color: white;

    @media (max-width: 500px) {
        font-size: 1rem;
    }
}

.action-subtitle {
    margin: 0;

    font-size: 0.75rem;
    color: rgba(white, 0.4);
}

.action-icon {
    width: 5rem;

    @media (max-width: 500px) {
        width: 3rem;
    }
}

// SHORTS

.shorts-wrapper {
    @media (max-width: 500px) {
        display: none;
    }
}

.shorts-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2rem;
}

.shorts-list {
    width: 100%;

    overflow-x: scroll;
}

.shorts-nothing {
    color: rgba(white, 0.2);
}
</style>

<script setup>
useHead({
    title: "Gamey | #1 Growth Tool For Minecraft Servers",
    meta: [{ name: "description", content: "#1 Growth Tool For Minecraft Servers" }],
});
</script>
