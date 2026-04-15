import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not set in .env.local");
}

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    relationship: { 
      type: String, 
      required: true,
      enum: ["Colleague", "Mentor", "Classmate", "Collaborator", "Client"]
    },
    avatar_url: { type: String },
    quote: { type: String, required: true, maxlength: 300 },
    platform: { 
      type: String, 
      required: true,
      enum: ["LinkedIn", "Direct", "Email", "GitHub"],
      default: "Direct"
    },
    linkedin_url: { type: String },
    is_approved: { type: Boolean, default: false },
    submitted_at: { type: Date, default: Date.now },
    approved_at: { type: Date },
  },
  { timestamps: true }
);

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Senior Engineer · Kodeeo",
    relationship: "Colleague",
    quote: "Rocky's backend architecture decisions saved us weeks of debugging. Genuinely sharp engineering judgment and a pleasure to work with on complex systems.",
    platform: "LinkedIn",
    linkedin_url: "https://linkedin.com/in/sarah-ahmed",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Tania M.",
    role: "Product Manager · Zaag Systems",
    relationship: "Collaborator",
    quote: "Rocky delivers clean APIs that are a joy for our frontend team to consume. He understands the business logic deeply and translates it into robust code.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Rafiq Hossain",
    role: "Tech Lead · Stack Overflowed",
    relationship: "Mentor",
    quote: "A sharp problem solver who doesn't just write code, but builds solutions. His contributions to our open-source tools were invaluable.",
    platform: "GitHub",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Jason Miller",
    role: "CTO · CloudScale",
    relationship: "Client",
    quote: "Exceptional work on our microservices migration. Rocky handled critical bottlenecks with ease and communicated every step clearly.",
    platform: "Email",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Ayesha Karim",
    role: "UI/UX Designer",
    relationship: "Collaborator",
    quote: "Rocky is that rare engineer who cares about the user experience as much as the server performance. Our handoffs are always seamless.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Fahim Shahriar",
    role: "Full Stack Dev · DevNext",
    relationship: "Classmate",
    quote: "Worked with Rocky on several hackathons. His ability to build a working prototype in hours is incredible. A true asset to any team.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "David Chen",
    role: "Principal Architect · GlobalTech",
    relationship: "Mentor",
    quote: "Solid grasp of distributed systems and scalability. Rocky consistently seeks out the best patterns rather than just the easiest path.",
    platform: "LinkedIn",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Lina S.",
    role: "Startup Founder",
    relationship: "Client",
    quote: "Highly professional and fast. Rocky helped us launch our MVP two weeks ahead of schedule. Highly recommended for any MVP work.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Omar Faruk",
    role: "DevOps Engineer",
    relationship: "Colleague",
    quote: "Rocky's Dockerized setups make deployments a breeze. He understands the 'Ops' in DevOps better than most backend developers.",
    platform: "GitHub",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Maria Garcia",
    role: "Senior Software Engineer",
    relationship: "Collaborator",
    quote: "Code reviews from Rocky are like masterclasses. He catches edge cases you didn't know existed while keeping the feedback constructive.",
    platform: "Email",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Samiul Islam",
    role: "Open Source Contributor",
    relationship: "Collaborator",
    quote: "His documentation is as clean as his code. Makes it so easy for new contributors to get started on his repositories.",
    platform: "GitHub",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Dr. Ahmed J.",
    role: "Professor · CS Department",
    relationship: "Mentor",
    quote: "One of the most dedicated students I've mentored. His final project on blockchain scalability was top-tier and demonstrated deep research.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Sophie Thompson",
    role: "Lead Designer · CreativeLabs",
    relationship: "Collaborator",
    quote: "Beautiful implementation of complex animations. Rocky brought our Figma prototypes to life with incredible precision and fluidity.",
    platform: "LinkedIn",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Kamrul Hasan",
    role: "Software Architect",
    relationship: "Colleague",
    quote: "Rocky's ability to simplify complex problems is impressive. He transformed our legacy spaghetti code into a maintainable modular system.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Rachel Tan",
    role: "Engineering Manager",
    relationship: "Mentor",
    quote: "A natural leader who lifts the technical bar of the entire team. Rocky is proactive, reliable, and technically formidable.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Niloy Mitra",
    role: "Backend Lead · FinTech Solutions",
    relationship: "Collaborator",
    quote: "Rocky implemented our payment gateway integration with perfect security and error handling. Very reliable engineer for mission-critical tasks.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Samantha Lee",
    role: "Frontend Specialist",
    relationship: "Colleague",
    quote: "Collaborating with Rocky is effortless. He provides clear API specs and is always quick to address technical blockers.",
    platform: "LinkedIn",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Yousuf Ali",
    role: "App Developer",
    relationship: "Classmate",
    quote: "We built several university projects together. Rocky's focus on performance and scalability even in student projects was inspiring.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Chloe V.",
    role: "Digital Strategist",
    relationship: "Client",
    quote: "Rocky took the time to explain the technical tradeoffs of our platform, helping us make better business decisions. Great partner.",
    platform: "Email",
    is_approved: true,
    approved_at: new Date()
  },
  {
    name: "Tanvir Anjum",
    role: "Security Researcher",
    relationship: "Collaborator",
    quote: "Found Rocky's code to be remarkably resilient during our internal security audits. He follows security best practices religiously.",
    platform: "Direct",
    is_approved: true,
    approved_at: new Date()
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB");

  await Testimonial.deleteMany({});
  console.log("Cleared existing testimonials");

  await Testimonial.insertMany(testimonials);
  console.log(`Inserted ${testimonials.length} testimonials`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
