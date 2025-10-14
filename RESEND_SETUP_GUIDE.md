# Resend Email Setup Guide 📧

## Why Resend?

✅ **Modern & Developer-Friendly**
✅ **Generous Free Tier** (100 emails/day, 3,000/month)
✅ **Easy Setup** (5 minutes)
✅ **Great Deliverability**
✅ **Beautiful Dashboard**
✅ **No Credit Card Required** (for free tier)

---

## Quick Setup (5 Steps)

### 1. Sign Up

Go to: https://resend.com/signup

- Sign up with email
- Verify your email
- Free tier activated automatically

---

### 2. Get API Key

1. Go to **API Keys** in dashboard
2. Click **"Create API Key"**
3. Name it: `BrokerX Production`
4. Copy the API key (starts with `re_`)
5. **Save it securely** (you won't see it again)

---

### 3. Configure .env

Add to your `.env` file:

```env
# Resend Email Configuration
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASSWORD=re_your_api_key_here
EMAIL_FROM=BrokerX <onboarding@resend.dev>
```

**Important:**
- Replace `re_your_api_key_here` with your actual API key
- For testing, use `onboarding@resend.dev` as sender
- For production, verify your own domain

---

### 4. Test Email

Restart your server and test:

```bash
# Restart server
cd server
npm run dev
```

Then in admin panel:
1. Login as admin
2. Click "Send Email" to any user
3. Check if email arrives!

---

### 5. Verify Your Domain (Production)

For production, verify your domain to send from your own email:

1. Go to **Domains** in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `brokerx.com`)
4. Add DNS records to your domain:
   - SPF record
   - DKIM record
   - DMARC record (optional)
5. Wait for verification (usually 5-10 minutes)
6. Update EMAIL_FROM in .env:
   ```env
   EMAIL_FROM=BrokerX <noreply@yourdomain.com>
   ```

---

## Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| Emails per day | 100 |
| Emails per month | 3,000 |
| API requests | Unlimited |
| Team members | 1 |
| Domains | 1 |
| Price | $0/month |

**Perfect for:**
- Development
- Testing
- Small projects
- MVP launches

---

## Example .env Configuration

### Development (Using resend.dev):
```env
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASSWORD=re_AbCdEfGhIjKlMnOpQrStUvWxYz123456
EMAIL_FROM=BrokerX <onboarding@resend.dev>
CLIENT_URL=http://localhost:5173
```

### Production (Using your domain):
```env
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASSWORD=re_AbCdEfGhIjKlMnOpQrStUvWxYz123456
EMAIL_FROM=BrokerX <noreply@brokerx.com>
CLIENT_URL=https://brokerx.com
```

---

## Testing

### 1. Test in Admin Panel

1. Login as admin
2. Select any user
3. Click "Send Email"
4. Fill subject and message
5. Click "Send Email"
6. Check user's inbox

### 2. Test Verification Email

1. Select a user with "Pending" status
2. Click "Verify" button
3. User receives verification email automatically

### 3. Test Rejection Email

1. Select a user
2. Click "Reject" button
3. Enter rejection reason
4. User receives rejection email

---

## Resend Dashboard Features

### Email Logs:
- See all sent emails
- Delivery status
- Open rates
- Click rates
- Bounce/spam reports

### Analytics:
- Daily email volume
- Delivery rates
- Error tracking
- Performance metrics

### Webhooks (Optional):
- Email delivered
- Email opened
- Email clicked
- Email bounced
- Email complained

---

## Troubleshooting

### "Invalid API Key"
- Check API key in .env
- Ensure it starts with `re_`
- No spaces or quotes around key
- Restart server after changing .env

### "Domain not verified"
- Use `onboarding@resend.dev` for testing
- Verify your domain for production
- Check DNS records are correct

### Emails not arriving
- Check spam folder
- Verify recipient email is correct
- Check Resend dashboard for delivery status
- Ensure you haven't hit rate limits

### Rate limit exceeded
- Free tier: 100/day, 3,000/month
- Upgrade to paid plan if needed
- Implement email queuing for high volume

---

## Upgrade Plans (Optional)

### Pro Plan - $20/month:
- 50,000 emails/month
- 10 team members
- 10 domains
- Priority support

### Business Plan - Custom:
- Unlimited emails
- Unlimited team members
- Unlimited domains
- Dedicated support
- Custom SLA

---

## Advantages Over Gmail

| Feature | Resend | Gmail |
|---------|--------|-------|
| Setup | 5 minutes | 15 minutes |
| API Key | Simple | App Password |
| 2FA Required | No | Yes |
| Rate Limits | 100/day free | 500/day |
| Deliverability | Excellent | Good |
| Dashboard | Yes | No |
| Analytics | Yes | No |
| Webhooks | Yes | No |

---

## Code Examples

### Send Test Email (Node.js):

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp.resend.com',
  port: 587,
  secure: false,
  auth: {
    user: 'resend',
    pass: process.env.EMAIL_PASSWORD, // Your Resend API key
  },
});

await transporter.sendMail({
  from: 'BrokerX <onboarding@resend.dev>',
  to: 'user@example.com',
  subject: 'Test Email',
  html: '<h1>Hello from Resend!</h1>',
});
```

---

## Best Practices

### 1. Security:
- Never commit API key to git
- Use .env for configuration
- Rotate keys periodically
- Use different keys for dev/prod

### 2. Deliverability:
- Verify your domain
- Add SPF/DKIM records
- Avoid spam trigger words
- Include unsubscribe link
- Monitor bounce rates

### 3. Performance:
- Implement email queuing
- Handle failures gracefully
- Retry failed emails
- Monitor rate limits

### 4. Testing:
- Test in development first
- Use test email addresses
- Check spam folder
- Verify HTML rendering

---

## Support

### Resend Support:
- Docs: https://resend.com/docs
- Email: support@resend.com
- Discord: https://resend.com/discord
- Status: https://status.resend.com

### BrokerX Email Issues:
- Check server logs
- Verify .env configuration
- Test with curl/Postman
- Check Resend dashboard

---

## Quick Start Checklist

- [ ] Sign up at resend.com
- [ ] Get API key from dashboard
- [ ] Add to .env file
- [ ] Restart server
- [ ] Test email in admin panel
- [ ] Verify email arrives
- [ ] (Optional) Verify domain for production

**That's it! You're ready to send emails!** 📧✅

---

## Status: ✅ READY TO USE

Your email system is now configured with Resend and ready to send professional emails!
