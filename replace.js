const fs = require('fs');
let code = fs.readFileSync('d:/work/js/modals.js', 'utf8');

const startIndex = code.indexOf(`$$('[data-action="tdc-export"]').forEach(el => el.addEventListener('click', () => {`);
const endStr = `toast('ส่งออกข้อมูล Excel สำเร็จ');\n  }));`;
const endStr2 = `toast('ส่งออกข้อมูล Excel สำเร็จ');\r\n  }));`;

let endIndex = code.indexOf(endStr, startIndex);
let markerLength = endStr.length;
if (endIndex === -1) {
    endIndex = code.indexOf(endStr2, startIndex);
    markerLength = endStr2.length;
}

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `function exportTdcToExcel() {
    const tdcOrders = ORDERS.filter(o => !o.cancelled && o.percentApprovalStatus === 'pending');
    
    if (!tdcOrders.length) {
      toast('ไม่มีข้อมูลสำหรับ Export');
      return;
    }
    
    let tableHtml = \`
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>TDC Approve Report</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          th { background-color: #002060; color: #ffffff; font-weight: bold; text-align: center; border: 1px solid #cbd5e1; height: 35px; }
          td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 13px; font-family: 'Sarabun', 'Calibri', sans-serif; }
          .center { text-align: center; }
          .right { text-align: right; }
          .text { mso-number-format:"\\@"; }
          .num { mso-number-format:"\\\\#\\\\,\\\\#\\\\#0\\\\.00"; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th style="width: 140px;">RF-No.</th>
              <th style="width: 120px;">วันที่รับ</th>
              <th style="width: 250px;">ชื่อลูกค้า</th>
              <th style="width: 130px;">น้ำหนักแจ้ง (g)</th>
              <th style="width: 140px;">น้ำหนักหลังหลอม (g)</th>
              <th style="width: 100px;">%Au</th>
              <th style="width: 150px;">น้ำหนักตัวอย่าง (Au)</th>
              <th style="width: 170px;">น้ำหนักตัวอย่างลูกค้า (Au)</th>
              <th style="width: 100px;">%Ag</th>
              <th style="width: 130px;">สถานะ</th>
            </tr>
          </thead>
          <tbody>
    \`;
  
    tdcOrders.forEach(r => {
      tableHtml += \`
        <tr>
          <td class="center text">\${r.rf || '-'}</td>
          <td class="center text">\${r.date || '-'}</td>
          <td>\${r.cust || '-'}</td>
          <td class="right num">\${parseFloat(r.wDeclared || r.w || 0).toFixed(2)}</td>
          <td class="right num">\${parseFloat(r.meltedW || r.w || 0).toFixed(2)}</td>
          <td class="right num">\${parseFloat(r.percentAu || 0).toFixed(2)}%</td>
          <td class="right num">\${parseFloat(r.auSample || 0).toFixed(2)}</td>
          <td class="right num">\${parseFloat(r.auSampleCust || 0).toFixed(2)}</td>
          <td class="right num">\${parseFloat(r.percentAg || 0).toFixed(2)}%</td>
          <td class="center">รอตรวจสอบ</td>
        </tr>
      \`;
    });
  
    tableHtml += \`
          </tbody>
        </table>
      </body>
      </html>
    \`;
  
    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`TDC_Approve_Report_\${new Date().toISOString().slice(0,10)}.xls\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast('ส่งออกข้อมูล Excel สำเร็จ');
  }

  $$('[data-action="tdc-export"]').forEach(el => el.addEventListener('click', () => {
    exportTdcToExcel();
  }));`;

    const newCode = code.slice(0, startIndex) + replacement + code.slice(endIndex + markerLength);
    fs.writeFileSync('d:/work/js/modals.js', newCode, 'utf8');
    console.log('REPLACED');
} else {
    console.log('MARKERS NOT FOUND');
    console.log('Start:', startIndex);
    console.log('End:', endIndex);
}
