import mp3files from "./mp3files";

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