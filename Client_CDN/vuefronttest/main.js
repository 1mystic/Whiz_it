const app = Vue.createApp({
    template: `
        <router-view :key="$route.fullPath"></router-view>
    `
});

app.use(router);
app.use(store);

app.config.errorHandler = (err, vm, info) => {
    console.error('Vue Error:', err);
    console.log('Error Info:', info);
};

app.mount('#app');

window.addEventListener('hashchange', () => {
    console.log('Hash changed:', window.location.hash);
    router.push(window.location.hash.slice(1)).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
            console.error('Navigation error:', err);
        }
    });
});