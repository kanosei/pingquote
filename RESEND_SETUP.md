# Resend Email Setup Guide

Super simple guide to get email sending working with Resend.

## Step 1: Get Your Resend API Key (2 minutes)

1. Go to [resend.com](https://resend.com) and sign up (it's free!)
2. Once logged in, go to **API Keys** in the dashboard
3. Click **Create API Key**
4. Give it a name like "PingQuote Dev"
5. Copy the API key (starts with `re_`)

## Step 2: Add API Key to Your .env File

Open your `.env` file and replace the placeholder:

```bash
RESEND_API_KEY="re_your_actual_api_key_here"
```

That's it for development! The app will work immediately.

## Step 3: Test Your Email (1 minute)

1. Start your dev server: `npm run dev`
2. Create a quote with an email address
3. Click the "Send" button
4. Check your inbox!

## The Free Email Address

By default, emails will send from `onboarding@resend.dev` which is provided by Resend for testing.

**Important:** This test email only delivers to:
- The email you signed up with on Resend
- Any email you verify in Resend dashboard

This is perfect for testing! Once you're ready for production, follow the next steps.

## Production Setup (Optional - For Real Clients)

### Add Your Own Domain (Recommended for production)

1. Go to Resend dashboard → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `pingquote.com`)
4. Add the DNS records they provide to your domain registrar
5. Wait for verification (usually a few minutes)
6. Update your `.env`:
   ```bash
   RESEND_FROM_EMAIL="quotes@yourdomain.com"
   ```

Now emails will come from your domain and look professional!

## Environment Variables Reference

```bash
# Required
RESEND_API_KEY="re_xxxx"              # Get from resend.com

# Optional (defaults to onboarding@resend.dev)
RESEND_FROM_EMAIL="quotes@yourdomain.com"

# Required for production
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"  # Your production URL
```

## What Gets Sent?

The email includes:
- Client name
- Quote total (formatted with currency)
- Number of items
- Direct link to view the full quote
- Reply-to set to your email

The email template is beautiful, responsive, and works on all devices!

## Pricing

- **Free tier:** 100 emails/day, 3,000/month
- **Paid plans:** Start at $20/month for 50,000 emails

For a quote system, the free tier is usually more than enough!

## Troubleshooting

### "Failed to send email. Please check your Resend API key."
- Make sure `RESEND_API_KEY` in `.env` is correct
- Make sure it starts with `re_`
- Restart your dev server after changing `.env`

### Email not arriving?
- Check spam folder
- With `onboarding@resend.dev`, emails only go to verified addresses
- Check Resend dashboard → Emails to see delivery status

### Want to test with different email addresses?
- Add a custom domain (see Production Setup above)
- Or verify additional email addresses in Resend dashboard

## Customizing the Email Template

The email template is in: `lib/email-templates.ts`

You can easily customize:
- Colors (change `#667eea` to your brand color)
- Text and wording
- Add your logo
- Add more details about the quote

## Support

- Resend Docs: https://resend.com/docs
- Resend API Reference: https://resend.com/docs/api-reference/emails/send-email
