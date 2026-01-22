
import './App.css';
import './AppLong.css';

//Components
import React from 'react';
import Play from "./components/play";
import PlayList from "./components/playlist";
import PrevButton from './components/prev-button';
import NextButton from './components/next-button';
import PlusButton from './components/plus-button';
import MinusButton from './components/minus-button';
import audioBox from './components/audio-box';
import Osd from './components/osd';
import Visualizer from './components/visualizer';
import ForkMe from './components/fork-me';
import Counter from './components/counter';

//Resource
import startBackground from "./images/start.jpg";
import playingBackground from "./images/playing.jpg";
import logo from "./images/mother-logo.gif"
import stoppedLogo from "./images/mother-logo-nospin.png"

//constants
import { MAX_VOL, VOL_STEP } from './constant';

function App() {

  const [current, setCurrent] = React.useState(0);
  const [first, setFirst] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(MAX_VOL - 2 * VOL_STEP);


  const currBackground = first ? startBackground : playingBackground;

  React.useEffect(() => {
    // VGMPlayer load is async
    const playTrack = async () => {
      try {
        await audioBox.audio.load(audioBox.tracks[current]);
        audioBox.audio.play();
      } catch (e) {
        console.error("Playback failed", e);
      }
    };

    // If it's not the first load (or if we want to auto-play on first load if allowed), we play.
    // But usually we wait for user interaction.
    // The original code played on current change.

    if (!first) {
      playTrack();
    } else {
      // Just load first track
      audioBox.audio.load(audioBox.tracks[current]);
    }

    // audioBox.audio.onended equivalent?
    // VGMPlayer doesn't emit events yet. We might need to add it or poll.
    // For now, let's assume infinite loop or manual change.
    // If we want auto-advance, we need to implement onended in VGMPlayer.

  }, [current, first]);

  const Logo = () => {
    if (first) return;
    const image = isPlaying ? logo : stoppedLogo;
    return (
      <div className="Logo"><img alt="NES EarthBound Zero Logo" src={image}></img></div>
    );
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${currBackground})` }}>
      <ForkMe first={first} />
      <Osd volume={volume} audioBox={audioBox} first={first} />
      <PlayList first={first} current={current} audioBox={audioBox} />
      <Visualizer audioBox={audioBox} current={current} isPlaying={isPlaying} />
      <div className='Control'>
        <PrevButton first={first} audioBox={audioBox} isPlaying={isPlaying} current={current} setCurrent={setCurrent} />
        <Play first={first} audioBox={audioBox} setFirst={setFirst} isPlaying={isPlaying} setIsPlaying={setIsPlaying} current={current} />
        <NextButton first={first} audioBox={audioBox} isPlaying={isPlaying} current={current} setCurrent={setCurrent} />
        <PlusButton first={first} setVolume={setVolume} />
        <MinusButton first={first} setVolume={setVolume} />
      </div>
      <Logo />
      <Counter first={first} />
    </div>
  );
}

export default App;
