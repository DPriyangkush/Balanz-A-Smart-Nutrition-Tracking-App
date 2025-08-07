import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { firebaseApp } from './firebaseConfig'; // Adjust path as needed

// Initialize functions with error handling
let functions;
try {
  console.log('🔧 Initializing Firebase Functions...');
  console.log('🔧 Firebase app:', firebaseApp);
  
  // Initialize with us-central1 region to match server
  functions = getFunctions(firebaseApp, 'us-central1');
  
  console.log('✅ Functions initialized:', functions);
  console.log('✅ Functions region:', functions._delegate?.region || 'us-central1');
  
  // If you're using Firebase emulator for local development, uncomment:
  // if (__DEV__ && !functions._delegate._url) {
  //   connectFunctionsEmulator(functions, 'localhost', 5001);
  // }
  
} catch (error) {
  console.error('❌ Failed to initialize Firebase Functions:', error);
}

/**
 * Send OTP to user email using Cloud Function
 * @param {string} email - The user's email address
 * @returns {Promise<Object>} - Result object from Firebase function
 */
export const sendOtpToEmail = async (email) => {
  try {
    // Check if functions is initialized
    if (!functions) {
      throw new Error('Firebase Functions not initialized. Check your Firebase configuration.');
    }

    // Debug: Log what we're sending
    console.log('📤 Client: About to call function with email:', email);
    console.log('📤 Client: Email type:', typeof email);
    console.log('📤 Client: Email length:', email?.length);
    console.log('📤 Client: Functions object:', functions);
    
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }

    const trimmedEmail = email.trim().toLowerCase();
    console.log('📤 Client: Processed email:', trimmedEmail);

    // Create the payload
    const payload = { email: trimmedEmail };
    console.log('📤 Client: Payload being sent:', JSON.stringify(payload));

    console.log('📤 Calling sendOtpToEmail function...');
    
    // Create callable function - Using the deployed function name
    const callable = httpsCallable(functions, 'sendOtpToEmail');
    console.log('📤 Callable created:', callable);
    
    const response = await callable(payload);
    
    console.log('✅ Function response received:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Error in sendOtpToEmail:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    // Handle different types of errors
    if (error.code === 'functions/internal') {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'functions/permission-denied') {
      throw new Error('Permission denied. Please check your credentials.');
    } else if (error.code === 'functions/not-found') {
      throw new Error('Function not found. Please check deployment.');
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Failed to send OTP. Please try again.');
    }
  }
};

/**
 * Debug function to test Firebase Functions connection
 */
export const testConnection = async () => {
  try {
    console.log('🧪 Testing Firebase Functions connection...');
    console.log('🧪 Functions object:', functions);
    
    if (!functions) {
      throw new Error('Functions not initialized');
    }
    
    // Try to call a simple function
    const callable = httpsCallable(functions, 'debugUsers');
    const response = await callable({});
    
    console.log('🧪 Connection test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('🧪 Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test email functionality
 */
export const testEmail = async (email) => {
  try {
    if (!functions) {
      throw new Error('Firebase Functions not initialized');
    }
    
    // NOTE: Using the deployed function name
    const callable = httpsCallable(functions, 'testEmail');
    const response = await callable({ email });
    
    console.log('🧪 Email test successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('🧪 Email test failed:', error);
    throw new Error(error.message || 'Email test failed');
  }
};

/**
 * Verify user-entered OTP using Cloud Function
 */
export const verifyOtp = async (email, otp) => {
  try {
    if (!functions) {
      throw new Error('Firebase Functions not initialized');
    }
    
    if (!email || !otp) {
      throw new Error('Email and OTP are required');
    }

    const callable = httpsCallable(functions, 'verifyOtp');
    const response = await callable({ 
      email: email.trim().toLowerCase(), 
      otp: otp.trim() 
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    throw new Error(error.message || 'OTP verification failed');
  }
};

/**
 * Reset user password after successful OTP verification
 */
export const resetPassword = async (email, newPassword) => {
  try {
    if (!functions) {
      throw new Error('Firebase Functions not initialized');
    }
    
    if (!email || !newPassword) {
      throw new Error('Email and new password are required');
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const callable = httpsCallable(functions, 'resetPassword');
    const response = await callable({ 
      email: email.trim().toLowerCase(), 
      newPassword 
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in resetPassword:', error);
    throw new Error(error.message || 'Password reset failed');
  }
};