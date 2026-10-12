//tmdb.ts
'use server'

export async function getMoviePosterUrl(movieId: number, resolution: number = 780): Promise<string | undefined> {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=images`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                },
            }
        );
        const data = await res.json();
        
        //console.log(data);

        const posterPath = data.poster_path as string;
        //console.log(posterPath);
        
        if (!posterPath) {
            throw new Error('Poster path is undefined');
        }
        
        return `https://image.tmdb.org/t/p/w${resolution}${posterPath}`;
    } catch (error) {
        console.error('Failed to fetch movie poster:', error);
        return undefined;
    }
}

export async function getMovieBackdropUrl(movieId: number, resolution: number = 780): Promise<string | undefined> {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=images`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                },
            }
        );
        const data = await res.json();
        
        //console.log(data);

        const backdropPath = data.backdrop_path as string;
        //console.log(posterPath);
        
        if (!backdropPath) {
            throw new Error('Poster path is undefined');
        }
        
        return `https://image.tmdb.org/t/p/w${resolution}${backdropPath}`;
    } catch (error) {
        console.error('Failed to fetch movie poster:', error);
        return undefined;
    }
}
