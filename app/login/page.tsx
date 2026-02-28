export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-lightGrey flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-accentRed rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm leading-none">/</span>
          </div>
          <span className="font-semibold text-gray-800 text-base">Tried and True Media</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email:
              </label>
              <div className="relative">
                <input
                  type="email"
                  defaultValue=""
                  placeholder=""
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-brandBlue focus:border-transparent pr-10"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-brand-accentRed rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold leading-none">···</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Password:
              </label>
              <div className="relative">
                <input
                  type="password"
                  defaultValue=""
                  placeholder=""
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-brandBlue focus:border-transparent pr-10"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-brand-accentRed rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold leading-none">···</span>
                </button>
              </div>
            </div>

            <div className="flex justify-center pt-1">
              <button className="px-8 py-2 bg-brand-brandBlue text-white text-sm font-semibold rounded hover:bg-brand-darkBlue transition-colors uppercase tracking-wider">
                Login
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div>
            <div className="flex items-center gap-4 mb-1">
              <a href="/" className="hover:text-gray-900">Home</a>
              <a href="#" className="hover:text-gray-900">Help</a>
            </div>
            <div>Copyright 2026 © All rights reserved.</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-accentRed rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">/</span>
            </div>
            <span className="font-semibold text-gray-800">Tried and True Media</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
