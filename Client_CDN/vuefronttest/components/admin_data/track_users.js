const track_users = {
    template: `
        <div class="user-analytics-container">
            <!-- Performance Overview Cards -->
            <div class="analytics-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-content">
                        <h3>{{ totalUniqueUsers }}</h3>
                        <p>Active Users</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <div class="stat-content">
                        <h3>{{ totalQuizAttempts }}</h3>
                        <p>Total Attempts</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="stat-content">
                        <h3>{{ averageScore.toFixed(1) }}%</h3>
                        <p>Average Score</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <h3>{{ lastDayAttempts }}</h3>
                        <p>Last 24h Attempts</p>
                    </div>
                </div>
            </div>

            <!-- User Performance Table -->
            <div class="performance-table-container">
                <div class="table-header">
                    <h2>User Performance History</h2>
                    <div class="table-actions">
                        <div class="search-box">
                            
                            <input type="text" v-model="searchQuery" placeholder="Search users...">
                        </div>
                        <button @click="exportData" class="export-btn">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="performance-table">
                        <thead>
                            <tr>
                                <th> User </th>
                                <th> Status </th>
                                <th @click="sortBy('timestamp')" class="sortable">
                                    Date/Time
                                    <i class="fas" :class="getSortIcon('timestamp')"></i>
                                </th>
                                <th @click="sortBy('quiz_title')" class="sortable">
                                    Quiz Title
                                    <i class="fas" :class="getSortIcon('quiz_title')"></i>
                                </th>
                                <th @click="sortBy('score')" class="sortable">
                                    Score
                                    <i class="fas" :class="getSortIcon('score')"></i>
                                </th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="attempt in filteredAndSortedAttempts" :key="attempt.timestamp"
                                @click="fetch_user(attempt.user_id)"
                                style="cursor: pointer;">
                                <td> <button @click="fetch_user(attempt.user_id)"
                                     class="u_button">
                                {{ attempt.user_id }} </button> </td>
                                <td>{{ attempt.user_status ? 'Active' : 'Blocked' }}</td>
                                <td>{{ formatDate(attempt.timestamp) }}</td>
                                <td>{{ attempt.quiz_title }}</td>
                                <td>{{ attempt.score.toFixed(1) }}%</td>
                                <td>
                                    <div class="score-badge" :class="getScoreClass(attempt.score)">
                                        {{ getScoreLabel(attempt.score) }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="modal fade" id="userModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <!-- Modal Header -->
                <div class="modal-header">
                <h5 class="modal-title"><i class="fas fa-user-circle me-2"></i> User Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <!-- Modal Body -->
                <div class="modal-body">
                <div class="modal-items">
                    <!-- User Profile -->
                    
                    <h3 class="user-name">{{ user_name }}</h3>
                    
                    
                    <!-- Stats -->
                    <div class="badges mb-2">
                        <span class="badgen attempts">Attempts: {{ user_attempts }}</span>
                        <span class="badgen avg">Avg: {{ user_avg }}</span>
                        <span class="badgen best">Best: {{ user_best }}</span>
                    </div>
                    
                    
                    <!-- Contact & Actions -->
                    <div class="user-actions">
                    <p class="email">
                        <i class="fas fa-envelope me-2"></i> {{ user_email }}
                    </p>
                    <button 
                        @click="block_user_trigger(curr_user_id)" 
                        :class="{'blocked_user': is_user_blocked, 'normal_user': !is_user_blocked}"
                    >
                        {{ is_user_blocked ? 'Unblock User' : 'Block User' }}
                    </button>
                    <div class="notify">    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    `,

    data() {
        return {
            userScores: [],
            searchQuery: '',
            sortKey: 'timestamp',
            sortOrder: 'desc',
            loading: false,
            user_name: '',
            user_avg: '',
            user_best: '',
            user_attempts: '',
            user_email: '',
            curr_user_id: '',            
            is_user_blocked: false,
            
        }
    },

    computed: {
        totalUniqueUsers() {
            return [...new Set(this.userScores.map(score => score.user_id))].length;
        },

        totalQuizAttempts() {
            return this.userScores.length;
        },

        averageScore() {
            if (this.userScores.length === 0) return 0;
            return this.userScores.reduce((acc, score) => acc + score.score, 0) / this.userScores.length;
        },

        lastDayAttempts() {
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            return this.userScores.filter(score => new Date(score.timestamp) > oneDayAgo).length;
        },

        filteredAndSortedAttempts() {
            return this.userScores
                .filter(attempt => {
                    const searchTerm = this.searchQuery.toLowerCase();                    
                    return attempt.quiz_title.toLowerCase().includes(searchTerm) ||
                    attempt.user_id.toString().toLowerCase().includes(searchTerm);
                })
                .sort((a, b) => {
                    const modifier = this.sortOrder === 'desc' ? -1 : 1;
                    if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
                    if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
                    return 0;
                });
                
        }
    },

    methods: {
        async fetchData() {
            try {
                this.loading = true;
                const token = localStorage.getItem('token');
                const response = await fetch('https://whiz-it.onrender.com/api/allusers/scores', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log('Fetched user scores:', data); // Debugging statement
                this.userScores = data;
            } catch (error) {
                console.error('Error fetching user scores:', error);
            } finally {
                this.loading = false;
            }
        },

        formatDate(timestamp) {
            return new Date(timestamp).toLocaleString();
        },

        sortBy(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'desc';
            }
        },

        getSortIcon(key) {
            if (this.sortKey === key) {
                return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
            }
            return 'fa-sort';
        },

        getScoreClass(score) {
            if (score >= 90) return 'excellent';
            if (score >= 75) return 'good';
            if (score >= 60) return 'average';
            return 'needs-improvement';
        },

        getScoreLabel(score) {
            if (score >= 90) return 'Excellent';
            if (score >= 75) return 'Good';
            if (score >= 60) return 'Average';
            return 'Needs Work';
        },

        exportData() {
            const csvContent = this.userScores.map(score => {
                return [
                    score.user_id,
                    this.formatDate(score.timestamp),
                    score.quiz_title,
                    score.score.toFixed(1) + '%'
                ].join(',');
            });

            const headers = ['User,Date/Time,Quiz Title,Score'].join(',');
            const csv = [headers, ...csvContent].join('\n');
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'user-performance.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },

        async fetch_user(userid) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`https://whiz-it.onrender.com/api/user/${userid}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log('Fetched user:', data); // Debugging statement
                this.user_name = data.name;
                this.user_email = data.email;
                this.user_avg = data.avg_score;
                this.user_best = data.best_score;
                this.user_attempts = data.all_attempts;
                this.curr_user_id = userid;
                this.is_user_blocked = !data.user_status;
                new bootstrap.Modal(document.getElementById('userModal')).show();
            } catch (error) {
                console.error('Error fetching user:', error);
            }
            
        },
        async block_user_trigger(user_id) {            
                const token = localStorage.getItem('token');
                if (this.is_user_blocked) {
                    try {
                        
                        const response = await fetch(`https://whiz-it.onrender.com/api/unblock_user/${user_id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        this.is_user_blocked = false;
                        this.user_notify_ub();
                    } catch (error) {
                        console.error('Error blocking user:', error);
                        this.user_notify_error(error);
                    }
                } else {
                    try{
                        const response = await fetch(`https://whiz-it.onrender.com/api/block_user/${user_id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        this.is_user_blocked = true;
                        this.user_notify_b();
                    } catch (error) {
                        console.error('Error blocking user:', error);
                        this.user_notify_error(error);
                    }
                }
            },
        user_notify_b() {
            const notify = document.querySelector('.notify');
            notify.innerHTML = 'User blocked';
            notify.style.color = 'red';            
            notify.style.fontSize = '1rem';
            setTimeout(() => {
                notify.innerHTML = '';
            }, 5000);
        },

        user_notify_ub(){
            const notify = document.querySelector('.notify');
            notify.innerHTML = 'User unblocked';
            notify.style.color = 'green';            
            notify.style.fontSize = '1rem';
            setTimeout(() => {
                notify.innerHTML = '';
            }, 5000);
        },
        user_notify_error(err_msg){
            const notify = document.querySelector('.notify');
            notify.innerHTML = 'Error:' + err_msg;
            notify.style.color = 'red';            
            notify.style.fontSize = '1rem';
            setTimeout(() => {
                notify.innerHTML = '';
            }, 5000);
        }
               
    },

    mounted() {
        this.fetchData();
    }

};

const tstyles = `

.modal-items {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.5rem;
}

.u_button {
    background : none;
    border: none;
    color: rgba(31, 77, 39, 0.93);    
    text-decoration: none;
    display: inline-block;
    cursor: pointer;   
    font-weight: 600;
}
    .u_buttonb {
    background : none;
    border: none;
    color: rgba(255, 0, 0, 0.93);
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    font-weight: 600;
}

.blocked_user {
    background-color: rgba(255, 0, 0, 0.5);
    color: rgba(0, 0, 0, 0.5);
    border-radius: 1.5rem;
    padding: 0.2rem 0.5rem;
}
.normal_user {
    background-color: rgba(0, 255, 0, 0.5);
    color: rgba(0, 0, 0, 0.5);
    border-radius: 1.5rem;
    padding: 0.2rem 0.5rem;
}

.badgen {

    padding: 0.2rem 0.5rem;
    border : none !important;
    font-size: 0.7rem;
    margin: 0.2rem 0.2rem 1rem 0rem; ;
    border-radius: 2rem;
    background: rgba(138, 137, 132, 0.34);
    color: rgb(49, 49, 48);
    border: 2px solid rgba(155, 149, 97, 0.5);
    }


.user-analytics-container {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 12px;
}

.analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-3px);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    background: #4361ee1a;
    color: #4361ee;
}

.stat-content h3 {
    margin: 0 !important;
    font-size: 1.5rem;
    font-weight: 600;
}

.stat-content p {
    margin: 0 !important;
    color: #6b7280;
    font-size: 0.875rem;
}

.performance-table-container {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.table-header h2 {
    margin: 0;
    font-size: 1.25rem;
}

.table-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.search-box {
    position: relative;
}

.search-box i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
}

.search-box input {
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 3rem;
    outline: none;
    width: 10rem;
    margin-bottom: 0.4rem;
}

.export-btn {
    padding: 0.5rem 1rem;
    background:rgb(223, 115, 88);
    color: white;
    border: none;
    border-radius: 3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background 0.2s;
}

.export-btn:hover {
    background:rgb(197, 112, 109);
}

.performance-table {
    width: 100%;
    border-collapse: collapse;
}

.performance-table th,
.performance-table td {
    padding: 1.1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    font-family: Lexend Deca, sans-serif;
}

.performance-table th {
    background: #f8f9fa;
    font-weight: 600;
}
.performance-table thead th:first-child {
border-top-left-radius: 0.5rem;
}

.performance-table thead th:last-child {
border-top-right-radius: 0.5rem;
}

.performance-table tbody tr:hover {
    background: rgba(233, 119, 119, 0.2);
}


.sortable {
    cursor: pointer;
    user-select: none;
}

.sortable i {
    margin-left: 0.5rem;
    color: #6b7280;
}

.score-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.875rem;
    font-weight: 500;
}

.score-badge.excellent {
    background: #10b9811a;
    color: #10b981;
}

.score-badge.good {
    background: #3b82f61a;
    color: #3b82f6;
}

.score-badge.average {
    background: #f59e0b1a;
    color: #f59e0b;
}

.score-badge.needs-improvement {
    background: #ef44441a;
    color: #ef4444;
}

@media (max-width: 768px) {
    .analytics-grid {
        grid-template-columns: 1fr;
    }

    .table-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .table-actions {
        flex-direction: column;
    }

    .search-box,
    .search-box input {
        width: 100%;
    }
}
`;

document.head.appendChild(document.createElement('style')).textContent = tstyles;
// Debugging statement
// Export the component
