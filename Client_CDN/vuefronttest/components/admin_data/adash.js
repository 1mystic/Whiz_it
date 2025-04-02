const adash = {
    name: 'adash',
    template: `
      <div class="admin-dashboard">
        
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-users"></i></div>
            <div class="stat-info">
              <h3 class="stat-value">{{ uniqueUsers }}</h3>
              <p>Unique Users</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
            <div class="stat-info">
              <h3 class="stat-value">{{ averageScore }}%</h3>
              <p>Average Score</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-trophy"></i></div>
            <div class="stat-info">
              <h3 class="stat-value">{{ topQuiz }}</h3>
              <p>Most Attempted Quiz</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="fas fa-clock"></i></div>
            <div class="stat-info">
              <h3 class="stat-value">{{ recentAttempts }}</h3>
              <p>Attempts in Last 24h</p>
            </div>
          </div>
        </div>
        
        <div class="charts-container">
          <div class="chart-row">
            <div class="chart-card">
              <div class="chart-header">
                <h3>User Engagement Over Time</h3>
              </div>
              <div class="chart-container">
                <canvas ref="engagementChart"></canvas>
              </div>
            </div>
            <div class="chart-card">
              <div class="chart-header">
                <h3>Quiz Attempts</h3>
              </div>
              <canvas ref="quizAttemptsChart" style="padding-bottom:1rem;"></canvas>
            </div>
            <div class="chart-card">
              <div class="chart-header">
                <h3>Score Distribution</h3>                 
              </div>
              <canvas ref="distributionChart" style="max-height:14rem; padding-bottom:0.5rem;"></canvas>
            </div>

          </div>

          <div class="chart-row">
            
            <div class="chart-card">
              <div class="chart-header">
                <h3>Subject Popularity</h3>
              </div>
              <canvas ref="popularityChart"></canvas>
            </div>
            <div class="chart-card">
              <div class="chart-header">
                <h3>Top Users by Subject Scores</h3>
              </div>

                <canvas id="topUserChart_style" ref="topUsersChart"></canvas>
              
            </div>
            <div class="chart-card">
              <div class="chart-header">
                <h3>Performance Trends</h3>
                <div class="chart-legend">
                  <span class="legend-dot trend"></span> Daily Average Score
                </div>
              </div>
              <div class="chart-container">
                <canvas ref="trendChart"></canvas>
              </div>
            </div>
          </div>
          
          <div class="chart-row">
            
          </div>
          
          
        </div>
      </div>
    `,
    data() {
      return {
        scores: [],
        quizzes: [],
        subjects: [],
        charts: {}
      }
    },
    computed: {
      uniqueUsers() {
        return [...new Set(this.scores.map(s => s.user_id))].length;
      },
      averageScore() {
        const total = this.scores.reduce((sum, s) => sum + s.score, 0);
        return (this.scores.length ? (total / this.scores.length).toFixed(1) : 0);
      },
      topQuiz() {
        const quizCounts = {};
        this.scores.forEach(s => {
          quizCounts[s.quiz_title] = (quizCounts[s.quiz_title] || 0) + 1;
        });
        return Object.entries(quizCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'None';
      },
      recentAttempts() {
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return this.scores.filter(s => new Date(s.timestamp) > last24h).length;
      }
    },
    methods: {
      async fetchData() {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
          const [scoresData, quizzesData] = await Promise.all([
            fetch('http://127.0.0.1:5000/api/allusers/scores', { headers }).then(r => r.json()),
            fetch('http://127.0.0.1:5000/api/quizzes', { headers }).then(r => r.json())
          ]);
          this.scores = scoresData;
          this.quizzes = quizzesData;
          // Extract unique subjects from quizzes
          this.subjects = Array.from(new Set(this.quizzes.map(q => q.subject_name)));
          this.initCharts();
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      },
      initCharts() {
        // remove old chart
        Object.keys(this.charts).forEach(key => {
          if (this.charts[key]) this.charts[key].destroy();
        });
        
        // Engagement Chart line 1
        this.charts.engagement = new Chart(this.$refs.engagementChart, {
          type: 'line',
          data: this.getEngagementData(),
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { display: false } }
            },
            elements: {
              line: { tension: 0.4 },
              point: { radius: 4, backgroundColor: '#6366f1', borderColor: '#fff', borderWidth: 2 }
            }
          }
        });
        
        // Quiz Attempts Chart barh
        this.charts.quizAttempts = new Chart(this.$refs.quizAttemptsChart, {
          type: 'bar',
          data: this.getQuizAttemptsData(),
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: {
                display: false,
                grid: { display: false },
                max: Math.max(...this.getQuizAttemptsData().datasets[0].data) + 1
              },
              y: { grid: { display: false } }
            },
            layout: { padding: { left: 10, right: 10 } },
            elements: {
              bar: { borderRadius: 12 }
            }
          }
        });
        
        // Top Users Chart bar top 3 users
        this.charts.topUsers = new Chart(this.$refs.topUsersChart, {
          type: 'bar',
          data: this.getTopUsersData(),
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'top', align: 'start', labels: { boxWidth: 20, padding: 15 } }
            },
            scales: {
              x: {
          display: false,
          grid: { display: false },
          max: Math.max(...this.getTopUsersData().datasets.map(dataset => Math.max(...dataset.data))) + 1
              },
              y: { grid: { display: false } }
            },
            elements: {
              bar: { borderRadius: 12 }
            }
          }
        });
        
        // Performance Trends Chart  line 2
        this.charts.trend = new Chart(this.$refs.trendChart, {
          type: 'line',
          data: this.getTrendData(),
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { display: false } }
            },
            elements: {
              line: { tension: 0.4, borderWidth: 2, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)' },
              point: { radius: 4, backgroundColor: '#6366f1', borderColor: '#fff', borderWidth: 2 }
            }
          }
        });
        
        // Score Distribution Chart doughnut
        this.charts.distribution = new Chart(this.$refs.distributionChart, {
            type: 'doughnut',
            data: this.getDistributionData(),
            
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',      // Move legend to the top
                  align: 'center',      // Center-align the legend items horizontally
                  labels: {
                    boxWidth: 20,
                    padding: 15,
                    usePointStyle: true  //  legend items as points
                  }
                }
              },
              elements: {
                arc: { borderRadius: 10 }
              },
              layout: {
                //  extra top padding 
                padding: {
                  top: 10,
                  bottom: 10
                }
              }
            }
          });
          
        
        // Subject Popularity Chart –barh
        this.charts.popularity = new Chart(this.$refs.popularityChart, {
          type: 'bar',
          data: this.getPopularityData(),
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: {
                display: false,
                grid: { display: false },
                max: Math.max(...this.getPopularityData().datasets[0].data) + 1
              },
              y: { grid: { display: false } }
            },
            layout: { padding: { left: 10, right: 10 } },
            elements: {
              bar: { borderRadius: 12 }
            }
          }
        });
      
      },
      
      getEngagementData() {
        // Grouping attempts by date (YYYY-MM-DD)
        const dateMap = {};
        this.scores.forEach(s => {
          const date = s.timestamp.split('T')[0];
          dateMap[date] = (dateMap[date] || 0) + 1;
        });
        const dates = Object.keys(dateMap).sort();
        const attempts = dates.map(date => dateMap[date]);
        return {
          labels: dates,
          datasets: [{
            label: 'Attempts',
            data: attempts,
            borderColor: 'rgba(129, 67, 67, 0.8)',
            backgroundColor: 'rgba(92, 75, 62, 0.1)',
            fill: true,
            tension: 0.4
          }]
        };
      },
      getQuizAttemptsData() {
        // Count attempts per quiz using quizzes data for labels
        const quizAttemptCounts = {};
        this.quizzes.forEach(q => { quizAttemptCounts[q.title] = 0; });
        this.scores.forEach(s => {
          if (quizAttemptCounts.hasOwnProperty(s.quiz_title)) {
            quizAttemptCounts[s.quiz_title]++;
          } else {
            quizAttemptCounts[s.quiz_title] = 1;
          }
        });
        const labels = Object.keys(quizAttemptCounts);
        const data = labels.map(label => quizAttemptCounts[label]);
        return {
          labels,
          datasets: [{
            label: 'Attempts',
            data,
            backgroundColor: ["rgba(119, 60, 106, 0.57)","rgba(88, 64, 50, 0.8)"],
          }]
        };
      },
      getTopUsersData() {
        // score summation 
        const userScores = {};
        this.scores.forEach(s => {
          // find subject from quiz
          const quiz = this.quizzes.find(q => q.id === s.quiz_id);
          const subject = quiz ? quiz.subject_name : 'Unknown';
          if (!userScores[s.user_id]) {
            userScores[s.user_id] = { total: 0, subjects: {} };
            this.subjects.forEach(sub => userScores[s.user_id].subjects[sub] = 0);
          }
          userScores[s.user_id].total += s.score;
          userScores[s.user_id].subjects[subject] += s.score;
        });
        // top 3 sorted users
        const topUsers = Object.entries(userScores)
          .sort((a, b) => b[1].total - a[1].total)
          .slice(0, 3);
        
        const colors = [
          'rgba(219, 113, 99, 0.81)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(243, 206, 137, 0.9)',
          'rgba(250, 84, 84, 0.81)'
        ];
        const datasets = topUsers.map(([userId, data], index) => ({
          label: `User ${userId}`,
          data: this.subjects.map(sub => data.subjects[sub]),
          fill: true,
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          pointBackgroundColor: '#fff'
        }));
        
        return {
          labels: this.subjects,
          datasets
        };
      },
      getTrendData() {
        //  daily average score
        const dateScores = {};
        this.scores.forEach(s => {
          const date = s.timestamp.split('T')[0];
          if (!dateScores[date]) dateScores[date] = { sum: 0, count: 0 };
          dateScores[date].sum += s.score;
          dateScores[date].count++;
        });
        const dates = Object.keys(dateScores).sort();
        const averages = dates.map(date => (dateScores[date].sum / dateScores[date].count).toFixed(1));
        return {
          labels: dates,
          datasets: [{
            label: 'Average Score',
            data: averages,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#6366f1',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        };
      },
      getDistributionData() {
        // 
        const ranges = {
          '90-100': 0,
          '70-89': 0,
          '50-69': 0,
          '<50': 0
        };
        this.scores.forEach(s => {
          if (s.score >= 90) ranges['90-100']++;
          else if (s.score >= 70) ranges['70-89']++;
          else if (s.score >= 50) ranges['50-69']++;
          else ranges['<50']++;
        });
        return {
          labels: Object.keys(ranges),
          datasets: [{
            data: Object.values(ranges),
            backgroundColor: [
              'rgba(73, 104, 103, 0.99)',
              'rgba(157, 151, 243, 0.9)',
              'rgba(243, 206, 137, 0.9)',
              'rgba(250, 84, 84, 0.81)'
            ],
            borderWidth: 1,
            hoverOffset: 4
          }]
        };
      },
      getPopularityData() {
        // per subject attempts count
        const subjectCounts = {};
        this.subjects.forEach(sub => subjectCounts[sub] = 0);
        this.scores.forEach(s => {
          const quiz = this.quizzes.find(q => q.id === s.quiz_id);
          const subject = quiz ? quiz.subject_name : 'Unknown';
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });
        return {
          labels: Object.keys(subjectCounts),
          datasets: [{
            label: 'Attempts',
            data: Object.values(subjectCounts),
            backgroundColor: 'rgba(105, 79, 70, 0.62)',
            borderRadius: 8,
            maxBarThickness: 60
          }]
        };
      }
    },
    mounted() {
      this.fetchData();
    }
  };
  
  document.head.appendChild(document.createElement('style')).textContent = `
  .admin-dashboard {
    padding: 2rem;
    /*background: rgba(243,247,250,255);*/
    min-height: 100vh;
    max-width: 1600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  h1 {
    text-align: center;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  
  .stats-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: space-between;
  }
  .stat-card {
    flex: 1 1 calc(25% - 1rem);
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    transition: transform 0.2s;
  }
  .stat-card:hover {
    transform: translateY(-2px);
  }
  .stat-icon {
    background: rgba(99,102,241,0.1);
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-size: 1.5rem;
    color: #6366f1;
  }
  .stat-info h3 {
    font-size: 1.5rem;
    margin: 0;
    color: #1f2937;
  }
  .stat-info p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }
  .charts-container {
    margin: 4rem 0.5rem 1rem 0.5rem;
  }
  .chart-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .chart-card {
    background: rgb(248 250 252);
    border-radius: 1.2rem;
    border: 4px solid rgba(117, 86, 86, 0.2);
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    height: 400px;
  }
  .chart-card.full-width {
    grid-column: 1 / -1;
    height: 300px;
  }
  .chart-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0,0,0,0.08);
  }
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .chart-header h3 {
    font-size: 1.1rem;
    color: #1f2937;
    font-weight: 600;
    margin: 0;
    font-family: 'Poppins', sans-serif;
  }

  .chart-container {
    position: relative;
    height: 90%;
    padding-bottom: 1rem;
  }
    .chart-container canvas{
    padding-bottom: 1rem;
  }
  #topUserChart_style{
  padding-bottom: 1rem;
  }

  .chart-legend {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  .legend-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;
  }
  .legend-dot.trend { background: #6366f1; }
  .legend-dot.excellent { background: #10b981; }
  .legend-dot.good { background: #6366f1; }
  .legend-dot.average { background: #f59e0b; }
  .legend-dot.needs-improvement { background: #ef4444; }
  @media (max-width: 768px) {
    .admin-dashboard { padding: 1rem; }
    .chart-card { height: 300px; }
    .chart-card.full-width { height: 250px; }
    .chart-header { flex-direction: column; gap: 0.5rem; }
    .chart-legend { flex-wrap: wrap; justify-content: flex-start; }
    .stat-card { flex: 1 1 100%; }
  }
  `;
  
  