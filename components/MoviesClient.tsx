"use client";

import { ReactElement, useEffect, useState } from "react";
import StarFilled from "../public/SVGS/star_filled.svg";
import Modal from "./modal";
import { Movie } from "../src/app/movies/types";
import { Outfit } from "next/font/google";
import { auth, db } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import React, { ReactNode } from "react";
import EyeSVG from "../public/SVGS/eye.svg";
import AddSVG from "../public/SVGS/plus-small.svg";
import EyeCrossSVG from "../public/SVGS/eye-crossed.svg";
import TrashSVG from "../public/SVGS/trash.svg";

import { AnimatePresence } from "framer-motion";
import { animate } from "framer-motion/dom";
import { motion } from "framer-motion";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: "800",
});

interface MoviesClientProps {
  movies: Movie[];
}

//Tailwind JIT-compilation stupid stupid fix
const fillColorClasses = [
  "fill-yellow-500/10",
  "fill-yellow-500/20",
  "fill-yellow-500/30",
  "fill-yellow-500/40",
  "fill-yellow-500/50",
  "fill-yellow-500/60",
  "fill-yellow-500/70",
  "fill-yellow-500/80",
  "fill-yellow-500/90",
  "fill-yellow-500/100",
];

export function GenerateStars(number: number): ReactElement {
  const result: ReactElement[] = [];
  const stars = Math.floor(number / 20);
  const allstars = Math.ceil(number / 20);
  const remainder = number % 20;
  const fillColorClass = fillColorClasses[Math.floor(remainder / 2)];

  // First all the full (100%) stars
  for (let i = 0; i < stars; i++) {
    const html = (
      <StarFilled className="size-4 fill-yellow-400 stroke-yellow-600 stroke-2" />
    );

    result.push(html);
  }

  // Then any other if applicable
  for (let i = 0; i < 5 - stars; i++) {
    var html;
    if (i == 0) {
      //If its the first star turn remainder into opacity.
      html = (
        <StarFilled
          className={`size-4 ${
            fillColorClasses[Math.floor(remainder / 2)]
          } stroke-yellow-600 stroke-2`}
        />
      );
    } else {
      //Else make it completely transparent
      html = (
        <StarFilled className="size-4 overflow-clip fill-yellow-400/0 stroke-yellow-600 stroke-2" />
      );
    }

    result.push(html);
  }

  return (
    <>
      <div className="flex flex-row h-12 justify-evenly w-full basis-1/2">
        {result}
      </div>
    </>
  );
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.025,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.2 },
  visible: { opacity: 1, scale: 1 },
};

