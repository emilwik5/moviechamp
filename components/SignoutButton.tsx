'use client'
import { auth, db } from "../firebase/clientApp";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";


const SignOutButton = () => {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/'); // Redirect to the home page after sign-out
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div>
            <button onClick={handleSignOut}
                type="button"
                className="flex justify-center items-center bg-red-700/20 w-64 h-20 m-10 rounded-md uppercase backdrop-blur-3xl transition duration-700 ease-out hover:bg-red-600/90 hover:scale-110"
            >
                Sign out
            </button>
        </div>
    );
};

export default SignOutButton
