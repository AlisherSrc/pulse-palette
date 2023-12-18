import { useEffect, useRef, useState } from "react";
import styles from "./playlistEditor.module.css";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { Timestamp, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
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
import { useParams, useNavigate } from "react-router-dom";
import LoadingIcon from "../../components/loading_icon";
import dual_ring from './../../images/dual_ring-1s-200px.svg';

const PlaylistEditor = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState();
    const [songs, setSongs] = useState();

    // Playlist
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setPublic] = useState();

    const [playlistLoading, setPlaylistLoading] = useState(false);
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
    const [audioEditImage, setAudioEditImage] = useState(null);
    const [audioEditAudioFile, setAudioEditAudioFile] = useState(null);

    const [audioEditLoading, setAudioEditLoading] = useState(false);

    const [isAudioLoading, setAudioLoading] = useState(false);

    const [audioUploadProgress, setAudioUploadProgress] = useState(0);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);

    useEffect(() => {


        const getDocument = async () => {
            const songsRes = [];

            try {
                setLoading(true);



                const playlistDoc = await getDoc(doc(db, "playlist", id));

                if (!playlistDoc.exists || auth.currentUser?.email !== playlistDoc.data().userEmail) {
                    alert("You have no access to edit this playlist");
                    navigate('/'); // Redirect them to a safe location
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

    const handleSongSubmit2 = (event) => {
        try {
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

            // Start the audio file upload
            const audioUploadTask = uploadBytesResumable(audioStorageRef, audioFile);
            const imageUploadTask = uploadBytesResumable(imageStorageRef, imageFile);


            // Listen for state changes, errors, and completion of the audio upload.
            audioUploadTask.on('state_changed', (snapshot) => {
                // Get upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setAudioUploadProgress(progress);
            });

            // Listen for state changes, errors, and completion of the image upload.
            imageUploadTask.on('state_changed', (snapshot) => {
                // Get upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress);
            });
            Promise.all([
                audioUploadTask,
                imageUploadTask
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
    
                const songID = `${audioName}${generateRandomString(16)}`;
    
                return setDoc(doc(db, "song", songID), {
                    image: urls[1],
                    name: audioName,
                    playlistID: id,
                    singer: singer,
                    songFile: urls[0],
                    userEmail: auth.currentUser.email
                }).then((snapshot) => {
                    console.log("Song created");
    
                    setSongs([{
                        id: songID,
                        name: audioName,
                        image: urls[1],
                        songFile: urls[0],
                        singer: singer
                    }, ...songs]);
                    setAudioLoading(false);
                })
            })
        } catch (e) {
            console.log(e);
            setAudioLoading(false);
        }
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

            const songID = `${audioName}${generateRandomString(16)}`;

            return setDoc(doc(db, "song", songID), {
                image: urls[1],
                name: audioName,
                playlistID: id,
                singer: singer,
                songFile: urls[0],
                userEmail: auth.currentUser.email
            }).then((snapshot) => {
                console.log("Song created");

                setSongs([{
                    id: songID,
                    name: audioName,
                    image: urls[1],
                    songFile: urls[0],
                    singer: singer
                }, ...songs]);
            })
        }).catch((error) => console.log(error));

        songFormRef.current.reset();

        setAudioName('');
        setSinger('');
        setImageFile(null);
        setAudioFile(null);
    }

    const combinedUploadProgress = (audioUploadProgress + imageUploadProgress) / 2;

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
        if (!title || !description) {
            alert("Please, fill all fields");
            return;
        }

        const playlistRef = doc(db, "playlist", id);

        setPlaylistLoading(true);
        updateDoc(playlistRef, {
            title: title,
            description: description,
            public: isPublic
        });
        setPlaylistLoading(false);
        toast("Saved!");
    }

    // User can edit
    // title
    // singer
    // audio
    // image

    // TO DO: previous audio and images in the storage should be deleted
    const editAudio = async (id) => {
        // If user didn't change anything
        if (!audioEditName && !audioEditSinger && !audioEditImage && !audioEditAudioFile) {
            toggleEditMode(id);
            return;
        }

        try {
            const updatedFields = {};


            // Our audio and image
            let audioUrl = '';
            let imageUrl = '';
            setAudioEditLoading(true);

            if (audioEditAudioFile) {
                const audioStorageRef = ref(storage, `audio/${audioEditAudioFile.name}${generateRandomString(5)}`);
                await uploadBytes(audioStorageRef, audioEditAudioFile);
                audioUrl = await getDownloadURL(audioStorageRef);
                updatedFields.songFile = audioUrl;
            }
            if (audioEditImage) {
                const imageStorageRef = ref(storage, `songImages/${audioEditImage.name}${generateRandomString(5)}`);
                await uploadBytes(imageStorageRef, audioEditImage);
                imageUrl = await getDownloadURL(imageStorageRef);
                updatedFields.image = imageUrl;
            }

            const audioRef = doc(db, "song", id);

            // Conditionaly adding edited fields 
            if (audioEditName) updatedFields.name = audioEditName;
            if (audioEditSinger) updatedFields.singer = audioEditSinger;


            await updateDoc(audioRef, updatedFields)



            // Reset all fields 
            setAudioEditName('');
            setAudioEditSinger('');
            setAudioEditImage(null);
            setAudioEditAudioFile(null);

            toggleEditMode(id);

            // To force component to reload
            setSongs((currentSongs) => {
                return currentSongs.map((song) => {
                    if (song.id === id) {
                        return {
                            ...song,
                            ...updatedFields
                        };
                    }
                    return song;
                });
            });

            setAudioEditLoading(false);
        } catch (error) {
            console.log(error);
        }

    }



    const playlistDelete = async () => {
        await deleteDoc(doc(db, "playlist", id));

        navigate('/');
    }

    const audioDelete = async (id) => {
        try {

            await deleteDoc(doc(db, 'song', id));

            setSongs((prev) => {
                return prev.filter((song) => song.id !== id);
            })
        } catch (error) {
            console.log(error);
        }
    }

    const toggleEditMode = (id) => {
        setSongs((currentSongs) => {
            return currentSongs.map((song) => {
                if (song.id === id) {
                    setAudioEditName(song.name);
                    setAudioEditSinger(song.singer);

                    return { ...song, editMode: !song.editMode };
                }
                return { ...song, editMode: false };
            });
        });
    }


    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleDesChange = (e) => {
        setDescription(e.target.value);
    }

    const handlePublicChange = (e) => {
        setPublic(e.target.checked);
    }


    const handleEditAudioUpload = (event) => {
        const file = event.target.files[0];
        setAudioEditAudioFile(file);
    }

    const handleEditImageUpload = (event) => {
        const file = event.target.files[0];
        setAudioEditImage(file);
    }

    return (<>
        {loading ? <LoadingIcon /> : <div className={`${styles.builder}`}>
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

                <form className={`${styles.songForm}`} ref={songFormRef} onSubmit={handleSongSubmit2}>
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
                                        <span className="input__file-button-text">{imageFile ? "Image uploaded!" : "Upload Audio image"}</span>
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
                                        <span>{audioFile ? "Audio Uploaded" : "Upload Audio file"}</span>
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
                {/* Here are songs */}
                <div className={`${styles.songs}`}>
                    {isAudioLoading && <div className={`${styles.progress_bar}`}>
                        <progress value={combinedUploadProgress} max="100"></progress>
                        <span>{combinedUploadProgress.toFixed(0)}%</span>
                    </div>}
                    {songs.length !== 0 && songs.map((song, i) => (
                        <div key={song.id} className={`${styles.songDisplayed}`}>
                            {audioEditLoading && <p>Loading...</p>}
                            <div className={`${styles.songDisplayed__top}`}>
                                <h3>{i + 1}</h3>
                                <div className={`${styles.songDisplayed__top__buttons}`}>
                                    <Button text={song.editMode ? "Cancel" : "Edit"} onClick={() => toggleEditMode(song.id)} />
                                    {song.editMode && <Button text="Save" onClick={() => editAudio(song.id)} />}
                                    <img className={`${styles.delete_icon}`} src={trashcan} alt="delete" onClick={() => audioDelete(song.id)} />
                                </div>
                            </div>
                            <hr />
                            <div className={`${styles.songDisplayed__data}`}>
                                {song.editMode ? <input id="audioImage" type="file" accept="image/*" onChange={(e) => handleEditImageUpload(e)} /> : <img src={song.image} />}

                                {song.editMode ?
                                    <div className={styles.songDisplayed__data__media}>
                                        <div className={styles.songDisplayed__data__info}>
                                            <input type="text" className={styles.songName} placeholder="Song name" onChange={(e) => setAudioEditName(e.target.value)} />
                                            <input type="text" placeholder="Singer" onChange={(e) => setAudioEditSinger(e.target.value)} />
                                        </div>
                                        <div className={styles.h5Player}>
                                            {/* src={song.songFile} */}
                                            <input id="audioFile" type="file" accept="audio/*" onChange={(e) => handleEditAudioUpload(e)} />
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
                {playlistLoading && <img src={dual_ring} style={{width: "30px"}}/>}
                <div className={`${styles.main_buttons}`}>
                    <Button text="Save" onClick={editPlaylist} medium />
                    <Button text="Delete" medium danger onClick={playlistDelete} />
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