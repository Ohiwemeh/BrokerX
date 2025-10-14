# Email Setup Instructions

## Required Package

Install nodemailer in the server directory:

```bash
cd server
npm install nodemailer
```

## Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=BrokerX <noreply@brokerx.com>
```

## Gmail Setup (if using Gmail)

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Generate App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this as EMAIL_PASSWORD

## Alternative Email Services

### Resend (Recommended - Modern & Easy):
```env
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASSWORD=re_your-api-key
EMAIL_FROM=BrokerX <onboarding@resend.dev>
```

**Setup:**
1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Get API Key from dashboard
4. Use API key as EMAIL_PASSWORD
5. Verify your domain (or use resend.dev for testing)

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
