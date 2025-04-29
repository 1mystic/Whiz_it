// admin_data/chapters.js


const quizes = {
    template: `
        <div class="component-wrapper">
            <div class="panel_enc">
                <div class="search_enc">
                    <div class="search_sec">
                        <input 
                            type="text" 
                            v-model="searchQuery"
                            placeholder="Search Quizzes..."
                            class="search_input"
                        >
                       
                    </div>
                </div>
                <select v-model="selectedSubject" class="unified_search__select" >
                    <option value="">All Subjects</option>
                    <option v-for="subject in subjects" :key="subject.id" :value="subject.name">
                        {{ subject.name }}
                    </option>
                </select>
                <select v-model="selectedChapter" class="unified_search__select" >
                    <option value="">All Chapters</option>
                    <option v-for="chapter in filteredChapters" :key="chapter.id" :value="chapter.name">
                        {{ chapter.name }}
                    </option>
                </select>
                <button class="btn btn-clear" @click="clearFilters">
                    <i class="fas fa-times"></i> Clear
                </button>
                <button class="add_button" @click="openModal">
                    <i class="fas fa-plus"></i>
                    <span>Add Quiz</span>
                </button>
            </div>          
           
            <div class="admin_table_enc">
                <table class="admin_table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Chapter</th>
                            <th>Sujbect</th>
                            <th>Questions</th>
                            <th>Duration</th>
                            <th> Release </th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="quiz in filteredQuizzes" :key="quiz.id">
                            <td>{{ quiz.id }}</td>
                            <td>{{ quiz.title }}</td>
                            <td>{{ getChapterName(quiz.chapter_id) }}</td>
                            <td>{{ getSubjectName(quiz.chapter_id) }}</td>
                            <td>{{ quiz.question_count }}</td>
                            <td>{{ quiz.time_duration }}</td>
                            <td>{{ formatDate(quiz.release_at) }}</td>
                            <td>{{ formatDate(quiz.date_of_quiz) }}</td>
                            <td>
                                <button  @click="editQuiz(quiz)">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button @click="deleteQuiz(quiz.id)">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Quiz Modal -->
            <div class="modal fade" id="quizModal" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditing ? 'Edit Quiz' : 'Add Quiz' }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Quiz Details Section -->
                            <div class="quiz-details-section mb-4">
                                
                                <form @submit.prevent="isEditing ? updateQuiz() : saveQuiz()">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Quiz Title</label>
                                            <input type="text" class="form-control" v-model="currentQuiz.title" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Subject</label>
                                            <select class="form-control" v-model="selectedSubject" @change="loadChapters" required>
                                                <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                                                    {{ subject.name }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Chapter</label>
                                            <select class="form-control" v-model="currentQuiz.chapter_id" required>
                                                <option v-for="chapter in filteredChapters" :key="chapter.id" :value="chapter.id">
                                                    {{ chapter.name }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Duration (minutes)</label>
                                            <input type="number" class="form-control" v-model="currentQuiz.duration_minutes" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Deadline</label>
                                            <input type="datetime-local" class="form-control" v-model="currentQuiz.date_of_quiz" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Release at</label>
                                            <input type="datetime-local" class="form-control" v-model="currentQuiz.release_at" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label class="form-label">Remarks</label>
                                            <textarea class="form-control" v-model="currentQuiz.remarks" rows="3"></textarea>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <!-- Questions Section (Only visible when editing) -->
                            <div v-if="isEditing" class="questions-section">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="section-title">Quiz Questions</h6>
                                    <button class="add_button" @click="openAddQuestionModal">
                                        <i class="fas fa-plus"></i> Add Question
                                    </button>
                                </div>

                                <!-- Questions List -->
                                <div v-if="questions.length" class="questions-list">
                                    <div v-for="(question, index) in questions" :key="question.id" class="question-card mb-3 p-3 border rounded">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <h7 class="question-text">{{ index + 1 }}. {{ question.question_statement }}</h7>
                                            <div class="question-actions">
                                                <button style="
                                                    display: inline-block;
                                                    text-align: center;
                                                    padding: 0.2rem 0.5rem;
                                                    font-size: 0.8rem;
                                                    background-color: rgba(143, 83, 79, 0.27);
                                                    border-radius: 5rem;
                                                    border: 1px solid transparent;
                                                    margin: 0.2rem;
                                                    color: rgb(63, 55, 55);
                                                    cursor: pointer;
                                                    transition: all 0.3sease;

                                                    hover: background-color: rgba(143, 83, 79, 0.67);
                                                    "
                                                    
                                                 @click="editQuestion(question)">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button style="
                                                    display: inline-block;
                                                    text-align: center;
                                                    padding: 0.2rem 0.5rem;
                                                    font-size: 0.8rem;
                                                    background-color: rgba(143, 83, 79, 0.27);
                                                    border-radius: 5rem;
                                                    border: 1px solid transparent;
                                                    margin: 0.2rem;
                                                    color: rgb(63, 55, 55);
                                                    cursor: pointer;
                                                    transition: all 0.3sease;

                                                    hover: background-color: rgba(143, 83, 79, 0.67);
                                                    "
                                                     @click="deleteQuestion(question.id)">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="options-list">
                                            <div :class="['option']">
                                                A. {{ question.options[0] }}
                                            </div>
                                            <div :class="['option']">
                                                B. {{ question.options[1] }}
                                            </div>
                                            <div :class="['option']">
                                                C. {{ question.options[2] }}
                                            </div>
                                            <div :class="['option']">
                                                D. {{ question.options[3] }}
                                            </div>
                                        </div>
                                        <div class="correct-option"> 
                                            Correct Option: {{ question.correct_option }}
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="text-center text-muted">
                                    No questions added to this quiz yet.
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" style= "display: inline-block; max-width: 8rem;
                                                          background-color:rgba(107, 103, 81, 0.83);" 
                                                            
                            class="modal_submit btn-secondary" data-bs-dismiss="modal">Close</button>

                            <button type="button" style= "display: inline-block; max-width: 10rem" 
                            class="modal_submit" @click="isEditing ? updateQuiz() : saveQuiz()">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add/Edit Question Modal -->
            <div class="modal fade" id="questionModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditingQuestion ? 'Edit Question' : 'Add Question' }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="isEditingQuestion ? updateQuestion() : saveQuestion()">
                                <div class="mb-3">
                                    <label class="form-label">Question Statement</label>
                                    <textarea class="form-control" v-model="currentQuestion.question_statement" required rows="3"></textarea>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Option A</label>
                                        <input type="text" class="form-control" v-model="currentQuestion.option1" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Option B</label>
                                        <input type="text" class="form-control" v-model="currentQuestion.option2" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Option C</label>
                                        <input type="text" class="form-control" v-model="currentQuestion.option3" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Option D</label>
                                        <input type="text" class="form-control" v-model="currentQuestion.option4" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Correct Option</label>
                                    <select class="form-control" v-model="currentQuestion.correct_option" required>
                                        <option value="1">Option A</option>
                                        <option value="2">Option B</option>
                                        <option value="3">Option C</option>
                                        <option value="4">Option D</option>
                                    </select>
                                </div>
                                <button type="submit" class="modal_submit">Save Question</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            quizzes: [],
            subjects: [],
            chapters: [],
            questions: [],
            currentQuiz: {
                id: null,
                title: '',
                chapter_id: '',
                duration_minutes: 30,
                date_of_quiz: '',
                remarks: '',
                release_at: ''
                
            },
            currentQuestion: {
                id: null,
                question_statement: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                correct_option: '',
                quiz_id: null
            },
            selectedSubject: '',
            selectedChapter: '',
            isEditing: false,
            isEditingQuestion: false,
            searchQuery: '',
            loading: false,
            error: null,
            modalInstance: null
        }
    },
    computed: {
        filteredQuizzes() {
            let filtered = this.quizzes;
            console.log("Quizzez_before_filer" , this.quizzes);
            if (this.selectedSubject) {
                filtered = filtered.filter(quiz => 
                    quiz.subject_name === this.selectedSubject  //quiz.subject_id === this.selectedSubject
                );
            }
        
            if (this.selectedChapter) {
                filtered = filtered.filter(quiz => 
                    quiz.chapter_name === this.selectedChapter
                );
            }
        
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase().trim();
                filtered = filtered.filter(quiz => 
                    quiz.title.toLowerCase().includes(query) ||
                    this.chapter_name.toLowerCase().includes(query) ||
                    this.subject_name.toLowerCase().includes(query)
                );
            }
        
            return filtered;
        },
        
        filteredChapters() {

            if (!this.selectedSubject) {
                return this.chapters;
            }

            return this.chapters.filter(chapter => 
                chapter.subject_id === this.selectedSubject
            );
        }
    },
    methods: {
        filterBySubject() {
            if (this.selectedSubject) {
                this.fetchQuizzes(this.selectedSubject);
            }
        },
        filterByChapter() {
            if (this.selectedChapter) {
                this.fetchQuizzes(this.selectedSubject, this.selectedChapter);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        getChapterName(chapterId) {
            const chapter = this.chapters.find(c => c.id === chapterId);
            return chapter ? chapter.name : 'Unknown Chapter';
        },
        getSubjectName(chapterId) {
            const chapter = this.chapters.find(c => c.id === chapterId);
            if (!chapter) return 'Unknown Chapter';
            const subject = this.subjects.find(s => s.id === chapter.subject_id);
            return subject ? subject.name : 'Unknown Subject';
        },
        clearFilters() {
            this.searchQuery = '';
            this.selectedSubject = '';
            this.selectedChapter = '';
            this.fetchQuizzes();
        },

        
        async fetchSubjects() {
            try {
                const response = await fetch('https://whiz-it.onrender.com/api/subjects', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch subjects');
                }
                this.subjects = await response.json();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },
        async fetchChapters() {
            this.loading = true;
            try {
                const response = await fetch('https://whiz-it.onrender.com/api/chapters', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch chapters');
                }
                this.chapters = await response.json();
                if (!Array.isArray(this.chapters)) {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        
        async fetchQuizzes(subjectId = null, chapterId = null) {
            this.loading = true;
            try {
                let url = 'https://whiz-it.onrender.com/api/quizzes';
                const params = new URLSearchParams();
                if (subjectId) params.append('subject_id', subjectId);
                if (chapterId) params.append('chapter_id', chapterId);
                if (params.toString()) url += `?${params.toString()}`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch quizzes');
                this.quizzes = await response.json();
            } catch (error) {
                this.showNotification('error', error.message);
            } finally {
                this.loading = false;
            }
        },
        openModal() {           
            new bootstrap.Modal(document.getElementById('quizModal')).show();
        },
        async editQuiz(quiz) {
            this.isEditing = true;
            this.currentQuiz = { ...quiz };
            
            // Set the selected subject based on the chapter
            const chapter = this.chapters.find(c => c.id === quiz.chapter_id);
            if (chapter) {
                this.selectedSubject = chapter.subject_id;
            }

            // Fetch questions for quiz
            await this.fetchQuestions(quiz.id);
            new bootstrap.Modal(document.getElementById('quizModal')).show();
            
            this.clearFilters();
        },

        //fetch questions - specific quiz
        async fetchQuestions(quizId = null) {
            this.loading = true;
            try {
                let url = 'https://whiz-it.onrender.com/api/questions';
                if (quizId) {
                    url += `?quiz_id=${quizId}`;
                }
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch questions');
                this.questions = await response.json();
            } catch (error) {
                this.showNotification('error', error.message);
            } finally {
                this.loading = false;
            }
        },

        // ques modal
        openAddQuestionModal() {
            this.isEditingQuestion = false;
            this.currentQuestion = {
                id: null,
                question_statement: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                correct_option: '',
                quiz_id: this.currentQuiz.id
            };
            new bootstrap.Modal(document.getElementById('questionModal')).show();
            this.clearFilters();
        },

        
        editQuestion(question) {
            this.isEditingQuestion = true;
            this.currentQuestion = { ...question };
            new bootstrap.Modal(document.getElementById('questionModal')).show();
        },

       
        async saveQuestion() {
            try {
                const payload = {
                    question_statement: this.currentQuestion.question_statement,
                    option1: this.currentQuestion.option1,
                    option2: this.currentQuestion.option2,
                    option3: this.currentQuestion.option3,
                    option4: this.currentQuestion.option4,
                    correct_option: this.currentQuestion.correct_option,
                    quiz_id: this.currentQuiz.id
                };
                
                const response = await fetch('https://whiz-it.onrender.com/api/questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Failed to create question');
                
                this.showNotification('success', 'Question created successfully');
                await this.fetchQuestions(this.currentQuiz.id);
                document.getElementById('questionModal').querySelector('.btn-close').click();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },

        
        async updateQuestion() {
            try {
                const response = await fetch(`https://whiz-it.onrender.com/api/questions/${this.currentQuestion.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(this.currentQuestion)
                });

                if (!response.ok) throw new Error('Failed to update question');

                this.showNotification('success', 'Question updated successfully');
                await this.fetchQuestions(this.currentQuiz.id);
                document.getElementById('questionModal').querySelector('.btn-close').click();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },

       
        async deleteQuestion(questionId) {
            if (!confirm('Are you sure you want to delete this question?')) return;

            try {
                const response = await fetch(`https://whiz-it.onrender.com/api/questions/${questionId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Failed to delete question');

                this.showNotification('success', 'Question deleted successfully');
                await this.fetchQuestions(this.currentQuiz.id);
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },
    

        async saveQuiz() {
            try {
                const response = await fetch('https://whiz-it.onrender.com/api/quizzes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(this.currentQuiz)
                });

                if (!response.ok) throw new Error('Failed to create quiz');

                this.showNotification('success', 'Quiz created successfully');
                await this.fetchQuizzes();
                this.closeModal();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },
        async updateQuiz() {
            try {
                const response = await fetch(`https://whiz-it.onrender.com/api/quizzes/${this.currentQuiz.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(this.currentQuiz)
                });

                if (!response.ok) throw new Error('Failed to update quiz');

                this.showNotification('success', 'Quiz updated successfully');
                await this.fetchQuizzes();
                this.closeModal();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },
        async deleteQuiz(id) {
            if (!confirm('Are you sure you want to delete this quiz?')) return;

            try {
                const response = await fetch(`https://whiz-it.onrender.com/api/quizzes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Failed to delete quiz');

                this.showNotification('success', 'Quiz deleted successfully');
                await this.fetchQuizzes();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },
        closeModal() {
            this.resetForm();
            document.getElementById('quizModal').querySelector('.btn-close').click();
            this.clearFilters();
        },
        resetForm() {
            this.isEditing = false;
            this.error = null;
        },
        showNotification(type, message) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerText = message;

            Object.assign(notification.style, {
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                padding: '10px 20px',
                backgroundColor: type === 'success' ? 'green' : 'red',
                color: 'white',
                borderRadius: '5px',
                zIndex: 1000,
                opacity: 0,
                transition: 'opacity 0.5s'
            });

            document.body.appendChild(notification);

            requestAnimationFrame(() => {
                notification.style.opacity = 1;
            });

            setTimeout(() => {
                notification.style.opacity = 0;
                notification.addEventListener('transitionend', () => {
                    notification.remove();
                });
            }, 3000);
        }
    },
    mounted() {        
        this.fetchQuizzes();
        this.fetchSubjects();
        this.fetchChapters();
    }
}



