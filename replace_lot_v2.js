const fs = require('fs');
let code = fs.readFileSync('d:/work/js/modals.js', 'utf8');

const marker = 'window.exportLotReportToExcel = function(lotId) {';
const startIndex = code.lastIndexOf(marker);

if (startIndex !== -1) {
  const newCode = code.slice(0, startIndex) + `window.exportLotReportToExcel = function(lotId) {
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
        table { border-collapse: collapse; }
        td, th { font-family: 'Sarabun', 'Calibri', Tahoma, sans-serif; font-size: 11pt; border: 0.5pt solid #000000; height: 22px; }
        .nb { border: none !important; }
        .c { text-align: center; }
        .r { text-align: right; }
        .l { text-align: left; }
        .b { font-weight: bold; }
        .num { mso-number-format:"\\#\\,\\#\\#0\\.00"; text-align: right; }
        .txt { mso-number-format:"\\@"; text-align: center; }
        
        /* สีกำหนดเฉพาะตามต้นฉบับ */
        .bg-top-title { background-color: #C6EFCE; text-align: center; font-weight: bold; }
        .bg-head-row th { background-color: #FCE4D6; font-weight: bold; text-align: center; }
        .bg-gold-val { background-color: #FFC000; font-weight: bold; }
        .bg-ext-title { background-color: #FFE699; font-weight: bold; text-align: center; }
        .bg-ext-sub { background-color: #FFF2CC; text-align: center; }
        .bg-melt-title { background-color: #C6EFCE; font-weight: bold; text-align: center; }
        .bg-melt-sub { background-color: #E2EFDA; text-align: center; }
        
        .bg-test-head { background-color: #DDEBF7; font-weight: bold; text-align: center; }
        .bg-test-khibao { background-color: #D9E1F2; font-weight: bold; text-align: center; }
        .bg-test-loss { background-color: #C65911; color: #FFFFFF; font-weight: bold; text-align: center; }
      </style>
    </head>
    <body>
      <table>
        <!-- Row 1-2: หัวเอกสารและเลขที่ LOT -->
        <tr>
          <td colspan="3" class="bg-top-title b" style="font-size:12pt; height:26px;">รายงาน</td>
          <td colspan="8" class="nb"></td>
          <td class="nb b r">เลขที่ LOT</td>
          <td class="nb txt b l" colspan="2">\${lotNo}</td>
        </tr>
        <tr>
          <td colspan="11" class="nb"></td>
          <td class="nb b r">วันที่ออก</td>
          <td class="nb txt b l" colspan="2">\${issueDate}</td>
        </tr>

        <!-- Row 3: หัวตารางหลัก 14 คอลัมน์ (A ถึง N พอดี) -->
        <tr class="bg-head-row">
          <th style="width:60px;">ลำดับ</th>
          <th style="width:140px;"></th>
          <th style="width:90px;">No.M</th>
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

        <!-- Row 4-5: รายการสินค้า -->
  \`;

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

  html += \`
        <tr>
          <td class="nb"></td><td class="nb"></td><td class="nb"></td><td class="nb"></td>
          <td class="nb"></td><td class="nb"></td><td class="nb"></td><td class="nb"></td>
          <td class="nb"></td><td class="nb"></td><td class="nb"></td><td class="nb"></td>
          <td class="nb"></td><td class="nb"></td>
        </tr>

        <!-- Row 7: แถวรวม -->
        <tr class="b">
          <td class="b c">รวม</td>
          <td class="c">1 ชุด</td>
          <td class="nb"></td>
          <td class="num">13,669.00</td>
          <td class="num">13,668.50</td>
          <td class="num">13,657.91</td>
          <td class="num">13,657.00</td>
          <td class="nb"></td>
          <td class="num bg-gold-val">11,587.37</td>
          <td class="nb"></td>
          <td class="num bg-gold-val">573.63</td>
          <td class="nb"></td>
          <td class="num">13,656.50</td>
          <td class="nb"></td>
        </tr>

        <!-- ว่าง 1 แถว -->
        <tr><td colspan="14" class="nb"></td></tr>

        <!-- งานสกัด -->
        <tr>
          <td colspan="3" class="bg-ext-title">งานสกัด</td>
          <td colspan="11" class="nb"></td>
        </tr>
        <tr>
          <td class="b l">วันที่</td>
          <td colspan="2" class="bg-ext-sub txt">\${issueDate}</td>
          <td colspan="11" class="nb"></td>
        </tr>
        <tr><td colspan="14" class="nb" style="height:6px;"></td></tr>
        <tr class="b c" style="background-color:#FFF2CC;">
          <td>น้ำหนักชั่ง</td>
          <td>ผู้รับ</td>
          <td>เวลา</td>
          <td colspan="11" class="nb"></td>
        </tr>
        <tr>
          <td class="num">13,656.00</td>
          <td class="c txt">OFFICE Admin</td>
          <td class="c txt">15:51:56</td>
          <td colspan="11" class="nb"></td>
        </tr>

        <!-- ว่าง 1 แถว -->
        <tr><td colspan="14" class="nb"></td></tr>

        <!-- งานหลอม -->
        <tr>
          <td colspan="3" class="bg-melt-title">งานหลอม</td>
          <td colspan="11" class="nb"></td>
        </tr>
        <tr>
          <td class="b l">วันที่</td>
          <td colspan="2" class="bg-melt-sub txt">\${issueDate}</td>
          <td colspan="11" class="nb"></td>
        </tr>
        <tr><td colspan="14" class="nb" style="height:6px;"></td></tr>
        <tr class="b c" style="background-color:#E2EFDA;">
          <td>น้ำหนักชั่ง (g)</td>
          <td>ผู้รับ</td>
          <td>เวลา</td>
          <td colspan="11" class="nb"></td>
        </tr>
        <tr>
          <td class="num">11,579.00</td>
          <td class="c txt">OFFICE Admin</td>
          <td class="c txt">15:51:56</td>
          <td colspan="11" class="nb"></td>
        </tr>

        <!-- ว่าง 1 แถว -->
        <tr><td colspan="14" class="nb"></td></tr>

        <!-- ตารางผล Test -->
        <tr class="b c">
          <td class="bg-test-head">Test</td>
          <td class="bg-test-head"></td>
          <td class="bg-test-head">ผู้Test</td>
          <td class="bg-test-head">วัน/เวลา</td>
          <td class="bg-test-khibao">ขี้เบ้า(g)</td>
          <td class="bg-test-loss">ขาด(g)</td>
          <td class="bg-test-head">น้ำหนักชั่ง(g)</td>
          <td class="bg-test-head">ผู้รับ</td>
          <td colspan="2" class="bg-test-head">เวลา</td>
          <td colspan="4" class="nb"></td>
        </tr>
        <tr>
          <td class="b l">%Au</td>
          <td class="c txt">9999</td>
          <td class="c txt">OFFICE Admin</td>
          <td class="c txt">\${issueDate}</td>
          <td class="num">2.50</td>
          <td class="num" style="color:red;">(8.37)</td>
          <td class="num">(8.37)</td>
          <td class="c txt">OFFICE Admin</td>
          <td colspan="2" class="c txt">15:54:36</td>
          <td colspan="4" class="nb"></td>
        </tr>
        <tr>
          <td class="b l">%Ag</td>
          <td class="c txt">9999</td>
          <td class="c txt">OFFICE Admin</td>
          <td class="c txt">\${issueDate}</td>
          <td class="num">2.50</td>
          <td class="num" style="color:red;">(0.63)</td>
          <td class="num">573.00</td>
          <td class="c txt">OFFICE Admin</td>
          <td colspan="2" class="c txt">15:54:36</td>
          <td colspan="4" class="nb"></td>
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

  fs.writeFileSync('d:/work/js/modals.js', newCode, 'utf8');
  console.log('REPLACED LOT REPORT SUCCESSFULLY');
} else {
  console.log('Could not find window.exportLotReportToExcel in modals.js');
}
