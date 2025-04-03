// components/UserNavbar.js


const usernavbar = {
    name: 'usernavbar',
   
    template: `
    <div class="app-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-top">
                <div class="sidebar-icon mb-8">
                    <div class="user-avatar">
                        <div class="user-avatar-inner">  <img src="/assets/sqlogo.svg" alt="logo" 
                        width="30" height="28"
                        style=" margin: 0.2rem auto ;">
                        </div>
                    </div>
                </div>
                <br>
                <router-link to="/" class="sidebar-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>

                
                </router-link>
                <router-link to="/summary" class="sidebar-icon">
                <i class="bi bi-bar-chart-line" style="font-size: 1.35rem;"></i>             
                </router-link> 

                </router-link>
                <router-link to="/profile" class="sidebar-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
             

            </div>
            
            <div class="sidebar-bottom">
                <div class="sidebar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <div class="sidebar-icon logout-icon"  @click="handleLogout">
                   <svg  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
              <div v-if="show_notification" class="notification-bar">
                  <div class="notification">
                      Nice work! You completed 2/5 quizzes this week
                  </div>
              </div>

            <div class="user-content">
            <router-view></router-view>
            </div>
        </div>
    </div>

    
    `,

    data() {
        return {
            userName: this.$store.state.user || 'User',
            show_notification: false,
        };
    },

    methods: {
       
        async handleLogout() {
            try {
                await this.$store.dispatch('logoutUser');
                this.$router.push('/');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },

        
    },

};

// Add styles to document head
const usernav_style = `/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

body {
  background-color: #fafafa;
  color: #333;
}

.app-container {
  display: flex;
  min-height: 100vh;
}

/* Sidebar Styles */
.sidebar {
  width: 80px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #f7f7f7;
  border-right: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  z-index: 10;
}

.sidebar-top, .sidebar-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-icon {
  text-decoration: none;
  color: rgba(51, 88, 29, 0.87);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-icon:hover {
  background-color:rgba(123, 245, 93, 0.54);
}
.logout-icon:hover {
  background-color:rgba(245, 157, 157, 0.93); /* #e5e5e5; */
}


.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #888;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar-inner {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e0e0;
}

.creator-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e0e0e0;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.creator-avatar-inner {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ccc;
}

.mb-8 {
  margin-bottom: 2rem;
}

/* Main Content */
.main-content {
  margin-left: 80px;
  padding: 2rem;
  width: calc(100% - 80px);
}

.notification-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.notification {
  background-color: #f0f0f0;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
}
.notification-bar svg {
  margin-right: 0.5rem;
}`


const unav = document.createElement("style");
unav.type = "text/css";
unav.innerText = usernav_style;
document.head.appendChild(unav);