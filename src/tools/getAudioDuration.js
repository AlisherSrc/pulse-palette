export const getAudioDuration = (file) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);

    return new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', () => {
            resolve(audio.duration);
        });
    });
};