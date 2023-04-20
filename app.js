const validateText = (text) => {
    const onlyNoSpecialCharWords = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/
    return onlyNoSpecialCharWords.test(text)
}

const cryptograph = (cryptographyDictionary, text, errorMsg) => {
    const isTextValid = validateText(text.trim())
    if (isTextValid) {
        const textArray = text.toLowerCase().trim().split("")
        const dictionaryKeysArray = Object.keys(cryptographyDictionary)
        const encryptedTextArray = textArray.map((character) => {
            const needsCryptograph = dictionaryKeysArray.includes(character)
            return needsCryptograph ? cryptographyDictionary[character] : character
        })
        const encryptedText = encryptedTextArray.join("")
        return { encryptedText: encryptedText }
    }
    return { error: errorMsg }
}

const decrypt = (decryptDictionary, text, errorMsg) => {
    const isTextValid = validateText(text.trim())
    if (isTextValid) {
        const dictionaryKeys = Object.keys(decryptDictionary)
        let decryptedText = text
        dictionaryKeys.forEach((key) => {
            decryptedText = decryptedText.replaceAll(key, decryptDictionary[key])
        })
        return { decryptedText: decryptedText }
    }
    return { error: errorMsg }
}

const revertObject = (originalObject) => {
    const objKeys = Object.keys(originalObject)
    const reversedObject = {}
    objKeys.forEach((key) => {
        reversedObject[originalObject[key]] = key
    })
    return reversedObject
}

const displayTextOutputResultsScreen = (resultText) => {
    const textOutputWrapper = document.querySelector("#textOutputWrapper")
    const textOutput = textOutputWrapper.querySelector("#textOutput")
    const textOutputContent = document.querySelector("#textOutputContent")
    textOutputContent.style.display = "none"
    textOutputWrapper.style.display = "block"
    textOutput.textContent = resultText
}

const displayTextOutputErrorScreen = (errorMsg) => {
    const textOutputWrapper = document.querySelector("#textOutputWrapper")
    const textOutputContent = document.querySelector("#textOutputContent")
    const textOutputImage = textOutputContent.querySelector(".textOutputImage")
    textOutputImage.style.display = "none"
    textOutputWrapper.style.display = "none"
    textOutputContent.style.display = "block"
    const textOutputTitle = textOutputContent.querySelector(".title")
    const textOutputMessage = textOutputContent.querySelector(".message")
    textOutputTitle.textContent = "Mensagem Inválida!"
    textOutputMessage.textContent = errorMsg
}

const handleCryptographBtnClick = (cryptographyDictionary, errorMsg) => {
    const textInput = document.querySelector("#textInput")
    const text = textInput.value
    const cryptography = cryptograph(cryptographyDictionary, text, errorMsg)
    if (!cryptography.error) {
        displayTextOutputResultsScreen(cryptography.encryptedText)
    } else {
        displayTextOutputErrorScreen(cryptography.error)
    }
}

const handleDecryptBtnClick = (decryptDictionary, errorMsg) => {
    const textInput = document.querySelector("#textInput")
    const text = textInput.value
    const decryption = decrypt(decryptDictionary, text, errorMsg)
    if (!decryption.error) {
        displayTextOutputResultsScreen(decryption.decryptedText)
    } else {
        displayTextOutputErrorScreen(decryption.error)
    }
}

const showCopyAlert = (msDisplayTime)=>{
    const copyAlert = document.querySelector(".copyAlert")
    copyAlert.style.visibility = "visible"
    copyAlert.style.opacity = "100"
    setTimeout(function hideCopyAlert() {
        copyAlert.style.visibility = "hidden"
        copyAlert.style.opacity = "0"
    }, msDisplayTime)
}

const handleCopyBtnClick = async () => {
    const textOutput = document.getElementById("textOutput")
    try {
        await navigator.clipboard.writeText(textOutput.innerText);
    } catch (_) {
        // fallback to incompatible browsers
        const range = document.createRange();
        range.selectNodeContents(textOutput);
        window.getSelection().removeAllRanges();  // clear selection
        window.getSelection().addRange(range);    // create a new selection
        document.execCommand("copy");             // copy selection to clipboard
        window.getSelection().removeAllRanges();  // unselect
    }
    showCopyAlert(1500)
}

const CryptographyDictionary = { e: "enter", i: "imes", a: "ai", o: "ober", u: "ufat" }
const decryptDictionary = revertObject(CryptographyDictionary)
const errorMsg = "Texto inválido! Por favor utilize apenas letras minúsculas, sem acento, sem números e sem caracteres especiais"

const cryptographBtn = document.querySelector(".cryptographBtn")
const decryptBtn = document.querySelector(".decryptBtn")
const copyBtn = document.querySelector(".copyBtn")

cryptographBtn.addEventListener("click", () => handleCryptographBtnClick(CryptographyDictionary, errorMsg))

decryptBtn.addEventListener("click", () => handleDecryptBtnClick(decryptDictionary, errorMsg))

copyBtn.addEventListener("click", handleCopyBtnClick)