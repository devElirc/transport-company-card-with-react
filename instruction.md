Build a simple company card with react.js.

The card is a transport company profile in three sections.

In the header, there is a square logo container on the left with a white background and light border. 
If a logo URL is available, render the logo centered inside the box. 
If no logo is available, render a fallback block with the first letter of the company name. 

On the right part, show the company name on one line with ellipsis overflow, a custom verified icon image beside the name, and a rating row below with five stars plus rating text when review data exists.

In the middle section, render three pill badges: Verified, Top Reviewed, and Customer Favorite. The layout must support wrapping on smaller widths without breaking readability.

Below the badges, add a summary area separated by a light divider. 
On the left, render an animated circular trust ring based on a 0–100 trust score derived from the average rating. 

At the bottom, render three metric rows: Pricing Accuracy, Communication, and Vehicle Condition. Each row must include a label, an animated striped progress bar, and a percentage value aligned to the right. The bars must animate from 0 to their target values. 


