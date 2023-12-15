import styles_external from './button.module.css';

const Button = (props) => {

    const { onClick,
        text,
        width,
        height,
        color,
        large,
        medium,
        danger
    } = props;
    
    let styles = {
        "background-color":color,
        "width":width,
        "height":height
    };
    
    // Changing the style according to the input
    if(medium) styles = {...styles,width:"9rem",height:"2.3rem"}
    if(large) styles = {...styles,width: "13rem",height:"2.9rem"}
    if(danger) styles = {...styles,"background-color": "transparent","border":"1px solid #CC564E","color":"#CC564E"}
    return (
        <button className={styles_external.button} style={styles} onClick={onClick}>{text}</button>
    )
}

export default Button;