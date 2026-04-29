
Project Details Page Information:

instead of building the full details page for each project - we will simply render the readme.md markdown file of the project in this page same as the github. so technically we will build a markdown previewer for showcasing the project details.

At the very top center the preview video will be play, right after that the group of CTA like github, Live preview,youtubelink, review button(open the review modal) etc will be render in a line. and then the readme fill will render which will contain all details of the project in a organized way including the project headline,skills, problem it solve, description, features with UI images included. and everything a projects readme contains.
On the left side the section navigation will be rendered collected from readme healing tag.
after the details the footer will render and at the top the navbar will visible.

Use Next.js API route for render the readme file.
Fetch once and then Use ISR (Incremental Static Regeneration) to cache it reducing github api hit and fast render without waiting.

Ensure readme render will Support for: (headings, lists, images, links)

Don’t just render markdown — style it like documentation
Dedicated route: /projects/project-name

Auto Table of Contents:
Extract headings from markdown (Detect: "Features", "Tech Stack", "Installation")
Show sidebar navigation 


Image Handling Fix: GitHub markdown images use relative paths → they will break. You must Convert relative paths → absolute GitHub URLs

Common Mistakes to Avoid:
Rendering raw HTML without sanitizing (security issue)
Not handling large READMEs (performance drop)
Ignoring mobile UX
No loading state (bad experience)
No error fallback


Final Architecture (clean mental model):
Project Card
   ↓
Click "Details"
   ↓
Fetch README (server/API)
   ↓
Parse Markdown
   ↓
Enhance (TOC, styling, images fix)
   ↓
Render in page