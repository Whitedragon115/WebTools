const Aplha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function Token() {

    let String = "MFA";

    String += ShortTokenChunk() + ".";
    String += LongTokenChunk() + ".";
    String += VeryLongTokenChunk() + ".";
    String += LongTokenChunk() + ".";
    String += ShortTokenChunk() + ".";
    String += ShortTokenChunk();

    return String;
}

function ShortTokenChunk() {
    let chunk = "";

    for (let j = 0; j < 10; j++) {
        chunk += Aplha[Math.floor(Math.random() * Aplha.length)];
    }

    return chunk;
}

function LongTokenChunk() {
    let chunk = "";

    for (let j = 0; j < 25; j++) {
        chunk += Aplha[Math.floor(Math.random() * Aplha.length)];
    }

    return chunk;
}

function VeryLongTokenChunk() {
    let chunk = "";

    for (let j = 0; j < 48; j++) {
        chunk += Aplha[Math.floor(Math.random() * Aplha.length)];
    }

    return chunk;
}

module.exports = {
    Token
}