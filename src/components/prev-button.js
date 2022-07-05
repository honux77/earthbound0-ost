import React from "react";

const PrevButton = ({first, audioBox, isPlaying, current, setCurrent})=> {    
    
    if(first) return;

    const audio = audioBox.audio;

    const handlePlayButton = (e)=> {            
        
        console.log("stop audio")
        audio.pause();
        audio.currentTime = 0;

        const curr = current === 0 ? audioBox.tracks.length - 1: current - 1;   
        audio.src = audioBox.tracks[curr];
        audio.currentTime = 0;
        
        if (isPlaying) {
            audio.play();
        }
        
        setCurrent(curr);    
    };

    return (
        <span className="Button" onClick={handlePlayButton}>&lt;</span>
    );
};

export default PrevButton;