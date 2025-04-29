// ProfileDashboard.js


const profile = {
  name: 'profile',

  data() {
    return {      
      attempts: null,
      quizzes: null,
      name: this.$store.state.user || 'Guest',      
      location: 'Earth',
      rank: null,
      subjects: null,
      chapters: null,
      avg: 2,
      best: null,
      email: null,
      avatar: null,
      total_subjects: null,
      total_chapters: null,
      total_quizzes: null,
      leaderboard: []
    };
  },
  methods: {
    fetchLeaderboard() {
      fetch('https://whiz-it.onrender.com/api/leaderboard')
        .then(response => response.json())
        .then(data => {
          this.leaderboard = data;
          console.log(this.leaderboard);
        })
        .catch(error => {
          console.error('Error fetching leaderboard:', error);
        });
    },

    fetchlocation() {
      fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
          this.location = data.country;
        })
        .catch(error => {
          console.error('Error fetching location:', error);
        });
    },

    fetchProfile() {
      const usern = this.$store.state.user;         
      fetch(`https://whiz-it.onrender.com/api/user/${usern}`)
        .then(response => response.json())
        .then(data => {
          this.name = data.name || 'Guest';
          this.quizzes = data.quiz_count;
          this.rank = data.user_rank;
          this.subjects = data.subjects_covered;
          this.chapters = data.chapters_covered;
          this.avg = data.average_score;
          this.best = data.best_score;
          this.attempts = data.all_attempts;
          this.email = data.email;          
          this.total_subjects = data.total_subjects;
          this.total_chapters = data.total_chapters;
          this.total_quizzes = data.total_quizzes;        
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });
    }
  },
  mounted() {
    this.fetchProfile();
    this.fetchLeaderboard();
    this.fetchlocation();
  },
  template: `
   
    <div class="container py-5"> <!-- Centered container, vertical padding -->

    <!-- Profile Section -->
    <div class="profile-container">
        <div class="row g-4">
            <div class="col-md-6">
                <div class="profile-card">
                    <div class="d-flex align-items-center">
                        <i class="fas fa-user-circle  fa-5x me-2"></i>
                        <div class="profile-info">
                            <h3>{{ name || 'Guest' }}</h3>
                            <p>{{ email || 'No email provided' }}</p>
                            <div class="badges">
                                <span class="badge b1">Rank - {{ rank || 'N/A' }}</span>
                                <span class="badge b2">Avg - {{ avg || 0 }}</span>
                                <span class="badge b3">Best - {{ best || 0 }}</span>
                            </div>
                        </div>
                    </div>

                    <!--  Added additional info section (optional)  -->
                    <div class="d-flex align-items-center mt-3 ">
                        <p class="mb-0 me-3">
                            <i class="fas fa-envelope me-2"></i>{{ email || 'No email provided' }}
                        </p>
                        <p class="mb-0">
                            <i class="fas fa-map-marker-alt me-2"></i>{{ location || 'Unknown' }}
                        </p>
                    </div>

                </div>
            </div>
            <div class="col-md-6">
                <div class="profile-card">
                    <h4>Performance</h4>
                    <div class="progress-wrapper">
                         <div class="progress-label">Subjects</div>
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped " role="progressbar" :style="{ width: (subjects / total_subjects) * 100 + '%' }" 
                            aria-valuenow="{{ subjects || 0 }}" aria-valuemin="0" aria-valuemax="{{ total_subjects || 100 }}"></div>
                            

                            </div>
                    </div>
                     <div class="progress-wrapper">
                        <div class="progress-label">Chapters</div>
                        <div class="progress">
                           <div class="progress-bar progress-bar-striped " role="progressbar" :style="{ width: (chapters / total_chapters) * 100 + '%' }"
                            aria-valuenow="{{ chapters || 0 }}" aria-valuemin="0" aria-valuemax="{{ total_chapters || 100 }}"></div>
                        </div>
                    </div>
                    <!--  Added third progress bar -->
                   <div class="progress-wrapper">
                       <div class="progress-label">Attempts</div>
                        <div class="progress">
                            <div class="progress-bar progress-bar-striped " role="progressbar" :style="{ width: (quizzes / total_quizzes) * 100 + '%' }"
                             aria-valuemin="0" aria-valuemax="{{ total_quizzes || 100 }}"></div>
                       </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Leaderboard Section -->
    <div v-if="leaderboard.length >= 1" class="leaderboard-card">
        <h2 class="leaderboard-title">Leaderboard</h2>
        <div class="leaderboard-item" v-for="(item, index) in leaderboard" :key="index">
            <div class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
            <div>
                <div class="leaderboard-name">{{ item.name || 'Anonymous' }}</div>
                <div class="leaderboard-points">{{ item.score || 0 }} Points</div>
            </div>
            <span class="badge leaderboard-badge"
            :style="{
                backgroundColor: index === 0 ? 'rgba(233, 134, 41, 0.94)' : 
                                index === 1 ? 'rgba(108, 51, 240, 0.88)' : 
                                'rgba(204, 117, 77, 0.88)',
                fontSize: '0.9rem',
                border: '3px solid rgba(0,0,0,0.1)'
            }"
            >{{ index === 0 ? 'The Valedictorian' : 
                index === 1 ? 'High Achiever' : 
                'Rising Star' }}</span>
        </div>
    </div>
</div>
  `
};
// ...existing code...

