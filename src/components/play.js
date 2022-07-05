import React from "react";

const Play = ({audioBox, setFirst, isPlaying, setIsPlaying, current})=> {
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

    return (
        <span className="Button" onClick={handlePlayButton}>{child}</span>
    );
};

export default Play;