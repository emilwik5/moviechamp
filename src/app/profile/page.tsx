'use client'
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import React, { ReactElement, ReactNode } from 'react';
import AddFriend from "../../../public/SVGS/add.svg";

function GenerateFriends() : ReactElement {
    const result: ReactElement[] = [];
    for(let i = 0; i < 10; i++){ 
        const html = (
            <div className="bg-yellow-500/60 rounded-xl h-full w-full hover:scale-110 hover:bg-yellow-300/90 transition duration-500 ease-out" key={i}>

            </div>
        );

        result.push(html);
    }

    const html = (
        <div className="flex justify-center items-center bg-blue-500/60 hover:bg-blue-500/90 rounded-xl h-full w-full col-span-2 hover:scale-110 transition duration-500 ease-out" key="add-friend">
            <div className="flex flex-row justify-center content-center items-center align-middle">
                <div className="uppercase font-bold">
                    Add friend
                </div>
                <AddFriend className="size-8 mx-2 fill-white">
                    
                </AddFriend>
            </div>
        </div>
    );

    result.push(html);

    return (
        <div className="grid grid-cols-6 p-2 grid-rows-2 gap-2 w-full h-3/5">
            {result}
        </div>
    );
}

function GeneratePlaceholderSquares(amount: number) : ReactNode[]{
    const result : ReactNode[] = [];

    for(let i = 0; i < amount; i++){
        const html = (
            <div className="h-full w-full bg-slate-600/60 rounded-xl hover:scale-110 duration-500 transition ease-out hover:bg-slate-500/90" key={i}></div>
        );
        
        result.push(html);
    }

    return result;
}

export default function Profile(){
    const [user] = useAuthState(auth);

    if (!user) return <div>Loading...</div>;

    return (
        <>
            <div className="flex w-screen h-screen items-center justify-center">
                <div className="grid grid-cols-2 grid-rows-2 items-center justify-items-center h-screen w-4/6 bg-black/40 backdrop-blur-2xl py-24 px-3">
                    <div className="flex flex-col justify-around items-center h-[95%] w-[95%] m-4">
                        <div className="text-3xl m-2">{user.displayName?.split(' ')[0]}'s WatchList</div>
                        <div className="text-3xl my-2 h-full w-full">
                            <div className="grid grid-cols-5 grid-rows-2 gap-2 h-full w-full justify-around">
                                {GeneratePlaceholderSquares(18)}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center h-[95%] w-[95%]">
                        <div className="flex flex-row w-full mt-5 h-2/5 justify-evenly text-baseline items-center">
                            <div className="text-2xl">{user.displayName}</div>
                            <img src={user.photoURL ?? ""} alt={user.displayName ?? ""} className="rounded-2xl w-24 h-24" />
                        </div>
                        <div className="text-left self-start ml-2">
                            {user.displayName?.split(' ')[0]}'s Friends
                        </div>
                        {GenerateFriends()}
                    </div>
                    
                    <div className="flex flex-col items-center h-[95%] w-[95%]">
                        <div className="text-3xl m-2">{user.displayName?.split(' ')[0]}'s Collection</div>
                        <div className="text-3xl my-2 h-full w-full">
                            <div className="grid grid-cols-5 grid-rows-2 gap-2 h-full w-full justify-around">
                                {GeneratePlaceholderSquares(18)}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center h-[95%] w-[95%]">
                        <div className="text-3xl m-4">Statistics</div>
                        <div>25 movies seen</div>
                        <div>8 movies in their collection</div>
                        <div>3 movies rated</div>
                    </div>
                </div>
            </div>
        </>
    );
}
