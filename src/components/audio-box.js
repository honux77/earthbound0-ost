
import VGMPlayer from "../utils/VGMPlayer";

const audioBox = {
    tracks: [],
    audio: null
};

audioBox.tracks = [
    "vgz/01 MOTHER EARTH.vgz",
    "vgz/02 MY HOME.vgz",
    "vgz/03 POLTERGEIST.vgz",
    "vgz/04 POLLYANNA (I BELIEVE IN YOU).vgz",
    "vgz/05 BASEMENT.vgz",
    "vgz/06 BATTLE THEME 1.vgz",
    "vgz/07 BATTLE THEME 2.vgz",
    "vgz/08 BATTLE THEME 3.vgz",
    "vgz/09 Victory.vgz",
    "vgz/10 Fanfare 1.vgz",
    "vgz/11 Level Up.vgz",
    "vgz/12 Game Over.vgz",
    "vgz/13 HUMORESQUE OF A LITTLE DOG.vgz",
    "vgz/14 SOUTH CEMETERY.vgz",
    "vgz/15 BEIN' FRIENDS.vgz",
    "vgz/16 CHOUCREAM ZOO.vgz",
    "vgz/17 CAVE 1.vgz",
    "vgz/18 MAGICANT.vgz",
    "vgz/19 WISDOM OF THE WORLD.vgz",
    "vgz/20 TWINKLE ELEMENTARY SCHOOL.vgz",
    "vgz/21 FACTORY.vgz",
    "vgz/22 THE PARADISE LINE.vgz",
    "vgz/23 SNOW MAN.vgz",
    "vgz/24 Fanfare 2.vgz",
    "vgz/25 Sleep.vgz",
    "vgz/26 ADVENT DESERT.vgz",
    "vgz/27 AIRPLANE.vgz",
    "vgz/28 TANK.vgz",
    "vgz/29 RUINS OF DESERT.vgz",
    "vgz/30 EASTER.vgz",
    "vgz/31 LIVE HOUSE.vgz",
    "vgz/32 ALL THAT I NEEDED (WAS YOU).vgz",
    "vgz/33 CAVE 2.vgz",
    "vgz/34 HOLY LOLY MOUNTAIN.vgz",
    "vgz/35 FALLIN' LOVE, AND.vgz",
    "vgz/36 Tombstone (POLLYANNA (I BELIEVE IN YOU)).vgz",
    "vgz/37 Eight Melodies.vgz",
    "vgz/38 Queen Mary's Song (EIGHT MELODIES).vgz",
    "vgz/39 GIEGUE.vgz",
    "vgz/40 ENDING.vgz"
].map(t => t);

audioBox.audio = new VGMPlayer();

export default audioBox;
