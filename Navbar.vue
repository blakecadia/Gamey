<template>
    <div :class="`navbar-panel`">
        <nuxt-link to="/dashboard">
            <img class="navbar-panel-logo" src="/logo.png" />
        </nuxt-link>
        <img class="navbar-panel-hamburger" src="/icons/hamburger.svg" @click="navbarOpen = true" />
    </div>
    <div :class="`navbar-container navbar-mobile-${navbarOpen ? 'open' : 'closed'}`">
        <nuxt-link @click="navbarOpen = false" to="/dashboard">
            <img class="navbar-logo" src="/logo.png" />
        </nuxt-link>
        <div class="navbar-links">
            <nuxt-link @click="navbarOpen = false" to="/dashboard" :class="`navbar-link${route.path == '/dashboard' ? '-active' : ''}`">
                <nuxt-img class="navbar-link-icon" src="/icons/navbar-overview.svg" />
                <p class="navbar-link-text">Overview</p>
            </nuxt-link>
            <nuxt-link @click="navbarOpen = false" to="/short-creator" :class="`navbar-link${route.path == '/short-creator' ? '-active' : ''}`">
                <nuxt-img class="navbar-link-icon" src="/icons/navbar-short.svg" />
                <p class="navbar-link-text">Shorts Creator</p>
            </nuxt-link>
            <nuxt-link @click="navbarOpen = false" to="/shorts" :class="`navbar-link${route.path == '/shorts' ? '-active' : ''}`">
                <nuxt-img class="navbar-link-icon" src="/icons/navbar-shorts.svg" />
                <p class="navbar-link-text">Videos</p>
            </nuxt-link>
            <nuxt-link @click="navbarOpen = false" to="/credits" :class="`navbar-link${route.path == '/credits' ? '-active' : ''}`">
                <nuxt-img class="navbar-link-icon" src="/icons/navbar-credits.svg" />
                <p class="navbar-link-text">Credits</p>
            </nuxt-link>
            <nuxt-link @click="navbarOpen = false" :to="user?.data?.plan && user?.data?.plan != 'trial' ? '/plan' : '/select-plan'" :class="`navbar-link${route.path == '/plan' ? '-active' : ''}`">
                <nuxt-img class="navbar-link-icon" src="/icons/navbar-plan.svg" />
                <p class="navbar-link-text">Your Plan</p>
            </nuxt-link>
            <nuxt-link @click="navbarOpen = false" to="https://discord.gg/gamey" target="_blank" :class="`navbar-link${route.path == 'NOTHING' ? '-active' : ''}`">
                <nuxt-img class="navbar-link-icon" src="/icons/navbar-discord.svg" />
                <p class="navbar-link-text">Discord</p>
            </nuxt-link>
            <nuxt-link @click="navbarOpen = false" to="https://gamey.ai/affiliates" target="_blank" :class="`navbar-link${route.path == '/affiliate' ? '-active' : ''}`">
                <nuxt-img class="navbar-link-icon" src="/icons/navbar-affiliate.svg" />
                <p class="navbar-link-text">Affiliate</p>
            </nuxt-link>
        </div>
        <div class="navbar-user">
            <div class="navbar-subscribe" v-if="!user?.data?.plan">
                <p class="navbar-subscribe-text">Choose a plan to get access</p>
                <nuxt-link class="navbar-subscribe-button" to="/select-plan">Subscribe</nuxt-link>
            </div>
            <div class="navbar-user-header">
                <p class="navbar-user-name">{{ user.data.name }}</p>
                <nuxt-img @click="logout()" class="navbar-user-logout" src="/icons/navbar-logout.svg" />
            </div>
            <div class="navbar-user-subtitle">
                <p class="navbar-user-plan">
                    {{ toTitleCase(user.data.plan || "Free") }}
                </p>
                <nuxt-img class="navbar-user-divider" src="/icons/navbar-divider.svg" />
                <p class="navbar-user-plan">
                    {{ user.getCredits() }}
                    Credit{{ user.getCredits() != 1 ? "s" : "" }}
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.navbar-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    height: 100%;
    width: 18rem;

    padding: 2rem;

    background-color: $purple-dark;
}

.navbar-mobile {
    @media (max-width: 500px) {
        &-open {
            position: fixed;
            top: 0;
            left: 0;

            height: 100vh;
            width: 100vw;

            padding: 2rem;

            z-index: 10;
        }

        &-closed {
            display: none;
        }
    }
}

.navbar-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    padding: 2rem;

    &-logo {
        height: 2.5rem;
    }

    &-hamburger {
        height: 2rem;
    }

    @media (min-width: 450px) {
        display: none;
    }
}

.navbar-logo {
    height: 2.5rem;
}

.navbar-links {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.25rem;

    margin-top: 2rem;
}

.navbar-link {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;

    padding: 0.75rem 0;

    transition: 200ms ease-out opacity;
    opacity: 0.4;

    @media (max-width: 500px) {
        gap: 1rem;
    }

    &:hover {
        opacity: 1;
        cursor: pointer;
    }

    &-active {
        @extend .navbar-link;
        opacity: 1;
    }
}

.navbar-link-icon {
    width: 1.5rem;

    @media (max-width: 500px) {
        width: 2rem;
    }
}

.navbar-link-text {
    margin: 0;

    font-size: 1rem;
    font-weight: 500;

    @media (max-width: 500px) {
        font-size: 1.25rem;
    }
}

// User

.navbar-user {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    width: 100%;
    margin-top: auto;
}

.navbar-subscribe {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 1.25rem;

    margin: 0 auto 2rem;
    padding: 1rem 0;

    border-radius: 10px;

    width: 100%;

    background-color: $pink;

    box-shadow: rgba($pink, 0.4) 0 0 20px;
}

.navbar-subscribe-text {
    width: 100%;

    margin: 0;

    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    background-color: $pink;
    color: white;
}

.navbar-subscribe-button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 80%;

    padding: 0.3rem 0;

    border: none;
    border-radius: 1000px;

    font-size: 0.75rem;
    font-weight: 700;
    background-color: white;
    color: $pink;

    &:hover {
        cursor: pointer;

        background-color: color.adjust(white, $lightness: -4%);
    }
}

.navbar-user-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    margin-bottom: 0.5rem;
}

.navbar-user-name {
    margin: 0;

    font-size: 1.25rem;
    font-weight: 700;
    color: white;
}

.navbar-user-logout {
    height: 1.25rem;

    opacity: 0.4;

    transition: 100ms ease-out opacity;

    &:hover {
        opacity: 1;
        cursor: pointer;
    }
}

.navbar-user-subtitle {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5rem;
}

.navbar-user-plan,
.navbar-user-divider,
.navbar-user-plan {
    margin: 0;

    opacity: 0.4;
}
</style>

<script lang="ts" setup>
const user = useUserStore();

const route = useRoute();
const { clear } = useUserSession();

const navbarOpen = ref(false);

async function logout() {
    await clear();
    window.location.href = window.location.href + " ";
}

function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

watch(route, () => {
    navbarOpen.value = false;
});
</script>
