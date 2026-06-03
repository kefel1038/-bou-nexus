
export default function Footer() {
  return (
    <footer className="bg-bou-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center w-10 h-10">
                <img src="/logo.jpg" alt="Bank of Uganda Logo" className="h-full w-full object-contain rounded" />
              </div>
              <span className="font-bold text-lg">BoU Nexus</span>
            </div>
            <p className="text-bou-200 text-sm max-w-md">
              Uganda Financial Inclusion & Intelligence Platform.
              One Platform. Every Ugandan. Every Financial Service.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-bou-200 text-sm uppercase tracking-wider mb-3">Platform</h3>
            <ul className="space-y-2">
              {["Treasury", "Credit Scoring", "Consumer Protection", "Fraud Sentinel"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-bou-300 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-bou-200 text-sm uppercase tracking-wider mb-3">Portals</h3>
            <ul className="space-y-2">
              {["Citizen", "Farmer", "SME", "Bank of Uganda"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-bou-300 hover:text-white text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-bou-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-bou-300 text-sm">
            &copy; {new Date().getFullYear()} Bank of Uganda. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Security"].map((item) => (
              <a key={item} href="#" className="text-bou-300 hover:text-white text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
