import ThumbsOutline from "../../public/SVGS/ThumbsOutline.svg";
import ThumbsFilled from "../../public/SVGS/thumbs-up.svg";

export default function LikeButton() {
    return(
        <div className="absolute bottom-2 left-28 group flex flex-row justify-center items-center gap-2 w-20 h-8 bg-white/5 hover:bg-white/20 hover:scale-105 transition duration-500 ease-out rounded-lg will-change-transform">
            <ThumbsFilled className="size-4 fill-white group-hover:fill-slate-300 group-hover:-rotate-12 group-hover:-translate-y-1 transition-all duration-500 ease-out group-hover:scale-150"/>
            <div>
            Like
            </div>
        </div>
    )
}