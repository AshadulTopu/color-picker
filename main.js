
/*
Date : 08-04-2023
Author : MD. Ashadul Islam
Reference : HM Nayem 
Description : Color picker application using javascript.
*/

// global
let toastMsg = null;

const defaultColor ={
    red: 221,
    green: 222,
    blue : 238,
}
/**
 * onload function
 */
window.onload = function(){
    main()
    updateColorCodeToDOM(defaultColor)
}

/**
 * main function
 */

function main() {
    //DOM reference 
    const generateColorBtn = document.getElementById('color-btn');
    const copyColorClipboard = document.getElementById('copy-btn');
    const inputHexColor = document.getElementById('input');
    const colorSliderRed = document.getElementById('color-slider-red')
    const colorSliderGreen = document.getElementById('color-slider-green')
    const colorSliderBlue = document.getElementById('color-slider-blue')
    
    // Event Listener 
    generateColorBtn.addEventListener('click', handleGenerateColorBtn)
    inputHexColor.addEventListener('keyup', handleInputHexColor)
    colorSliderRed.addEventListener('change', handleSliderColor(colorSliderRed, colorSliderGreen, colorSliderBlue))
    colorSliderGreen.addEventListener('change', handleSliderColor(colorSliderRed, colorSliderGreen, colorSliderBlue))
    colorSliderBlue.addEventListener('change', handleSliderColor(colorSliderRed, colorSliderGreen, colorSliderBlue))
    copyColorClipboard.addEventListener('click', handleCopyToClipboard)
}

/**
 * update dom elements with calculated color value
 * @param {object} color: ;
 */
function updateColorCodeToDOM(color){
    const hexColor = generateColorHex(color)
    const rgbColor = generateColorRGB(color)

    document.querySelector('.color-plate').style.backgroundColor = hexColor
    document.getElementById('input').value = hexColor.substring(1).toUpperCase();
    document.getElementById('output').value = rgbColor;
    document.getElementById('color-slider-red').value = color.red;
    document.getElementById('color-slider-green').value = color.green;
    document.getElementById('color-slider-blue').value = color.blue;
    document.getElementById('color-slider-red-label').innerText = color.red;
    document.getElementById('color-slider-green-label').innerText = color.green;
    document.getElementById('color-slider-blue-label').innerText = color.blue;

}


// event handler
function handleGenerateColorBtn(){
    const color = generateColorDecimal();
    updateColorCodeToDOM(color)   
}
function handleInputHexColor(e){
    const hexColor = e.target.value
    if (hexColor){
        this.value = hexColor.toUpperCase()
        if(isValidHex(hexColor)){
            const colorDecimal = hexToDecimal(hexColor)
            updateColorCodeToDOM(colorDecimal)
        }else if(hexColor.length > 6){
            generateToastMsg(`#${hexColor.toUpperCase()} Invalid color`)
        }
    }
}

function handleSliderColor(colorSliderRed,colorSliderGreen,colorSliderBlue){
    return function(){
        const color ={
            red : parseInt(colorSliderRed.value),
            green : parseInt(colorSliderGreen.value),
            blue : parseInt(colorSliderBlue.value),
        }
        updateColorCodeToDOM(color)
    }
}

function handleCopyToClipboard(){
    const colorModeRadios = document.getElementsByName('color-mode')
    const copyMode = getCheckedRadioValue(colorModeRadios)
    if(copyMode === null){
        throw new Error('Invalid Radio Input');
    }

    //remove existing toast message
    if(toastMsg !== null){
        toastMsg.remove();
        }


    if(copyMode === 'hex'){
        const hexColor =  document.getElementById('input').value

        if(hexColor && isValidHex(hexColor)){
            navigator.clipboard.writeText(`#${hexColor}`)
            generateToastMsg(`#${hexColor} copied`)
        }else{
            alert('Invalid color code');
        }
    }
    else{
        const rgbColor =  document.getElementById('output').value
        
        if(rgbColor){
            navigator.clipboard.writeText(rgbColor)
            generateToastMsg(`${rgbColor} copied`)
        }else{
            alert('Invalid color code');
        }
    }
}

/**
 * DOM function
 * @param {*} msg 
 */

//active toast message
function generateToastMsg(msg){
    toastMsg = document.createElement('p')

    //create dynamic toast message (color code)
    toastMsg.innerText = msg
    document.body.appendChild(toastMsg)
    toastMsg.className = 'toast-message toast-msg-in'

    // remove the toast message when user clicks inside the toast message
    toastMsg.addEventListener('click', function(){
        toastMsg.classList.remove('toast-msg-in');
        toastMsg.classList.add('toast-msg-out');

        // remove toast message permanently when user clicked  it.
        toastMsg.addEventListener("animationend", function(){
        toastMsg.remove();
        toastMsg = null; // remove previous toast message 
        })
    });
    // clear toast message after a timeout
    setTimeout(() => {
        document.body.removeChild(toastMsg)
    }, 4000)
}

/**
 * find the checked elements from a list of radio btn
 * @param{array} nodes
 */
function getCheckedRadioValue(nodes){
    let checkedValue = null;
    for(let i=0; i<nodes.length; i++){
        if(nodes[i].checked){
            checkedValue = nodes[i].value;
            break;
        }
    }
    return checkedValue;
}


// utils function

/**
 * generate and return three color object
 * @returns 
 */
//Generate random color
function generateColorDecimal(){
    const red = Math.floor(Math.random() * 256)
    const green = Math.floor(Math.random() * 256)
    const blue = Math.floor(Math.random() * 256)

    return {
        red,
        green,
        blue,
    }
}
// Generate Hex color
function generateColorHex({red, green, blue}){
    
    const getTwoCode = (value) =>{
        const hex = value.toString(16)
        return hex.length == 1? `0${hex}` : hex;
    }
    
    return `#${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`
}

// Generate RGB color 
function generateColorRGB({red, green, blue}){
    return `rgb(${red}, ${green}, ${blue})`
}

// create hex to rgb function
function hexToDecimal(hex){
    const red = parseInt(hex.slice(0,2), 16)
    const green = parseInt(hex.slice(2,4), 16)
    const blue = parseInt(hex.slice(4), 16)
    return {
        red,
        green,
        blue
    }
}

   // create isHexValid function
function isValidHex(color){
    if(color.length !== 6 ) return false;
    return /^[0-9A-Fa-f]{6}$/i.test(color) // checking color is valid using Regx 
    
}

