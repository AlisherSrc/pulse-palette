import { getAuth } from "firebase/auth";
import { collection, documentId, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { Context } from "../App";

const useGetUserLikedDocs = (props) => {

    const { docName } = props;

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
                const q = query(collection(db, docName), where(documentId, 'in', filterArr));

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
    }, []);

    return [likedDocs,loading];
}


export default useGetUserLikedSongs;