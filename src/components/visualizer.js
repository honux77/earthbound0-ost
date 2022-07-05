import React from "react";
import AudioSpectrum from "react-audio-spectrum";

const Visualizer = ({audioBox, current}) => {
    return (
        <div className="Visualizer">
            <AudioSpectrum audioEle={audioBox.audio}></AudioSpectrum>
        </div>        
    )
};

export default Visualizer;