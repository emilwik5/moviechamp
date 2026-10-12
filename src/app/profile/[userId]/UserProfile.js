// app/profile/[userId]/UserProfile.js
"use client";

import React, { useEffect, useState } from "react";
import { getUserData } from "../../../../firebase/clientApp";
import { getMoviePosterUrl } from "../../../../components/tmdb";
import AddFriend from "../../../../public/SVGS/add.svg";
import SearchImage from "../../../../public/SVGS/search.svg";
import { auth, db } from "../../../../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";
import TimeAgo from 'react-timeago';

// Gets and renders friends
const fetchFriends = async (friendIds) => {
  if (!friendIds || friendIds.length === 0) {
    return <div></div>;
  }

  const friends = await Promise.all(
    friendIds.map(async (id) => {
      const friendData = await getUserData(id);
      return friendData;
    })
  );

  return friends.map((friend) => (
    <Link
      href={`/profile/` + friend.uid}
      key={friend.uid}
      className="rounded-xl h-full w-full hover:scale-110 hover:brightness-110 transition duration-500 ease-out will-change-transform hover:ring-2"
      style={{
        backgroundImage: `url(${friend.photoURL})`,
        backgroundSize: "cover",
      }}
    ></Link>
  ));
};

function DisplayValue(message, value) {
  const html = [];

  html.push(
    <div className="flex flex-row justify-around items-center w-full m-1 h-auto">
      <div className="flex justify-center items-center w-4/5 h-10 bg-black/20 rounded-xl text-2xl">
        {message}
      </div>
      <div className="flex justify-center items-center rounded-xl h-10 w-24 bg-black/40 text-4xl text-yellow-500/90">
        {value}
      </div>
    </div>
  );

  return html;
}

function DisplayValueVersus(valueUser, message, valueOther) {
  const html = [];

  html.push(
    <div className="flex flex-row justify-around items-center w-full m-1">
      <div className="flex justify-center items-center rounded-xl h-10 w-24 bg-black/40 text-4xl text-green-400/90">
        {valueUser}
      </div>
      <div className="flex justify-center items-center w-2/3 h-12 bg-black/20 rounded-xl text-2xl">
        {message}
      </div>
      <div className="flex justify-center items-center rounded-xl h-10 w-24 bg-black/40 text-4xl text-red-500/90">
        {valueOther}
      </div>
    </div>
  );

  return html;
}

// Gets and renders the current user collection
const fetchCollectionSquares = async (movieIds) => {
  const movies = [];

  if (movieIds && movieIds.length > 0) {
    const fetchedMovies = await Promise.all(
      //Get the 9 LATEST additions to the users collection
      movieIds.slice(Math.max(movieIds.length - 9, 0)).map(async (id) => {
        const posterUrl = await getMoviePosterUrl(id, 154);
        return { id, posterUrl };
      })
    );
    movies.push(...fetchedMovies);
  }

  // Only render up to 9 movies, then add a number if its more than that
  let extraCount = 0;
  if (movieIds != undefined) {
    extraCount = movieIds.length - 9;
  }

  if (extraCount > 0) {
    movies.push({ id: "extra-count", posterUrl: null, extraCount });
  }

  while (movies.length < 10) {
    movies.push({ id: `placeholder-${movies.length}`, posterUrl: null });
  }

  return movies.map((movie) => {
    if (movie.id === "extra-count") {
      return (
        <div
          key={movie.id}
          className="h-full w-full flex items-center justify-center bg-black/60 rounded-xl hover:scale-110 duration-300 transition ease-out hover:bg-slate-700/90 hover:brightness-125 will-change-transform"
        >
          +{movie.extraCount}
        </div>
      );
    }

    return (
      <div
        key={movie.id}
        className="h-full w-full bg-center bg-slate-600/60 rounded-xl hover:scale-110 duration-300 transition ease-out hover:bg-slate-500/90 hover:brightness-125 will-change-transform"
        style={{
          backgroundImage: movie.posterUrl ? `url(${movie.posterUrl})` : "none",
          backgroundSize: "cover",
          backgroundColor: movie.posterUrl
            ? "transparent"
            : "rgba(0, 0, 0, 0.2)",
        }}
      ></div>
    );
  });
};

