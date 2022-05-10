
const colorPicker = document.getElementById("colorInput")
const colorInputDiv = document.getElementById("colorInputDiv")
const colorMode = document.getElementById("colorMode")
const getSchemeBtn = document.getElementById("getScheme")

// formatting of the color picker input field
colorInputDiv.style.backgroundColor = colorPicker.value
colorPicker.addEventListener("change", () => {
    colorInputDiv.style.backgroundColor = colorPicker.value
})

// adding back the focus outline that's lost because opacity is set to 0 on the color input
colorPicker.addEventListener("focus", function () {
    colorInputDiv.style.boxShadow = "0px 0px 5px white"
})
colorPicker.addEventListener("blur", function () {
    colorInputDiv.style.boxShadow = ""
})

// function for calling the API and getting the scheme back
function getNewScheme() {

    // remove hashtag from color picker value to be able to send correct format to the API
    const color = colorPicker.value.replace('#', '')

    const url = `https://www.thecolorapi.com/scheme?hex=${color}&mode=${colorMode.value}&count=5`

    // store HTML string to render to page
    let output = ""

    // call the API
    fetch(url)
        .then(res => res.json())
        .then(data => {

            // get the different hex values and create html string
            for (const color of data.colors) {
                output += `
                <div>
                <div class="bg" style="background-color: ${color.hex.value}"></div>
                <div class="hex">${color.hex.value}</div>
                </div>
                `
            }
            // render finished HTML to page
            document.getElementById("main").innerHTML = output

            // update copyHex so the div Array references are updated with the new HTML
            copyHex()
        })
}

function textPopup() {
    document.getElementById("copied").style.display = "block"
    setTimeout(() => {
        document.getElementById("copied").style.display = "none"
    }, 800)
}

// function for copying the hex values
function copyHex() {
    // getting an array of the HTML inside the function as the divs change each time the API is called
    let copyText = Array.from(document.getElementsByClassName("hex"))

    copyText.forEach((field) => {
        field.onclick = () => {

            // this clipboard function doesn't work in the Scrimba browser, but works fine on a local copy 
            navigator.clipboard.writeText(field.innerText).then(function () {
                // display "text copied" popup
                textPopup()
            }, function () {
                // display "text copied" popup
                textPopup()

                // if clipboard copy doesn't work 
                // navigator.clipboard is not supported in Scrimba browser, so used this workaround as provided by Bence in the Scrimba Discord 💜
                const dummyArea = document.createElement("textarea") // we create a dummy textarea
                document.body.appendChild(dummyArea) // add it to the dom
                dummyArea.value = field.innerText // set its text 
                dummyArea.select() // select everything in the textarea
                document.execCommand("copy") // copy it to the clipboard
                document.body.removeChild(dummyArea) // little clean up by removing it
            })
        }
    })
}

// call function when page is loaded so you can copy right away
copyHex()

// events for getting new scheme
getSchemeBtn.addEventListener("click", getNewScheme)
colorMode.addEventListener("change", getNewScheme)
colorInputDiv.addEventListener("change", getNewScheme)