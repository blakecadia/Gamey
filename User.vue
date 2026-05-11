<template>
    <div>{{ user.email }} - {{ user.plan }} plan - {{ user.credits.reduce((acc, cur) => acc + (cur.expires < Date.now() ? 0 : cur.amount), 0) }} credits<button :disabled="disableGiveTrial" @click="giveTrial()">Give trial</button></div>
</template>

<script setup>
const disableGiveTrial = computed(() => {
    return props.user.plan || fetching.value;
});
const fetching = ref(false);
const props = defineProps({
    user: Object,
});

const emit = defineEmits(["refresh"]);

async function giveTrial() {
    console.log("Giving trial");
    fetching.value = true;
    await $fetch("/api/admin/set-trial", {
        method: "POST",
        body: {
            targetId: props.user._id,
        },
    });

    emit("refresh");

    fetching.value = false;
}
</script>
