// components/SignupForm.js
const SignupForm = {
    template: `
    <div class="signup-container">
        <h2>Sign Up</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <div class="form-group">
                <label for="dentist_name">Dentist Name:</label>
                <input type="text" id="dentist_name" v-model="dentist_name" required>
            </div>
            <div class="form-group">
                <label for="clinic_address">Clinic Address:</label>
                <input type="text" id="clinic_address" v-model="clinic_address" required>
            </div>
            <button type="submit">Sign Up</button>
            <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        </form>
    </div>
    `,
    data() {
        return {
            email: '',
            password: '',
            dentist_name: '',
            clinic_address: '',
            errorMessage: '',
            successMessage: '',
            supabase: null  // Supabase client
        };
    },
    mounted() {
        // Initialize Supabase client
        this.supabase = supabase.createClient(
            'YOUR_SUPABASE_URL',
            'YOUR_SUPABASE_ANON_KEY'
        );
    },
    methods: {
        async handleSubmit() {
            try {
                this.errorMessage = ''; // Clear previous errors
                this.successMessage = '';

                const { data, error } = await this.supabase.auth.signUp({
                    email: this.email,
                    password: this.password,
                    options: {
                        data: {
                            dentist_name: this.dentist_name,
                            clinic_address: this.clinic_address
                        }
                    }
                });

                if (error) {
                    console.error("Signup error:", error);
                    this.errorMessage = error.message || 'Signup failed. Please try again.';
                } else {
                    console.log("Signup successful:", data);
                    this.successMessage = 'Signup successful! Check your email to verify.';
                    this.email = '';  // Clear the form
                    this.password = '';
                    this.dentist_name = '';
                    this.clinic_address = '';
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                this.errorMessage = 'An unexpected error occurred. Please try again.';
            }
        }
    }
};

export default SignupForm;