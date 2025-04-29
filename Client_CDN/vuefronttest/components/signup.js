// components/Signup.js

const signup = {
    template: `
    <div class="bg">    
        <router-link to="/" class="brandtext2">  Whiz.it</router-link>
        <div class="signup-container">
            <h2>Signup</h2>
            <form @submit.prevent="validateAndSignup">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" v-model="email" @input="validateEmail" :class="{ 'valid': emailValid === true, 'invalid': emailValid === false }" id="email" placeholder="Enter your email" required />
                    <div v-if="emailValid === false" class="validation-message">Invalid email format.</div>
                </div>
                <div class="form-group">
                    <label for="full_name">Full Name</label>
                    <input type="text" v-model="full_name" @input="validateName" :class="{ 'valid': nameValid === true, 'invalid': nameValid === false }" id="full_name" placeholder="Enter your full name" required />
                    <div v-if="nameValid === false" class="validation-message">Name must be at least 2 characters.</div>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" v-model="password" @input="validatePassword" :class="{ 'valid': passwordValid === true, 'invalid': passwordValid === false }" id="password" placeholder="Enter your password" required />
                    <div v-if="passwordValid === false" class="validation-message">Password must be at least 6 characters.</div>
                </div>
                <button class="snup-btn" type="submit">Signup</button>
                <p></p>
                <p class="alt_link" style="margin:0.5rem auto 0 2.7rem;"> Continue here : 
                    <router-link to="/login">Log in</router-link>
                </p>
            </form>
            <div v-if="error" class="error">{{ error }}</div>
        </div>
    </div>
    `,
    name: 'signup',
    
    data() {
        return {            
            email: '',
            full_name: '',
            password: '',
            error: '',
            emailValid: null, // init null
            nameValid: null,
            passwordValid: null,
        };
    },
    
    methods: {
        validateEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            this.emailValid = emailRegex.test(this.email);
        },
        validateName() {
            this.nameValid = this.full_name.length >= 2;
        },
        validatePassword() {
            this.passwordValid = this.password.length >= 6;
        },
        validateAndSignup() {
            this.validateEmail();  // Force validation before submitting
            this.validateName();
            this.validatePassword();

            if (this.emailValid && this.nameValid && this.passwordValid) {
                this.signup(); // Call the original signup method
            } else {
                this.error = 'Please correct the errors in the form.'; // important general error message
            }
        },

        async signup() {
            try {
                const response = await fetch('https://whiz-it.onrender.com/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({                        
                        email: this.email,
                        full_name: this.full_name,
                        password: this.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token and user role in local storage
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('role', data.role);

                    // Redirect based on user role
                    //if (data.role === 'admin') {
                        //this.$router.push({ path: '/admin' });
                    //} else {
                        //this.$router.push({ path: '/user' });
                    //
                    this.$router.push({ path: '/login' });
                    

                } else {
                    this.error = data.message;
                }
            } catch (err) {
                this.error = 'An error occurred. Please try again.';
            }
        }
    }
};


const styles = `
    .bg {
        background-image: url('/assets/signpb.jpg');
        background-size: cover;
        background-position: center;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: -1;
    }
    
    .signup-container {
        max-width: 20rem;
        margin: 5rem auto;
        padding: 2rem;
        border: 1px solid #ccc;
        border-radius: 1rem;
        background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .signup-container h2 {
        font-family: 'Rubik', sans-serif;
        font-size: 2rem;
        color: rgb(61, 78, 45);
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        font-family: 'Mitr', sans-serif;
        color: rgb(107, 76, 87);
        font-size: 1rem;
    }

    input {
        width: 100%;
        padding: 0.8rem;
        margin-top: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid #ccc;
        font-size: 1rem;
        transition: border-color 0.2s ease; /* Add transition for smooth color change */
    }

    /* Validation Styles */
    input.valid {
        border-color: green;
    }

    input.invalid {
        border-color: red;
    }
    .validation-message{
        color:red;
        font-size:0.8rem;
        margin-top:0.2rem;
    }

    .snup-btn {
        width: 100%;
        padding: 0.6rem 0.5rem;
        background-color: rgba(234,91,60,255);
        color: white;
        border: none;
        border-radius: 5rem;
        font-size: 1.5rem;
        font-weight: 850;
        cursor: pointer;
        transition: background-color 0.3s ease, border 0.2s ease;
    }

    .snup-btn:hover {
        background-color: rgba(240, 102, 72, 0.94);
        border: 5px solid rgb(36, 32, 32);
        font-weight: 800;
    }

    .error {
        color: red;
        margin-top: 1rem;
        text-align: center;
    }
`;

const addStylesToDocument = (styles) => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
};

addStylesToDocument(styles);
