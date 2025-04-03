const Land = {
    name: 'Land',
    template: `
<div class="topsec">
    <a class="brandtext">Whiz.it</a>
</div>     

<div class="shape-blob"></div>
<div class="shape-blob2"></div>

<div class="encloser">           
    <div class="left_enc">
        <h1 class="t1">Master Everything</h1>
        <h3 class="t2">Challenge Yourself with Interactive Quizzes
        Join thousands of learners mastering subjects through engaging quizzes
        </h3>
        <div class="cta-buttons">
            <router-link to="/signup" class="btn btn-start">Join us Now</router-link>
            <router-link to="/login" class="btn btn-log">Log back in</router-link>
        </div>
    </div>
    <div class="right_enc">
        <img src="/assets/webp2.png" alt="Landing Image">
    </div>
</div> 

<!-- New Sections -->
<section class="quiz-section">
    <div class="container">
        <h2 class="section-heading text-center">Quizzes for Every Mood! 🌈</h2>
        <div class="row">
            <div class="col-md-4 text-center category-card">
                <i class="fas fa-film quiz-icon floating-icon"></i>
                <h3>Pop Culture</h3>
                <p>Test your knowledge of movies, music, and celebrity trivia!</p>
            </div>
            <div class="col-md-4 text-center category-card">
                <i class="fas fa-brain quiz-icon floating-icon"></i>
                <h3>Personality</h3>
                <p>Discover which famous character matches your personality!</p>
            </div>
            <div class="col-md-4 text-center category-card">
                <i class="fas fa-lightbulb quiz-icon floating-icon"></i>
                <h3>Fun Facts</h3>
                <p>Learn surprising truths about everyday things!</p>
            </div>
        </div>
    </div>
</section>
<br>
<br>


<section class="quiz-section bg-light">
    <div class="container">
        <h2 class="section-heading text-center">Your Daily Dose of Delight ✨</h2>
        <div class="row">
            <div class="col-md-6">
                <div class="value-card">
                    <i class="fas fa-stopwatch text-primary"></i>
                    <h4>Quick & Easy</h4>
                    <p>Bite-sized quizzes perfect for coffee breaks!</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="value-card">
                    <i class="fas fa-laugh-beam text-primary"></i>
                    <h4>Stress-Free Fun</h4>
                    <p>No pressure - just pure entertainment!</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="value-card">
                    <i class="fas fa-share-alt text-primary"></i>
                    <h4>Shareable Results</h4>
                    <p>Amuse your friends with your quirky outcomes!</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="value-card">
                    <i class="fas fa-star text-primary"></i>
                    <h4>Curated Content</h4>
                    <p>Fresh quizzes added weekly!</p>
                </div>
            </div>
        </div>
    </div>
</section>
<br>
<br>

<section class="quiz-section">
    <div class="container">
        <h2 class="section-heading text-center">Staff Picks! 🌟</h2>
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card h-100 border-0">
                    
                    <div class="card-body">
                        <h4>For Movie Buffs</h4>
                        <p>Can you name these iconic film characters?</p>
                        <router-link to="/signup" class="quiz_btn">Take Quiz </router-link>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100 border-0">
                    
                    <div class="card-body">
                        <h4>The Foodie Trivia</h4>
                        <p>Guess the origin!</p>
                        <router-link to="/signup" class="quiz_btn">Take Quiz</router-link>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100 border-0">
                   
                    <div class="card-body">
                        <h4>Geoguesser</h4>
                        <p>How well do you know these streets?</p>
                        <router-link to="/signup" class="quiz_btn">Take Quiz</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
    `,
    
    
    data() {
        return {
            
        }
    },

    methods: {
        
    },

    beforeCreate() {
        const accessToken = localStorage.getItem('access_token');
        const role = localStorage.getItem('role');

        if (accessToken && role) {
            if (role === 'admin') {
                this.$router.push('/admin/dash');
            } else {
                this.$router.push('/home');
            }
        }
    }
}