const MoviesClient: React.FC<MoviesClientProps> = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user] = useAuthState(auth);
  const [userCollection, setUserCollection] = useState<number[]>([]);
  const [userWatchlist, setUserWatchlist] = useState<number[]>([]);
  const [userFavorites, setUserFavorites] = useState<number[]>([]);
  const [notification, setNotification] = useState({ visible: false, message: "", color: "", outlineColor: "" });

  useEffect(() => {
    const fetchUserCollection = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserCollection(userData.collection || []);
          setUserFavorites(userData.favorites || []);
          setUserWatchlist(userData.watchlist || []);
        }
      }
    };
    fetchUserCollection();
  }, [user]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const updateUserCollection = (movieId: number, add: boolean) => {
    setUserCollection((prev) =>
      add ? [...prev, movieId] : prev.filter((id) => id !== movieId)
    );
  };

  const updateUserWatchlist = (movieId: number, add: boolean) => {
    setUserWatchlist((prev) =>
      add ? [...prev, movieId] : prev.filter((id) => id !== movieId)
    );
  };

  const updateUserFavorites = (movieId: number, add: boolean) => {
    setUserFavorites((prev) =>
      add ? [...prev, movieId] : prev.filter((id) => id !== movieId)
    );
  };

  const showNotification = (message : string, color : string, outlineColor :string) => {
    setNotification({ visible: true, message, color, outlineColor });
    setTimeout(() => {
      setNotification({ visible: false, message: "", color: "", outlineColor: ""});
    }, 3000);
  };

  // Firestore update functions
  const handleAddToCollection = async (movieId: number) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          collection: arrayUnion(movieId),
          watchlist: arrayRemove(movieId),
        });
        updateUserCollection(movieId, true);
        updateUserWatchlist(movieId, false);
        showNotification("Added to collection", "bg-green-600/60", "ring-green-400/60");
        console.log(`Movie ID ${movieId} added to collection.`);
      } catch (error) {
        console.error("Error adding movie to collection:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  const handleRemoveFromCollection = async (movieId: number) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          collection: arrayRemove(movieId),
        });
        updateUserCollection(movieId, false);
        showNotification("Removed from collection", "bg-red-600/60", "ring-red-400/60");
        console.log(`Movie ID ${movieId} removed from collection.`);
      } catch (error) {
        console.error("Error removing movie from collection:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  const handleAddToWatchlist = async (movieId: number) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          watchlist: arrayUnion(movieId),
        });
        updateUserWatchlist(movieId, true);
        showNotification(`Added to watchlist`, "bg-teal-600/60", "ring-teal-400/60");
        console.log(`Movie ID ${movieId} added to watchlist.`);
      } catch (error) {
        console.error("Error adding movie to watchlist:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  const handleRemoveFromWatchlist = async (movieId: number) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          watchlist: arrayRemove(movieId),
        });
        updateUserWatchlist(movieId, false);
        showNotification("Removed from watchlist", "bg-blue-600/60", "ring-blue-400/60");
        console.log(`Movie ID ${movieId} removed from watchlist.`);
      } catch (error) {
        console.error("Error removing movie from watchlist:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  return (
    <>
      <div className="w-full h-screen items-center align-middle overflow-x-hidden justify-center">
        <div className="flex w-full justify-center text-white overflow-clip items-center"></div>
        <motion.div
          className="grid 2xl:grid-cols-8 xl:grid-cols-7 lg:grid-cols-5 md:grid-cols-4 grid-cols-3 mx-auto w-[95%] h-full justify-items-center content-start place-items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {movies.map((movie) => (
            <motion.div
              transition={{ duration: 0.2 }}
              variants={itemVariants}
              key={movie.id}
              className={`group flex flex-col h-[85%] w-[95%] hover:ring-4 hover:ring-white brightness-90 cursor-pointer hover:brightness-110 hover:z-10 hover:shadow-2xl focus:z-0 focus:scale-90 hover:shadow-black rounded-lg ${
                userCollection.includes(movie.id)
                  ? "ring-2 ring-green-400 hover:ring-green-200 -ring-offset-4"
                  : ""
              } ${
                userWatchlist.includes(movie.id)
                  ? "ring-2 ring-blue-400 hover:ring-blue-200 -ring-offset-4"
                  : ""
              }
              justify-center text-center duration-700 ease-out shadow-xl m-3 will-change-transform overflow-hidden`}
              onClick={() => handleMovieClick(movie)}
            >
              <div className="relative w-full h-full">

                {userWatchlist.includes(movie.id) ? (
                  <button 
                    className="flex justify-center items-center absolute top-1 left-1 w-9 h-9 rounded-lg hover:scale-150 opacity-80 hover:opacity-100 transition duration-300 ease-out will-change-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWatchlist(movie.id);
                    }}
                  >
                    <EyeCrossSVG className="fill-white size-6 drop-shadow-lg shadow-black stroke-1 stroke-black/30 hover:fill-red-400 transition duration-300 ease-out"></EyeCrossSVG>
                  </button>
                ):(
                  <button 
                    className={`flex justify-center items-center ${(userCollection.includes(movie.id)) ? "invisible" : "visible"} absolute top-1 left-1 w-9 h-9 rounded-lg hover:scale-150 opacity-80 hover:opacity-100 transition duration-300 ease-out will-change-transform`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWatchlist(movie.id);
                    }}
                  >
                    <EyeSVG className="fill-white size-6 drop-shadow-lg shadow-black stroke-1 stroke-black/30 hover:fill-blue-400 transition duration-300 ease-out"></EyeSVG>
                  </button>
                )}

                {userCollection.includes(movie.id) ? (
                  <button 
                    className="flex justify-center items-center absolute top-1 right-1 w-9 h-9 rounded-lg hover:scale-150 opacity-80  hover:opacity-100 transition duration-300 ease-out will-change-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromCollection(movie.id);
                    }}
                  >
                    <TrashSVG className="fill-white hover:fill-red-400 size-6 drop-shadow-lg stroke-1 stroke-black/30 shadow-black transition duration-300 ease-out" />
                  </button>
                ) : (
                  <button 
                    className="flex justify-center items-center absolute top-1 right-1 w-9 h-9 rounded-lg hover:scale-150 opacity-80  hover:opacity-100 transition duration-300 ease-out will-change-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCollection(movie.id);
                    }}
                  >
                    <AddSVG className="fill-white size-8 drop-shadow-lg shadow-black stroke-1 stroke-black/30 hover:fill-green-400 transition duration-300 ease-out" />
                  </button>
                )}

                <div
                  className={`${outfit.className} w-full h-12 text-xs md:text-md uppercase content-end mt-[100%] text-balance [text-shadow:_1px_2px_2px_rgb(0_0_0_/_100%)] z-40 tracking-wide truncate`}
                >
                  {movie.title}
                </div>
                <div className="flex flex-row w-full h-12 mt-2 mb-[7%]">
                  <div className="h-12 w-full basis-1/4 text-green-700 text-xs">
                    {movie.average}
                  </div>
                  {GenerateStars(
                    Number(movie.average.substring(0, movie.average.length - 1))
                  )}
                  <div className="h-12 w-full basis-1/4 text-xs">
                    {movie.release_date.split("-")[0]}
                  </div>
                </div>
                <div className="absolute h-full w-full inset-0 bg-gradient-to-t from-black/0 from-75% to-black/[90%] to-[100%] rounded-lg -z-10 overflow-clip transition-all duration-1000 ease-out -top-20 group-hover:top-0"></div>
                <div className="absolute h-full w-full inset-0 bg-gradient-to-b from-black/0 from-65% to-black/[95%] to-[85%] rounded-lg -z-10 overflow-clip"></div>
                <div
                  className="absolute inset-0 h-full w-full rounded-lg bg-cover bg-top bg-no-repeat -z-20 overflow-clip transition-transform duration-1000 ease-out transform group-hover:scale-110 will-change-transform"
                  style={{
                    backgroundImage: `url(${movie.poster_url})`,
                    width: "100%",
                    height: "100%",
                  }}
                ></div>
              </div>
            </motion.div>
          ))}

        </motion.div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          movie={selectedMovie}
          updateUserCollection={updateUserCollection}
          updateUserWatchlist={updateUserWatchlist}
          updateUserFavorites={updateUserFavorites}
        />

        <AnimatePresence>
          {notification.visible && (
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className={`flex justify-center items-center text-balance text-center absolute bottom-5 left-5 backdrop-blur-xl w-60 h-20 ${notification.color} ring-4 ${notification.outlineColor} text-green-100 rounded-2xl text-xs uppercase`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MoviesClient;
