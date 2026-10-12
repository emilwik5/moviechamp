import { Outfit } from 'next/font/google';
import GoogleButton from "../../../components/GoogleButton";
import LogoSVG from "../../../public/moviechampwhite.svg";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
});

export default function About() {
  return (
    <div className={`${outfit.className} flex flex-col items-center justify-center min-h-screen`}>
      <LogoSVG className="fill-white lg:size-30 mt-12 md:size-32 sm:size-20"></LogoSVG>
        <h1 className={`${outfit.className} + lg:text-9xl md:text-8xl sm:text-6xl justify-around items-center font-extrabold mt-18`}>
          MOVIECHAMP
        </h1>

      <div className="mt-6 space-y-12 rounded-2xl p-20">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-bold  text-yellow-600">Welcome!</h2>
          <p className="text-xl text-white">Sign in to continue</p>
        </div >
        <div className='backdrop-blur-sm shadow-xl space-y-5'>
          <GoogleButton />
        </div>
      </div>
    </div>
  );
}
