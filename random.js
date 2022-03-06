

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
   offset = Math.floor(Math.random() * (randoms.length /2));
   console.log("offset", offset);
}

let finalArray = [];

function offsetArray(){    
    for(i=0; i < premintNumber; i++){
            finalArray.push(randoms[i])
        }

    for(i=premintNumber; i< (arraysize); i++){
          const id = randoms[i] + offset
      
            if(id > arraysize -1 ){
                const n = (id - (arraysize -1) )+(premintNumber -1);                           
                finalArray.push(n);                
            } else {
                 finalArray.push(id);
                }
            }
    return finalArray.sort((a,b)=> a-b);
}

function checkFinal() {
        let checkset = new Set();
        for(i=0; i<= arraysize-1; i++){
            checkset.add(finalArray[i])
        }
    return checkset.size
}

function execute (_premintNumber, _arraysize){
    premintNumber = _premintNumber;
    arraysize = _arraysize;
    fillArray();
    console.log("premint",premint(), array.length);    
    console.log("pickrandoms",pickRandoms(), "randoms length", randoms.length)
    setOffset();
    console.log("OFFSET",offsetArray(), "length", finalArray.length)
    console.log("checkset", checkFinal())
}

fillArray();
execute(100, 10000);