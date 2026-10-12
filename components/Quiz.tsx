'use client'
import React, { useEffect, useState, useCallback, useRef } from "react";
import { db } from "../firebase/clientApp"; 
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getMoviePosterUrl } from "./tmdb"; 
import { Outfit } from 'next/font/google';
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import LoadingSpinner from "../public/SVGS/loading.svg";
import RandomizedTip from "./randomizedTips";
import RandomizedParagraph from "./randomizedFlavortext";
import ShareSymbol from "../public/SVGS/share-square.svg";
import ReplaySymbol from "../public/SVGS/rotate-right.svg";

//Tailwind JIT-compilation fix
const widthPercentageClasses = [
  "w-[0%]",
  "w-[10%]",
  "w-[20%]",
  "w-[30%]",
  "w-[40%]",
  "w-[50%]",
  "w-[60%]",
  "w-[70%]",
  "w-[80%]",
  "w-[90%]",
  "w-[100%]",
];

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  weight: "800",
});

interface MovieData {
  id: number;
  title: string;
  tagline: string;
  release_date: string;
  poster_url?: string;
  keywordNames: string[];
  castNames: string[];
}

type QuizType = 'tagline' | 'release_date' | 'keywords' | 'cast';

const theQuestions : string[] = [];
const theCorrectAnswers : string[] = [];
const theUserAnswers : string[] = [];
const theScores : string[] = [];
const theTimes : number[] = [];

