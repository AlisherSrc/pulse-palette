import { useContext, useState } from 'react';
import styles from './settings.module.css';
import { Context } from '../../App';
import Button from '../../components/button';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebase';
import { getAuth, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { generateRandomString } from '../../tools/generateRandomStr';
import { resizeImage } from '../../tools/resizeImage';

const Settings = () => {

    const [initial, setInitial] = useState("I");
    const [image, setImage] = useState(null);
    const { customUser, setCustomUser } = useContext(Context);
    const [profile, setProfile] = useState({});
    const [loading,setLoading] = useState(false);

    const auth = getAuth();

    const handleChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file); // Save the File object, not the data URL
            const reader = new FileReader();
            reader.onload = (e) => {
                // This is just for preview purposes
                setProfile((currProf) => ({
                    ...currProf,
                    avatarPreview: e.target.result, // Use a separate state key for the preview
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const userRef = doc(db, "user", customUser.id);

        if (image) {
            // Generate a new filename for the avatar
            const newAvatarFilename = `user_avatars/${customUser.username}${generateRandomString(5)}`;
            const avatarRef = ref(storage, newAvatarFilename);

            // Convert the image to WebP and then upload
            resizeImage(image, 1920, 1080, 1, async (imageOut) => {
                try {
                    setLoading(true);
                    const snapshot = await uploadBytes(avatarRef, imageOut);
                    const url = await getDownloadURL(snapshot.ref);

                    await updateDoc(userRef, {
                        ...profile,
                        avatarUrl: url, // Update the profile with the new avatar URL
                        avatarPreview: ""
                    });
                    setCustomUser((currUser) => ({
                        ...currUser,
                        ...profile,
                        avatarUrl: url,
                    }));
                    setLoading(false);
                } catch (err) {
                    console.error("Failed to upload avatar and update profile:", err);
                    setLoading(false);
                }
            });
        } else if (!image && Object.keys(profile).length !== 0) {
            try {
                setLoading(true);
                await updateDoc(userRef, profile);
                setCustomUser((currUser) => ({
                    ...currUser,
                    ...profile,
                }));
                setLoading(false);
            } catch (e) {
                console.error("Failed to update profile:", e);
                setLoading(false);
            }
        }
    };

    const handleFieldsChange = (event) => {
        const { name, value } = event.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    return <div className={`${styles.main}`}>
        <div className={`${styles.content}`}>
        <h2>Edit profile</h2>
            <div className={`${styles.right_side}`}>
                <div className={styles.profilePhoto}>
                    <p>Photo</p>
                    <div className={styles.profile_photo_container}>
                        <div className={styles.profile_photo} style={{ backgroundImage: `url(${profile.avatarPreview})` }}>
                            {!image && <span>{initial}</span>}
                        </div>
                        <label className={styles.change_button}>
                            Change
                            <input type='file' onChange={(e) => handleChange(e)} style={{ display: 'none' }} />
                        </label>
                    </div>
                </div>
                <div className={styles.profile_fields}>
                    <label className={styles.field}>
                        <p>Username</p>
                        {/* Name needs to correspond to the fields name in the backend */}
                        <input onChange={(e) => handleFieldsChange(e)} type='text' name='username' placeholder={customUser?.username ?? "username"} />
                    </label>
                    <Button onClick={() => handleSubmit()} text="Submit" />
                    {loading && <p style={{color:"white"}}>Loading...</p>}
                </div>
            </div>
        </div>
    </div>
}

export default Settings;