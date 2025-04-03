// components/Login.js

const login = {
    template: `
   
    <div class="login_encloser">

   
    <router-link to="/" class="brandtext2" >  Whiz.it</router-link>
    
    
        <div class="log_box">
            <h2>Login</h2>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" v-model="email" id="email" placeholder="Enter your email" required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" v-model="password" id="password" placeholder="Enter your password" required />
                </div>
                <button class="log_n_btn" type="submit" :disabled="isLoading">
                    {{ isLoading ? 'Logging in...' : 'Login' }}
                </button>
                 <p></p>     <p class="alt_link" style="margin:0.5rem auto 0 3rem;"> Join in here : 
                   <router-link to="/signup">Sign up</router-link>
                   </p>
            </form>
            <div v-if="error" class="error">{{ error }}</div>
        </div>

        <div class="log_img">
            <img src="/assets/leaf.png" alt="leaf" />
        </div>
        <div class="log_img2">
            <img src="/assets/leaf.png" alt="leaf" />
        </div>
            
        </div>
  
    

    `,
    name: 'login',
    
    data() {
        return {
            email: '',
            password: '',
            error: '',
            isLoading: false
        };
    },
    
    methods: {
        async handleLogin() {
            this.isLoading = true;
            this.error = '';
            
            try {
                const result = await this.$store.dispatch('loginUser', {
                    email: this.email,
                    password: this.password
                });
                
                if (result.success) {
                    this.$router.push({ path: result.role === 'admin' ? '/admin/dash' : '/home' });
                }
            } catch (err) {
                this.error = err.message || 'An error occurred. Please try again.';
            } finally {
                this.isLoading = false;
            }
        }
    }
};

const log_styles = `

.log_img{
    position: absolute;
    top: 2rem;
    right: 19vw;
    z-index: -1;
    transform: rotate(65deg);
    }

    .log_img2 {
        position: absolute;

        bottom: 1rem;
        left: 20vw;   
        z-index: -1;
        transform: rotate(220deg);
    }
.brandtext2 {
        position: absolute;
        top: 1.3rem;
        left: 1.5rem;
        font-family: 'Rubik';
        font-size: 3rem;
        font-weight: 600;
        
        
        border-radius: 10rem;
        background: linear-gradient(135deg,rgba(190, 248, 115, 0.98) 1%,rgba(217, 236, 173, 0.97) 100%);
        padding: 0.5rem 1.6rem 0.5rem 1.6rem;

        text-decoration: none;
        color: rgb(61, 78, 45);
        font-family: 'Rubik';
        font-size: 2rem;
        z-index: 200;
    }

  
    /*.brandtext2 {
        position: absolute;
        top: 0.5rem;
        left: 9.5rem;
        font-family: 'Rubik';
        font-size: 3rem;
        font-weight: 600;
        
        margin: 2rem;
         border-radius: 10rem;
        background: linear-gradient(135deg,rgba(190, 248, 115, 0.98) 1%,rgba(217, 236, 173, 0.97) 100%);
        padding: 0.5rem 1.6rem 0.5rem 1.6rem;
    }

    .brandtext2 a {
     text-decoration: none;
     color: rgb(61, 78, 45);
     font-family: 'Rubik';
     font-size: 3rem;
    }*/


    .login_encloser {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color:rgba(226, 255, 185, 0.74);
    }

    .log_box {
        max-width: 20rem; !important
        margin: 5rem 20vw auto 2;
        padding: 2rem;
        border: 1px solid #ccc;
        border-radius: 1rem;
        background: linear-gradient(135deg,rgba(230, 252, 236, 0.18) 0%,rgb(243, 255, 239) 100%);
        box-shadow: 0 5px 9px rgba(0, 0, 0, 0.2);
    }

    .log_box h2 {
        font-family: 'Rubik', sans-serif;
        font-size: 2rem;
        color: rgb(84, 109, 60);
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        font-family: 'Mitr', sans-serif;
        color: rgb(96, 107, 76);
        font-size: 1rem;
    }

    input {
        width: 100%;
        padding: 0.8rem;
        margin-top: 0.5rem;
        border-radius: 0.5rem;
        border: 2px solid rgb(71, 78, 56);
        font-size: 1rem;
    }

    .log_n_btn {
        width: 100%;
        padding: 0.9rem 0.4rem;
        background-color: rgb(71, 151, 111); 
        color: white;
        border: none;
        border-radius: 5rem;
        font-size: 1.3rem;
        font-weight: 850;
        cursor: pointer;
        transition: background-color 0.3s ease, border 0.2s ease;
    }

    .log_n_btn:hover {
        background-color: rgba(151, 226, 121, 0.99);
        border: 5px solid rgb(36, 32, 32);
        font-weight: 800;
        color   : rgb(36, 32, 32);
    }

    .error {
        color: red;
        margin-top: 1rem;
        text-align: center;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = log_styles;
document.head.appendChild(styleSheet);