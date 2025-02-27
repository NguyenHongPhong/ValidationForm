function Validator(formSelector) {
    var formRule = {};
    var form = document.getElementById(formSelector);

    var handleValidation = {
        required: (val) => {
            return val ? undefined : "Entering information, please !!!"
        },
        email: (val) => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(val) ? undefined : "You have entered invalid email !!!"; 
        },
        min: (min, val) => {
            return val.length >= 8 ? undefined : `The data must be have ${min} characters at least !!!`;
        },
        isEqual: (comapringSelector, val) => {
            var inputComparing = form.querySelector(comapringSelector);
            if(inputComparing) {
                return inputComparing.value === val ? undefined : `The data is not equal with ${inputComparing.name}`;
            }
        }
    }

    if(form) {
       var inputs = form.querySelectorAll('[name][rules]');
       for(var input of inputs) {
            var rules = input.getAttribute('rules');
            var splitRules = rules.split('|');
            for(var splitRule of splitRules) {
                var ruleAnother;
                if(splitRule.includes(':')) {
                    ruleAnother = splitRule.split(":");
                    splitRule = ruleAnother;
                    
                } else if(splitRule.includes('-')) {
                    ruleAnother = splitRule.split("-");
                    splitRule = ruleAnother;
                };
                
                if(!formRule[input.name]) {
                    formRule[input.name] = []
                };                
                
                formRule[input.name].push(splitRule);
            }

            handleOnBlur(input);
            handleOnChange(input);
        };
        onSubmit(form);
    }

    function handleOnBlur(input) {
        var mess;
        input.addEventListener('blur', () => {
            for(var i = 0; i < formRule[input.name].length; i++)  {
                if(Array.isArray(formRule[input.name][i]))  {
                    mess = handleElementInArr(formRule[input.name][i], input.value);
                } else {
                    mess = handleValidation[formRule[input.name][i]](input.value);
                };
                
                if (mess) {
                    message(input, mess);
                    break;
                };
            };
        });
    };

    function handleOnChange(input) {
        input.addEventListener('input', () => {
            var inputParent = input.parentElement;
            while(inputParent) {
                if(inputParent.matches('.form-group')) {
                    var elementMessage = inputParent.querySelector('#message-error');
                    if(elementMessage) {
                        elementMessage.classList.remove('validation-message');
                        input.classList.remove('validation');
                        elementMessage.innerText = '';
                    };
                };
                inputParent = inputParent.parentElement;   
            }
        });
        
    }

    function message(input, mess) {
        var messageElement;
        while (input.parentElement) {
            if(input.parentElement.matches('.form-group')) {
                 input.classList.add('validation');
                 messageElement = input.parentElement.querySelector('#message-error');
                if(messageElement) {
                    messageElement.innerText = mess;
                };
            };
            input = input.parentElement;
        };
        messageElement.classList.add('validation-message');
    };    

    function handleElementInArr(arr, val) {
        return handleValidation[arr.at(0)](arr.at(1), val);
    }

    function onSubmit(form) {
        var inputs = form.querySelectorAll('[name][rules]');
        const submitBtn = form.querySelector("#submit-btn");
        var mess;
        if(submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                var flag = true;
                var data = Array.from(inputs).reduce((acc, input) => {
                    for(var i = 0; i < formRule[input.name].length; i++)  {
                        if(Array.isArray(formRule[input.name][i]))  {
                            mess = handleElementInArr(formRule[input.name][i], input.value);
                        } else {
                            mess = handleValidation[formRule[input.name][i]](input.value);
                        };
                        
                        if (mess) {
                            flag = !mess;
                            message(input, mess);
                            break;
                        };
                    };
                    acc[input.name] = input.value;
                    return acc;
                }, {});
                        if(!flag) {
                            return undefined;
                        } else {
                            console.log(data);
                           // Khi in ra vòng lặp quá nhiều số lần cần thiết
                        }
                    
            });
        };
        
    }
}