<template>
    <div class="tab-script-container">
        <div class="server-inputs">
            <div class="input-container">
                <p class="input-title">Autofill Information</p>
                <select class="input-input" placeholder="1.8.9" type="text" v-model="autofillData">
                    <option></option>
                    <option v-for="short of getServers()" :value="short.serverName">{{ short.serverName }}</option>
                </select>
            </div>
            <div class="input-container">
                <p class="input-title">Server Name</p>
                <input class="input-input" placeholder="Hypixel" type="text" v-model="serverName" />
            </div>
            <div class="input-container">
                <p class="input-title">Server IP</p>
                <input class="input-input" placeholder="play.hypixel.net" type="text" v-model="serverIp" />
            </div>

            <div class="input-container">
                <p class="input-title">Server Port</p>
                <input class="input-input" placeholder="25565" type="number" v-model="serverPort" />
            </div>

            <div class="input-container">
                <p class="input-title">Server Version</p>
                <input class="input-input" placeholder="1.8.9" type="text" v-model="serverVersion" />
            </div>

            <div class="input-container">
                <p class="input-title">Server Icon</p>
                <div class="server-icon-container">
                    <img v-if="serverIcon" class="server-icon" :src="`/api/get/${serverIcon.slice(1).replaceAll('/', 'MONKEYBRANCH')}`" />
                    <div v-else class="server-icon" :src="serverIcon" />
                    <label for="file" class="server-icon-button">Upload</label>
                    <input class="server-icon-input" id="file" type="file" @input="handleFileInput" accept="image/png, image/jpg, image/jpeg" />
                    <p class="server-icon-text">128px*128px recommended</p>
                </div>
            </div>

            <div class="input-container">
                <p class="input-title">Gamemode</p>
                <select class="input-input" placeholder="1.8.9" type="text" v-model="gamemode">
                    <option value="skyblock">Skyblock</option>
                    <option value="prison">Prison</option>
                    <option value="factions">Factions</option>
                    <option value="lifesteal">Lifesteal</option>
                    <option value="gens">Gens</option>
                    <option value="pixelmon">Pixelmon</option>
                    <option value="smp">SMP</option>
                </select>
            </div>
        </div>

        <div class="script-container">
            <div class="input-container">
                <p class="input-title">Insert Hook</p>
                <div class="input-content">
                    <input
                        class="input-input"
                        v-model="prompt"
                        placeholder="Have you been looking for a skyblock server? 
"
                        :disabled="actualDisabledScript"
                        @keydown="onPromptKeyDown"
                    />
                    <button class="input-button" @click="generateScript" :disabled="actualDisabledScript">Generate</button>
                </div>
            </div>

            <div class="input-container">
                <div class="input-title-group">
                    <p class="input-title">Script</p>
                    <p class="input-title-desc">{{ script.length }}/{{ maxCharacterCount }} Characters</p>
                    <p class="input-title-desc">{{ script.split("\n").length }}/{{ maxLineCount }} Lines</p>
                </div>
                <div class="input-content">
                    <textarea class="input-textarea" v-model="script" :placeholder="scriptPlaceholder" :disabled="actualDisabledScript" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tab-script-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: 3rem;

    width: 100%;

    @media (max-width: 500px) {
        flex-direction: column;
    }
}

.server-inputs {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1.5rem;

    width: 30%;

    @media (max-width: 500px) {
        width: 100%;
    }
}

.script-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1.5rem;

    width: 70%;

    @media (max-width: 500px) {
        width: 100%;
    }
}

.input-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 0.5rem;

    width: 100%;
}

.input-title-group {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 2rem;
}

.input-title {
    margin: 0;

    font-size: 1rem;
    font-weight: 400;
    color: rgba(white, 0.4);
}

.input-title-desc {
    @extend .input-title;

    font-size: 0.75rem;
}

.input-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: 1rem;

    width: 100%;
}

.input-input {
    width: 100%;

    border: none;
    border-radius: 5px;

    padding: 0.5rem 1rem;

    font-family: inherit;
    font-size: 1rem;
    background-color: rgba(white, 0.05);
    color: white;

    &:focus {
        outline: none;
    }

    &::placeholder {
        color: rgba(white, 0.4);
    }

    & option {
        color: black;
    }

    &:disabled {
        opacity: 0.25;
    }
}

.input-button {
    white-space: nowrap;

    padding: 0.1rem 2rem;

    border: none;
    border-radius: 5px;

    font-weight: 400;
    background-color: rgba(white, 0.05);
    color: white;

    &:disabled {
        opacity: 0.25;

        &:hover {
            cursor: default;
        }
    }

    &:hover {
        cursor: pointer;
    }
}

.server-icon-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
}

.server-icon {
    height: 2.5rem;
    width: 2.5rem;

    border-radius: 10px;

    background-color: rgba(white, 0.05);
}

