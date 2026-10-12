'use client'

import { useState, useEffect } from "react";

export default function RandomizedParagraph() {
    const [randomWord1, setRandomWord1] = useState("");

    useEffect(() => {
        const random1= [
            "Remember - The key to performing well is answering each question correctly!",
            "Don't worry if you get a question wrong, someone else will get it right! Wait...",
            "People don't know the meaning of a good breakfast until the smell of bacon hits you in the morning. That shit will have you salivating.",
            "Life doesn't have to be a contest, but damn if it ain't a lot of fun!",
            "WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP WAKE UP ",
            "We are so freaking back! Press a random button and hope for the best.",
            "Ready... Set... MovieChamp!",
            "I keep a Glock at the Vatican. Just in case unfinished business arises.",
            "Fetching images... Fetching Movie dates... Fetching /r/celebs...",
            "Thank you for playing MovieChamp! We love you!",
            "Even a broken clock is right twice a day!",
            "Even a blind squirrel can find a nut!"
        ];

        const randomIndex1 = Math.floor(Math.random() * random1.length);

        setRandomWord1(random1[randomIndex1]);
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <>
            <div className="uppercase text-xl text-white/60 mt-10 text-balance w-1/2">
                TIP: {randomWord1}
            </div>
        </>
    );
}
