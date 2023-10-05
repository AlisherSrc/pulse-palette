import { useState } from "react";
import styles from "./playlistBuilder.module.css";
import { getDownloadURL, getMetadata, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";


// It should display user's not uploaded songs, we can do so by the userID field of songs
const PlaylistBuilder = () => {
    const [audioName, setAudioName] = useState('');
    const [imageFile,setImageFile] = useState(null);

    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');

    const [songs,setSongs] = useState([]); //list of files

    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };


    const getAudioDuration = (file) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
    
        return new Promise((resolve) => {
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
            });
        });
    };



    // This func. just uplaods the file to the array(and creates song doc if we wanna save user's data)
    const handleAudioUpload = async (event) => {
        const file = event.target.files[0];

        const fileName = file.name;
        const fileDuration = await getAudioDuration(file);
        const fileData = file;
        // we have all data

        // console.log(fileName,fileDuration,fileData);

        const storageRef = ref(storage,`audio/${fileName}`);
        // We upload it first
        uploadBytes(storageRef,fileData).then((snapshot) => {
            console.log("Uploaded!")
        }).catch((error) => console.log(error));
        // It gots uploaded and we can now retrieve its url to create a song document for this 

        setSongs([{
            name: fileName,
            path: `audio/${fileName}`,
        },...songs])
    }

    const createPlaylist = async () => {
        // For each song we have playlistID field which refers to the playlist they are in
        const playlistID = generateRandomString(16);

        for (const song of songs) {
            const songID = generateRandomString(16);
            const songRef = ref(storage, song.path);
    
            try {
                const songUrl = await getDownloadURL(songRef);
                const updatedSong = { ...song, songUrl };
    
                await setDoc(doc(db, "song", songID), {
                    image: "",
                    name: updatedSong.name,
                    playlistID: playlistID,
                    singer: "",
                    songFile: updatedSong.songUrl
                });
    
                console.log("Song created:", updatedSong.name);
            } catch (error) {
                console.error("Error creating song:", error);
            }
        }
        // When user registers to our system, it will auromatically create playlist for it
        await setDoc(doc(db,"playlist",playlistID),{
            description: description,
            groupID: "userCreatedPlaylistGroupTest",
            imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/82/High_Hopes_%28White_Panda_Remix%29.jpg",
            public: true,
            title: title
            // Later we need to add a userId to it
        }).then((snapshot) => console.log("Playlist " + playlistID + " created"))
        .catch((error) => console.log(error));
    }

// Song:
// image url
// name string
// playlistID string
// singer string
// songFile file

// Playlist
// description(string)
// groupID(string)
// imageUrl(string)
// public(boolean)
// title(string)
// userID

const handleTitleChange = (event) => {
    setTitle(event.target.value);
}

const handleDesChange = (event) => {
    setDescription(event.target.value);
}
    return (<>
        <div>
            <p>Create your playlist</p>
            <form>
                <input type="text" placeholder="Title" onChange={handleTitleChange}/>
                <input type="text" placeholder="Short description" onChange={handleDesChange}/>
            </form>
            <div>
                {songs.map((song) => (
                    <form key={song.imageUrl}>
                        <input type="text"  placeholder="Audio name"/>
                        <input type="file"/>
                    </form>
                ))}
                <form>
                    <input type="file" onChange={handleAudioUpload}/>
                </form>

                <button onClick={createPlaylist}>Create</button>
            </div>
        </div>
    </>)
}

export default PlaylistBuilder;