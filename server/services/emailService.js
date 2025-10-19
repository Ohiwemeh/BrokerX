// server/services/emailService.js

const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

class EmailService {
  
  // Send email to user
  static async sendEmail(to, subject, htmlContent, textContent) {
    try {
      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'pinnacletradefx <noreply@pinnacletradefx.com>',
        to: to,
        subject: subject,
        text: textContent,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  // Send verification email
  static async sendVerificationEmail(user) {
    const subject = 'Account Verified - pinnacletradefx';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Account Verified!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>Congratulations! Your pinnacletradefx account has been successfully verified.</p>
            <p>You now have full access to all features including:</p>
            <ul>
              <li>✅ Make deposits and withdrawals</li>
              <li>✅ Trade cryptocurrencies and forex</li>
              <li>✅ Access premium features</li>
              <li>✅ View real-time market data</li>
            </ul>
            <p>Get started by funding your account and exploring the markets!</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" class="button">Go to Dashboard</a>
            <p>If you have any questions, feel free to contact our support team.</p>
            <p>Best regards,<br>The pinnacletradefx Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} pinnacletradefx. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const textContent = `Hello ${user.name},\n\nCongratulations! Your pinnacletradefx account has been successfully verified.\n\nYou now have full access to all features.\n\nBest regards,\nThe BrokerX Team`;

    return this.sendEmail(user.email, subject, htmlContent, textContent);
  }

  // Send rejection email
  static async sendRejectionEmail(user, reason) {
    const subject = 'Account Verification Update - pinnacletradefx';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Verification Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>We regret to inform you that your account verification was not successful.</p>
            <div class="warning">
              <strong>Reason:</strong> ${reason || 'Please contact support for more information.'}
            </div>
            <p>What you can do:</p>
            <ul>
              <li>Review and update your submitted documents</li>
              <li>Ensure all information is clear and valid</li>
              <li>Contact our support team for assistance</li>
            </ul>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/settings" class="button">Update Profile</a>
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The pinnacletradefx Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} pinnacletradefx. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const textContent = `Hello ${user.name},\n\nWe regret to inform you that your account verification was not successful.\n\nReason: ${reason || 'Please contact support for more information.'}\n\nPlease update your profile and resubmit your documents.\n\nBest regards,\nThe BrokerX Team`;

    return this.sendEmail(user.email, subject, htmlContent, textContent);
  }

  // Send custom email from admin
  static async sendCustomEmail(user, subject, message) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .message { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; white-space: pre-wrap; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Message from pinnacletradefx</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <div class="message">${message}</div>
            <p>If you have any questions, please contact our support team.</p>
            <p>Best regards,<br>The pinnacletradefx Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} pinnacletradefx. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const textContent = `Hello ${user.name},\n\n${message}\n\nBest regards,\nThe pinnacletradefx Team`;

    return this.sendEmail(user.email, subject, htmlContent, textContent);
  }

  // Send deposit approved email
  static async sendDepositApprovedEmail(user, amount) {
    const subject = 'Deposit Approved - pinnacletradefx';
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .amount { font-size: 36px; font-weight: bold; color: #11998e; text-align: center; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #11998e; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Deposit Approved!</h1>
          </div>
          <div class="content">
            <h2>Hello ${user.name},</h2>
            <p>Great news! Your deposit has been approved and added to your account.</p>
            <div class="amount">$${amount.toLocaleString()}</div>
            <p>Your funds are now available for trading.</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/wallet" class="button">View Wallet</a>
            <p>Happy trading!</p>
            <p>Best regards,<br>The pinnacletradefx Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} pinnacletradefx. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const textContent = `Hello ${user.name},\n\nYour deposit of $${amount.toLocaleString()} has been approved and added to your account.\n\nBest regards,\nThe pinnacletradefx Team`;

    return this.sendEmail(user.email, subject, htmlContent, textContent);
  }
}

module.exports = EmailService;
