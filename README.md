# Moviechamp

## Description

Project developed and designed by Emil Wik and Victor Persson.

### Slogan

> **It's like a combination of Kahoot, Letterboxd and a whole lot of fun**

### Project Idea

The project is a realtime multiplayer quiz game where a user can create an account and play against other players in a variety of movie quizzes. The quizzes will be contained to "sessions" with up to 30 users.

The user can add their favorite movies to their profile and rate them, so that more personalized quizzes can be created. The users can also add their friends and create quiz sessions. Users can also reate their own quizzes and allow the community to vote and participate with eachother.

Statistics, achievements, and other user data will be stored and displayed in the users profile for bragging rights, trends, and interesting insights.

## Technical specification

The frontend uses **Next.js, React, TypeScript and Tailwind CSS**. **Node.js** runs the Next.js server. **Framer Motion** and **tsParticles** are used for animations and visual effects.

The backend uses **Firebase Authentication** for Google sign-in and **Cloud Firestore** for movies, profiles, lists, friends and quiz results. Next.js server functions fetch movie images from the **TMDB API**.
