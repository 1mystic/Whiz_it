const Explore = {
  name: 'Explore',
  components: {
   
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
                
                <router-link to="/user" class="sidebar-icon">
                <div class="sidebar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                </router-link>
                <router-link to="/profile" class="sidebar-icon">
                <div class="sidebar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                </router-link>
                <router-link to="/settings" class="sidebar-icon">
                <div class="sidebar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg></div>
                </router-link>
                <router-link to="/logout" class="sidebar-icon">
                <div class="sidebar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M5.2 9a22 22 0 0 1 13.6 0"/><path d="M5.2 15a22 22 0 0 0 13.6 0"/><path d="M12 2v20"/></svg></div>
                </router-link>
                <router-link to="/help" class="sidebar-icon">
                <div class="sidebar-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
                </router-link> 

            </div>
            
            <div class="sidebar-bottom">
                <div class="sidebar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <div class="sidebar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
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
            <!-- Search button -->
            <div class="search-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span>Use Autodesigner 2.0</span>
            </div>
            
             <!-- Featured Quizzes -->
              <h2 class="section-title">Featured Quizzes</h2>
              <div
                class="slider-container"
                id="quizSlider"
                @mouseenter="pauseAnimation"
                @mouseleave="resumeAnimation"
                ref="sliderContainer"
              >
                <div class="slider-navigation">
                  <button @click="navigatePrev" class="slider-nav slider-prev" id="sliderPrev">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                  </button>
                  <button @click="navigateNext" class="slider-nav slider-next" id="sliderNext">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
                <div class="slider-track" ref="sliderTrack">
                  <!-- Quiz Card 1 -->
                  <div v-for="quiz in displayedQuizzes" :key="quiz.id">
                    <div class="quiz-card">
                      <div class="quiz-card-image">
                        <div class="bookmark-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <div>{{ getSubjectName(getChapter(quiz.chapter_id)?.subject_id) }}</div>
                      </div>       
                                     
                      <h3 class="quiz-title">{{ quiz.title }}</h3>
                      <p class="quiz-subtitle">{{ getChapterName(quiz.chapter_id) }}</p>
                      <div class="quiz-info">
                        <div class="quiz-meta">
                          <div class="quiz-meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span>{{ formatDuration(quiz.time_duration) }}</span>
                          </div>
                          <div class="quiz-meta-item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            <span>{{ quiz.question_count }}</span>
                          </div>
                        </div>
                        <button class="quiz-action">Start</button>
                      </div>
                    </div>
                  </div> <!-- v-for -->
                </div>
              </div>




                 

            
            <!-- Quiz Categories -->
            <h2 class="section-title">Quiz Categories</h2>
            <div class="categories-grid">
                <div v-for="subject in subjects" :key="subject.id" class="category-card">
                 
                      <div class="category-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5M9 14c-.2-1-.7-1.7-1.5-2.5M15 14a5 5 0 0 1-6 0"/><path d="M22 6c0 10-7 16.5-10 16.5S2 16 2 6m20 0c0-1.7-1.3-3-4-3-2 0-4 1-5 2-1-1-3-2-5-2-2.7 0-4 1.3-4 3h18Z"/></svg>
                      </div>
                      <span>{{subject.name}}</span>
                </div>
                <div v-for="chapter in chapters" :key="chapter.id" class="category-card">
                 
                      <div class="category-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5M9 14c-.2-1-.7-1.7-1.5-2.5M15 14a5 5 0 0 1-6 0"/><path d="M22 6c0 10-7 16.5-10 16.5S2 16 2 6m20 0c0-1.7-1.3-3-4-3-2 0-4 1-5 2-1-1-3-2-5-2-2.7 0-4 1.3-4 3h18Z"/></svg>
                      </div>
                      <span>{{chapter.name}}</span>
                </div>
                
            </div>
            
            <!-- My Quiz Journey -->
            <h2 class="section-title">My Quiz Journey</h2>
            <div class="journey-container">

                <div v-for="score in userScores" :key="score.id"  class="journey-card">
                    <div class="journey-image">
                        <div>{{ score.id }}</div>
                    </div>
                    <div class="journey-content">
                        <h3 class="journey-title">{{ score.quiz_title }}</h3>
                        <p class="journey-subtitle">{{ formatDate(score.timestamp) }}</p>
                        <div class="progress-bar">
                            <div class="progress-value" style="{ width: score.score + '%' }"></div>
                        </div>
                        <p class="progress-label">Progress: {{ score.score }}%</p>
                    </div>
                </div>
                
                
            </div>
            
            
        </div>
    </div>`,

   data() {
    return {
      position: 0,
      isPaused: false,
      isManuallyNavigating: false,
      animationFrameId: null,
      cardWidthIncludingGap: 0,
      initialCardsDuplicated: false,
      autoScrollSpeed: 0.5, // Pixels per frame (~30px/sec @ 60fps)
      transitionDuration: 300, // ms
      
      // API Data
      userScores: [],
      subjects: [],
      chapters: [],
      selectedSubject: '',
      selectedChapter: '',
      searchQuery: '',
      hideExpired: false,
      loading: false,
      userName: 'Student',
      userEmail: '',         
      availableQuizzes: []


    };
  },
  computed: {
    filteredChapters() {
        if (!this.selectedSubject) return this.chapters;
        return this.chapters.filter(chapter => 
            chapter.subject_id === this.selectedSubject
        );
    },
    displayedQuizzes() {
        let filtered = this.availableQuizzes;
        
        // subj filter
        if (this.selectedSubject) {
            filtered = filtered.filter(quiz => {
                const chapter = this.getChapter(quiz.chapter_id);
                return chapter && chapter.subject_id === this.selectedSubject;
            });
        }
        
        // ch fitler
        if (this.selectedChapter) {
            filtered = filtered.filter(quiz => 
                quiz.chapter_id === this.selectedChapter
            );
        }
        
        // search query filter
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(quiz => 
                quiz.title.toLowerCase().includes(query) ||
                this.getChapterName(quiz.chapter_id).toLowerCase().includes(query) ||
                this.getSubjectName(this.getChapter(quiz.chapter_id)?.subject_id).toLowerCase().includes(query)
            );
        }

        // expired filter
        if (this.hideExpired) {
            filtered = filtered.filter(quiz => !this.isPastQuiz(quiz.date_of_quiz));
        }
        
        return filtered;
    }
},
async created() {
  // Fetch user info from store
  //this.userName = this.$store.state.user || 'Student';
  //this.userEmail = this.$store.state.user?.email || '';
  
  // Fetch initial data
  await Promise.all([
      this.fetchSubjects(),
      this.fetchChapters(),
      this.fetchQuizzes()
  ]);
},

  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
      });
  },

  formatDuration(duration) {
      const minutes = duration.split(':')[1];
      return `${minutes} mins`;
  },

    getSubjectName(subjectId) {
      return this.subjects.find(subject => subject.id === subjectId)?.name || '';
      },
      getChapterName(chapterId) {
          return this.chapters.find(chapter => chapter.id === chapterId)?.name || '';
      },
      async fetchUserScores() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/users/scores', {
                headers: {
                    'Authorization': `Bearer ${this.$store.state.token}`
                }
            });
            if (response.ok) {
                this.userScores = await response.json();
                console.log("USer Scores:", this.userScores);
                //this.calculateStats();
            }
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    },
      async fetchSubjects() {
          try {
              const response = await fetch('http://127.0.0.1:5000/api/subjects', {
                  headers: {
                      'Authorization': `Bearer ${this.$store.state.token}`
                  }
              });
              if (response.ok) {
                  this.subjects = await response.json();
              }
          } catch (error) {
              console.error('Error fetching subjects:', error);
          }
      },
      async fetchChapters() {
          try {
              const response = await fetch('http://127.0.0.1:5000/api/chapters', {
                  headers: {
                      'Authorization': `Bearer ${this.$store.state.token}`
                  }
              });
              if (response.ok) {
                  this.chapters = await response.json();
              }
          } catch (error) {
              console.error('Error fetching chapters:', error);
          }
      },
      async fetchQuizzes() {
          try {
              const response = await fetch('http://127.0.0.1:5000/api/quizzes', {
                  headers: {
                      'Authorization': `Bearer ${this.$store.state.token}`
                  }
              });
              if (response.ok) {
                  const quizzes = await response.json();
                  this.availableQuizzes = quizzes.filter(quiz => {
                      // Parse the release_at string into a Date object
                      const releaseDate = new Date(quiz.release_at);

                      // Compare release_date with the current date/time
                      return releaseDate <= new Date(); // new Date() returns the current date/time
                  });

                  console.log(this.availableQuizzes); // Quizzes that have been released
                  console.log(new Date()); // Current date/time
              }
          } catch (error) {
              console.error('Error fetching quizzes:', error);
          }
      },
      formatDuration(duration) {
          const minutes = duration.split(':')[1];
          return `${minutes} mins`;
      },
      isPastQuiz(quizDate) {
          return new Date(quizDate) < new Date();
      },
      getChapter(chapterId) {
          return this.chapters.find(chapter => chapter.id === chapterId);
      },
      startQuiz(quizId) {
          window.open(this.$router.resolve({ path: `/quiz/${quizId}` }).href, '_blank');
      },
      filterQuizzes() {
          this.fetchQuizzes();
      },
    // --- Initialization & Setup ---
    setupSlider() {
        // Ensure refs are available before proceeding
        if (!this.$refs.sliderContainer || !this.$refs.sliderTrack) {
             console.error("Slider refs not found during setup.");
             // Optionally retry after a short delay
             // setTimeout(this.setupSlider, 100);
             return;
        }

        this.$nextTick(() => {
            this.calculateCardWidth();
            // Check calculation success before duplicating/animating
            if (this.cardWidthIncludingGap > 0 && !this.initialCardsDuplicated) {
                this.duplicateInitialCards(); // Duplicates cards for infinite effect
                this.startAnimation();       // Starts the auto-scroll
                this.initialCardsDuplicated = true;
            } else if (this.cardWidthIncludingGap <= 0) {
                 console.error("Card width calculation failed, cannot initialize slider.");
            }
            window.addEventListener('resize', this.handleResize);
        });
    },

    calculateCardWidth() {
      const sliderTrack = this.$refs.sliderTrack;
       // Extra check for refs just in case
       if (!sliderTrack || !sliderTrack.children || !sliderTrack.children.length) {
           console.warn("Slider track or cards not available for width calculation.");
           this.cardWidthIncludingGap = 0;
           return;
       }
      const firstCard = sliderTrack.querySelector('.quiz-card');
      if (!firstCard) {
            console.warn("First card not found for width calculation.");
            this.cardWidthIncludingGap = 0;
            return;
        }

      const cardStyle = window.getComputedStyle(firstCard);
      const cardWidth = firstCard.offsetWidth;

      let cardGap = 0;
        // Check if there's more than one card to calculate gap
        if(sliderTrack.children.length > 1) {
            // Make sure the second child is indeed a quiz-card and not something else
            const secondCard = sliderTrack.children[1];
            if (secondCard && secondCard.classList.contains('quiz-card')) {
                 // Calculate gap using offsetLeft, robust way
                cardGap = secondCard.offsetLeft - (firstCard.offsetLeft + firstCard.offsetWidth);
            } else {
                 // If second element is not a card, fallback (might happen during cloning/manipulation)
                cardGap = parseFloat(cardStyle.marginRight) || 16; // Use marginRight as fallback
                 console.warn("Second element not a card, using margin fallback for gap:", cardGap);
            }

        } else {
            // If only one card (or cloned cards aren't added yet), use margin fallback
            cardGap = parseFloat(cardStyle.marginRight) || 16;
             console.warn("Only one card found, using margin fallback for gap:", cardGap);
        }

      // Ensure gap is not negative (can happen with weird CSS or calculation glitches)
      this.cardWidthIncludingGap = cardWidth + Math.max(0, cardGap);
      console.log(`Calculated card width: ${cardWidth}, gap: ${cardGap}, total: ${this.cardWidthIncludingGap}`);
    },

    duplicateInitialCards() {
      const sliderTrack = this.$refs.sliderTrack;
      const sliderContainer = this.$refs.sliderContainer;

      if (!sliderTrack || !sliderContainer || this.cardWidthIncludingGap <= 0) {
           console.error("Cannot duplicate cards: Missing refs or invalid card width.");
           return;
      }

      const sliderContainerWidth = sliderContainer.offsetWidth;
       // Calculate how many cards fit (+ a buffer)
      const cardsInView = Math.ceil(sliderContainerWidth / this.cardWidthIncludingGap);
      const cardsToDuplicateCount = cardsInView + 2; // Buffer for smooth wrapping

      const originalCards = Array.from(sliderTrack.querySelectorAll('.quiz-card'));
      const numOriginalCards = originalCards.length;

        if (numOriginalCards === 0) {
            console.warn("No original cards found to duplicate.");
            return;
        }

      console.log(`Container: ${sliderContainerWidth}px, Card+Gap: ${this.cardWidthIncludingGap}px, InView: ${cardsInView}, Duplicating: ${cardsToDuplicateCount}`);

       // Check if duplication is actually needed (maybe there are already enough cards)
       // And only duplicate if we haven't done it before
       // Compare with numOriginalCards to avoid duplicating the already duplicated ones
       if (sliderTrack.children.length === numOriginalCards) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < Math.min(cardsToDuplicateCount, numOriginalCards) ; i++) {
                const clone = originalCards[i % numOriginalCards].cloneNode(true); // Use modulo for safety
                fragment.appendChild(clone);
            }
            sliderTrack.appendChild(fragment);
            console.log("Duplicated cards. Total cards now:", sliderTrack.children.length);
       } else {
           console.log("Skipping duplication, cards seem already present.");
       }
    },

    // --- Animation ---
    startAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
         // Make sure we have a width before starting
         if(this.cardWidthIncludingGap <= 0) {
             console.warn("Cannot start animation without valid card width.");
             return;
         }
         console.log("Starting animation...");
         this.isPaused = false; // Ensure it's not paused initially
        this.animate();
    },

    animate() {
        const sliderTrack = this.$refs.sliderTrack;
        // Combine checks for clarity
        if (!sliderTrack || this.isPaused || this.isManuallyNavigating || this.cardWidthIncludingGap <= 0) {
             this.animationFrameId = requestAnimationFrame(this.animate); // Keep checking
            return;
        }

        this.position -= this.autoScrollSpeed;

        // Wrap around check
        if (Math.abs(this.position) >= this.cardWidthIncludingGap) {
            const firstCard = sliderTrack.querySelector('.quiz-card'); // Re-query inside loop if needed
            if (firstCard) {
                sliderTrack.appendChild(firstCard); // Move DOM element
                this.position += this.cardWidthIncludingGap; // Adjust logical position INSTANTLY
                 // Apply the adjusted position immediately without transition
                 // This prevents visual jump because the item moved visually matches the position reset
                 sliderTrack.style.transition = 'none';
                 sliderTrack.style.transform = `translateX(${this.position}px)`;
            } else {
                 console.warn("Could not find first card to move during wrap around.")
                 cancelAnimationFrame(this.animationFrameId); // Stop if something's wrong
                 return;
            }
        } else {
            // Apply the incremental position update smoothly
             sliderTrack.style.transition = 'none'; // Ensure no CSS transition interferes
            sliderTrack.style.transform = `translateX(${this.position}px)`;
        }


        this.animationFrameId = requestAnimationFrame(this.animate); // Continue loop
    },

    pauseAnimation() {
        if (!this.isManuallyNavigating) { // Don't allow hover pause *during* manual nav transition
             console.log("Animation paused (hover)");
            this.isPaused = true;
        }
    },

    resumeAnimation() {
        if (!this.isManuallyNavigating) { // Don't resume if manual nav is finishing
             console.log("Animation resumed (hover end)");
            this.isPaused = false;
            // Animation loop (`animate`) will pick up the change on its next frame check
        }
    },

    // --- Navigation ---
    navigate(direction) {
        const sliderTrack = this.$refs.sliderTrack;
        if (this.isManuallyNavigating || !sliderTrack || this.cardWidthIncludingGap <= 0) {
            console.warn("Navigation blocked: Already navigating, no track, or no card width.");
            return;
        }

        console.log(`Navigating ${direction}...`);
        this.isManuallyNavigating = true;
        this.isPaused = true; // Ensure paused during manual nav

        cancelAnimationFrame(this.animationFrameId); // Stop auto-scroll

        sliderTrack.style.transition = `transform ${this.transitionDuration / 1000}s ease`;

        if (direction === 'next') {
            this.position -= this.cardWidthIncludingGap;
            sliderTrack.style.transform = `translateX(${this.position}px)`;

            setTimeout(() => {
                const firstCard = sliderTrack.querySelector('.quiz-card');
                if (firstCard) {
                    sliderTrack.appendChild(firstCard);
                    this.position += this.cardWidthIncludingGap;
                    sliderTrack.style.transition = 'none';
                    sliderTrack.style.transform = `translateX(${this.position}px)`;
                }
                this.isManuallyNavigating = false;
                 // Resume auto only if mouse is not currently over the element
                 if (!this.$refs.sliderContainer.matches(':hover')) {
                    this.resumeAnimation(); // Resume auto-scroll (sets isPaused = false)
                 }
                 this.startAnimation(); // Important: Restart the rAF loop
                 console.log("Navigate next complete.");

            }, this.transitionDuration);

        } else if (direction === 'prev') {
            const lastCard = sliderTrack.querySelector('.quiz-card:last-child');
            if (!lastCard) {
                console.error("Cannot navigate prev: Last card not found.");
                this.isManuallyNavigating = false;
                this.isPaused = this.$refs.sliderContainer.matches(':hover'); // Re-evaluate pause based on hover
                this.startAnimation();
                return;
            }

            // 1. Instant DOM move & position adjustment (no transition)
            sliderTrack.insertBefore(lastCard, sliderTrack.firstChild);
            this.position -= this.cardWidthIncludingGap;
            sliderTrack.style.transition = 'none';
            sliderTrack.style.transform = `translateX(${this.position}px)`;

            // 2. Force browser repaint/reflow (often needed after instant style change before transition)
            // Reading offsetHeight is a common trick, but requestAnimationFrame often works too.
            // sliderTrack.offsetHeight;

            // 3. Use rAF or tiny timeout to apply transition *after* instant move
             requestAnimationFrame(() => {
                  // 4. Apply transition and slide smoothly to the target position
                this.position += this.cardWidthIncludingGap; // Calculate target position
                sliderTrack.style.transition = `transform ${this.transitionDuration / 1000}s ease`;
                sliderTrack.style.transform = `translateX(${this.position}px)`;

                // 5. Cleanup after transition ends
                setTimeout(() => {
                    sliderTrack.style.transition = 'none';
                    this.isManuallyNavigating = false;
                     if (!this.$refs.sliderContainer.matches(':hover')) {
                        this.resumeAnimation(); // Resume auto-scroll if needed
                     }
                     this.startAnimation(); // Restart the rAF loop
                     console.log("Navigate prev complete.");
                }, this.transitionDuration);
            });
        }
    },

    navigatePrev() {
        this.navigate('prev');
    },

    navigateNext() {
        this.navigate('next');
    },

    // --- Utility & Lifecycle ---
    resetSliderPosition(restartAnim = true) {
      const sliderTrack = this.$refs.sliderTrack;
      if (!sliderTrack) return;
       console.log("Resetting slider position.");
      cancelAnimationFrame(this.animationFrameId);
      this.position = 0;
      sliderTrack.style.transition = 'none';
      sliderTrack.style.transform = 'translateX(0px)';
      if (restartAnim) {
          // Needs recalculation/duplication checks potentially
           this.startAnimation();
      }
    },

    handleResize() {
        // Simple resize handling: Recalculate and reset.
        // Debounce recommended for performance in real apps.
        console.log("Window resized, re-initializing slider...");
         cancelAnimationFrame(this.animationFrameId); // Stop current animation
         this.isManuallyNavigating = false; // Reset flags
         this.isPaused = false;
         this.initialCardsDuplicated = false; // Allow duplication again if needed
         this.position = 0; // Reset position

        // Remove potentially old duplicated cards before re-setup (simplest way)
         const sliderTrack = this.$refs.sliderTrack;
         if(sliderTrack) {
            const originalCardCount = 3; // ** IMPORTANT: Hardcoded based on your initial HTML **
                                      // Make this dynamic if the initial cards change
            while(sliderTrack.children.length > originalCardCount) {
                sliderTrack.removeChild(sliderTrack.lastChild);
            }
            sliderTrack.style.transform = 'translateX(0px)'; // Ensure visually reset
         }

         this.setupSlider(); // Re-run the setup process
    },

    cleanup() {
        console.log("Cleaning up slider component");
        cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', this.handleResize);
        // Remove hover listeners if added programmatically (not needed here as they are in template)
    }
  },
  mounted() {
    this.fetchUserScores();
    this.fetchSubjects();
    this.fetchChapters();
    this.fetchQuizzes();
    // Initialize the slider
    this.animate();
    this.setupSlider();
    
    console.log("QuizSlider component mounted");
    // Use setTimeout to ensure parent layout is stable, especially if container width depends on it
    setTimeout(this.setupSlider, 50);
  },

  // Use beforeUnmount (Vue 3) or beforeDestroy (Vue 2)
  beforeUnmount() {
    this.cleanup();
  },
  // beforeDestroy() { // For Vue 2
  //   this.cleanup();
  // }
};

const explore_styles= `
/* Base Styles */
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
  background-color: #e5e5e5;
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

.section-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
}

/* Slider styles */
.slider-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-bottom: 1rem;
}

