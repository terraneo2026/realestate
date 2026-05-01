import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function generateAgreementPDF(bookingData: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text('RELOCATE', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('RESIDENTIAL RENTAL AGREEMENT', pageWidth / 2, 30, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(20, 35, pageWidth - 20, 35);

  // Agreement Details
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Agreement Date: ${new Date().toLocaleDateString()}`, 20, 45);
  doc.text(`Booking ID: ${bookingData.id}`, 20, 50);

  // Parties
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('BETWEEN:', 20, 65);
  
  doc.setFontSize(10);
  doc.text(`THE OWNER: ${bookingData.ownerName || 'Property Owner'}`, 30, 75);
  doc.text(`THE TENANT: ${bookingData.userName || 'Tenant'}`, 30, 80);

  // Property Details
  doc.setFontSize(12);
  doc.text('PROPERTY DETAILS:', 20, 95);
  doc.setFontSize(10);
  doc.text(`Property Name: ${bookingData.propertyTitle}`, 30, 105);
  doc.text(`Address: ${bookingData.propertyAddress || 'N/A'}`, 30, 110);

  // Terms
  doc.setFontSize(12);
  doc.text('TERMS AND CONDITIONS:', 20, 125);
  doc.setFontSize(10);
  const terms = [
    '1. The monthly rent shall be as agreed upon during the discussion phase.',
    '2. The security deposit is non-refundable if the tenant cancels after signing.',
    '3. The property must be maintained in its original condition.',
    '4. Sub-letting is strictly prohibited without prior written consent.',
    '5. This agreement is legally binding once signed digitally.'
  ];
  
  let y = 135;
  terms.forEach(term => {
    doc.text(term, 30, y);
    y += 10;
  });

  // Signatures
  doc.setFontSize(12);
  doc.text('SIGNATURES:', 20, 200);
  
  if (bookingData.signatureUrl) {
    try {
      doc.addImage(bookingData.signatureUrl, 'PNG', 20, 210, 50, 25);
      doc.setFontSize(8);
      doc.text('Digitally signed by Tenant', 20, 240);
      doc.text(`Timestamp: ${new Date(bookingData.signedAt?.seconds * 1000 || Date.now()).toLocaleString()}`, 20, 245);
    } catch (e) {
      doc.text('[Digital Signature Captured]', 20, 215);
    }
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('This is a computer-generated document and does not require a physical signature.', pageWidth / 2, 280, { align: 'center' });
  doc.text('Relocate - Real Estate Management System', pageWidth / 2, 285, { align: 'center' });

  // Save the PDF
  doc.save(`Agreement_${bookingData.id}.pdf`);
  return true;
}
