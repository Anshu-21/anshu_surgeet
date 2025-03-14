const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteTracksCollectionId: String(
      import.meta.env.VITE_APPWRITE_COLLECTION_ID
    ),
    appwriteTracksCollectionId: String(
      import.meta.env.VITE_APPWRITE_SONGS_COLLECTION_ID
    ),
    appwritePlaylistsCollectionId: String(
      import.meta.env.VITE_APPWRITE_PLAYLISTS_COLLECTION_ID
    ),
    appwriteReactionsCollectionId: String(
      import.meta.env.VITE_APPWRITE_FAVOURITES_COLLECTION_ID
    ),
    appwriteRecordingsCollectionId: String(
      import.meta.env.VITE_APPWRITE_RECORDINGS_COLLECTION_ID
    ),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  };
  
  export default conf;
  