.slider-track {
  display: flex;
  gap: 1rem;
  transition: transform 0.5s ease-in-out;
}

/* Navigation buttons */
.slider-navigation {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.slider-nav {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.slider-nav:hover {
  background-color: #f5f5f5;
  transform: scale(1.05);
}

.slider-prev {
  margin-left: 2rem;
}

.slider-next {
  margin-right: 2rem;
}

.quiz-card {
  min-width: 280px;
  max-width: 280px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.quiz-card-image {
  width: 100%;
  height: 150px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bookmark-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
}

.quiz-creator {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.quiz-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.quiz-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.quiz-meta {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.875rem;
}

.quiz-meta-item {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.quiz-meta-item svg {
  margin-right: 0.25rem;
}

.quiz-action {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #f0f0f0;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.quiz-action:hover {
  background-color: #e0e0e0;
}

/* Category cards */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.category-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Journey cards */
.journey-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.journey-card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
}

.journey-image {
  width: 120px;
  min-width: 120px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.journey-content {
  padding: 1rem;
  flex: 1;
}

.journey-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.journey-subtitle {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  margin-bottom: 0.5rem;
}

.progress-value {
  height: 100%;
  background-color: #333;
  border-radius: 2px;
}

.progress-label {
  font-size: 0.75rem;
  color: #666;
}

/* Search button */
.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin: 2rem auto;
  cursor: pointer;
}

.search-icon {
  margin-right: 0.5rem;
}

.search-button:hover {
  background-color: #e0e0e0;
}

.mr-2 {
  margin-right: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar {
    width: 60px;
  }
  
  .main-content {
    margin-left: 60px;
    width: calc(100% - 60px);
    padding: 1.5rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .journey-container {
    grid-template-columns: 1fr;
  }

  .slider-nav {
    width: 36px;
    height: 36px;
  }
  
  .slider-prev {
    margin-left: -10px;
  }
  
  .slider-next {
    margin-right: -10px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 50px;
  }
  
  .main-content {
    margin-left: 50px;
    width: calc(100% - 50px);
    padding: 1rem;
  }
  
  .quiz-card {
    min-width: 240px;
  }
  
  .journey-image {
    width: 80px;
    min-width: 80px;
  }

  .slider-nav {
    width: 32px;
    height: 32px;
  }
}`

const styleSheetex = document.createElement("style");
styleSheetex.type = "text/css";
styleSheetex.textContent = explore_styles;
const oldStyleSheet = document.querySelector('style[data-component-style="explore"]');
if (oldStyleSheet) {
    document.head.removeChild(oldStyleSheet);
}
styleSheetex.setAttribute('data-component-style', 'explore'); // Add identifier
document.head.appendChild(styleSheetex);

