import React from "react";
import AudioSpectrum from "react-audio-spectrum";

const Visualizer = ({audios, current}) => {
    return (
        <div className="Visualizer">
            <AudioSpectrum audioEle={audios[current]}></AudioSpectrum>
        </div>        
    )
};

export default Visualizer;