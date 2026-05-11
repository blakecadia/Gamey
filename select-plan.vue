<template>
    <div class="page-container">
        <div class="header">
            <div class="header-text">
                <p class="header-title">Select your plan</p>
                <p class="header-subtitle">Getting started</p>
            </div>
        </div>

        <div class="plans">
            <div class="plan">
                <p class="plan-header">BASIC</p>
                <p class="plan-text">Perfect for new or established servers ready to scale. Grow a consistent player base with daily uploads, and upgrade at anytime.</p>
                <div class="plan-pricing">
                    <p class="plan-pricing-amount">$279.99</p>
                    <p class="plan-pricing-duration">/month</p>
                </div>
                <div class="plan-cta" @click="selectPlan('plan_basic')">Grow Today</div>

                <div class="plan-divider" />

                <div class="plan-benefits">
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">30 Videos Credits / Monthly</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">Automatically Post Once a Day (TikTok/Youtube)</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">All Background Gameplay, Music & Sounds</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">All Standard Voices</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">Special Offers & Freebies</p>
                    </div>
                </div>
            </div>
            <div class="plan plan-main">
                <p class="plan-header">PREMIUM - (POPULAR)</p>
                <p class="plan-text">Catered towards large networks looking to dominate the scene. Reach hundreds of thousands of potential players daily.</p>
                <div class="plan-pricing">
                    <p class="plan-pricing-amount">$489.99</p>
                    <p class="plan-pricing-duration">/month</p>
                </div>
                <div class="plan-cta plan-cta-main" @click="selectPlan('plan_premium')">Grow Today</div>

                <div class="plan-divider" />

                <div class="plan-benefits">
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">60 Videos Credits / Monthly</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">Automatically Post Once a Day (TikTok/Youtube)</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">Discord & Livechat Support</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">All Premium Voices</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">Enterprise Voice Quality</p>
                    </div>
                </div>
            </div>
            <div class="plan">
                <p class="plan-header">ENTERPRISE - (CONTACT US)</p>
                <p class="plan-text">Looking for something more exclusive? Reach out for a bulk or specialized order.</p>
                <div class="plan-pricing">
                    <p class="plan-pricing-amount">$???</p>
                    <p class="plan-pricing-duration">/month</p>
                </div>
                <a class="plan-cta" href="https://discord.gg/gamey" target="_blank">Contact Us</a>

                <div class="plan-divider" />

                <div class="plan-benefits">
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">∞ Videos Credits / Monthly</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">Automatically 3+ Times a Day (TikTok/Youtube/IG Reels)</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">24/7 Support</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">Early Access to Beta Features & Footage</p>
                    </div>
                    <div class="plan-benefit">
                        <img src="/icons/checkmark.svg" class="plan-benefit-checkmark" />
                        <p class="plan-benefit-text">Dedicated Account Manager</p>
                    </div>
                </div>
            </div>
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

    @media (max-width: 500px) {
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 2rem;
    }
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

    font-weight: 700;
    background-color: $pink;

    &:hover {
        cursor: pointer;

        background-color: color.adjust($pink, $lightness: 3%);
    }
}

// =====
// PLAN STYLES
// =====

.plans {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    gap: 1rem;

    margin: 3rem 0 0;
}

.plan {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1.5rem;

    width: 22rem;

    padding: 2rem 1.5rem;

    border-radius: 10px;
    border: 1px solid rgba(white, 0.1);

    background-color: rgba(white, 0.03);

    &-main {
        background: radial-gradient(90% 115.99999999999999% at 50% 0%, rgba(168, 113, 255, 0.4) 0%, #0e051b 100%);
    }
}

.plan-header {
    margin: 0 0 0;

    font-size: 0.75rem;
    font-weight: 600;
    color: white;
}

.plan-text {
    margin: 0;

    font-weight: 600;
    font-size: 0.85rem;
    line-height: 160%;
    color: rgba(white, 0.5);
}

.plan-pricing {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 0.5rem;
}

.plan-pricing-amount {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
}

.plan-pricing-duration {
    margin: 0 0 0.25rem;

    font-size: 1rem;
    font-weight: 500;
    color: rgba(white, 0.5);
}

.plan-cta {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 3rem;
    width: 100%;

    margin: 0;

    border: 1px solid rgba(white, 0.2);
    border-radius: 10px;

    font-size: 1.1rem;
    font-weight: 600;
    background-color: rgba($pink, 0.1);
    color: white;

    &:hover {
        cursor: pointer;
    }

    &-main {
        background-color: $pink;
    }
}

.plan-divider {
    height: 2px;
    width: 100%;

    background-color: rgba(white, 0.1);
}

.plan-benefits {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;
}

.plan-benefit {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
}

.plan-benefit-checkmark {
    display: block;

    height: 0.75rem;
}

.plan-benefit-text {
    display: block;

    margin: 0;

    font-size: 1rem;
    font-weight: 500;
    color: white;
}
</style>

<script setup>
useHead({
    title: "Gamey - Select Plan",
    meta: [{ name: "description", content: "#1 Growth Tool For Minecraft Servers" }],
});

async function selectPlan(lookupKey) {
    const res = await $fetch("/api/stripe/select-plan", {
        method: "POST",
        body: {
            lookup_key: lookupKey,
            success_url: window.location.origin + "/dashboard",
            error_url: window.location.origin + "/dashboard",
            referral: window.tolt_referral,
        },
    });

    if (res.url) {
        await navigateTo(res.url, {
            external: true,
        });
    }
}
</script>
