import { MAX_VOL } from "../constant";

const Osd = ({volume, audios}) => {
    
    audios.forEach(audio => {
        console.log(audio.volume);
        audio.volume = volume / MAX_VOL;
    });
    return (
        <div className="Osd">VOL: {volume}</div>
    );
}

export default Osd;