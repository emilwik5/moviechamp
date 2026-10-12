'use client'

import { useState, useEffect } from "react";

export default function RandomizedParagraph() {
    const [randomWord1, setRandomWord1] = useState("");
    const [randomWord2, setRandomWord2] = useState("");

    useEffect(() => {
        const random1= ["Alltid", "Allvarligt", "Allmänt", "Abnormt", "Abrupt", "Absolut", "Alltjämt", "Ambitiöst", "Ansvarslöst"];
        const random2= ["Barnsliga", "Banala", "Besvikande", "Besserwissiga", "B...Korkade", "Bajsiga", "Bossiga", "Bakvända", "Bedrägliga", "Beklagansvärt"];

        const randomIndex1 = Math.floor(Math.random() * random1.length);
        const randomIndex2 = Math.floor(Math.random() * random2.length);

        setRandomWord1(random1[randomIndex1]);
        setRandomWord2(random2[randomIndex2]);
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <>
            <h1 className="text-md w-[70%] text-center my-6 text-pretty">
                MOVIECHAMP is NOT a registered trademark to Ignition Games AB (AB står då alltså för {randomWord1} {randomWord2}), but don't steal it or we'll get sad.
            </h1>
        </>
    );
}
