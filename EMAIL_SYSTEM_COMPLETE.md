# Email System - Complete Implementation ✅

## Summary

Complete email functionality for admin to send emails to users with professional HTML templates.

---

## Features Implemented

### ✅ Backend:
1. Email service with nodemailer
2. Professional HTML email templates
3. Email routes (admin only)
4. Auto-emails on verify/reject
5. Custom email sending
6. Email testing endpoint

### ✅ Frontend:
1. Email modal in admin panel
2. Email service API client
3. Loading states
4. Error handling
5. Success feedback

---

## Setup Instructions

### 1. Install Nodemailer

```bash
cd server
npm install nodemailer
```

### 2. Configure Environment Variables

Add to `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=BrokerX <noreply@brokerx.com>
CLIENT_URL=http://localhost:5173
```

### 3. Gmail Setup (Recommended)

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable **2-Factor Authentication**
3. Go to **Security** → **App passwords**
4. Select "Mail" and your device
5. Copy the 16-character password
6. Use this as `EMAIL_PASSWORD` in `.env`

---

## Email Templates

### 1. Verification Email ✅
**Sent when:** Admin verifies user account

**Features:**
- Congratulations message
- List of unlocked features
- Call-to-action button
- Professional gradient header

**Preview:**
```
🎉 Account Verified!

Hello John Doe,

Congratulations! Your BrokerX account has been successfully verified.

You now have full access to all features including:
✅ Make deposits and withdrawals
✅ Trade cryptocurrencies and forex
✅ Access premium features
✅ View real-time market data

[Go to Dashboard]
```

---

### 2. Rejection Email ❌
**Sent when:** Admin rejects user account

**Features:**
- Polite rejection message
- Clear reason display
- Action steps
- Support contact info

**Preview:**
```
Account Verification Update

Hello John Doe,

We regret to inform you that your account verification was not successful.

Reason: Documents are not clear enough

What you can do:
• Review and update your submitted documents
• Ensure all information is clear and valid
• Contact our support team for assistance

[Update Profile]
```

---

### 3. Custom Email 📧
**Sent when:** Admin sends custom message

**Features:**
- Custom subject
- Custom message
- Professional formatting
- BrokerX branding

**Preview:**
```
Message from BrokerX

Hello John Doe,

[Your custom message here]

If you have any questions, please contact our support team.

Best regards,
The BrokerX Team
```

---

### 4. Deposit Approved Email 💰
**Sent when:** Admin approves deposit

**Features:**
- Large amount display
- Success message
- Link to wallet
- Green gradient theme

**Preview:**
```
✅ Deposit Approved!

Hello John Doe,

Great news! Your deposit has been approved and added to your account.

$5,000

Your funds are now available for trading.

[View Wallet]
```

---

## API Endpoints

### POST /api/email/send
Send custom email to user (admin only)

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "subject": "Important Update",
  "message": "Your message here..."
}
```

**Response:**
```json
{
  "message": "Email sent successfully",
  "sentTo": "user@example.com"
}
```

---

### POST /api/email/send-verification
Send verification email (admin only)

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

---

### POST /api/email/send-rejection
Send rejection email (admin only)

**Request:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "reason": "Documents not clear"
}
```

---

### POST /api/email/test
Test email configuration (admin only)

**Response:**
```json
{
  "message": "Test email sent successfully",
  "sentTo": "admin@example.com"
}
```

---

## Usage in Admin Panel

### 1. Send Custom Email

1. Go to Admin Panel
2. Select a user
3. Click **"Send Email"** button
4. Fill in:
   - Subject
   - Message
5. Click **"Send Email"**
6. Email sent with professional template!

### 2. Auto-Emails

**Verification:**
- Admin clicks "Verify" button
- User receives verification email automatically
- Notification also sent

**Rejection:**
- Admin clicks "Reject" button
- Modal asks for reason
- User receives rejection email with reason
- Notification also sent

---

## Email Service Methods

### Backend (EmailService):

