const Scores = {
    name: 'Scores',
    
    template: `

    <div class="card">
        <h1 class="score_head">Quiz Summary : <span>{{ $store.state.user }}</span></h1>
        
        <div class="score_enc">
            
            <h5>Quiz: {{quizHistory.quiz_title}}</h5>
            <p>Score: {{quizHistory.score}}%</p>
            <button @click="savepage" class="s_save_btn">Save</button>
        </div>
        
    </div>
    <div class="quiz-history">
        <table class="score-table">
            <thead>
                <tr>
                    
                    <th>Question</th>
                    <th>Selected Option</th>
                    <th>Correct Option</th>
                    <th>Outcome</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(question, index) in quizHistory.questions" :key="index">
                    <td>Question {{ index + 1 }}: {{ question.question }}</td>
                    <td>{{ question.selected_option }}</td>
                    <td>{{ question.correct_option }}</td>
                    <td :class="{'correct': question.selected_option === question.correct_option, 'incorrect': question.selected_option !== question.correct_option}">
                        {{ question.selected_option === question.correct_option ? 'Correct' : 'Incorrect' }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `,

    data() {
        return {
            quizHistory: {
                quiz_title: '',
                questions: []
            },
           
        };
    },
    
    methods: {
        fetchQuizHistory() {
            const Id = this.$route.params.Id;
            const usern = this.$store.state.user;
            fetch(`http://127.0.0.1:5000/api/quizzes/${Id}/user/${usern}/history`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.quizHistory = data;
                console.log(this.quizHistory)
                
            })
            .catch(error => {
                console.error('Error fetching quiz history:', error);
            });
        },
        savepage(){
            window.print();
        }
    },

    created() {
        this.fetchQuizHistory();
    }
};

const score_css = `
.card {
    --primary-color: #1B3A4B;
    --accent-color: #9EF01A;
    --background-light: #F4F9F4;

    margin: 1.5rem;
    background-color: white;
    border-radius: 1.25rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 1.5rem;
    font-family: 'Lexend Deca', sans-serif;
}


.score_enc {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin: 1rem 0;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
}

.score_head {
display: inline-block;
text-align: left;
    font-family: 'Rubik', sans-serif;
    color: var(--primary-color);
    font-size: 1.75rem;
    margin-bottom: 1rem;
}

.card h5, .card p {
    font-family: 'Lexend', sans-serif;
    display: inline-block;
    padding: 0.75rem 1.25rem;
    background-color: var(--background-light);
    border-radius: 0.75rem;
    margin: 0;
    font-weight: 500;
}

.card span {
    display: inline-block;
    color: rgb(187, 65, 44);   
    padding: 0.75rem 1.25rem;
    border-radius: 2rem;
}

.s_save_btn {
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    max-width: 8rem;
    font-family: 'Mitr', sans-serif;
    background-color: var(--accent-color);
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 0.75rem;
    color: var(--primary-color);
    font-weight: 700;
    cursor: pointer;
    transition: border-bottom 0.3s ease;
}
    @media (max-width: 768px) {
        .s_save_btn {
            position: relative;
            margin-top: 1.5rem;
            margin-left: 1.5rem;
        }
    }

.s_save_btn:hover {
    border-bottom: 5px solid rgb(46, 48, 44);
}

.quiz-history {
    margin: 1.5rem;
}

.score-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.5rem;
    font-family: 'Lexend Deca', sans-serif;
}

.score-table th {
    background-color: var(--background-light);
    padding: 1rem;
    font-weight: 500;
    color: var(--primary-color);
    border: none;
}

.score-table td {
    padding: 1rem;
    background-color: white;
    border: 1px solid #eef2f6;
}

.correct {
    color: #2ECC71;
    font-weight: 500;
}

.incorrect {
    color: #E74C3C;
    font-weight: 500;
}
`;

document.head.insertAdjacentHTML('beforeend', `<style>${score_css}</style>`);