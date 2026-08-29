const fs = require('fs');
let code = fs.readFileSync('d:/work/js/modals.js', 'utf8');

const exportLotCode = `
window.exportLotReportToExcel = function(lotId) {
  const lot = (window.LOT_MANAGE_DATA ? Object.values(window.LOT_MANAGE_DATA).flat() : []).find(l => l.lotId === lotId || l.lot === lotId || l.lotNo === lotId) || {};
  const orders = lot.orders || [];
  
  const lotNo = lot.lot || lot.lotNo || lotId || 'KGR2608-0004';
  const issueDate = lot.date || '29/08/2569';

  let html = \`
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>รายงาน</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        td, th { font-family: 'Sarabun', 'Calibri', sans-serif; font-size: 11pt; border: 0.5pt solid #000000; }
        .c { text-align: center; }
        .r { text-align: right; }
        .l { text-align: left; }
        .b { font-weight: bold; }
        .num { mso-number-format:"\\#\\,\\#\\#0\\.00"; text-align: right; }
        .txt { mso-number-format:"\\@"; text-align: center; }
        .bg-head { background-color: #C6EFCE; font-weight: bold; text-align: center; }
        .bg-orange { background-color: #FCE4D6; font-weight: bold; text-align: center; }
        .bg-gold { background-color: #FFC000; font-weight: bold; }
        .bg-soft-green { background-color: #E2EFDA; font-weight: bold; text-align: center; }
        .no-border { border: none !important; }
      </style>
    </head>
    <body>
      <table style="border-collapse:collapse;">
        <!-- Header บนสุด -->
        <tr>
          <td class="no-border"></td>
          <td colspan="2" class="bg-head b" style="font-size:12pt; height:26px;">รายงาน</td>
          <td colspan="9" class="no-border"></td>
          <td class="no-border b r">เลขที่ LOT</td>
          <td class="no-border txt b l" colspan="2">\${lotNo}</td>
        </tr>
        <tr>
          <td colspan="12" class="no-border"></td>
          <td class="no-border b r">วันที่ออก</td>
          <td class="no-border txt b l" colspan="2">\${issueDate}</td>
        </tr>

        <!-- หัวตารางรายการคำสั่ง -->
        <tr class="b c" style="background-color:#F2F2F2; height:24px;">
          <th style="width:50px;">ลำดับ</th>
          <th style="width:140px;"></th>
          <th style="width:100px;">No.M</th>
          <th style="width:110px;">น้ำหนักชุด</th>
          <th style="width:110px;">น้ำหนักรับ</th>
          <th style="width:110px;">น้ำหนักบิล</th>
          <th style="width:110px;">น้ำหนักชั่ง</th>
          <th style="width:80px;">%Au</th>
          <th style="width:110px;">Au(g)</th>
          <th style="width:80px;">%Ag</th>
          <th style="width:110px;">Ag(g)</th>
          <th style="width:130px;">ผู้รับ (เวลา)</th>
          <th style="width:120px;">น้ำหนักหลังรีด</th>
          <th style="width:120px;">ผู้ส่ง เวลา</th>
        </tr>
  \`;

  // แถวข้อมูลรายการสั่งซื้อใน LOT
  if (orders.length === 0) {
    html += \`
      <tr>
        <td class="c">1</td>
        <td class="c txt">ECE</td>
        <td class="c txt"></td>
        <td class="num">13,669.00</td>
        <td class="num">13,668.50</td>
        <td class="num">13,657.91</td>
        <td class="num">13,657.00</td>
        <td class="num">84.84</td>
        <td class="num">11,587.37</td>
        <td class="num">4.20</td>
        <td class="num">573.63</td>
        <td class="c txt">OFFICE Admin</td>
        <td class="num"></td>
        <td class="c txt"></td>
      </tr>
    \`;
  } else {
    orders.forEach((ord, i) => {
      html += \`
        <tr>
          <td class="c">\${i + 1}</td>
          <td class="c txt">\${ord.cust || ord.rf || ''}</td>
          <td class="c txt">\${ord.noM || ''}</td>
          <td class="num">\${parseFloat(ord.setW || 0).toFixed(2)}</td>
          <td class="num">\${parseFloat(ord.receiveW || 0).toFixed(2)}</td>
          <td class="num">\${parseFloat(ord.billW || 0).toFixed(2)}</td>
          <td class="num">\${parseFloat(ord.scaleW || 0).toFixed(2)}</td>
          <td class="num">\${parseFloat(ord.percentAu || 0).toFixed(2)}</td>
          <td class="num">\${parseFloat(ord.auG || 0).toFixed(2)}</td>
          <td class="num">\${parseFloat(ord.percentAg || 0).toFixed(2)}</td>
          <td class="num">\${parseFloat(ord.agG || 0).toFixed(2)}</td>
          <td class="c txt">\${ord.receiver || 'OFFICE Admin'}</td>
          <td class="num">\${parseFloat(ord.afterRollW || 0).toFixed(2)}</td>
          <td class="c txt">\${ord.sender || ''}</td>
        </tr>
      \`;
    });
  }

  // แถวสรุปผลรวม
  html += \`
        <tr style="height:22px;">
          <td colspan="14" class="no-border"></td>
        </tr>
        <tr class="b" style="height:24px;">
          <td class="b">รวม</td>
          <td class="c">1 ชุด</td>
          <td class="no-border"></td>
          <td class="num">13,669.00</td>
          <td class="num">13,668.50</td>
          <td class="num">13,657.91</td>
          <td class="num">13,657.00</td>
          <td class="no-border"></td>
          <td class="num bg-gold">11,587.37</td>
          <td class="no-border"></td>
          <td class="num bg-gold">573.63</td>
          <td class="no-border"></td>
          <td class="num">13,656.50</td>
          <td class="no-border"></td>
        </tr>

        <!-- ตารางงานสกัด -->
        <tr style="height:18px;"><td colspan="14" class="no-border"></td></tr>
        <tr>
          <td class="no-border"></td>
          <td colspan="2" class="bg-orange b">งานสกัด</td>
          <td colspan="11" class="no-border"></td>
        </tr>
        <tr>
          <td class="b l">วันที่</td>
          <td colspan="2" class="bg-orange txt">\${issueDate}</td>
          <td colspan="11" class="no-border"></td>
        </tr>
        <tr style="height:8px;"><td colspan="14" class="no-border"></td></tr>
        <tr class="b c" style="background-color:#FFF2CC;">
          <td class="no-border"></td>
          <td style="width:120px;">น้ำหนักชั่ง</td>
          <td style="width:100px;">ผู้รับ</td>
          <td style="width:100px;">เวลา</td>
          <td colspan="10" class="no-border"></td>
        </tr>
        <tr>
          <td class="no-border"></td>
          <td class="num">13,656.00</td>
          <td class="c txt">OFFICE Admin</td>
          <td class="c txt">15:51:56</td>
          <td colspan="10" class="no-border"></td>
        </tr>

        <!-- ตารางงานหลอม -->
        <tr style="height:18px;"><td colspan="14" class="no-border"></td></tr>
        <tr>
          <td class="no-border"></td>
          <td colspan="2" class="bg-soft-green b">งานหลอม</td>
          <td colspan="11" class="no-border"></td>
        </tr>
        <tr>
          <td class="b l">วันที่</td>
          <td colspan="2" class="bg-soft-green txt">\${issueDate}</td>
          <td colspan="11" class="no-border"></td>
        </tr>
        <tr style="height:8px;"><td colspan="14" class="no-border"></td></tr>
        <tr class="b c" style="background-color:#E2EFDA;">
          <td class="no-border"></td>
          <td style="width:120px;">น้ำหนักชั่ง (g)</td>
          <td style="width:100px;">ผู้รับ</td>
          <td style="width:100px;">เวลา</td>
          <td colspan="10" class="no-border"></td>
        </tr>
        <tr>
          <td class="no-border"></td>
          <td class="num">11,579.00</td>
          <td class="c txt">OFFICE Admin</td>
          <td class="c txt">15:51:56</td>
          <td colspan="10" class="no-border"></td>
        </tr>

        <!-- ตารางผล Test -->
        <tr style="height:18px;"><td colspan="14" class="no-border"></td></tr>
        <tr class="b c" style="background-color:#E2EFDA;">
          <td class="no-border"></td>
          <td>Test</td>
          <td></td>
          <td>ผู้Test</td>
          <td>วัน/เวลา</td>
          <td style="background-color:#FCE4D6;">ขี้เบ้า(g)</td>
          <td style="background-color:#C65911; color:#ffffff;">ขาด(g)</td>
          <td>น้ำหนักชั่ง(g)</td>
          <td>ผู้รับ</td>
          <td colspan="2">เวลา</td>
          <td colspan="3" class="no-border"></td>
        </tr>
        <tr>
          <td class="no-border"></td>
          <td class="b l">%Au</td>
          <td class="c txt">9999</td>
          <td class="c txt">OFFICE Admin</td>
          <td class="c txt">\${issueDate}</td>
          <td class="num">2.50</td>
          <td class="num" style="color:red;">(8.37)</td>
          <td class="num">(8.37)</td>
          <td class="c txt">OFFICE Admin</td>
          <td colspan="2" class="c txt">15:54:36</td>
          <td colspan="3" class="no-border"></td>
        </tr>
        <tr>
          <td class="no-border"></td>
          <td class="b l">%Ag</td>
          <td class="c txt">9999</td>
          <td class="c txt">OFFICE Admin</td>
          <td class="c txt">\${issueDate}</td>
          <td class="num">2.50</td>
          <td class="num" style="color:red;">(0.63)</td>
          <td class="num">573.00</td>
          <td class="c txt">OFFICE Admin</td>
          <td colspan="2" class="c txt">15:54:36</td>
          <td colspan="3" class="no-border"></td>
        </tr>
      </table>
    </body>
    </html>
  \`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = \`report-lot-\${lotNo}.xls\`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
`;

const eventBinding = `
  $$('[data-action="export-lot-excel"]').forEach(el => el.addEventListener('click', (e) => {
    const lotId = e.currentTarget.dataset.lot;
    if (window.exportLotReportToExcel) {
      window.exportLotReportToExcel(lotId);
      toast('ดาวน์โหลดรายงาน LOT ' + lotId + ' เรียบร้อย');
    }
  }));
`;

const targetAnchor = `  $$('[data-action="export-excel-rf"]').forEach(el => el.addEventListener('click', () => {`;
const insertIndex = code.indexOf(targetAnchor);

if (insertIndex !== -1) {
    let newCode = code.slice(0, insertIndex) + eventBinding + "\n" + code.slice(insertIndex);
    // append function at the very end
    newCode = newCode + "\n\n" + exportLotCode;
    fs.writeFileSync('d:/work/js/modals.js', newCode, 'utf8');
    console.log('REPLACED');
} else {
    console.log('Anchor not found!');
}
