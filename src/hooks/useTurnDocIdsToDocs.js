import { collection, documentId, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

const useTurnDocIdsIntoDocs = (props) => {
    const resDocs = [];
    const [ids, docName] = props;
    
    const getDocuments = async () => {
        try {

            const q = query(collection(db, docName), where(documentId(), 'in', ids));

            const docs = await getDocs(q);

            docs.forEach((doc) => {
                resDocs.push({id:doc.id,...doc.data()});
            })
        } catch (err) {
            console.log(err);
        }
    }

    getDocuments();
    console.log(resDocs);
    return [resDocs]
}

export default useTurnDocIdsIntoDocs;