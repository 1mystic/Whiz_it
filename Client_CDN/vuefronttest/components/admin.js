const dashboardStyles = `

    .modal-body{
        padding: 2rem !important;
    }
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: system-ui, -apple-system, sans-serif;
    }

    .dashboard-wrapper {
        background: #f4d0c4;
        min-height: 100vh;
        display: flex;
    }

    .admin_sidebar {      
        position: fixed;  
        background:rgb(255, 244, 223);
        width: 12rem;
        padding: 2rem;
        border-right: 1px solid #eee;
        height: 100%;
    }
    @media (min-width: 772px) {
    position: fixed;
        top: 0;
        height: 100%;
}

    .logo {
        position: absolute;
        left: 1rem;
        display: flex;
        gap: 0.2rem;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 2rem;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .profile {
        text-align: center;
        margin-bottom: 2rem;
    }

    .profile img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 1rem;
    }

    .profile-name {
        font-weight: 600;
        font-size: 1.2rem;
        margin-bottom: 0.25rem;
    }

    .profile-title {
        color: #666;
        font-size: 0.9rem;
    }

    .modern-tabs {
        margin-top: 6.2rem;
        list-style: none;
    }

    .tab-btn {
        text-decoration: none;
        color: #666;
        display: block;
        padding: 0.75rem 1rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        transition: all 0.3s;
    }

    .tab-btn.active {
        background: rgb(255, 255, 255);
        border-left: 4px solid rgba(248, 147, 140, 0.84);
        color: rgba(241, 77, 65, 0.84);
    }

    .tab-btn:hover {
        background: rgba(243, 169, 147, 0.5);
    }

    .main-content {
        margin-left: 12rem;
        flex: 1;
        padding: 2rem;
        background: white;
        
    }
        @media (min-width: 772px) {
        /*margin-left: 12rem;*/
}

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .btn-logout {
        background:rgba(247, 126, 122, 0.94);
        color: white;
        border: none;
        padding: 0.5rem 1.5rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: 600;
    }

    .btn-logout:hover {
        background: #ff5252;
    }

    .stats-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background:rgb(255, 239, 215);
        padding: 1.5rem;
        border-radius: 12px;
        transition: transform 0.3s;
    }

    .stat-card:hover {
        transform: translateY(-5px);
    }

    .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
        .stat-icon i {
            color: rgba(241, 77, 65, 0.84);
        }

    
    .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    .stat-label {
        color: #666;
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


    .content-card {
        background: #fff5f2;
        border-radius: 12px;
        padding: 1.5rem;
    }



    @media (max-width: 768px) {
        .dashboard-wrapper {
            flex-direction: column;
        }

        .admin_sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #eee;
            padding: 1rem;
            height: 10rem;
            display: flex;
            flex-direction: column;
        }
        .modern-tabs {
            display: flex;
            gap: 0.2rem;
        }
        .tab-btn {
            padding: 0.2rem 0.5rem;
            font-size: 0.8rem;
        }

        .stats-section {
            grid-template-columns: 1fr;
        }

        .main-content {
            padding: 1rem;
            width: 100%;
            height: 100%;
            margin: 0;
        }
    }
    @media (max-width: 710px) {
        .logo {
            flex-direction: row;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .logo img {
            position: static;
            margin-bottom: 0.5rem;
        }

        .logo h5 {
            position: static;
            margin : 0.8rem 0 0 1.1rem;
            font-size: 1.5rem;
        }
    }
`;

const admin = {
    name: 'admin',
    template: `
        <div class="dashboard-wrapper">
            <div class="admin_sidebar">
                <div class="logo">
                   
                    <img src="/assets/sqlogo.svg" alt="logo" 
                        width="50" height="50"
                        style="">
                    <h5 style="
                    margin-top: 1rem;
                    font-size: 1.7rem;
                    font-family: 'Rubik', sans-serif;
                    "
                    > Whiz.up </h5>
                    
                </div>
               
                <div class="modern-tabs">
                    <router-link 
                        v-for="tab in tabs" 
                        :key="tab.path"
                        :to="'/admin/' + tab.path"
                        class="tab-btn"
                        :class="{ active: isActive(tab.path) }"
                    >
                        {{ tab.name }}
                    </router-link>
                </div>
            </div>

            <div class="main-content">
                <div class="header">
                        <p></p>
                    <button class="btn-logout" @click="handleLogout">Logout</button>
                </div>

                <div class="stats-section">
                    <div v-for="stat in stats" :key="stat.title" class="stat-card">
                        <div class="stat-icon">
                            <i :class="stat.icon"></i>
                        </div>
                        <div class="stat-content">
                            <h3 class="stat-value">{{ stat.value }}</h3>
                            
                            <p class="stat-label">{{ stat.title }}</p>
                        </div>
                    </div>
                </div>

                <div class="content-card">
                    <router-view></router-view>
                </div>
            </div>
            
        </div>
    `,
    data() {
        return {
            currentView: 'dashboard',
            tabs: [
                { name: 'Dashboard', path: 'dash' },
                { name: 'Subjects', path: 'subjects' },
                { name: 'Chapters', path: 'chapters' },
                { name: 'Quizzes', path: 'quizes' },
                { name: 'Questions', path: 'questions' },
                {name: 'Users', path: 'tusers'}
            ],
            stats: [
                { title: 'Subjects', value: '', icon: 'fas fa-book', color: 'orange' },
                { title: 'Chapters', value: '', icon: 'fas fa-bookmark', color: 'orange' },
                { title: 'Quizzes', value: '', icon: 'fas fa-question-circle', color: 'orange' },
                { title: 'Questions', value: '', icon: 'fas fa-tasks', color: 'orange' },
                { title: 'Users', value: '', icon: 'fas fa-users', color: 'orange' }
            ],
        };
    },
    methods: {
        isActive(path) {
            return this.$route.path === '/admin/' + path
        },
        handleLogout() {
            this.$store.dispatch('logoutUser').then(() => {
                this.$router.push('/login');
            });
        },
        admin_stats() {
            fetch('http://127.0.0.1:5000/api/admin_dash', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.stats[0].value = data.subjects;
                    this.stats[1].value = data.chapters;
                    this.stats[2].value = data.quiz_count;
                    this.stats[3].value = data.question_count;
                    this.stats[4].value = data.user_count;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    },
    mounted() {
        this.admin_stats();
      
        const styleElement = document.createElement('style');
        styleElement.textContent = dashboardStyles;
        document.head.appendChild(styleElement);
    }
};