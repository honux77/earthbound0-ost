const mp3files = [
    "01. Mother Earth.mp3",
    "02. Pollyanna (I Believe in You).mp3",
    "03. Bein' Friend.mp3",
    "04. Humoresque of a Little Dog",
    "05. Eight Melodies (Toy piano Version sx)"
];

const getTitle = (filename, current) => {
    const title = filename.substring(3, filename.length - 4);
    if (mp3files[current] === filename) {
        return `${title} *`
    }
    return title
}

const PlayList = ({first, current, setCurrent }) => {
    if (first) return;
    return (
        <ul className="PlayList">
            {mp3files.map((filename) => (
                <li key={filename}>{getTitle(filename, current)}</li>
            ))}
        </ul>
    );
}

export default PlayList;