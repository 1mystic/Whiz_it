
const usummary = {
    name: 'usummary',
   
    template: `

                 <!-- Stats Overview -->
                <br>
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
                <br>
   
            
                    <div class="top_dash">
                        <div class="main-card performance-card">
                            <div class="card-header">
                                <div class="title-section">
                                    
                                    <div class="score-section">
                                        <h2 class="card-value">{{ averageScore.toFixed(1) }}%</h2>
                                        <span class="trend-badge">+{{ getTotalQuizzesTaken }} quizzes</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="chart-container">
                                <canvas id="performanceChart"></canvas>
                            </div>
                        </div>

                        <!-- Stats Cards -->
                        <div class="ustat-card highlight-card">

                            <div class="header-actions">
                            <h2>Best Score </h2>
                                <div>
                                <button @click="exportToCSV" class="action-btn download_btn">
                                    <i class="fas fa-download"></i>
                                </button>
                                <button @click="emailCSV" class="action-btn email_btn">
                                    <i class="fas fa-envelope"></i>
                                </button>
                                </div>
                            </div>

                           
                            <div class="stat-content">
                                <div class="stat-value-large">{{ bestScore.toFixed(1) }}%</div>
                            </div>
                            <div class="stat-footer">
                                <span class="streak-badge">
                                    <i class="fas fa-fire"></i>
                                    {{ getStreakCount }} day streak
                                </span>
                            </div>
                        </div>
                    </div>



                    <div class="low_dash">
                        <div class="ustat_graph">
                            <div class="stat-header">
                                <span class="chart_title">Subject Distribution</span>
                               
                            </div>
                            <div class="chart-container distribution-chart">
                                <canvas id="distributionChart"></canvas>
                            </div>
                        </div>                  

                        <!-- Rankings Table -->
                        <div class="rankings-card">
                            <div class="rankings-header">
                                <h3>Subject Rankings</h3>
                                
                            </div>
                            <div class="rankings-table">
                                <div v-for="subject in subjectPerformance" 
                                    :key="subject.id" 
                                    class="ranking-row">
                                    <div class="subject-info">
                                        <div class="subject-icon">
                                            <i class="fas fa-book"></i>
                                        </div>
                                        <span class="subject-name">{{ subject.name }}</span>
                                    </div>
                                    <div class="subject-stats">
                                        <canvas :id="'sparkline-' + subject.id" width="100" height="30"></canvas>
                                        <span class="subject-score">{{ subject.averageScore.toFixed(1) }}%</span>
                                        <span class="subject-change" 
                                            :class="subject.averageScore >= 75 ? 'positive' : 'negative'">
                                            {{ subject.averageScore >= 75 ? '+' : '-' }}{{ Math.abs((subject.averageScore - 75)/75 * 100).toFixed(2) }}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                    
                        </div>
                    </div>

                </div>
        
        `,
        data() {
            return {
                scores: [],
                subjects: [],
                chapters: [],
                quizzes: [],
                loading: false
            }
        },
        computed: {
            completedQuizzes() {
                return this.scores.length;
            },
            active_quizzes() {
                return this.quizzes.filter(quiz => quiz.active).length;
            }
            ,
            recentScores() {
                return [...this.scores]
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .slice(0, 5);
            },
            getTotalQuizzesTaken() {
                return this.scores.length;
            },
            averageScore() {
                if (this.scores.length === 0) return 0;
                return this.scores.reduce((acc, score) => acc + score.score, 0) / this.scores.length;
            },
            bestScore() {
                if (this.scores.length === 0) return 0;
                return Math.max(...this.scores.map(score => score.score));
            },
            getStreakCount() {
                if (this.scores.length === 0) return 0;
                
                const dates = this.scores.map(score => new Date(score.timestamp).toDateString());
                const uniqueDates = [...new Set(dates)];
                uniqueDates.sort((a, b) => new Date(b) - new Date(a));
                
                let streak = 1;
                const today = new Date().toDateString();
                let currentDate = new Date(uniqueDates[0]);
                
                if (currentDate.toDateString() !== today) return 0;
                
                for (let i = 1; i < uniqueDates.length; i++) {
                    const prevDate = new Date(currentDate);
                    prevDate.setDate(prevDate.getDate() - 1);
                    
                    if (prevDate.toDateString() === new Date(uniqueDates[i]).toDateString()) {
                        streak++;
                        currentDate = prevDate;
                    } else {
                        break;
                    }
                }
                
                return streak;
            },
            subjectPerformance() {
                if (this.scores.length === 0) return [];
                
                const subjectScores = {};
                
                this.scores.forEach(score => {
                    const quiz = this.quizzes.find(q => q.id === score.quiz_id);
                    if (!quiz) return;
                    
                    const chapter = this.chapters.find(c => c.id === quiz.chapter_id);
                    if (!chapter) return;
                    
                    const subject = this.subjects.find(s => s.id === chapter.subject_id);
                    if (!subject) return;
                    
                    if (!subjectScores[subject.id]) {
                        subjectScores[subject.id] = {
                            id: subject.id,
                            name: subject.name,
                            scores: []
                        };
                    }
                    
                    subjectScores[subject.id].scores.push(score.score);
                });
                
                return Object.values(subjectScores).map(subject => ({
                    ...subject,
                    averageScore: subject.scores.reduce((acc, score) => acc + score, 0) / subject.scores.length
                }));
            }
        },
        methods:
         { 

            async emailCSV() {
                
                this.notify({ type: 'info', message: 'Export started. You will receive an email when it\'s ready.' });
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:5000/api/export-quiz-history', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    this.notify({ type: 'success', message: 'The report has been sent to your email.' });
                } else {
                    const error = await response.json();
                    this.notify({ type: 'error', message: `Error: ${error.error}` });
                }
            },

            
            async exportToCSV() {
                this.notify({ type: 'info', message: 'Export started. The file will download automatically.' });
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:5000/api/export_csv', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'user_data.csv';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    this.notify({ type: 'success', message: 'CSV file has been downloaded.' });
                } else {
                    const error = await response.json();
                    this.notify({ type: 'error', message: `Error: ${error.error}` });
                }
            },          
                                   
                
            
            formatDate(timestamp) {
                const date = new Date(timestamp);
                return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            },
            getProgressStyle(score) {
                const hue = Math.min(score * 1.2, 120); // Maps 0-100 to 0-120 (red to green)
                return {
                    backgroundColor: `hsl(${hue}, 70%, 50%)`,
                    color: score > 50 ? 'white' : 'black'
                };
            },
            getProgressBarClass(score) {
                if (score >= 80) return 'bg-success';
                if (score >= 60) return 'bg-info';
                if (score >= 40) return 'bg-warning';
                return 'bg-danger';
            },
            createDistributionChart() {
                const ctx = document.getElementById('distributionChart');
                if (!ctx) return;
                
                const subjectScores = this.subjectPerformance.slice(0, 3);
                
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: subjectScores.map(subject => subject.name),
                        datasets: [{
                            data: subjectScores.map(subject => subject.averageScore),
                            backgroundColor: ['#1e293b', '#4ade80', '#94a3b8'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    color: '#64748b'
                                }
                            }
                        },
                        cutout: '35%'
                    }
                });
            },
            createPerformanceChart() {
                const ctx = document.getElementById('performanceChart');
                if (!ctx) return;
                
                const dates = this.scores.map(score => this.formatDate(score.timestamp));
                const scores = this.scores.map(score => score.score);
                
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Score',
                            data: scores,
                            borderColor: '#4ade80',
                            backgroundColor: 'rgba(74, 222, 128, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                backgroundColor: 'white',
                                titleColor: '#1e293b',
                                bodyColor: '#1e293b',
                                borderColor: '#e2e8f0',
                                borderWidth: 1,
                                padding: 12,
                                displayColors: false
                            }
                        },
                        scales: {
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: { 
                                    color: '#94a3b8',
                                    maxRotation: 0
                                }
                            },
                            y: {
                                grid: {
                                    color: 'rgba(255,255,255,0.1)'
                                },
                                ticks: { 
                                    color: '#94a3b8',
                                    padding: 10
                                },
                                border: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            },
            createSparkline(subjectId) {
                const ctx = document.getElementById(`sparkline-${subjectId}`);
                if (!ctx) return;
                
                const subjectScores = this.scores
                    .filter(score => {
                        const quiz = this.quizzes.find(q => q.id === score.quiz_id);
                        const chapter = quiz ? this.chapters.find(c => c.id === quiz.chapter_id) : null;
                        return chapter && chapter.subject_id === subjectId;
                    })
                    .map(score => score.score)
                    .slice(-7);
                
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Array(subjectScores.length).fill(''),
                        datasets: [{
                            data: subjectScores,
                            borderColor: '#94a3b8',
                            borderWidth: 1,
                            pointRadius: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { display: false },
                            y: { display: false }
                        }
                    }
                });
            },
            async fetchData() {
                try {
                    this.loading = true;
                    const token = localStorage.getItem('token');
                    const headers = {
                        'Authorization': `Bearer ${token}`
                    };
    
                    const [scoresRes, subjectsRes, chaptersRes, quizzesRes] = await Promise.all([
                        fetch('/api/users/scores', { headers }),
                        fetch('/api/subjects', { headers }),
                        fetch('/api/chapters', { headers }),
                        fetch('/api/quizzes', { headers })
                    ]);
    
                    this.scores = await scoresRes.json();
                    this.subjects = await subjectsRes.json();
                    this.chapters = await chaptersRes.json();
                    this.quizzes = await quizzesRes.json();
    
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    this.loading = false;
                }
            },

            notify({ type, message }) {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;

                const container = document.querySelector('.notification-container') || (() => {
                    const container = document.createElement('div');
                    container.className = 'notification-container';
                    document.body.appendChild(container);
                    return container;
                })();

                container.appendChild(notification);
                const notificationStyles = `
                    .notification-container {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 1000;
                    }

                    .notification {
                        background-color: #444;
                        color: #fff;
                        padding: 15px 20px;
                        margin-bottom: 10px;
                        border-radius: 5px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        opacity: 0;
                        transform: translateY(-20px);
                        transition: opacity 0.3s ease, transform 0.3s ease;
                    }

                    .notification.visible {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .notification.success {
                        background-color: #4caf50;
                    }

                    .notification.error {
                        background-color: #f44336;
                    }

                    .notification.warning {
                        background-color: #ff9800;
                    }

                    .notification.info {
                        background-color: #2196f3;
                    }
                `;

                const styleSheet = document.createElement("style");
                styleSheet.type = "text/css";
                styleSheet.innerText = notificationStyles;
                document.head.appendChild(styleSheet);                

                setTimeout(() => {
                    notification.classList.add('visible');
                }, 100);

                setTimeout(() => {
                    notification.classList.remove('visible');
                    setTimeout(() => {
                        container.removeChild(notification);
                    }, 300);
                }, 3000);


            }
        },
        mounted() {
            this.fetchData();
            this.fetchData().then(() => {
                this.createPerformanceChart();
                this.createDistributionChart();
            });
            const us_styleSheet = document.createElement("style");
            us_styleSheet.type = "text/css";
            us_styleSheet.innerText = sumstyle;
            document.head.appendChild(us_styleSheet);
        }
    };
    
