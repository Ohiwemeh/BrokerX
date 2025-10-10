import MotionFade from "./MotionFade";
import articles from "../data/articles";

export default function Articles() {
  return (
    <section id="articles" className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-semibold">Latest articles</h3>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {articles.map((a, idx) => (
            <MotionFade key={a.id} className="bg-white text-slate-900 rounded-lg overflow-hidden shadow" delay={0.05 * idx}>
              <img src={a.img} alt={a.title} className="w-full h-40 object-cover"/>
              <div className="p-4">
                <div className="text-xs text-slate-500">{a.date} • {a.author}</div>
                <h4 className="font-semibold mt-2">{a.title}</h4>
                <p className="text-sm mt-2 text-slate-600">{a.excerpt}</p>
                <div className="mt-3">
                  <a href="#" className="text-sky-600 text-sm">Read more →</a>
                </div>
              </div>
            </MotionFade>
          ))}
        </div>
      </div>
    </section>
  );
}
