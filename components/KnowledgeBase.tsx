import React, { useState, useMemo } from 'react';
import { trackEngagement } from './AnalyticsTracker.tsx';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: Date;
  helpful: number;
  views: number;
}

interface KnowledgeBaseProps {
  onClose: () => void;
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with VidScriptHub',
    content: `Welcome to VidScriptHub! This guide will help you get started with creating viral scripts.

## Step 1: Account Setup
1. Sign up for your VidScriptHub account
2. Verify your email address
3. Complete your profile setup

## Step 2: Creating Your First Script
1. Navigate to the Script Generator
2. Enter your niche or topic
3. Select your target platform (YouTube, TikTok, Instagram)
4. Choose your preferred tone
5. Click "Generate Script"

## Step 3: Customizing Your Script
- Edit the generated script to match your style
- Add your personal touch
- Include relevant hashtags
- Preview before finalizing

## Tips for Success
- Be specific with your niche
- Use trending topics
- Keep scripts concise
- Test different approaches`,
    category: 'Getting Started',
    tags: ['beginner', 'setup', 'first-script'],
    lastUpdated: new Date('2024-01-15'),
    helpful: 127,
    views: 1250
  },
  {
    id: '2',
    title: 'Understanding AI Script Generation',
    content: `VidScriptHub uses advanced AI technology to generate viral scripts. Here's how it works:

## How Our AI Works
Our AI analyzes millions of viral videos to understand what makes content go viral. It considers:
- Trending topics
- Platform-specific algorithms
- Engagement patterns
- Audience preferences

## Best Practices
1. **Be Specific**: The more specific your input, the better the output
2. **Use Keywords**: Include relevant keywords in your description
3. **Target Platform**: Different platforms have different preferences
4. **Test and Iterate**: Try different approaches to find what works

## Common Mistakes to Avoid
- Being too vague in your description
- Not considering your target audience
- Ignoring platform-specific requirements
- Not customizing the generated content`,
    category: 'AI Features',
    tags: ['ai', 'generation', 'best-practices'],
    lastUpdated: new Date('2024-01-10'),
    helpful: 89,
    views: 890
  },
  {
    id: '3',
    title: 'Platform-Specific Optimization',
    content: `Each social media platform has unique characteristics. Here's how to optimize for each:

## YouTube
- **Length**: 8-15 minutes for optimal engagement
- **Hook**: First 15 seconds are crucial
- **Structure**: Problem → Solution → Call to Action
- **Keywords**: Use relevant keywords in title and description

## TikTok
- **Length**: 15-60 seconds
- **Hook**: First 3 seconds must grab attention
- **Trends**: Follow current trends and challenges
- **Hashtags**: Use 3-5 relevant hashtags

## Instagram
- **Length**: 30-60 seconds for Reels
- **Visual**: Focus on visual storytelling
- **Hashtags**: Use 10-20 relevant hashtags
- **Engagement**: Ask questions to encourage comments

## LinkedIn
- **Professional**: Keep content professional
- **Value**: Provide actionable insights
- **Length**: 1-3 minutes
- **Networking**: Encourage professional connections`,
    category: 'Platforms',
    tags: ['youtube', 'tiktok', 'instagram', 'linkedin'],
    lastUpdated: new Date('2024-01-12'),
    helpful: 156,
    views: 2100
  },
  {
    id: '4',
    title: 'Troubleshooting Common Issues',
    content: `Having trouble with VidScriptHub? Here are solutions to common issues:

## Script Generation Issues
**Problem**: Scripts not generating
**Solution**: 
- Check your internet connection
- Clear browser cache
- Try refreshing the page
- Contact support if issue persists

**Problem**: Low-quality scripts
**Solution**:
- Be more specific in your description
- Use relevant keywords
- Try different niches
- Adjust your tone preferences

## Account Issues
**Problem**: Can't access account
**Solution**:
- Check your email for verification
- Reset your password
- Clear browser cookies
- Try incognito mode

## Payment Issues
**Problem**: Payment not processing
**Solution**:
- Check your payment method
- Verify billing information
- Contact your bank
- Try a different payment method`,
    category: 'Troubleshooting',
    tags: ['issues', 'problems', 'solutions'],
    lastUpdated: new Date('2024-01-08'),
    helpful: 78,
    views: 650
  },
  {
    id: '5',
    title: 'Advanced Features Guide',
    content: `Unlock the full potential of VidScriptHub with these advanced features:

## Custom Templates
Create your own script templates:
1. Go to Templates section
2. Click "Create New Template"
3. Define your structure
4. Save for future use

## Batch Generation
Generate multiple scripts at once:
1. Select "Batch Mode"
2. Upload your topics list
3. Choose your preferences
4. Generate all scripts

## Analytics Integration
Track your script performance:
1. Connect your social media accounts
2. Enable analytics tracking
3. Monitor engagement metrics
4. Optimize based on data

## Team Collaboration
Work with your team:
1. Invite team members
2. Share scripts and templates
3. Collaborate on projects
4. Track team performance`,
    category: 'Advanced',
    tags: ['templates', 'batch', 'analytics', 'collaboration'],
    lastUpdated: new Date('2024-01-05'),
    helpful: 45,
    views: 320
  }
];

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = ['All', ...Array.from(new Set(mockArticles.map(article => article.category)))];

  const filteredArticles = useMemo(() => {
    let filtered = mockArticles;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    trackEngagement('knowledge_base_article_view', { articleId: article.id, title: article.title });
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const handleHelpful = (articleId: string) => {
    trackEngagement('knowledge_base_helpful', { articleId });
    // In real implementation, this would update the helpful count
  };

  if (selectedArticle) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Articles</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <article>
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-[#DAFF00] text-[#1A0F3C] px-2 py-1 rounded-full font-medium">
                  {selectedArticle.category}
                </span>
                <span>Updated {selectedArticle.lastUpdated.toLocaleDateString()}</span>
                <span>{selectedArticle.views} views</span>
                <span>{selectedArticle.helpful} found helpful</span>
              </div>
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {selectedArticle.content}
              </div>
            </div>

            <footer className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleHelpful(selectedArticle.id)}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>Was this helpful?</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Tags:</span>
                  <div className="flex space-x-1">
                    {selectedArticle.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </footer>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Knowledge Base
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DAFF00] focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#DAFF00] text-[#1A0F3C]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.804-6.2-2.15M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
            </div>
          ) : (
            filteredArticles.map(article => (
              <div
                key={article.id}
                onClick={() => handleArticleClick(article)}
                className="border border-gray-200 rounded-lg p-6 hover:border-[#DAFF00] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-[#1A0F3C] transition-colors">
                    {article.title}
                  </h3>
                  <span className="bg-[#DAFF00] text-[#1A0F3C] px-2 py-1 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {article.content.substring(0, 150)}...
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Updated {article.lastUpdated.toLocaleDateString()}</span>
                    <span>{article.views} views</span>
                    <span>{article.helpful} found helpful</span>
                  </div>
                  
                  <div className="flex space-x-1">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-gray-400 text-xs">+{article.tags.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for?
          </p>
          <div className="flex justify-center space-x-4">
            <button className="text-[#DAFF00] hover:text-[#B8E600] font-medium transition-colors">
              Contact Support
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-[#DAFF00] hover:text-[#B8E600] font-medium transition-colors">
              Request Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};






