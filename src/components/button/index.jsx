import styles_external from './button.module.css';

const Button = (props) => {

    const { onClick,
        text,
        width,
        height,
        color,
        large,
        medium
    } = props;
    
    let styles = {
        "background-color":color,
        "width":width,
        "height":height
    };
    
    // Changing the style according to the input
    if(medium) styles = {...styles,width:"9rem",height:"2.3rem"}
    if(large) styles = {...styles,width: "13rem",height:"2.9rem"}

    return (
        <button className={styles_external.button} style={styles} onClick={onClick}>{text}</button>
    )
}

export default Button;