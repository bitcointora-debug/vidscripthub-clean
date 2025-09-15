# Vid Script Hub - Vercel Deployment Guide

Follow these steps to deploy your application to Vercel successfully.

## 1. Project Setup on Vercel

1.  Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2.  Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click "Add New... -> Project".
3.  Import the Git repository you just created.
4.  Vercel will ask you to configure your project.

## 2. Configure Your Project

-   **Framework Preset**: Select **Other**.
-   **Build and Output Settings**: You can leave these as they are. No build command is necessary for this project's current setup.
-   **Root Directory**: Leave as default (`./`).

## 3. Add Environment Variables (CRITICAL STEP)

This is the most important step. Your application's server-side functions will not work without these.

Go to your project's **Settings** tab on Vercel, then navigate to the **Environment Variables** section. Add the following variables:

| Name                        | Value                                                              | Description                                                                                             |
| --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `API_KEY`                   | `Your_Google_AI_API_Key`                                           | This is your API key for the Gemini API. You can get this from [Google AI Studio](https://aistudio.google.com/app/apikey). |
| `SUPABASE_SERVICE_ROLE_KEY` | `Your_Supabase_Service_Role_Key`                                   | This key is needed to send client email invitations from the server. Find it in your Supabase project's **Settings -> API** section. **Keep this key secret!** |

## 4. Deploy

After configuring the environment variables, click the "Deploy" button. Vercel will deploy your site and serverless functions.

Once deployed, your app should be live and fully functional without any 404 errors.

---

### If You Encounter Issues

-   **Function Errors (500)**: Double-check that your Environment Variables are correctly copied and pasted into your Vercel project settings. This is the most common cause of errors.
-   **404 Errors**: The `vercel.json` file in this project is configured to prevent this. If it still occurs, ensure no changes were made to the `rewrites` rule.