# Vercel Deployment Instructions for Tamil Nadu Sports Shop Mapping System

This document outlines the steps to deploy the Tamil Nadu Sports Shop Mapping System on Vercel.

## Prerequisites

1. **Vercel Account**: Ensure you have a Vercel account. If not, sign up at [vercel.com](https://vercel.com).
2. **Git Repository**: Your project should be pushed to a Git repository (GitHub, GitLab, or Bitbucket).

## Steps to Deploy

1. **Login to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in to your account.

2. **Import Project**:
   - Click on the "New Project" button on your Vercel dashboard.
   - Select the Git provider where your project is hosted (e.g., GitHub).
   - Authorize Vercel to access your repositories if prompted.
   - Choose the repository containing your Tamil Nadu Sports Shop Mapping System.

3. **Configure Project Settings**:
   - Vercel will automatically detect the framework (Vite) and set the build settings.
   - Ensure the following settings are correct:
     - **Framework Preset**: Vite
     - **Build Command**: `npm run build` (or `yarn build` if using Yarn)
     - **Output Directory**: `client/dist` (or the directory where your build files are located)

4. **Environment Variables**:
   - In the "Environment Variables" section, add the necessary environment variables from your `.env.example` file:
     - `VITE_GOOGLE_MAPS_API_KEY`
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

5. **Deploy**:
   - Click the "Deploy" button to start the deployment process.
   - Vercel will build your project and deploy it. You can monitor the deployment logs for any errors.

6. **Access Your Application**:
   - Once the deployment is complete, Vercel will provide a unique URL for your application.
   - Visit the URL to see your Tamil Nadu Sports Shop Mapping System live!

## Post-Deployment

- **Custom Domain**: If you want to use a custom domain, you can add it in the Vercel dashboard under the "Domains" section.
- **Continuous Deployment**: Any future pushes to the main branch of your repository will automatically trigger a new deployment.

## Troubleshooting

- If you encounter issues during deployment, check the build logs for errors.
- Ensure all environment variables are correctly set and that your project builds successfully locally before deploying.

For further assistance, refer to the [Vercel Documentation](https://vercel.com/docs).