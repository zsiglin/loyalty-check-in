const LoyaltyCheckIn = {
    init(){
        this.setBindings();
    },

    domElements: {
        loader: document.querySelector('#loader-container'),
        newUserForm: document.querySelector('#new-user-form'),
        numberPad: document.querySelector('#number-pad'),
        initialGreeting: document.querySelector('#initial-greeting'),
        newUserGreeting: document.querySelector('#new-user-greeting'),
        apiDisplay: document.querySelector('#api-display'),
        phoneNumber: document.querySelector('#phone-number-display'),
        newUserRegister: document.querySelector('#new-user-register'),
        resetNewUserRegistration: document.querySelector('#reset-new-user-registration'),
        newUserPhoneNumber: document.querySelector('#new-user-phone-number') 
    },

    setBindings(){
        // number pad entry
        this.domElements.numberPad.addEventListener('click', (e) => {
            const { target } = e;
            const value = target.innerText;
            
            const number = parseInt(value) >= 0;
            const backspace = target.classList.contains('backspace');
            const checkIn = target.classList.contains('check-in');

            if(number){
                NumberPad.setPhoneNumber({ action: 'add', value });

            } else if(backspace){
                NumberPad.setPhoneNumber({ action: 'remove' });

            } else if(checkIn){
                LoyaltyCheckInAPI.checkIn(NumberPad.phoneNumberToDigits()).then((resp) => {
                    const { newUser } = resp;

                    if(!newUser){
                        NumberPad.setPhoneNumber({ action: 'check-in' });
                    }
                });
            }
        });

        // new user registration form
        this.domElements.newUserForm.addEventListener('submit', (e) => {
            const { newUserForm } = LoyaltyCheckIn.domElements;
            const formData = {
                phoneNumber: NumberPad.phoneNumberToDigits(),
                ...this.mapFormData(newUserForm)
            };

            e.preventDefault();

            LoyaltyCheckInAPI.signUp(formData).then(() => {
                this.resetNewUserRegistration();
            });
        });

        this.domElements.resetNewUserRegistration.addEventListener('click', (e) => {
            this.resetNewUserRegistration(true);
        });
    },

    mapFormData(form){
        const formData = {};

        new FormData(form).forEach((val, key) => {
            formData[key] = val;
        });

        return formData;
    },

    setMessage(message, time=5000){
        const { phoneNumber, initialGreeting, apiDisplay } = this.domElements;

        apiDisplay.innerText = message;

        phoneNumber.classList.add('hide');
        initialGreeting.classList.add('hide');
        apiDisplay.classList.remove('hide');

        setTimeout(() => { this.showHideGreeting(); }, time);
    },

    showHideGreeting(){
        const { phoneNumber, newUserForm, initialGreeting, apiDisplay } = this.domElements;

        apiDisplay.classList.add('hide');

        const notNewUser = newUserForm.classList.contains('hide');
        const phoneNumberEntered = NumberPad.phoneNumber.length > 0 && notNewUser;
        
        if(phoneNumberEntered){
            initialGreeting.classList.add('hide');
            phoneNumber.classList.remove('hide');

        } else if(notNewUser){
            phoneNumber.classList.add('hide');
            initialGreeting.classList.remove('hide');
        }
    },

    setLoader(on){
        const { loader } = this.domElements;

        if(on){
            loader.classList.remove('hide');
        } else {
            loader.classList.add('hide');
        }
    },

    newUserRegistration(){
        const { newUserForm, newUserGreeting, phoneNumber, numberPad } = LoyaltyCheckIn.domElements;
        
        newUserForm.classList.remove('hide');
        newUserGreeting.classList.remove('hide');
        phoneNumber.classList.add('hide');
        numberPad.classList.add('hide');
    },

    resetNewUserRegistration(noSignUp){
        const { newUserForm, initialGreeting, newUserGreeting, numberPad } = LoyaltyCheckIn.domElements;

        newUserForm.reset();
        NumberPad.phoneNumber = [];

        if(noSignUp){
            initialGreeting.classList.remove('hide');
        }

        newUserForm.classList.add('hide');
        newUserGreeting.classList.add('hide');
        numberPad.classList.remove('hide');
    }
};

const LoyaltyCheckInAPI = {
    checkIn(phoneNumber){
        return this.post('/users/check-in/create', { phoneNumber }).then((data) => {
            return this.handleResponse(data);
        });
    },

    signUp(user){
        return this.post('/users/create', user).then((data) => {
            return this.handleResponse(data);
        });
    },

    // private
    handleResponse(data){
        const { success, error } = data;
        const retVal = {};
        
        if(success){
            const { newPointsEarned, totalPoints, totalCheckIns } = success;
            retVal.success = true;

            LoyaltyCheckIn.setMessage(`Woohoo! You earned ${newPointsEarned} points, for a total of ${totalPoints} and ${totalCheckIns} check-in(s).`, 10000);
        } else if(error){
            retVal.error = error;

            if(error === 'User not found.'){
                LoyaltyCheckIn.newUserRegistration();
                retVal.newUser = true;

            } else {
                LoyaltyCheckIn.setMessage(error);    
            }
        }

        return Promise.resolve(retVal);
    },

    post(url, data){
        LoyaltyCheckIn.setLoader(true);

        return fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((response) => {
            LoyaltyCheckIn.setLoader(false);
            return response.json();
        });
    }
};

const NumberPad = {
    phoneNumber: [],

    setPhoneNumber({ action, value }){
        const { phoneNumber, newUserPhoneNumber } = LoyaltyCheckIn.domElements;

        if(action === 'add' && this.phoneNumber.length < 10){
            this.phoneNumber.push(value);
            LoyaltyCheckIn.showHideGreeting();

        } else if(action === 'remove'){
            this.phoneNumber.pop();
            LoyaltyCheckIn.showHideGreeting();

        } else if(action === 'check-in'){
            this.phoneNumber = [];

        }

        phoneNumber.innerText = this.formatPhoneNumber();
        newUserPhoneNumber.innerText = this.formatPhoneNumber();
    },

    formatPhoneNumber(){
        const phoneNumber = [...this.phoneNumber];

        for(let index=0; index<phoneNumber.length; index++){

            // area code parenthesis
            if(index === 3){
                phoneNumber.unshift('(');
                phoneNumber.splice(index + 1, 0, ') ');
            }

            // hyphen to split
            if(index === 8){
                phoneNumber.splice(index, 0, '-');
            }
        }

        return phoneNumber.join('');
    },

    phoneNumberToDigits(){
        return this.phoneNumber.join('');
    }
};

LoyaltyCheckIn.init();
