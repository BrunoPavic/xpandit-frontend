export interface MovieDto{
    id: string;
    title: string;
    date: string;
    rating: number;
    revenue: number;
}

export interface MovieDetailsDto{
    id: string;
    title: string;
    date: string;
    rating: number;
    revenue: number;
    genres: GenreDto[];
    actors: ActorDto[];
    director: DirectorDto;
    runtime: number;
    votes: number;
    description: string;
}

export interface GenreDto{
    id: number;
    name: string;
}

export interface ActorDto{
    id: number;
    fullName: string;
}

export interface DirectorDto{
    id: number;
    fullName: string;
}