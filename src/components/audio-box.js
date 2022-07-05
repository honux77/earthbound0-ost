import track1 from "../mp3/01. Mother Earth.mp3";
import track2 from "../mp3/02. Pollyanna (I Believe in You).mp3";
import track3 from "../mp3/03. Bein' Friend.mp3";
import track4 from "../mp3/04. Humoresque of a Little Dog.mp3";
import track5 from "../mp3/05. Eight Melodies (Toy piano Version sx).mp3";
import track6 from "../mp3/06. Wisdom of The World.mp3";
import track7 from "../mp3/07. TWINKLE Elementary School.mp3";
import track8 from "../mp3/08. Snowman.mp3";
import track9 from "../mp3/09. The Paradise Line.mp3";
import track10 from "../mp3/10. Eight Melodies.mp3";
import track11 from "../mp3/11. Theme of Onett.mp3";
import track12 from "../mp3/12. Theme of Twoson.mp3";
import track13 from "../mp3/13. Theme of Threek.mp3";
import track14 from "../mp3/14. Theme of Saturn Valley.mp3"
import track15 from "../mp3/15. Theme of Bicycle (Spinning Pedals).mp3"
import track16 from "../mp3/16. Theme of Winters.mp3"
import track17 from "../mp3/17. Hospital Dub (I Want to be Called a Great Doctor).mp3"
import track18 from "../mp3/18. Lucky Nice Blues.mp3"
import track19 from "../mp3/19. Fourside (Held in the Skyscraper).mp3"
import track20 from "../mp3/20. Hotel (Pearl Necklace).mp3"
import track21 from "../mp3/21. Theme of Summers.mp3"
import track22 from "../mp3/22. Theme of Ramma.mp3"
import track23 from "../mp3/23. Eight Melodies.mp3"
import track24 from "../mp3/24. Light of Life.mp3"
import track25 from "../mp3/25. Because I Love You.mp3"
import track26 from "../mp3/26. Smiles and Tears.mp3"

const audioBox = {
    tracks: [],
    audio: null
};

audioBox.tracks.push(track1);
audioBox.tracks.push(track2);
audioBox.tracks.push(track3);
audioBox.tracks.push(track4);
audioBox.tracks.push(track5);
audioBox.tracks.push(track6);
audioBox.tracks.push(track7);
audioBox.tracks.push(track8);
audioBox.tracks.push(track9);
audioBox.tracks.push(track10);
audioBox.tracks.push(track11);
audioBox.tracks.push(track12);
audioBox.tracks.push(track13);
audioBox.tracks.push(track14);
audioBox.tracks.push(track15);
audioBox.tracks.push(track16);
audioBox.tracks.push(track17);
audioBox.tracks.push(track18);
audioBox.tracks.push(track19);
audioBox.tracks.push(track20);
audioBox.tracks.push(track21);
audioBox.tracks.push(track22);
audioBox.tracks.push(track23);
audioBox.tracks.push(track24);
audioBox.tracks.push(track25);
audioBox.tracks.push(track26);

audioBox.audio = new Audio(track1);

export default audioBox;
