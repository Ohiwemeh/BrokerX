import MotionFade from "./MotionFade";

export default function Platform() {
  return (
    <section id="platform" className="bg-white/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <MotionFade>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">Pushing your trading forward</h2>
              <p className="mt-4 text-slate-600 max-w-xl">
                Practice with realistic spreads and real-time crypto prices. Try market and limit orders, view ledger updates, and track performance.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#signup" className="bg-sky-600 text-white px-4 py-2 rounded-md">Open demo account</a>
                <a href="#platform" className="border border-sky-600 px-4 py-2 rounded-md text-sky-600">Learn about pricing</a>
              </div>
            </div>
          </MotionFade>

          <MotionFade>
            <div className="bg-slate-50 border rounded-lg p-6">
              <div className="text-6xl font-bold text-slate-800">0.0</div>
              <div className="text-sm text-slate-500 mt-1">Spreads as low as</div>
            </div>
          </MotionFade>
        </div>
      </div>
    </section>
  );
}
