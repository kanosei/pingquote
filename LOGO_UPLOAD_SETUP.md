# Company Logo Upload Setup

This guide will help you set up the company logo upload feature using UploadThing.

## Features

- Upload and display company logos
- Company name customization
- Logo appears on:
  - Quote pages
  - OpenGraph/social media previews
  - Email notifications

## Setup Instructions

### 1. Get an UploadThing Account

1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign up for a free account
3. Create a new app
4. Copy your token from the dashboard

### 2. Add Environment Variable

Add the following to your `.env` file:

```bash
UPLOADTHING_TOKEN="your-uploadthing-token-here"
```

### 3. Database Migration

The migration has already been applied. It adds:
- `companyName` - Your company/business name
- `logoUrl` - URL to your uploaded logo

### 4. Using the Feature

1. **Access Settings**: Click the settings icon (⚙️) in the dashboard header
2. **Upload Logo**:
   - Click the upload button in the Company Information section
   - Select an image (PNG or JPG, max 4MB)
   - Wait for upload to complete
   - Click "Save Changes"
3. **Add Company Name**: Enter your company name in the form

### 5. How It Works

Once you upload a logo and save:

- **Quote Pages** (`/q/[id]`): Your logo appears at the top of the quote instead of the default PingQuote logo
- **OpenGraph Images**: When sharing quotes on social media, your logo and company name appear in the preview
- **Company Display**: Your company name is shown as the sender instead of just your name

## File Upload Limits

- **File Types**: PNG, JPG, JPEG
- **Max Size**: 4MB
- **Max Files**: 1 logo at a time
- **Recommended Size**: 300x300px or larger for best quality

## UploadThing Pricing

- **Free Tier**: 2GB storage, 2GB bandwidth/month
- **Pro Tier**: More storage and bandwidth available

For most small businesses, the free tier is sufficient.

## Removing a Logo

To remove your logo:
1. Go to Settings
2. Click the X button on your current logo
3. Click "Save Changes"

The quotes will revert to showing the default PingQuote logo.

## Troubleshooting

### Upload fails
- Check that your image is under 4MB
- Verify your `UPLOADTHING_TOKEN` is set correctly
- Check the browser console for errors

### Logo doesn't appear
- Make sure you clicked "Save Changes" after uploading
- Refresh the quote page
- Clear your browser cache

### OpenGraph image not updating
- Social media platforms cache OG images
- Use Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) to force a refresh
- Twitter/X may take a few hours to update

## Technical Details

### Files Modified
- `prisma/schema.prisma` - Added `companyName` and `logoUrl` fields
- `app/api/uploadthing/` - Upload API routes
- `app/settings/page.tsx` - Settings page
- `components/settings-form.tsx` - Logo upload UI
- `app/api/og/route.tsx` - OpenGraph image generation
- `app/q/[id]/page.tsx` - Quote display with logo

### Database Schema
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  password    String
  companyName String?  // New field
  logoUrl     String?  // New field
  // ... other fields
}
```
