
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

  // Check URL hash for track number on initial load
  const getInitialTrack = () => {
    const hash = window.location.hash.slice(1);
    const trackNum = parseInt(hash, 10);
    if (!isNaN(trackNum) && trackNum >= 1 && trackNum <= audioBox.tracks.length) {
      return trackNum - 1; // Convert to 0-indexed
    }
    return 0;
  };

  const hasUrlTrack = () => {
    const hash = window.location.hash.slice(1);
    const trackNum = parseInt(hash, 10);
    return !isNaN(trackNum) && trackNum >= 1 && trackNum <= audioBox.tracks.length;
  };

  const [current, setCurrent] = React.useState(getInitialTrack);
  const [first, setFirst] = React.useState(!hasUrlTrack());
  const [isPlaying, setIsPlaying] = React.useState(hasUrlTrack());
      const [volume, setVolume] = React.useState(MAX_VOL - 2 * VOL_STEP);

      // Callback to advance to the next song when current song ends
      const handleNextSong = React.useCallback(() => {
          setCurrent((prevCurrent) => {
              const nextIndex = (prevCurrent + 1) % audioBox.tracks.length;
              return nextIndex;
          });
      }, [audioBox.tracks.length]);


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

    // Set the onSongEnd callback for the VGMPlayer instance
    audioBox.audio.onSongEnd = handleNextSong;

  }, [current, first, handleNextSong]);

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
      <Counter />
    </div>
  );
}

export default App;
