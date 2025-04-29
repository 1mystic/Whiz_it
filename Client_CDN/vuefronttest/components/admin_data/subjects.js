
// Font Awesome CDN
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
document.head.appendChild(fontAwesomeLink);


const subjects = {
    template: `<div class="component-wrapper">
            <div class="panel_enc">
                <div class="search_enc">
                    <div class="search_sec">
                        <input 
                            type="text" 
                            v-model="searchQuery"
                            placeholder="Search subjects..."
                            class="search_input"
                        >
                        <i class="fas fa-search search_icon"></i>
                    </div>
                </div>
                <button class="add_button" @click="openModal">
                    <i class="fas fa-plus"></i>
                    <span>Add Subject</span>
                </button>
            </div>          
                               
            

            <!-- Subjects Table -->
            <div class="admin_table_enc">
                <table class="admin_table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="subject in filteredSubjects" :key="subject.id">
                            <td>{{ subject.id }}</td>
                            <td>{{ subject.name }}</td>
                            <td>{{ subject.description }}</td>
                            <td>
                                <button class="" @click="editSubject(subject)">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="" @click="deleteSubject(subject.id)">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                                <button class="" @click="openChapterModal(subject.id)">
                                    + Chapter
                                </button>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Subject Modal -->
            <div class="modal fade" id="subjectModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ isEditing ? 'Edit Subject' : 'Add Subject' }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="isEditing ? updateSubject() : saveSubject()">
                                <div class="mb-3">
                                    <label class="form-label">Subject Name</label>
                                    <input type="text" class="form-control" v-model="currentSubject.name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" v-model="currentSubject.description" rows="3"></textarea>
                                </div>
                                <button type="submit" class="modal_submit">Save Changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Chapter Modal -->
            <div class="modal fade" id="chapterModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Chapter</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="addChapter">
                                <div class="mb-3">
                                    <label class="form-label">Chapter Name</label>
                                    <input type="text" class="form-control" v-model="newChapter.name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" v-model="newChapter.description" rows="3"></textarea>
                                </div>
                                <button type="submit" class="modal_submit">Save Chapter</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            

        </div>
    `,
    data() {
        return {
            subjects: [],
            currentSubject: {
                id: null,
                name: '',
                description: ''
            },
            newChapter: {
                name: '',
                description: ''
            },
            newch_subject_id: null,
            isEditing: false,
            searchQuery: '',
            loading: false,
            error: null,
            modalInstance: null
        };
    },
    computed: {
        filteredSubjects() {
            if (!this.searchQuery) return this.subjects;
            const query = this.searchQuery.toLowerCase().trim();
            return this.subjects.filter(subject => 
                subject.name.toLowerCase().includes(query) ||
                subject.description?.toLowerCase().includes(query)
            );
        }
    },
    methods: {
        openModal() {
            this.isEditing = false;
            this.currentSubject = { id: null, name: '', description: ''};
            new bootstrap.Modal(document.getElementById('subjectModal')).show();
        },
        openChapterModal(subject_id) {
            this.newch_subject_id = subject_id;
            new bootstrap.Modal(document.getElementById('chapterModal')).show();
        },
        editSubject(subject) {
            this.isEditing = true;
            this.currentSubject = { ...subject };
            new bootstrap.Modal(document.getElementById('subjectModal')).show();            
        },
        // CRUD operations
        async fetchSubjects() {
            this.loading = true;
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
            if (!Array.isArray(this.subjects)) {
                throw new Error('Invalid response from server');
            }
            else {
                this.filteredSubjects = this.subjects;
            }
            } catch (error) {
            this.error = error.message;
            } finally {
            this.loading = false;
            }
        },
        async saveSubject() {
            if (!this.currentSubject.name) {
            return this.showNotification('error', 'Subject name is required');
            }
            try {
            const response = await fetch('https://whiz-it.onrender.com/api/subjects', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({                        
                name: this.currentSubject.name,
                description: this.currentSubject.description
                })
            });

            if (!response.ok) {
                let errorMessage = 'Failed to add subject';
                try {
                    const error = await response.json();
                    if (error.message) {
                        errorMessage = error.message; // Use API's error message if available
                    }
                } catch (jsonError) {
                    console.error("Error parsing JSON:", jsonError);
                }
                throw new Error(errorMessage);
            }

            this.showNotification('success', 'Subject added successfully');
            await this.fetchSubjects();
            this.closeModal();
            } catch (error) {
            this.showNotification('error', error.message);
            }
        },
        async updateSubject() {
            try {
            const response = await fetch(`https://whiz-it.onrender.com/api/subjects/${this.currentSubject.id}`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                name: this.currentSubject.name,
                description: this.currentSubject.description
                })
            });

            if (!response.ok) {
                let errorMessage = 'Failed to add subject';
                try {
                    const error = await response.json();
                    if (error.message) {
                        errorMessage = error.message; // Use API's error message if available
                    }
                } catch (jsonError) {
                    console.error("Error parsing JSON:", jsonError);
                }
                throw new Error(errorMessage);
            }
            this.showNotification('success', 'Subject updated successfully');
            await this.fetchSubjects();
            this.closeModal();
            } catch (error) {
            this.showNotification('error', error.message);
            }
        },
        async deleteSubject(id) {
            if (!confirm('Are you sure you want to delete this subject?')) return;

            try {
                const response = await fetch(`https://whiz-it.onrender.com/api/subjects/${id}`, {    
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Subject not found');
                    }
                    throw new Error('Failed to delete subject');
                }

                this.showNotification('success', 'Subject deleted successfully');
                await this.fetchSubjects();
            } catch (error) {
                this.showNotification('error', error.message);
                console.error('Delete error:', error);
            }
        },
        async addChapter() {
            if (!this.newChapter.name) {
                return this.showNotification('error', 'Chapter name is required');
            }
            try {
                const response = await fetch('https://whiz-it.onrender.com/api/chapters', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({                        
                        name: this.newChapter.name,
                        subject_id: this.newch_subject_id,
                        description: this.newChapter.description
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to add chapter');
                }

                this.showNotification('success', 'Chapter added successfully');
                
                this.closeModal();
            } catch (error) {
                this.showNotification('error', error.message);
            }
        },

        closeModal() {
            this.modalInstance?.hide();
            this.resetForm();
        },

        resetForm() {
            this.currentSubject = { id: null, name: '', description: '' };
            this.isEditing = false;
            this.error = null;
        },

        

        //
        showNotification(type, message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerText = message;

            //notification styling
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

            // animation 
            requestAnimationFrame(() => {
            notification.style.opacity = 1;
            });

            // Remove after 3 seconds
            setTimeout(() => {
            notification.style.opacity = 0;
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
            }, 3000);
        }
    },
    mounted() {
        this.fetchSubjects();
    },
    beforeUnmount() {
        // Cleanup of modal old
        this.modalInstance?.dispose();
    }
};


