
let array = [];
let arraysize
let premintNumber;

    function fillArray(){
        for(let i=0; i < arraysize; i++){
        array.push(0)
        }
    }

    function premint(){
        
        for(i=0; i < premintNumber; i++){
            const id = i;
            array[id] = array.length -1;            
            array.pop();
            randoms.push(id);
        }
        return array;
    }
//with an empty array initialized to a certain length we can randomly select 
function pickRandom(){
    const random = Math.floor(Math.random() * (array.length))  
   
    if(array[random] === 0 && array[array.length -1] === 0){   
        const id = random;
        array[random] = array.length -1;
        array.pop();
        //console.log("id",id)
        return id
    } else if(array[random] !== 0 && array[array.length - 1] === 0) {
        const id = array[random]
        array[random] = array.length-1
        array.pop();
        //console.log("non 0 id", id)
        return id;
    } else if(array[random] !== 0 && array[array.length -1] !==0){
        const id = array[random]
        array[random] = array[array.length -1]
        array.pop()
        return id
    } else{
        //(array[random] == 0 && array[array.length -1] !==0)
        const id = random
        array[random] = array[array.length - 1]
        //console.log("0 rand non zero end", id)
        array.pop()
        return id
    } 
}

let randoms = []
function pickRandoms(){
    console.log("ARRAY LENGTH",array.length)
    const arraylength = array.length
    
    for( let i = 0; i< arraylength; i++){
        const rand = pickRandom();       
        randoms.push(rand);
    }
    return randoms
    //.sort((a,b)=> a-b);
}




let offset = 0;

function setOffset(){
   offset = Math.floor(Math.random() * randoms.length);
   console.log("offset", offset);
}

let finalArray = [];

    function offsetArray(){    
        for(i=0; i < premintNumber -1; i++){
            finalArray.push(randoms[i])
        }

        for(i=(premintNumber -1); i< (randoms.length -1); i++){
          const id = randoms[i] + offset
        console.log("ID", randoms[i], " + OFFSET",offset, "=", id)
            if(id > arraysize -1 ){
                const n = (id - (arraysize -1) )+(premintNumber -1);
                console.log("premint", premintNumber, "+ id", n);               
                finalArray.push(n);                
            } else {
                console.log("less than array size", id);
                finalArray.push(id);
                }
            }
            return finalArray.sort((a,b)=> a-b);
    }

function execute (_premintNumber, _arraysize){
    premintNumber = _premintNumber;
    arraysize = _arraysize;
    fillArray();
    console.log("premint",premint(), array.length);    
    console.log("pickrandoms",pickRandoms(), "randoms length", randoms.length)
    setOffset();
    console.log("OFFSET",offsetArray(), "length", finalArray.length)

}

fillArray();
execute(15, 60);