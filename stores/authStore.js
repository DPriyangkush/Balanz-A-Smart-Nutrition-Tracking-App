// stores/authStore.js - Final fix with synchronous profile loading
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
            isLoading: false,
            isInitialized: false,
            hasCompletedOnboarding: false,
            isProfileLoaded: false, // New flag to track profile loading completion
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

                console.log('📄 Setting user profile:', {
                    hasProfile: !!profile,
                    hasPersonalInfo: !!(profile?.personalInfo),
                    hasFitnessGoal: !!(profile?.fitnessGoal),
                    hasDietPreference: !!(profile?.dietPreference),
                    hasOnboardingData
                });

                set({
                    userProfile: profile,
                    hasCompletedOnboarding: hasOnboardingData,
                    isProfileLoaded: true // Mark profile as loaded regardless of content
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

            // Helper to fetch and evaluate complete user profile
            fetchUserProfile: async (userId) => {
                try {
                    console.log('🔄 Fetching user profile for:', userId);
                    
                    // Reset profile loading state
                    set({ isProfileLoaded: false });
                    
                    const userDoc = await getDoc(doc(db, 'users', userId));
                    
                    if (userDoc.exists()) {
                        const profileData = userDoc.data();
                        console.log('📄 Profile data retrieved:', {
                            hasPersonalInfo: !!(profileData?.personalInfo),
                            hasFitnessGoal: !!(profileData?.fitnessGoal),
                            hasDietPreference: !!(profileData?.dietPreference),
                            keys: Object.keys(profileData || {})
                        });
                        
                        // Set the profile which will automatically determine onboarding status
                        get().setUserProfile(profileData);
                        return profileData;
                    } else {
                        console.log('📄 No profile document found');
                        get().setUserProfile(null);
                        return null;
                    }
                } catch (error) {
                    console.error('❌ Error fetching user profile:', error);
                    get().setUserProfile(null);
                    return null;
                }
            },

            // Auth methods
            signUp: async () => {
                const { form, validateForm, setLoading, setError } = get();

                if (!validateForm(true)) return { success: false };

                console.log('🔐 Starting sign up...');
                
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
                        // Intentionally NOT including personalInfo, fitnessGoal, dietPreference
                    };

                    await setDoc(doc(db, 'users', user.uid), basicProfile);

                    // Clear form immediately
                    get().clearForm();

                    console.log('✅ Sign up successful - new user needs onboarding');
                    
                    return {
                        success: true,
                        user,
                        userId: user.uid,
                        needsOnboarding: true
                    };
                } catch (error) {
                    console.error('❌ Sign up failed:', error);
                    setError(error.message);
                    return { success: false, error: error.message };
                }
            },

            signIn: async () => {
                const { form, validateForm, setError } = get();

                if (!validateForm(false)) return { success: false };

                console.log('🔐 Starting sign in...');
                
                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        form.email,
                        form.password
                    );
                    const user = userCredential.user;

                    // Clear form immediately
                    get().clearForm();

                    console.log('✅ Sign in successful - profile will be loaded by auth listener');

                    return {
                        success: true,
                        user
                    };
                } catch (error) {
                    console.error('❌ Sign in failed:', error);
                    setError(error.message);
                    return { success: false, error: error.message };
                }
            },

            signOut: async () => {
                try {
                    console.log('🚪 Signing out...');
                    set({ error: null });

                    await firebaseSignOut(auth);

                    console.log('✅ Sign out successful');
                    return true;
                } catch (error) {
                    console.error('❌ Sign out error:', error);
                    set({ error: error.message });
                    return false;
                }
            },

            // Mark onboarding as complete
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),

            // Initialize auth listener with synchronous profile loading
            initializeAuthListener: () => {
                return onAuthStateChanged(auth, async (user) => {
                    try {
                        console.log('🔄 Auth state changed:', !!user);
                        
                        if (user) {
                            // User is signed in
                            console.log('👤 User signed in:', user.uid);
                            
                            // CRITICAL: Don't set isInitialized true until profile is loaded
                            set({
                                user,
                                isAuthenticated: true,
                                isInitialized: false, // Keep false until profile loads
                                isProfileLoaded: false,
                                error: null
                            });

                            // Fetch profile synchronously before marking as initialized
                            console.log('📄 Loading profile before completing auth initialization...');
                            await get().fetchUserProfile(user.uid);
                            
                            // NOW mark as initialized after profile is loaded
                            const currentState = get();
                            console.log('✅ Auth setup complete:', {
                                hasProfile: !!currentState.userProfile,
                                hasCompletedOnboarding: currentState.hasCompletedOnboarding,
                                isProfileLoaded: currentState.isProfileLoaded
                            });

                            // Mark as initialized only after profile check is complete
                            set({ isInitialized: true });

                        } else {
                            // User is signed out
                            console.log('🚪 User signed out - clearing state');
                            
                            set({
                                user: null,
                                userProfile: null,
                                isAuthenticated: false,
                                hasCompletedOnboarding: false,
                                isLoading: false,
                                isInitialized: true,
                                isProfileLoaded: false,
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
                            isProfileLoaded: false,
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
                // Don't persist hasCompletedOnboarding or isProfileLoaded - always check fresh
                user: state.user,
                userProfile: state.userProfile,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;