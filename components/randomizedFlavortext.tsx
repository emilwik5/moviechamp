'use client'

import { useState, useEffect } from "react";

interface RandomizedParagraphProps {
    score: number;
}

export default function RandomizedFlavorWord({ score }: RandomizedParagraphProps) {
    const [randomWord1, setRandomWord1] = useState("");

    useEffect(() => {
        const bad= [
            "Keep this up and we'll ban you.",
            "Horrendous!",
            "Heartbreaking!",
            "Worse than just randomly picking",
            "Disaster!",
            "Dear fucking LORD!",
            "Terrible. Absolutely Terrible.",
            "Embarassing.",
            "Brain Damage!",
            "Yikes...",
            "See a neurologist immediately."
        ];

        const alright= [
            "Meh...",
            "Yeah",
            "Getting somewhere!",
            "You can do better!",
            "Okaaayy",
            "That's... Hmm...",
            "Getting there",
            "Okay...",
            "Well then...",
            "Yeah, okay...",
            "Bro what are you doing"
        ];

        const great= [
            "Terrific!",
            "Holy cow!",
            "Sick!",
            "Great!",
            "Sweet!",
            "Alright!",
            "Here we go!",
            "Better than most!",
            "Okay, okay, okay!",
            "Nice work!",
            "You did good!"
        ];

        const perfect=[
            "Perfect!",
            "Fantastic!",
            "MovieChamp!",
            "Incredible!",
            "Sheesh!",
            "Gorraim!",
            "Winner!",
            "Brilliant!",
            "9999 IQ!",
            "The real hero!",
            "HOLY SHIT WHAT!?"
        ]

        const randomIndex1 = Math.floor(Math.random() * perfect.length);

        let chosenWord = "";
        if(score == 0){
            chosenWord = bad[randomIndex1];
        }else if(score < 4){
            chosenWord = alright[randomIndex1];
        }else if(score < 10){
            chosenWord = great[randomIndex1];
        }else if(score == 10){
            chosenWord = perfect[randomIndex1];
        }else{
            chosenWord = "randomized flavortext bugged out";
        }

        setRandomWord1(chosenWord);
            
    }, [score]); // Empty dependency array ensures this effect runs only once on mount

    return (
        <>
            <div className="flex justify-center items-center absolute text-lg italic uppercase tracking-tight text-center text-red-500 rounded-2xl end-[20%] rotate-6 top-[15%] w-60 h-10 [text-shadow:_1px_2px_3px_var(--tw-shadow-color)] shadow-black">
                {randomWord1}
            </div>
        </>
    );
}
