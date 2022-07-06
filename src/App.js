
import './App.css';
import './AppMac13.css';
import './AppLong.css';

import React from 'react';

import Play from "./components/play";
import PlayList from "./components/playlist";

import startBackground from "./images/start.jpg";
import playingBackground from "./images/playing.jpg";
import logo from "./images/mother-logo.gif"
import stoppedLogo from "./images/mother-logo-nospin.png"
import PrevButton from './components/prev-button';
import NextButton from './components/next-button';
import PlusButton from './components/plus-button';
import MinusButton from './components/minus-button';

import audio_box from './components/audio-box';
import Osd from './components/osd';
import { MAX_VOL, VOL_STEP } from './constant';
import Visualizer from './components/visualizer';


function App() {

  const [current, setCurrent] = React.useState(0);
  const [first, setFirst] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(MAX_VOL - 2 * VOL_STEP);
  const [audioBox] = React.useState(audio_box);

  const currBackground = first ? startBackground : playingBackground;

  React.useEffect(() => {
    console.log("effect", current);
    audioBox.audio.onended = () => {
      const next = current === audioBox.tracks.length - 1 ? 0 : current + 1;      
      audioBox.audio.src = audioBox.tracks[next];
      audioBox.audio.currentTime = 0;
      audioBox.audio.play();
      setCurrent(next);
    };    
  }, [current, audioBox]);

  const Logo = () => {
    if (first) return;
    const image = isPlaying ? logo : stoppedLogo;
    return (
      <div className="Logo"><img alt="NES EarthBound Zero Logo" src={image}></img></div>
    );
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${currBackground})` }}>
      <Osd volume={volume} audioBox={audioBox} first={first}></Osd>

      <PlayList first={first} current={current} audioBox={audioBox}></PlayList>

      <Visualizer audioBox={audioBox} current={current} isPlaying={isPlaying}></Visualizer>

      <div className='Control'>
        <PrevButton first={first} audioBox={audioBox} isPlaying={isPlaying} current={current} setCurrent={setCurrent}></PrevButton>
        <Play audioBox={audioBox} setFirst={setFirst} isPlaying={isPlaying} setIsPlaying={setIsPlaying} current={current}></Play>
        <NextButton first={first} audioBox={audioBox} isPlaying={isPlaying} current={current} setCurrent={setCurrent}></NextButton>
        <PlusButton first={first} setVolume={setVolume}></PlusButton>
        <MinusButton first={first} setVolume={setVolume}></MinusButton>
      </div>

      <Logo></Logo>
    </div>
  );
}

export default App;
