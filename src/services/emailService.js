const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

/**
 * Email Service using Nodemailer
 * Provides methods to send various types of emails
 */
class EmailService {
  constructor() {
    // Create reusable transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Send Email
   * @param {Object} options - Email options (to, subject, text, html)
   */
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send Welcome Email
   */
  sendWelcomeEmail(user) {
    const subject = `Welcome to ${process.env.APP_NAME}!`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Welcome ${user.firstName || 'User'}!</h1>
        <p>Thank you for joining ${process.env.APP_NAME}.</p>
        <p>We're excited to have you on board.</p>
        <p>Best regards,<br>${process.env.APP_NAME} Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  /**
   * Send Password Reset Email
   */
  sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const subject = 'Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Password Reset</h1>
        <p>Hi ${user.firstName || 'User'},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>${process.env.APP_NAME} Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }

  /**
   * Send Email Verification
   */
  sendVerificationEmail(user, verificationToken) {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const subject = 'Email Verification';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Verify Your Email</h1>
        <p>Hi ${user.firstName || 'User'},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>${process.env.APP_NAME} Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject,
      html,
    });
  }
}

module.exports = new EmailService();
