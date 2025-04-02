// components/UserDashboard.js

const User = {
    name: 'user',
    components: {
        usernavbar
    },
    template: `
       
        
        <div class="userdash_enc">

        <div class="unav_enc">
        <usernavbar></usernavbar>
        </div>
           
           
                <div class="user_welcome">                    
                    <h2>Welcome back, {{ userName }}</h2>
                    <p> Catch up on your latest quizzes.. </p>
                </div>

            <!-- Available Quizzes Section -->
            <div class="c_sec quiz_sec">              
                
                    
                    <h3>Available Quizzes</h3>
                                        
                    <div class="quiz_display">
                        <div v-for="quiz in newQuiz" :key="quiz.id" class="quiz-card ">
                            <div class="quiz-card-content">
                                <div class="quiz-info">
                                <h3 class="quiz-title">{{ quiz.title }}</h3>
                                <p class="quiz-subject">{{ quiz.chapter_name }}</p>
                                <p class="quiz-subject">{{quiz.subject_name }}</p>
                                </div>
                                <button class="quiz-btn" @click="startQuiz(quiz.id)" :disabled="isPastQuiz(quiz.date_of_quiz)">
                                <i class="bi bi-caret-right-fill"></i>

                                </button>
                            </div>

                        </div>
                    </div>
                
            </div>
            <!-- Stats Overview -->
            
                <div class="u_stats">
                    <div class="u_stat_card">                       
                        <div class="u_stat_content">
                            <h3>{{ averageScore }}%</h3>
                            <p>Average Score</p>
                        </div>
                    </div>
                    <div class="u_stat_card">                      
                        <div class="u_stat_content">
                            <h3>{{ completedQuizzes }}</h3>
                            <p>Quizzes Attempted</p>
                        </div>
                    </div>
                    <div class="u_stat_card">                        
                        <div class="u_stat_content">
                            <h3>{{ subjects.length }}</h3>
                            <p>Active Subjects</p>
                        </div>
                    </div>
                    <div class="u_stat_card">                        
                        <div class="u_stat_content">
                            <h3>{{ active_quizzes }}</h3>
                            <p>Active Quizzes</p>
                        </div>
                    </div>
                </div>

            

            <!-- Past Performance Section -->
            <div class="history_sec">
                
                    <h3><i class="fas fa-history"></i> Past Performance</h3>
               
                
                    <table class="histable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Quiz</th>
                                <th>Score</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="score in userScores" :key="score.id">
                                <td>{{ score.id }}</td>
                                <td>{{ score.quiz_title }}</td>
                                <td>
                                    <div class="score-bar">
                                        <div class="score-progress" :style="{ width: score.score + '%' }">
                                            {{ score.score }}%
                                        </div>
                                    </div>
                                </td>
                                <td>{{ formatDate(score.timestamp) }}</td>
                                <td>
                                    <span :class="getScoreStatusClass(score.score)">
                                        {{ getScoreStatus(score.score) }}
                                    </span>
                                </td>
                                <td>
                                <button @click="score_summary(score.id)" 
                                    >
                                    View Summary
                                </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                
            </div>

            
        </div>
    `,

    data() {
        return {
            userName: this.$store.state.user,
            userEmail: '',
            subjects: [],
            selectedSubject: '',
            availableQuizzes: [],
            userScores: [],
            averageScore: 0,
            completedQuizzes: 0,
            newQuiz: []
        };
    },
    computed:{
        allQuizzes() {
            return this.availableQuizzes.length;
        },
        active_quizzes() {
            return this.newQuiz.length;
        }
        
    },
    methods: {
        async fetchSubjects() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/subjects', {
                    headers: {
                        'Authorization': `Bearer ${this.$store.state.token}`
                    }
                });
                if (response.ok) {
                    this.subjects = await response.json();
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        },

        async fetchQuizzes() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/quizzes`, {
                    headers: {
                        'Authorization': `Bearer ${this.$store.state.token}`
                    }
                });
                if (response.ok) {
                    const quizzes = await response.json();
                    this.availableQuizzes = quizzes.filter(quiz => {
                        // need to conv release_at to a date obj 
                        const releaseDate = new Date(quiz.release_at);

                        // now comp
                        return releaseDate <= new Date(); // new Date() - for current date/time
                    });

                    console.log(this.availableQuizzes); 
                    console.log(new Date()); 
                    console.log("All Quizzes:", this.availableQuizzes);
                    this.newQuiz = this.find_newQuiz();
                    
                }
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        },

        async fetchUserScores() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/users/scores', {
                    headers: {
                        'Authorization': `Bearer ${this.$store.state.token}`
                    }
                });
                if (response.ok) {
                    this.userScores = await response.json();
                    console.log("USer Scores:", this.userScores);
                    this.calculateStats();
                }
            } catch (error) {
                console.error('Error fetching scores:', error);
            }
        },
        
        find_newQuiz() {
            console.log('All available quizzes:', this.availableQuizzes);
            return this.availableQuizzes
            .filter(quiz => !this.isPastQuiz(quiz.date_of_quiz))
            .sort((a, b) => new Date(b.date_of_quiz) - new Date(a.date_of_quiz))
            .slice(0, 5);
        },

        calculateStats() {
            if (this.userScores.length) {
                this.completedQuizzes = this.userScores.length;
                this.averageScore = Math.round(
                    this.userScores.reduce((acc, score) => acc + score.score, 0) / this.userScores.length
                );
            }
        },

        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        },

        formatDuration(duration) {
            const minutes = duration.split(':')[1];
            return `${minutes} mins`;
        },

        isPastQuiz(quizDate) {
            return new Date(quizDate) < new Date();
        },

        getScoreStatus(score) {
            if (score >= 90) return 'Excellent';
            if (score >= 75) return 'Good';
            if (score >= 60) return 'Pass';
            return 'Need Improvement';
        },

        getScoreStatusClass(score) {
            if (score >= 90) return 'status-excellent';
            if (score >= 75) return 'status-good';
            if (score >= 60) return 'status-pass';
            return 'status-improve';
        },

        startQuiz(quizId) {
            window.open(this.$router.resolve({ path: `/quiz/${quizId}` }).href, '_blank');
        },

        score_summary(Id){
            window.open(this.$router.resolve({ path: `/scores/${Id}` }).href, '_blank')
        },

        filterQuizzes() {
            this.fetchQuizzes();
        }
    },
    mounted() {
        
        this.userName = this.$store.state.user || 'Student';
        this.fetchSubjects();
        this.fetchUserScores();
        this.fetchQuizzes();
    }
};

const userd_style = `
   .userdash_enc {
        padding: 1rem;
        background: linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        height: 100%;
}

