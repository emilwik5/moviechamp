"use client"
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/clientApp";

import { Inter } from 'next/font/google';
import { Teko } from 'next/font/google';
import { Roboto_Condensed } from 'next/font/google';
import { Outfit } from 'next/font/google';
import { SparklesCore } from "../../components/sparkles";

import "./globals.css";
import Link from "next/link";
import LogoSVG from "../../public/moviechampwhite.svg";
import bg from "../../public/ghost.jpg";
import Image from "next/image";
import type { Metadata } from "next";
import layout from './layout'

import {motion} from 'framer-motion';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
})

const teko = Teko({ 
  subsets: ["latin"],
  display: 'swap',
});

const roboto = Roboto_Condensed({
  subsets: ["latin"],
  display: 'swap',
  weight: '700',
})

const bread = Roboto_Condensed({
  subsets: ["latin"],
  display: 'swap',
  weight: '400',
})

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 overflow-clip">      
      <motion.div className="flex flex-row mt-12 items-end"
        initial={{opacity: 0, scale: 0}}
        animate={{opacity:1, scale: 1}}
        transition={{ type: "spring", duration: 2 }}
      >
        <LogoSVG className="fill-white lg:size-40 mt-16 md:size-32 sm:size-20"></LogoSVG>
        <h1 className={`${outfit.className} + lg:text-9xl md:text-8xl sm:text-6xl justify-around items-center font-extrabold mt-24`}>
          MOVIECHAMP
        </h1>
      </motion.div>

      <h1 
      className={`${outfit.className} + text-2xl justify-around items-center font-medium mt-24`}>
        THE MOVIE-LOVERS SOCIAL-NETWORK PARTY QUIZ GAME!
      </h1> 
      
      
      <div className="flex flex-row gap-x-24 subpixel-antialiased text-center justify-center align-middle content-center mt-20">
        <Link href="/play">
          <h1 className={`${outfit.className} text-2xl justify-around items-center font-bold bg-red-500/20 transition ease-out duration-500 hover:bg-red-500/75 hover:scale-110 px-16 py-5 rounded-2xl will-change-transform`}>
            PLAY AS GUEST
          </h1>
        </Link>
        <Link href="/login">
          <h1 className={`${outfit.className} text-2xl justify-around items-center font-bold bg-yellow-500/20 transition ease-out duration-500 hover:bg-yellow-500/75 hover:scale-110 px-16 py-5 rounded-2xl will-change-transform`}>
            LOG IN
          </h1>
        </Link>
      </div>



      <div className={`${outfit.className} + flex flex-row antialiased font-thin gap-x-8 m-10`}>
        <Link href="/about" className="transition ease-in-out duration-500 hover:bg-black/50 hover:scale-110 px-5 py-3 rounded-lg will-change-transform">contributor & contributor</Link>
      </div>

      <div className="flex justify-center items-center w-full absolute inset-0 h-screen pointer-events-none -z-10">

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.1}
          maxSize={1}
          speed={0.8}
          particleDensity={50}
          className="w-[100%] h-[100%] -z-10 pointer-events-none [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"
          particleColor="#FFFFFF"
        />
 
      </div>

    </main>
  );
}
