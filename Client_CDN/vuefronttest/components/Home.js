// components/Home.js
const Home = {
    template: `
        <div class="home">
        <router-link to="/about">About</router-link>
            <h1>Welcome to Home</h1>
            <p>Count from Vuex: {{ count }}</p>
            <p>Double Count: {{ doubleCount }}</p>
            <button @click="increment">Increment</button>
            <button @click="incrementAsync">Increment Async</button>
        </div>
    `,
    computed: {
        count() {
            return this.$store.state.count;
        },
        doubleCount() {
            return this.$store.getters.doubleCount;
        }
    },
    methods: {
        increment() {
            this.$store.commit('increment');
        },
        incrementAsync() {
            this.$store.dispatch('incrementAsync');
        }
    }
};