<template>
    <!-- {{ finishedShort }}
    {{ shortInfo.finished }}
    {{ user.shorts.map((i) => i.link) }} -->
    <ShortPreview v-if="finishedShort" :_id="finishedShort._id" />
</template>

<script setup>
const user = useUserStore();
const shortInfo = useState("shortInfo", shortInfoSettings);

user.fetchData(); // Refresh finished shorts

const finishedShort = computed(() => {
    return user.shorts.find((i) => i.link == shortInfo.value.finished);
});
</script>
