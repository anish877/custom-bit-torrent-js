const process = require("process");
const util = require("util");

function decodeBencode(bencodedValue) {
  if (!isNaN(bencodedValue[0])) {
    const firstColonIndex = bencodedValue.indexOf(":");
    if (firstColonIndex === -1) {
      throw new Error("Invalid encoded value");
    }
    return bencodedValue.substr(firstColonIndex + 1);
  } else if(bencodedValue[0]==='i' && bencodedValue[bencodedValue.length-1]==='e'){
      return(parseInt(bencodedValue.slice(1,-1)))
    }

    else if(bencodedValue[0]==='l' && bencodedValue[bencodedValue.length-1]==='e'){
      const list = []
      let bencodedElements = bencodedValue.slice(1,bencodedValue.length-1)
      if(bencodedElements===""){}
      else if(bencodedElements[0]==='l' && (bencodedElements[bencodedElements.length-1]==='e'&&isNaN(bencodedElements.charAt(bencodedElements.length-2)))){
        list.push(decodeBencode(bencodedElements))
      }
      else{
        while(true){
          const indexOfColon = bencodedElements.indexOf(':')
          const indexOfi = bencodedElements.indexOf('i')
          const indexOfl = bencodedElements.indexOf('l')

          if(indexOfColon===-1&&indexOfi===-1) {break}
          if(indexOfColon===1){
            const lengthOfString = parseInt(bencodedElements.charAt(indexOfColon-1))
            const encodedString = bencodedElements.slice(indexOfColon-1,indexOfColon+lengthOfString+1)
            const decodedString = decodeBencode(encodedString)
            bencodedElements = bencodedElements.slice(indexOfColon+lengthOfString+1)
            list.push(decodedString)
          }
          else if(indexOfi===0){
            const indexOfe = bencodedElements.indexOf('e')
            const encodedInteger = bencodedElements.slice(indexOfi,indexOfe+1)
            const decodedInteger = decodeBencode(encodedInteger)
            bencodedElements = bencodedElements.slice(indexOfe+1)
            list.push(decodedInteger)
          }
          else if(indexOfl===0){

          }
        }
      }
      return list
    }
    else{
      throw new Error("Invalid encoded value");
    }
  }


function main() {
  const command = process.argv[2];
  if (command === "decode") {
    const bencodedValue = process.argv[3];
    console.log(JSON.stringify(decodeBencode(bencodedValue)));
  } else {
    throw new Error(`Unknown command ${command}`);
  }
}

main();
