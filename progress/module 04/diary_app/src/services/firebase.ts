import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
	apiKey: "AIzaSyD73f9hWIiRFJ2lZ6ZXvyCVSLdRYGnefk0",
	authDomain: "diary-app-42-vgomes-p.firebaseapp.com",
	projectId: "diary-app-42-vgomes-p",
	storageBucket: "diary-app-42-vgomes-p.firebasestorage.app",
	messagingSenderId: "898721109343",
	appId: "1:898721109343:web:ad275e4c4385d0fe2fd2ea"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);