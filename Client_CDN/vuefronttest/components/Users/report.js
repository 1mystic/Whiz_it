const report = {
    name: 'report',
template: `
  <div class="container">
    <!-- Header Section -->
    <header>
      <div class="user-info">
        <div class="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div class="user-detail">
          <h2 v-if="userData">{{ userData.full_name || 'Premium User' }}</h2>
          <p>Personalized Preparation Plan</p>
        </div>
      </div>
     
    </header>

    <!-- Loading/Error States -->
    <div v-if="isLoadingData" class="loading-message">Loading performance data...</div>
    <div v-if="fetchError" class="error-message">Error loading data: {{ fetchError }}</div>
    <div v-if="!isLoadingData && !fetchError && !performanceData" class="info-message">No performance data available yet. Try taking some quizzes!</div>

    <!-- Dashboard Grid (only show if data loaded) -->
    <div v-if="performanceData" class="dashboard-grid">
      <!-- Left column -->
      <div class="left-column">
        <div class="card performance-card">
          <h3>Performance Overview</h3>
          <div class="progress-ring">
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle class="progress-circle progress-circle-bg" cx="75" cy="75" r="60" />
              <circle class="progress-circle progress-circle-value"
                      cx="75" cy="75" r="60"
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="progressOffset" />
            </svg>
            <div class="progress-text">{{ overallMasteryFormatted }}%</div>
          </div>
          <p>Overall Mastery</p>

          <div class="performance-stats">
            <div class="stat-item">
              <!-- SVG Icon -->
              <h4>{{ performanceData.performance.quizzes_taken }}</h4>
              <p>Quizzes Taken</p>
            </div>
            <div class="stat-item">
               <!-- SVG Icon -->
              <h4>{{ overallMasteryFormatted }}%</h4>
              <p>Avg. Score</p> <!-- Changed from Success Rate -->
            </div>
            <div class="stat-item">
               <!-- SVG Icon -->
              <h4>{{ studyTimeFormatted }}</h4> <!-- Placeholder -->
              <p>Study Time</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Focus Areas (Weakest Chapters)</h3>
          <div v-if="weakestChapters.length > 0" class="topic-list">
             <div v-for="chapter in weakestChapters" :key="chapter.chapter_id || chapter.chapter_name" class="topic-item">
                <div class="topic-header">
                    <span class="topic-title">{{ chapter.chapter_name }} <small>({{ chapter.subject_name }})</small></span>
                    <span>{{ chapter.average_score.toFixed(1) }}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-value" :style="{ width: chapter.average_score + '%', backgroundColor: getProgressBarColor(chapter.average_score) }"></div>
                </div>
                <div class="topic-stats">
                    <span>{{ chapter.quizzes_taken }} quizzes taken</span>
                    <!-- Add last attempt date if available -->
                </div>
             </div>
          </div>
          <div v-else class="info-message">No specific weak areas identified yet. Keep practicing!</div>
        </div>
      </div>

      <!-- Right column - AI Report & Suggestions -->
      <div class="right-column">
        <div class="card">
            <h3>AI Performance Analysis & Recommendations</h3>

            <div v-if="isLoadingAIReport" class="loading-message">
              Generating your personalized report... <span class="spinner">🧠</span>
            </div>

            <div v-if="aiError" class="error-message">
              Could not generate AI report: {{ aiError }}
              <button @click="generateAIReport" :disabled="isLoadingAIReport">Retry</button>
            </div>

            <div v-if="aiReportContent && !isLoadingAIReport" class="ai-report-content" v-html="formattedAiReportContent"></div>

             <div v-if="!aiReportContent && !isLoadingAIReport && !aiError && performanceData?.raw_data_for_ai !== 'No quiz attempts recorded.'" class="text-center">
                 <button @click="generateAIReport" :disabled="isLoadingAIReport" class="generate-btn">
                    Generate AI Insights
                 </button>
             </div>
              <div v-if="performanceData?.raw_data_for_ai === 'No quiz attempts recorded.'" class="info-message">
                 Complete some quizzes to get your AI analysis.
             </div>
        </div>

        <!-- Example Placeholder for Recommended Materials (Could be driven by AI report) -->
         <!-- <div class="card" style="margin-top: 20px;">
         <br>
            <h3>Recommended Materials (Example)</h3>
             <p v-if="!aiReportContent">Generate the AI report above for personalized material suggestions.</p>
             <div v-if="aiReportContent">
                 Content based on AI suggestions would go here...
             </div>
        </div> -->
      </div>
    </div>
  </div>
`,

  data() {
    return {
      userData: null,
      performanceData: null,
      isLoadingData: true,
      fetchError: null,
      aiReportContent: null,
      isLoadingAIReport: false,
      aiError: null,
      circumference: 2 * Math.PI * 60, // For progress circle
    };
  },
  computed: {
    overallMastery() {
      return this.performanceData?.performance?.overall_average_score ?? 0;
    },
    overallMasteryFormatted() {
        return this.overallMastery.toFixed(1);
    },
    progressOffset() {
      // Calculate offset for SVG circle dash
      return this.circumference - (this.overallMastery / 100) * this.circumference;
    },
    studyTimeFormatted() {
        // Placeholder - implement actual logic if time is tracked
        const seconds = this.performanceData?.performance?.total_study_time_seconds ?? 0;
        if (seconds < 3600) {
            return `${Math.round(seconds/60)}m`;
        }
        return `${(seconds / 3600).toFixed(1)}h`;
    },
    weakestChapters() {
        // Use the pre-sorted data from the backend
        return this.performanceData?.breakdown?.weakest_chapters ?? [];
    },
    formattedAiReportContent() {
        if (this.aiReportContent) {
            // Check if marked is available
            if (typeof marked === 'undefined') {
                console.warn('Marked library not found, displaying raw content');
                return this.aiReportContent;
            }
            
            // Use the correct API based on which version is available
            if (typeof marked === 'function') {
                // Old API (marked is a function)
                return marked(this.aiReportContent);
            } else if (marked && typeof marked.parse === 'function') {
                // New API (marked.parse method)
                return marked.parse(this.aiReportContent);
            } else {
                // Fallback if marked exists but neither expected pattern works
                console.warn('Marked library found but API is unexpected, displaying raw content');
                return this.aiReportContent;
            }
        }
        return '';
    }
  },
  methods: {
    async fetchPerformanceData() {
      this.isLoadingData = true;
      this.fetchError = null;
      this.performanceData = null; // Reset previous data
      this.aiReportContent = null; // Reset AI report
      this.aiError = null;

      try {
        // Get JWT Token from localStorage
        const token = localStorage.getItem('token'); // Make sure this matches your storage key
        if (!token) {
          throw new Error('Authentication token not found.');
        }

        const response = await fetch('http://127.0.0.1:5000/api/user/performance-data', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data) {
           this.performanceData = data;
           this.userData = data.user;
        } else {
            throw new Error('Received empty data from server.');
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
        this.fetchError = error.message || 'An unknown error occurred.';
      } finally {
        this.isLoadingData = false;
      }
    },

    async generateAIReport() {
      if (!this.performanceData || !this.performanceData.raw_data_for_ai || this.performanceData.raw_data_for_ai === 'No quiz attempts recorded.') {
        this.aiError = "No performance data available to generate report.";
        return;
      }

      this.isLoadingAIReport = true;
      this.aiError = null;
      this.aiReportContent = null; // Clear previous report

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found.');
        }

        const response = await fetch('http://127.0.0.1:5000/api/user/ai-insights', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            performance_data: this.performanceData.raw_data_for_ai
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.aiReportContent = data.content;
      } catch (error) {
        console.error('Error generating AI report:', error);
        this.aiError = error.message || 'Unknown AI error.';
      } finally {
        this.isLoadingAIReport = false;
      }
    },

    getProgressBarColor(score) {
      if (score < 40) return '#ff3333'; // Red
      if (score < 70) return '#ff9900'; // Orange
      return '#4CAF50'; // Green (adjust thresholds as needed)
    }
  },
  mounted() {
    this.fetchPerformanceData(); // Fetch data when component mounts
    // Event listeners for filters etc. could be added here if implemented
  },
};

