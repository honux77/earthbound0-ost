import './App.css';

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

import audioList from './components/audio-list';
import Osd from './components/osd';
import {MAX_VOL, VOL_STEP} from './constant';
import Visualizer from './components/visualizer';


function App() { 

  const [current, setCurrent] = React.useState(0);
  const [first, setFirst] = React.useState(true);
  const [audios] = React.useState(audioList);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(MAX_VOL - 2 * VOL_STEP);

  const currBackground = first ? startBackground : playingBackground;

  React.useEffect(() => {
    console.log("once");
    for (let i = 0; i < audios.length; i++) {
      audios[i].onended = () => {
        ((n) => {
          console.log("Song ended:", n);
          const next = n === audios.length - 1 ? 0 : n + 1;
          console.log("start new song:", next);
          audios[next].currentTime = 0;
          audios[next].play();
          setCurrent(next);
        })(i);
      }
    }
  }, [audios]);

  const Logo = () => {
    if (first) return;
    const image = isPlaying ? logo : stoppedLogo;
    return (
      <div className="Logo"><img alt="NES EarthBound Zero Logo" src={image}></img></div>
    );
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${currBackground})`}}>
      <Osd volume={volume} audios={audios}></Osd>

      <PlayList first={first} current={current} audios={audios}></PlayList>
      
      <Visualizer audios={audios} current={current} isPlaying={isPlaying}></Visualizer>

      <div className='Control'>
        <PrevButton first={first} audios={audios} isPlaying={isPlaying} current={current} setCurrent={setCurrent}></PrevButton>
        <Play audios={audios} setFirst={setFirst} isPlaying={isPlaying} setIsPlaying={setIsPlaying} current={current}></Play>
        <NextButton first={first} audios={audios} isPlaying={isPlaying} current={current} setCurrent={setCurrent}></NextButton>
        <PlusButton first={first} setVolume={setVolume}></PlusButton>
        <MinusButton first={first} setVolume={setVolume}></MinusButton>
      </div>

      <Logo></Logo>
    </div>
  );
}

export default App;
