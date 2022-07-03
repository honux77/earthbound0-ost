import './App.css';
import React from 'react';
import Play from "./components/play";

import bgm1 from "./mp3/01-mother-earth.mp3"

function App() {
  const [audio] = React.useState(new Audio(bgm1));  

  return (
    <div className="App">      
      <div className="list"></div>
      <Play audio={audio}></Play>
    </div>
  );
}

export default App;
