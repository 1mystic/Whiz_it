const Scores = {
    name: 'Scores',

    template: `
    <div v-if="isLoading" class="loading-container card">
        <p>Loading Quiz Results...</p>
        </div>

    <div v-else-if="error" class="error-container card error-card">
        <p>Error loading results: {{ error }}</p>
    </div>
     
    <div v-else-if="reportData" class="results-container"> <div class="card">
           
            <h1 class="score_head">Quiz Summary : <span v-if="reportData.user">{{ reportData.user }}</span></h1>
            
            <div class="score_enc">
            <router-link to="/home" class="back-button">Back</router-link>
                <h5>Quiz: {{ reportData.quiz_title }}</h5>
                <p>Score: {{ reportData.score ? reportData.score.toFixed(2) : 'N/A' }}%</p>
                <button @click="savepage" class="s_save_btn">Save</button>
            </div>
        </div>

        <div v-if="reportData.ai_report" class="card ai-report-card">
            <h2 class="report-title">AI Analysis Report</h2>
            <div v-if="reportData.ai_report.summary">
                <h3>Summary</h3>
                <p class="ai_overview">{{ reportData.ai_report.summary }}</p>
            </div>
            <div v-if="reportData.ai_report.strengths && reportData.ai_report.strengths.length > 0">
                <h3>Strengths</h3>
                <ul>
                    <li v-for="(strength, index) in reportData.ai_report.strengths" :key="'strength-' + index">{{ strength }}</li>
                </ul>
            </div>
             <div v-if="reportData.ai_report.weaknesses && reportData.ai_report.weaknesses.length > 0">
                <h3>Areas for Improvement</h3>
                <ul>
                    <li v-for="(weakness, index) in reportData.ai_report.weaknesses" :key="'weakness-' + index">{{ weakness }}</li>
                </ul>
            </div>
             <div v-if="reportData.ai_report.suggestions && reportData.ai_report.suggestions.length > 0">
                <h3>Suggestions</h3>
                <ul>
                    <li v-for="(suggestion, index) in reportData.ai_report.suggestions" :key="'suggestion-' + index">{{ suggestion }}</li>
                </ul>
            </div>
             <div v-if="!reportData.ai_report.summary && !reportData.ai_report.strengths?.length && !reportData.ai_report.weaknesses?.length && !reportData.ai_report.suggestions?.length">
                 <p>AI analysis data is empty or unavailable for this attempt.</p>
             </div>
        </div>

        <div class="quiz-history card"> <h2 class="report-title">Question Breakdown</h2>
            <table class="score-table" v-if="reportData.questions && reportData.questions.length > 0">
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Your Answer</th>
                        <th>Correct Answer</th>
                        <th>Outcome</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(question, index) in reportData.questions" :key="'q-' + index">
                        <td>Q{{ index + 1 }}: {{ question.question }}</td>
                        <td>{{ question.selected_option !== null ? question.selected_option : 'Not Answered' }}</td>
                        <td>{{ question.correct_option }}</td>
                        <td :class="{'correct': question.selected_option === question.correct_option, 'incorrect': question.selected_option !== question.correct_option && question.selected_option !== null}">
                            {{ getOutcomeText(question) }}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-else>No question history available.</p>
        </div>

    </div>

    <div v-else class="loading-container card"> <p>Could not load report data.</p>
    </div>
    `,

    data() {
        return {
            reportData: null, // Single object to hold all fetched data
            isLoading: true, // Unified loading state
            error: null, // Unified error state
        };
    },

    methods: {
        fetchFullReport() {
            const scoreId = this.$route.params.Id; // Get scoreId from route
            if (!scoreId) {
                this.error = 'Error: Score ID not found in route parameters.';
                this.isLoading = false;
                console.error(this.error);
                return;
            }

            this.isLoading = true;
            this.error = null; // Reset error

            fetch(`https://whiz-it.onrender.com/api/scores/${scoreId}/full_report`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                     // Try to get error message from response body
                     return response.json().then(errData => {
                         throw new Error(errData.message || `HTTP error! status: ${response.status}`);
                     }).catch(() => {
                         // Fallback if response body isn't JSON or doesn't have message
                         throw new Error(`HTTP error! status: ${response.status}`);
                     });
                }
                return response.json();
            })
            .then(data => {
                this.reportData = data; // Store the entire combined response
            })
            .catch(error => {
                console.error('Error fetching full report:', error);
                this.error = error.message; // Display error message
                this.reportData = null; // Ensure no stale data is shown
            })
            .finally(() => {
                this.isLoading = false;
            });
        },

        getOutcomeText(question) {
            if (question.selected_option === null) {
                return 'Not Answered';
            }
            return question.selected_option === question.correct_option ? 'Correct' : 'Incorrect';
        },

        savepage() {
            // Consider adding specific classes for printing to hide unnecessary elements
            window.print();
        }
    },

    created() {
        // Fetch the combined report data when the component is created
        this.fetchFullReport();
    }
};

const score_css = `
.back-button {
  color: rgb(41, 53, 44);
    text-decoration: none;
    font-family: Mitr, sans-serif;
    font-weight: 540;
    font-size: 1.2rem;
    transition: color 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 0.8rem;
    /*background: rgba(242, 248, 250, 0.9);
    border: 4px solid rgba(27, 25, 26, 0.3);*/
    trasition: font 0.3s ease;
    z-index: 103;
    display: inline-block;
    background: rgba(240, 138, 138, 0.2);
    }

.back-button:hover {
    color: rgb(13, 14, 13);
    background: rgb(240, 138, 138);
    font-weight: 580;
}

.report-title {
    font-family: 'Rubik', sans-serif;
    color: var(--primary-color);
    font-size: 1.5rem; /* Slightly smaller than main heading */
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 0.5rem;
    display: inline-block;
}

.ai-report-card h3 {
    font-family: 'Lexend', sans-serif;
    color: var(--primary-color);
    font-size: 1.1rem;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

.ai-report-card p, .ai-report-card li {
    font-family: 'Lexend Deca', sans-serif;
    color: #333;
    line-height: 1.6;
}
    .ai_overview {
    background-color:rgba(227, 242, 253, 0.71) !important; /* Light blue background */
}
.ai-report-card ul {
    list-style: disc;
    margin-left: 1.5rem;
    margin-bottom: 1rem;
}

.error-card {
    background-color: #ffebee; /* Light red background for errors */
    color: #c62828; /* Darker red text */
    border: 1px solid #e57373;
}



.quiz-history h2 { /* Style the Question Breakdown title */
   font-family: 'Rubik', sans-serif;
   color: var(--primary-color);
   font-size: 1.5rem;
   margin-bottom: 1rem;
   border-bottom: 2px solid var(--accent-color);
   padding-bottom: 0.5rem;
   display: inline-block;
}


/* original styles */
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
    background-color: rgba(232, 255, 169, 0.57);
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
