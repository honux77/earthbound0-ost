const mp3files = [
    "01. Mother Earth",
    "02. Pollyanna (I Believe in You)",
    "03. Bein' Friend",
    "04. Humoresque of a Little Dog",
    "05. Eight Melodies (Toy piano Version sx)",
    "06. Wisdom of The World",
    "07. TWINKLE Elementary School"
];

const getTitle = (filename, current) => {    
    if (mp3files[current] === filename) {
        return `${filename} *`
    }
    return filename
}

const PlayList = ({first, current, setCurrent }) => {
    const SIZE = 3;
    if (first) return;
    let sublist = mp3files.slice(0, SIZE);
    if (current > 0) sublist = mp3files.slice(current - 1, current + SIZE - 1);
    if (current == mp3files.length - 1) sublist = mp3files.slice(current - 2);
        
    return (
        <ul className="PlayList">
            {sublist.map((filename) => (
                <li key={filename}>{getTitle(filename, current)}</li>
            ))}
        </ul>
    );
}

export default PlayList;