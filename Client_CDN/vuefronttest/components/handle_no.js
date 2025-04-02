const handle_error = {

    template: `
    <div class="not_found_pg">
       <div class="not_found_enc">
              <h1>404</h1>
              <h2>Page Not Found</h2>
              <br>
              <router-link to="/" class="btn-start">Home</router-link>
              <router-link to="/login" class="btn-log">Login</router-link>
         </div
    </div>

    `

}


const nof_style = document.createElement('style');
nof_style.textContent = `


.not_found_pg {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background: #f8f8f8;
} 
.not_found_enc {
    
    position: relative;    
    text-align: center;
    padding: 3rem;
    border-radius: 2.2rem;
    background: rgb(229, 248, 199);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border: 8px solid rgba(248, 248, 248, 0.51);
}
.not_found_enc h1 {
    font-size: 5rem;
    color: rgba(100, 12, 31, 0.71);
} 

.not_found_enc a{
    text-decoration: none;
    color: #fff;
    margin: 1rem 0.5rem; 
}


    

`;
document.head.appendChild(nof_style);
