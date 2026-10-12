'use client';
import { Outfit } from 'next/font/google';
import LogoSVG from "../../../public/moviechampwhite.svg";
import Link from 'next/link';
import PlayIcon from "../../../public/SVGS/play.svg";
import Addicon from "../../../public/SVGS/add.svg";
import LikeButton from "../../../components/SocialFeed/LikeButton";
import { GamePost, CollectionPost } from "../../../components/SocialFeed/FeedPosts";

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
});

export default function Home() {
  return (
    <div className={`${outfit.className} flex justify-center items-center w-screen h-screen overflow-x-hidden`}>
      <div className="flex flex-row justify-center items-center w-2/3 gap-2 h-full mt-52">
        <div className="sticky flex flex-col h-full w-1/2 gap-2 rounded-lg">
          <div className="flex flex-col justify-start items-center w-full h-1/4 p-3 bg-black/10 rounded-lg backdrop-blur-xl">
            <div className="text-3xl font-extrabold my-2">PLAY</div>
            <Link href="/play" className="flex flex-row justify-center items-center text-2xl my-5 rounded-lg p-5 bg-green-500 transition duration-500 ease-out hover:scale-110 hover:brightness-90">
              <PlayIcon className="size-8 fill-white mr-3"/>
              <div className="flex justify-center items-center">START NEW QUIZ</div>
            </Link>
          </div>
          <div className="flex flex-col justify-start items-center w-full h-1/4 p-3 bg-black/10 rounded-lg backdrop-blur-xl">
            <div className="text-3xl font-extrabold my-2">FRIENDS</div>
            <button className="flex flex-row justify-center items-center text-2xl my-5 rounded-lg p-5 bg-blue-500 transition duration-500 ease-out hover:scale-110 hover:brightness-90">
              <Addicon className="size-6 fill-white mr-3"/>
              <div className="flex justify-center items-center">ADD A FRIEND</div>
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-start items-center w-full h-full p-3 bg-slate-900/80 rounded-3xl">
          <div className="text-3xl font-extrabold my-2">FEED</div>
          <CollectionPost
            timeAgo="1m Ago"
            pfpUrl="200"
            userName="Demo User"
            amt={12}
            id={256}
          />

          
          <GamePost
            timeAgo="1m Ago"
            pfpUrl="200"
            userName="Demo User"
            amt={12}
            id={255}
          />
        </div>
      </div>
    </div>
  );
}
