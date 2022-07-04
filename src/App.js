import './App.css';

import React from 'react';

import Play from "./components/play";
import mp3files from './components/mp3files';
import PlayList from "./components/playlist";

import mp3 from "./mp3/01. Mother Earth.mp3";

function App() {  
  const [current, setCurruent] = React.useState(mp3files[0]);  

  const audio = new Audio(mp3);

  return (
    <div className="App">      
      <PlayList current={current} setCurrent={setCurruent}></PlayList>      
      <Play audio={audio}></Play>
    </div>
  );
}

export default App;
