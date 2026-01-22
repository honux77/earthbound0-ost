
const { NES } = require('jsnes');
const nes = new NES({});
console.log("NES instance methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(nes)));
console.log("NES properties:", Object.keys(nes));
if (nes.cpu) {
    console.log("CPU methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(nes.cpu)));
}
if (nes.papu) {
    console.log("PAPU methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(nes.papu)));
}
