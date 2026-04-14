Notion Like UI.
Timeline view X-axis scroll (horizontal) and pop up achievements

Slow motion auto and scroll to move fast
Sorted by time
Smooth scrolling


Achievements: stor on db
 - Achieved Pupil On Codeforces - May 2025 [img_url] [handle] [strength]
 - Completed Course Phitron - jun 2024 [img_url] [handle] [strength]
 - Completed Course Programming Hero - feb 2025 [img_url] [strength]
 - Completed Course Claude Code - April 2026 [img_url] [handle] [strength]
 - Completed BSc in CSE - july 2026 [5]
 - Achieved 2* on CC - Octobar 2023 [img_url] [handle] [strength]
 - Solved 100 Problems on Leetcode - April 2026 [img_url] [handle] [strength]
 - Achieved 30 days codeforces stick - March 2025 
 - Petcareplus project Completion - February 2026 [img_url] [handle] [strength]
 - Medisync Project Completion - April 2026 [img_url] [handle] [strength]
 - Completed MCP course - May 2026 [img_url] [handle] [strength]
 - Completed GenAI course - Google - June 2026 [img_url] [handle] [strength]
 - Completed Level 2 - November 2026 [img_url] [handle] [strength]
 - Selected of JL course in DU - April 2025 
 - Runner-Up – IUPC at Prime University CSE Fest 2025 - May 2025 [img_url] [handle] [strength]
 - 1st Runner-Up position in the Inter-University Programming Contest (IUPC) at Prime University - December 2022 
 - Got 1st rank on the semester with cg 3.97 - November 2022
 - Participated Icpc Dhaka Regional Priliminary Contest
 - Runner Up at project showcasing on CSE Fest - December 2022
 - Got selected for Vice President role on PUPC - May 2023 
 - Organized CSE Fest - March 2024
 - Conducted 1st lecture on Programming Languages - April 2023
 - Organized seminar on "Let's Code Your Career Through Problem Solving" with Phitron -June 2024
 - 

 - Sharing my Journey With YOU (#SMILE) (Story telling and connect user with the story) - Today



DB schema:

Title: string
date: month+year
img_url: url, optional [for preview]
handle: url, optional [post or outsite content]
strength: int [1-5] indicate how valuable this achievement is - based on that the UI will shocase the achievement



UI: 

Hove on the UI and scroll down to swipe right and scroll up to swipe left
hover outside the UI and scroll up or down to scroll up or down
without scroll - auto swip to right from start in slow motion
achievemnt will be visible after the date comes in focus screen - pop up the achievement component

see the image to understand achievemnet component UI - add a small minimal button to end of the achievement component if the handle field had a url to redirect to a resource page - like linkedin

UI details for achievement component:
1st will be a pill of gray or marbel color based on theme
2nd will be an icon based on strength
3nd will be the title of the achievement
4th is the date
5th is see more button if handle is present

Background: 
Notion Timeline like UI with month view.

If multiple achievement on same month - sort them based on time added. all does not aligh with the y axis line for the month, 1st achievement will be on the line, 2nd will be above the 1st and with extra x value(diagonally down), 3rd will be below the 2nd diagonally and so on.


Note: no legs on UI and no ui freezing - should smooth and optimized