# Vid Script Hub - Vercel Deployment Guide

This guide provides the simple, definitive steps to deploy your application to Vercel successfully.

## Deployment Process

The project is configured for a seamless deployment experience. Vercel will automatically build the serverless function and serve the static application.

1.  **Push to Git**: Ensure your latest code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

2.  **Import to Vercel**:
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click "Add New... -> Project".
    *   Import the Git repository for this project.

3.  **Configure Environment Variables**:
    *   During the import process, or in the project's **Settings -> Environment Variables** section, add the following:
        *   `API_KEY`: Your Google AI (Gemini) API Key.
        *   `SUPABASE_SERVICE_ROLE_KEY`: Your secret service role key from your Supabase project settings.

4.  **Deploy**:
    *   Click the "Deploy" button.
    *   Vercel will automatically use the `vercel.json` file to configure the build and deployment.

That's it! Your application will be deployed and accessible without any 404 errors. Every time you push a new commit to your main branch, Vercel will automatically redeploy the latest version.

---

### Troubleshooting

*   **Function Errors (500)**: This is almost always caused by missing or incorrect Environment Variables. Go to your project's settings on Vercel and double-check that `API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are correctly set.
*   **404 Errors**: The `vercel.json` in this project is specifically configured to prevent this. If you encounter this, ensure the `builds` configuration within `vercel.json` has not been altered.
