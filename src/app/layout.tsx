'use client';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Teko } from 'next/font/google';
import { Roboto_Condensed } from 'next/font/google';
import { Outfit } from 'next/font/google';
import FormattedUser from './FormattedUser';
import { usePathname } from 'next/navigation';

import './globals.css';
import Link from 'next/link';
import LogoSVG from '../../public/moviechampwhite.svg';
import Image from 'next/image';
import SettingsIcon from '../../public/SVGS/settings.svg';
import bg from '../../public/ghost.jpg';
import { useAuthState } from 'react-firebase-hooks/auth';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: '800',
});

const teko = Teko({
  subsets: ['latin'],
  display: 'swap',
});

const roboto = Roboto_Condensed({
  subsets: ['latin'],
  display: 'swap',
  weight: '700',
});

const bread = Roboto_Condensed({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
});
import { auth, db } from "../../firebase/clientApp";
import { useRouter } from 'next/router';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  console.log(pathname);
  
  const isActive = (path: string) => pathname === path;

  


  return (
    <html lang="en" className={`${roboto.className}`}>
      <body>
        <div className="fixed w-screen z-20 overflow-hidden">
          <nav>
            <div className="bg-black-600 flex flex-row gap-x-[1%] subpixel-antialiased text-center justify-evenly align-middle content-center text-3xl backdrop-blur-xl shadow-md shadow-black/80 bg-slate-800/40 h-24">
              <div
                className={`${outfit.className} flex basis-1/6 justify-evenly items-center`}
              >
                <Link href="/">
                  <div className="flex">
                    <LogoSVG className="fill-white size-9" />
                    <h1 className="mt-1 scale-0 absolute md:static md:scale-100">
                      MOVIECHAMP
                    </h1>
                  </div>
                </Link>
              </div>

              <Link
                href="/home"
                className={`flex basis-1/6 justify-around items-center transition duration-300 ease-out hover:bg-blue-500/40 ${
                  isActive('/home')
                    ? 'bg-gradient-radial-home underline decoration-blue-500/80 decoration-2 underline-offset-8'
                    : ''
                }`}
              >
                <div>
                  <h1>HOME</h1>
                </div>
              </Link>

              <Link
                href="/play"
                className={`flex basis-1/6 justify-around items-center transition duration-300 ease-out hover:bg-red-500/40 ${
                  isActive('/play')
                    ? 'bg-gradient-radial-movies underline decoration-red-500/80 decoration-2 underline-offset-8'
                    : ''
                }`}
              >
                <div>
                  <h1>QUIZ</h1>
                </div>
              </Link>

              <Link
                href="/movies"
                className={`flex basis-1/6 justify-around items-center transition duration-300 ease-out hover:bg-green-500/40 ${
                  isActive('/movies')
                    ? 'bg-gradient-radial-movies underline decoration-green-500/80 decoration-2 underline-offset-8'
                    : ''
                }`}
              >
                <div>
                  <h1>MOVIES</h1>
                </div>
              </Link>

              <div
                className={`${outfit.className} text-lg flex basis-1/6 justify-around items-stretch transition duration-300 ease-out hover:bg-yellow-500/40 ${
                  isActive('/profile')
                    ? 'bg-gradient-radial-profile underline decoration-yellow-500/80 decoration-2 underline-offset-8'
                    : ''
                }`}
              >
                <FormattedUser />
              </div>

              <Link
                href="/settings"
                className={`flex basis-[5%] justify-center items-center transition duration-300 ease-out hover:bg-teal-500/40 ${
                  isActive('/settings')
                    ? 'bg-gradient-radial-movies underline decoration-teal-500/80 decoration-2 underline-offset-8'
                    : ''
                }`}
              >
                <div className="flex justify-center items-center overflow-visible h-full w-full hover:fill-white">
                  <SettingsIcon className="size-8 fill-white/50" />
                </div>
              </Link>
            </div>
          </nav>
        </div>

        {children}

        <div
          className={`fixed h-screen top-0 w-screen bg-gradient-to-br from-black via-slate-900 to-black bg-cover font-normal opacity-75 -z-40 transition-all duration-300 ease-out ${
            isActive('/home')
              ? 'to-blue-900/80'
              : isActive('/profile')
              ? 'to-yellow-700/80'
              : isActive('/play')
              ? 'to-red-900/80'
              : isActive('/movies')
              ? 'to-green-900/80'
              : ''
          }`}
        ></div>

        <div
          className="fixed bg-cover top-0 bg-top h-screen w-screen -z-50 blur-md"
          style={{
            backgroundImage: `url(${bg.src})`,
            width: '100%',
            height: '100%',
          }}
        ></div>
      </body>
    </html>
  );
}
