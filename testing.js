const Aplha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const array = []

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

let i = 0;

while(true){
    i++
    const newrandom = Random_File(2, 4)
    if(array.some(arr => arr == newrandom)){
        const index = array.findIndex(arr => arr == newrandom)
        console.log(`In index ${index} find same ${newrandom}\nTry total ${i} times`)
        break
    }else{

        console.log(`${Math.round(i/10000)} | new random ${newrandom}`)
        array.push(newrandom)
    }

}