const fetchCommonWatchlistSquares = async (
  currentUserWatchlist,
  visitedUserWatchlist
) => {
  if (!currentUserWatchlist || !visitedUserWatchlist) return [];

  const commonWatchlistIds = currentUserWatchlist?.filter((movieId) =>
    visitedUserWatchlist?.includes(movieId)
  );

  const commonWatchlistMovies = await Promise.all(
    commonWatchlistIds.map(async (id) => {
      const posterUrl = await getMoviePosterUrl(id, 154);
      return { id, posterUrl };
    })
  );

  return commonWatchlistMovies?.map((movie) => (
    <div
      key={movie.id}
      className="bg-green-600 w-full bg-center h-full rounded-xl hover:scale-105 hover:brightness-125 transition-all duration-500 ease-out"
      style={{
        backgroundImage: `url(${movie.posterUrl})`,
        backgroundSize: "cover",
      }}
    ></div>
  ));
};

// Gets and renders the current user collection
const fetchWatchlistSquares = async (movieIds) => {
  const movies = [];

  if (movieIds && movieIds.length > 0) {
    const fetchedMovies = await Promise.all(
      //Get the 9 LATEST additions to the users collection
      movieIds.slice(Math.max(movieIds.length - 9, 0)).map(async (id) => {
        const posterUrl = await getMoviePosterUrl(id, 154);
        return { id, posterUrl };
      })
    );
    movies.push(...fetchedMovies);
  }

  // Only render up to 9 movies, then add a number if its more than that
  let extraCount = 0;
  if (movieIds != undefined) {
    extraCount = movieIds.length - 9;
  }

  if (extraCount > 0) {
    movies.push({ id: "extra-count", posterUrl: null, extraCount });
  }

  while (movies.length < 10) {
    movies.push({ id: `placeholder-${movies.length}`, posterUrl: null });
  }

  return movies.map((movie) => {
    if (movie.id === "extra-count") {
      return (
        <div
          key={movie.id}
          className="h-full w-full flex items-center justify-center bg-black/60 rounded-xl hover:scale-110 duration-300 transition ease-out hover:bg-slate-700/90 hover:brightness-125 will-change-transform"
        >
          +{movie.extraCount}
        </div>
      );
    }

    return (
      <div
        key={movie.id}
        className="h-full w-full bg-slate-600/60 rounded-xl bg-center hover:scale-110 duration-300 transition ease-out hover:bg-slate-500/90 hover:brightness-125 will-change-transform"
        style={{
          backgroundImage: movie.posterUrl ? `url(${movie.posterUrl})` : "none",
          backgroundSize: "cover",
          backgroundColor: movie.posterUrl
            ? "transparent"
            : "rgba(0, 0, 0, 0.2)",
        }}
      ></div>
    );
  });
};

