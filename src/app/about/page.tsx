import Link from "next/link"
import IgnitiongamesLogo from "../../../public/SVGS/IgnitionGamesLogo_Transparent_color.svg";
import RandomizedParagraph from "../../../components/randomized";

export default function About(){
    return(
        <>
        <div className="w-screen h-screen overflow-clip">
            <div className="mx-auto h-full w-4/6 bg-black/40 backdrop-blur-2xl -z-10">
                <div className="flex flex-col justify-center items-center">
                    <IgnitiongamesLogo className="size-96 contrast-150 invert z-30 -mb-14"></IgnitiongamesLogo>
                    <h1 className="text-5xl my-5 mb-10">WE ARE IGNITION GAMES</h1>
                    <h1 className="text-md w-[63%] text-center mt-12 text-balance">
                        We are Ignition Games
                    </h1>
                    <RandomizedParagraph>

                    </RandomizedParagraph>
                    <Link href="/" className="flex justify-center items-center bg-green-700/30 w-64 h-20 mt-20 rounded-md uppercase backdrop-blur-3xl transition duration-700 ease-out hover:bg-blue-400/80 hover:scale-110">
                        Return to Main Menu
                    </Link>
                    <h1 className="text-md w-[70%] text-center my-6 text-pretty text-sm mt-20">
                        Powered by Google Firebase. Created using Next.JS. Remember to drink water.
                    </h1>
                </div>
            </div>
        </div>
        </>
    )
}