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

import audioList from './components/audio-list';


function App() {
  const [current, setCurrent] = React.useState(0);
  const [first, setFirst] = React.useState(true);
  const [audios] = React.useState(audioList);
  const [isPlaying, setIsPlaying] = React.useState(false);

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
    <div className="App" style={{ backgroundImage: `url(${currBackground})` }}>
      <PlayList first={first} current={current} setCurrent={setCurrent}></PlayList>
      <div className='Control'>
        <PrevButton first={first} audios={audios} isPlaying={isPlaying} current={current} setCurrent={setCurrent}></PrevButton>
        <Play audios={audios} setFirst={setFirst} isPlaying={isPlaying} setIsPlaying={setIsPlaying} current={current}></Play>
        <NextButton first={first} audios={audios} isPlaying={isPlaying} current={current} setCurrent={setCurrent}></NextButton>
      </div>
      <Logo></Logo>
    </div>
  );
}

export default App;
