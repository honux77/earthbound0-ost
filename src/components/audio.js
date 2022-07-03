import bgm1 from "../mp3/01-mother-earth.mp3"
import ReactAudioPlayer from "react-audio-player";
const Audio = ()=> {
    return (
        <ReactAudioPlayer src={bgm1} autoPlay controls>            
        </ReactAudioPlayer>
    )
}

export default Audio;