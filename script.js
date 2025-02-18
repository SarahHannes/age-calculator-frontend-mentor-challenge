const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1; // js start month from 0
const todayDate = today.getDate();
console.log('todayYear', todayYear, typeof(todayYear))

const todayFullDate = {
    day: Number(todayDate),
    month: Number(todayMonth),
    year: Number(todayYear)
}

// GET ROOT STYLES //
// get the :root element defined in css
const root = document.querySelector(":root");
const rootStyles = getComputedStyle(root);
const warningColor = rootStyles.getPropertyValue("--light-red");
const borderColor = rootStyles.getPropertyValue("--light-grey");
const labelColor = rootStyles.getPropertyValue("--smokey-grey")

// GET ELEMENTS //
const labels = document.querySelectorAll("label");
const inputs = document.querySelectorAll('input');
const outputs = document.querySelectorAll('.output');
const button = document.querySelector('button');
const errorParas = document.querySelectorAll('p');


console.log('outputs', outputs)
console.log('errorParas', errorParas)
console.log('labels', labels)
console.log('inputs', inputs)
console.log('root', root)

const userInputs = {
    day: '',
    month: '',
    year: ''
}


function handleDayChange() {
    dayVal = day.value;
    let dayError = "";
    let newBorderColor = warningColor;
    let newLabelColor = warningColor;
    console.log('this is from handleDayChange', dayVal, typeof(dayVal))

    if (!dayVal) {
        dayError = "This field is required";
        userInputs['day'] = ""
    } else if (Number(dayVal) > 31 || Number(dayVal) < 1) {
        dayError = "Must be a valid day";
        userInputs['day'] = ""
    } else {
        userInputs['day'] = Number(dayVal);
        newBorderColor = borderColor;
        newLabelColor = labelColor;
    }

    updateInputStyles(inputs[0], labels[0], errorParas[0], dayError, newBorderColor, newLabelColor)

    // update color for the other 2 elements (triggered by isDateValid)
    const otherElemsIdx = [1,2]
    updateOtherElems(otherElemsIdx);

}


function handleMonthChange() {
    monthVal = month.value;
    let monthError = "";
    let newBorderColor = warningColor;
    let newLabelColor = warningColor;

    console.log("this is from handleMonthChange", monthVal, typeof(monthVal))
    if (!monthVal) {
        monthError = "This field is required";
        userInputs['month'] = "";
    } else if (Number(monthVal) < 1 || Number(monthVal) > 12) {
        monthError = "Must be a valid month";
        userInputs['month'] = "";
    } else {
        userInputs['month'] = Number(monthVal)
        newBorderColor = borderColor;
        newLabelColor = labelColor;
    }

    updateInputStyles(inputs[1], labels[1], errorParas[1], monthError, newBorderColor, newLabelColor);

    // update color for the other 2 elements (triggered by isDateValid)
    const otherElemsIdx = [0,2]
    updateOtherElems(otherElemsIdx);

}


// Remove warning css styling triggered by isDateValid on other input elements
function updateOtherElems(otherElemsIdx) {
    for (let i = 0; i<otherElemsIdx.length; i++) {
        j = otherElemsIdx[i];
        updateInputStyles(inputs[j], labels[j], errorParas[j], "", borderColor, labelColor);
    }
}

function handleYearChange() {
    updateInputStyles(inputs[2], labels[2], errorParas[2], "", borderColor, labelColor)

    yearVal = year.value;
    let yearError = "";
    let newBorderColor = warningColor;
    let newLabelColor = warningColor;

    console.log('this is from handleYearChange', yearVal, typeof(yearVal))
    if (!yearVal) {
        yearError = "This field is required";
        userInputs['year'] = "";
    } else if (Number(yearVal) < 1 || Number(yearVal) > todayYear) {
        yearError = "Must be in the past";
        userInputs['year'] = "";
    } else {
        userInputs['year'] = Number(yearVal);
        newBorderColor = borderColor;
        newLabelColor = labelColor;
    }

    updateInputStyles(inputs[2], labels[2], errorParas[2], yearError, newBorderColor, newLabelColor)

    // update color for the other 2 elements (triggered by isDateValid)
    const otherElemsIdx = [0,1]
    updateOtherElems(otherElemsIdx);

    console.log(yearError)
    console.log(userInputs)
    
}