.server-icon-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    height: 2.5rem;

    padding: 0 2rem;

    border-radius: 10px;

    background-color: rgba(white, 0.05);

    &:hover {
        background-color: rgba(white, 0.07);
        cursor: pointer;
    }
}

.server-icon-input {
    display: none;
}

.server-icon-text {
    margin: 0;

    font-size: 0.75rem;
    font-style: italic;
    color: rgba(white, 0.2);
}

.input-textarea {
    @extend .input-input;

    height: 100%;

    line-height: 160%;
}

.input-container:has(.input-textarea) {
    height: 100%;

    & .input-content {
        height: 100%;
    }
}
</style>

<script lang="ts" setup>
const user = useUserStore();

const actualDisabledScript = computed(() => {
    return disabledScript.value || !serverName.value || !serverIcon.value || !serverIp.value || !serverPort.value || !serverVersion.value;
});
const disabledScript = ref(false);

const scriptPlaceholder = "Are you ready to soar with flying fish in Minecraft?\nDive into the Skyblock gamemode on Hypixel!\nExperience a world where floating islands are your home.\nWatch as unique flying fish zip through the skies.\nCollect rare resources from these colorful creatures!\nCreate your own sky empire with friends or solo.\nCompete in mini-games to unlock awesome rewards.\nJoin a community of players who share your passion.\nDiscover endless adventures and sky-high surprises!\nJoin now at play.hypixel.net and start your journey!";

const shortInfo = useState("shortInfo", shortInfoSettings);
const { handleFileInput, files } = useFileStorage();

async function generateScript() {
    disabledScript.value = true;

    script.value = "";

    const res = await $fetch("/api/prompt-script", {
        method: "POST",
        body: {
            prompt: prompt.value,
            gamemode: gamemode.value,
            serverName: serverName.value,
            serverIp: serverIp.value,
            serverPort: serverPort.value,
        },
    });

    script.value = res || "";
    disabledScript.value = false;
    prompt.value = "";
}

const script = ref(shortInfo.value.script);
const prompt = ref("");
const gamemode = ref<string>(shortInfo.value.gamemode);

const serverName = ref(shortInfo.value.serverName);
const serverIcon = ref(shortInfo.value.serverIcon);
const serverIp = ref(shortInfo.value.serverIp);
const serverPort = ref(shortInfo.value.serverPort);
const serverVersion = ref(shortInfo.value.serverVersion);

const autofillData = ref("");

watch(files.value, async () => {
    if (files.value.length == 0) return;
    const path = await $fetch("/api/upload-icon", {
        method: "POST",
        body: {
            files: files.value,
        },
    });

    serverIcon.value = `/server-icons/${path}`;
});

watch([gamemode, script], () => {
    shortInfo.value.gamemode = gamemode.value;
    shortInfo.value.script = script.value;
});

watch([serverName, serverIp, serverPort, serverVersion, serverIcon], () => {
    shortInfo.value.serverName = serverName.value;
    shortInfo.value.serverIp = serverIp.value;
    shortInfo.value.serverPort = serverPort.value;
    shortInfo.value.serverVersion = serverVersion.value;
    shortInfo.value.serverIcon = serverIcon.value;
});

const lineCount = computed(() => {
    return script.value.split("\n").length;
});

const maxCharacterCount = 500;
const maxLineCount = 15;

watch(script, (newValue, oldValue) => {
    // console.log(newValue, "\n", oldValue, "\n", constraintsMet());
    if (!constraintsMet()) script.value = oldValue;
});

function constraintsMet() {
    // Ensure the character count is less than 200
    if (script.value.length > maxCharacterCount) {
        // script.value = script.value.substring(0, maxCharacterCount);
        // script.value = script.value.substring(0, maxCharacterCount);
        return false;
    }

    // Ensure the line count is less than 10
    if (lineCount.value > maxLineCount) {
        // const lines = script.value.split("\n");
        // script.value = lines.slice(0, maxLineCount).join("\n");
        return false;
    }

    return true;
}

watch(autofillData, () => {
    if (!autofillData.value) return;

    const data: Short = user.shorts.find((i: any) => i.serverName == autofillData.value) as Short;

    serverName.value = data.serverName;
    serverIp.value = data.serverIp;
    serverPort.value = data.serverPort;
    serverVersion.value = data.serverVersion;
    serverIcon.value = data.serverIcon;

    autofillData.value = "";
});

function getServers() {
    const servers: any = [];

    for (var short of user.shorts) {
        if (servers.find((i: any) => i.serverName == short.serverName)) {
            continue;
        }

        servers.push(short);
    }

    return servers;
}

function onPromptKeyDown(e: KeyboardEvent) {
    if (e.key == "Enter") generateScript();
}
</script>