addStyles(`
:root {
    --color-primary: #FF6B6B;
    --color-secondary: #4ECDC4;
    --color-accent: #FFE66D;
    --primary-color: #3D4E2D;
    --accent-color: #BEF873;
}

.topsec {
    background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;        
}

.brandtext {    
    flex: 1 1 0;
    font-size: 3rem;
    font-weight: 600;
    color: rgb(61, 78, 45);
    text-decoration: none;
    font-family: 'Rubik', sans-serif;
    max-width: 15rem;
    margin: 1rem 10rem;
    border-radius: 10rem;
    background: linear-gradient(135deg, rgba(190, 248, 115, 0.98) 1%, rgba(217, 236, 173, 0.97) 100%);
    padding: 0.5rem 1rem 0.5rem 1.6rem;
}

.encloser {
    background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
    display: flex;   
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1rem auto;
    height: 100vh;
    gap : 5vw;
    margin-left: 12rem;
}

.left_enc {
    margin-top: 2rem;
    flex: 1 1 0;
    display: flex;
    flex-direction: column;        
    max-width: 45rem;
    gap: 0.2rem;
}


.right_enc {
    padding: 0rem 1rem 0rem 3rem;
}

.right_enc img {
    width: 30vw;
    height: 56vh;
    border-radius: 1rem;
}

.t1 {
    font-family: 'Rubik', sans-serif;
    font-size: 4.5rem;
    line-height: 1.2;
    margin-bottom: 1.7rem;
    color: rgb(62, 80, 45);
    text-align: left;
}

.t2 {
    font-family: 'Mitr', sans-serif;
    color: rgba(107, 76, 87, 0.78);
    font-size: 2.2rem;
    margin: 1rem 0.5rem 3.5rem 0.3rem;
    max-width: 45rem;
    font-weight: 400;
}

.btn-start {
    background-color: rgba(245, 108, 77, 0.97);
    border: 6px solid rgba(59, 37, 31, 0.17);
    border-radius: 5rem;
    font-weight: 800;
    transition: background-color 0.3s ease;
    transition: border 0.2s ease;    
    margin-left: 0rem;
    font-size: 2.2rem;
    padding: 1.63rem 2.6rem;
}

.btn-start:hover {
    background-color: rgba(241, 104, 73, 0.94);
    border: 7px solid rgba(36, 32, 32,0.5);
    font-weight: 800;
}

.btn-log {
    background-color: rgba(106, 206, 204, 0.97);
    border: 6px solid rgba(45, 87, 86, 0.17);
    border-radius: 5rem;
    font-weight: 770;
    transition: background-color 0.3s ease;
    transition: border 0.2s ease;
    margin-left: 1rem;
    font-size: 2.2rem;
    padding: 1.53rem 2.6rem;
}

.btn-log:hover {
    background-color: rgba(113, 224, 187, 0.82);
    border: 7px solid rgba(36, 32, 32,0.5);
    font-weight: 800;
}

.quiz-section {
    
    padding: 0 4rem 0;
    border-bottom: 3px dashed #f0f0f0;
}

.section-heading {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.category-card {
    transition: transform 0.3s ease;
    border: none;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
}

.category-card:hover {
    transform: translateY(-5px);
}

.quiz-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--color-primary);
}

.value-card {
    background: white;
    border-radius: 15px;
    padding: 25px;
    margin: 15px 0;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.quiz-thumbnail {
    border-radius: 12px;
    height: 200px;
    object-fit: cover;
}



.quiz_btn {
    display: inline-block;
    background: var(--color-primary);
    color: white;
    padding: 0.4rem 0.9rem;
    font-size: 1.2rem;
    border-radius: 1.5rem;
    border: none;
    transition: all 0.3s ease;
    text-decoration: none;
    margin: 1rem !important;
}

.quiz_btn:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 15px rgba(255,107,107,0.3);
}

@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}

.floating-icon {
    animation: float 3s ease-in-out infinite;
}

@media (max-width: 768px) {
    .topsec {
        padding: 1rem;
        margin: 0.5rem;
    }

    .brandtext {
        font-size: 2.5rem;
        margin: 0.5rem;
        padding: 0.5rem 1rem 0.5rem 1.6rem;
    }

    .encloser {
        padding: 1rem 1rem 2rem 1.8rem;
    }

    .right_enc {
        display: none;
    }

    .t1 {
        font-size: 2.8rem;
    }

    .t2 {
        font-size: 1.2rem;
    }

    .btn-start {
        display: inline-block;
        padding: 0.9rem 1.5rem;
        font-size: 1.5rem;
        margin: 0.5rem 0.1rem;
    }

    .btn-log {
        display: inline-block;
        padding: 0.7rem 2.6rem;
        font-size: 1.6rem;
        margin-left: 0.1rem;
    }
}
    
`);