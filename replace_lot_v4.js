const fs = require('fs');
let code = fs.readFileSync('d:/work/js/modals.js', 'utf8');

const targetStr = `        <!-- Row 3: หัวตารางหลัก 14 คอลัมน์ (A ถึง N พอดี) -->
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
        </tr>`;

const newStr = `        <!-- แถวที่ 3: หัวตารางหลักสีส้มอ่อน -->
        <tr class="b c" style="background-color: #FCE4D6; height: 26px;">
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

        <!-- แถวที่ 4: ข้อมูลรายการ -->
  \`;

  let sumSetW = 0, sumReceiveW = 0, sumBillW = 0, sumScaleW = 0, sumAuG = 0, sumAgG = 0, sumAfterRoll = 0;

  if (orders.length === 0) {
    sumSetW = 13669.00; sumReceiveW = 13668.50; sumBillW = 13657.91; sumScaleW = 13657.00;
    sumAuG = 11587.37; sumAgG = 573.63; sumAfterRoll = 13656.50;
    html += \`
        <tr style="height: 22px;">
          <td class="c">1</td>
          <td class="c txt">ECE</td>
          <td></td>
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
          <td></td>
        </tr>
    \`;
  } else {
    orders.forEach((ord, i) => {
      sumSetW += parseFloat(ord.setW || 0);
      sumReceiveW += parseFloat(ord.receiveW || 0);
      sumBillW += parseFloat(ord.billW || 0);
      sumScaleW += parseFloat(ord.scaleW || 0);
      sumAuG += parseFloat(ord.auG || 0);
      sumAgG += parseFloat(ord.agG || 0);
      sumAfterRoll += parseFloat(ord.afterRollW || 0);
      
      html += \`
        <tr style="height: 22px;">
          <td class="c">\${i + 1}</td>
          <td class="c txt">\${ord.cust || ord.rf || ''}</td>
          <td>\${ord.noM || ''}</td>
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
          <td>\${ord.sender || ''}</td>
        </tr>
      \`;
    });
  }

  html += \`
        <!-- แถวที่ 5: แถวว่างบรรทัดที่ 1 (มีเส้นตารางสีดำครบ A-N) -->
        <tr style="height: 22px;">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td>
        </tr>

        <!-- แถวที่ 6: แถวว่างบรรทัดที่ 2 (มีเส้นตารางสีดำครบ A-N) -->
        <tr style="height: 22px;">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td>
        </tr>

        <!-- แถวที่ 7: แถวสรุปยอดรวม (มีเส้นตารางสีดำครบ A-N พร้อมไฮไลท์สีส้มทอง) -->
        <tr class="b" style="height: 24px;">
          <td class="b c">รวม</td>
          <td class="c">\${orders.length || 1} ชุด</td>
          <td></td>
          <td class="num">\${sumSetW.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="num">\${sumReceiveW.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="num">\${sumBillW.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td class="num">\${sumScaleW.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td></td>
          <td class="num" style="background-color: #FF8C00; font-weight: bold;">\${sumAuG.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td></td>
          <td class="num" style="background-color: #FF8C00; font-weight: bold;">\${sumAgG.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td></td>
          <td class="num">\${sumAfterRoll.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td></td>
        </tr>`;

if (code.indexOf(targetStr) !== -1) {
  fs.writeFileSync('d:/work/js/modals.js', code.replace(targetStr, newStr), 'utf8');
  console.log('REPLACED MAIN TABLE STRUCTURE SUCCESSFULLY');
} else {
  console.log('TARGET STRING NOT FOUND');
}
