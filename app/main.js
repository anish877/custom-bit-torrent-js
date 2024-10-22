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
      else{
        while(true){
          index = 0
          const indexOfColon = bencodedElements.indexOf(':')
          if(indexOfColon===-1){break}
          const lengthOfString = parseInt(bencodedElements.charAt(indexOfColon-1))
          const encodedString = bencodedElements.slice(indexOfColon-1,indexOfColon+lengthOfString+1)
          const decodedString = decodeBencode(encodedString)
          bencodedElements = bencodedElements.replace(encodedString,"")
          console.log(bencodedElements,encodedString,decodedString)
        }
        while(true){
          index=0
          const indexOfi = bencodedElements.indexOf('i')
          if(indexOfi===-1){break}
          const indexOfe = bencodedElements.indexOf('e')
          const endcodedInteger = bencodedElements.slice(indexOfi,indexOfe+1)
          const decodedInteger = decodeBencode(endcodedInteger)
          bencodedElements = bencodedElements.replace(endcodedInteger,"")
          console.log(bencodedElements,endcodedInteger,decodedInteger)
        }
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
