const QuizView = {
    name: 'QuizView',
    template: `
        <div class="quiz_enc" v-if="quiz">
            <!-- Quiz Header -->
            <div class="quiz_top">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col">
                            <h1> Quiz - {{quiz.title}} </h1> <br>
                            <h2>{{ quiz.subject_name }} - {{ quiz.chapter_name }}</h2>
                            <h2 style="background-color:rgba(255, 185, 163, 0.76);
                                    margin-left: 0.5rem;">
                                {{ quiz.question_count }} questions | {{ quiz.time_duration }} min
                            </h2>
                        </div>
                        <div class="col-auto">
                            <div class="timer" :class="{ 'warning': timeRemaining < 30 }">
                                Time remaining: {{ formatTime(timeRemaining) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quiz Content -->
            <div class="container my-4">
                <div class="question-card">
                    <div class="question-number">
                        Question {{ currentQuestion }} of {{ quiz.question_count }}
                    </div>
                    <div class="question-text">
                        {{ currentQuestionData.question_statement }}
                    </div>
                    <div class="options-list">
                        <div 
                            v-for="(option, index) in currentQuestionData.options" 
                            :key="index"
                            class="option-item"
                            :class="{ 
                                'selected': selectedOption === index,
                                'hover-effect': selectedOption !== index 
                            }"
                            @click="selectOption(index)"
                        >
                            <span class="option-letter">{{ ['A', 'B', 'C', 'D'][index] }}</span>
                            <span class="option-text">{{ option }}</span>
                        </div>
                    </div>
                    <div class="quiz-navigation">
                        <button 
                            class="nav_button me-2"
                            @click="previousQuestion"
                            :disabled="currentQuestion === 1"
                        >
                            <span class="nav-icon">←</span> Previous
                        </button>
                        <button 
                            class="nav_button "
                            @click="nextQuestion"
                        >
                            {{ currentQuestion === quiz.question_count ? 'Submit Quiz' : 'Next' }}
                            <span v-if="currentQuestion !== quiz.question_count" class="nav-icon">→</span>
                        </button>
                    </div>
                </div>

                <!-- Question Progress -->
                <div class="question-progress mt-4">
                    <div 
                        v-for="n in quiz.question_count" 
                        :key="n"
                        class="progress-item"
                        :class="{ 
                            'current': currentQuestion === n,
                            'answered': answeredQuestions.includes(n)
                        }"
                        @click="goToQuestion(n)"
                    >
                        {{ n }}
                    </div>
                </div>
            </div>
        </div>
    `,

    data() {
        return {
            quiz: null,
            currentQuestion: 1,
            timeRemaining: 0,
            selectedOption: null,
            answeredQuestions: [],
            timer: null,
            answers: {}
        }
    },

    computed: {
        currentQuestionData() {
            return this.quiz?.questions?.[this.currentQuestion - 1] || { 
                question_statement: 'Loading...', 
                options: [] 
            }
        }
    },
     mounted() {
        this.fetchQuizData();
        const qzstyleElement = document.createElement('style');
        qzstyleElement.textContent = qvstyle;
        document.head.appendChild(qzstyleElement);

        // beforeunload event listener to prevent nav away from the quiz
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    },

    beforeUnmount() {
        if (this.timer) clearInterval(this.timer);
         window.removeEventListener('beforeunload', this.handleBeforeUnload);
    },

    methods: {
        handleBeforeUnload(event) {
            // browser alert message diff browser
            event.preventDefault();
            // Chrome requires returnValue
            event.returnValue = ''; // dialogue msg for some browsers
             return ''; // empty string for other browsers
        },
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = seconds % 60
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
        },

        selectOption(index) {
            this.selectedOption = index
            this.answers[this.currentQuestion] = index + 1
            if (!this.answeredQuestions.includes(this.currentQuestion)) {
                this.answeredQuestions.push(this.currentQuestion)
            }
        },
    
        nextQuestion() {
            if (this.currentQuestion < this.quiz.question_count) {
                this.currentQuestion++
                this.selectedOption = this.answers[this.currentQuestion] 
                    ? this.answers[this.currentQuestion] - 1 
                    : null
            } else {
                this.submitQuiz()
            }
        },
    
        previousQuestion() {
            if (this.currentQuestion > 1) {
                this.currentQuestion--
                this.selectedOption = this.answers[this.currentQuestion] 
                    ? this.answers[this.currentQuestion] - 1 
                    : null
            }
        },
    
        goToQuestion(number) {
            if (number >= 1 && number <= this.quiz.question_count) {
                this.currentQuestion = number
                this.selectedOption = this.answers[this.currentQuestion] 
                    ? this.answers[this.currentQuestion] - 1 
                    : null
            }
        },
    
        submitQuiz() {
            this.isSubmitting = true
            const submitButton = event.target
            submitButton.innerHTML = 'Submitting Quiz...'
            submitButton.disabled = true
            clearInterval(this.timer)
            const quizId = this.$route.params.quizid
        
            const answers = {}
            this.quiz.questions.forEach((q, index) => {
                if (this.answers[index + 1] !== undefined) {
                    answers[q.id] = this.answers[index + 1]
                }
            })
        
            fetch(`https://whiz-it.onrender.com/api/quizzes/${quizId}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ answers })
            })
            .then(response => response.json())
            .then(data => {
                alert(`Quiz submitted! Your score: ${data.score}%`)
                const Id = data.score_id
                this.$router.push(`/scores/${Id}`)
            })
            .catch(error => {
                console.error('Error submitting quiz:', error)
                alert('Failed to submit quiz. Please try again.')
            })
        },

        startTimer() {
            this.timer = setInterval(() => {
                if (this.timeRemaining > 0) {
                    this.timeRemaining--
                } else {
                    this.submitQuiz()
                }
            }, 1000)
        },

        fetchQuizData() {
            const quizId = this.$route.params.quizid
            if (!quizId) {
                console.error('Quiz ID is undefined')
                return
            }
            
            fetch(`https://whiz-it.onrender.com/api/quizzes/${quizId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok')
                return response.json()
            })
            .then(data => {
                this.quiz = data
                console.log(data.time_duration)
                const timeParts = data.time_duration.split(':');
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);
                const seconds = parseInt(timeParts[2], 10);
                this.timeRemaining = (hours * 3600) + (minutes * 60) + seconds;
               
                this.startTimer()
            })
            .catch(error => {
                console.error('Error fetching quiz data:', error)
            })
        }
    }

   
}


