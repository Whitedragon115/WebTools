const Aplha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function Random_File(chunkL, length) {
    const Array = [];

    for(let i = 0; i < length; i++) {
        let chunk = "";
        for(let j = 0; j < chunkL; j++) {
            chunk += Aplha[Math.floor(Math.random() * Aplha.length)];
        }
        Array.push(chunk);
    }
    
    return Array.join("-");
}

module.exports = {
    Random_File
}