const subj_style = document.createElement('style');
subj_style.textContent = `

.modal_submit {
    padding: 0.5rem 1rem;
    background-color:rgba(228, 72, 72, 0.84);
    color: white;
    border: none;
    border-radius: 3rem;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    font-weight: 600;
}
    .modal_submit:hover {
        background-color:rgba(192, 35, 100, 0.8);
    }


    .subj_btn {
        padding: 5px 10px;
        font-size: 0.9rem;
        max-width: 6rem;
        max-height: 3rem;
        background-color:rgb(231, 250, 209);
        color: #000;
        border-radius: 8px;
        border: none;
    }

    .panel_enc {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 1.5rem;
    margin: 1rem 0;    
    border-radius: 12px;    
    gap: 1rem;
    }

    .search_enc {
        flex: 1;
        max-width: 500px;
    }

    .search_sec {
        position: relative;
        width: 100%;
    }

    .search_input {
        width: 100%;
        padding: 0.8rem 1rem 0.8rem 2.5rem;
        border: 4px solid rgba(199, 195, 195, 0.77);
        border-radius: 7rem;
        font-size: 1rem;
        transition: all 0.3s ease;
    }

    .search_input:focus {
        border-color:rgba(226, 74, 119, 0.89);        
        outline: none;
    }

    .search_icon {
        position: absolute;
        right : 0.8rem;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        font-size: 1rem;
    }
        
    .add_button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 5px solid rgb(73, 72, 71);
        background-color: rgb(189, 243, 178);
        border-radius: 7rem;
        color: black;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        max-width: 12rem;
        transition: all 0.3s ease;
    }

    .add_button:hover {        
       
        background-color: rgb(202, 230, 137);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .add_button i {
        font-size: 0.9rem;
    }

.admin_table {
width: 100%;
border-collapse: collapse;
margin-top: 1rem;

}
.admin_table thead {
    background-color:rgba(226, 174, 158, 0.92);
    color: white;
}

.admin_table thead th:first-child {
    border-top-left-radius: 0.5rem;
}

.admin_table thead th:last-child {
    border-top-right-radius: 0.5rem;
}

.admin_table tbody tr:nth-child(even) {
    background-color: rgb(247, 252, 234);
}

.admin_table th,
.admin_table td {
    padding: 1rem;
    text-align: left;
    color : #3d3d3d;
    font-size: 1rem;
    font-family: 'Lexend Deca', sans-serif;
}

.admin_table button {

display: inline-block;
text-align: center;
padding: 0.4rem 1rem;
font-size: 0.8rem;
background-color:  rgba(143, 83, 79, 0.27);
border-radius: 5rem;
border: 1px solid transparent ;
margin: 0.4rem;
color: rgb(63, 55, 55);
cursor: pointer;
transition: all 0.3s ease;
}

.admin_table button:hover {
background-color: rgba(255, 105, 105, 0.82);
}




    /* Responsive Design */
    @media (max-width: 768px) {
        .control-panel {
            flex-direction: column;
            padding: 1rem;
        }

        .search_sec {
            width: 100%;
            max-width: 100%;
            margin-bottom: 1rem;
        }

        .add_button {
            width: 100%;
            justify-content: center;
        }
    }
       

    
`;
document.head.appendChild(subj_style);
