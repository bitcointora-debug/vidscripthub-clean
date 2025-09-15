
// Helper function to trigger a file download in the browser
const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const downloadEmailSwipes = () => {
    const content = `
SUBJECT: Ethically 'Clone' Viral Videos with this new AI...

BODY:

Hey [Name],

Ever feel like you're just guessing what will go viral?

You spend hours creating a video you think is great, only for it to get less than 200 views. It's frustrating.

But what if you could use a tool that analyzes what's ALREADY working, and writes you unique scripts based on those proven formulas?

That's exactly what Vid Script Hub does.

It's a new Google-powered AI that:
- Instantly ends 'creator's block'.
- Automates 99% of your content research.
- Generates unlimited scripts for TikTok, Reels & Shorts.

I've been using it and the results are insane.

If you're tired of guessing, you need to check this out.

>> [INSERT YOUR RESELLER LINK HERE]

Talk soon,
[Your Name]

---
SWIPE 2 - Short & Punchy
---

SUBJECT: Steal my viral script formula...

BODY:

Tired of your videos flopping?

This new AI tool is like a cheat code.

It finds the top-performing videos in your niche and writes you fresh scripts based on their viral structure.

It's genius. And it works.

Get your first viral script in the next 5 minutes:
>> [INSERT YOUR RESELLER LINK HERE]

Cheers,
[Your Name]
`;
    downloadFile('VidScriptHub_Email_Swipes.txt', content, 'text/plain;charset=utf-8');
};

export const downloadGraphicsPack = () => {
    const content = `
This is a placeholder for your graphics pack.

In the final version, this file will be a .zip archive containing:
- High-resolution promotional banners in various sizes.
- Social media graphics (for Facebook, Instagram, Twitter).
- E-cover images for the product and bonuses.
- Lifestyle mockups of the app in use.

Thank you for being a reseller!
- The Vid Script Hub Team
`;
    downloadFile('VidScriptHub_Graphics_Pack_Placeholder.txt', content, 'text/plain;charset=utf-8');
};