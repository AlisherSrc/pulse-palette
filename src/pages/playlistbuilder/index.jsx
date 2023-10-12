import { useRef, useState } from "react";
import styles from "./playlistBuilder.module.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import Button from "../../components/button";

// It should display user's not uploaded songs, we can do so by the userID field of songs
const PlaylistBuilder = () => {
    // Song fields
    const [audioName, setAudioName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [singer, setSinger] = useState('');
    // Playlist fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setPublic] = useState(true);

    const [songs, setSongs] = useState([]); //list of files

    const [isAudioLoading,setAudioLoading] = useState(false);

    const songFormRef = useRef();

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

    const handleAudioUpload = async (event) => {
        const file = event.target.files[0];
        setAudioFile(file);
        const fileDuration = await getAudioDuration(file);
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
    };

    const createPlaylist = async () => {

        if(!title || !description || songs.length === 0){
            alert("Please,fill all feilds and upload at least 1 audio file");
            return;
        }

        // For each song we have playlistID field which refers to the playlist they are in
        const playlistID = `${title}${generateRandomString(16)}`;

        for (const song of songs) {
            const songID = generateRandomString(16);
            try {
                await setDoc(doc(db, "song", `${song.name}${songID}`), {
                    image: song.imageUrl,
                    name: song.name,
                    playlistID: playlistID,
                    singer: song.singer,
                    songFile: song.songUrl
                });

                console.log("Song created:", song.name);
            } catch (error) {
                console.error("Error creating song:", error);
            }
        }
        // When user registers to our system, it will auromatically create playlist for it
        await setDoc(doc(db, "playlist", playlistID), {
            description: description,
            groupID: "userCreatedPlaylistGroupTest",
            imageUrl: songs[0].imageUrl,
            public: isPublic,
            title: title
            // Later we need to add a userId to it
        }).then((snapshot) => console.log("Playlist " + playlistID + " created"))
            .catch((error) => console.log(error));
    }

    const handleSongSubmit = (event) => {
        event.preventDefault();

        if (!audioFile || !audioName || !imageFile || !singer) {
            alert("Fill all fields please");
            return;
        }
        console.log(audioFile.name);
        console.log(imageFile.name);

        // Making references to the path where they will be uploaded
        const audioStorageRef = ref(storage, `audio/${audioFile.name}${generateRandomString(5)}`);
        const imageStorageRef = ref(storage, `songImages/${imageFile.name}${generateRandomString(5)}`);

        setAudioLoading(true);
        // Upload audio and image
        Promise.all([
            uploadBytes(audioStorageRef, audioFile),
            uploadBytes(imageStorageRef, imageFile)
        ]).then((snapshot) => {
            console.log("Image and Audio has been uploaded!");
            // get uploaded audio and image url
            return Promise.all([
                getDownloadURL(audioStorageRef),
                getDownloadURL(imageStorageRef)
            ])
        }).then((urls) => {
            // url[0] - audioUrl
            // url[1] - imageUrl

            setSongs([{
                name: audioName,
                imageUrl: urls[1],
                songUrl: urls[0],
                singer: singer
            }, ...songs]);

            setAudioLoading(false);
        }).catch((error) => console.log(error));

        songFormRef.current.reset();

        setAudioName('');
        setSinger('');
        setImageFile(null);
        setAudioFile(null);
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

    const handleAudioTitle = (event) => {
        setAudioName(event.target.value);
    }

    const handleSingerChange = (event) => {
        setSinger(event.target.value);
    }

    const handlePublicChange = (event) => {
        setPublic(event.target.checked)
    }

    return (<>
        <div className={`${styles.builder}`}>
            <p>Create your playlist</p>
            <form className={`${styles.playlistForm}`}>
                <input type="text" placeholder="Title" onChange={handleTitleChange} />
                <input type="text" placeholder="Short description" onChange={handleDesChange} />
                <label>Public</label>
                <input type="checkbox" onChange={handlePublicChange} />
            </form>
            <form className={`${styles.songForm}`} ref={songFormRef} onSubmit={handleSongSubmit}>
                <input type="text" placeholder="Audio name" onChange={handleAudioTitle} />
                <input type="text" placeholder="Singer/Group" onChange={handleSingerChange} />
                <label>Audio image</label>
                <input id="audioImage" type="file" accept="image/*" placeholder="Audio image" onChange={handleImageUpload} />
                <label>Audio file</label>
                <input id="audioFile" type="file" accept="audio/*" onChange={handleAudioUpload} />
                <button type="submit">Add</button>
            </form>
            <div className={`${styles.songs}`}>
                {isAudioLoading && <p>Uploading...</p>}
                {songs.length !== 0 && songs.map((song, i) => (
                    <div key={song.songUrl} className={`${styles.songDisplayed}`}>
                        <p>{i + 1}</p>
                        <hr />
                        <div className={`${styles.songDisplayed__data}`}>
                            <p>{song.name}</p>
                            <p>{song.singer}</p>
                            <audio preload controls>
                                <source src={song.songUrl} type="audio/mp3" />
                                    Your browser does not support the audio element.
                                
                            </audio>
                            <img src={song.imageUrl} />
                        </div>
                    </div>
                ))}

                {songs.length !== 0 && console.log(songs[0].imageUrl)}
            </div>
            <Button text="Create" onClick={createPlaylist} medium />
        </div>
    </>)
}

export default PlaylistBuilder;