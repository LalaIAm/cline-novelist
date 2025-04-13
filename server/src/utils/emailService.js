const nodemailer = require('nodemailer');

/**
 * Email service for sending verification emails, password resets, and MFA codes
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send email verification link
   * @param {string} to Recipient email
   * @param {string} token Verification token
   * @param {string} username User's username
   */
  async sendVerificationEmail(to, token, username) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const message = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Novylist, ${username}!</h2>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #4F46E5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">Verify Email</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p>${verificationUrl}</p>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't sign up for Novylist, you can safely ignore this email.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(message);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send password reset link
   * @param {string} to Recipient email
   * @param {string} token Reset token
   * @param {string} username User's username
   */
  async sendPasswordResetEmail(to, token, username) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const message = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello, ${username}</h2>
          <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
          <p>Please click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p>${resetUrl}</p>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(message);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send MFA verification code
   * @param {string} to Recipient email
   * @param {string} code MFA code
   * @param {string} username User's username
   */
  async sendMfaCode(to, code, username) {
    const message = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello, ${username}</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f0f0f0; text-align: center; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please secure your account immediately by changing your password.</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(message);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
module.exports = new EmailService();
