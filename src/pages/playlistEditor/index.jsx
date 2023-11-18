import { useEffect, useRef, useState } from "react";
import styles from "./playlistEditor.module.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { Timestamp, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { generateRandomString } from "../../tools/generateRandomStr";
import upload_image from '../../../public/image-upload.svg';
import upload_music from '../../../public/music-upload.svg';
import trashcan from '../../images/trashcan.svg';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import Button from "../../components/button";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";

const PlaylistEditor = () => {

    const { id } = useParams();

    const [playlist, setPlaylist] = useState();
    const [songs, setSongs] = useState();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setPublic] = useState();
    // Song fields
    const [audioName, setAudioName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [singer, setSinger] = useState('');

    const [loading, setLoading] = useState(true);

    const songFormRef = useRef();
    const auth = getAuth();


    // For editing
    const [audioEditName, setAudioEditName] = useState("");
    const [audioEditSinger, setAudioEditSinger] = useState("");

    useEffect(() => {


        const getDocument = async () => {
            const songsRes = [];

            try {
                setLoading(true);



                const playlistDoc = await getDoc(doc(db, "playlist", id));
                if (auth.currentUser.email !== playlistDoc.data().userEmail) {
                    alert("You have no access to edit this playlist");
                    return;
                }

                const q = query(collection(db, "song"), where("playlistID", '==', id));
                const songs = await getDocs(q);
                // name: audioName,
                // imageUrl: urls[1],
                // songUrl: urls[0],
                // singer: singer
                songs.forEach((song) => {
                    songsRes.push({ id: song.id, editMode: false, ...song.data() });
                })

                setSongs(songsRes);
                setPlaylist({ id: playlistDoc.id, ...playlistDoc.data() });
                setTitle(playlistDoc.data().title);
                setDescription(playlistDoc.data().description);
                setPublic(playlistDoc.data().public);

                setLoading(false);
            } catch (error) {
                console.log(error);
            }

        }

        getDocument();

    }, []);


    const toggleEditMode = (id) => {
        const updatedSongs = songs.map((song) => {
            if (song.id === id) {
                setAudioEditName(song.name);
                setAudioEditSinger(song.singer);

                return { ...song, editMode: !song.editMode }
            }

            // To allow edit one song at a time
            return { ...song, editMode: false };
        })

        console.log(updatedSongs);

        setSongs(updatedSongs);
    }

    const getAudioDuration = (file) => {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);

        return new Promise((resolve) => {
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
            });
        });
    };


    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleDesChange = (e) => {
        setDescription(e.target.value);
    }

    const handlePublicChange = (e) => {
        setPublic(e.target.checked);
    }

    const handleSongSubmit = (event) => {
        event.preventDefault();

        if (!audioFile || !audioName || !imageFile || !singer) {
            toast("Fill all fields please")
            return;
        }
        console.log(audioFile.name);
        console.log(imageFile.name);

        // Making references to the path where they will be uploaded
        const audioStorageRef = ref(storage, `audio/${audioFile.name}${generateRandomString(5)}`);
        const imageStorageRef = ref(storage, `songImages/${imageFile.name}${generateRandomString(5)}`);

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

        }).catch((error) => console.log(error));

        songFormRef.current.reset();

        setAudioName('');
        setSinger('');
        setImageFile(null);
        setAudioFile(null);
    }

    const handleAudioUpload = async (event) => {
        const file = event.target.files[0];
        setAudioFile(file);
        const fileDuration = await getAudioDuration(file);
    }

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageFile(file);
    };


    const handleAudioTitle = (event) => {
        setAudioName(event.target.value);
    }

    const handleSingerChange = (event) => {
        setSinger(event.target.value);
    }

    const editPlaylist = () => {

    }

    return (<>
        {loading ? <p>Loading...</p> : <div className={`${styles.builder}`}>
            <div className={`${styles.builder_inner}`}>
                <h2>Edit playlist</h2>
                <form className={`${styles.playlistForm}`}>
                    <input type="text" placeholder="Title" onChange={handleTitleChange} value={title} />
                    <input type="text" placeholder="Short description" onChange={handleDesChange} value={description} />
                    <div className={`${styles.publicCheck}`}>
                        <label htmlFor="checkbox">Public</label>
                        <input id="checkbox" type="checkbox" onChange={handlePublicChange} checked={isPublic} />
                    </div>
                </form>

                <form className={`${styles.songForm}`} ref={songFormRef} onSubmit={handleSongSubmit}>
                    <div className={styles.audioMain}>
                        <div className={`${styles.audioDescription}`}>
                            <div className={styles.audioInfo}>
                                <input type="text" placeholder="Audio name" onChange={handleAudioTitle} />
                                <input type="text" placeholder="Singer/Group" onChange={handleSingerChange} />
                            </div>
                            <div className={styles.audioFiles}>
                                <div className={styles.image}>
                                    <label htmlFor="audioImage">
                                        <img
                                            src={upload_image}
                                            alt="Выбрать файл"
                                        />
                                        <span className="input__file-button-text">Upload Audio image</span>
                                    </label>
                                    <div className={styles.customButton}>
                                        <input id="audioImage" type="file" accept="image/*" onChange={handleImageUpload} />
                                    </div>
                                </div>

                                <div className={styles.audio}>
                                    <label htmlFor="audioFile">
                                        <img
                                            src={upload_music}
                                            alt="Выбрать файл"
                                        />
                                        <span>Upload Audio file</span>
                                    </label>
                                    <div className={`${styles.customButton}`}>
                                        <input id="audioFile" type="file" accept="audio/*" onChange={handleAudioUpload} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <button type="submit">Add a song</button>
                        </div>
                    </div>
                </form>
                <div className={`${styles.songs}`}>
                    {songs.length !== 0 && songs.map((song, i) => (
                        <div key={song.id} className={`${styles.songDisplayed}`}>
                            <div className={`${styles.songDisplayed__top}`}>
                                <h3>{i + 1}</h3>
                                {/* <img className={`${styles.delete_icon}`} src={trashcan} alt="delete" /> */}
                                <Button text={song.editMode ? "Save" : "Edit"} onClick={() => toggleEditMode(song.id)} />
                            </div>
                            <hr />
                            <div className={`${styles.songDisplayed__data}`}>
                                {song.editMode ? <input id="audioImage" type="file" accept="image/*" /> : <img src={song.image} />}

                                {song.editMode ?
                                    <div className={styles.songDisplayed__data__media}>
                                        <div className={styles.songDisplayed__data__info}>
                                            <input type="text" className={styles.songName} value={audioEditName} onChange={(e) => setAudioEditName(e.target.value)} />
                                            <input type="text" value={audioEditSinger} onChange={(e) => setAudioEditSinger(e.target.value)} />
                                        </div>
                                        <div className={styles.h5Player}>
                                            {/* src={song.songFile} */}
                                            <input id="audioFile" type="file" accept="audio/*" />
                                        </div>
                                    </div>
                                    : <div className={styles.songDisplayed__data__media}>
                                        <div className={styles.songDisplayed__data__info}>
                                            <p className={styles.songName}>{song.name}</p>
                                            <p className={styles.author}>{song.singer}</p>
                                        </div>
                                        <div className={styles.h5Player}>
                                            <H5AudioPlayer
                                                className={styles.audioPlayer}
                                                src={song.songFile}
                                                customVolumeControls={[]}
                                                id="h5Style"
                                                hasDefaultKeyBindings={false}
                                            />
                                        </div>

                                    </div>}
                            </div>
                        </div>
                    ))}

                    {songs.length !== 0 && console.log(songs[0].imageUrl)}
                </div>
                <div className={`${styles.main_buttons}`}>
                    <Button text="Save" onClick={editPlaylist} medium />
                    <Button text="Clear" medium danger />
                </div>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
        </div>}
    </>)

}

export default PlaylistEditor;