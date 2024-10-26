const process = require("process");
const util = require("util");
const fs = require('fs');
const path = require("path");
const crypto = require('crypto')

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
      else{
        while(true){
          const indexOfColon = bencodedElements.indexOf(':')
          const indexOfi = bencodedElements.indexOf('i')
          const indexOfl = bencodedElements.indexOf('l')
          const indexOfd = bencodedElements.indexOf('d')

          if(indexOfColon===-1&&indexOfi===-1) {break} 

          if(indexOfi===0){

            const indexOfe = bencodedElements.indexOf('e')
            const encodedInteger = bencodedElements.slice(indexOfi,indexOfe+1)
            const decodedInteger = decodeBencode(encodedInteger)
            bencodedElements = bencodedElements.slice(indexOfe+1)
            list.push(decodedInteger)

          } 
          else if(indexOfl===0){

            let temp = bencodedElements
            while(true){
              const indexOfe = temp.lastIndexOf('e')
              if(!isNaN(temp.charAt(indexOfe-1))){
                temp = temp.slice(0,indexOfe)
                continue
              }
              else{
                const encodedList = bencodedElements.slice(0,indexOfe+1)
                const decodedList = decodeBencode(encodedList)
                list.push(decodedList)
                bencodedElements = bencodedElements.slice(indexOfe+1)
                break
              }
            }

          }
          else if(indexOfd===0){
            let temp = bencodedElements
            while(true){
              const indexOfe = temp.lastIndexOf('e')
              if(!isNaN(temp.charAt(indexOfe-1))){
                temp = temp.slice(0,indexOfe)
                continue
              }
              else{
                const encodedDictionary = bencodedElements.slice(0,indexOfe+1)
                const decodedDictionary = decodeBencode(encodedDictionary)
                list,push(decodedDictionary)
                bencodedElements = bencodedElements.slice(indexOfe+1)
                break
              }
            }
          }
          else{

            const lengthOfString = parseInt(bencodedElements.slice(0,indexOfColon))
            const encodedString = bencodedElements.slice(0,indexOfColon+lengthOfString+1)
            const decodedString = decodeBencode(encodedString)
            bencodedElements = bencodedElements.slice(indexOfColon+lengthOfString+1)
            list.push(decodedString)

          }
        }
      }
      return list
    }
    else if(bencodedValue[0]==='d'&&bencodedValue[bencodedValue.length-1]==='e'){
      let dictonary = {}
      let bencodedElements = bencodedValue.slice(1,bencodedValue.length-1)
      while(true){
        let value = ''
        const indexOfColon = bencodedElements.indexOf(':')

        if(indexOfColon===-1){break}

        const lengthOfKey = parseInt(bencodedElements.slice(0,indexOfColon))
        const encodedKey = bencodedElements.slice(0,indexOfColon+lengthOfKey+1)
        const decodedKey = decodeBencode(encodedKey)
        bencodedElements = bencodedElements.slice(indexOfColon+lengthOfKey+1)
        const indexOfElementColon = bencodedElements.indexOf(':')
        const indexOfElementi = bencodedElements.indexOf('i')
        const indexOfElementl = bencodedElements.indexOf('l')
        const indexOfElementd = bencodedElements.indexOf('d')

        if(indexOfElementi===0){
          const indexOfElmente = bencodedElements.indexOf('e')
          const encodedInteger = bencodedElements.slice(indexOfElementi,indexOfElmente+1)
          const decodedInteger = decodeBencode(encodedInteger)
          bencodedElements = bencodedElements.slice(indexOfElmente+1)
          value = decodedInteger
        }
        else if(indexOfElementl===0){
          let temp = bencodedElements
          while(true){
            const indexOfe = temp.lastIndexOf('e')
            if(!isNaN(temp.charAt(indexOfe-1))){
                temp = temp.slice(0,indexOfe)
                continue
            }
            else{
              const encodedList = bencodedElements.slice(0,indexOfe+1)
              const decodedList = decodeBencode(encodedList)
              value = decodedList
              bencodedElements = bencodedElements.slice(indexOfe+1)
              break
            }
          } 
        }
        else if(indexOfElementd===0){
          let temp = bencodedElements
          while(true){
            const indexOfe = temp.lastIndexOf('e')
            if(!isNaN(temp.charAt(indexOfe-1))){
              temp = temp.slice(0,indexOfe)
              continue
            }
            else{
              const encodedDictionary = bencodedElements.slice(0,indexOfe+1)
              const decodedDictionary = decodeBencode(encodedDictionary)
              value = decodedDictionary
              bencodedElements = bencodedElements.slice(indexOfe+1)
              break
            }
          }
        }
        else{
          const stringLength = parseInt(bencodedElements.slice(0,indexOfElementColon))
          const encodedString = bencodedElements.slice(0,indexOfElementColon+stringLength+1)
          const decodedString = decodeBencode(encodedString)
          bencodedElements = bencodedElements.slice(indexOfElementColon+stringLength+1)
          value = decodedString
        }
        dictonary[decodedKey] = value

      }
      return dictonary
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
  }
  else if(command==='info'){
    const file = process.argv[3]
    const content = fs.readFileSync(path.resolve(process.cwd(),file)).toString()
    const stringedContent = content.toString()
    const decodedContent = decodeBencode(stringedContent)
    const indexOfinfo = stringedContent.indexOf('4:info')
    const bencodedInfo = Buffer.from(stringedContent.slice(indexOfinfo+7))
    const hashedInfo = crypto.createHash('sha1').update(bencodedInfo).digest('hex')
    console.log(hashedInfo)

  }
   else {
    throw new Error(`Unknown command ${command}`);
  }
}

main();
