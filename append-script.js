const fs = require('fs');

const content = `

window.previewTaxInvoiceModal = function(inv) {
  const renderDoc = (docTypeTitle, docBadgeClass) => \`
    <div class="invoice-doc-page" style="background:#fff; padding:24px; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:24px; color:#1e293b; font-family:'Sarabun', sans-serif;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #002060; padding-bottom:12px; margin-bottom:14px;">
        <div>
          <div style="font-size:18px; font-weight:700; color:#002060;">K. G. R. GROUP CO., LTD.</div>
          <div style="font-size:16px; font-weight:700;">บริษัท เค. จี. อาร์. กรุ๊ป จำกัด</div>
          <div style="font-size:13px; color:#475569; margin-top:2px;">
            3/3 หมู่ที่ 2 ซอยเปี่ยมน้ำใจ ถ.พุทธมณฑล สาย 7 ต.หอมเกร็ด อ.สามพราน จ.นครปฐม 73110<br>
            โทรศัพท์ (034) 393614 โทรสาร (034) 393613<br>
            เลขประจำตัวผู้เสียภาษี 0105544066727 (สำนักงานใหญ่)
          </div>
        </div>
        <div style="text-align:right;">
          <div class="badge \${docBadgeClass}" style="font-size:14px; padding:4px 10px; font-weight:700;">
            \${docTypeTitle}
          </div>
          <div style="font-size:13px; font-weight:700; color:#002060; margin-top:6px;">
            TAX INVOICE / RECEIPT
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px; font-size:14px; margin-bottom:14px;">
        <div style="line-height:1.6;">
          <div><strong>ชื่อลูกค้า:</strong> \${inv.cust || inv.customerName || '-'}</div>
          <div><strong>ที่อยู่:</strong> \${inv.addr || inv.customerAddress || '-'}</div>
          <div><strong>เลขประจำตัวผู้เสียภาษี:</strong> <span style="font-family:'Roboto', monospace;">\${inv.tax || inv.customerTaxId || '-'}</span> (สำนักงานใหญ่)</div>
        </div>
        <div style="line-height:1.6; border-left:1px solid #e2e8f0; padding-left:14px;">
          <div><strong>เลขที่:</strong> <span style="font-family:'Roboto', monospace; font-weight:700;">\${inv.no || '-'}</span></div>
          <div><strong>วันที่:</strong> \${inv.date || '-'}</div>
        </div>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:13.5px; margin-bottom:14px;">
        <thead>
          <tr style="background:#002060; color:#fff; text-align:center;">
            <th style="padding:6px; border:1px solid #002060; width:50px;">ลำดับ<br><span style="font-size:11px;">Item</span></th>
            <th style="padding:6px; border:1px solid #002060; text-align:left;">รายการสินค้าหรือบริการ<br><span style="font-size:11px;">Description</span></th>
            <th style="padding:6px; border:1px solid #002060; width:130px; text-align:right;">จำนวนเงิน<br><span style="font-size:11px;">Amount</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:8px; border:1px solid #cbd5e1; text-align:center; vertical-align:top;">1</td>
            <td style="padding:8px; border:1px solid #cbd5e1; vertical-align:top; line-height:1.5;">
              <strong>ค่าดำเนินการสกัดทอง</strong><br>
              น้ำหนักเข้า (\${inv.inWeight || '0.00000'} kg)<br>
              น้ำหนักคืน 99.99 (\${inv.outWeight || '0.00000'} kg)<br>
              ค่าสกัดทอง 99.99 (\${inv.extractWeight || '0.00000'} kg X \${(inv.rate || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})})
            </td>
            <td style="padding:8px; border:1px solid #cbd5e1; text-align:right; vertical-align:top; font-family:'Roboto', monospace; font-weight:700;">
              \${(inv.subtotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding:6px 10px; text-align:right; border:1px solid #cbd5e1; font-weight:700;">จำนวนเงินรวม</td>
            <td style="padding:6px 10px; text-align:right; border:1px solid #cbd5e1; font-family:'Roboto', monospace; font-weight:700;">\${(inv.subtotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:6px 10px; text-align:right; border:1px solid #cbd5e1; font-weight:700;">จำนวนเงินภาษีมูลค่าเพิ่ม 7.00%</td>
            <td style="padding:6px 10px; text-align:right; border:1px solid #cbd5e1; font-family:'Roboto', monospace; font-weight:700;">\${(inv.vat || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
          </tr>
          <tr style="background:#f8fafc;">
            <td colspan="2" style="padding:6px 10px; text-align:right; border:1px solid #cbd5e1; font-weight:700; color:#002060;">จำนวนเงินรวมทั้งสิ้น</td>
            <td style="padding:6px 10px; text-align:right; border:1px solid #cbd5e1; font-family:'Roboto', monospace; font-weight:700; color:#002060; font-size:15px;">\${(inv.grandTotal || 0).toLocaleString('th-TH', {minimumFractionDigits: 2})}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding:6px 10px; border:1px solid #cbd5e1; background:#f1f5f9; font-size:13px;">
              <strong>จำนวนเงินรวมทั้งสิ้น (ตัวอักษร):</strong> \${inv.grandTotalThai || '( - )'}
            </td>
          </tr>
        </tbody>
      </table>

      <div style="font-size:12px; margin-bottom:16px;">
        <span style="margin-right:16px;">[ ] เงินสด</span>
        <span>[ ] เช็คธนาคาร ................................... สาขา ......................... เลขที่ ......................... ลงวันที่ .........................</span>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr 1.2fr; gap:12px; text-align:center; font-size:12px; border-top:1px dashed #cbd5e1; padding-top:12px;">
        <div>
          <div>.......................................................</div>
          <div style="margin-top:4px;">ผู้รับสินค้า</div>
          <div>วันที่ ......./......./.......</div>
        </div>
        <div>
          <div>.......................................................</div>
          <div style="margin-top:4px;">ผู้ส่งสินค้า</div>
          <div>วันที่ ......./......./.......</div>
        </div>
        <div>
          <div>.......................................................</div>
          <div style="margin-top:4px;">ผู้รับเงิน (ในนาม บริษัท เค. จี. อาร์. กรุ๊ป จำกัด)</div>
          <div>วันที่ ......./......./.......</div>
        </div>
      </div>
    </div>
  \`;

  const modalHtml = \`
    <div id="invoicePreviewModal" class="modal-backdrop" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); display:flex; align-items:center; justify-content:center; z-index:9999;">
      <div class="modal-box" style="background:#f8fafc; width:900px; max-width:95vw; max-height:90vh; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        <div style="background:#002060; color:#fff; padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:18px; font-weight:700;">ตัวอย่างใบกำกับภาษี/ใบเสร็จรับเงิน — เลขที่ \${inv.no || ''}</h3>
          <button onclick="document.getElementById('invoicePreviewModal').remove()" style="background:transparent; border:none; color:#fff; font-size:20px; cursor:pointer;">✕</button>
        </div>
        <div style="padding:20px; overflow-y:auto; flex:1;">
          \${renderDoc('ต้นฉบับใบกำกับภาษี / ใบเสร็จรับเงิน (ORIGINAL)', 'badge-done')}
          \${renderDoc('สำเนาใบกำกับภาษี / สำเนาใบเสร็จรับเงิน (COPY)', 'badge-info')}
        </div>
        <div style="background:#fff; border-top:1px solid #e2e8f0; padding:12px 20px; display:flex; justify-content:flex-end; gap:12px;">
          <button class="btn-secondary" onclick="document.getElementById('invoicePreviewModal').remove()">ปิดหน้าต่าง</button>
          <button class="btn-primary" onclick="window.print()">🖨️ พิมพ์เอกสาร</button>
        </div>
      </div>
    </div>
  \`;

  const oldModal = document.getElementById('invoicePreviewModal');
  if (oldModal) oldModal.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.openGoldReturnSlipModal = function() {
  const getVal = (id, fallback) => {
    const el = document.getElementById(id);
    return el ? (el.value || fallback) : fallback;
  };
  
  const rf = order.rfNo || '-';
  const date = order.station1.receiveDate || todayStr();
  const custName = order.station1.customerName || '-';
  const cust = (typeof CUSTOMERS !== 'undefined' ? CUSTOMERS : []).find(c => c.name === custName);
  const taxId = cust ? (cust.taxId || cust.idCard || '-') : '-';
  
  const wDeclared = wfFmt(order.station1.declaredWeight) || '0.00';
  const wReceived = wfFmt(order.station1.receivedWeight) || '0.00';
  
  const pctAu = order.station3.percentAu || '0.00';
  const pctAg = order.station3.percentAg || '0.00';
  
  const auCalc = getVal('wf_s4_auCalculatedWeight', wfFmt(order.station4.auCalculatedWeight) || '0.00');
  const auLoss = getVal('wf_s4_auReturnPercent', order.station4.auReturnPercent || '0.00');
  const auReturn = getVal('wf_s4_auReturnWeight', wfFmt(order.station4.auReturnWeight) || '0.00');

  const slipHtml = \`
    <div class="gold-slip-page" style="background:#fff; padding:20px; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:20px; color:#1e293b; font-family:'Sarabun', sans-serif; width:100%;">
      <div style="text-align:center; border-bottom:2px solid #002060; padding-bottom:12px; margin-bottom:16px;">
        <div style="font-size:16px; font-weight:700; color:#002060;">K. G. R. GROUP CO., LTD.</div>
        <div style="font-size:14px; font-weight:700;">ใบรายงานการหักทองและส่งคืน (Gold Return Slip)</div>
      </div>
      
      <div style="font-size:13px; line-height:1.6; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between;">
          <div><strong>RF No.:</strong> <span style="font-family:var(--font-mono); font-weight:700;">\${rf}</span></div>
          <div><strong>วันที่:</strong> \${date}</div>
        </div>
        <div><strong>ชื่อลูกค้า:</strong> \${custName}</div>
        <div><strong>เลขประจำตัวผู้เสียภาษี:</strong> <span style="font-family:var(--font-mono);">\${taxId}</span></div>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:13px; margin-bottom:16px;">
        <tbody>
          <tr>
            <td style="padding:6px; border:1px solid #cbd5e1; background:#f8fafc;">น้ำหนักต้นทาง (แจ้ง / รับจริง)</td>
            <td style="padding:6px; border:1px solid #cbd5e1; text-align:right; font-family:var(--font-mono);">\${wDeclared} / \${wReceived} g</td>
          </tr>
          <tr>
            <td style="padding:6px; border:1px solid #cbd5e1; background:#f8fafc;">ผลการทดสอบ (%Au / %Ag)</td>
            <td style="padding:6px; border:1px solid #cbd5e1; text-align:right; font-family:var(--font-mono);">\${pctAu}% / \${pctAg}%</td>
          </tr>
          <tr>
            <td style="padding:6px; border:1px solid #cbd5e1; background:#f8fafc;">น้ำหนักเนื้อทองคำบริสุทธิ์ที่ได้</td>
            <td style="padding:6px; border:1px solid #cbd5e1; text-align:right; font-family:var(--font-mono);">\${auCalc} g</td>
          </tr>
          <tr>
            <td style="padding:6px; border:1px solid #cbd5e1; background:#f8fafc;">ยอดหัก % Loss (ทอง)</td>
            <td style="padding:6px; border:1px solid #cbd5e1; text-align:right; font-family:var(--font-mono);">\${auLoss}%</td>
          </tr>
          <tr>
            <td style="padding:6px; border:1px solid #cbd5e1; background:#eef2ff; font-weight:700; color:#002060;">น้ำหนักทองสุทธิที่ส่งคืนลูกค้า</td>
            <td style="padding:6px; border:1px solid #cbd5e1; text-align:right; font-family:var(--font-mono); font-weight:700; color:#002060; font-size:14.5px;">\${auReturn} g</td>
          </tr>
        </tbody>
      </table>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; text-align:center; font-size:12px; border-top:1px dashed #cbd5e1; padding-top:16px; margin-top:20px;">
        <div>
          <div>.......................................................</div>
          <div style="margin-top:6px;">ผู้ส่งมอบทอง</div>
        </div>
        <div>
          <div>.......................................................</div>
          <div style="margin-top:6px;">ผู้รับทองคืน (ลูกค้า/ตัวแทน)</div>
        </div>
      </div>
    </div>
  \`;

  const modalHtml = \`
    <div id="goldSlipPreviewModal" class="modal-backdrop" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); display:flex; align-items:center; justify-content:center; z-index:9999;">
      <div class="modal-box" style="background:#f8fafc; width:480px; max-width:95vw; max-height:90vh; border-radius:12px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        <div style="background:#002060; color:#fff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:16px; font-weight:700;">ตัวอย่างใบรายงานหักทอง</h3>
          <button onclick="document.getElementById('goldSlipPreviewModal').remove()" style="background:transparent; border:none; color:#fff; font-size:18px; cursor:pointer;">✕</button>
        </div>
        <div style="padding:16px; overflow-y:auto; flex:1; display:flex; justify-content:center;">
          \${slipHtml}
        </div>
        <div style="background:#fff; border-top:1px solid #e2e8f0; padding:12px 16px; display:flex; justify-content:flex-end; gap:12px;">
          <button class="btn-secondary" onclick="document.getElementById('goldSlipPreviewModal').remove()">ปิด</button>
          <button class="btn-primary" onclick="window.print()">🖨️ สั่งพิมพ์ (Print Slip)</button>
        </div>
      </div>
    </div>
  \`;

  const oldModal = document.getElementById('goldSlipPreviewModal');
  if (oldModal) oldModal.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
};
`;

fs.appendFileSync('d:/work/js/modals.js', content, 'utf8');
