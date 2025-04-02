// components/UserNavbar.js


const usernavbar = {
    name: 'usernavbar',
    components: {
        modal
    },

    template: `
    <div class="app-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="sidebar-top">
                <div class="sidebar-icon mb-8">
                    <div class="user-avatar">
                        <div class="user-avatar-inner"></div>
                    </div>
                </div>
                <br>
                <router-link to="/" class="sidebar-icon">
                <div class="sidebar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                </router-link>
                <router-link to="/profile" class="sidebar-icon">
                <div class="sidebar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                </router-link>
                <router-link to="/home" class="sidebar-icon">
                <div class="sidebar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg></div>
                </router-link>
                <router-link to="/summary" class="sidebar-icon">
                <div class="sidebar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
                </router-link> 

            </div>
            
            <div class="sidebar-bottom">
                <div class="sidebar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <div class="sidebar-icon"  @click="handleLogout">
                   <svg  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <div class="notification-bar">
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
            isMobileMenuOpen: false,
            isProfileMenuOpen: false,
            userName: this.$store.state.user || 'User',
            isModalOpen: false
        };
    },

    computed: {
        userInitials() {
            return this.userName
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase();
        },

        userInitialsAvatar() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 40;
            canvas.height = 40;

            const hue = Math.abs(this.userName.split('').reduce((acc, char) => {
                return acc + char.charCodeAt(0);
            }, 0) % 360);

            context.fillStyle = `hsl(${hue}, 70%, 60%)`;
            context.beginPath();
            context.arc(20, 20, 20, 0, Math.PI * 2);
            context.fill();

            context.fillStyle = 'white';
            context.font = 'bold 16px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(this.userInitials, 20, 20);

            return canvas.toDataURL();
        }
    },

    methods: {
        toggle_smenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        },
        openUserModal() {
            this.isModalOpen = true;
        },

        closeUserModal() {
            this.isModalOpen = false;
        },

        handleModalOpen() {
            console.log('Modal opened');
        },

        handleModalClose() {
            console.log('Modal closed');
        },

        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            if (this.isMobileMenuOpen) {
                this.isProfileMenuOpen = false;
            }
        },

        toggleProfileMenu() {
            this.isProfileMenuOpen = !this.isProfileMenuOpen;
        },

        async handleLogout() {
            try {
                await this.$store.dispatch('logoutUser');
                this.$router.push('/');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        },

        
    },

    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },

    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
    }
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