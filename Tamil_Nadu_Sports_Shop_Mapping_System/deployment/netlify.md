# Netlify Deployment Instructions for Tamil Nadu Sports Shop Mapping System

This document outlines the steps to deploy the Tamil Nadu Sports Shop Mapping System on Netlify.

## Prerequisites

1. **Netlify Account**: Ensure you have a Netlify account. If not, sign up at [Netlify](https://www.netlify.com/).
2. **Git Repository**: Your project should be pushed to a Git repository (GitHub, GitLab, or Bitbucket).

## Steps to Deploy

1. **Login to Netlify**:
   - Go to [Netlify](https://app.netlify.com/) and log in to your account.

2. **New Site from Git**:
   - Click on the "New site from Git" button on your Netlify dashboard.

3. **Connect to Your Git Provider**:
   - Choose your Git provider (GitHub, GitLab, or Bitbucket).
   - Authorize Netlify to access your repositories.

4. **Select Your Repository**:
   - Find and select the repository containing your Tamil Nadu Sports Shop Mapping System project.

5. **Configure Your Settings**:
   - **Branch to deploy**: Select the branch you want to deploy (usually `main` or `master`).
   - **Build command**: Enter the build command for your project. For Vite, this is typically:
     ```
     npm run build
     ```
   - **Publish directory**: Set the publish directory to:
     ```
     client/dist
     ```
   - This is where Vite outputs the built files.

6. **Environment Variables**:
   - If your project uses environment variables (like Firebase or Google Maps API keys), go to the "Site settings" > "Build & deploy" > "Environment" section.
   - Add the necessary environment variables as specified in your `.env.example` file.

7. **Deploy Site**:
   - Click on the "Deploy site" button. Netlify will start the deployment process.
   - You can monitor the deployment logs to see if everything is building correctly.

8. **Access Your Site**:
   - Once the deployment is complete, you will receive a unique URL for your site. You can access your deployed application using this URL.

## Continuous Deployment

- Any time you push changes to the selected branch in your Git repository, Netlify will automatically rebuild and redeploy your site.

## Troubleshooting

- If you encounter any issues during deployment, check the build logs for errors.
- Ensure that all dependencies are correctly listed in your `client/package.json` file.
- Verify that your build command and publish directory are set correctly.

## Conclusion

Your Tamil Nadu Sports Shop Mapping System is now deployed on Netlify! You can share the URL with users and continue to make updates through your Git repository.