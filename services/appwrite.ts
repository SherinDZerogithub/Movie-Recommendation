// track the searches made by a user
import { Client, Databases, ID } from "appwrite";
import { Query } from "appwrite";

import { Movie, TrendingMovie } from "@/interfaces/interface";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const USERS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) // Your Appwrite Endpoint
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // Your project ID

const database = new Databases(client);

//this is to update the database with what the user has search
export const updatSearchCount = async(query : string, movie : Movie ) => {

    try{

    const result = await database.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
        Query.equal('searchTearm', query)
    ])
    
    //check if a reord of that search has already been stored
    if(result.documents.length > 0){
        //this is the top movie that is searhced for that search term
        const existingMovie = result.documents[0];

        await database.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, existingMovie.$id, {
            count: existingMovie.count + 1,
        
        })
    }else {
        //this is a new document in db that stores the searches people have entered
        await database.createDocument(DATABASE_ID, USERS_COLLECTION_ID, ID.unique(), {
            searchTearm: query,
            movie_id: movie.id,
            title: movie.title,
            count: 1,
            poster_url : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        })
    }
}catch(error){
    console.error("Error updating search count:", error);
}
    // if a document is found increment thee searchCount field
    //if not - create a new document in Appwrite Database with initial searchCount = 1
}

export const getTrendingMovies = async(): Promise<TrendingMovie[] | undefined> => {
    try {
          const result = await database.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
        //so we onl wanna get the first 5 elements
            Query.limit(5),
            //we only wanna show the top 5 movies people have search for sorted by the count
            Query.orderDesc('count'),
        ])
        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
       console.log(error)       
    }
}