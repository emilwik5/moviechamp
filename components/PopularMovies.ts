import { db } from "../firebase/clientApp";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { getMoviePosterUrl } from "./tmdb";

export async function getTopRatedMovies() {
    const q = query(collection(db, 'theMovies_lite'), where('average', '>=', 7), orderBy("average", "desc"), limit(16));
    const querySnapshot = await getDocs(q);
    const movies = [];

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

    return movies;
}
