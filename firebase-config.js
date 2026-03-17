// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOLlMtZB9vfdbWo3PlABfTru19A2Id2I4",
    authDomain: "prepudea-platform.firebaseapp.com",
    projectId: "prepudea-platform",
    storageBucket: "prepudea-platform.firebasestorage.app",
    messagingSenderId: "30596061507",
    appId: "1:30596061507:web:7dd5dbbad3ededc5f6f7f6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();

// Export for use in other files
window.firebase = firebase;
window.db = db;
window.auth = auth;