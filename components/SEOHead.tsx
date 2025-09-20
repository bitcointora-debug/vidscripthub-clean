import React from 'react';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
    title = "VidScriptHub - AI-Powered Viral Video Script Generator | Create Viral Content in 37 Seconds",
    description = "Generate unlimited viral video scripts with Google-powered AI. Create engaging content for YouTube, TikTok, Instagram, and more. Join 10,000+ creators getting millions of views. Start free today!",
    keywords = "viral video scripts, AI script generator, YouTube content, TikTok scripts, Instagram reels, viral content, video marketing, content creation, AI writing, script writing, video production, social media content, viral marketing, content strategy, video scripts, AI content, automated scripts, viral videos, content creator, video marketing tools",
    image = "https://vidscripthub.com/images/vidscripthub-og-image.jpg",
    url = "https://vidscripthub.com",
    type = "website"
}) => {
    return (
        <>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="VidScriptHub" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="revisit-after" content="7 days" />
            <meta name="distribution" content="global" />
            <meta name="rating" content="general" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="VidScriptHub" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
            <meta property="twitter:creator" content="@vidscripthub" />
            <meta property="twitter:site" content="@vidscripthub" />

            {/* Additional SEO Meta Tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
            <meta name="theme-color" content="#DAFF00" />
            <meta name="msapplication-TileColor" content="#DAFF00" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="VidScriptHub" />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />

            {/* Favicon */}
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />

            {/* Preconnect to external domains */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
            <link rel="preconnect" href="https://www.googletagmanager.com" />

            {/* DNS Prefetch for performance */}
            <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            <link rel="dns-prefetch" href="//fonts.gstatic.com" />
            <link rel="dns-prefetch" href="//www.google-analytics.com" />
            <link rel="dns-prefetch" href="//www.googletagmanager.com" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "SoftwareApplication",
                    "name": "VidScriptHub",
                    "description": description,
                    "url": url,
                    "image": image,
                    "applicationCategory": "BusinessApplication",
                    "operatingSystem": "Web Browser",
                    "offers": {
                        "@type": "Offer",
                        "price": "27",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "ratingCount": "10000"
                    },
                    "author": {
                        "@type": "Organization",
                        "name": "VidScriptHub",
                        "url": "https://vidscripthub.com"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "VidScriptHub",
                        "url": "https://vidscripthub.com"
                    }
                })}
            </script>

            {/* Additional Structured Data for Product */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": "VidScriptHub - AI Viral Script Generator",
                    "description": "AI-powered viral video script generator that creates engaging content for YouTube, TikTok, Instagram, and more in under 40 seconds.",
                    "image": image,
                    "url": url,
                    "brand": {
                        "@type": "Brand",
                        "name": "VidScriptHub"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": "27",
                        "priceCurrency": "USD",
                        "availability": "https://schema.org/InStock",
                        "validFrom": "2024-01-01",
                        "priceValidUntil": "2024-12-31"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "ratingCount": "10000",
                        "bestRating": "5",
                        "worstRating": "1"
                    },
                    "review": [
                        {
                            "@type": "Review",
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": "5",
                                "bestRating": "5"
                            },
                            "author": {
                                "@type": "Person",
                                "name": "Sarah Chen"
                            },
                            "reviewBody": "My first video using a VidScriptHub script hit 15,000 views overnight. I'm not exaggerating!"
                        },
                        {
                            "@type": "Review",
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": "5",
                                "bestRating": "5"
                            },
                            "author": {
                                "@type": "Person",
                                "name": "Mike Rodriguez"
                            },
                            "reviewBody": "I used to spend a full day on research and writing. Now I generate a week's worth of ideas in 5 minutes."
                        }
                    ]
                })}
            </script>
        </>
    );
};






