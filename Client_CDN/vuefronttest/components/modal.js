// components/Modal.js

const modal = {
    template: `
        <div>
            <!-- Trigger button -->
            <button 
                v-if="showTrigger"
                class="modal-trigger" 
                @click="openModal"
                :class="triggerClasses">
                {{ triggerText }}
            </button>
          
            <!-- Modal container -->
            <transition name="modal-fade">
                <div 
                    v-if="isVisible" 
                    class="modal-container"
                    @click="handleBackgroundClick"
                >
                    <div class="modal-content" :class="contentClasses">
                        <button 
                            class="close-btn"
                            @click="closeModal"
                            v-if="showCloseButton"
                        >×</button>
                        
                        <!-- Slot for custom header -->
                        <slot name="header">
                            <h2 v-if="title">{{ title }}</h2>
                        </slot>
                        
                        <!-- Default slot for main content -->
                        <slot></slot>
                        
                        <!-- Slot for custom footer -->
                        <slot name="footer"></slot>
                    </div>
                </div>
            </transition>
        </div>
    `,
    
    name: 'Modal',
    
    props: {
        // Control modal visibility externally
        modelValue: {
            type: Boolean,
            default: false
        },
        // Modal title (optional)
        title: {
            type: String,
            default: ''
        },
        // Show/hide trigger button
        showTrigger: {
            type: Boolean,
            default: true
        },
        // Trigger button text
        triggerText: {
            type: String,
            default: 'Open Modal'
        },
        // Show/hide close button
        showCloseButton: {
            type: Boolean,
            default: true
        },
        // Additional classes for trigger button
        triggerClasses: {
            type: [String, Object, Array],
            default: ''
        },
        // Additional classes for modal content
        contentClasses: {
            type: [String, Object, Array],
            default: ''
        },
     
        closeOnBackgroundClick: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            isVisible: this.modelValue
        };
    },

    watch: {
        modelValue(newVal) {
            this.isVisible = newVal;
            if (newVal) {
                this.addEventListeners();
            } else {
                this.removeEventListeners();
            }
        }
    },

    methods: {
        openModal() {
            this.isVisible = true;
            this.$emit('update:modelValue', true);
            this.$emit('open');
            this.addEventListeners();
        },

        closeModal() {
            this.isVisible = false;
            this.$emit('update:modelValue', false);
            this.$emit('close');
            this.removeEventListeners();
        },

        handleBackgroundClick(e) {
            if (this.closeOnBackgroundClick && e.target === e.currentTarget) {
                this.closeModal();
            }
        },

        handleEscape(e) {
            if (e.key === 'Escape' && this.isVisible) {
                this.closeModal();
            }
        },

        addEventListeners() {
            document.addEventListener('keydown', this.handleEscape);
            document.body.style.overflow = 'hidden';
        },

        removeEventListeners() {
            document.removeEventListener('keydown', this.handleEscape);
            document.body.style.overflow = '';
        }
    },

    beforeUnmount() {
        this.removeEventListeners();
    }
};

// Add styles
addStyles(`
    .modal-fade-enter-active,
    .modal-fade-leave-active {
        transition: opacity 0.3s ease;
    }

    .modal-fade-enter-from,
    .modal-fade-leave-to {
        opacity: 0;
    }

    .modal-container {
        position: fixed;
        top: 2rem;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        min-width: 300px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        transform: scale(1);
        transition: transform 0.3s ease-in-out;
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        color: #333;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }

    .close-btn:hover {
        background-color: rgba(63, 62, 62, 0.1);
    }

    .modal-trigger {
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        background-color: #6366f1;
        color: white;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .modal-trigger:hover {
        background-color: #4f46e5;
    }

    @media (max-width: 480px) {
        .modal-content {
            padding: 1.5rem;
            min-width: 280px;
        }
    }
`   );