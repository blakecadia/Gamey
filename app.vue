<template>
    <NuxtLayout v-if="ready && user.data.credits">
        <NuxtPage />
    </NuxtLayout>
</template>

<script>
export default {
    head() {
        return {
            script: [
                {
                    src: "https://cdn.tolt.io/tolt.js",
                    async: true,
                    "data-tolt": "4bdc7509-32b9-46ab-87c7-ba8243ee8b29",
                },
            ],
        };
    },
};
</script>

<script setup>
const user = useUserStore();

const { loggedIn, session, fetch, clear, ready } = useUserSession();
const route = useRoute();

watch(
    ready,
    () => {
        checkStatus();
    },
    {
        immediate: true,
    }
);

checkStatus();

function checkStatus() {
    if (ready.value && !session.value.email)
        navigateTo("/auth/google", {
            external: true,
        });
}
</script>
