import React from "react";

const NextButton = ({audios, isPlaying, current, setCurrent})=> {    

    const handlePlayButton = (e)=> {            
        
        console.log("stop audio")
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