const sumstyle = `
    
    /* Mobile first approach (base styles) */
.u_stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
  max-width: 100%;
  margin: 1rem 0;
}

.u_stat_card {
  width: 100%;
  max-width: 16rem;
  border-radius: 12px;
  padding: 1.3rem;
  display: flex;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  margin-bottom: 1rem;
}

.u_stat_card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.u_stat_content {
  color: rgba(94, 112, 99, 0.88);
  padding: 0.2rem 0.18rem;
  width: 100%;
}

.u_stat_content h3 {
  font-size: 1.5rem;
  font-family: 'Rubik', sans-serif;
  font-weight: 900;
  color: rgba(22, 24, 23, 0.88);
  margin-bottom: 0.3rem;
}

.u_stat_content p {
  font-family: 'Lexend Deca', sans-serif;
  font-size: 0.9rem;
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
  background: rgba(88, 235, 235, 0.78);
}

/* Small devices (landscape phones) */
@media screen and (min-width: 576px) {
  .u_stats {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin: 1.5rem 2rem;
  }
  
  .u_stat_card {
    flex: 0 1 calc(50% - 1rem);
    margin: 0.5rem;
  }
  
  .u_stat_content h3 {
    font-size: 1.7rem;
  }
  
  .u_stat_content p {
    font-size: 1rem;
  }
}

/* Medium devices (tablets) */
@media screen and (min-width: 768px) {
  .u_stats {
    flex-wrap: nowrap;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
    justify-content: center;
    align-items: stretch;
    margin: 2rem 3rem;
  }
  
  .u_stat_card {
    flex: 1 1 0;
    max-height: none;
    margin: 0;
  }
}

/* Large devices (desktops) */
@media screen and (min-width: 992px) {
  .u_stats {
    gap: 2rem;
    margin: 2rem 5rem;
  }
  
  .u_stat_content h3 {
    font-size: 2rem;
  }
  
  .u_stat_content p {
    font-size: 1.1rem;
  }
}

/* Extra large devices */
@media screen and (min-width: 1200px) {
  .u_stats {
    max-width: 100%;
    margin: 2rem auto;
  }
    .u_stat_card {
        max-width: 30rem;
    }
}

    .summary-page {
        background-color: #f8f9fa;
        min-height: 100vh;
        padding: 1.5rem;
    }

    .header-content {
        margin: 2rem auto 0.6rem 13rem;
        display: flex;
        align-items: center;
    }

    .header-content h1 {
        font-size: 2.5rem;
        font-weight: 600;
        color: rgba(19, 37, 22, 0.8);
        margin-bottom: 0.25rem;
    }

    .header-actions {
        position: relative;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .header-actions h2{
        font-size: 1.8rem;
        font-weight: 800;
        color: rgba(44, 82, 50, 0.8);
        position: relative;
        
}

    .action-btn {
        background: transparent;
        border: 1px solid #e2e8f0;
        padding: 0.5rem;
        border-radius: 8px;
        color: #64748b;
        margin-left: 0.5rem;
        cursor: pointer;        
    }
        .action-btn:hover {
            background: rgba(0, 0, 0, 0.05);
            color : black;
            border: 1px solid rgba(0, 0, 0, 0.05);
        }

    .download_btn:hover::after {
        content: 'Download';
        position: absolute;
        bottom: 10%;
        right: 15%;
        transform: translateX(-50%);
        background: #4ade80;
        color: white;
        padding: 0.3rem 0.5rem;
        border-radius: 0.5rem;
        white-space: nowrap;
        margin-top: 0.25rem;
        font-weight: 500;
    }
    .email_btn:hover::after {
        content: 'Email Report';
        position: absolute;
        bottom: 10%;
        right:  15%;
        transform: translateX(-50%);
        background: #4ade80;
        color: white;
        padding: 0.3rem 0.5rem;
        border-radius: 0.5rem;
        white-space: nowrap;
        margin-top: 0.25rem;
        font-weight: 500;
    }

    .main-card {
        background: linear-gradient(135deg, #1e4d56 0%, #0f2e36 100%);
        border-radius: 16px;
        padding: 1.5rem;
        color: white;
        margin-bottom: 1.5rem;
    }

    .card-label {
        font-size: 0.875rem;
        color: #94a3b8;
        display: block;
        margin-bottom: 0.5rem;
    }

    .card-value {
        font-size: 2.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .trend-indicator {
        color: #94a3b8;
        font-size: 0.875rem;
    }

    .chart-placeholder {
        height: 200px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        margin-top: 1.5rem;
    }

    .stats-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .ustat-card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);     
    }

    .highlight-card {
        background: #d9f99d;
    }

    .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .stat-label {
        color: #64748b;
        font-size: 0.875rem;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1a2b3c;
        margin-bottom: 0.5rem;
    }

    .stat-trend {
        color: #64748b;
        font-size: 0.875rem;
    }
         .chart-container {
        position: relative;
        height: 200px;
        width: 100%;
    }

    .chart_title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1a2b3c;
}

    .distribution-chart {
        max-height: 200px;
    }


    .distribution-chart {
        position: relative;
        height: 150px;
    }

    .pie-chart-placeholder {
        position: relative;
        width: 150px;
        height: 150px;
        margin: 0 auto;
    }

    .pie-segment {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
    }

    .pie-segment.eth {
        background: #1e4d56;
        color: white;
        clip-path: polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%);
    }

    .pie-segment.bsc {
        background: #d9f99d;
        color: #1a2b3c;
        clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 0 100%, 0 50%);
    }

    .pie-segment.other {
        background: #94a3b8;
        color: white;
        clip-path: polygon(50% 50%, 0 0, 50% 0);
    }

    .rankings-card {
        background: white;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .rankings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .rankings-header h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1a2b3c;
    }

    .filter-btn {
        background: #f1f5f9;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        color: #64748b;
        font-size: 0.875rem;
        cursor: pointer;
    }

    .ranking-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #e2e8f0;
    }



    .subject-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .subject-icon {
        width: 40px;
        height: 40px;
        background: #f1f5f9;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
    }

    .subject-name {
        font-weight: 500;
        color: #1a2b3c;
    }

    .subject-stats {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .subject-score {
        font-weight: 600;
        color: #1a2b3c;
    }

    .subject-change {
        font-size: 0.875rem;
    }

    .subject-change.positive {
        color: #10b981;
    }

    .subject-change.negative {
        color: #ef4444;
    }

    
    .summary_encl{

    display : flex;
    flex-direction : column;
    gap : 1rem;
    margin : 1rem 9rem 2rem 9rem;
    
    }

    .top_dash{
     display : flex;
     flex-direction : row;
     align-items : flex-start;
     gap : 1rem;
     
}


    .main-card {
        flex : 2 1 0;
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border-radius: 1rem;
        padding: 1.5rem;
        color: white;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .year-label {
        font-size: 0.875rem;
        color: #94a3b8;
        margin-bottom: 0.5rem;
        display: block;
    }

    .score-section {
        display: flex;
        align-items: baseline;
        gap: 1rem;
    }

    .card-value {
        font-size: 2.5rem;
        font-weight: 600;
        color: #fff;
        margin: 0;
    }

    .trend-badge {
        padding: 0.25rem 0.75rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        font-size: 0.875rem;
    }

    .time-filter {
        display: flex;
        gap: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        padding: 0.25rem;
        border-radius: 0.5rem;
    }

    .time-btn {
        padding: 0.25rem 0.75rem;
        border: none;
        background: transparent;
        color: #94a3b8;
        border-radius: 0.375rem;
        cursor: pointer;
    }

    .time-btn.active {
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }

    .chart-container {
        height: 200px;
        margin-top: 1rem;
    }

    .highlight-card {
        background: #ecfccb;
    }

    .stat-header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
    }

    .stat-value-large {
        font-size: 3.5rem;
        font-weight: 900;
        color: rgba(0, 0, 0, 0.55);
        margin: 0.25rem;
    }

    .stat-subtitle {
        color:rgba(94, 40, 165, 0.81);
        font-size: 1.2rem;
        font-weight: 500;
    }

    .stat-footer {
        display: flex;
        
    }

    .streak-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 1rem;
        font-size: 1rem;
        color: #1e293b;
    }

    .low_dash{
        display : flex;
        flex-direction : row;
        gap : 1rem;
    }

    .ustat_graph{
        flex : 1 1 0;
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
       
    }

    .rankings-card {
        flex : 2 1 0;
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        
    }

    /* Responsive adjustments */
    @media (max-width: 1000px) {
        .summary_encl {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
            height: 100%;
            margin: 0 !important;
        }

        .top_dash {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        .low_dash {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        }
    }
`;