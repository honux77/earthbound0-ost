import React from "react";

const Play = ({audios, setFirst, isPlaying, setIsPlaying, current})=> {
 
    const handlePlayButton = (e)=> {            
        setFirst(false);
        setIsPlaying((prev)=> {
            return prev ? false: true;
        })
        
        if (isPlaying) {
            console.log("Stop song: ", current)
            audios[current].pause();
        } else {
            audios[current].play();
        }        
    };

    const child = isPlaying ? "Pause": "Play";

    return (
        <span className="Button" onClick={handlePlayButton}>{child}</span>
    );
};

export default Play;