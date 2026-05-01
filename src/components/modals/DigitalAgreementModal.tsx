'use client';

import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, Check, Download, ShieldCheck, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { generateAgreementPDF } from '@/lib/agreement-pdf';

interface DigitalAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: (signatureUrl: string) => void;
  bookingData: any;
}

export default function DigitalAgreementModal({ isOpen, onClose, onSign, bookingData }: DigitalAgreementModalProps) {
  const [step, setStep] = useState(1);
  const [signing, setSigning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const sigCanvas = useRef<any>(null);

  if (!isOpen) return null;

  const handleDownloadDraft = async () => {
    setDownloading(true);
    try {
      await generateAgreementPDF(bookingData);
      toast.success("Draft agreement downloaded");
    } catch (error) {
      toast.error("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleSign = async () => {
    if (sigCanvas.current.isEmpty()) {
      toast.error("Please provide a signature");
      return;
    }
    
    setSigning(true);
    try {
      const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      // In a real app, we'd upload this to Firebase Storage
      // For now, we simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSign(signatureData);
      toast.success("Agreement signed successfully!");
    } catch (error) {
      toast.error("Signature capture failed");
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase">Digital Rental Agreement</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Legally binding e-signature process</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-6">
                <h3 className="text-lg font-black text-gray-900 uppercase">Terms & Conditions</h3>
                <div className="prose prose-sm text-gray-600 font-medium leading-relaxed">
                  <p>This agreement is made between the <strong>Owner</strong> and the <strong>Tenant</strong> for the property <strong>{bookingData.propertyTitle}</strong>.</p>
                  <p>1. The monthly rent shall be as agreed upon during the discussion phase.</p>
                  <p>2. The security deposit is non-refundable if the tenant cancels after signing.</p>
                  <p>3. The property must be maintained in its original condition.</p>
                  <p>4. Sub-letting is strictly prohibited without prior written consent.</p>
                </div>
                
                <button 
                  onClick={handleDownloadDraft}
                  disabled={downloading}
                  className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  {downloading ? <Loader2 className="animate-spin" size={12} /> : <Download size={12} />}
                  Download Draft copy
                </button>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                Proceed to Sign <Check size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-gray-900 uppercase">Sign Below</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Use your mouse or touch screen to sign</p>
              </div>
              
              <div className="bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-4">
                <SignatureCanvas 
                  ref={sigCanvas}
                  penColor='black'
                  canvasProps={{
                    className: 'w-full h-64 rounded-2xl bg-white cursor-crosshair'
                  }}
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => sigCanvas.current.clear()}
                  className="flex-1 py-5 bg-white text-gray-400 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                >
                  Clear
                </button>
                <button 
                  onClick={handleSign}
                  disabled={signing}
                  className="flex-[2] py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                  {signing ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={18} /> Confirm & Finalize</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
