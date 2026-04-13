import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connect";
import Testimonial from "@/lib/db/models/Testimonial";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, role, relationship, quote, linkedin_url, rating } = body;

    // Server-side validation
    if (!name || !role || !relationship || !quote) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (quote.length > 300) {
      return NextResponse.json(
        { error: "Testimonial must be under 300 characters." },
        { status: 400 }
      );
    }

    // Insert into DB
    const newTestimonial = await Testimonial.create({
      name,
      role,
      relationship,
      quote,
      linkedin_url,
      rating,
      is_approved: false, // Default to false for manual review
    });

    // Send Email Notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Portfolio Testimonials" <${process.env.EMAIL_HOST_USER}>`,
      to: "rocky20809@gmail.com",
      subject: `New Testimonial Submitted: Review Required`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #000; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Testimonial Review Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Relationship:</strong> ${relationship}</p>
          ${rating ? `<p><strong>Rating:</strong> ${rating}/5</p>` : ''}
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #000;">
            <p style="margin: 0; font-style: italic;">"${quote}"</p>
          </div>
          ${linkedin_url ? `<p style="margin-top: 15px;"><strong>LinkedIn:</strong> <a href="${linkedin_url}">${linkedin_url}</a></p>` : ''}
          <p style="font-size: 12px; color: #999; margin-top: 30px;">
            Submitted on ${new Date().toLocaleString()}
          </p>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 11px; color: #777;">To approve, set is_approved: true in MongoDB.</p>
        </div>
      `,
    };

    // We don't await the email send to keep the UI fast, as per user's Alert sequence logic
    transporter.sendMail(mailOptions).catch(err => console.error("Testimonial email notify error:", err));

    return NextResponse.json({ message: "Testimonial received!", id: newTestimonial._id }, { status: 200 });
  } catch (error) {
    console.error("Testimonial submit error:", error);
    return NextResponse.json({ error: "Failed to submit testimonial." }, { status: 500 });
  }
}
