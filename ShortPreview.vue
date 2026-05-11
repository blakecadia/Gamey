<template>
    <div class="container">
        <div class="short-header">
            <img class="short-image" :src="`/api/get/${shortData.serverIcon.slice(1).replaceAll('/', 'MONKEYBRANCH')}`" />
            <div class="short-text">
                <p class="short-text-title">{{ shortData.serverName }}</p>
                <p class="short-text-expiry">{{ parseDate(shortData.expires) }}</p>
            </div>
            <div class="actions">
                <a class="short-download-wrapper" :href="`/api/get/${shortData.link.replaceAll('/', 'MONKEYBRANCH')}`" download>
                    <nuxt-img class="short-download" src="/icons/icon-download.svg" />
                </a>
                <div @click="deleteShort" class="short-download-wrapper">
                    <nuxt-img class="short-download" src="/icons/icon-trash.svg" />
                </div>
            </div>
        </div>
        <video class="short-video" :src="`/api/get/${shortData.link.replaceAll('/', 'MONKEYBRANCH')}`" controls></video>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1.5rem;

    width: fit-content;

    padding: 1rem;

    border-radius: 10px;

    background-color: rgba(white, 0.05);
}

.short-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;

    width: 100%;

    padding: 0.25rem 0.5rem;
}

.short-image {
    height: 3rem;
    width: 3rem;

    border-radius: 10px;
}

.short-text {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 0.25rem;

    width: 11rem;

    white-space: nowrap;

    color: rgba(white, 0.4);

    overflow: hidden;
}

.short-text-title {
    margin: 0;

    font-size: 1.5rem;
    font-weight: 700;
    color: white;
}

.short-text-expiry {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 0;
    padding: 0.25rem 0.5rem;

    border-radius: 5px;

    font-size: 0.75rem;
    background-color: rgba(white, 0.05);
    color: white;
}

.actions {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;

    height: 100%;

    margin-left: auto;
}

.short-download-wrapper {
    display: block;
}

.short-download {
    height: 1.25rem;

    opacity: 0.5;

    &:hover {
        opacity: 1;
        cursor: pointer;
    }
}

.short-video {
    width: 300px;

    border-radius: 10px;

    overflow: hidden;
}
</style>

<script setup>
const user = useUserStore();

const props = defineProps({
    _id: String,
});

const shortData = computed(() => {
    return user.shorts?.find((i) => i._id == props._id);
});

async function deleteShort() {
    await $fetch("/api/delete-short", {
        method: "POST",
        body: {
            _id: props._id,
        },
    });

    await user.fetchData();
}

function parseDate(time) {
    const timeTill = time - Date.now();

    const days = Math.floor(timeTill / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeTill % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    return `${days}d ${hours}h`;
}
</script>