.unav_enc {
padding: 1rem 5.5rem;
}


.c_sec {
    flex : 1 1 0;
        background: linear-gradient(135deg, rgb(245,245,245) 0%,rgb(232, 238, 220) 100%);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        border-radius: 4rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
}

.user_welcome {  
    padding: 1.5rem 7rem 0rem 7rem;
}
    .user_welcome h2 {
        font-size: 2.1rem;
        color: rgba(61, 38, 23, 0.88);
        font-weight: 600;
}
.user_welcome p {
    font-family: Lexend Deca , sans-serif;
    font-size: 1.2rem;
    color: rgba(94, 112, 99, 0.88);
    padding: 0.2rem 0.18rem 0.5rem 0.3rem;
}

@media screen and (min-width: 768px) {
.u_stats {
    display: flex;
    gap: 2rem;
    padding: 1.5rem 2rem;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    max-height: 5rem;
    margin: 2rem 5rem;
}
}

.u_stat_card {
    flex : 1 1 0;
    border-radius: 12px;
    padding: 1.3rem;
    display: flex;   
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;    
    max-width: 16rem;
    max-height: 10rem;
    
}

.u_stat_content h3 {
    font-size: 2rem;
    font-family:  Rubik bold;
    font-weight: 1000;
    color : rgba(22, 24, 23, 0.88);
    }
        
    .u_stat_content p {
        font-family: Lexend Deca , sans-serif;
        font-size: 1.1rem;
        color: rgba(22, 24, 23, 0.88);
        padding: 0.2rem 0.18rem;
        font-weight: 700;
    }
    
.u_stat_card:nth-child(1) {
    background: rgba(255, 105, 105, 0.82);
}
.u_stat_card:nth-child(2) {
background: rgba(93, 245, 93, 0.87);

    
}
.u_stat_card:nth-child(3) {
    background: rgba(255, 255, 105, 0.77);
}
.u_stat_card:nth-child(4) {
    background: rgba(88, 235, 235, 0.78)
}

.u_stat_content {   
    color: rgba(94, 112, 99, 0.88);
    padding: 0.2rem 0.18rem;
}


.quiz_sec {
display: flex;
flex-direction: column;
align-items: flex-start;
gap: 1rem;
border-radius: 1rem;
margin: 0rem 6rem 0.5rem 6rem;
padding: 2rem 2rem 3rem 2rem; 
}
.quiz_sec h3 {
font-family : Mitr, sans-serif;
font-size: 2rem;
color: rgba(22, 24, 23, 0.88);
padding: 0.4rem 0.18rem 0.5rem 0.6rem;
}
 

.quiz_display {
    display: flex;
    gap: 1.5rem;
}
.quiz-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(233, 233, 233, 0.8);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 280px;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.quiz-card::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 107, 129, 0.1);
  z-index: 0;
}

