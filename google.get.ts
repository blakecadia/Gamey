const runtimeConfig = useRuntimeConfig();

export default defineOAuthGoogleEventHandler({
    config: {
        redirectURL: runtimeConfig.OAUTH_GOOGLE_REDIRECT,
    },
    async onSuccess(event, { user, tokens }) {
        await setUserSession(event, {
            email: user.email,
            name: user.name,
        });
        return sendRedirect(event, "/dashboard");
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error("Google OAuth error:", error);
        return sendRedirect(event, "/dashboard");
    },
});
