'use client';
import { useState } from 'react';
import { db } from "../firebase/clientApp";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import SearchImage from "../public/SVGS/search.svg";
import { getMoviePosterUrl } from "./tmdb";

interface SearchBarProps {
    setResults: (movies: any[]) => void;
    setLoading: (loading: boolean) => void;
    setShowingPopular: (showing: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setResults, setLoading, setShowingPopular }) => {
    const [input, setInput] = useState('');

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!input.trim()) {
            setLoading(false);
            setShowingPopular(true);
            return;
        }

        try {
            const lowerCaseInput = input.toLowerCase();
            const q = query(collection(db, 'theMovies_lite'), where('title', '>=', lowerCaseInput), limit(16));
            const querySnapshot = await getDocs(q);
            const movies: any[] = [];

            for (const doc of querySnapshot.docs) {
                const data = doc.data();
                const moviePosterUrl = await getMoviePosterUrl(data.id);
                movies.push({
                    id: data.id,
                    title: data.title,
                    tagline: data.tagline,
                    release_date: data.release_date,
                    average: (parseFloat(data.average) * 10).toString() + "%",
                    overview: data.overview,
                    poster_url: moviePosterUrl || ''
                });
            }

            setResults(movies);
            setShowingPopular(false);
        } catch (error) {
            console.error("Error fetching movies:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full justify-center text-white overflow-clip items-center">
            <div className="flex justify-center items-center bg-black/50 backdrop-blur-2xl rounded-xl w-[95%] h-16 mt-28">
                <SearchImage className="size-7 fill-white w-12 stroke-white stroke-1 p-1" />
                <form className="flex w-[95%] justify-center" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="SEARCH MOVIES"
                        className="w-full bg-transparent text-white placeholder-gray-500 transition duration-700 origin-left focus:scale-150 uppercase ease-out text-2xl focus:outline-none"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
}; 

export default SearchBar;

