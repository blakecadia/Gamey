<template>
    <div class="loading-container">
        <h3 class="loading-title">Generating Your Video</h3>
        <h3 class="loading-text">Your video is being generated and will be ready in a few minutes,<br />keep this tab open and come back in a bit.</h3>
        <div class="line-container">
            <div class="line" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 0.75rem;

    margin: 2rem auto 0;
}

.loading-title {
    margin: 0 auto;

    font-size: 1.75rem;
    font-weight: 700;
    text-align: center;
    color: rgba(white, 1);
}

.loading-text {
    margin: 0;
    // margin: 10rem auto 0 auto;

    font-size: 1rem;
    font-weight: 400;
    text-align: center;
    line-height: 160%;
    color: rgba(white, 0.5);

    // animation: flashing ease-in-out 3s infinite;
}

.line-container {
    position: relative;

    height: 2px;

    margin-top: 1rem;
}

.line {
    position: absolute;
    height: 100%;
    // width: 50%;

    background-color: $pink;

    animation: rewiding linear 5s infinite;
}

@keyframes rewiding {
    0% {
        left: 0;
        width: 0%;
    }

    50% {
        left: 0;
        width: 100%;
    }

    100% {
        left: 100%;
        width: 0%;
    }

    // 75% {
    //     left: 0;
    //     width: 100%;
    // }

    // 100% {
    //     left: 0;
    //     width: 0%;
    // }
}

@keyframes flashing {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>
