const fs = require('fs');
let code = fs.readFileSync('d:/work/js/modals.js', 'utf8');

const startMarker = `function exportTdcToExcel() {`;
const endMarker = `toast('ส่งออกข้อมูล Excel สำเร็จ');\r\n  }`;
const endMarker2 = `toast('ส่งออกข้อมูล Excel สำเร็จ');\n  }`;

let startIndex = code.indexOf(startMarker);
let endIndex = code.indexOf(endMarker, startIndex);
let markerLength = endMarker.length;

if (endIndex === -1) {
    endIndex = code.indexOf(endMarker2, startIndex);
    markerLength = endMarker2.length;
}

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `function exportTdcToExcel() {
    const tdcOrders = ORDERS.filter(o => !o.cancelled && o.percentApprovalStatus === 'pending');
    
    // จัดเตรียมหัวตารางและข้อมูล
    const data = [
      [
        "RF-No.",
        "วันที่รับ",
        "ชื่อลูกค้า",
        "น้ำหนักแจ้ง (g)",
        "น้ำหนักหลังหลอม (g)",
        "%Au",
        "น้ำหนักตัวอย่าง (Au)",
        "น้ำหนักตัวอย่างลูกค้า (Au)",
        "%Ag",
        "สถานะ"
      ]
    ];
  
    tdcOrders.forEach(r => {
      data.push([
        r.rf || '-',
        r.date || '-',
        r.cust || '-',
        parseFloat(r.wDeclared || r.w || 0),
        parseFloat(r.meltedW || r.w || 0),
        parseFloat(r.percentAu || 0),
        parseFloat(r.auSample || 0),
        parseFloat(r.auSampleCust || 0),
        parseFloat(r.percentAg || 0),
        "รอตรวจสอบ"
      ]);
    });
  
    // สร้าง Workbook และ Worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
  
    // กำหนดความกว้างคอลัมน์แบบ Fixed ให้กว้างพอดี ไม่ล้นขอบ
    ws['!cols'] = [
      { wch: 16 }, // RF-No.
      { wch: 14 }, // วันที่รับ
      { wch: 28 }, // ชื่อลูกค้า (กว้างพิเศษ)
      { wch: 18 }, // น้ำหนักแจ้ง
      { wch: 20 }, // น้ำหนักหลังหลอม
      { wch: 10 }, // %Au
      { wch: 20 }, // น้ำหนักตัวอย่าง Au
      { wch: 24 }, // น้ำหนักตัวอย่างลูกค้า Au
      { wch: 10 }, // %Ag
      { wch: 16 }  // สถานะ
    ];
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TDC_Approve");
  
    // ดาวน์โหลดไฟล์เป็น .xlsx จริง
    XLSX.writeFile(wb, \`TDC_Approve_\${new Date().toISOString().slice(0,10)}.xlsx\`);
    toast('ส่งออกข้อมูล Excel สำเร็จ');
  }`;

    const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex + markerLength);
    fs.writeFileSync('d:/work/js/modals.js', newCode, 'utf8');
    console.log('REPLACED');
} else {
    console.log('MARKERS NOT FOUND');
    console.log('Start Marker Index:', startIndex);
    console.log('End Marker Index:', endIndex);
}
