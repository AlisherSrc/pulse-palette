import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./playlistBuilder.module.css";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { generateRandomString } from "../../tools/generateRandomStr";
import upload_image from '../../../public/image-upload.svg';
import upload_music from '../../../public/music-upload.svg';
import dual_ring from './../../images/dual_ring-1s-200px.svg';

import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import Button from "../../components/button";
import { ToastContainer, toast } from 'react-toastify';
import { Context } from "../../App";
import useGetUserPlaylists from "../../hooks/useGetUserPlaylists";

// It should display user's not uploaded songs, we can do so by the userID field of songs
const PlaylistBuilder = () => {
    const [userPlaylists, loading, error] = useGetUserPlaylists();
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

    const [isAudioLoading, setAudioLoading] = useState(false);
    const [playlistLoading, setPlaylistLoading] = useState(false);

    const [audioUploadProgress, setAudioUploadProgress] = useState(0);
    const [imageUploadProgress, setImageUploadProgress] = useState(0);

    const { customUser } = useContext(Context);

    const songFormRef = useRef();
    const nav = useNavigate();

    useEffect(() => {
        if (!customUser.subscription && userPlaylists.length >= 5) {
            alert("You can have max 5 playlists. Please, upgrade to the Premium plan");
            nav('/');
        }
    }, []);


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
        if (file) {
            document.querySelector('#uploadIcon').classList.add('iconChanged');
            setImageFile(file);
        }
    };

    const createPlaylist = async () => {
        if (!title || !description || songs.length === 0) {
            alert("Please,fill all feilds and upload at least 1 audio file");
            return;
        }
        if (!customUser.subscription && userPlaylists.length >= 5) {
            alert("You can have max 5 playlists. Please, upgrade to the Premium plan");
            nav('/');
        }

        // For each song we have playlistID field which refers to the playlist they are in
        const playlistID = `${title}${generateRandomString(16)}`;
        setPlaylistLoading(true);
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
            title: title,
            userEmail: customUser.email
        }).then((snapshot) => {
            toast("Created!");
        }).then(() => {
            setPlaylistLoading(false);
            console.log("Playlist " + playlistID + " created")

            nav("/");
        })
            .catch((error) => {
                console.log(error)
                setPlaylistLoading(false);
            });
    }

    const handleSongSubmit2 = (event) => {
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
        ]).then(() => {
            // get uploaded audio and image url
            return Promise.all([
                getDownloadURL(audioStorageRef),
                getDownloadURL(imageStorageRef)
            ]);
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
        }).catch((error) => {
            setAudioLoading(false);
            console.log(error)
        });
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
    const combinedUploadProgress = (audioUploadProgress + imageUploadProgress) / 2;

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
            <div className={`${styles.builder_inner}`}>
                <h2>Create your playlist</h2>
                <form className={`${styles.playlistForm}`}>
                    <input type="text" placeholder="Title" onChange={handleTitleChange} />
                    <input type="text" placeholder="Short description" onChange={handleDesChange} />
                    <div className={`${styles.publicCheck}`}>
                        <label htmlFor="checkbox">Public</label>
                        <input id="checkbox" type="checkbox" onChange={handlePublicChange} />
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
                                            id="uploadIcon"
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
                <div className={`${styles.songs}`}>
                    {isAudioLoading && <div className={`${styles.progress_bar}`}>
                        <progress value={combinedUploadProgress} max="100"></progress>
                        <span>{combinedUploadProgress.toFixed(0)}%</span>
                    </div>}
                    {songs.length !== 0 && songs.map((song, i) => (
                        <div key={song.songUrl} className={`${styles.songDisplayed}`}>
                            <h3>{i + 1}</h3>
                            <hr />
                            <div className={`${styles.songDisplayed__data}`}>
                                <img src={song.imageUrl} />

                                <div className={styles.songDisplayed__data__media}>
                                    <div className={styles.songDisplayed__data__info}>
                                        <p className={styles.sonName}>{song.name}</p>
                                        <p className={styles.author}>{song.singer}</p>
                                    </div>
                                    <div className={styles.h5Player}>
                                        <H5AudioPlayer
                                            className={styles.audioPlayer}
                                            autoPlay
                                            src={song.songUrl}
                                            customVolumeControls={[]}
                                        />
                                    </div>
                                    {/*<audio preload controls>*/}
                                    {/*    <source src={song.songUrl} type="audio/mp3" />*/}
                                    {/*    Your browser does not support the audio element.*/}
                                    {/*</audio>*/}
                                </div>
                            </div>
                        </div>
                    ))}

                    {songs.length !== 0 && console.log(songs[0].imageUrl)}
                </div>
                <div className={styles.submit_button}>
                    <Button text="Create" onClick={createPlaylist} medium />
                    {playlistLoading && <img src={dual_ring} />}
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
        </div>

    </>)
}

export default PlaylistBuilder;