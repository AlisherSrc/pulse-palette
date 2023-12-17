import React from 'react';
import styles from './share.module.css';

const ShareButton = ({ msgtitle, msgdescription }) => {

    // Function to generate the sharing link
    const createShareLink = (network, link, msg, title) => {
        const encodedTitle = encodeURIComponent(title);
        const encodedMsg = encodeURIComponent(msg);
        const encodedLink = encodeURIComponent(link);
        const fullMsg = `${encodedTitle}%0A%0A${encodedMsg}`; // New line represented by %0A

        switch (network) {
            case 'facebook':
                return `https://www.facebook.com/share.php?u=${encodeURI(link)}`;
            case 'twitter':
                return `http://twitter.com/share?url=${encodeURI(link)}&text=${encodeURIComponent(title)}&hashtags=javascript,programming`;
            case 'linkedin':
                return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURI(link)}`;
            case 'reddit':
                return `http://www.reddit.com/submit?url=${encodeURI(link)}&title=${encodeURIComponent(title)}`;
            case 'whatsapp':
                return `https://api.whatsapp.com/send?text=${fullMsg}`;
            case 'telegram':
                return `https://telegram.me/share/url?url=${encodedLink}&text=${fullMsg}`;
            // case 'whatsapp':
            //     return `https://api.whatsapp.com/send?text=${encodeURIComponent(msg + ': ' + link)}`;
            // case 'telegram':
            //     return `https://telegram.me/share/url?url=${encodeURI(link)}&text=${encodeURIComponent(msg)}`;
            default:
                return '';
        }
    };

    // Assume the current window location is the link you want to share
    const link = window.location.href;
    const msg = msgdescription;
    const title = msgtitle;

    return (
        <div id="share-buttons" className={styles.shareButtons}>
            <a href={createShareLink('facebook', link, msg, title)} target="_blank" rel="noopener noreferrer" className={styles.facebook}>
                <i className={`${styles.facebook} fab fa-facebook`}></i>
            </a>

            <a href={createShareLink('twitter', link, msg, title)} target="_blank" rel="noopener noreferrer" className={styles.twitter}>
                <i className={`${styles.twitter} fab fa-twitter`}></i>
            </a>
            <a href={createShareLink('linkedin', link, msg, title)} target="_blank" rel="noopener noreferrer" className={styles.linkedin}>
                <i className={`${styles.linkedin} fab fa-linkedin`}></i>
            </a>
            <a href={createShareLink('reddit', link, msg, title)} target="_blank" rel="noopener noreferrer" className={styles.reddit}>
                <i className={`${styles.reddit} fab fa-reddit`}></i>
            </a>
            <a href={createShareLink('whatsapp', link, msg, title)} target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
                <i className={`${styles.whatsapp} fab fa-whatsapp`}></i>
            </a>
            <a href={createShareLink('telegram', link, msg, title)} target="_blank" rel="noopener noreferrer" className={styles.telegram}>
                <i className={`${styles.telegram} fab fa-telegram`}></i>
            </a>
        </div>
    );
}

export default ShareButton;