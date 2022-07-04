import React from "react";

const PrevButton = ({audios, isPlaying, current, setCurrent})=> {    

    const handlePlayButton = (e)=> {            
        
        console.log("stop audio")
        audios[current].pause();
        audios[current].currentTime = 0;

        const curr = current === 0 ? audios.length - 1: current - 1;        
        
        if (isPlaying) {
            audios[curr].play();
        }
        setCurrent(curr);    
    };

    return (
        <span className="Button" onClick={handlePlayButton}>&lt;</span>
    );
};

export default PrevButton;