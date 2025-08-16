// stores/authStore.js - Updated with proper sign out handling
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            userProfile: null,
            isAuthenticated: false,
            isLoading: true,
            isInitialized: false,
            hasCompletedOnboarding: false,
            error: null,

            // Form state
            form: {
                fullName: '',
                email: '',
                phone: '',
                password: '',
            },

            errors: {},

            // Actions
            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                error: null
            }),

            setUserProfile: (profile) => {
                // Check if user has completed onboarding based on profile data
                const hasOnboardingData = profile &&
                    profile.personalInfo &&
                    profile.fitnessGoal &&
                    profile.dietPreference;

                set({
                    userProfile: profile,
                    hasCompletedOnboarding: hasOnboardingData
                });
            },

            setLoading: (loading) => set({ isLoading: loading }),

            setInitialized: (initialized) => set({ isInitialized: initialized }),

            setError: (error) => set({ error }),

            clearError: () => set({ error: null }),

            // Form actions
            updateForm: (field, value) => set((state) => ({
                form: { ...state.form, [field]: value },
                errors: { ...state.errors, [field]: '' }
            })),

            setFormErrors: (errors) => set({ errors }),

            clearForm: () => set({
                form: { fullName: '', email: '', phone: '', password: '' },
                errors: {}
            }),

            // Validation
            validateForm: (isSignUp = false) => {
                const { form } = get();
                const newErrors = {};

                if (isSignUp && !form.fullName.trim()) {
                    newErrors.fullName = 'Full Name is required';
                }
                if (!form.email.includes('@')) {
                    newErrors.email = 'Valid email required';
                }
                if (isSignUp && !/^\d{10}$/.test(form.phone)) {
                    newErrors.phone = 'Valid phone number required';
                }
                if (form.password.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                }

                set({ errors: newErrors });
                return Object.keys(newErrors).length === 0;
            },

            // Helper to fetch complete user profile
            fetchUserProfile: async (userId) => {
                try {
                    const userDoc = await getDoc(doc(db, 'users', userId));
                    if (userDoc.exists()) {
                        const profileData = userDoc.data();
                        get().setUserProfile(profileData);
                        return profileData;
                    }
                    return null;
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    return null;
                }
            },

            // Auth methods
            signUp: async () => {
                const { form, validateForm, setLoading, setError } = get();

                if (!validateForm(true)) return { success: false };

                setLoading(true);
                try {
                    const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        form.email,
                        form.password
                    );
                    const user = userCredential.user;

                    // Save basic user profile to Firestore (no onboarding data yet)
                    const basicProfile = {
                        fullName: form.fullName,
                        email: form.email,
                        phone: form.phone,
                        createdAt: new Date().toISOString(),
                        // Don't include personalInfo, fitnessGoal, dietPreference yet
                    };

                    await setDoc(doc(db, 'users', user.uid), basicProfile);

                    // Don't set state here - let onAuthStateChanged handle it
                    get().clearForm();

                    return {
                        success: true,
                        user,
                        userId: user.uid,
                        needsOnboarding: true // Flag to indicate onboarding needed
                    };
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                    return { success: false, error: error.message };
                }
            },

            signIn: async () => {
                const { form, validateForm, setLoading, setError } = get();

                if (!validateForm(false)) return { success: false };

                setLoading(true);
                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        form.email,
                        form.password
                    );
                    const user = userCredential.user;

                    // Don't set state here - let onAuthStateChanged handle it
                    get().clearForm();

                    return {
                        success: true,
                        user,
                        needsOnboarding: !get().hasCompletedOnboarding // Check if onboarding needed
                    };
                } catch (error) {
                    setError(error.message);
                    setLoading(false);
                    return { success: false, error: error.message };
                }
            },

            // Updated signOut function - immediate state change
            signOut: async () => {
                try {
                    console.log('🚪 Signing out...');
                    
                    // Clear any existing errors
                    set({ error: null });

                    // Sign out from Firebase
                    await firebaseSignOut(auth);

                    // Don't set state here - let onAuthStateChanged handle it
                    console.log('✅ Sign out successful');
                    return true;
                } catch (error) {
                    console.error('❌ Sign out error:', error);
                    set({
                        error: error.message,
                        isLoading: false
                    });
                    return false;
                }
            },

            // Mark onboarding as complete
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),

            // Initialize auth listener
            initializeAuthListener: () => {
                return onAuthStateChanged(auth, async (user) => {
                    try {
                        console.log('🔄 Auth state changed:', !!user);
                        
                        if (user) {
                            // User is signed in
                            console.log('👤 User signed in:', user.uid);
                            
                            // Fetch complete user profile
                            const userProfile = await get().fetchUserProfile(user.uid);

                            set({
                                user,
                                isAuthenticated: true,
                                isLoading: false,
                                isInitialized: true,
                                error: null
                            });
                        } else {
                            // User is signed out
                            console.log('🚪 User signed out');
                            
                            set({
                                user: null,
                                userProfile: null,
                                isAuthenticated: false,
                                hasCompletedOnboarding: false,
                                isLoading: false,
                                isInitialized: true,
                                error: null
                            });
                        }
                    } catch (error) {
                        console.error('❌ Error in auth state change:', error);
                        set({
                            user: null,
                            userProfile: null,
                            isAuthenticated: false,
                            hasCompletedOnboarding: false,
                            isLoading: false,
                            isInitialized: true,
                            error: 'Authentication error'
                        });
                    }
                });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                userProfile: state.userProfile,
                isAuthenticated: state.isAuthenticated,
                hasCompletedOnboarding: state.hasCompletedOnboarding,
                // Note: hasSeenOnboarding is handled separately in AsyncStorage
            }),
        }
    )
);

export default useAuthStore;