'use client';
import React, { useState, useEffect, ReactElement } from 'react';
import MoviesClient from "../../../components/MoviesClient"; 
import SearchBar from "../../../components/SearchBar"; 
import { Movie } from "./types";
import { ReactNode } from 'react';
import { GenerateStars } from "../../../components/MoviesClient";
import { getTopRatedMovies } from '../../../components/PopularMovies';
import { Outfit } from 'next/font/google';

function GenerateLoadingRectangles() : ReactElement{
    const result : ReactElement[] = [];

    for(let i = 0; i < 20; i++){
        const html = (
                <div className={`flex flex-col bg-black/30 h-[85%] w-[95%] hover:scale-125 hover:z-10 hover:shadow-2xl focus:z-0 focus:scale-90 hover:shadow-black rounded-2xl justify-center text-center duration-700 ease-out shadow-xl m-3 will-change-transform animate-pulse`}>
                    <div className="relative w-full h-full justify-center mt-2">
                        <div className={`w-3/4 h-2 text-sm md:text-md bg-white/30 rounded-full mx-auto my-9 self-center animate-pulse uppercase content-center mt-[100%] text-balance [text-shadow:_1px_2px_2px_rgb(0_0_0_/_100%)] z-40 tracking-wide`}>
                        
                        </div>
                        <div className="flex flex-row w-full h-12 mt-2 mb-[7%]">
                            <div className="h-12 w-full basis-1/4 text-green-700 text-md animate-pulse">
                                ...
                            </div>
                            {GenerateStars(0)}
                            <div className="h-12 w-full basis-1/4 text-md animate-pulse">
                                ...
                            </div>
                        </div>
                        <div className="absolute h-full w-full inset-0 bg-gradient-to-b from-black/0 from-60% to-black/90 to-90% rounded-2xl -z-10 overflow-clip"></div>
                    </div>
                </div>

        );

        result.push(html);
    }

    return(
        <div className="w-full h-screen items-center align-middle overflow-x-hidden justify-center overflow-clip">
            <div className="flex w-full justify-center text-white overflow-clip items-center">
            <div className="grid 2xl:grid-cols-8 xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 grid-cols-3 mx-aut w-[95%] h-full justify-items-center content-start place-items-center overflow-clip">
                {result}
            </div>
            </div>
        </div>
    )

}

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showingPopular, setShowingPopular] = useState<boolean>(true);

    useEffect(() => {
        console.log("Fetching popular moveis")
        const fetchPopularMovies = async () => {
            setShowingPopular(true);
            setLoading(true);
            try {
                const movies = await getTopRatedMovies();
                setMovies(movies);
                setShowingPopular(true);
            } catch (error) {
                console.error("Error fetching Top Rated movies:", error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPopularMovies();
    }, []);

    return (
        <div className="w-full h-screen items-center align-middle overflow-x-hidden justify-center">
            <SearchBar setResults={setMovies} setLoading={setLoading} setShowingPopular={setShowingPopular} />
            {loading ? (
                    <div>
                    {GenerateLoadingRectangles()}
                    </div>
            ) : (
                <>
                    {showingPopular && <h2 className="flex justify-center py-4 text-white text-2xl mb-4 uppercase">Top rated movies</h2>}
                    <MoviesClient movies={movies} />
                </>
            )}
        </div>
    );
}



