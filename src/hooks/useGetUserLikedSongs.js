import { getAuth } from "firebase/auth";
import { collection, documentId, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { Context } from "../App";

const useGetUserLikedDocs = (docName) => {
    const [loading, setLoading] = useState(false);
    const [likedDocs, setLikedDocs] = useState([]);
    const { customUser } = useContext(Context);

    let filterArr = [];


    if (docName === 'playlist') filterArr = customUser.favoritePlaylists
    else if (docName === 'song') filterArr = customUser.likedSongs

    useEffect(() => {
        const getDocuments = async () => {
            try {
                setLoading(true);
    
                if (filterArr.length === 0) {
                    console.log("Array is empty!");
                    setLikedDocs([]);
                    setLoading(false);
                    return;
                }
    
                const q = query(collection(db, docName), where(documentId(), 'in', filterArr));
                const querySnapshot = await getDocs(q);
                
                // Create an array from the query results
                const newLikedDocs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
    
                // Update the state once with all new documents
                setLikedDocs(newLikedDocs);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
    
        getDocuments();
    }, [customUser, docName]); // Dependencies
    
    console.log("LikedDocs", likedDocs);
    return [likedDocs, loading];
}


export default useGetUserLikedDocs;