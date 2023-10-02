import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

const useFirestore = (collectionName) => {
    const [collectionList,setCollectionList] = useState([]);
    const [loading,setLoading] = useState(true);

    const collectionRef = collection(db,collectionName);


    useEffect(() => {
        let adjustedList = [];

        const getCollectionList = async () => {
            try {
                const data = await getDocs(collectionRef);

                data.forEach((doc) => {
                    adjustedList.push(doc.data());
                })

                setCollectionList(adjustedList);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        getCollectionList();
    },[]);

    return {collectionList,loading};
}

export default useFirestore;