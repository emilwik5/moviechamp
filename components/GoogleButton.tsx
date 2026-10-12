'use client';
import { auth, db } from "../firebase/clientApp";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const googleAuth = new GoogleAuthProvider();

const GoogleButton = () => {
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleAuth);
            const user = result.user;
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            // If user document exists, get the existing collection
            let existingCollection = [];
            if (userSnap.exists()) {
                const userData = userSnap.data();
                existingCollection = userData.collection || [];
            }

            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                lastLogin: new Date(),
                // Preserve existing collection if it exists
                collection: existingCollection,
            }, { merge: true });

            router.push('/profile');


        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <div>
            <button onClick={handleGoogleSignIn}
                type="button"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Sign in with Google account!
            </button>
        </div>
    );
};

export default GoogleButton;
