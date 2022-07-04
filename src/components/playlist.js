

const getTitle = (songs, filename, current) => {    
    if (songs[current] === filename) {
        return `${filename} *`
    }
    return filename
}

const makeList = (audios) => (audios.map((a) => {
    const songArr = decodeURI(a.src).split("/")    
    const songfile = songArr[songArr.length - 1].split(".");
    return `${songfile[0]}.${songfile[1]}`;        
    }));

const PlayList = ({first, current, audios }) => {
    const songs = makeList(audios);    
    const SIZE = 3;
    if (first) return;
    let sublist = songs.slice(0, SIZE);
    if (current > 0) sublist = songs.slice(current - 1, current + SIZE - 1);
    if (current === songs.length - 1) sublist = songs.slice(current - 2);
        
    return (
        <ul className="PlayList">
            {sublist.map((filename) => (
                <li key={filename}>{getTitle(songs, filename, current)}</li>
            ))}
        </ul>
    );
}

export default PlayList;