function updateInputStyles(inputElem, labelElem, paraElem, textMsg, newBorderColor, newLabelColor) {
    // add error message
    paraElem.textContent = textMsg;
    // change color of input border
    inputElem.style.border = `1px solid ${newBorderColor}`;
    // change color of label
    labelElem.style.color = newLabelColor;
}

/* Leap year = Dividing the year by 4 will result in a whole number with no remainder if the number is evenly divisible. */
function isLeapYear(curYear) {
    // console.log(curYear, '/4', curYear/4, '%4', curYear%4)
    return curYear % 4 === 0;   
}

function isDateValid(userInputs) {
    let valid = true;
    let formError = "";
    const month30Days = [4, 6, 9, 11];

    const userInputDate = new Date(userInputs['year'], userInputs['month']-1, userInputs['day']);
    if (userInputDate > today) {
        console.log('user input is bigger than today')
        formError = "Must be in the past"
        updateFormStyles(formError, "year")
        valid = false;
    }

    // check for leap year
    else if (!isLeapYear(userInputs['year']) && userInputs['month'] === 2 && userInputs['day'] > 28) {
        console.log('is not leap year and got feb 29!')
        formError = "Must be a valid date"
        updateFormStyles(formError, "day")
        valid = false;
    }

    else if (month30Days.includes(userInputs['month']) && userInputs['day'] === 31) {
        formError = "Must be a valid date"
        updateFormStyles(formError, "day")
        console.log('month has only 30days, input is 31')
        valid = false;
    }

    return valid;

}


function updateFormStyles(formErrorMsg, errorPositionElem) {
    let errorPosition = 0
    if (errorPositionElem === 'month') {
        errorPosition = 1;
    } else if (errorPositionElem === 'year') {
        errorPosition = 2;
    }

    for (let i = 0; i<3; i++) {
        if (i === errorPosition) {
            updateInputStyles(inputs[i], labels[i], errorParas[i], formErrorMsg, warningColor, warningColor)
        } else {
            updateInputStyles(inputs[i], labels[i], errorParas[i], "", warningColor, warningColor)
        }
    }
}


function isEmpty() {
    let empty = false;
    let yearError = '';
    let monthError = '';
    let dayError = '';

    if (!year.value) {
        yearError = "This field is required";
        userInputs['year'] = "";
        updateInputStyles(inputs[2], labels[2], errorParas[2], yearError, warningColor, warningColor)
        empty = true;
    }
    
    if (!month.value) {
        monthError = "This field is required";
        userInputs['month'] = "";
        updateInputStyles(inputs[1], labels[1], errorParas[1], monthError, warningColor, warningColor)
        empty = true;
    }
    
    if (!day.value) {
        dayError = "This field is required";
        userInputs['day'] = "";
        updateInputStyles(inputs[0], labels[0], errorParas[0], dayError, warningColor, warningColor)
        empty = true;
    }

    return empty;

}

button.addEventListener("click", function(){
    let empty = isEmpty();
    let valid = isDateValid(userInputs);
    
    if (valid && !empty) {
        calc(userInputs, todayFullDate)
    }
})

function calc(userInputs, todayFullDate) {
    let todayYear = todayFullDate['year']
    let todayMonth = todayFullDate['month']
    let todayDay = todayFullDate['day']

    let userYear = userInputs['year']
    let userMonth = userInputs['month']
    let userDay = userInputs['day']

    let diffYear = todayYear - userYear;
    
    // get month diff
    let diffMonth = 0;
    if (todayMonth >= userMonth) {
        diffMonth = todayMonth - userMonth;
    } else if (todayMonth < userMonth){
        diffYear -= 1;
        diffMonth = 12 - (userMonth - todayMonth);
    }


    // get day diff
    let diffDay = 0;
    if (todayDay >= userDay) {
        diffDay = todayDay - userDay;

    } else if (userDay > todayDay) {

        if (diffMonth < 1) {
            diffYear -= 1;
            diffMonth += 11;
            diffDay = 31 - (userDay - todayDay);

        } else {
            diffMonth -= 1;
            diffDay = 31 - (userDay - todayDay);
        }
    }

    updateOutput([diffYear, diffMonth, diffDay])
}


function updateOutput(calcOutput) {
    counters = ['years', 'months', 'days'];
    
    for (let i = 0; i<3; i++) {    
        outputs[i].innerHTML = `<span class="purple-text">${calcOutput[i]}</span> ${counters[i]}`
    }    
}