import { colorStyleArray } from "./data.js"


const colorFormEl = document.getElementById("color-form")
const colorContainer = document.getElementById("color-container")


getColorStyles(colorStyleArray)
intializeColorContainer(colorFormEl)



function getColorStyles(colorStyleArray){
    let optionList=""
    
    for(let option of colorStyleArray)
        optionList+=`<option>${option}</option>`

    document.getElementById("color-style-element").innerHTML= optionList
}

function intializeColorContainer(){
    const randomHex= getRandomHex()
    setColorContainer({color_seed: `${randomHex}`, color_style: "monochrome"})
    document.getElementById("color-selector").value = randomHex
}

function getRandomHex(){
    const hexValues = "01234567890abcdef"
    let randHex = "#"
    for(let i=0; i<6; i++){
        randHex += hexValues[Math.floor(Math.random()*16)]
    }

    return randHex
}

function setColorContainer(formData){
    

    formData.color_seed = formData.color_seed.slice(1)
    formData.color_style = formData.color_style.toLowerCase()

    fetch(`https://www.thecolorapi.com/scheme?hex=${formData.color_seed}&mode=${formData.color_style}`)
    .then(res => res.json())
    .then(data => updateColorContainer(data.colors))
}


function updateColorContainer(colors){
        let colorElements= ""
        let colorText = ""
        colors.forEach(color => {
            colorElements+=`
                <div class="color-block" style="background-color:${color.hex.value}" data-hex="${color.hex.value}"></div>
            `
            colorText+=`<div class="color-text" data-hex="${color.hex.value}"><span data-hex="${color.hex.value}">${color.hex.value}</span></div>`
        })
        colorContainer.innerHTML = colorElements + `<div class="color-tag-list">${colorText}</div>`
}

let hasAnimationFinished = true

colorContainer.addEventListener("click", e=>{

        if(hasAnimationFinished){
            hasAnimationFinished = !hasAnimationFinished

            navigator.clipboard.writeText(e.target.dataset.hex);
            const copyAlert = document.getElementById("copy-alert")

            copyAlert.classList.toggle("hidden")
            copyAlert.classList.toggle("unhide")
            setTimeout(()=>copyAlert.classList.toggle("unhide"), 500)

            copyAlert.classList.toggle("hide")
            setTimeout(()=>{
                copyAlert.classList.toggle("hide")
                copyAlert.classList.toggle("hidden")
                hasAnimationFinished = !hasAnimationFinished
            }, 1000)
}
})

colorFormEl.addEventListener("submit", e =>{
    e.preventDefault()
    const formData = new NormalizeData(new FormData(e.target))
    setColorContainer(formData)
})


function NormalizeData(formData){
    for(let data of formData){
        this[data[0]] = data[1]
    }
}

