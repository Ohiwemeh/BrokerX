import MotionFade from "./MotionFade";
import { FaWallet, FaTools, FaShieldAlt } from "react-icons/fa";

export default function Features() {
  return (
    <section id="features" className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <MotionFade className="p-6 border rounded-lg" delay={0.05}>
            <div className="flex items-start gap-4">
              <div className="text-sky-600 text-2xl p-3 bg-sky-50 rounded-md"><FaWallet /></div>
              <div>
                <h3 className="font-semibold text-slate-800">Demo funds & portfolio</h3>
                <p className="mt-2 text-sm text-slate-600">Begin with virtual capital to try strategies and learn without risk.</p>
              </div>
            </div>
          </MotionFade>

          <MotionFade className="p-6 border rounded-lg" delay={0.1}>
            <div className="flex items-start gap-4">
              <div className="text-sky-600 text-2xl p-3 bg-sky-50 rounded-md"><FaTools /></div>
              <div>
                <h3 className="font-semibold text-slate-800">Tools & charts</h3>
                <p className="mt-2 text-sm text-slate-600">Candlesticks, indicators, and historical data to refine your edge.</p>
              </div>
            </div>
          </MotionFade>

          <MotionFade className="p-6 border rounded-lg" delay={0.15}>
            <div className="flex items-start gap-4">
              <div className="text-sky-600 text-2xl p-3 bg-sky-50 rounded-md"><FaShieldAlt /></div>
              <div>
                <h3 className="font-semibold text-slate-800">Safe learning space</h3>
                <p className="mt-2 text-sm text-slate-600">Everything is simulated — keep your real capital safe while you learn.</p>
              </div>
            </div>
          </MotionFade>
        </div>
      </div>
    </section>
  );
}
