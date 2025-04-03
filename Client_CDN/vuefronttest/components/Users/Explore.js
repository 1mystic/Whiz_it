const Explore = {
  name: 'Explore',
  components: {
   
  },
  template: `
    
            <!-- Search button -->
            <!-- Search and Filters -->
                <div class="filter_bar">
                    <div class="search_bar">
                        <i class="fas fa-search"></i>
                        <input 
                            type="text" 
                            v-model="searchQuery" 
                            placeholder="Search quizzes..."
                            class="form-control"
                        >
                    </div>
               
                
                    <div class="filter_opt">                      
                        <div class="form-check form-switch" 
                            style="margin-top: 0.8rem;">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                            v-model="hideExpired" @change="filterQuizzes">
                        <label class="form-check-label" 
                        style="font-size: 1.2rem;
                                margin-top: 0.2rem;"
                        for="flexSwitchCheckDefault">Exclude Expired</label>
                        </div>
                    </div>
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
                    <div class="quiz-card" :class="{ 'selected': selectedSubject === quiz.subject_id }">
                      <div class="quiz-card-image">
                        <div class="bookmark-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        </div>
                        <div class="quiz-card-img-title">{{quiz.title}}</div>
                      </div>       
                                     
                      <div class="quiz-title">{{ getSubjectName(getChapter(quiz.chapter_id)?.subject_id) }}   {{ getChapterName(quiz.chapter_id) }}  </div>
                    
                      <i class="bi bi-clock"></i>
                            <span class="quiz-subtitle">{{ formatDuration(quiz.time_duration) }}</span>
                            <span class="quiz-subtitle">  {{ quiz.question_count }} Questions</span>
                      <div class="quiz-info">
                        
                       <button @click="startQuiz(quiz.id)" 
                        class="quiz-action"
                        :disabled="isPastQuiz(quiz.date_of_quiz)">
                        {{ isPastQuiz(quiz.date_of_quiz) ? 'Expired' : 'Attempt Quiz' }}
                        </button>
                      </div>
                    </div>
                  </div> <!-- v-for -->
                </div>
              </div>




                 

            
            <!-- Quiz Categories -->
            <h2 class="section-title"></h2> <!-- Quiz Categories -->
            <div class="categories-grid">
                <div 
                  v-for="subject in subjects" 
                  :key="subject.id" 
                  class="category-card subject-card"
                  @click="selectSubject(subject)"
                  :class="{ 'selected': selectedSubject === subject.id }"
                >
                 
                      <div class="category-icon">
                      <i class="bi bi-journal-minus"  style="font-size:1.5rem; font-weight:700;"></i>
                      </div>
                      <span>{{subject.name}}</span>
                </div>
                <div 
                  v-for="chapter in chapters" 
                  :key="chapter.id" 
                  class="category-card chapter-card"
                  @click="selectChapter(chapter)"
                  :class="{ 'selected': selectedChapter === chapter.id }"
                >
                 
                      <div class="category-icon">\
                      <i class="bi bi-book-half" style="font-size:1.2rem;"></i>
                      </div>
                      <span>{{chapter.name}}</span>
                </div>
                
            </div>
            
            <!-- My Quiz Journey -->
            <h2 class="section-title"></h2>
            <div class="journey-container">

                <div v-for="score in userScores" :key="score.id"  class="journey-card">
                    <div class="journey-image">
                        <div class="score_card_id">{{ score.id }}</div>
                    </div>
                    <div class="journey-content">
                        <h3 class="journey-title">{{ score.quiz_title }}</h3>
                        <p class="journey-subtitle">{{ formatDate(score.timestamp) }}</p>
                        <div class="exp_progress-bar">
                            <div class="exp_progress-value" style="{ width: score.score + '%' }"></div>
                        </div>
                        <p class="exp_progress-label">Progress: {{ score.score }}%</p>
                    </div>
                </div>
                
                
            </div>
            
            
        </div>
    `,

   data() {
    return {
      position: 0,
      isPaused: false,
      isManuallyNavigating: false,
       
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
      availableQuizzes: [],
     
     


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
       const old_quiz = this.userScores.find(quiz => quiz.quiz_id === quizId);
       if (old_quiz) {
           alert("You have already attempted this quiz.");
           return;
       }        
      window.open(this.$router.resolve({ path: `/quiz/${quizId}` }).href, '_blank');
  },
      filterQuizzes() {
          this.fetchQuizzes();
      },
    // --- Initialization & Setup ---
    setupSlider() {
      

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
    selectSubject(subject) {
      this.selectedSubject = this.selectedSubject === subject.id ? null : subject.id;
      this.selectedChapter = null; // Deselect chapter when subject changes
    },
    selectChapter(chapter) {
      this.selectedChapter = this.selectedChapter === chapter.id ? null : chapter.id;
      this.selectedSubject = null; // Deselect subject when chapter changes
    },

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


.filter_bar {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    padding: 2rem 2rem 0 2rem;
    /*background:rgb(250, 239, 227);*/
    border-radius: 2rem;

}
   
.search_bar, .filter_opt {
    display: flex;   
    justify-content: flex-start;
    gap: 0.9rem;
}
    input, select {
    background-color: rgba(255, 255, 255, 0.8);
}
.search_bar input {
margin-bottom: 0.5rem;

}

.search_bar i, .filter_opt i {
    position: relative;
    top: 2.8rem;
    transform: translateY(-50%);
    color:rgb(219, 121, 145);
    z-index: 1; 
}
.search_bar i{
top: 2.7rem;
}

.section-title {
  font-size: 2.95rem;
  font-weight: 600;
  margin-bottom: 2rem;
  margin-top: 4rem;
  margin-left: 2rem;
  color: rgba(110, 79, 50, 0.73);
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
  background-color: rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: rgba(0, 0, 0, 0.2);
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
  color: rgba(0, 0, 0, 0.8);
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
  border: 5px solid rgba(148, 216, 121, 0.23);
  border-radius: 8px;
  padding: 1rem;
  background-color: rgba(235, 255, 212, 0.34);
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
  background-color: rgb(255, 162, 146);
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
  .quiz-card-img-title{
  font-size: 3.2rem;
  font-weight: 700;
  color : rgba(0, 0, 0, 0.182);}

.quiz-creator {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}


.quiz-title {
  font-weight: 650;
  font-size: 1.425rem;
  margin-bottom: 0.55rem;
  margin-left: 0.5rem;
  color : rgba(64, 88, 44, 0.8);
}
  .quiz-subtitle {
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  margin-left: 0.8rem;
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
  font-size: 1rem;
}

.quiz-meta-item svg {
  margin-right: 0.25rem;
  font-size: 1rem;
}

.quiz-action {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #f0f0f0;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
}

.quiz-action:hover {
  background-color:rgba(132, 240, 155, 0.82);
}

/* Category cards */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-card {
  border: 3px solid rgba(139, 229, 252, 0.14);
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
  .subject-card {
  background-color: rgba(255, 235, 168, 0.26);
}



.chapter-card {
  background-color: rgba(114, 226, 226, 0.22);
}

.selected {
  background-color: rgba(132, 240, 155, 0.82); /*rgba(191, 255, 132, 0.62);*/
  border: 2px solid #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
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

.score_card_id {
  font-size: 3.5rem;
  font-weight: 700;
  color : rgba(0, 0, 0, 0.182);
  
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
  background-color: rgba(255, 255, 255, 0.8);
}

.journey-image {
  width: 120px;
  min-width: 120px;
  background-color:rgb(220, 255, 181);
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
  font-size: 1.875rem;
  margin-bottom: 1rem;
}

.exp_progress-bar {
  width: 100%;
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  margin-bottom: 0.5rem;
}

.exp_progress-value {
  height: 100%;
  background-color: #333;
  border-radius: 2px;
}

.exp_progress-label {
  font-size: 0.75rem;
  color: #666;
}

/* Search button */
.search-button {
  display: flex;
  align-items: center;
  justify-content: felx-start;
  padding: 0.75rem 1.5rem;
 
  border-radius: 4px;
  margin: 2rem 1rem;
  max-width: 300px;
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

