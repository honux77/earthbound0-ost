import './App.css';

import React from 'react';

import Play from "./components/play";
import PlayList from "./components/playlist";

import mp3 from "./mp3/01. Mother Earth.mp3";
import startBackground from "./images/start.jpg";
import playingBackground from "./images/playing.jpg";
import logo from "./images/mother-logo.gif"
import stoppedLogo from "./images/mother-logo-nospin.png"


function App() {  
  const [current, setCurruent] = React.useState(0);  
  const [first, setFirst] = React.useState(true);
  const [audio] = React.useState(new Audio(mp3));
  const [isPlaying, setIsPlaying] = React.useState(false);        

  const currBackground = first ? startBackground: playingBackground;

  const Logo = ()=> {
    if (first) return;
    const image = isPlaying ? logo: stoppedLogo;
    return (
      <div className="Logo"><img alt="NES EarthBound Zero Logo" src= {image}></img></div>
    );
    
  }
  
  return (
    <div className="App" style={{backgroundImage: `url(${currBackground})` }}>      
      <PlayList first={first} current={current} setCurrent={setCurruent}></PlayList>      
      <Play audio={audio} setFirst={setFirst} isPlaying={isPlaying} setIsPlaying={setIsPlaying}></Play>
      <Logo></Logo>
    </div>
  );
}

export default App;
