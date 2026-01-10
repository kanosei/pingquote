interface QuoteEmailData {
  clientName: string;
  senderName: string;
  quoteUrl: string;
  itemCount: number;
}

export function getQuoteEmailHtml(data: QuoteEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 30px 24px; border-bottom: 1px solid #e5e7eb;">
              <!-- Logo -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-right: 8px;">
                    <div style="width: 32px; height: 32px; background-color: #1e293b; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; vertical-align: middle;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        <path d="M8 12h.01"></path>
                        <path d="M12 12h.01"></path>
                        <path d="M16 12h.01"></path>
                      </svg>
                    </div>
                  </td>
                  <td style="font-size: 20px; font-weight: 600; color: #111827; vertical-align: middle;">
                    Ping<span style="color: #1e293b;">Quote</span>
                  </td>
                </tr>
              </table>

              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827; line-height: 1.3;">You've received a quote</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px 30px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #111827; line-height: 1.5;">Hi ${data.clientName},</p>

              <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">${data.senderName} has prepared a quote for you${data.itemCount > 0 ? ` with ${data.itemCount} item${data.itemCount !== 1 ? 's' : ''}` : ''}.</p>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">Click the button below to view the full details and pricing.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.quoteUrl}" style="display: inline-block; padding: 12px 24px; background-color: #1e293b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px;">View Quote</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">If you have any questions about this quote, simply reply to this email and ${data.senderName} will get back to you.</p>

              <p style="margin: 24px 0 0 0; font-size: 15px; color: #4b5563; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #111827;">${data.senderName}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                This quote was sent via <a href="https://pingquote.com" style="color: #1e293b; text-decoration: none;">PingQuote</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getQuoteEmailText(data: QuoteEmailData): string {
  return `
Hi ${data.clientName},

${data.senderName} has prepared a quote for you${data.itemCount > 0 ? ` with ${data.itemCount} item${data.itemCount !== 1 ? 's' : ''}` : ''}.

Click the link below to view the full details and pricing:
${data.quoteUrl}

If you have any questions about this quote, simply reply to this email and ${data.senderName} will get back to you.

Best regards,
${data.senderName}

---
This quote was sent via PingQuote - https://pingquote.com
  `.trim();
}

// Quote View Notification Email
interface QuoteViewNotificationData {
  senderName: string;
  clientName: string;
  quoteUrl: string;
  dashboardUrl: string;
}

export function getQuoteViewNotificationHtml(data: QuoteViewNotificationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="padding: 32px 30px 24px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 12px; vertical-align: middle;">
                    <div style="width: 48px; height: 48px; background-color: rgba(255,255,255,0.2); border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
                      <span style="font-size: 28px;">🔥</span>
                    </div>
                  </td>
                  <td style="vertical-align: middle;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.2;">Your quote was viewed!</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px 30px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #111827; line-height: 1.5;">Hi ${data.senderName},</p>

              <p style="margin: 0 0 24px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">
                Great news! <strong style="color: #111827;">${data.clientName}</strong> just viewed your quote.
              </p>

              <!-- Highlight Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 6px;">
                    <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">💡 Pro Tip</p>
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.5;">This is a great time to follow up! Your quote is fresh in their mind.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="${data.dashboardUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">View Dashboard</a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${data.quoteUrl}" style="display: inline-block; padding: 12px 24px; background-color: transparent; color: #f97316; text-decoration: none; border-radius: 6px; border: 2px solid #f97316; font-weight: 500; font-size: 15px;">View Quote</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                You'll receive this notification only once per quote view. Check your dashboard to see the full view history.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                Sent by <a href="https://pingquote.com" style="color: #f97316; text-decoration: none; font-weight: 500;">PingQuote</a> - Know when your quotes are viewed
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getQuoteViewNotificationText(data: QuoteViewNotificationData): string {
  return `
🔥 Your quote was viewed!

Hi ${data.senderName},

Great news! ${data.clientName} just viewed your quote.

💡 Pro Tip: This is a great time to follow up! Your quote is fresh in their mind.

View your dashboard: ${data.dashboardUrl}
View the quote: ${data.quoteUrl}

You'll receive this notification only once per quote view. Check your dashboard to see the full view history.

---
Sent by PingQuote - Know when your quotes are viewed
https://pingquote.com
  `.trim();
}
