// server/services/notificationService.js

const Notification = require('../models/notification.model');
const User = require('../models/user.model');

class NotificationService {
  
  // Create notification
  static async createNotification(recipientId, type, title, message, data = {}, link = null, priority = 'medium') {
    try {
      const notification = new Notification({
        recipient: recipientId,
        type,
        title,
        message,
        data,
        link,
        priority
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Notify all admins
  static async notifyAdmins(type, title, message, data = {}, link = null, priority = 'medium') {
    try {
      const admins = await User.find({ role: 'admin' });
      
      const notifications = admins.map(admin => ({
        recipient: admin._id,
        type,
        title,
        message,
        data,
        link,
        priority
      }));

      await Notification.insertMany(notifications);
      return notifications;
    } catch (error) {
      console.error('Error notifying admins:', error);
      throw error;
    }
  }

  // User registered - notify admins
  static async notifyUserRegistered(user) {
    return this.notifyAdmins(
      'USER_REGISTERED',
      'New User Registration',
      `${user.name} (${user.email}) has registered and is awaiting verification.`,
      { userId: user._id, userName: user.name, userEmail: user.email },
      '/admin',
      'high'
    );
  }

  // User verified - notify user
  static async notifyUserVerified(user) {
    return this.createNotification(
      user._id,
      'USER_VERIFIED',
      'Account Verified! 🎉',
      'Congratulations! Your account has been verified. You now have full access to all features.',
      {},
      '/dashboard',
      'high'
    );
  }

  // User rejected - notify user
  static async notifyUserRejected(user, reason = 'Please contact support for more information.') {
    return this.createNotification(
      user._id,
      'USER_REJECTED',
      'Verification Rejected',
      `Your account verification was rejected. Reason: ${reason}`,
      { reason },
      '/settings',
      'high'
    );
  }

  // Deposit request - notify admins
  static async notifyDepositRequest(user, amount, transactionId) {
    return this.notifyAdmins(
      'DEPOSIT_REQUEST',
      'New Deposit Request',
      `${user.name} has requested a deposit of $${amount.toLocaleString()}.`,
      { userId: user._id, userName: user.name, amount, transactionId },
      '/admin',
      'high'
    );
  }

  // Deposit approved - notify user
  static async notifyDepositApproved(user, amount) {
    return this.createNotification(
      user._id,
      'DEPOSIT_APPROVED',
      'Deposit Approved ✅',
      `Your deposit of $${amount.toLocaleString()} has been approved and added to your account.`,
      { amount },
      '/wallet',
      'high'
    );
  }

  // Deposit rejected - notify user
  static async notifyDepositRejected(user, amount, reason = 'Please contact support for more information.') {
    return this.createNotification(
      user._id,
      'DEPOSIT_REJECTED',
      'Deposit Rejected',
      `Your deposit of $${amount.toLocaleString()} was rejected. Reason: ${reason}`,
      { amount, reason },
      '/wallet',
      'high'
    );
  }

  // Settings changed - notify admins
  static async notifySettingsChanged(user, changes) {
    return this.notifyAdmins(
      'SETTINGS_CHANGED',
      'User Settings Updated',
      `${user.name} has updated their account settings.`,
      { userId: user._id, userName: user.name, changes },
      '/admin',
      'low'
    );
  }

  // Profile updated - notify admins
  static async notifyProfileUpdated(user) {
    return this.notifyAdmins(
      'PROFILE_UPDATED',
      'User Profile Updated',
      `${user.name} has updated their profile information.`,
      { userId: user._id, userName: user.name },
      '/admin',
      'low'
    );
  }

  // Withdrawal request - notify admins
  static async notifyWithdrawalRequest(user, amount, transactionId) {
    return this.notifyAdmins(
      'WITHDRAWAL_REQUEST',
      'New Withdrawal Request',
      `${user.name} has requested a withdrawal of $${amount.toLocaleString()}.`,
      { userId: user._id, userName: user.name, amount, transactionId },
      '/admin',
      'high'
    );
  }

  // Withdrawal approved - notify user
  static async notifyWithdrawalApproved(user, amount, transactionId) {
    return this.createNotification(
      user._id,
      'WITHDRAWAL_APPROVED',
      'Withdrawal Approved ✅',
      `Your withdrawal of $${amount.toLocaleString()} has been approved and is being processed.`,
      { amount, transactionId },
      '/transactions',
      'high'
    );
  }

  // Transaction rejected - notify user
  static async notifyTransactionRejected(user, type, amount, transactionId) {
    return this.createNotification(
      user._id,
      'TRANSACTION_REJECTED',
      `${type} Rejected ❌`,
      `Your ${type.toLowerCase()} request of $${amount.toLocaleString()} has been rejected. Please contact support for more information.`,
      { type, amount, transactionId },
      '/transactions',
      'high'
    );
  }

  // Admin message - notify user
  static async notifyAdminMessage(user, title, message) {
    return this.createNotification(
      user._id,
      'ADMIN_MESSAGE',
      title,
      message,
      {},
      '/dashboard',
      'medium'
    );
  }
}

module.exports = NotificationService;
