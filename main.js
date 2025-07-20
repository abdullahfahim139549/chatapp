// main.js

// 1. Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    GoogleAuthProvider, 
    signInWithPopup 
} from "firebase/auth";

// 2. Your Firebase Configuration
// IMPORTANT: Replace these with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvtf5C-BvAm4YAxTwPz_bv99wNJEW25qg", // Replace with your actual apiKey
    authDomain: "chatapp-cef00.firebaseapp.com", // Replace with your actual authDomain
    projectId: "chatapp-cef00", // Replace with your actual projectId
    storageBucket: "chatapp-cef00.firebasestorage.app", // Replace with your actual storageBucket
    messagingSenderId: "808161438393", // Replace with your actual messagingSenderId
    appId: "1:808161438393:web:2cceab66779dd73afac968" // Replace with your actual appId
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the authentication service instance

// 4. Get HTML Elements
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signupBtn');
const signinBtn = document.getElementById('signinBtn');
const signoutBtn = document.getElementById('signoutBtn');
const googleSigninBtn = document.getElementById('googleSigninBtn');
const userStatusDiv = document.getElementById('userStatus');
const errorMessageDiv = document.getElementById('errorMessage');

// Helper function to display errors
function displayError(message) {
    errorMessageDiv.textContent = message;
    console.error(message);
}

// Helper function to clear errors
function clearError() {
    errorMessageDiv.textContent = '';
}

// --- 5. Authentication Event Listeners ---

// Email & Password Sign Up
signupBtn.addEventListener('click', async () => {
    clearError();
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        displayError("Email and password cannot be empty.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
        alert("Account created successfully! Welcome.");
    } catch (error) {
        // Handle specific Firebase errors for better user feedback
        let errorMessage = "An unknown error occurred during sign up.";
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "This email is already in use. Try signing in.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email address format.";
                break;
            case 'auth/weak-password':
                errorMessage = "Password is too weak. Please use at least 6 characters.";
                break;
            default:
                errorMessage = `Sign Up Error: ${error.message}`;
        }
        displayError(errorMessage);
    }
});

// Email & Password Sign In
signinBtn.addEventListener('click', async () => {
    clearError();
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        displayError("Email and password cannot be empty.");
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user);
        alert("Successfully signed in!");
    } catch (error) {
        let errorMessage = "An unknown error occurred during sign in.";
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = "Invalid email address format.";
                break;
            case 'auth/user-disabled':
                errorMessage = "This account has been disabled.";
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password': // Firebase gives same error for wrong password or user not found to prevent enumeration
                errorMessage = "Invalid email or password.";
                break;
            default:
                errorMessage = `Sign In Error: ${error.message}`;
        }
        displayError(errorMessage);
    }
});

// Google Sign In
googleSigninBtn.addEventListener('click', async () => {
    clearError();
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        // The signed-in user info.
        const user = result.user;
        console.log("Google sign-in successful:", user);
        alert(`Signed in with Google: ${user.displayName || user.email}`);
        // You can get the Google Access Token if needed:
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
    } catch (error) {
        let errorMessage = "An unknown error occurred during Google sign-in.";
        // Handle specific errors for Google sign-in
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = "Google sign-in popup was closed.";
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = "Google sign-in popup already in progress.";
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = "An account with this email already exists using a different sign-in method.";
                break;
            case 'auth/unauthorized-domain':
                errorMessage = "Unauthorized domain. Please add your domain to Firebase authorized domains.";
                break;
            default:
                errorMessage = `Google Sign-in Error: ${error.message}`;
        }
        displayError(errorMessage);
    }
});

// Sign Out
signoutBtn.addEventListener('click', async () => {
    clearError();
    try {
        await signOut(auth);
        console.log("User signed out");
        alert("Successfully signed out!");
    } catch (error) {
        displayError(`Sign Out Error: ${error.message}`);
    }
});

// --- 6. Authentication State Listener (Essential for UI updates) ---
// This listener fires whenever the user's sign-in state changes (login, logout)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        userStatusDiv.innerHTML = `
            <strong>Logged in as:</strong><br>
            Email: ${user.email || 'N/A'}<br>
            Display Name: ${user.displayName || 'N/A'}<br>
            UID: ${user.uid}<br>
            Provider: ${user.providerData[0].providerId}
        `;
        // Example: You might show the chat interface here and hide login forms
        console.log("Current user:", user);
    } else {
        // User is signed out
        userStatusDiv.textContent = "No user logged in.";
        // Example: You might hide the chat interface and show login forms
        console.log("No user logged in.");
    }
});
