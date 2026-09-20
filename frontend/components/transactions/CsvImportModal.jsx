'use client';

import React, { useState, useEffect } from 'react';
import { previewImportCsv, importTransactionsCsv } from '../../services/api/transactions';
import { PrimaryButton, SecondaryButton } from '../budget-goals/ThemeCard';

const TARGET_FIELDS = [
  { key: 'date', label: 'Date', required: true },
  { key: 'amount', label: 'Amount (Single Column)', required: false },
  { key: 'debitAmount', label: 'Debit Amount (Withdrawal)', required: false },
  { key: 'creditAmount', label: 'Credit Amount (Deposit)', required: false },
  { key: 'type', label: 'Transaction Type', required: false },
  { key: 'merchant', label: 'Merchant / Payee', required: false },
  { key: 'description', label: 'Description / Remarks', required: false },
  { key: 'category', label: 'Category', required: false },
  { key: 'externalRef', label: 'External Ref / Txn ID', required: false },
  { key: 'paymentMode', label: 'Payment Mode', required: false },
];

/**
 * CsvImportModal Component (CryptoVault Fintech Theme)
 * Two-step CSV import flow with auto-detection & manual column mapping confirmation
 */
export default function CsvImportModal({ isOpen, onClose, onDone }) {
  const [step, setStep] = useState('select'); // 'select' | 'map' | 'summary'
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null); // { headers, previewRows, suggestedMapping, isConfident }
  const [mapping, setMapping] = useState({});
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setFile(null);
      setPreviewData(null);
      setMapping({});
      setIsLoadingPreview(false);
      setIsImporting(false);
      setError('');
      setSummary(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a valid .csv file.');
      return;
    }

    setFile(selectedFile);
    setError('');
    setIsLoadingPreview(true);

    try {
      const res = await previewImportCsv(selectedFile);
      setPreviewData(res);
      setMapping(res.suggestedMapping || {});
      setStep('map');
    } catch (err) {
      setError(err.message || 'Failed to preview CSV file.');
      setStep('select');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleMappingChange = (fieldKey, selectedHeader) => {
    setMapping((prev) => ({
      ...prev,
      [fieldKey]: selectedHeader || null,
    }));
  };

  const handleConfirmImport = async () => {
    if (!file) return;

    if (!mapping.date) {
      setError('Please map a CSV column for the Date field.');
      return;
    }

    if (!mapping.amount && (!mapping.debitAmount || !mapping.creditAmount)) {
      if (!mapping.debitAmount && !mapping.creditAmount) {
        setError('Please map either an Amount column OR both Debit and Credit columns.');
        return;
      }
    }

    setIsImporting(true);
    setError('');

    try {
      const res = await importTransactionsCsv(file, mapping);
      setSummary(res);
      setStep('summary');
    } catch (err) {
      setError(err.message || 'Failed to import CSV transactions.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    if (summary && onDone) {
      onDone();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0E27]/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl p-6 sm:p-7 rounded-[16px] bg-[#0F1633] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white space-y-5 max-h-[90vh] flex flex-col justify-between">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>📥</span> Import Transactions CSV
            </h2>
            <p className="text-xs text-[#8A93B5] mt-0.5">
              {step === 'select' && 'Select a CSV file from your device'}
              {step === 'map' && 'Confirm or adjust column mapping before importing'}
              {step === 'summary' && 'Import summary & record status'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] text-[#8A93B5] hover:text-white flex items-center justify-center transition-colors text-sm focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-[12px] bg-[#FF4D6A]/[0.12] border border-[#FF4D6A]/30 text-[#FF4D6A] text-xs flex items-center gap-2 flex-shrink-0">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto space-y-5 pr-1 flex-1">

          {/* STEP 1: FILE SELECT */}
          {step === 'select' && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/[0.12] hover:border-[#0A84FF]/50 rounded-[14px] bg-[#0B1029]/50 transition-colors text-center cursor-pointer relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={isLoadingPreview}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 rounded-[12px] bg-[#0A84FF]/[0.12] text-[#0A84FF] flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-white">
                  {isLoadingPreview ? 'Scanning CSV headers...' : file ? file.name : 'Click to browse or drag & drop CSV file'}
                </p>
                <p className="text-xs text-[#8A93B5] mt-1">
                  Supports standard bank & card statements (Max 5MB)
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: CONFIRM COLUMN MAPPING */}
          {step === 'map' && previewData && (
            <div className="space-y-5">

              {/* Confidence Alert Notice */}
              {!previewData.isConfident ? (
                <div className="p-3.5 rounded-[12px] bg-[#F5A524]/[0.12] border border-[#F5A524]/30 text-[#F5A524] text-xs flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>We couldn't confidently detect your columns — please confirm the mapping below before importing.</span>
                </div>
              ) : (
                <div className="p-3 rounded-[12px] bg-[#22D36A]/[0.10] border border-[#22D36A]/25 text-[#22D36A] text-xs flex items-center gap-2">
                  <span>✓</span>
                  <span>Columns auto-detected with high confidence. Verify your mappings below.</span>
                </div>
              )}

              {/* Preview Table */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#8A93B5] uppercase tracking-wider">
                  CSV Preview (First {previewData.previewRows.length} Rows)
                </span>
                <div className="overflow-x-auto max-h-40 rounded-[12px] bg-[#0B1029] border border-white/[0.08]">
                  <table className="w-full text-left text-xs text-white divide-y divide-white/[0.06]">
                    <thead className="bg-white/[0.04] text-[#8A93B5]">
                      <tr>
                        {previewData.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 font-semibold whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {previewData.previewRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white/[0.02]">
                          {previewData.headers.map((h, cIdx) => (
                            <td key={cIdx} className="px-3 py-2 whitespace-nowrap text-[#8A93B5]">
                              {row[h] || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Target Field Mapping Dropdowns */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#8A93B5] uppercase tracking-wider">
                  Column Field Mapping
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {TARGET_FIELDS.map((field) => {
                    const currentValue = mapping[field.key] || '';
                    return (
                      <div key={field.key} className="p-3 rounded-[12px] bg-[#0B1029] border border-white/[0.06] space-y-1.5">
                        <label className="block text-xs font-medium text-white flex items-center justify-between">
                          <span>
                            {field.label} {field.required && <span className="text-[#FF4D6A]">*</span>}
                          </span>
                          {currentValue && (
                            <span className="text-[10px] text-[#39FF14] font-mono">Mapped</span>
                          )}
                        </label>
                        <select
                          value={currentValue}
                          onChange={(e) => handleMappingChange(field.key, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-[8px] bg-[#0F1633] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-[#0A84FF]"
                        >
                          <option value="">— None —</option>
                          {previewData.headers.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: SUMMARY RESULT */}
          {step === 'summary' && summary && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-[14px] bg-[#22D36A]/[0.1] border border-[#22D36A]/30 text-white space-y-2">
                <h3 className="text-base font-bold text-[#22D36A] flex items-center gap-2">
                  <span>✓</span> Import Process Complete
                </h3>
                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div className="p-2.5 rounded-[10px] bg-[#0A0E27]/50 border border-white/[0.06]">
                    <div className="text-lg font-bold text-[#39FF14]">{summary.imported || 0}</div>
                    <div className="text-[#8A93B5] text-[11px]">Imported</div>
                  </div>
                  <div className="p-2.5 rounded-[10px] bg-[#0A0E27]/50 border border-white/[0.06]">
                    <div className="text-lg font-bold text-[#F5A524]">{summary.duplicatesSkipped || 0}</div>
                    <div className="text-[#8A93B5] text-[11px]">Duplicates Skipped</div>
                  </div>
                  <div className="p-2.5 rounded-[10px] bg-[#0A0E27]/50 border border-white/[0.06]">
                    <div className="text-lg font-bold text-[#FF4D6A]">{summary.invalidSkipped?.length || 0}</div>
                    <div className="text-[#8A93B5] text-[11px]">Invalid Skipped</div>
                  </div>
                </div>
              </div>

              {/* Invalid Skipped Detail List */}
              {summary.invalidSkipped && summary.invalidSkipped.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-[#8A93B5] uppercase tracking-wider">
                    Skipped Rows Detail ({summary.invalidSkipped.length})
                  </h4>
                  <div className="max-h-36 overflow-y-auto rounded-[12px] bg-[#0B1029] border border-white/[0.08] p-3 space-y-1.5 text-xs">
                    {summary.invalidSkipped.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[#FF4D6A]">
                        <span className="font-mono">Row {item.row}</span>
                        <span>{item.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06] flex-shrink-0">
          {step === 'select' && (
            <SecondaryButton onClick={handleClose}>
              Cancel
            </SecondaryButton>
          )}

          {step === 'map' && (
            <>
              <SecondaryButton onClick={() => setStep('select')} disabled={isImporting}>
                Back to File Select
              </SecondaryButton>
              <PrimaryButton onClick={handleConfirmImport} disabled={isImporting}>
                {isImporting ? 'Importing...' : 'Confirm & Import'}
              </PrimaryButton>
            </>
          )}

          {step === 'summary' && (
            <PrimaryButton onClick={handleClose}>
              Done
            </PrimaryButton>
          )}
        </div>

      </div>
    </div>
  );
}
