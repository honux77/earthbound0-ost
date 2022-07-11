import React from "react";

const Play = ({audioBox, setFirst, isPlaying, setIsPlaying, current, first})=> {
    const audio = audioBox.audio;
 
    const handlePlayButton = (e)=> {                    
        setFirst(false);
        setIsPlaying((prev)=> {
            return prev ? false: true;
        })
        
        if (isPlaying) {
            console.log("Stop song: ", current)
            audio.pause();
        } else {
            audio.play();
        }        
    };

    const child = isPlaying ? "Pause": "Play";

    if (first) {
        return (
            <div><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span className="Button" onClick={handlePlayButton}>LET'S START</span></div>
        );    
    }

    return (
        <span className="Button" onClick={handlePlayButton}>{child}</span>
    );
};

export default Play;