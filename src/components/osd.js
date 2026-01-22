import { MAX_VOL, MIN_VOL, VERSION } from "../constant";
import React from 'react';

const Osd = ({ volume, audioBox, first }) => {
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        setShow(true);
        const timerId = setTimeout(() => {
            setShow(false);
        }, 3000);

        return () => {
            clearTimeout(timerId);
        };
    }, [volume]);

    if (audioBox.audio && typeof audioBox.audio.setVolume === 'function') {
        audioBox.audio.setVolume(volume / MAX_VOL);
    } else if (audioBox.audio) {
        audioBox.audio.volume = volume / MAX_VOL;
    }

    if (!show) return;
    let vol = `VOL: ${volume}`
    if (volume === MAX_VOL) vol = "VOL: MAX"
    if (volume === MIN_VOL) vol = "MUTE"
    if (first) vol = "MOTHER 1 + 2 OST " + VERSION;

    return (
        <div className="Osd">{vol}</div>
    );
}

export default Osd;