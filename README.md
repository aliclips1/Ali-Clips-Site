# Ali-Clips-Site

**Ali Clips Website README**

This document provides a summary of the website's structure, technologies used, and instructions for management and maintenance.

Project Overview

This is a professional, multi-page website for Ali Clips, a barber shop located in Brampton, Ontario. The site is designed to provide an elegant online presence, showcase services, display work, and provide a seamless booking experience.

Key Features:

Responsive Design: The website is fully responsive, ensuring it looks and functions perfectly on desktops, tablets, and mobile devices.

Static Pages: The site consists of a set of simple, fast-loading HTML pages.

Booking Integration: The "Book Now" buttons link directly to the official Google Calendar and Booksy booking pages, streamlining the appointment process.

File Structure

The website is composed of the following core files, all located in the root directory:

- index.html: The main landing page.

- main.html: The services page, where clients can view services and book appointments.

- works.html: A gallery or portfolio page to display the barber's work.

- policies.html: A page detailing the shop's policies.

- reviews.html: A page dedicated to client reviews.

Images: Any images used on the website should be placed in an images/directory within the root.

Technologies Used

- HTML5: Provides the foundational structure of the website.

- CSS3 (Custom & Tailwind CSS):

- Tailwind CSS CDN: Used for rapid styling and responsive layout.

- Custom CSS: Written in the <style> block within each HTML file for unique, personalized design elements.

- JavaScript: Used for interactive features like the modal pop-up for booking.

- Google Fonts: Montserrat, Playfair Display, and Dancing Script are used for typography.

- Font Awesome: Used for social media and other icons.

**How to Manage and Update the Website**

Since this is a static HTML website, updates require direct file editing. You will need to access your hosting account's file manager to make changes.

**To edit content (e.g., text, prices):**

Open the specific HTML file (main.html, policies.html, etc.) in a text editor (like Visual Studio Code or even Notepad).

Locate the text you want to change.

Save the updated file.

Upload the new file to the public_html folder on your web host, overwriting the old one.

**To change booking links:**

Open the main.html file.

Find the <a href="#" onclick="openModal('...')"> tags for the "Book Now" buttons.

Replace the URL inside the single quotes with the new link.

Save and upload the updated main.html file.

For all updates, a stable internet connection is required.
