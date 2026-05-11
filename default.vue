<template>
    <div class="layout-container">
        <Navbar />
        <div class="layout-container-content">
            <slot />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.layout-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;

    height: 100%;
    width: 100%;

    @media (max-width: 500px) {
        flex-direction: column;
    }
}

.layout-container-content {
    height: 100%;
    width: 100%;
}
</style>
