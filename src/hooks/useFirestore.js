import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

const useFirestore = (collectionName) => {
    const [collectionList,setCollectionList] = useState([]);
    const [loading,setLoading] = useState(true);

    const collectionRef = collection(db,collectionName);

    const getCollectionList = async (ref) => {
        const adjustedList = [];

        try {
            const data = await getDocs(ref);

            data.forEach((doc) => {
                adjustedList.push({id: doc.id,...doc.data()});
            })
            setCollectionList(adjustedList);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCollectionList(collectionRef);

    },[]);

    return [collectionList,loading,getCollectionList];
}

export default useFirestore;