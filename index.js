// index.js

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
// You can find this in your Firebase Console -> Project settings -> Your apps -> Web app
const firebaseConfig = {
    apiKey: "AIzaSyAvtf5C-BvAm4YAxTwPz_bv99wNJEW25qg", // YOUR_API_KEY
    authDomain: "chatapp-cef00.firebaseapp.com", // YOUR_PROJECT_ID.firebaseapp.com
    projectId: "chatapp-cef00", // YOUR_PROJECT_ID
    storageBucket: "chatapp-cef00.firebasestorage.app", // YOUR_PROJECT_ID.appspot.com
    messagingSenderId: "808161438393", // YOUR_MESSAGING_SENDER_ID
    appId: "1:808161438393:web:2cceab66779dd73afac968" // YOUR_APP_ID
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
    errorMessageDiv.classList.add('show'); // Add class to make it visible
    console.error(message);
}

// Helper function to clear errors
function clearError() {
    errorMessageDiv.textContent = '';
    errorMessageDiv.classList.remove('show'); // Remove class to hide it
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
        // Clear input fields after successful signup/signin
        emailInput.value = '';
        passwordInput.value = '';
    } catch (error) {
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
        // Clear input fields after successful signup/signin
        emailInput.value = '';
        passwordInput.value = '';
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
        const user = result.user;
        console.log("Google sign-in successful:", user);
        alert(`Signed in with Google: ${user.displayName || user.email}`);
    } catch (error) {
        let errorMessage = "An unknown error occurred during Google sign-in.";
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = "Google sign-in popup was closed.";
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = "Google sign-in popup already in progress.";
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = "An account with this email already exists using a different sign-in method. Please sign in with that method.";
                break;
            case 'auth/unauthorized-domain':
                errorMessage = "Unauthorized domain. Please add your domain to Firebase authorized domains in the Firebase Console.";
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
onAuthStateChanged(auth, (user) => {
    if (user) {
        userStatusDiv.innerHTML = `
            <strong>Logged in as:</strong><br>
            Email: ${user.email || 'N/A'}<br>
            Display Name: ${user.displayName || 'N/A'}<br>
            UID: ${user.uid}<br>
            Provider: ${user.providerData[0].providerId.replace('firebase.', '').replace('.com', '').toUpperCase()}
        `;
        // You would typically show chat UI and hide login forms here
    } else {
        userStatusDiv.textContent = "No user logged in.";
        // You would typically hide chat UI and show login forms here
    }
});
