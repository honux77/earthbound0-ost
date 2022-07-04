import mp3files from "./mp3files";

const getTitle = (filename, current) => {
    const title = filename.substring(3, filename.length - 4);
    if (current === filename) {
        return `[${title}]`
    }
    return title
}

const PlayList = ({ current, setCurrent }) => {
    console.log(mp3files);
    return (
        <ul className="PlayList">
            {mp3files.map((filename) => (
                <li key={filename}>{getTitle(filename)}</li>
            ))}
        </ul>
    );
}

export default PlayList;