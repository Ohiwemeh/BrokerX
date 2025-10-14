import { useState, useEffect } from "react";
import MotionFade from "./MotionFade";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using CryptoCompare News API (free, no API key required)
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest');
        const data = await response.json();
        
        if (data.Data) {
          // Get first 6 articles
          const newsArticles = data.Data.slice(0, 6).map(article => ({
            id: article.id,
            title: article.title,
            excerpt: article.body.substring(0, 120) + '...',
            img: article.imageurl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
            date: new Date(article.published_on * 1000).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            author: article.source,
            url: article.url
          }));
          setArticles(newsArticles);
        }
      } catch (error) {
        console.error('Failed to fetch news:', error);
        // Fallback to placeholder if API fails
        setArticles([
          {
            id: 1,
            title: 'Bitcoin Reaches New Heights',
            excerpt: 'Cryptocurrency market shows strong momentum as Bitcoin breaks previous records...',
            img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
            date: 'Dec 15, 2024',
            author: 'Crypto News',
            url: '#'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section id="articles" className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold">Latest Crypto News</h3>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-800 rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-40 sm:h-48 bg-slate-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-slate-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {articles.map((a, idx) => (
              <MotionFade key={a.id} className="bg-white text-slate-900 rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow" delay={0.05 * idx}>
                <img src={a.img} alt={a.title} className="w-full h-40 sm:h-48 object-cover"/>
                <div className="p-4">
                  <div className="text-xs text-slate-500 truncate">{a.date} • {a.author}</div>
                  <h4 className="font-semibold mt-2 line-clamp-2 text-sm sm:text-base">{a.title}</h4>
                  <p className="text-xs sm:text-sm mt-2 text-slate-600 line-clamp-3">{a.excerpt}</p>
                  <div className="mt-3">
                    <a 
                      href={a.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sky-600 text-xs sm:text-sm hover:text-sky-700 font-medium"
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              </MotionFade>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
