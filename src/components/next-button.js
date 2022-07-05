import React from "react";

const NextButton = ({first, audioBox, isPlaying, current, setCurrent})=> {    

    if(first) return;

    const audio = audioBox.audio;

    const handlePlayButton = (e)=> {            
        audio.currentTime = 0;
        audio.pause();
        const curr = current === audioBox.tracks.length - 1 ? 0: current + 1;        
        audio.src = audioBox.tracks[curr];
        audio.currentTime = 0;        
        
        if (isPlaying) {
            audio.play();
        }
        setCurrent(curr);    
    };

    return (
        <span className="Button" onClick={handlePlayButton}>&gt;</span>
    );
};

export default NextButton;