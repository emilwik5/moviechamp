"use client";
import React, { useEffect, useState } from "react";
import BackSvg from "../public/SVGS/previous.svg";
import { motion, AnimatePresence } from "framer-motion";
import { auth, db } from "../firebase/clientApp";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getMoviePosterUrl } from "./tmdb";
import StarFilled from "../public/SVGS/star_filled.svg"
import StarEmpty from "../public/SVGS/star_empty.svg"

const Modal = ({ isOpen, onClose, movie, updateUserCollection, updateUserWatchlist, updateUserFavorites }) => {
  const [user] = useAuthState(auth);
  const [isInCollection, setIsInCollection] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInFavorites, setIsInFavorites] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: "", color: "" , outlineColor: ""});

  useEffect(() => {
    const checkIfInCollection = async () => {
      if (user && movie) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.collection && userData.collection.includes(movie.id)) {
            setIsInCollection(true);
          } else {
            setIsInCollection(false);
          }

          if (userData.watchlist && userData.watchlist.includes(movie.id)) {
            setIsInWatchlist(true);
          } else {
            setIsInWatchlist(false);
          }

          if (userData.favorites && userData.favorites.includes(movie.id)) {
            setIsInFavorites(true);
          } else {
            setIsInFavorites(false);
          }
        }
      }
    };
    checkIfInCollection();
  }, [user, movie]);

  const showNotification = (message, color, outlineColor) => {
    setNotification({ visible: true, message, color, outlineColor });
    setTimeout(() => {
      setNotification({ visible: false, message: "", color: "", outlineColor: ""});
    }, 3000);
  };

  if (!isOpen || !movie) return null;

  const handleAddToCollection = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        // Om användaren kör in en film i collection så behöver den inte va i watchlist längre
        await updateDoc(userRef, {
          collection: arrayUnion(movie.id),
          watchlist: arrayRemove(movie.id),
        });
        setIsInCollection(true);
        setIsInWatchlist(false);
        updateUserCollection(movie.id, true);
        updateUserWatchlist(movie.id,false);
        showNotification(`${movie.title} added to collection!`, "bg-green-600/70", "ring-green-400/60");
        console.log(`Movie ID ${movie.id} added to collection.`);
      } catch (error) {
        console.error("Error adding movie to collection:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  const handleRemoveFromCollection = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          // Om användaren tar bort en film ur sin collection så är det antagligen inte en favorit
          collection: arrayRemove(movie.id),
          favorites: arrayRemove(movie.id),
        });
        setIsInCollection(false);
        updateUserCollection(movie.id, false);
        updateUserFavorites(movie.id,false);
        showNotification(`${movie.title} removed from collection!`, "bg-red-600/70", "ring-red-400/60");
        console.log(`Movie ID ${movie.id} removed from collection.`);
      } catch (error) {
        console.error("Error removing movie from collection:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          watchlist: arrayRemove(movie.id),
        });
        setIsInWatchlist(false);
        updateUserWatchlist(movie.id, false);
        showNotification(`${movie.title} removed from WatchList.`, "bg-blue-600/70", "ring-blue-400/60");
        console.log(`Movie ID ${movie.id} removed from WatchList.`);
      } catch (error) {
        console.error("Error removing movie from WatchList:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  const handleAddToWatchlist = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          watchlist: arrayUnion(movie.id),
        });
        setIsInWatchlist(true);
        updateUserWatchlist(movie.id, true);
        showNotification(`${movie.title} added to WatchList.`, "bg-teal-600/70", "ring-teal-400/60");
        console.log(`Movie ID ${movie.id} added to WatchList.`);
      } catch (error) {
        console.error("Error adding movie to WatchList:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  const handleAddToFavorites = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          favorites: arrayUnion(movie.id),
        });
        setIsInFavorites(true);
        updateUserFavorites(movie.id, true);
        showNotification(`${movie.title} added to Favorites.`, "bg-yellow-600/70", "ring-yellow-400/60");
        console.log(`Movie ID ${movie.id} added to Favorites.`);
      } catch (error) {
        console.error("Error adding movie to Favorites:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          favorites: arrayRemove(movie.id),
        });
        setIsInFavorites(false);
        updateUserFavorites(movie.id, false);
        showNotification(`${movie.title} removed from Favorites`, "bg-amber-600/70", "ring-amber-400/60");
        console.log(`Movie ID ${movie.id} removed from Favorites.`);
      } catch (error) {
        console.error("Error removing movie from Favorites:", error);
      }
    } else {
      console.error("No user is logged in.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full h-full z-20">
        <div
          className="absolute inset-0 h-full w-full bg-cover z-10"
          style={{
            backgroundImage: `url(${movie.poster_url})`,
            width: "100%",
            height: "100%",
          }}
        ></div>

        {isInCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 transition duration-300 ease-out bg-gradient-to-tl from-yellow-500/90 from-10% to-green-500/0 to-40% z-10"
          ></motion.div>
        )}

        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xl flex justify-center items-center pt-16 z-10 [text-shadow:_1px_2px_2px_rgb(0_0_0_/_50%)]">
          <button onClick={onClose} className="absolute top-32 left-16">
            <BackSvg className="size-10 transition duration-300 ease-out hover:scale-110 hover:fill-white/100 fill-white/80"></BackSvg>
          </button>
          
          <AnimatePresence>
            {notification.visible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.5 }}
                className={`flex justify-center items-center text-balance text-center absolute bottom-5 left-5 w-60 h-20 ${notification.color} ring-4 ${notification.outlineColor} text-green-100 rounded-2xl text-xs uppercase`}
              >
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex flex-row justify-evenly items-center rounded-lg h-3/4 w-2/3 text-white gap-2">
            <div className="flex  justify-center relative w-full h-full self-center">
                <button className={`absolute left-5 top-5 w-12 h-12 ${
                  isInCollection
                    ? "visible"
                    : "invisible"
                } hover:brightness-125 hover:scale-125 transition will-change-transform duration-500 ease-out`}
                onClick={
                    isInFavorites
                      ? handleRemoveFromFavorites
                      : handleAddToFavorites
                  }
                >
                {isInFavorites ? 
                <StarFilled className={`size-10 fill-yellow-500 stroke-2 stroke-white drop-shadow-xl`}/>
                    :
                <StarEmpty className={`size-10 fill-white drop-shadow-xl`}/>
                }
                </button>
              <div
                className={`transition duration-700 ease-out h-full rounded-xl bg-cover bg-center -z-20 overflow-hidden shadow-xl shadow-black/70 ${
                  isInCollection ? "ring-4 ring-yellow-500" : ""
                }`}
                style={{
                  backgroundImage: `url(${movie.poster_url})`,
                  width: "75%",
                  height: "100%",
                }}
              ></div>

            </div>
            <div className="flex flex-col w-full h-full text-right justify-start items-right px-3">
              <h2 className="text-3xl font-bold mb-4 uppercase">
                {movie.title}
              </h2>
              <h2 className="text-lg italic my-1 uppercase opacity-75">
                "{movie.tagline}"
              </h2>
              <p className="text-lg my-2 text-balance">
                Rating: {movie.average}
              </p>

              <p className="flex justify-center h-full text-normal text-balanced text-center mt-5 ml-14 mb-2 p-2 font-thin max-h-32 overflow-auto bg-black/20 rounded-md">
                {movie.overview}
              </p>
              <p className="text-sm opacity-50">
                Release date: {movie.release_date}
              </p>

              <div className="flex flex-row h-full gap-10 justify-center items-center content-center">
              <button
                className={`w-36 h-16 ${
                  isInWatchlist
                    ? "bg-red-600/30 hover:bg-amber-800/60 ring-4 ring-amber-500"
                    : "bg-teal-600/60 ring-4 ring-teal-400/80 hover:bg-teal-500/80"
                } ${isInCollection ? "hidden" :""} backdrop-blur-3xl rounded-md self-center text-xs text-balance transition duration-300 hover:scale-110 ease-out`}
                onClick={
                  isInWatchlist
                    ? handleRemoveFromWatchlist
                    : handleAddToWatchlist
                }
              >
                {isInWatchlist
                  ? `I don't want to see this movie anymore.`
                  : "I want to see this movie!"}
              </button>

              <div className={`h-48 w-[0.3%] bg-white/50 rounded-full ${isInCollection ? "hidden" :""}`}>

              </div>

              <motion.button
                className={`w-24 h-24 ${
                  isInCollection
                    ? "bg-red-600/30 hover:bg-red-800/60 ring-4 ring-red-500 rounded-lg w-48 h-16"
                    : "bg-green-600/60 ring-4 ring-green-400/80 hover:bg-green-500/80"
                } backdrop-blur-3xl rounded-full self-center transition duration-300 hover:scale-110 ease-out`}
                onClick={
                  isInCollection
                    ? handleRemoveFromCollection
                    : handleAddToCollection
                }
              >
                {isInCollection
                  ? "Remove from my Collection"
                  : "Add to my Collection"}
              </motion.button>
              </div>
              
              <button className={`mx-auto rounded-full flex justify-center items-center w-40 h-10 text-sm ${isInCollection ? "visible" : "invisible"} ${isInFavorites ? "bg-red-500 ring-4 ring-red-300" : "bg-yellow-500 ring-4 ring-yellow-300"} hover:scale-110 hover:brightness-125 transition duration-300 ease-out`}
              onClick={
                isInFavorites
                  ? handleRemoveFromFavorites
                  : handleAddToFavorites
              }
              >
                {isInFavorites
                  ? "Remove from Favorites"
                  : "Add to my Favorites"}
              </button>
              

              <p className="text-sm opacity-50 absolute bottom-0 text-center align-middle">
                MOVIE ID: {movie.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Modal;
