const process = require("process");
const util = require("util");

// Examples:
// - decodeBencode("5:hello") -> "hello"
// - decodeBencode("10:hello12345") -> "hello12345"
function decodeBencode(bencodedValue) {
  // Check if the first character is a digit
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
      if(bencodedElements===""){
        return list
      }
      else if(bencodedElements[0]==='l' && bencodedElements[bencodedElements.length-1]==='e'){
        decodeBencode(bencodedElements)
      }
      else{
        while(true){
          const indexOfColon = bencodedElements.indexOf(':')
          const indexOfi = bencodedElements.indexOf('i')
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
        }
        return list
      }
    }
    else{
      throw new Error("Invalid encoded value");
    }
  }


function main() {
  const command = process.argv[2];

  // Uncomment this block to pass the first stage
  if (command === "decode") {
    const bencodedValue = process.argv[3];
  
    // In JavaScript, there's no need to manually convert bytes to string for printing
    // because JS doesn't distinguish between bytes and strings in the same way Python does.
    console.log(JSON.stringify(decodeBencode(bencodedValue)));
  } else {
    throw new Error(`Unknown command ${command}`);
  }
}

main();
