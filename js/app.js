// app.js
import SignupForm from './components/SignupForm.js';

const { createApp } = Vue;

const app = createApp({
    components: {
        SignupForm
    }
});

app.mount('#app');