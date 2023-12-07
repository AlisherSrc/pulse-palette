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

                if(filterArr.length === 0){
                    console.log("Array is empty!")
                    setLikedDocs([]);
                    setLoading(false);
                    return;
                }
                const q = query(collection(db, docName), where(documentId(), 'in', filterArr));

                const docs = await getDocs(q);

                docs.forEach((document) => {
                    setLikedDocs([...likedDocs,
                    {
                        id: document.id,
                        ...document.data()
                    }]);
                })

                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        getDocuments();
    }, [customUser,docName]);

    return [likedDocs,loading];
}


export default useGetUserLikedDocs;