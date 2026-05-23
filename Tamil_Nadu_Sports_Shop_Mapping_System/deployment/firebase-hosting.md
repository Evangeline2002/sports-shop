# Firebase Hosting Deployment Instructions

This document provides step-by-step instructions for deploying the "Tamil Nadu Sports Shop Mapping System" to Firebase Hosting.

## Prerequisites

1. **Firebase Account**: Ensure you have a Firebase account. If not, sign up at [Firebase](https://firebase.google.com/).
2. **Firebase CLI**: Install the Firebase CLI globally on your machine. You can do this using npm:

   ```bash
   npm install -g firebase-tools
   ```

3. **Node.js**: Make sure you have Node.js installed on your machine.

## Steps to Deploy

### 1. Initialize Firebase in Your Project

Navigate to the root of your project directory in the terminal and run:

```bash
firebase login
```

This command will prompt you to log in to your Firebase account.

Next, initialize Firebase in your project:

```bash
firebase init
```

During the initialization, select the following options:

- **Hosting**: Configure and deploy Firebase Hosting sites.
- **Use an existing project**: Select your Firebase project from the list.
- **Public directory**: Set this to `client/dist` (or the directory where your built React app will be located).
- **Configure as a single-page app**: Yes.
- **Overwrite index.html**: No.

### 2. Build Your React Application

Before deploying, you need to build your React application. Navigate to the `client` directory and run:

```bash
npm install
npm run build
```

This will create a production-ready build of your application in the `client/dist` directory (or the specified output directory).

### 3. Deploy to Firebase Hosting

After building your application, deploy it to Firebase Hosting by running the following command from the root of your project:

```bash
firebase deploy
```

### 4. Access Your Deployed Application

Once the deployment is complete, the terminal will provide a hosting URL where your application is live. You can access your application using this URL.

## Additional Notes

- Ensure that your Firestore rules are set correctly to allow access as per your application requirements.
- You can update your application and redeploy by repeating the build and deploy steps.

## Troubleshooting

If you encounter any issues during deployment, check the following:

- Ensure that you are in the correct directory when running commands.
- Verify that your Firebase project is correctly set up in the Firebase console.
- Check the Firebase CLI documentation for any specific error messages you may encounter.

By following these steps, you should be able to successfully deploy the "Tamil Nadu Sports Shop Mapping System" to Firebase Hosting.