/**
 * Client-side CSV Export Utility
 * Generates and downloads a CSV file from an array of objects
 */
export const exportToCSV = (data: any[], fileName: string) => {
  if (!data || data.length === 0) return;

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Create rows
  const rows = data.map(obj => 
    headers.map(header => {
      let val = obj[header];
      
      // Handle special types
      if (val instanceof Date) val = val.toLocaleDateString();
      if (typeof val === 'object' && val !== null) {
        if (val.toDate) val = val.toDate().toLocaleDateString(); // Firebase Timestamp
        else val = JSON.stringify(val).replace(/"/g, '""');
      }
      
      // Escape strings with commas
      if (typeof val === 'string' && val.includes(',')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      
      return val ?? '';
    }).join(',')
  );

  // Combine into CSV content
  const csvContent = [headers.join(','), ...rows].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
