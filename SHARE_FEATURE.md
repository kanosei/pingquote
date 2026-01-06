# Share Feature Documentation

## Overview

The public quote page now includes a **Share Button** that uses the Web Share API to trigger the native share sheet on mobile devices (iOS Safari, Android Chrome, etc.).

## How It Works

### On iOS Safari / Mobile Devices

When users click the "Share Quote" button:

1. **Native Share Sheet Opens** - Shows the iOS/Android share menu
2. **Apps Available** - WhatsApp, iMessage, Instagram, Mail, Notes, etc.
3. **Share Content Includes**:
   - **Title**: "Quote from [Sender Name]"
   - **Text**: "[Sender] sent you a quote to review. View the details here:"
   - **URL**: The direct link to the quote

### On Desktop / Unsupported Browsers

If Web Share API is not available:
- **Fallback**: Copies the URL to clipboard
- **Feedback**: Button shows "Link Copied!" for 2 seconds
- **User Experience**: Still provides easy sharing via paste

## Implementation

### Component Location

- **File**: [components/share-button.tsx](components/share-button.tsx)
- **Usage**: Public quote page ([app/q/[id]/page.tsx](app/q/[id]/page.tsx))

### Code Example

```tsx
<ShareButton
  title="Quote from John Doe"
  text="John Doe sent you a quote to review. View the details here:"
  url="https://yourapp.com/q/abc123"
/>
```

## Browser Support

### ✅ Fully Supported (Native Share)

- **iOS Safari** - All versions with iOS 12.2+
- **Android Chrome** - Version 61+
- **Android Firefox** - Version 71+
- **Samsung Internet** - Version 8.2+

### ⚠️ Fallback (Copy to Clipboard)

- **Desktop Chrome** - All versions
- **Desktop Firefox** - All versions
- **Desktop Safari** - All versions
- **Desktop Edge** - All versions
- **Older mobile browsers**

## User Experience

### Mobile (iOS Safari Example)

1. User opens quote link on iPhone
2. Sees "Share Quote" button with share icon
3. Taps button
4. iOS share sheet appears
5. User can choose:
   - Messages
   - WhatsApp
   - Instagram Stories
   - Mail
   - Notes
   - AirDrop
   - Copy
   - More...

### Desktop

1. User opens quote link on desktop
2. Sees "Share Quote" button
3. Clicks button
4. URL copies to clipboard
5. Button shows "Link Copied!" confirmation
6. User can paste link anywhere

## What Gets Shared

When someone shares via WhatsApp, for example:

```
Quote from John Doe
John Doe sent you a quote to review. View the details here:
https://yourapp.com/q/abc123
```

The link preview will also show:
- Open Graph title and description
- Professional appearance
- Quote total and sender name

## Testing

### Test on iOS Device

1. Create a quote in your dashboard
2. Open the public quote URL on your iPhone
3. Tap "Share Quote" button
4. Verify iOS share sheet appears
5. Try sharing to different apps

### Test Desktop Fallback

1. Open quote on desktop browser
2. Click "Share Quote"
3. Verify "Link Copied!" appears
4. Paste in another app to confirm

## Customization

### Change Share Text

Edit in [app/q/[id]/page.tsx](app/q/[id]/page.tsx):

```tsx
const shareTitle = `Quote from ${quote.user.name}`;
const shareText = `Custom message here: ${formatCurrency(total)}`;
```

### Change Button Style

Edit in [components/share-button.tsx](components/share-button.tsx):

```tsx
<Button
  onClick={handleShare}
  variant="default"  // Change to: outline, ghost, etc.
  size="lg"          // Change to: sm, lg, icon
  className="custom-class"
>
```

### Add More Share Options

Web Share API supports:
- `title` - The title of the share
- `text` - The main text content
- `url` - The URL to share
- `files` - Array of files to share (e.g., PDF export)

Example with files:

```tsx
await navigator.share({
  title: 'Quote PDF',
  files: [pdfFile],
});
```

## Analytics

To track share usage, add analytics to the `handleShare` function:

```tsx
const handleShare = async () => {
  // Track share attempt
  analytics.track('quote_share_initiated', {
    quoteId: params.id,
    shareMethod: navigator.share ? 'native' : 'clipboard'
  });

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });

      // Track successful share
      analytics.track('quote_share_completed', {
        quoteId: params.id,
      });
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        // Track share error
        analytics.track('quote_share_error', {
          error: error.message
        });
      }
    }
  }
};
```

## Security & Privacy

- ✅ No data sent to third parties
- ✅ User controls what app they share to
- ✅ Native iOS/Android privacy protections apply
- ✅ No tracking of share destinations
- ✅ Fallback doesn't expose clipboard content

## Accessibility

- ✅ Keyboard accessible
- ✅ Screen reader friendly
- ✅ Clear button labels
- ✅ Visual feedback (icon changes)
- ✅ Works with assistive technologies

## Future Enhancements

### Possible Additions

1. **Share Statistics**
   - Track how many times a quote is shared
   - Add to quote analytics

2. **Share to Specific Apps**
   - Direct "Share to WhatsApp" button
   - Using URL schemes (e.g., `whatsapp://send?text=...`)

3. **QR Code**
   - Generate QR code for quote
   - Easy sharing in person

4. **Email Share**
   - Pre-populated email template
   - "Email this quote" button

5. **PDF Export + Share**
   - Generate PDF
   - Share PDF file via Web Share API

## Code Reference

### Main Files

- [components/share-button.tsx](components/share-button.tsx) - Share button component
- [app/q/[id]/page.tsx](app/q/[id]/page.tsx) - Public quote page

### Dependencies

- `lucide-react` - Icons (Share2, Check, Copy)
- `@/components/ui/button` - Button component

---

**The share feature is production-ready and works great on iOS Safari! 🎉**