.quiz-card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.quiz-info {
  flex: 1;
}

.quiz-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 ;
  line-height: 1.2;
}

.quiz-subject {
  display: inline-block;
  font-size: 0.8rem;
  color: #718096;
  margin: 0;
  margin-left: 1rem;
  font-weight: 500;
}

.quiz-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b81, #ff4757);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 12px;
  box-shadow: 0 4px 10px rgba(255, 107, 129, 0.4);
}

.quiz-btn:hover {
  transform: scale(1.08);
}

.quiz-btn:disabled {
  background: linear-gradient(135deg, #cbd5e0, #a0aec0);
  cursor: not-allowed;
  box-shadow: none;
}

.quiz-meta {
    display: flex;
    gap: 1rem;
    color: #666;
    margin: 1rem 0;
}
    .chapter-name {
    display: inline-block;
        font-size: 0.8rem;        
        padding: 0.3rem 0.6rem;
        background-color : rgba(255, 248, 248, 0.93);
        border-radius: 2.5rem;
        font-family: sans-serif;
        color:rgb(82, 70, 70);
        margin-bottom : 0rem;
    }


.attempt-btn {
    width: 100%;
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 1.12rem;  
    background: #f44336;    
    border: none;
    font-weight: 800;
}

.attempt-btn:hover {
    background:rgba(226, 68, 57, 0.82);
    font-weight: 950;
}
.attempt-btn:disabled {
     background:rgba(65, 201, 187, 0.93);
}


.history_sec {
  display: flex;
flex-direction: column;
align-items: flex-start;
gap: 1rem;
border-radius: 1rem;
margin: 2rem 6rem 0.5rem 6rem;
padding: 2rem;
 background: linear-gradient(135deg, rgb(245,245,245) 0%,rgb(232, 238, 220) 100%);
}

.history_sec h3 {
font-family : Mitr, sans-serif;
font-size: 2rem;
color: rgba(22, 24, 23, 0.88);
padding: 0.2rem 0.18rem;
}


.score-bar {
    background: #f0f0f0;
    border-radius: 20px;
    height: 25px;
    overflow: hidden;
}

.score-progress {
    background:rgba(61, 103, 241, 0.63);
    height: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 0.3s ease;
    font-weight: 700;
    font-size: 1rem;
    font-family: 'Rubik';
    padding: 0.8rem auto;

}

.status-excellent { color:rgb(68, 141, 70); }
.status-good { color:rgb(51, 98, 136); }
.status-pass { color: #FFC107; }
.status-improve { color:rgb(170, 78, 71); }

.filter-controls {
    width: 200px;
}

.histable {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    
}
.histable thead {
    background-color:rgb(201, 226, 158);
    color: white;
}

.histable thead th:first-child {
    border-top-left-radius: 0.5rem;
}

.histable thead th:last-child {
    border-top-right-radius: 0.5rem;
}

.histable tbody tr:nth-child(even) {
    background-color: #f7fcea;
}

.histable th,
.histable td {
    padding: 1.3rem;
    text-align: left;
    color : #3d3d3d;
    font-size: 1rem;
    font-family: 'Lexend Deca', sans-serif;
}

.histable button {

display: inline-block;
text-align: center;
padding: 0.5rem 1rem;
cursor: pointer;
font-size: 0.9rem;
background-color: rgba(248, 230, 163, 0.95);
border: 1px solid transparent ;
border-radius: 1rem;
}

.histable button:hover {
background-color: rgba(255, 105, 105, 0.82);
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
    .userdash_enc {
        padding: 1rem;
        position: absolute;
        top: 0;
        left: 0.3rem;
    }

    .user_welcome {
        padding: 1rem 1rem;
        width : 40rem;
        
    }
    .user_welcome h2 {
        font-size: 3.5rem;
    }
    .user_welcome p {
        font-size: 2rem;
    }

    .u_stats {
        display: flex;
        gap: 1rem;
        margin: 0;
        width: 40rem;
    }

    .u_stat_card {
        display: flex;
        max-width: 40rem;
        height: 10rem;
        margin: 0;
        padding: 0.5rem;
    }

    .c_sec , quiz_sec , .history_sec {
        left: 0.5rem;
        margin: 0.5rem 0;
        width: 42rem;
    }

    .quiz_display {
        display: flex !important; 
        flex-direction: column;
        gap: 1rem;
    }

    .quiz-card {
        width: 90%;
    }

    .histable {
        width: 30rem;
    }

}

 
`  ;

const styleSheet2 = document.createElement("style");
styleSheet2.type = "text/css";
styleSheet2.innerText = userd_style;
document.head.appendChild(styleSheet2);
