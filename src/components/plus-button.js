import { MAX_VOL, VOL_STEP } from "../constant";

const PlusButton = ({setVolume, first})=> {
    if (first) return;
    const clickHander = (e) => {        
        setVolume((prev)=>{
            const next = prev + VOL_STEP >= MAX_VOL? MAX_VOL: prev + VOL_STEP;
            return next;
        });
    }

    return(<span className="Button" onClick={clickHander}>+</span>);
}

export default PlusButton;