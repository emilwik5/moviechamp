import LikeButton from "./LikeButton";

interface FeedPostProps {
  timeAgo: string;
  pfpUrl: string;
  userName: string;
  amt: number;
  id: number;
}

export function GamePost({ timeAgo, pfpUrl, userName, amt, id }: FeedPostProps) {
  return (
    <div className="relative flex flex-col justify-center items-center font-extrabold w-full h-48 bg-black/30 m-2 rounded-lg">
      <div className="absolute top-0 right-0 text-xs text-white/50 m-2 mx-4">
        {timeAgo}
      </div>
      <div className="w-20 h-20 text-sm bg-white/50 m-2 self-start rounded-lg">
        {/* Profile Picture */}
        {pfpUrl}
      </div>
      <div className="absolute top-0 text-lg text-white w-full m-2 left-24 self-start rounded-lg">
        {userName}
      </div>
      <div className="absolute font-thin top-8 text-sm text-white w-full m-2 left-24 self-start rounded-lg">
        Played {amt} more quizzes.
      </div>
      <button>
        <LikeButton />
      </button>
      <div className="absolute grid grid-cols-5 h-20 w-[78%] left-24 rounded-md bg-black/40 bottom-10 p-2 gap-2">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row justify-center items-center w-full h-full bg-amber-500/70">
            <div className="text-2xl">8</div>
            <div className="text-md ml-1 uppercase text-white/50">/ 10</div>
          </div>
          <div className="flex flex-row justify-center items-center italic w-full h-full bg-amber-500/70 text-white/65">
            <div>-2512</div>
            <div className="text-xs ml-1 italic uppercase text-white/35">PTS</div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row justify-center items-center w-full h-full bg-amber-500/70">
            <div className="text-2xl">8</div>
            <div className="text-md ml-1 uppercase text-white/50">/ 10</div>
          </div>
          <div className="flex flex-row justify-center items-center italic w-full h-full bg-amber-500/70 text-white/65">
            <div>512</div>
            <div className="text-xs ml-1 italic uppercase text-white/35">PTS</div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row justify-center items-center w-full h-full bg-amber-500/70">
            <div className="text-2xl">8</div>
            <div className="text-md ml-1 uppercase text-white/50">/ 10</div>
          </div>
          <div className="flex flex-row justify-center items-center italic w-full h-full bg-amber-500/70 text-white/65">
            <div>512</div>
            <div className="text-xs ml-1 italic uppercase text-white/35">PTS</div>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-full bg-white/20">
          +2
        </div>
      </div>
    </div>
  );
}

export function CollectionPost({ timeAgo, pfpUrl, userName, amt, id }: FeedPostProps) {
  return (
    <div id={String(id)} className="relative flex flex-col justify-center items-center font-extrabold w-full h-48 bg-black/30 m-2 rounded-lg">
      <div className="absolute top-0 right-0 text-xs text-white/50 m-2 mx-4">
        {timeAgo}
      </div>
      <div className="w-20 h-20 text-sm bg-white/50 m-2 self-start rounded-lg">
        {pfpUrl}
      </div>
      <div className="absolute top-0 text-lg text-white w-full m-2 left-24 self-start rounded-lg">
        {userName}
      </div>
      <div className="absolute font-thin top-8 text-sm text-white w-full m-2 left-24 self-start rounded-lg">
        Added {amt} new movies to their collection
      </div>
      <button>
        <LikeButton />
      </button>
      <div className="absolute grid grid-cols-5 h-20 w-[80%] left-24 rounded-md bg-black/40 bottom-10 p-2 gap-2">
        <div className="w-full h-full bg-white/70"></div>
        <div className="w-full h-full bg-white/20"></div>
        <div className="w-full h-full bg-white/20"></div>
        <div className="w-full h-full bg-white/20"></div>
        <div className="flex justify-center items-center w-full h-full bg-white/50">
          +2
        </div>
      </div>
    </div>
  );
}
