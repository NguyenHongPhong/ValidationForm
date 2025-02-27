var Validator = (option) => {
    const form = document.getElementById(option.form);
    if(form) {
        const submitBtn = form.querySelector("#submit-btn");
        option.rules.forEach((rule)=> {
            const element = form.elements[rule.selector];
            element.addEventListener('blur', () => {  
                Validator.validate(rule, element, option.errorSelector);
            })
            
            element.addEventListener('input', () => {
                Validator.eliminateValidation(element, option.errorSelector);
            })
        })

        if(submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Validator.onSubmit(option, form);
            });
        }
    }
}

Validator.selectorHandler = {};

Validator.onSubmit = (option, form) => {
    //PROCESSING
    var flag = true;
    option.rules.forEach((rule)=> {
        const element = form.elements[rule.selector];
        var isInvalid = Validator.validate(rule, element, option.errorSelector);
        
        if(!isInvalid) {
            flag = isInvalid;
        } 
    })

    if(!flag) {
        return
    } else {
        var getInputs = form.querySelectorAll('[name]');
        var objetcInput = Array.from(getInputs).reduce((acc, input) => {
             acc[input.name] = input.value;
             return acc;
        }, {})

        console.log(objetcInput);
        
    };
}

Validator.isRequire = (selector) => {
   const objectRequirement = {
        selector: selector,
        handleInput: (value) => value ? undefined : 'You must enter information !!!'
   }
    return objectRequirement; 
}

Validator.isEmail = (selector) => {
    const objectRequirement = {
        selector: selector,
        handleInput: (value) => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "You have entered invalid email !!!";
        }
   }
    return objectRequirement; 
}

Validator.validate = (input, element, errorSelector) => {
    var messageError;
    const messageElement = element.parentElement.querySelector(errorSelector);
   
    if(Array.isArray(Validator.selectorHandler[input.selector])) {
        !Validator.selectorHandler[input.selector].includes(input.handleInput)
        &&
        Validator.selectorHandler[input.selector].push(input.handleInput);
    } else {
        Validator.selectorHandler[input.selector] = [input.handleInput];
    }
    
   for(var i = 0 ; i < Validator.selectorHandler[input.selector].length ; i++) {
            messageError =  Validator.selectorHandler[input.selector][i](element.value);
            if(messageError) {
                break;
            }
   }

    if(messageError) {
        element.classList.add('validation');
        messageElement.classList.add('validation-message');
        messageElement.innerText = messageError;
    } else {
        messageElement.innerText = '';
        element.classList.remove('validation');
        messageElement.classList.remove('validation-message');
    } 

    
    return !messageError;

}

Validator.eliminateValidation = (element, errorElement) => {
    const getErrorElement = element.parentElement.querySelector(errorElement);
    getErrorElement.innerText = '';
    element.classList.remove('validation');
    getErrorElement.classList.remove('validation-message');
}

Validator.checkLengthInput = (selector) => {
    const checkLength = (val) => {
        return  val.trim().length < 8 ? "The value input must have 8 characters at least" : undefined;
    }
    const objectRequirement = {
         selector: selector,
         handleInput:(value) => {
            return checkLength(value);
         }
    }
     return objectRequirement; 
 }


Validator.checkIsqual = ( selectorConfirmation, selectorPassword, form, message) => {
    const isEqual = (val) => {
        const getForm = document.getElementById(form);
        if(getForm) {
            const getInputPassword = getForm.querySelector('#' + selectorPassword);
            if (getInputPassword && val) {
                return getInputPassword.value.trim() === val.trim() ? undefined : message || "The strings are not not equal";
            }
        }
    }
    const objectRequirement = {
         selector: selectorConfirmation,
         handleInput:(value) => {
            return isEqual(value);
         }
    }
    return objectRequirement; 
}