const Quiz: React.FC = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<{ type: QuizType; question: string; quizOptions: MovieData[]; correctAnswer: string } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0); // Timer state
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Reference to the timer interval
  const [corrAns, setCorrectAnswers] = useState<number>(0);

  const hasFetchedMovies = useRef(false); // Ref to prevent double fetching
  const hasSavedMatch = useRef(false); // Ref to ensure match is saved only once

  let scoreCorrectBase = 100;
  let scoreCorrect = 0;
  let scoreWrongBase = -30;
  let scoreWrong = 0;

  function calculateAverageTime(times: number[]){
    let result = 0;

    for(let i = 0; i < times.length; i++){
      result += times[i];
    }

    return Math.round((result/times.length)*100)/100;
  }

  function GenerateResults() {
    const result = [];
    let timeText = "";
  
    for(let i = 0 ; i < theQuestions.length; i++){
      
      if(theTimes[i] != undefined){ 
        timeText = theTimes[i].toString();
      }
      
      result.push(
      <div key={i} className={`flex flex-row w-full h-10 ${theUserAnswers[i] === theCorrectAnswers[i] ? "bg-green-600/40" : "bg-red-600/30"} rounded-lg justify-around items-center`}>
        <div className="text-xs grow-0 shrink-0 text-ellipsis text-balance overflow-hidden uppercase flex justify-center items-center p-2  h-full  w-8  ">{i+1}</div>
        <div className="text-xs grow-0 shrink-0 text-ellipsis text-balance overflow-hidden uppercase flex justify-center items-center p-2  h-full  w-64 ">{theQuestions[i]}</div>
        <div className="text-xs grow-0 shrink-0 text-ellipsis text-balance overflow-hidden uppercase flex justify-center items-center p-2 h-full   w-64 ">{theUserAnswers[i]}</div>
        <div className="text-xs grow-0 shrink-0 text-ellipsis text-balance overflow-hidden uppercase flex justify-center items-center p-2 h-full   w-64 ">{theCorrectAnswers[i]}</div>
        <div className="text-sm grow-0 shrink-0 text-ellipsis text-balance overflow-hidden flex justify-center items-center p-2   h-full           w-12 ">{timeText}s</div>
        <div className="text-sm grow-0 shrink-0 text-ellipsis text-balance overflow-hidden uppercase flex justify-center items-center p-2 h-full   w-12 ">{theScores[i]}</div>
      </div>
    )
      
    }
  
    return result;
  }

  

  const fetchMovies = async () => {
    try {
      const movieQuery = collection(db, "theMovies_lite");
      const querySnapshot = await getDocs(movieQuery);
      const moviesData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const movie = doc.data() as MovieData;
          const posterUrl = await getMoviePosterUrl(movie.id, 154);
          return { ...movie, poster_url: posterUrl };
        })
      );

      // Shuffle and select 40 random movies
      const shuffledMovies = moviesData.sort(() => 0.5 - Math.random());
      const selectedMovies = shuffledMovies.slice(0, 40);

      const filteredMoviesData = selectedMovies.filter(movie => movie.tagline.trim() !== "");
      if (filteredMoviesData.length > 0) {
        setMovies(filteredMoviesData);
        const quiz = generateQuiz(filteredMoviesData);
        setCurrentQuiz(quiz);
        startTimer();
      } else {
        console.log("No movies found in the database.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer + 0.005);
    }, 5);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const generateQuiz = useCallback((movies: MovieData[]) => {
    const randomMovies = getRandomMovies(movies, 4);
    const randomIndex = Math.floor(Math.random() * randomMovies.length);
    const correctMovie = randomMovies[randomIndex];
    const quizOptions = randomMovies.map(movie => movie);
    for (let i = quizOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quizOptions[i], quizOptions[j]] = [quizOptions[j], quizOptions[i]];
    }

    const quizTypes: QuizType[] = ['tagline', 'release_date', 'keywords', 'cast'];
    const selectedQuizType = quizTypes[Math.floor(Math.random() * quizTypes.length)];
    let question = '';

    if (selectedQuizType === 'tagline') {
      question = '"' + correctMovie.tagline + '"';
    } else if (selectedQuizType === 'release_date') {
      question = `Released ${correctMovie.release_date}`;
    } else if (selectedQuizType === 'keywords') {
      question = correctMovie.keywordNames.slice(0, 3).join(', ');
    } else if (selectedQuizType === 'cast') {
      question = correctMovie.castNames.slice(0, 3).join(', ');
    }

    const correctAnswer = correctMovie.title;

    theQuestions.push(question);
    theCorrectAnswers.push(correctAnswer);

    return {
      type: selectedQuizType,
      question: question,
      quizOptions: quizOptions,
      correctAnswer: correctAnswer
    };
  }, []);

  const getRandomMovies = (movies: MovieData[], num: number) => {
    const shuffled = [...movies];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, num);
  };

  const handleOptionSelect = (option: string) => {
    if (selectedOption !== null) return; // Prevent multiple selections

    setSelectedOption(option);
    setCorrectOption(currentQuiz?.correctAnswer || null);

    theUserAnswers.push(option);
    theTimes.push((Math.round(timer*100)/100)); // Record the time taken to answer the question
    stopTimer(); // Stop the timer

    if (option === currentQuiz?.correctAnswer) {
      setResult("Correct!");
      scoreCorrect = Math.round(scoreCorrectBase*(1 + 0.741*Math.pow(Math.E,-0.3*(timer-1)))); //Very complicated formula to calculate scores based on speed
      console.log(timer + "seconds, which gives a score of:" + scoreCorrect);

      setScore(score + scoreCorrect);
      setCorrectAnswers(corrAns + 1);
      theScores.push((scoreCorrect).toString());
    } else {
      setResult("Wrong answer.");
      scoreWrong = Math.round(scoreWrongBase*(1 + 0.741*Math.pow(Math.E,-0.3*(timer-1)))); 
      setScore(score + scoreWrong);
      theScores.push((scoreWrong).toString());
    }
  };

  const handleNextQuiz = () => {
    if (round >= 10) {
      setCurrentQuiz(null);
      return;
    }

    setSelectedOption(null);
    setResult(null);
    setRound(prevRound => prevRound + 1);
    if (movies.length > 0) {
      const quiz = generateQuiz(movies);
      setCurrentQuiz(quiz);
      startTimer(); 
    }
  };

  const saveMatch = async (score: number, correctAnswers: number, avgResponseTime: number) => {
    if (hasSavedMatch.current) return; // Ensure match is saved only once
    hasSavedMatch.current = true;

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error("No user is currently logged in.");
        return;
      }

      const userId = user.uid;
      const userRef = doc(db, "users", userId);
      const matchHistory = {
        score,
        correctAnswers,
        avgResponseTime,
        timestamp: new Date()
      };

      await updateDoc(userRef, {
        MatchHistory: arrayUnion(matchHistory)
      });

      console.log("Match history saved successfully.");
    } catch (error) {
      console.error("Error saving match history:", error);
    }
  };


  useEffect(() => {
    if (!hasFetchedMovies.current) {
      hasFetchedMovies.current = true;
      void fetchMovies();
    }
    return () => stopTimer();
  }, []);

  useEffect(() => {
    if (!loading && !currentQuiz && round >= 10) {
      void saveMatch(score, corrAns, calculateAverageTime(theTimes));
    }
  }, [loading, currentQuiz, round, score, corrAns]);

  const JustPlayedQuestions = GenerateResults();

  // [================================={ LOADING SCREEN }================================]

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center text-center pt-28">
        <div></div>
        <div className="flex flex-row gap-10 justify-center items-center uppercase text-6xl italic mb-3">
          <LoadingSpinner className="w-16 h-16 animate-spin fill-white"></LoadingSpinner>
          <div>Generating Your Quiz...</div>
        </div>
        <RandomizedTip />
      </div>
    );
  }

  // [================================={ QUIZ COMPLETE SCREEN }=================================]
  if (!currentQuiz) {
    const avgResponseTime = calculateAverageTime(theTimes);


    return (
      <div className="w-screen h-screen pt-24">
        <div className="relative w-1/2 flex flex-col justify-center items-center h-1/7 mx-auto">
          <div className="flex flex-row justify-between items-center m-2 text-center w-full">
            <div className="relative flex flex-row justify-center items-center m-3 p-3 h-24 bg-black/30 rounded-lg">
              <div className="absolute top-0 text-md uppercase italic text-white/40">
                Final score:
              </div>
              <div className="flex flex-row justify-center items-center absolute bottom-0 text-lg uppercase text-white/40">
                <div>
                  / 2000
                </div>
                <div className="text-xs ml-1">
                  PTS
                </div>
              </div>
              <div className="text-5xl ml-3 mr-1">
                {score}
              </div>
              <div className="text-lg uppercase">
                pts
              </div>
            </div>
            <div className="italic text-6xl uppercase [text-shadow:_1px_2px_3px_var(--tw-shadow-color)] shadow-black">
            Quiz Complete!
            </div>
            <RandomizedParagraph score={corrAns} />
            <div className="flex flex-row justify-center items-center m-3 text-7xl bg-black/30 p-3 pl-4 h-24 rounded-lg">
              {corrAns} 
              <div className="text-4xl ml-4 text-white/40">/10</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-1/2 justify-center items-center p-3 bg-black/30 rounded-md mx-auto text-center">
          <div className="flex flex-row w-full h-16 bg-black/30 rounded-md justify-around items-center">
            <div className="text-lg uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-8  h-full">#</div>
            <div className="text-lg uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-64 h-full ">Question</div>
            <div className="text-lg uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-64 h-full ">Your answer</div>
            <div className="text-lg uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-64 h-full ">Correct answer</div>
            <div className="text-md uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-12 h-full ">Time</div>
            <div className="text-md uppercase grow-0 shrink-0 text-ellipsis overflow-hidden flex justify-center items-center p-4 w-12 h-full ">Score</div>
          </div>
          {JustPlayedQuestions}
        </div>
        <div className="flex justify-center items-center m-3 mx-auto py-2 w-1/3 h-16 text-center text-white/30 text-xs text-balance">
          <div>
            * Scores are calculated based on getting the question right, and subsequently weighted given the time it took to answer the question.
            In the most technical sense the maximum possible score on one given question is 200pts - yielding a possible 2000pts per quiz.
          </div>
        </div>
        <div className="flex flex-row justify-between items-center m-5 gap-12 w-1/2 mx-auto pb-12">
          <div className="group flex flex-row justify-center items-center w-1/4 h-16 bg-green-700 text-center rounded-xl cursor-pointer transition hover:brightness-125 hover:scale-105 duration-300 ease-out will-change-transform" onClick={() => window.location.reload()}>
            <ReplaySymbol className="size-6 fill-white mx-3 group-hover:rotate-180 transition-all duration-500 ease-in-out"/>
            <div>Regenerate Quiz</div>
          </div>
          <div className="group flex flex-row justify-center items-center w-1/4 h-16 bg-teal-500 text-center rounded-xl cursor-pointer transition hover:brightness-125 hover:scale-105 duration-300 ease-out will-change-transform">
            <ShareSymbol className="size-6 fill-white mx-3"/>
            <div>Share</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      <div className={`${outfit.className} text-center m-2 pt-28`}>
        <h2 className="text-lg mb-2 uppercase text-white/40 ">Guess the Movie:</h2>
        <div className="flex justify-center items-center text-center italic text-2xl uppercase text-balance w-1/2 mx-auto">
          <div>{currentQuiz.question}</div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-5 my-5">
          {currentQuiz.quizOptions.map(option => (
            <motion.div
              key={option.title}
              onClick={() => handleOptionSelect(option.title)}
              className={`flex flex-col gap-4 bg-black/10 w-64 h-80 justify-center items-center cursor-pointer p-5 text-center backdrop-blur-xl transition hover:scale-110 ease-out duration-700 hover:ring-2 hover:ring-blue-300 rounded-xl hover:bg-black/30 ${selectedOption ? 'pointer-events-none' : ''} ${
                selectedOption && option.title === correctOption ? 'border-4 scale-125 z-30 border-green-500 shadow-[0_0px_80px_-15px_rgba(100,255,100,0.7)]' : 
                selectedOption && option.title === selectedOption ? 'border-4 scale-95 border-red-500 shadow-[0_0px_50px_-15px_rgba(255,70,70,1.0)]' : ''
              }`}
            >
              {option.poster_url ? (
                <img src={option.poster_url} alt={option.title} className="w-40 h-56 object-cover rounded-lg" />
              ) : (
                <div className="w-40 h-56 bg-gray-300 rounded-lg flex items-center justify-center">
                  No Image
                </div>
              )}
              <p className="flex justify-center items-center uppercase text-xs text-balance mt-2 text-center w-2/3">{option.title}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10">
          {result && <p className="text-4xl">{result}</p>}
          {result === "Wrong answer." && (
            <p className="text-sm mt-2">The correct answer was: {currentQuiz.correctAnswer.toUpperCase()}</p>
          )}
          {result && (
            <button onClick={handleNextQuiz} className="py-2 px-4 w-1/4 bg-green-500 text-white rounded mt-3 hover:bg-green-600 transition ease-out hover:scale-110">
              Next Question
            </button>
          )}
        </div>
        <div className="absolute flex flex-row top-20 left-2 mt-5 uppercase text-center justify-center items-center">
          <p>Round: </p>
          <p className="text-3xl text-emerald-300 mx-3">{round}</p>
          <p> / 10</p>
        </div>

        <div className="absolute flex flex-row top-20 right-2 mt-5 uppercase text-center justify-center items-center">
          <p>Score: </p>
          <p className={`text-3xl ${score < 0 ? "text-red-600 animate-pulse" : "text-4xl text-emerald-500"} text-emerald-300 mx-3`}>{score}</p>
        </div>
      </div>
      <div className={`absolute bottom-0 h-4 ${widthPercentageClasses[round]} bg-green-400/60 transition-all duration-1000 ease-in-out`}></div>
    </div>
  );
};

export default Quiz;
