const fs = require('fs');
let code = fs.readFileSync('d:/work/js/modals.js', 'utf8');

const targetStr = `        <!-- งานสกัด -->
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
        </tr>`;

const newStr = `        <!-- งานสกัด -->
        <tr>
          <td colspan="3" class="bg-ext-title">งานสกัด</td>
          <td colspan="11" class="nb"></td>
        </tr>
        <tr>
          <td class="b l">วันที่</td>
          <td colspan="2" class="bg-ext-sub txt">\${issueDate}</td>
          <td colspan="11" class="nb"></td>
        </tr>
        <tr style="height:6px;"><td colspan="14" class="nb"></td></tr>
        <tr class="b c">
          <td class="bg-ext-sub" style="width:110px;">น้ำหนักชั่ง</td>
          <td class="bg-ext-sub" style="width:130px;">ผู้รับ</td>
          <td class="bg-ext-sub" style="width:120px;">เวลา</td>
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
        <tr style="height:6px;"><td colspan="14" class="nb"></td></tr>
        <tr class="b c">
          <td class="bg-melt-sub" style="width:110px;">น้ำหนักชั่ง (g)</td>
          <td class="bg-melt-sub" style="width:130px;">ผู้รับ</td>
          <td class="bg-melt-sub" style="width:120px;">เวลา</td>
          <td colspan="11" class="nb"></td>
        </tr>
        <tr>
          <td class="num">11,579.00</td>
          <td class="c txt">OFFICE Admin</td>
          <td class="c txt">15:51:56</td>
          <td colspan="11" class="nb"></td>
        </tr>`;

if (code.indexOf(targetStr) !== -1) {
  fs.writeFileSync('d:/work/js/modals.js', code.replace(targetStr, newStr), 'utf8');
  console.log('REPLACED SUCCESSFULLY');
} else {
  console.log('TARGET STRING NOT FOUND');
}
