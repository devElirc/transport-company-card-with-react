Build simple transport company cards in React.

Set up the project inside /app with Vite + React. Make sure /app/package.json is included, and npm run dev runs correctly from /app.

The company data is already in /app/src/companyData.js. Do not edit or replace that file. 

Import the companies export from it, and render one card for each company. 

Each card should use a semantic article, and its accessible name should match the company name from the data file. 

Render one card for each company from the data file, including companies like Atlas Freight Lines International and Nova Transport Partners.

The SVG files are already available in /app/public/atlas-logo.svg and /app/public/verified-badge.svg.

Each card should have three sections.

In the top section, show the company logo when logoUrl exists. 
Use <img> element, and make sure its accessible name includes the company name and ends with logo, like Atlas Freight Lines International logo. 
If logoUrl is empty, do not render a logo image. 
Show a simple fallback with the first letter of the company name instead, and give it an accessible name like Nova Transport Partners initial.

Show the company name in an h2. Long names should stay on one line and use ellipsis on normal desktop widths. 
Show the verified icon from verifiedIconUrl with alt text exactly Verified company.

If both averageRating and reviewCount are present, show a rating row with five star characters. 
The number of filled stars should come from Math.round(averageRating) out of five. 
Next to that, show the rating text in this exact format: 4.6 (214 reviews). 
Use one decimal for the rating, a whole number for the review count, and keep the spacing and parentheses exactly like that. 
If either value is missing, do not show the rating row.

In the middle section, show these three labels: Verified, Top Reviewed, and Customer Favorite. On small screens, they should wrap cleanly.

In the bottom section, show a whole-number trust score from 0 to 100 with the label Trust Score. 
Calculate it with Math.round((averageRating / 5) * 100), then clamp the result to the 0–100 range. 
Show it with a circular progress ring, and animate the ring stroke with a CSS keyframe named ring-fill. 
This section should be clearly separated from the badges above, for example with a top border and a simple left-aligned layout.

Also show these three quality metrics: Pricing Accuracy, Communication, and Vehicle Condition. 
Each row should show the percent text and include an accessible progress bar with role="progressbar" and aria-valuenow set to the whole-number percent. 
Animate the fills with CSS keyframes named metric-grow and stripes.

Build everything in React. Handle missing data safely so the UI does not break. 

Add a small-screen rule such as @media (max-width: 640px) so the metric area stays readable on narrow screens.

Before you finish, run npm run build from /app and fix any build errors.

Use /app/src/companyData.js as the only source for all company-specific values shown in the UI.