const profileStylesheet = `
  :root {
          
          --card-border: 1px solid rgba(0, 0, 0, 0.1); /* Subtle border */
            --glow-effect: 0 4px 12px rgba(0,0,0,0.1); /* Subtle glow */
        }

        body {
            font-family: 'Rubik', sans-serif;
            background-color: #f8f9fa; /* Very light gray */
        }

        .profile-container {
            background-color: rgba(253,130,130,0.8);
            border-radius: 24px;
            padding: 1.5rem; 
            color: #333; 
            box-shadow: var(--glow-effect);
            margin-bottom: 2rem; 
            border: 6px solid rgba(0,0,0,0.1); 
        }

        .profile-card {
            background: rgba(255, 255, 255, 0.8); /* Semi-transparent white */
            border-radius: 16px;
            padding: 1.5rem;
            backdrop-filter: blur(5px); /* Subtle blur */
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border: var(--card-border);
            height: 100%; /* Equal height columns */
            display: flex;
            flex-direction: column; /* Stack content vertically */
            justify-content: center; /* Space out elements */
        }

        .profile-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow */
        }

        .avatar {

            border-radius: 50%;
            border: 3px solid rgba(102, 177, 68, 0.5); 
            object-fit: cover;
            margin-bottom: 1rem; 
        }

        .profile-info {
            margin-left: 2rem; 
        }
       .profile-info h3 {
            font-size: 1.5rem; /* Larger name */
            font-weight: 500; /* Semibold */
            margin-bottom: 0.5rem;
            color: #222; /* Darker color */
        }

        .profile-info p {
            color: #555; /* Slightly lighter text */
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }


        .badges .badge {
            margin-right: 0.5rem;
             margin-bottom: 0.5rem; /* Spacing between badges */
            font-size: 0.75rem; /* Smaller badge text */
            font-weight: 400; /* Lighter weight */
            padding: 0.3rem 0.6rem; /* Smaller padding */
             opacity: 0.9;  /* Slightly transparent */
            border: none; /* Remove default border */
        }
        .b1 {
            background-color: rgba(175, 160, 21, 0.94); /* Gold */
        }
        .b2 {
            background-color: rgba(108, 51, 240, 0.88); /* Silver */
        }
        .b3 {
            background-color: rgba(204, 117, 77, 0.88); /* Bronze */
        }


        .progress-wrapper {
            margin-bottom: 1rem; /* Space between progress bars */
        }
         .progress-label{
            font-size:0.85rem;
            font-weight:500;
            color: rgba(0,0,0,0.5);
            margin-bottom:0.25rem;
         }

        .progress {
           height: 10px; /* Thinner progress bar */
            border-radius: 10px; /* Rounded */
            background-color: rgba(255, 255, 255, 0.5); /* Light gray background */
        }

        .progress-bar {
            height: 100% !important; /* Full height of the parent */
            border-radius: 10px !important; /* Match parent */
             transition: width 0.6s ease; /* Smooth transition */
             background-color: rgba(50, 131, 47, 0.88) !important; /* Green color */
            background-size: 1rem 1rem !important ; /* Size of stripes */
        }
          .progress-bar-striped{
            background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
          }


        /* Leaderboard */

       .leaderboard-card {
          background: white;
          border-radius: 24px; /* Consistent rounding */
          box-shadow: var(--glow-effect);
          padding: 2rem;
          border: var(--card-border);
        }

        .leaderboard-title {
            font-size: 1.75rem; /* Larger title */
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #333;
        }

        .leaderboard-item {
            display: flex;
            align-items: center;
            padding: 0.8rem 0;
            border-bottom: 1px solid #eee;
        }
         .leaderboard-item:last-child{
             border-bottom:none;
         }

        .rank-badge {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem; /* More space */
            font-weight: bold;
            color: white;
            font-size: 1rem;
        }

          /*  Rank colors */
          .rank-1 { background-color: #FFD700; }  /* Gold */
        .rank-2 { background-color: #C0C0C0; }  /* Silver */
        .rank-3 { background-color: #CD7F32; }  /* Bronze */

         .leaderboard-avatar {
             width:40px;
             height:40px;
             border-radius:50%;
             object-fit:cover;
             margin-right:0.75rem;
             border:2px solid var(--pastel-pink)
         }

       .leaderboard-name {
           font-size: 1rem;
           font-weight: 500;
           color: #444;
           margin-bottom: 0.2rem; /* Small space */
        }

        .leaderboard-points {
           color: #666;
           font-size: 0.85rem;
        }

        .leaderboard-badge {
           margin-left: auto; /* Push to the right */
            font-size: 0.7rem; /* Smaller badge */
           padding: 0.25rem 0.5rem; /* Smaller padding */
        }
        /*Responsive Design*/

         @media (min-width: 768px) {
          .profile-container {
            padding: 3rem; /* Larger padding on medium screens */
          }
           .profile-card {
            padding: 2rem; /* Larger padding inside */
          }
          .avatar{
            width:120px;
            height:120px;
          }

           .leaderboard-card{
              padding:2.5rem
           }
        }

        @media (min-width: 992px) {
          .profile-container {
               padding: 4rem; /* Even larger padding */
          }
         }
        @media (max-width: 576px) {
         
        .d-flex {
            flex-direction: column; /* Stack elements on small screens */
            align-items: flex-start; /* Align to the left */
            gap: 0.3rem;
        }
        .profile-card {
            padding: 1rem; /* Smaller padding on small screens */
        }
        .leaderboard-card {
            padding: 1.5rem; /* Smaller padding on small screens */
        }
        .leaderboard-item {
            padding: 0.5rem 0; /* Smaller padding */
            flex-direction: column; /* Stack items vertically */
            align-items: flex-start; /* Align to the left */

        }
        .badge .leaderboard-badge {
            margin : 0.1rem;
            margin-left : 0rem !important; /* Remove left margin */
        } 
        .leaderboard-badge {
        margin-left: 0; /* Remove left margin */
        margin-top: 0.5rem; /* Add top margin */
        }
        .leaderboard-title {
            font-size: 1.5rem; /* Smaller title */
        }
      }

`;

const styleSheetProfile = document.createElement("style");
// styleSheetProfile.type = "text/css"; // Removed deprecated type attribute
styleSheetProfile.innerText = profileStylesheet;
document.head.appendChild(styleSheetProfile);
