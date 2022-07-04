import React from "react";

const Play = ({audio, setFirst, isPlaying, setIsPlaying})=> {    

    const handlePlayButton = (e)=> {            
        setFirst(false);
        setIsPlaying((prev)=> {
            return prev ? false: true;
        })

        console.log(isPlaying);
        if (isPlaying) {
            console.log("stop audio")
            audio.pause();
            audio.currentTime = 0;
        } else {
            audio.play();
        }        
    };

    const child = isPlaying ? "Stop": "Play";

    return (
        <div className="Button" onClick={handlePlayButton}>{child}</div>
    );
};

export default Play;