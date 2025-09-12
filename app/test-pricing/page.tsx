'use client';

import { useEffect, useState } from 'react';
import { capturePriceParameter, getStoredPriceParameter, getPriceByParam, clearPriceParameter, getPriceParameterSummary } from '../utils/priceTracking';

export default function TestPricingPage() {
  const [priceData, setPriceData] = useState<any>(null);
  const [storedPr, setStoredPr] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    // Capture price parameter from URL on page load
    capturePriceParameter();
    
    // Get stored parameter and price data
    const stored = getStoredPriceParameter();
    setStoredPr(stored);
    
    const data = getPriceByParam();
    setPriceData(data);
    
    const paramSummary = getPriceParameterSummary();
    setSummary(paramSummary);
  }, []);

  const handleRefresh = () => {
    const stored = getStoredPriceParameter();
    setStoredPr(stored);
    
    const data = getPriceByParam();
    setPriceData(data);
    
    const paramSummary = getPriceParameterSummary();
    setSummary(paramSummary);
  };

  const handleClear = () => {
    clearPriceParameter();
    setStoredPr(null);
    setPriceData(null);
    setSummary('No price parameter stored');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Price Parameter Testing</h1>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">How to Test</h2>
        <p className="mb-2">Add <code className="bg-gray-200 px-2 py-1 rounded">?pr=1419</code> or <code className="bg-gray-200 px-2 py-1 rounded">?pr=2324</code> to the URL to test the system:</p>
        <ul className="list-disc list-inside space-y-1">
          <li><a href="/test-pricing?pr=1419" className="text-blue-600 hover:underline">Test with pr=1419 (Price: €39.8)</a></li>
          <li><a href="/test-pricing?pr=2324" className="text-blue-600 hover:underline">Test with pr=2324 (Price: €49.8)</a></li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-3">
            <div>
              <strong>Summary:</strong> {summary}
            </div>
            <div>
              <strong>Stored PR Parameter:</strong> {storedPr || 'None'}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleRefresh}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Refresh
              </button>
              <button 
                onClick={handleClear}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Cookie
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Price Configuration</h2>
          {priceData ? (
            <div className="space-y-2">
              <div><strong>PR ID:</strong> {priceData.pr_id}</div>
              <div><strong>Price:</strong> €{priceData.price}</div>
              <div><strong>Number of Stands:</strong> {priceData.number_of_stands}</div>
              <div><strong>Local SEO:</strong> {priceData.local_seo ? 'Yes' : 'No'}</div>
              <div><strong>Full Service:</strong> {priceData.full_service ? 'Yes' : 'No'}</div>
              <div><strong>Shipping:</strong> €{priceData.shipping}</div>
              <div><strong>Voucher:</strong> {priceData.voucher ? 'Available' : 'Not Available'}</div>
              <div><strong>Voucher Discount:</strong> {(priceData.voucher_percent * 100)}%</div>
              <div><strong>Payment Link:</strong> <a href={priceData.payment_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{priceData.payment_link}</a></div>
            </div>
          ) : (
            <p className="text-gray-500">No price configuration found. Add ?pr=1419 or ?pr=2324 to the URL to test.</p>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Expected Results:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>pr=1419:</strong>
            <ul className="list-disc list-inside mt-1">
              <li>Price: €39.8</li>
              <li>Payment Link: ...4gMfZibNdd0SfAJf9VcEw06</li>
            </ul>
          </div>
          <div>
            <strong>pr=2324:</strong>
            <ul className="list-disc list-inside mt-1">
              <li>Price: €49.8</li>
              <li>Payment Link: ...6oU5kE7wXe4Wagpe5RcEw00</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}