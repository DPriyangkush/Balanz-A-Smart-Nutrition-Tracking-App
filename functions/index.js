const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");
const {defineSecret} = require("firebase-functions/params");

// Define secrets
const EMAIL_FROM = defineSecret("EMAIL_FROM");
const EMAIL_KEY = defineSecret("EMAIL_KEY");

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// SEND OTP FUNCTION - Fixed with working logic + secrets
exports.sendOtpToEmail = onCall({
  region: "us-central1",
  secrets: [EMAIL_FROM, EMAIL_KEY], // Keep secrets
}, async (request) => {
  try {
    // Access secrets from the request context
    const emailFrom = EMAIL_FROM.value();
    const emailKey = EMAIL_KEY.value();

    console.log('🔧 Creating email transporter...');
    // Create transporter inside the function to access secrets
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailFrom,
        pass: emailKey,
      },
      pool: true,
      maxConnections: 1,
      maxMessages: 3,
      rateDelta: 20000,
      rateLimit: 3
    });

    const data = request.data;
    
    // Debug: Log everything we receive (using your working logic)
    console.log('🔍 Raw data received:', data);
    console.log('🔍 Data type:', typeof data);
    console.log('🔍 Data keys:', data ? Object.keys(data) : 'data is null/undefined');
    console.log('🔍 data.email value:', data?.email);
    console.log('🔍 data.email type:', typeof data?.email);
    
    const email = data?.email?.trim()?.toLowerCase();
    console.log('📧 Processed email:', email);
    console.log('📧 Email is truthy:', !!email);
    
    if (!email) {
      console.log('❌ Email validation failed - email is:', email);
      return { success: false, error: 'Email is required' };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return { success: false, error: 'Invalid email format' };
    }

    console.log('🔎 Searching for user with email:', email);
    
    // TEMPORARY: Skip user existence check for testing (your working logic)
    console.log('⚠️ TEMPORARILY SKIPPING USER CHECK FOR TESTING');
    
    console.log('✅ User found (skipped check), proceeding with OTP generation');

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes from now

    // Store OTP in Firestore
    await db.collection('otp_verification').doc(email).set({
      otp,
      expiresAt,
      verified: false,
      createdAt: new Date(),
    });

    console.log('💾 OTP stored in database');

    // Send OTP via email (using secrets)
    const mailOptions = {
      from: emailFrom, // Use secret value
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset OTP</h2>
          <p>Your OTP for password reset is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes only.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </div>
      `,
    };

    console.log('📤 Attempting to send email...');
    const emailResult = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully, MessageID:', emailResult.messageId);

    return { 
      success: true, 
      message: 'OTP sent successfully'
    };

  } catch (error) {
    console.error('❌ Error in sendOtpToEmail:', {
      message: error.message,
      code: error.code,
      stack: error.stack?.substring(0, 500)
    });
    
    return { 
      success: false, 
      error: error.message || 'Failed to send OTP'
    };
  }
});

// VERIFY OTP FUNCTION (unchanged)
exports.verifyOtp = onCall({
  region: "us-central1"
}, async (request) => {
  try {
    const { email, otp } = request.data;
    
    if (!email || !otp) {
      throw new HttpsError("invalid-argument", "Email and OTP are required.");
    }

    const docRef = db.collection("otp_verification").doc(email.toLowerCase());
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new HttpsError("not-found", "OTP not found or expired.");
    }

    const { otp: storedOtp, expiresAt, verified } = docSnap.data();

    if (verified) {
      throw new HttpsError("already-exists", "OTP already used.");
    }

    if (storedOtp !== otp) {
      throw new HttpsError("permission-denied", "Incorrect OTP.");
    }

    if (Date.now() > expiresAt) {
      await docRef.delete();
      throw new HttpsError("deadline-exceeded", "OTP expired.");
    }

    await docRef.update({ verified: true });

    return { success: true, message: "OTP verified successfully." };

  } catch (error) {
    console.error('Error in verifyOtp:', error);
    throw error;
  }
});

// RESET PASSWORD FUNCTION (unchanged)
exports.resetPassword = onCall({
  region: "us-central1"
}, async (request) => {
  try {
    const { email, newPassword } = request.data;
    
    if (!email || !newPassword) {
      throw new HttpsError("invalid-argument", "Email and new password are required.");
    }

    if (newPassword.length < 6) {
      throw new HttpsError("invalid-argument", "Password must be at least 6 characters long.");
    }

    const docRef = db.collection("otp_verification").doc(email.toLowerCase());
    const docSnap = await docRef.get();

    if (!docSnap.exists || !docSnap.data().verified) {
      throw new HttpsError("permission-denied", "OTP not verified. Please verify OTP first.");
    }

    // Update user password in Firebase Auth
    try {
      const {getAuth} = require("firebase-admin/auth");
      const auth = getAuth();
      const userRecord = await auth.getUserByEmail(email.toLowerCase());
      await auth.updateUser(userRecord.uid, { password: newPassword });
    } catch (authError) {
      console.error('Error updating password:', authError);
      throw new HttpsError("internal", "Failed to update password.");
    }

    // Clean up OTP document
    await docRef.delete();

    return { success: true, message: "Password reset successful." };

  } catch (error) {
    console.error('Error in resetPassword:', error);
    throw error;
  }
});

// DEBUG FUNCTION (unchanged)
exports.debugUsers = onCall({
  region: "us-central1"
}, async (request) => {
  try {
    console.log('🔍 Debug function called');
    
    const usersSnapshot = await db.collection('users').get();
    console.log('Total users:', usersSnapshot.size);
    
    const users = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        email: userData.email,
        fullName: userData.fullName
      });
    });
    
    console.log('Users found:', users);
    
    const testEmail = request.data.email?.trim().toLowerCase();
    let emailTestResult = null;
    
    if (testEmail) {
      console.log('Testing email lookup for:', testEmail);
      const testSnapshot = await db.collection('users').where('email', '==', testEmail).get();
      console.log('Email lookup result - Empty:', testSnapshot.empty, 'Size:', testSnapshot.size);
      
      emailTestResult = {
        email: testEmail,
        found: !testSnapshot.empty
      };
    }
    
    return { 
      success: true, 
      totalUsers: usersSnapshot.size,
      users: users.slice(0, 5),
      emailTest: emailTestResult
    };
    
  } catch (error) {
    console.error('Debug error:', error);
    return { success: false, error: error.message };
  }
});

// EMAIL TEST FUNCTION - Updated with secrets
exports.testEmail = onCall({
  region: "us-central1",
  secrets: [EMAIL_FROM, EMAIL_KEY]
}, async (request) => {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Access secrets properly
    const emailFrom = EMAIL_FROM.value();
    const emailKey = EMAIL_KEY.value();

    // Create transporter with secrets
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailFrom,
        pass: emailKey,
      },
    });
    
    const info = await transporter.sendMail({
      from: emailFrom,
      to: request.data.email || emailFrom,
      subject: 'Test Email from Firebase Function',
      html: '<p>If you receive this, your email configuration is working! 🎉</p>',
    });

    console.log('✅ Test email sent:', info.messageId);
    return { 
      success: true, 
      message: 'Test email sent successfully',
      messageId: info.messageId 
    };

  } catch (error) {
    console.error('❌ Email test failed:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code 
    };
  }
});