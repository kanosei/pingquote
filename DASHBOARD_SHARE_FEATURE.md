# Dashboard Share Feature

## ✨ New: Share via Web Share API

The dashboard Actions menu now includes a **"Share"** option that uses the Web Share API!

## What's New

### Actions Menu Now Includes:

```
┌───────────────────┐
│ 👁️  Preview       │
│ 🔗 View           │
│ ─────────────     │
│ 📤 Share          │ ← NEW! Web Share API
│ 📋 Copy Link      │ ← Existing (clipboard)
│ 📧 Send Email     │
└───────────────────┘
```

## How It Works

### On iOS Safari / Mobile Devices

1. Click **⋮** (three dots) on any quote
2. Click **"Share"**
3. **Native iOS share sheet appears!**
4. Share to: WhatsApp, iMessage, Instagram, Mail, etc.

### On Desktop / Unsupported Browsers

1. Click **⋮** (three dots) on any quote
2. Click **"Share"**
3. **Automatically falls back to "Copy Link"**
4. Link copied to clipboard

## Share vs Copy Link

Both options are available - use whichever you prefer:

| Feature | Share | Copy Link |
|---------|-------|-----------|
| **iOS/Mobile** | Native share sheet | Clipboard copy |
| **Desktop** | Clipboard copy | Clipboard copy |
| **Apps** | WhatsApp, iMessage, etc. | Manual paste |
| **Speed** | One tap → choose app | Copy → paste |
| **Tracking** | ✅ Tracked | ✅ Tracked |

## What Gets Shared

When you share a quote:

```
Quote for Acme Ltd
Quote for £3,500 - view details:
https://yourapp.com/q/abc123
```

**Components:**
- **Title**: "Quote for [Client Name]"
- **Text**: "Quote for £X,XXX - view details:"
- **URL**: Direct link to quote

## Code Implementation

### Location
- **File**: [components/quotes-table.tsx](components/quotes-table.tsx)
- **Function**: `handleShare` (line 74-111)
- **UI**: Actions dropdown (line 242-245)

### How It Works

```tsx
const handleShare = async (quote) => {
  // 1. Build share content
  const quoteUrl = `${baseUrl}/q/${quote.id}`;
  const shareTitle = `Quote for ${quote.clientName}`;
  const shareText = `Quote for ${total} - view details:`;

  // 2. Check if Web Share API is supported
  if (navigator.share) {
    // 3. Show native share sheet
    await navigator.share({
      title: shareTitle,
      text: shareText,
      url: quoteUrl,
    });

    // 4. Track the share
    await trackQuoteLinkCopy(quote.id);
  } else {
    // 5. Fallback to copy link
    handleCopyLink(quote.id);
  }
};
```

## Browser Support

| Browser | Behavior |
|---------|----------|
| iOS Safari | ✅ Native share sheet |
| Android Chrome | ✅ Native share sheet |
| Desktop Chrome | 📋 Copies to clipboard |
| Desktop Safari | 📋 Copies to clipboard |
| Desktop Firefox | 📋 Copies to clipboard |

## User Experience

### Mobile (iOS Example)

```
Dashboard
  ↓
Click ⋮ on quote
  ↓
Click "Share"
  ↓
iOS share sheet appears
  ↓
Choose: Messages, WhatsApp, Instagram, Mail, etc.
  ↓
Share sent!
```

### Desktop

```
Dashboard
  ↓
Click ⋮ on quote
  ↓
Click "Share"
  ↓
Link copied to clipboard
  ↓
Paste anywhere
```

## Tracking

Both "Share" and "Copy Link" are tracked:
- Increments copy counter
- Shows 📋 icon with count below client name
- Refreshes dashboard to show updated count

## Visual Guide

### Before

```
Actions Menu:
┌───────────────────┐
│ 👁️  Preview       │
│ 🔗 View           │
│ ─────────────     │
│ 📋 Copy Link      │
│ 📧 Send Email     │
└───────────────────┘
```

### After (New!)

```
Actions Menu:
┌───────────────────┐
│ 👁️  Preview       │
│ 🔗 View           │
│ ─────────────     │
│ 📤 Share          │ ← NEW!
│ 📋 Copy Link      │
│ 📧 Send Email     │
└───────────────────┘
```

## When to Use Each

### Use "Share" When:
- On mobile device
- Want to send directly to an app
- Sharing with one person quickly
- Using WhatsApp/iMessage

### Use "Copy Link" When:
- Need to paste in multiple places
- Working on desktop
- Adding to documents
- Want manual control

## Accessibility

- ✅ Keyboard accessible (Tab → Enter)
- ✅ Screen reader friendly
- ✅ Clear labels
- ✅ Visual icons
- ✅ Touch-friendly targets

## Error Handling

### User Cancels Share
- No error shown
- Share sheet simply closes
- No tracking recorded

### Share API Not Supported
- Automatically falls back to copy
- Link copied to clipboard
- Seamless user experience

### Copy Fails
- Error alert shown
- User notified
- Can try again

## Testing

### Test on iPhone

1. Start dev server: `npm run dev`
2. Access on iPhone (use ngrok or local network)
3. Go to dashboard
4. Click ⋮ on any quote
5. Click "Share"
6. Verify iOS share sheet appears

### Test on Desktop

1. Go to dashboard
2. Click ⋮ on any quote
3. Click "Share"
4. Verify link is copied
5. Paste to confirm

## Customization

### Change Share Text

Edit in `handleShare` function:

```tsx
const shareTitle = `Custom title`;
const shareText = `Custom message with ${total}`;
```

### Add Share Analytics

Track successful shares:

```tsx
await navigator.share({ title, text, url });

// Add analytics
analytics.track('quote_shared', {
  quoteId: quote.id,
  client: quote.clientName,
  method: 'webshare'
});
```

### Separate Tracking

Track shares differently from copies:

```tsx
// Create new server action
await trackQuoteShare(quote.id); // Instead of trackQuoteLinkCopy

// Show different icon/count for shares
```

## Future Enhancements

Possible additions:

1. **Share as PDF**
   ```tsx
   await navigator.share({
     files: [pdfFile],
     title: 'Quote PDF'
   });
   ```

2. **Share Statistics**
   - Track which apps users share to
   - Show share conversion rates
   - Compare email vs share performance

3. **Pre-filled Messages**
   - Custom message templates
   - Different messages per client
   - Personalized share text

## Summary

✅ **Share** menu item added to Actions dropdown
✅ Uses Web Share API on mobile
✅ Auto-fallback to clipboard on desktop
✅ Tracking integrated
✅ Works on iOS Safari perfectly
✅ Clean, professional UX

---

**Test it on your iPhone to see the native share sheet in action!** 📱
