<template>
    Users

    <AdminUser v-for="user of users?.users" :user="user" @refresh="refresh" />
</template>

<script setup>
const user = useUserStore();

const { data: users, refresh } = useFetch("/api/admin/get-users", {
    method: "POST",
});

onBeforeMount(() => {
    if (!user.data.admin) {
        navigateTo("/dashboard");
    }
});
</script>
