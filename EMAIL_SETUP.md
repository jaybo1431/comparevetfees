# Email Integration Setup Guide

The lead generation system is fully built and deployed. Form submissions currently log to the console. Follow this guide to enable email notifications.

## Option 1: Resend (Recommended - Free Tier Available)

**Why Resend?**
- 3,000 emails/month free
- Simple API
- Good deliverability
- Developer-friendly

**Setup Steps:**

1. **Sign up at [resend.com](https://resend.com)**

2. **Get your API key** from the dashboard

3. **Add to Vercel Environment Variables:**
   ```bash
   vercel env add RESEND_API_KEY
   # Paste your API key when prompted
   # Select Production, Preview, and Development
   ```

4. **Install Resend package:**
   ```bash
   npm install resend
   ```

5. **Update `/src/app/api/contact/route.ts`:**

   Replace the `sendEmailNotification` function with:

   ```typescript
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   async function sendEmailNotification(data: {
     practiceEmail?: string;
     practiceName: string;
     customerName: string;
     customerEmail: string;
     customerPhone: string;
     petType: string;
     service: string;
     message: string;
     submittedAt: string;
   }) {
     try {
       // Send to practice (when practice emails are added to data)
       await resend.emails.send({
         from: 'CompareVetFees <enquiries@comparevetfees.com>',
         to: data.practiceEmail || 'admin@comparevetfees.com',
         replyTo: data.customerEmail,
         subject: `New Enquiry from ${data.customerName}`,
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px;">
             <h2 style="color: #059669;">New Lead from CompareVetFees</h2>

             <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
               <h3 style="margin-top: 0;">Customer Details</h3>
               <p><strong>Name:</strong> ${data.customerName}</p>
               <p><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
               <p><strong>Phone:</strong> ${data.customerPhone || 'Not provided'}</p>
             </div>

             <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
               <h3 style="margin-top: 0;">Enquiry Details</h3>
               <p><strong>Pet Type:</strong> ${data.petType}</p>
               <p><strong>Service Needed:</strong> ${data.service}</p>
               ${data.message ? `<p><strong>Message:</strong><br>${data.message}</p>` : ''}
             </div>

             <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
               <p style="color: #6b7280; font-size: 14px;">
                 This lead was generated via <a href="https://comparevetfees.com" style="color: #059669;">CompareVetFees.com</a><br>
                 Practice: ${data.practiceName}<br>
                 Submitted: ${new Date(data.submittedAt).toLocaleString('en-GB')}
               </p>
             </div>
           </div>
         `,
       });

       // Optional: Send confirmation to customer
       await resend.emails.send({
         from: 'CompareVetFees <enquiries@comparevetfees.com>',
         to: data.customerEmail,
         subject: 'Your Enquiry to ${data.practiceName}',
         html: `
           <div style="font-family: Arial, sans-serif; max-width: 600px;">
             <h2 style="color: #059669;">Enquiry Received!</h2>

             <p>Hi ${data.customerName},</p>

             <p>We've forwarded your enquiry to <strong>${data.practiceName}</strong>. They will contact you directly at:</p>

             <ul>
               <li>Email: ${data.customerEmail}</li>
               ${data.customerPhone ? `<li>Phone: ${data.customerPhone}</li>` : ''}
             </ul>

             <p>If you don't hear back within 24 hours, please contact them directly.</p>

             <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
               <p style="color: #6b7280; font-size: 14px;">
                 CompareVetFees — Know the cost before you go<br>
                 <a href="https://comparevetfees.com">comparevetfees.com</a>
               </p>
             </div>
           </div>
         `,
       });

       return true;
     } catch (error) {
       console.error('Failed to send email:', error);
       throw error;
     }
   }
   ```

6. **Set up your domain (for "from" email):**
   - In Resend dashboard, go to Domains
   - Add `comparevetfees.com`
   - Add the DNS records they provide to your domain registrar
   - Wait for verification (usually < 10 mins)

7. **Redeploy:**
   ```bash
   git add -A
   git commit -m "Add Resend email integration"
   git push
   vercel --prod
   ```

---

## Option 2: SendGrid (Alternative)

**Setup:**

1. Sign up at [sendgrid.com](https://sendgrid.com) (100 emails/day free)
2. Get API key from Settings → API Keys
3. Add to Vercel: `SENDGRID_API_KEY`
4. Install: `npm install @sendgrid/mail`
5. Update the email function similarly

---

## Testing Email Flow

1. **Local Testing:**
   ```bash
   # Create .env.local file
   echo "RESEND_API_KEY=re_your_key_here" > .env.local

   # Run dev server
   npm run dev

   # Visit http://localhost:3000/practice/bournemouth-bay-vets
   # Click "Get a Quote" and submit the form
   ```

2. **Check Resend Dashboard** for delivery status

---

## Adding Practice Email Addresses

Update `/src/data/practices.ts` to include email addresses:

```typescript
export interface Practice {
  slug: string;
  name: string;
  // ... existing fields
  email?: string; // Add this field
  // ... rest of fields
}
```

Then add emails to each practice:

```typescript
{
  slug: "bournemouth-bay-vets",
  name: "Bournemouth Bay Veterinary Clinic",
  email: "enquiries@bournemouthbayvets.example.com", // Add this
  // ... rest of practice data
}
```

Update API route to use practice email:

```typescript
const emailData = {
  practiceEmail: practice.email, // Now pulls from data
  // ... rest
};
```

---

## Lead Tracking Database (Phase 2)

For proper lead tracking and reporting:

1. **Set up Vercel Postgres** (free tier available)
2. **Create leads table:**
   ```sql
   CREATE TABLE leads (
     id SERIAL PRIMARY KEY,
     practice_slug VARCHAR(255) NOT NULL,
     customer_name VARCHAR(255) NOT NULL,
     customer_email VARCHAR(255) NOT NULL,
     customer_phone VARCHAR(50),
     pet_type VARCHAR(50) NOT NULL,
     service VARCHAR(100) NOT NULL,
     message TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Update API route** to save to database before sending email

---

## Current Status

✅ **Working:**
- Contact form modal on all practice pages
- Form validation and submission
- API endpoint handling
- Success/error states
- Console logging of leads

⚠️ **Needs Setup:**
- Email service integration (follow steps above)
- Practice email addresses in data
- Optional: Lead database for tracking

---

## Revenue Tracking

Once emails are working, you can track:
- Number of leads per practice
- Lead → booking conversion rates
- Revenue at £5-£15 per successful enquiry

This data can be exported monthly for billing practices on the lead generation model.