// Gets and renders the current user collection
const fetchFavoriteSquares = async (movieIds) => {
  const movies = [];

  if (movieIds && movieIds.length > 0) {
    const fetchedMovies = await Promise.all(
      //Get the 9 LATEST additions to the users collection
      movieIds.slice(Math.max(movieIds.length - 4, 0)).map(async (id) => {
        const posterUrl = await getMoviePosterUrl(id, 500);
        return { id, posterUrl };
      })
    );
    movies.push(...fetchedMovies);
  }

  return movies.map((movie) => {
    return (
      <div
        key={movie.id}
        className="relative h-full w-full bg-slate-600/60 bg-center rounded-xl hover:scale-110 duration-300 transition ease-out hover:brightness-125 will-change-transform overflow-clip z-10"
        style={{
          backgroundImage: movie.posterUrl ? `url(${movie.posterUrl})` : "none",
          backgroundSize: "cover",
          backgroundColor: movie.posterUrl
            ? "transparent"
            : "rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="flex w-full justify-center absolute bottom-0 text-sm uppercase [text-shadow:_1px_2px_4px_rgb(0_0_0_/_100%)] z-30">
          {/* add movie title here */}
        </div>
        <div className="flex w-full h-full absolute bg-gradient-to-t from-black/90 scale-110 from-[10%] to-black/0 to-[40%] z-20"></div>
      </div>
    );
  });
};

// Gets and renders the current user collection
const fetchCommonMovieSquares = async (
  currentUserCollection,
  visitedUserCollection
) => {
  if (!currentUserCollection || !visitedUserCollection) return [];

  const commonMovieIds = currentUserCollection.filter((movieId) =>
    visitedUserCollection.includes(movieId)
  );

  const commonMovies = await Promise.all(
    commonMovieIds.map(async (id) => {
      const posterUrl = await getMoviePosterUrl(id, 154);
      return { id, posterUrl };
    })
  );

  return commonMovies.map((movie) => (
    <div
      key={"common" + movie.id}
      className="bg-green-600 w-full bg-center h-full rounded-xl hover:scale-110 hover:brightness-125 transition-all duration-300 ease-out"
      style={{
        backgroundImage: `url(${movie.posterUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    ></div>
  ));
};

// Get and render friend requests if they exist in the users FriendRequests : string = []
const fetchPlaceholderFriendRequests = async (friendRequestIds) => {
  const friendRequests = [];

  const friendDataList = await Promise.all(
    friendRequestIds.map(async (id) => {
      const friendData = await getUserData(id);
      return friendData;
    })
  );

  for (const friendData of friendDataList) {
    const html = (
      <div
        key={`friendReq_${friendData.uid}`}
        className="flex flex-row w-full h-20 rounded-md bg-green-800/20 backdrop-blur-2xl ring-2 ring-green-700 overflow-auto justify-center items-center mb-6"
      >
        <div className="flex flex-col w-full h-full pl-3 items-start justify-center">
          <div className="text-xl text-right uppercase">
            {friendData.displayName}
          </div>
          <div className="flex flex-row w-full gap-4 h-10 justify-start items-center">
            <button
              onClick={async () => {
                const currentUser = auth.currentUser;
                if (currentUser) {
                  await acceptFriendRequest(currentUser.uid, friendData.uid);
                }
              }}
              className="flex justify-center items-center text-black/70 bg-green-600/80 w-24 min-h-8 max-h-12 my-1 rounded-md text-center transition duration-500 ease-out hover:text-white/70 hover:brightness-150 hover:scale-110 will-change-transform"
            >
              ACCEPT
            </button>
            <button
              onClick={async () => {
                const currentUser = auth.currentUser;
                if (currentUser) {
                  await declineFriendRequest(currentUser.uid, friendData.uid);
                }
              }}
              className="flex justify-center items-center text-black/70 bg-red-600/80 w-8 min-h-8 max-h-12 my-1 rounded-md text-center transition duration-300 ease-out hover:text-white/70 hover:brightness-150 hover:scale-110 will-change-transform"
            >
              X
            </button>
          </div>
        </div>
        <div className="flex w-2/6 h-full mr-1 justify-center items-center content-center">
          <div
            className="h-16 w-16 rounded-md bg-slate-600/50 m-1 bg-center transition duration-500 ease-out hover:text-white/70 hover:brightness-150 hover:scale-110 will-change-transform"
            style={{
              backgroundImage: `url(${friendData.photoURL})`,
              backgroundSize: "cover",
            }}
          ></div>
        </div>
      </div>
    );

    friendRequests.push(html);
  }

  return friendRequests;
};

const acceptFriendRequest = async (currentUserId, friendUserId) => {
  const currentUserRef = doc(db, "users", currentUserId);
  const friendUserRef = doc(db, "users", friendUserId);

  await updateDoc(currentUserRef, {
    friends: arrayUnion(friendUserId),
    friendRequests: arrayRemove(friendUserId),
  });

  await updateDoc(friendUserRef, {
    friends: arrayUnion(currentUserId),
  });
};

const declineFriendRequest = async (currentUserId, friendUserId) => {
  const currentUserRef = doc(db, "users", currentUserId);

  await updateDoc(currentUserRef, {
    friendRequests: arrayRemove(friendUserId),
  });
};

const addFriendRequest = async (currentUserId, targetUserId) => {
  const targetUserRef = doc(db, "users", targetUserId);

  await updateDoc(targetUserRef, {
    friendRequests: arrayUnion(currentUserId),
  });
};

function GetColorFromScore(theNumber){
    if(theNumber < 0){
      return "bg-red-600/40"
    }

    if(theNumber < 300){
      return "bg-red-500/40"
    }


    if(theNumber < 500){
      return "bg-orange-500/40"
    }
  
    if(theNumber < 700){
      return "bg-yellow-600/40"
    }

    if(theNumber < 1000){
      return "bg-lime-600/80"
    }

    if(theNumber < 1500){
      return "bg-green-500/90"
    }

    if(theNumber < 1800){
      return "bg-teal-500/90"
    }

    if(theNumber < 2000){
      return "bg-teal-400/90"
    }
}

const getUserGames = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.error("User document does not exist.");
      return [];
    }

    const userData = userDoc.data();
    const matchHistory = userData.MatchHistory || [];

    const recentMatches = matchHistory.slice().reverse().slice(0, 8);

    return recentMatches.map((match, index) => {
      
      const theColor = GetColorFromScore(match.score);

      return (
        <div key={index} className={`flex flex-row w-full h-14 ${theColor} rounded-md justify-around items-center [text-shadow:_1px_2px_3px_var(--tw-shadow-color)] shadow-black`}>
          <div className="text-5xl uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-48 h-full">
            <div>{match.correctAnswers}</div>
            <div className="flex justify-center items-center text-lg ml-2 opacity-50">/10</div>
          </div>
          <div className="text-xl grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-64 h-full ">
            <div>{match.avgResponseTime}</div>
            <div className="flex justify-center items-center text-base ml-1 opacity-50">s</div>
          </div>
          <div className="text-3xl uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-64 h-full ">
            <div>{match.score}</div>
            <div className="flex justify-center items-center text-base ml-2 opacity-50">PTS</div>
          </div>
          <div className="text-xs grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-64 h-full ">
            <div className="flex justify-center items-center text-xs opacity-75 italic p-2 uppercase">
              <TimeAgo date={match.timestamp.toDate()} />
            </div>
          </div>
        </div>
      );
    });
  } catch (error) {
    console.error("Error fetching user games:", error);
    return [];
  }
};

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [currentUser] = useAuthState(auth);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [collectionSquares, setCollectionSquares] = useState([]);
  const [watchlistSquares, setWatchlistSquares] = useState([]);
  const [favoriteSquares, setFavoriteSquares] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isFriendRequestSent, setIsFriendRequestSent] = useState(false);
  const [recentMatchHistory, setRecentMatchHistory] = useState([]);
  const [isAlreadyFriend, setIsAlreadyFriend] = useState(false);
  const [IsEditingDescription, setIsEditingDescription] = useState(false);
  const [CommonCollectionOpened, setCommonCollectionOpened] = useState(false);
  const [commonCollectionMovieSquares, setCommonCollectionMovieSquares] =
    useState(false);
  const [commonWatchlistMovieSquares, setCommonWatchlistMovieSquares] =
    useState(false);
  const [CommonWatchlistOpened, setCommonWatchlistOpened] = useState(false);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", userId), (unsubDoc) => {
      const userData = unsubDoc.data();
      setUser(userData);
      setDescription(userData.description || "");

      if (currentUser) {
        const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
          const currentUserData = doc.data();
          setCurrentUserData(currentUserData);

          if (
            userData.friendRequests &&
            userData.friendRequests.includes(currentUser.uid)
          ) {
            setIsFriendRequestSent(true);
          }
          if (userData.friends && userData.friends.includes(currentUser.uid)) {
            setIsAlreadyFriend(true);
          }

          fetchCommonMovieSquares(
            currentUserData.collection,
            userData.collection
          ).then(setCommonCollectionMovieSquares);
          fetchCommonWatchlistSquares(
            currentUserData.watchlist,
            userData.watchlist
          ).then(setCommonWatchlistMovieSquares);
        });
      }

      const fetchData = async () => {
        const collection = await fetchCollectionSquares(userData.collection);
        setCollectionSquares(collection);

        const watchlist = await fetchWatchlistSquares(userData.watchlist);
        setWatchlistSquares(watchlist);

        const favorites = await fetchFavoriteSquares(userData.favorites);
        setFavoriteSquares(favorites);

        if (currentUser && currentUser.uid === userId) {
          const requests = await fetchPlaceholderFriendRequests(
            userData.friendRequests || []
          );
          setFriendRequests(requests);
        }

        const friendsList = await fetchFriends(userData.friends || []);
        setFriends(friendsList);

        const recentMatches = await getUserGames(userId);
        setRecentMatchHistory(recentMatches);
      };

      fetchData();
    });

    return () => unsubscribe();
  }, [userId, currentUser]);

  const handleAddFriend = async () => {
    if (currentUser) {
      await addFriendRequest(currentUser.uid, userId);
      setIsFriendRequestSent(true);
    }
  };

  const handleSaveDescription = async () => {
    if (currentUser && currentUser.uid === userId) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { description });
      setIsEditingDescription(false);
    }
  };

  if (!user || (currentUser && !currentUserData)) {
    return <div>Loading...</div>;
  }

  const userPhoto = user.photoURL.slice(0, -5) + "s256-c"; //This is a really really awfully bad way to get HQ images from google but whatever we ship in a week

  const collectionAmt = user.collection ? user.collection.length : 0;
  const watchlistAmt = user.watchlist ? user.watchlist.length : 0;
  const friendAmt = user.friends ? user.friends.length : 0;

  const currentUserCollectionAmt = currentUserData?.collection
    ? currentUserData?.collection.length
    : 0;

  const currentUserWatchlistAmt = currentUserData?.watchlist
    ? currentUserData.watchlist.length
    : 0;

  const currentUserRatedAmt = currentUserData?.rated
    ? currentUserData.rated.length
    : 0;

  const commonCollectionMovies = user?.collection
    ? user.collection.filter((movie) =>
        currentUserData.collection.includes(movie)
      ).length
    : 0;

  const commonWatchlistMovies = user.watchlist
    ? user.watchlist.filter((movie) =>
        currentUserData.watchlist.includes(movie)
      ).length
    : 0;

  const ratedAmt = "0";

  return (
    <div className="flex w-full items-center justify-end overflow-clip">

      {/*=======================================================================================================================================================*/}
      {/* MAIN SECTION */}
      {/*=======================================================================================================================================================*/}

      <div className="grid grid-cols-2 grid-rows-8 items-center justify-items-center h-auto overflow-y-auto overflow-x-hidden w-4/6 bg-black/40 backdrop-blur-2xl pt-28 pb-[4%]">
        {/*-------------------PROFILE TITLE DIV-------------------*/}
        <div className="flex flex-row col-span-2 w-[95%] h-full justify-around text-baseline items-center bg-black/30 rounded-xl">
          <div
            className="rounded-lg w-[20%] h-[87%] bg-cover bg-center m-2 self-center bg-red-500"
            style={{ backgroundImage: `url(${userPhoto})` }}
            alt={user.displayName}
          />

          <div className="relative flex flex-col h-full w-full justify-around items-center">
            <div className="text-7xl uppercase my-2">{user.displayName}</div>
            {IsEditingDescription ? (
              <div classname="flex flex-col items-center justify-evenly place-items-center content-center w-full h-full bg-green-500">
                <textarea
                  className="w-96 my-2 h-20 text-xs text-balance text-center text-white/80 bg-black/40 p-2 rounded-md resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  onClick={handleSaveDescription}
                  className="absolute bottom-2 right-2 flex justify-center items-center bg-green-500/60 hover:bg-green-500/90 transition duration-200 ease-out hover:scale-105 rounded-xl p-2 my-1 h-2 text-xs will-change-transform"
                >
                  Save Description
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-full h-full">
                <div className="text-sm my-1 h-24 text-balance text-center text-white/80">
                  {description}
                </div>
                {currentUser && currentUser.uid === userId && (
                  <button
                    onClick={() => setIsEditingDescription(true)}
                    className="absolute bottom-2 right-2 flex justify-center items-center bg-blue-500/30 hover:bg-blue-500/90 transition duration-200 ease-out hover:scale-105 rounded-sm p-2 my-1 h-2 text-xs will-change-transform"
                  >
                    Edit Description
                  </button>
                )}
              </div>
            )}

            <div className="text-sm text-white/10 my-2">
              Unique UID: {user.uid}
            </div>
          </div>

          <div className="flex flex-col rounded-lg w-[20%] h-[87%] bg-black/30 m-2 p-2">
            <div className="flex w-full flex-row justify-start">
              <div className="text-start self-start uppercase w-1/3 py-2">
                Friends
              </div>
              <div className="self-start uppercase text-center text-white/50 bg-black/30 p-1 my-1 mx-4 w-6 rounded-md">
                {friendAmt}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full h-1/3">{friends}</div>
            {currentUser && currentUser.uid !== userId && !isAlreadyFriend && (
              <div
                onClick={handleAddFriend}
                className={`flex my-2 justify-center items-center ${
                  isFriendRequestSent
                    ? "bg-gray-500"
                    : "bg-blue-500/60 hover:bg-blue-500/90"
                } rounded-xl h-1/3 w-full ${
                  !isFriendRequestSent &&
                  "hover:scale-110 transition duration-500 ease-out"
                } will-change-transform cursor-pointer`}
              >
                <div className="flex flex-row justify-center content-center items-center align-middle">
                  <div className="uppercase font-bold text-xs">
                    {isFriendRequestSent ? "Request Sent" : "Add friend"}
                  </div>
                  <AddFriend
                    className={`size-8 mx-2 ${
                      isFriendRequestSent ? "fill-gray-300" : "fill-white"
                    }`}
                  ></AddFriend>
                </div>
              </div>
            )}
          </div>
        </div>

        {/*-------------------USER FAVORITE MOVIES-------------------*/}
        <div className="flex flex-col items-center w-[70%] row-span-1 col-span-2 h-full">
          <div className="text-xl uppercase my-1">
            {user.displayName.split(" ")[0]}'s Favorite Movies
          </div>
          <div className="text-3xl h-full w-full bg-black/20 ring-2 ring-amber-300 shadow-[inset_0_10px_15px_rgba(0,0,0,0.6)] shadow-black rounded-xl p-4">
            <div className="grid grid-cols-4 grid-rows-1 gap-3 h-full w-full justify-around">
              {favoriteSquares}
            </div>
          </div>
        </div>

        {/*-------------------THE COLLECTIONS-------------------*/}
        <div className="flex flex-col items-center h-[95%] w-[95%] row-span-2 -mt-10">
          <div className="text-sm text-left self-start uppercase mb-2">
            {user.displayName.split(" ")[0]}'s Collection
          </div>
          <div className="text-3xl h-full w-full bg-black/30 rounded-xl p-4">
            <div className="grid grid-cols-5 grid-rows-2 gap-3 h-full w-full justify-around">
              {collectionSquares}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-around items-center h-[95%] w-[95%] row-span-2 -mt-10">
          <div className="text-sm text-right self-end uppercase mb-2">
            {user.displayName.split(" ")[0]}'s WatchList
          </div>
          <div className="text-3xl h-full w-full bg-black/30 rounded-xl p-4">
            <div className="grid grid-cols-5 grid-rows-2 gap-3 h-full w-full justify-around">
              {watchlistSquares}
            </div>
          </div>
        </div>

        {/*-------------------STATISTICS PANEL-------------------*/}
        
          {currentUser && currentUser.uid === userId ? (
            <div className="flex flex-col col-span-2 row-span-1 items-center self-center w-[95%] justify-center text-3xl overflow-hidden">
            <div className="flex flex-col items-stretch w-[95%] justify-around text-3xl">
              {DisplayValue("MOVIES IN YOUR COLLECTION", collectionAmt)}
              {DisplayValue("MOVIES IN YOUR WATCHLIST", watchlistAmt)}
              {DisplayValue("MOVIES YOU'VE RATED", collectionAmt)}
            </div>
            </div>
          ) : (
            <div className="flex flex-col col-span-2 row-span-2 items-center self-center w-[95%] justify-center text-3xl overflow-hidden">
            <div className="flex flex-col items-stretch w-[95%] justify-around text-3xl">
              <div className="flex flex-row justify-evenly items-center w-full bg-gradient-to-r from-green-900/30 to-red-900/30 via-black/50 rounded-md uppercase m-2">
                <div className="flex justify-center items-center rounded-xl w-24 text-xl">
                  you
                </div>
                <div className="flex justify-center items-center w-2/3 rounded-xl">
                  vs.
                </div>
                <div className="flex justify-center items-center rounded-xl w-24 text-xl">
                  {user.displayName.split(" ")[0]}
                </div>
              </div>

              {DisplayValueVersus(
                currentUserCollectionAmt,
                "MOVIES IN COLLECTION",
                collectionAmt
              )}
              {DisplayValueVersus(
                currentUserWatchlistAmt,
                "MOVIES IN WATCHLIST",
                watchlistAmt
              )}
              {DisplayValueVersus(
                currentUserCollectionAmt,
                "MOVIES RATED",
                collectionAmt
              )}

              <button
                key="toggleCollection"
                className="flex justify-center items-center hover:scale-110  bg-white/0 hover:bg-white/10 rounded-xl w-[95%] h-full transition duration-500 ease-out will-change-transform"
                onClick={() =>
                  setCommonCollectionOpened(!CommonCollectionOpened)
                }
              >
                {DisplayValue(
                  "COMMON COLLECTION MOVIES",
                  commonCollectionMovies
                )}
              </button>

              {
                <div
                  className={`grid grid-cols-10 gap-5 grid-flow-row justify-center items-center text-center w-[95%] ${
                    CommonCollectionOpened
                      ? "h-32 opacity-100"
                      : "opacity-0 text-white/0 bg-black/0 h-0"
                  } transition-all duration-700 ease-out bg-black/40 rounded-md p-2`}
                >
                  {commonCollectionMovieSquares}
                </div>
              }

              <button
                key="toggleWatchlist"
                className="flex justify-center items-center hover:scale-110 bg-white/0 hover:bg-white/10 rounded-xl w-[95%] h-full transition duration-500 ease-out will-change-transform"
                onClick={() => setCommonWatchlistOpened(!CommonWatchlistOpened)}
              >
                {DisplayValue("COMMON WATCHLIST MOVIES", commonWatchlistMovies)}
              </button>

              {
                <div
                  className={`grid grid-cols-8 gap-5 grid-flow-row justify-center items-center text-center w-[95%] ${
                    CommonWatchlistOpened
                      ? "h-32 opacity-100"
                      : "opacity-0 text-white/0 bg-black/0 h-0"
                  } transition-all duration-700 ease-out bg-black/40 rounded-md p-2`}
                >
                  {commonWatchlistMovieSquares}
                </div>
              }
            </div>
            </div>
          )}
        
        {/*-------------------USER MATCH HISTORY-------------------*/}
        <div className="flex flex-col items-center w-full row-span-3 col-span-2 h-full">
          <div className="text-xl uppercase my-1">
            {user.displayName.split(" ")[0]}'s Match History
          </div>
          <div className="text-3xl h-full w-full rounded-xl p-4">
            <div className="flex flex-col gap-1 w-full justify-center items-center p-3 bg-black/30 rounded-md mx-auto text-center">
              <div className="flex flex-row w-full h-16 bg-black/30 rounded-md justify-evenly items-center">
                <div className="text-lg uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-48 h-full">
                  Correct Guesses
                </div>
                <div className="text-lg uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-64 h-full ">
                  Average time
                </div>
                <div className="text-lg uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-64 h-full ">
                  Score
                </div>
                <div className="text-lg uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-64 h-full ">
                  When
                </div>
              </div>
              {recentMatchHistory}
            </div>
          </div>
        </div>

        {/* Space for more stuff */}
      </div>

      {/*=======================================================================================================================================================*/}
      {/* FRIEND REQUEST SECTION */}
      {/*=======================================================================================================================================================*/}
      <div className="static w-1/6 h-full self-start pt-[6%] pb-[4%] px-4 overflow-clip">
        {currentUser && currentUser.uid === userId && (
          <div>
            <div className="flex flex-row mx-auto text-center pb-6 justify-evenly items-center">
              <div className="text-2xl">FRIEND REQUESTS</div>
              <div className="flex justify-center items-center w-8 h-8 fill-black/70 stroke-black/70 bg-slate-200/20 rounded-md transition duration-500 ease-out hover:text-white/80 hover:stroke-white/80 hover:fill-white/80 hover:brightness-150 hover:scale-110 will-change-transform">
                <SearchImage className="size-4 stroke-1"></SearchImage>
              </div>
            </div>
            {friendRequests}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
