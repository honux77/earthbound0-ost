import React from "react";

const NextButton = ({first, audios, isPlaying, current, setCurrent})=> {

    if(first) return;

    const handlePlayButton = (e)=> {            
        audios[current].pause();
        audios[current].currentTime = 0;

        const curr = current === audios.length - 1 ? 0: current + 1;        
        
        if (isPlaying) {
            audios[curr].play();
        }
        setCurrent(curr);    
    };

    return (
        <span className="Button" onClick={handlePlayButton}>&gt;</span>
    );
};

export default NextButton;