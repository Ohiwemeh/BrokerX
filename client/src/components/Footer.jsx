export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 text-slate-600">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="text-2xl font-bold text-sky-700">pinnacletradefx</div>
            <p className="mt-2 text-sm">Practice trading — learn with confidence.</p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h5 className="font-semibold mb-2">Products</h5>
              <ul className="space-y-1">
                <li>Markets</li>
                <li>Platform</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Company</h5>
              <ul className="space-y-1">
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-slate-400">© pinnacletradefx 2024. Demo environment only.</div>
      </div>
    </footer>
  );
}
