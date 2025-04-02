
const questions = {
    template: `
        <div class="component-wrapper">
            <div class="panel_enc">
                <div class="search_enc">
                    <div class="search_sec">
                        <input 
                            type="text" 
                            v-model="searchQuery"
                            placeholder="Search Questions..."
                            class="search_input"
                        >
                       
                    </div>
                </div>
                <!--
                <select v-model="selectedSubject" class="unified_search__select" @change="filterBySubject">
                    <option value="">All Subjects</option>
                    <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                        {{ subject.name }}
                    </option>
                </select>
                -->
                <select v-model="selectedChapter" class="unified_search__select" @change="filterByChapter">
                    <option value="">All Chapters</option>
                    <option v-for="chapter in filteredChapters" :key="chapter.id" :value="chapter.id">
                        {{ chapter.name }}
                    </option>
                </select>
                <select v-model="selectedQuiz" class="unified_search__select" @change="loadQuestions">
                    <option value="">All Quizzes</option>
                    <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                        {{ quiz.title }}
                    </option>
                </select>
                <button class="btn btn-clear" @click="clearFilters">
                    <i class="fas fa-times"></i> Clear
                </button>
                <button class="add_button" @click="openModal">
                    <i class="fas fa-plus"></i>
                    <span>Add Question</span>
                </button>
            </div>
            <div class="admin_table_enc">
                <table class="admin_table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Question</th>
                            <th>Chapter</th>
                            <th>Subject</th>
                            <th>Quiz</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="question in filteredQuestions" :key="question.id">
                            <td>{{ question.id }}</td>
                            <td>{{ question.question_statement }}</td>
                            <td>{{ getChapterName(question.chapter_id) }}</td>
                            <td>{{ getSubjectName(question.chapter_id) }}</td>
                            <td>{{ getQuizTitle(question.quiz_id) }}</td>
                            <td>
                                <button @click="editQuestion(question)">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button @click="deleteQuestion(question.id)">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Question Modal -->
            <div class="modal fade" id="questionModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditing ? 'Edit Question' : 'Add Question' }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="isEditing ? updateQuestion() : saveQuestion()">
                                <div class="mb-3">
                                    <label class="form-label">Question</label>
                                    <input type="text" class="form-control" v-model="currentQuestion.question_statement" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Subject</label>
                                    <select class="form-control" v-model="selectedSubject" @change="loadChapters" required>
                                        <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                                            {{ subject.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Chapter</label>
                                    <select class="form-control" v-model="currentQuestion.chapter_id" required>
                                        <option v-for="chapter in filteredChapters" :key="chapter.id" :value="chapter.id">
                                            {{ chapter.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Quiz</label>
                                    <select class="form-control" v-model="currentQuestion.quiz_id" required>
                                        <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">
                                            {{ quiz.title }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Options</label>
                                <div class="mb-2">
                                    <label class="form-label">Option 1</label>
                                    <input type="text" class="form-control" v-model="currentQuestion.option1" required>
                                </div>
                                <div class="mb-2">
                                    <label class="form-label">Option 2</label>
                                    <input type="text" class="form-control" v-model="currentQuestion.option2" required>
                                </div>
                                <div class="mb-2">
                                    <label class="form-label">Option 3</label>
                                    <input type="text" class="form-control" v-model="currentQuestion.option3" required>
                                </div>
                                <div class="mb-2">
                                    <label class="form-label">Option 4</label>
                                    <input type="text" class="form-control" v-model="currentQuestion.option4" required>
                                </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Correct Answer</label>
                                    <input type="text" class="form-control" v-model="currentQuestion.correct_option" required>
                                </div>
                                <button type="submit" class="modal_submit">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            questions: [],
            subjects: [],
            chapters: [],
            quizzes: [],
            currentQuestion: {
                id: null,
                question_statement: '',
                chapter_id: '',
                quiz_id: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                correct_option: ''
            },
            selectedSubject: '',
            selectedChapter: '',
            selectedQuiz: '',
            isEditing: false,
            searchQuery: '',
            loading: false,
            error: null,
            modalInstance: null
        }
    },
    computed: {
        filteredQuestions() {
            let filtered = this.questions;
    
            if (this.selectedSubject) {
                filtered = filtered.filter(question => 
                    this.getSubjectName(question.chapter_id) === this.getSubjectName(this.selectedSubject)
                );
            }
    
            if (this.selectedChapter) {
                filtered = filtered.filter(question => 
                    question.chapter_id === this.selectedChapter
                );
            }
    
            if (this.selectedQuiz) {
                filtered = filtered.filter(question => 
                    question.quiz_id === this.selectedQuiz
                );
            }
    
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase().trim();
                filtered = filtered.filter(question => 
                    question.question_statement.toLowerCase().includes(query) ||
                    this.getChapterName(question.chapter_id).toLowerCase().includes(query) ||
                    this.getSubjectName(question.chapter_id).toLowerCase().includes(query) ||
                    this.getQuizTitle(question.quiz_id).toLowerCase().includes(query)
                );
            }
    
            return filtered;
        },
        
        filteredChapters() {
            if (!this.selectedSubject) return this.chapters;

            return this.chapters.filter(chapter => 
                chapter.subject_id === this.selectedSubject
            );
        },
        filteredQuizzes() {
            if (!this.selectedChapter) return this.quizzes;
            return this.quizzes.filter(quiz => 
                quiz.chapter_id === this.currentQuestion.chapter_id);

           
        }
    },
    methods: {
        filterBySubject() {
            if (this.selectedSubject) {
                this.fetchQuestions(this.selectedSubject);
            }
        },
        filterByChapter() {
            if (this.selectedChapter) {
                this.fetchQuestions(this.selectedSubject, this.selectedChapter);
            }
        },
        
        getChapterName(chapterId) {
            const chapter = this.chapters.find(c => c.id === chapterId);
            return chapter ? chapter.name : 'Unknown Chapter';
        },
        getSubjectName(chapterId) {
            const chapter = this.chapters.find(c => c.id === chapterId);
            const subject = this.subjects.find(s => s.id === chapter.subject_id);
            return subject ? subject.name : 'Unknown Subject';
        },
        getQuizTitle(quizId) {
            const quiz = this.quizzes.find(q => q.id === quizId);
            return quiz ? quiz.title : 'Unknown Quiz';
        },
        clearFilters() {
            this.searchQuery = '';
            this.selectedSubject = '';
            this.selectedChapter = '';
            this.selectedQuiz = '';
            this.fetchQuestions();
        },
        async fetchSubjects() {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/subjects', {
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
                const response = await fetch('http://127.0.0.1:5000/api/chapters', {
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
                let url = 'http://127.0.0.1:5000/api/quizzes';
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
        async fetchQuestions(quizId = null) {
            this.loading = true;
            try {
                let url = 'http://127.0.0.1:5000/api/questions';
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
        

        async saveQuestion() {
            try {
                const payload = {
                    question_statement: this.currentQuestion.question_statement,
                    option1: this.currentQuestion.option1,
                    option2: this.currentQuestion.option2,
                    option3: this.currentQuestion.option3,
                    option4: this.currentQuestion.option4,
                    correct_option: this.currentQuestion.correct_option,
                    quiz_id: this.currentQuestion.quiz_id
                };
                
                const response = await fetch('http://127.0.0.1:5000/api/questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Failed to create question');
                
                this.showNotification('success', 'Question created successfully');
                await this.fetchQuestions();
                this.closeModal();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },    
        
        
        async fetchQuizzes() {
            this.loading = true;
            try {
                const response = await fetch('http://127.0.0.1:5000/api/quizzes', {
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
            this.isEditing = false;
            this.currentQuestion = {
                id: null,
                question_statement: '',
                chapter_id: '',
                quiz_id: '',
                options: ['', '', '', ''],
                correct_option: ''
            };
            new bootstrap.Modal(document.getElementById('questionModal')).show();
        },
        editQuestion(question) {
            this.isEditing = true;
            this.currentQuestion = { ...question };
            new bootstrap.Modal(document.getElementById('questionModal')).show();
        },
        
        async updateQuestion() {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/questions/${this.currentQuestion.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(this.currentQuestion)
                });

                if (!response.ok) throw new Error('Failed to update question');

                this.showNotification('success', 'Question updated successfully');
                await this.fetchQuestions();
                this.closeModal();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },
        async deleteQuestion(id) {
            if (!confirm('Are you sure you want to delete this question?')) return;

            try {
                const response = await fetch(`http://127.0.0.1:5000/api/questions/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Failed to delete question');

                this.showNotification('success', 'Question deleted successfully');
                await this.fetchQuestions();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },
        closeModal() {
            this.modalInstance?.hide();
            this.resetForm();
        },
        resetForm() {
            this.currentQuestion = {
                id: null,
                question_statement: '',
                chapter_id: '',
                quiz_id: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
                correct_option: ''
            };
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
        this.fetchQuestions();
        this.fetchSubjects();
        this.fetchChapters();
        this.fetchQuizzes();
    }
};