```javascript
// Send custom email
await EmailService.sendCustomEmail(user, subject, message);

// Send verification email
await EmailService.sendVerificationEmail(user);

// Send rejection email
await EmailService.sendRejectionEmail(user, reason);

// Send deposit approved email
await EmailService.sendDepositApprovedEmail(user, amount);

// Send raw email
await EmailService.sendEmail(to, subject, htmlContent, textContent);
```

### Frontend (emailService):

```javascript
// Send custom email
await emailService.sendEmail(userId, subject, message);

// Send verification email
await emailService.sendVerificationEmail(userId);

// Send rejection email
await emailService.sendRejectionEmail(userId, reason);

// Test email configuration
await emailService.testEmail();
```

---

## Email Modal Features

### UI Elements:
- **Recipient display**: Shows user's email
- **Subject input**: Required field
- **Message textarea**: 6 rows, required
- **Send button**: With loading state
- **Error handling**: Shows error messages
- **Success feedback**: Alert on success

### Loading States:
- Button disabled while sending
- Text changes to "Sending..."
- Re-enables on error

### Validation:
- Subject required
- Message required
- User email displayed

---

## Alternative Email Services

### SendGrid:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

### Mailgun:
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

### Outlook/Office365:
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### AWS SES:
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your-ses-username
EMAIL_PASSWORD=your-ses-password
```

---

## Testing

### 1. Test Email Configuration

```bash
# Using curl
curl -X POST http://localhost:5000/api/email/test \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 2. Test Custom Email

```bash
curl -X POST http://localhost:5000/api/email/send \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "subject": "Test Email",
    "message": "This is a test message"
  }'
```

### 3. Test in Admin Panel

1. Login as admin
2. Select any user
3. Click "Send Email"
4. Fill form and send
5. Check user's email inbox

---

## Troubleshooting

### Email Not Sending:

**Check:**
1. EMAIL_USER and EMAIL_PASSWORD in .env
2. Gmail: Use App Password, not regular password
3. 2FA enabled for Gmail
4. Correct SMTP host and port
5. Network allows SMTP connections

### Gmail Errors:

**"Invalid credentials":**
- Use App Password, not account password
- Enable 2-Factor Authentication first

**"Less secure app access":**
- Use App Password instead
- Don't use "Less secure apps" option

### Email Goes to Spam:

**Solutions:**
1. Add SPF record to domain
2. Add DKIM signature
3. Use professional email service
4. Avoid spam trigger words
5. Include unsubscribe link

---

## Security

### Best Practices:
- ✅ Never commit .env file
- ✅ Use App Passwords, not account passwords
- ✅ Admin-only access to email routes
- ✅ Rate limiting (recommended)
- ✅ Input validation
- ✅ HTML sanitization

### Rate Limiting (Optional):

```javascript
const rateLimit = require('express-rate-limit');

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});

router.post('/send', emailLimiter, async (req, res) => {
  // ...
});
```

---

## Files Created

### Backend:
1. ✅ `server/services/emailService.js` - Email service
2. ✅ `server/routes/email.routes.js` - Email routes
3. ✅ `EMAIL_SETUP_INSTRUCTIONS.md` - Setup guide

### Frontend:
1. ✅ Updated `client/src/api/services.js` - Email API client
2. ✅ Updated `client/src/admin/AdminPage.jsx` - Email modal

### Backend Modified:
1. ✅ `server/index.js` - Added email routes
2. ✅ `server/routes/admin.routes.js` - Auto-send emails on verify/reject

---

## Status: ✅ COMPLETE

**Features Working:**
- ✅ Send custom emails from admin panel
- ✅ Professional HTML templates
- ✅ Auto-emails on verify/reject
- ✅ Email testing endpoint
- ✅ Loading states
- ✅ Error handling
- ✅ Multiple email service support

**Ready to use!** 📧

---

## Quick Start

1. **Install nodemailer:**
   ```bash
   cd server
   npm install nodemailer
   ```

2. **Configure .env:**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=BrokerX <noreply@brokerx.com>
   ```

3. **Restart server:**
   ```bash
   npm run dev
   ```

4. **Test in admin panel:**
   - Login as admin
   - Select user
   - Click "Send Email"
   - Send test email!

**All working!** 🎉
