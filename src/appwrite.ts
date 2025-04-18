import { Client, Databases, ID, Query } from "appwrite";

export interface AppwriteMovie {
  id: string;
  poster_path?: string;
  title?: string;
}

export interface SearchDocument {
  $id?: string;
  searchTerm: string;
  count: number;
  movie_id: string;
  poster_url?: string;
}

const DATABASE_ID: string = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID: string = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const COLLECTION_ID: string = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (
  searchTerm: string,
  movie: AppwriteMovie
): Promise<void> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);
    
    if (result.documents.length > 0) {
      const doc = result.documents[0] as unknown  as SearchDocument;
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id!, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
          : undefined,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getTrendingMovies = async (): Promise<SearchDocument[]> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(5), Query.orderDesc("count")]
    );
    return result.documents as unknown as SearchDocument[];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};