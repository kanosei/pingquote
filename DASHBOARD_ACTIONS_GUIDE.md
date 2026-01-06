# Dashboard Actions Menu Guide

## ✅ Copy Link Already Implemented!

The dashboard **already has** a "Copy Link" option in the Actions menu for each quote.

## Where to Find It

### Desktop View

```
Dashboard → Quotes Table → Actions Column (⋮)
```

1. Go to `/dashboard`
2. Find any quote row
3. Click the **three dots (⋮)** in the Actions column
4. Click **"Copy Link"**
5. Link is copied to clipboard!
6. Menu shows "Copied!" confirmation

### Mobile View

Same as desktop - the three dots menu works on mobile too.

## Actions Menu Options

When you click the **⋮** button, you see:

```
┌─────────────────────┐
│ 👁️  Preview         │
│ 🔗 View             │
│ ─────────────────   │
│ 📋 Copy Link        │ ← This copies the quote URL!
│ 📧 Send Email       │ (if client has email)
└─────────────────────┘
```

## What "Copy Link" Does

1. **Copies** the quote URL to your clipboard
   - Format: `https://yourapp.com/q/abc123`

2. **Tracks** the copy action
   - Increments copy counter
   - Shows copy count below client name

3. **Shows confirmation**
   - Button changes to ✅ "Copied!"
   - Reverts after 2 seconds

4. **Updates dashboard**
   - Copy count appears below client name
   - Shows 📋 icon with number

## Copy Counter

After copying a link, you'll see stats below the client name:

```
Client Name
client@email.com
📋 2  📧 1    ← 2 times copied, 1 email sent
🔥 Hot
```

## Code Location

The implementation is in:
- **File**: [components/quotes-table.tsx](components/quotes-table.tsx)
- **Function**: `handleCopyLink` (line 52-72)
- **UI**: Actions dropdown (line 203-210)

## How It Works

```tsx
// When user clicks "Copy Link"
const handleCopyLink = async (quoteId: string) => {
  // 1. Build URL
  const quoteUrl = `${baseUrl}/q/${quoteId}`;

  // 2. Copy to clipboard
  await navigator.clipboard.writeText(quoteUrl);

  // 3. Track the copy
  await trackQuoteLinkCopy(quoteId);

  // 4. Show confirmation
  setCopiedQuoteId(quoteId);

  // 5. Refresh data
  router.refresh();
};
```

## Additional Features

### Email Sending

If you add a client email when creating a quote, you can:
- Click **"Send Email"** in Actions menu
- Quote link is emailed to client
- Email counter tracks sends
- Shows 📧 icon with count

### Preview

Click **"Preview"** to see the quote in a dialog without leaving the dashboard.

### View

Click **"View"** to open the quote in a new tab (same as what clients see).

## Visual Guide

### Dashboard Table

```
┌──────────────┬────────┬────────┬─────────────┬─────────┐
│ Client       │ Value  │ Status │ Last Viewed │ Actions │
├──────────────┼────────┼────────┼─────────────┼─────────┤
│ Acme Ltd     │ £3,500 │ 🔥 Hot │ Today       │   ⋮     │ ← Click here
│ 📋 2  📧 1   │        │        │             │         │
└──────────────┴────────┴────────┴─────────────┴─────────┘
                                                    │
                                                    ▼
                                          ┌─────────────────┐
                                          │ 👁️  Preview     │
                                          │ 🔗 View         │
                                          │ ───────────     │
                                          │ 📋 Copy Link    │ ← Click
                                          │ 📧 Send Email   │
                                          └─────────────────┘
```

### After Clicking "Copy Link"

```
┌─────────────────┐
│ 👁️  Preview     │
│ 🔗 View         │
│ ───────────     │
│ ✅ Copied!      │ ← Changes to this for 2 seconds
│ 📧 Send Email   │
└─────────────────┘
```

## Mobile Responsive

On mobile:
- Actions column shows ⋮ button
- Tap to open menu
- Same options as desktop
- Touch-friendly tap targets

## Browser Compatibility

**Copy to Clipboard** works on:
- ✅ All modern browsers
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Desktop Chrome/Firefox/Edge/Safari

Requires HTTPS in production (works on localhost in development).

## Keyboard Navigation

Accessible via keyboard:
1. Tab to Actions button
2. Press Enter/Space to open menu
3. Arrow keys to navigate
4. Enter to select "Copy Link"

## Summary

**You already have the share/copy link feature in the Actions menu!** 🎉

- Location: Dashboard → Quote row → ⋮ → Copy Link
- Function: Copies quote URL to clipboard
- Tracking: Counts how many times copied
- Feedback: Shows "Copied!" confirmation
- Stats: Displays copy count on dashboard

**No additional code needed** - it's already fully implemented and working!

---

**To test it:**
1. Go to `/dashboard`
2. Click ⋮ on any quote
3. Click "Copy Link"
4. Paste somewhere to verify!
