
# Kërçishta Garage Implementation Guide

This project is now configured for a **Vercel + MongoDB** deployment.

## 1. Backend Setup (MongoDB)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster and a database named `kercishta`.
3. Create two collections: `leads` and `records`.
4. Go to **Database Access** and create a user with read/write permissions.
5. Go to **Network Access** and whitelist `0.0.0.0/0` (standard for Vercel).
6. Copy your **Connection String**.

## 2. Vercel Deployment
1. Import your project into Vercel.
2. In the **Environment Variables** section, add:
   - `MONGODB_URI`: Your connection string (replace `<password>` with your DB user's password).
   - `ADMIN_PASSWORD`: Set your secret dashboard password (e.g., `otrotr`).
   - `API_KEY`: Your Gemini API Key for logo generation.

## 3. Local Development
To run this locally with the backend:
1. Install [Vercel CLI](https://vercel.com/cli): `npm i -g vercel`.
2. Run `vercel dev` to start the frontend and backend concurrently.

## 4. Admin Access
The dashboard is no longer visible on the main site navigation. 
To access it, manually navigate to `/admin` in your browser.
The system will check for the `kg_token` in session storage to keep you logged in.

## 5. Security
- The backend checks for a `Bearer` token in the `Authorization` header on all sensitive routes.
- The token is verified directly against the server-side `ADMIN_PASSWORD` variable.
