/*

let array = [];
const arraysize = 1000

function fillArray(){
for(let i=0; i<arraysize; i++){
    array.push(0)
}

}
//with an empty array initialized to a certain length we can randomly select 
function pickRandom(){
    const random = Math.floor(Math.random() * array.length)  
    let id;
    if(array[random]==0 && array[array.length -1] == 0){   
    id = random;
    array[random] = array.length -1;
    array.pop();
    console.log("id",id)
    return id
    } if(array[random] !== 0 && array[array.length - 1] == 0) {
    id = array[random]
    array[random] = array.length-1
    array.pop();
    console.log("non 0 id", id)
    return id;
    } if(array[random] !== 0 && array[array.length -1] !==0){
    id = array[random]
    array[random] = array[array.length -1]
    array.pop()
    return id
    } if(array[random] == 0 && array[array.length -1] !==0){
        id = random
        array[random] = array[array.length - 1]
        console.log("0 rand non zero end", id)
        array.pop()
        return id
    }
}

let randoms = []
function pickRandoms(){
    
    for( let i = 0; i<arraysize; i++){
        let rand = pickRandom()
        console.log("random pick", rand)
        randoms.push(rand);
    }
    return randoms.sort()
}

fillArray();
console.log("set", pickRandoms(), randoms.length);
*/