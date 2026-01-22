import React from "react";
import AudioSpectrum from "react-audio-spectrum";

const Visualizer = ({ audioBox, current }) => {
    // Visualizer is disabled for VGM player as it requires an HTMLAudioElement
    return null;
    /*
    return (
        <div className="Visualizer">
            <AudioSpectrum audioEle={audioBox.audio}></AudioSpectrum>
        </div>        
    )
    */
};

export default Visualizer;