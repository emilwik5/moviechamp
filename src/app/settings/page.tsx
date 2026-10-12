'use client'
import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import SignOutButton from "../../../components/SignoutButton";

export default function Settings(){
   
    const user = useAuthState(auth);

    if(user)

    return(
        <>
            <div className="w-screen h-screen items-center">
                <div className="flex flex-col justify-around h-[80%] w-[50%] mx-auto items-center pt-28 text-xl">
                    <div className="w-72 h-10 align-middle">
                        <div className="flex justify-center items-center uppercase text-3xl">
                            {user[0]?.displayName?.split(' ')[0]}'s Settings
                        </div>
                    </div>
                    
                    <Link href="/about" className="flex justify-center items-center bg-blue-700/20 w-64 h-20 m-10 rounded-md uppercase backdrop-blur-3xl transition duration-700 ease-out hover:bg-red-600/90 hover:scale-110">
                        About Moviechamp
                    </Link>
                    <SignOutButton>
                    </SignOutButton>
                </div>
            </div>
        </>
    )
}