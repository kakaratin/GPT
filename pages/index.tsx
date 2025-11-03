import { useState } from 'react';
import Head from 'next/head';

interface Account {
  account: string;
  password: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'purchase' | 'howto'>('purchase');
  const [service, setService] = useState<'Vsphone' | 'Vmos'>('Vsphone');
  const [accounts, setAccounts] = useState<Account[]>([{ account: '', password: '' }]);
  const [bulkInput, setBulkInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const addAccount = () => {
    setAccounts([...accounts, { account: '', password: '' }]);
  };

  const removeAccount = (index: number) => {
    setAccounts(accounts.filter((_, i) => i !== index));
  };

  const updateAccount = (index: number, field: 'account' | 'password', value: string) => {
    const newAccounts = [...accounts];
    newAccounts[index][field] = value;
    setAccounts(newAccounts);
  };

  const parseBulkInput = () => {
    const lines = bulkInput.split('\n').filter(line => line.trim());
    const parsedAccounts: Account[] = [];

    lines.forEach(line => {
      if (line.includes('|')) {
        const [account, password] = line.split('|').map(s => s.trim());
        if (account && password) {
          parsedAccounts.push({ account, password });
        }
      }
    });

    if (parsedAccounts.length > 0) {
      setAccounts(parsedAccounts);
      setBulkInput('');
      setResult({ success: true, message: `Successfully parsed ${parsedAccounts.length} account(s)!` });
    } else {
      setResult({ success: false, message: 'Invalid format. Use: email|password (one per line)' });
    }
  };

  // Generate request signature
  const generateSignature = async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const secretKey = 'tdjs_2025_secure_key_' + (typeof window !== 'undefined' ? window.location.hostname : '');
    const keyBuffer = encoder.encode(secretKey);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const filteredAccounts = accounts.filter(acc => acc.account && acc.password);
      const timestamp = Date.now();
      const dataToSign = `${service}${JSON.stringify(filteredAccounts)}${timestamp}`;
      const signature = await generateSignature(dataToSign);

      const response = await fetch('/api/buy-cloud-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service,
          accounts: filteredAccounts,
          timestamp,
          signature,
        }),
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        message: data.message || (response.ok ? 'Purchase successful!' : 'Purchase failed'),
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>TdjsBuytool - Cloud Phone Purchase Automation</title>
        <meta name="description" content="Automate your cloud phone purchases" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="text-center mb-6">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-3 animate-pulse">
              TdjsBuytool
            </h1>
            <p className="text-gray-300 text-xl font-light">
              Advanced Cloud Phone Automation System
            </p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center mb-6">
            <a 
              href="https://www.facebook.com/share/16TXgXRaBb/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-medium">Follow on Facebook</span>
            </a>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg p-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700">
              <button
                onClick={() => setActiveTab('purchase')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'purchase'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Purchase
              </button>
              <button
                onClick={() => setActiveTab('howto')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'howto'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                How It Works
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'purchase' ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Bulk Input Card */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Quick Import</h2>
                </div>
                
                <p className="text-gray-400 mb-4">
                  Paste your accounts in this format (one per line):
                </p>
                <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-600">
                  <code className="text-cyan-400 text-sm">
                    email@example.com|password123<br/>
                    another@example.com|pass456
                  </code>
                </div>

                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="email@example.com|password123&#10;another@example.com|pass456"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none h-32 resize-none font-mono text-sm"
                />

                <button
                  type="button"
                  onClick={parseBulkInput}
                  className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  Parse Accounts
                </button>
              </div>

              {/* Main Form Card */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Service Selection</h2>
                  </div>

                  {/* Service Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setService('Vsphone')}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        service === 'Vsphone'
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/50'
                          : 'border-slate-600 text-gray-400 hover:border-slate-500'
                      }`}
                    >
                      Vsphone
                    </button>
                    <button
                      type="button"
                      onClick={() => setService('Vmos')}
                      className={`p-4 rounded-xl border-2 font-medium transition-all ${
                        service === 'Vmos'
                          ? 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/50'
                          : 'border-slate-600 text-gray-400 hover:border-slate-500'
                      }`}
                    >
                      Vmos
                    </button>
                  </div>

                  {/* Accounts */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Account Credentials ({accounts.length})
                    </label>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {accounts.map((account, index) => (
                        <div key={index} className="flex gap-2 items-start bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                          <div className="flex-1 grid grid-cols-1 gap-2">
                            <input
                              type="text"
                              placeholder="Email/Username"
                              value={account.account}
                              onChange={(e) => updateAccount(index, 'account', e.target.value)}
                              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
                              required
                            />
                            <input
                              type="password"
                              placeholder="Password"
                              value={account.password}
                              onChange={(e) => updateAccount(index, 'password', e.target.value)}
                              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-sm"
                              required
                            />
                          </div>
                          {accounts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAccount(index)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addAccount}
                      className="mt-3 text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Another Account
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-700 hover:via-pink-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg text-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Purchase Cloud Phone'
                    )}
                  </button>
                </form>

                {/* Result Message */}
                {result && (
                  <div className={`mt-6 p-4 rounded-xl border ${
                    result.success 
                      ? 'bg-green-500/20 border-green-500 text-green-400' 
                      : 'bg-red-500/20 border-red-500 text-red-400'
                  }`}>
                    <p className="font-medium">{result.message}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* How It Works Tab */
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">How TdjsBuytool Works</h2>
              </div>

              <div className="space-y-6 text-gray-300">
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white rounded-full text-sm">1</span>
                    The Trial Problem
                  </h3>
                  <p className="leading-relaxed">
                    Many users face a common issue: after using their trial period on Vsphone or Vmos, they cannot purchase 
                    new trials anymore. The services block you from getting another trial, even if you want to test more features 
                    or use different accounts. This is frustrating when you need temporary cloud phones for testing purposes.
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full text-sm">2</span>
                    How TdjsBuytool Helps
                  </h3>
                  <p className="leading-relaxed">
                    TdjsBuytool solves this problem by allowing you to purchase cloud phone trials even when you're blocked 
                    from buying them directly. Our system bypasses the normal restrictions and processes your purchase request 
                    through an alternative method, giving you access to trials that would otherwise be unavailable to you.
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-pink-400 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 bg-pink-500 text-white rounded-full text-sm">3</span>
                    Multiple Account Support
                  </h3>
                  <p className="leading-relaxed">
                    Need trials for multiple accounts? No problem! TdjsBuytool supports bulk purchasing. Simply add all your 
                    accounts using the quick import feature (email|password format), and purchase trials for all of them at once. 
                    This is perfect for users who manage multiple test accounts or need several cloud phones simultaneously.
                  </p>
                </div>

                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm">4</span>
                    Instant Activation
                  </h3>
                  <p className="leading-relaxed">
                    Once you submit your purchase request, TdjsBuytool processes everything automatically and provides instant 
                    feedback. You'll know immediately if your trial purchase was successful or if there were any issues. 
                    No waiting around - get your cloud phone trials activated right away!
                  </p>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-6 border border-cyan-500/50">
                  <h3 className="text-xl font-bold text-white mb-3">Important Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">-</span>
                      <span>Create a new account on Vsphone or Vmos (or use your existing blocked account)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">-</span>
                      <span>Have your account credentials ready (email and password)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">-</span>
                      <span>Use the quick import feature for multiple accounts (email|password format)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">-</span>
                      <span>Works even if you've already used your trial before!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto mt-12 text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <p className="text-gray-400 text-sm">
              ? 2025 TdjsBuytool. All rights reserved. | Powered by Advanced Automation Technology
            </p>
            <div className="mt-3 flex justify-center gap-4">
              <a href="https://www.facebook.com/share/16TXgXRaBb/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
