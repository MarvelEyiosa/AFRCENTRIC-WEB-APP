# Marvel

A responsive photo-gallery frontend for the Afro-centric API.

## Run locally

1. From this directory, install dependencies with `npm install`.
2. Copy `.env.example` to `.env` if the API is not running at `http://localhost:3000/api`.
3. Start Vite with `npm run dev` and open the URL it prints (normally `http://localhost:5173`).

The backend must be running separately. Browsing, authentication, uploads, likes, and comments use the API routes under `/api/auth` and `/api/photos`.

Gallery members can like or unlike a photograph, add comments, edit their own comments, and delete their own comments. Administrators can also delete comments. Members can upload a JPEG, PNG, or WebP profile picture from their profile page. Reading photo details and comments is public; posting, editing, deleting, liking, and changing profile pictures require sign-in.
