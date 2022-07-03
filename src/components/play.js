const play = ({audio})=> {
    const handlePlayButton = (e)=> {
        console.log("클릭");    
        audio.play();
    };

    return (
        <div className="PlayButton" onClick={handlePlayButton}>Click Button to Play</div>
    );
};

export default play;