import { MIN_VOL, VOL_STEP } from "../constant";

const MinusButton = ({setVolume, first})=> {
    if (first) return;
    const clickHander = (e) => {        
        setVolume((prev)=>{
            const next = prev - VOL_STEP <= MIN_VOL? MIN_VOL: prev - VOL_STEP;
            return next;
        });
    }
    
    return(<span className="Button" onClick={clickHander}>-</span>);
}

export default MinusButton;