const report_style= `
:root {
    --primary-color: #ff5733;
    --secondary-color: #3a3a3a;
    --bg-color: #f5f5f5;
    --card-bg: white;
    --text-color: #333;
    --border-radius: 8px;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body { /* Note: Styles here might not affect body directly from scoped style */
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: var(--bg-color);
    color: var(--text-color);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap; /* Allow wrapping on small screens */
}

.user-info {
    display: flex;
    align-items: center;
    margin-bottom: 10px; /* Spacing on wrap */
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ddd;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.user-detail h2 {
    margin: 0;
    font-size: 18px;
}

.user-detail p {
    margin: 0;
    font-size: 14px;
    color: #666;
}

.search-bar {
    display: flex;
    background: white;
    border-radius: var(--border-radius);
    padding: 8px 16px;
    box-shadow: var(--shadow);
    width: 100%; /* Make search full width on small screens */
    max-width: 300px; /* Limit width on larger screens */
    margin-bottom: 10px; /* Spacing on wrap */
}

.search-bar input {
    border: none;
    flex-grow: 1;
    outline: none;
    font-size: 14px;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr; /* Default to single column */
    gap: 20px;
}

@media (min-width: 992px) { /* Apply two columns on larger screens */
    .dashboard-grid {
        grid-template-columns: 1fr 2fr;
    }
}

.card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 20px;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
}

.performance-card {
    text-align: center;
    position: relative;
}

.progress-ring {
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 auto 20px;
}

.progress-circle {
    fill: none;
    stroke-width: 15;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s ease-out; /* Add transition */
}

.progress-circle-bg {
    stroke: #e6e6e6;
}

.progress-circle-value {
    stroke: var(--primary-color);
    transform-origin: center;
    transform: rotate(-90deg);
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    font-weight: bold;
}

.performance-stats {
    display: flex;
    justify-content: space-around; /* Better spacing */
    margin-top: 15px;
    flex-wrap: wrap; /* Allow wrapping */
}

.stat-item {
    text-align: center;
    flex-basis: 80px; /* Ensure items have base width */
    padding: 10px;
    border-radius: var(--border-radius);
}
.stat-item svg { /* Style SVGs if needed */
    width: 20px;
    height: 20px;
    margin-bottom: 5px;
    color: #666;
}

.stat-item h4 {
    margin: 5px 0 5px;
    font-size: 16px; /* Slightly larger */
}

.stat-item p {
    margin: 0;
    font-size: 12px;
    color: #666;
}

.topic-list {
    margin-top: 20px;
}

.topic-item {
    margin-bottom: 25px;
}

.topic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px; /* Reduced margin */
}

.topic-title {
    font-weight: bold;
    font-size: 15px; /* Slightly smaller */
}
.topic-title small {
    font-weight: normal;
    font-size: 12px;
    color: #666;
}

.progress-bar {
    height: 10px;
    background-color: #e6e6e6;
    border-radius: 5px;
    margin: 5px 0;
    overflow: hidden;
}

.progress-value {
    height: 100%;
    border-radius: 5px;
    transition: width 0.5s ease-out, background-color 0.5s ease; /* Add transition */
}

.topic-stats {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    margin-top: 5px; /* Add margin */
}

/* Styles for filters, recommendations etc. from the original HTML */
 .filters {
    display: flex;
    margin-bottom: 20px;
    gap: 10px;
    flex-wrap: wrap;
}

.filter-btn {
    background: white;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 8px 15px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn.active {
    background: var(--secondary-color);
    color: white;
    border-color: var(--secondary-color);
}

/* AI Report Specific Styles */
.loading-message, .error-message, .info-message {
    text-align: center;
    padding: 20px;
    margin: 15px 0;
    border-radius: var(--border-radius);
}
.loading-message {
    background-color: #eef;
    color: #33a;
}
.error-message {
    background-color: #fdd;
    color: #c33;
}
.info-message {
    background-color: #eee;
    color: #555;
}

.spinner {
    display: inline-block;
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.ai-report-content {
    margin-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: var(--border-radius);
    border: 1px solid #eee;
    line-height: 1.6;
    font-size: 15px;
}

/* Style markdown elements generated by AI */
.ai-report-content ::v-deep(h2) { /* Use ::v-deep or :deep() for scoped styles */
    font-size: 1.3em;
    color: var(--primary-color);
    margin-top: 1.5rem;
    margin-bottom: 0.8em;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.3em;
}
.ai-report-content ::v-deep(h2):first-child {
    margin-top: 1rem;
}

.ai-report-content ::v-deep(h3) {
    font-size: 1.1em;
    color: var(--secondary-color);
    margin-top: 1.2em;
    margin-bottom: 0.6em;
}

.ai-report-content ::v-deep(ul), .ai-report-content ::v-deep(ol) {
    padding-left: 25px;
    margin-bottom: 1em;
}

.ai-report-content ::v-deep(li) {
    margin-bottom: 0.5em;
}

.ai-report-content ::v-deep(strong) {
    color: #000;
}

.generate-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: block;
    margin: 20px auto 0;
}
.generate-btn:hover:not(:disabled) {
    background-color: #e04420;
}
.generate-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
.text-center {
    text-align: center;
}


/* Media query adjustments from original */
@media (max-width: 768px) {
    .performance-stats {
        justify-content: space-around; /* Keep space around on smaller screens */
    }
    .filters {
        justify-content: center;
    }
     header {
        flex-direction: column;
        align-items: flex-start;
    }
     .search-bar {
        width: 100%;
        max-width: none;
        margin-top: 15px;
    }
}`
document.head.insertAdjacentHTML('beforeend', `<style>${report_style}</style>`);
