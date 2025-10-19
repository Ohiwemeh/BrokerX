import MotionFade from "./MotionFade";

export default function Hero() {
  return (
    <section id="hero" className="pt-2">
      <div className="relative bg-gradient-to-b from-sky-900 via-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <MotionFade>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">Take your trading to new heights</h1>
              <p className="mt-6 text-slate-200 max-w-xl">
                Trade stocks and crypto with simulated capital — learn strategies, test ideas, and track your performance in a realistic demo environment.
              </p>

              <div className="mt-8 flex gap-4">
                <a href="#signup" className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-medium">Open an account</a>
                <a href="#signup" className="border border-white/40 hover:bg-white/5 text-white px-5 py-2 rounded-full">Try a demo account</a>
              </div>

              <p className="mt-6 text-xs text-slate-300 max-w-md">
                * REAL TRADING INVOLVES RISK.pinnacletradefx is a demo environment only. All trading is simulated. Past performance does not guarantee future results.
              </p>
            </MotionFade>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img src="https://picsum.photos/900/520?blur=2" alt="hero" className="w-full h-full object-cover" />
              <div className="absolute right-6 top-6 bg-white/10 text-white px-3 py-2 rounded-md text-sm">4% APY</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 text-center text-sm text-slate-200">
            Our customers rate us excellent — practice trading with confidence.
          </div>
        </div>
      </div>
    </section>
  );
}