const qvstyle = `
    .quiz_enc {
        background-color: #F6F7FB;
        min-height: 100vh;
    }

    .quiz_top {
        background: white;
        padding: 1.5rem 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .quiz_top h1 {
        display: inline-block;
        font-size: 2rem;
        font-weight: 700;
        color:rgb(56, 72, 45);
        font-family: Rubik, sans-serif;   
        background-color: rgba(192, 243, 143, 0.9);       
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        margin: auto;
    }
    .quiz_top h2 {
        display: inline-block;
        font-size: 1rem;
        font-weight: 500;
        margin: 0.5rem 0 0;
        color:rgb(104, 84, 84);
        background-color: rgba(164, 222, 245, 0.71);
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
    }

    .quiz_top p {
        display: inline-block;
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0.5rem 0 0 0.3rem;
        color:rgb(91, 95, 87);
        background-color: rgba(236, 179, 137, 0.9);
        border-radius: 0.5rem;
        padding: 0.35rem 1rem;
}

.timer {
    background-color: rgba(203, 245, 106, 0.26);
    border : 5px solid rgba(78, 100, 49, 0.33);
    color:rgba(72, 122, 60, 0.66);
    padding: 0.75rem 1.75rem;
    border-radius: 0.5rem;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
    font-size: 1.25rem;
    transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

    .timer.warning {
        background-color: #DC3545;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
    }

    .question-card {
        background: rgba(253, 234, 220, 0.9);
        border-radius: 1rem;
        padding: 2rem;
        margin-bottom: 1rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }

    .question-number {
        color:rgb(59, 45, 25);
        font-weight: 500;
        margin-bottom: 1rem;
    }

    .question-text {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color:rgb(72, 50, 45);
    }

    .options-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .option-item {
        background: #F8FAFC;
        padding: 1rem 1.25rem;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid transparent;
    }

    .option-item.hover-effect:hover {
        background: #EDF2F7;
        border-color:rgba(92, 228, 210, 0.88);
    }

    .option-item.selected {
        background:rgba(89, 218, 168, 0.94);
        font-weight: 600;
        border-color:rgb(73, 69, 60);
    }

    .option-letter {
        font-weight: 700;
        margin-right: 1rem;
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        background: rgba(0,0,0,0.1);
    }

    .selected .option-letter {
        background: rgba(255,255,255,0.2);
    }

    .quiz-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
    }

    .nav_button {
        background:rgb(219, 122, 92);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 1.5rem;
        font-weight: 660;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        border: 3px solid rgb(73, 69, 60);
    }

    .nav_button:disabled {
        background:rgb(217, 218, 206);
        color: #6C757D; 
        cursor: not-allowed;
    }

    .nav_button:hover {
        background:rgb(117, 221, 103);
        color : rgb(53, 52, 49);
    }

    .nav-icon {
        display: inline-block;
        margin: 0 0.5rem;
    }

    .question-progress {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 1rem;
    }

    .progress-item {
        background: #F8FAFC;
        padding: 0.5rem 1rem;
        border-radius: 3.5rem;
        cursor: pointer;
        transition: all 0.2s;
        min-width: 40px;
        text-align: center;
        font-weight: 800;
        border: 2px solid rgb(31, 28, 28);
    }

    .progress-item.current {
        background:rgba(69, 165, 194, 0.82);
        color: white;

    }

    .progress-item.answered {
        background:rgb(87, 223, 53);
        color: white;
    }

    @media (max-width: 768px) {
        .quiz-header h1 {
            font-size: 1.25rem;
        }

        .timer {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
        }

        .question-card {
            padding: 1.5rem;
        }

        .question-text {
            font-size: 1rem;
        }

        .option-item {
            padding: 0.75rem 1rem;
        }

        .quiz-navigation {
            flex-direction: column;
            gap: 1rem;
        }

        .quiz-navigation button {
            width: 100%;
        }
    }   `;
