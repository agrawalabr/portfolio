import { gapi } from "gapi-script";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const API_KEY = "YOUR_GOOGLE_API_KEY";
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

// Initialize Google API Client
export const initGmailAPI = () => {
    return new Promise((resolve, reject) => {
        gapi.load("client:auth2", () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
                scope: SCOPES,
            }).then(() => {
                resolve();
            }).catch(reject);
        });
    });
};

// Sign in user
export const signInWithGoogle = async () => {
    try {
        await gapi.auth2.getAuthInstance().signIn();
        return gapi.auth2.getAuthInstance().isSignedIn.get();
    } catch (error) {
        console.error("Google Sign-in failed", error);
        return false;
    }
};

// Sign out user
export const signOutGoogle = () => {
    gapi.auth2.getAuthInstance().signOut();
};

// Send email function
export const sendEmail = async (recipient, subject, message) => {
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
        alert("Please sign in first.");
        return;
    }

    const emailContent = [
        `From: me`,
        `To: ${recipient}`,
        `Subject: ${subject}`,
        ``,
        message
    ].join("\n");

    const encodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    try {
        await gapi.client.gmail.users.messages.send({
            userId: "me",
            resource: { raw: encodedEmail },
        });
        alert("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};