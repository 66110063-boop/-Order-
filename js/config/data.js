/* ============================================================
   KGR GROUP — MOCK DATA & CONFIGURATION
   ============================================================ */

const NAV = [
  {key:'dashboard', label:'ภาพรวม', group:'หลัก'},
  {key:'orders', label:'รายการสั่งซื้อ', group:'หลัก', count:5},
  {key:'lot-allocate', label:'การจัดล็อต', group:'หลัก', count:7},
  {key:'lot-manage', label:'รีด/สกัด/หลอม99', group:'หลัก'},
  {key:'tdc-approve', label:'TDC Approve', group:'หลัก'},
  {key:'customers', label:'ลูกค้า', group:'ข้อมูลหลัก'},
  {key:'stock', label:'คลังสินค้า', group:'ข้อมูลหลัก'},
  {key:'accounting', label:'บัญชี', group:'ข้อมูลหลัก', count:2},
  {key:'history', label:'ประวัติการแก้ไข', group:'ระบบ'},
  {key:'users', label:'จัดการผู้ใช้งาน', group:'ระบบ'},
];

const ICONS = {
  'dashboard':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  'orders':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 3h6l1 3H8l1-3z"/><rect x="5" y="6" width="14" height="15" rx="1.5"/><path d="M9 11h6M9 15h6"/></svg>',
  'lot-allocate':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"/><path d="M4 6.5L12 11l8-4.5M12 11v9"/></svg>',
  'lot-manage':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="16" width="18" height="4" rx="1"/></svg>',
  'tdc-approve':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>',
  'customers':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17.5" cy="9" r="2.6"/><path d="M15.7 14.2c2.7.4 4.8 2.4 4.8 5.3"/></svg>',
  'stock':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
  'accounting':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2h9l4 4v16H6V2z"/><path d="M15 2v4h4"/><path d="M9 12h6M9 16h6M9 8h2"/></svg>',
  'report':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M8 17V10M13 17V6M18 17v-4"/></svg>',
  'history':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3.5 2"/></svg>',
  'users':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
};

/* ---------- ORDERS ---------- */
const ORDERS = [
  {rf:'RF-0002', date:'28/08/2569', cust:'นายจระเกียรติ อั้งอร่าม', w:'1240.12', wDeclared:'1245.12', meltedW:'1240.12', percentAu:'88.00', auSample:'1.23', auSampleCust:'0.61', percentAg:'95.00', percentApprovalStatus:'pending', status:'info', statusLabel:'ทดสอบ %', station:3, cancelled:false, lotNo:'—', auCalc:'0.00', auReturn:'0.00', agCalc:'0.00', agReturn:'0.00'},
  {rf:'RF-2569-0084', date:'18/08/2569', cust:'ห้างทองแม่ทองสุก', w:'520.50', wDeclared:'520.50', meltedW:'518.20', percentAu:null, auSample:null, auSampleCust:null, percentAg:null, percentApprovalStatus:'none', status:'info', statusLabel:'ทดสอบ %', station:3, cancelled:false, lotNo:'—', auCalc:'0.00', auReturn:'0.00', agCalc:'0.00', agReturn:'0.00'},
  {rf:'RF-2569-0079', date:'04/08/2569', cust:'ห้างทองเยาวราชกิจ', w:'128.45', status:'info', statusLabel:'สร้าง Order', station:1, cancelled:false, lotNo:'—', meltedW:'0.00', auCalc:'0.00', auReturn:'0.00', agCalc:'0.00', agReturn:'0.00', percentAu:null, percentAg:null, percentApprovalStatus:'none'},
  {rf:'RF-2569-0078', date:'03/08/2569', cust:'ห้างทองชั่วเช่งเฮง', w:'96.20', status:'info', statusLabel:'สร้าง Order', station:1, cancelled:false, lotNo:'—', meltedW:'0.00', auCalc:'0.00', auReturn:'0.00', agCalc:'0.00', agReturn:'0.00', percentAu:null, percentAg:null, percentApprovalStatus:'none'},
  {rf:'RF-2569-0077', date:'03/08/2569', cust:'ห้างทองแม่ทองสุก', w:'412.80', status:'info', statusLabel:'หลอมทองเก่า', station:2, cancelled:false, lotNo:'—', meltedW:'406.10', auCalc:'0.00', auReturn:'0.00', agCalc:'0.00', agReturn:'0.00', percentAu:null, percentAg:null, percentApprovalStatus:'none'},
  {rf:'RF-2569-0083', date:'17/08/2569', cust:'ห้างทองศิริทองคำ', w:'305.10', status:'info', statusLabel:'ทดสอบ %', station:3, cancelled:false, lotNo:'—', meltedW:'300.40', auCalc:'0.00', auReturn:'0.00', agCalc:'0.00', agReturn:'0.00', percentAu:'96.80', percentAg:'0.00', percentApprovalStatus:'pending'},
  {rf:'RF-2569-0082', date:'16/08/2569', cust:'โรงงานทองไทยเจริญ', w:'441.00', status:'info', statusLabel:'ทดสอบ %', station:3, cancelled:false, lotNo:'—', meltedW:'435.20', auCalc:'0.00', auReturn:'0.00', agCalc:'0.00', agReturn:'0.00', percentAu:'0.00', percentAg:'99.90', percentApprovalStatus:'pending'},
  {rf:'RF-2569-0076', date:'31/07/2569', cust:'ห้างทองใบเยาวราช', w:'318.90', status:'progress', statusLabel:'หักทอง', station:4, cancelled:false, lotNo:'LOT-202608-0009', meltedW:'312.50', auCalc:'301.60', auReturn:'286.52', agCalc:'6.25', agReturn:'5.94', percentAu:'96.50', percentAg:'0.00', percentApprovalStatus:'approved'},
  {rf:'RF-2569-0071', date:'26/07/2569', cust:'ห้างทองศิริทองคำ', w:'264.10', status:'progress', statusLabel:'ก่อนส่งรีด', station:5, cancelled:false, lotNo:'LOT-202608-0007', meltedW:'260.80', auCalc:'251.72', auReturn:'239.13', agCalc:'5.22', agReturn:'4.96', percentAu:'96.20', percentAg:'0.00', percentApprovalStatus:'approved'},
  {rf:'RF-2569-0069', date:'24/07/2569', cust:'โรงงานทองไทยเจริญ', w:'447.50', status:'progress', statusLabel:'ก่อนส่งสกัด', station:7, cancelled:false, lotNo:'LOT-202608-0006', meltedW:'441.00', auCalc:'425.56', auReturn:'404.28', agCalc:'8.82', agReturn:'8.38', percentAu:'96.60', percentAg:'0.00', percentApprovalStatus:'approved'},
  {rf:'RF-2569-0075', date:'28/07/2569', cust:'โรงงานทองไทยเจริญ', w:'220.10', status:'done', statusLabel:'ปิดงาน', station:9, cancelled:false, lotNo:'LOT-202608-0002', meltedW:'216.90', auCalc:'209.30', auReturn:'198.84', agCalc:'4.34', agReturn:'4.12', percentAu:'96.40', percentAg:'0.00', percentApprovalStatus:'approved'},
  {rf:'RF-2569-0060', date:'20/07/2569', cust:'ห้างทองแม่ทองย้อย', w:'150.00', status:'hold', statusLabel:'ยกเลิก', station:1, cancelled:true, lotNo:'—', meltedW:'0.00', auCalc:'0.00', auReturn:'0.00', agCalc:'0.00', agReturn:'0.00', percentAu:null, percentAg:null, percentApprovalStatus:'none'},
];
const ORDER_TABS = [
  {key:'all', label:'ทั้งหมด'},
  {key:'new', label:'สร้าง Order'},
  {key:'melt', label:'หลอมทองเก่า'},
  {key:'test', label:'ทดสอบ %'},
  {key:'deduct', label:'หักทอง'},
  {key:'closed', label:'ปิดงาน'},
  {key:'cancel', label:'ยกเลิก'},
];

/* ---------- LOT ALLOCATE (จัด Lot) ---------- */
const LOT_ALLOCATE = [
  {rf:'RF-26081301', date:'01/08/2569', cust:'โรงงานทองไทยเจริญ', wDeclared:'300.50', w:'300.00', type:'bar'},
  {rf:'RF-B006', date:'31/07/2569', cust:'ห้างทองแม่ทองย้อย', wDeclared:'152.80', w:'152.30', type:'bar'},
  {rf:'RF-B008', date:'30/07/2569', cust:'ห้างทองศิริทองคำ', wDeclared:'264.50', w:'264.10', type:'bar'},
  {rf:'RF-B009', date:'29/07/2569', cust:'ห้างทองเยาวราชกิจ', wDeclared:'448.00', w:'447.50', type:'bar'},
  {rf:'RF-010', date:'18/08/2569', cust:'ห้างทองใบเยาวราช', wDeclared:'88.90', w:'88.40', type:'pellet'},
  {rf:'RF-011', date:'17/08/2569', cust:'ห้างทองชั่วเช่งเฮง', wDeclared:'177.40', w:'176.90', type:'pellet'},
  {rf:'RF-012', date:'16/08/2569', cust:'สมชาย ใจดี', wDeclared:'64.50', w:'64.00', type:'pellet'},
];

/* ---------- LOT MANAGE (จัดการข้อมูล Lot) — grouped by stage ---------- */
const LOT_STAGES = [
  {key:'all', label:'ทั้งหมด'},
  {key:'presend', label:'ก่อนส่งรีด'},
  {key:'postsend', label:'หลังส่งรีด'},
  {key:'extract', label:'สกัด'},
  {key:'pre99', label:'ก่อนหลอม 99'},
  {key:'post99', label:'หลังส่งหลอม 99'},
  {key:'closed', label:'ปิดงาน'},
];
const LOT_MANAGE_DATA = {
  presend: [
    {lot:'KGR2608-0015', jobType:'แบบแท่ง', date:'27/08/2569', rfRows: [{rf:'RF-GG2', cust:'นายศุภพัฒน์ ตริเทพาสัมพันธ์', wDec:'100.00', wRec:'100.00', wBill:'100.00'}]},
  ],
  postsend: [
    {lot:'KGR2608-0016', jobType:'แบบแท่ง', date:'27/08/2569', rfRows: [{rf:'RF-GG2', cust:'นายศุภพัฒน์ ตริเทพาสัมพันธ์', wDec:'100.00', wRec:'100.00', wBill:'100.00'}]},
  ],
  extract: [
    {lot:'KGR2608-0017', jobType:'แบบแท่ง', date:'27/08/2569', rfRows: [{rf:'RF-GG2', cust:'นายศุภพัฒน์ ตริเทพาสัมพันธ์', wDec:'100.00', wRec:'100.00', wBill:'100.00'}]},
  ],
  pre99: [
    {lot:'LOT-202608-0012', jobType:'แบบแท่ง', date:'27/08/2569', rfRows: [{rf:'RF-GG4', cust:'สมชาย ใจดี', wDec:'100.00', wRec:'100.00', wBill:'100.00', percentAu:'10.00', auG:'10.00', percentAg:'10.00', agG:'10.00'}]},
    {lot:'LOT-202608-0011', jobType:'แบบเม็ด', date:'27/08/2569', rfRows: [{rf:'RF-GG5', cust:'โรงงานทองไทยเจริญ', wDec:'300.00', wRec:'300.00', wBill:'300.00', percentAu:'10.00', auG:'10.00', percentAg:'10.00', agG:'10.00'}]},
  ],
  post99: [
    {lot:'LOT-202608-0013', jobType:'แบบแท่ง', date:'27/08/2569', rfRows: [{rf:'1150', cust:'นายขจรเกียรติ พึ่งสำราญ', wDec:'100.00', wRec:'20.00', wBill:'100.00', percentAu:'100.00', auG:'100.00', percentAg:'100.00', agG:'10.00'}]},
    {lot:'LOT-202608-0008', jobType:'แบบแท่ง', date:'25/08/2569', rfRows: [{rf:'RF-GG6', cust:'ห้างทองแม่ทองย้อย', wDec:'250.00', wRec:'250.00', wBill:'250.00'}]},
    {lot:'LOT-202608-0007', jobType:'แบบแท่ง', date:'25/08/2569', rfRows: [{rf:'RF-GG7', cust:'ห้างทองเยาวราชกิจ', wDec:'100.00', wRec:'100.00', wBill:'100.00'}]},
    {lot:'LOT-202608-0006', jobType:'แบบแท่ง', date:'24/08/2569', rfRows: [{rf:'RF-GG8', cust:'ห้างทองศิริทองคำ', wDec:'500.00', wRec:'500.00', wBill:'500.00'}]},
  ],
  closed: [
    {lot:'KGR2608-0015', jobType:'แบบแท่ง', date:'27/08/2569', rfRows: [{rf:'RF-GG2', cust:'นายศุภพัฒน์ ศรีเทพาสัมพันธ์', wDec:'100.00', wRec:'100.00', wBill:'100.00', percentAu:'10.00', auG:'10.00', percentAg:'10.00', agG:'10.00'}]},
    {lot:'LOT-202608-0014', jobType:'แบบแท่ง', date:'27/08/2569', rfRows: [{rf:'RF-GG9', cust:'ห้างทองใบเยาวราช', wDec:'400.00', wRec:'400.00', wBill:'400.00'}]},
    {lot:'LOT-202608-0010', jobType:'แบบแท่ง', date:'26/08/2569', rfRows: []},
    {lot:'LOT-202608-0009', jobType:'แบบแท่ง', date:'26/08/2569', rfRows: []},
    {lot:'LOT-202608-0005', jobType:'แบบแท่ง', date:'21/08/2569', rfRows: []},
    {lot:'LOT-202608-0004', jobType:'แบบแท่ง', date:'21/08/2569', rfRows: []},
  ],
};

/* ---------- CUSTOMERS ---------- */
const CUSTOMERS = [
  {name:'นายศุภพัฒน์ ตริเทพาสัมพัทธ์', phone:'0904183535', orders:2, date:'15/08/2569'},
  {name:'โรงงานทองไทยเจริญ', phone:'038601234', orders:2, date:'24/07/2569'},
  {name:'วิไล รุ่งเรือง', phone:'0811112222', orders:2, date:'24/07/2569'},
  {name:'สมชาย ใจดี', phone:'0812345678', orders:2, date:'24/07/2569'},
  {name:'ห้างทองชั่วเช่งเฮง', phone:'0812345674', orders:5, date:'08/08/2569'},
  {name:'ห้างทองใบเยาวราช', phone:'0812345675', orders:5, date:'08/08/2569'},
  {name:'ห้างทองแม่ทองย้อย', phone:'0812345676', orders:3, date:'08/08/2569'},
  {name:'ห้างทองแม่ทองสุก', phone:'027001234', orders:3, date:'24/07/2569'},
  {name:'ห้างทองเยาวราชกิจ', phone:'0812345671', orders:3, date:'08/08/2569'},
  {name:'ห้างทองเลี่ยงเส็งเฮง', phone:'0812345677', orders:2, date:'08/08/2569'},
  {name:'ห้างทองศิริทองคำ', phone:'0812345678', orders:2, date:'08/08/2569'},
  {name:'ห้างทองซั่วเข่งเฮง', phone:'0812345673', orders:2, date:'08/08/2569'},
  {name:'อรุณี แสงทอง', phone:'0898887777', orders:0, date:'24/07/2569'},
];
const CUSTOMERS_TRASH = [
  {name:'ทองไทย เอ็กซ์ปอร์ต', phone:'021239999', orders:0, date:'02/08/2569', deletedBy:'สุดา บัญชีทอง', deletedAt:'10/08/2569 14:20'},
];

/* ---------- ACCOUNTING / INVOICES ---------- */
const INV_NO_NUMBER = [
  {rf:'RF-0007', date:'10/08/2569', cust:'โรงงานทองไทยเจริญ', total:'107.00'},
  {rf:'RF-0011', date:'11/08/2569', cust:'ห้างทองแม่ทองย้อย', total:'112,350.00'},
];
const INV_WITH_NUMBER = [
  {no:'69/5', date:'10/08/2569', cust:'วิไล รุ่งเรือง', total:'107.00', rf:'RF-0007'},
  {no:'69/4', date:'10/08/2569', cust:'บริษัท บีบีบี จำกัด', total:'1,926.00', rf:'RF-0004'},
];
const INV_GENERAL = [
  {no:'69/3', date:'05/08/2569', cust:'ห้างทองศิริทองคำ', total:'4,280.00'},
  {no:'69/2', date:'02/08/2569', cust:'ห้างทองเยาวราชกิจ', total:'2,150.00'},
];

/* ---------- EDIT HISTORY ---------- */
const HISTORY = [
  {
    who:'สมชาย ทองดี', when:'18/08/2569 · 14:32', target:'Invoice 69/5 · วิไล รุ่งเรือง',
    desc:'แก้ไขจำนวนเงินและรายละเอียดรายการที่ 1',
    fields:['จำนวนเงิน','รายละเอียด'],
    diff:[
      {field:'รายการที่ 1 — รายละเอียด', old:'ทดสอบ', neu:'ค่าหลอมทอง 99.99% (Lot 202608-0016)'},
      {field:'จำนวนเงิน', old:'100.00', neu:'2,450.00'},
      {field:'รวมทั้งสิ้น', old:'107.00', neu:'2,621.50'},
    ]
  },
  {
    who:'อภิรัตน์ ตรวจสอบ', when:'18/08/2569 · 11:05', target:'RF-260813 · ห้างทองศิริทองคำ',
    desc:'แก้ไขน้ำหนักหลังหลอมในขั้นตอนหลังส่งหลอม 99',
    fields:['น้ำหนักหลังหลอม'],
    diff:[
      {field:'น้ำหนักเข้า (g)', old:'3,010.00', neu:'3,001.00'},
      {field:'น้ำหนักหลังหลอม (g)', old:'2,995.40', neu:'2,988.75'},
    ]
  },
  {
    who:'ณัฐพงษ์ หลอมดี', when:'17/08/2569 · 16:47', target:'LOT-202608-0016 · จัดการข้อมูล Lot',
    desc:'ย้ายสถานะ Lot จาก "ก่อนส่งหลอม 99" เป็น "หลังส่งหลอม 99"',
    fields:['สถานะ'],
    diff:[
      {field:'สถานะ', old:'ก่อนส่งหลอม 99', neu:'หลังส่งหลอม 99'},
      {field:'วันที่อัปเดต', old:'16/08/2569', neu:'17/08/2569'},
    ]
  },
  {
    who:'สุดา บัญชีทอง', when:'17/08/2569 · 09:12', target:'ลูกค้า · ทองไทย เอ็กซ์ปอร์ต',
    desc:'ลบข้อมูลลูกค้า (ย้ายเข้าถังขยะ — กู้คืนได้)',
    fields:['สถานะข้อมูล'],
    diff:[
      {field:'สถานะ', old:'ใช้งานอยู่', neu:'ถูกลบ (soft delete)'},
    ]
  },
  {
    who:'ปริชา ฝ่ายขาย', when:'16/08/2569 · 10:20', target:'RF-B005 · ห้างทองใบเยาวราช',
    desc:'แก้ไขข้อมูลลูกค้าและรูปแบบทองในสร้าง Order',
    fields:['ชนิดหลอม','รูปแบบ'],
    diff:[
      {field:'รูปแบบ', old:'แบบแท่ง', neu:'แบบเม็ด'},
      {field:'รายละเอียด', old:'—', neu:'ลูกค้าขอเก็บตัวอย่างก่อนหลอม'},
    ]
  },
];

/* ---------- USERS ---------- */
const USERS = [
  {name:'สุดา บัญชีทอง', email:'accounting@kgr.local', role:'บัญชีทอง', status:'active'},
  {name:'อรรถพล เนื้อเก้า', email:'smelter5@kgr.local', role:'ช่างหลอม/จัด/สกัด', status:'active'},
  {name:'วิโรจน์ ช่างทอง', email:'smelter4@kgr.local', role:'ช่างหลอม/จัด/สกัด', status:'active'},
  {name:'ประเสริฐ เตาหลอม', email:'smelter3@kgr.local', role:'ช่างหลอม/จัด/สกัด', status:'active'},
  {name:'ณัฐพงษ์ หลอมดี', email:'smelter2@kgr.local', role:'ช่างหลอม/จัด/สกัด', status:'active'},
  {name:'ชัยวัฒน์ ทองแท้', email:'smelter1@kgr.local', role:'ช่างหลอม/จัด/สกัด', status:'active'},
  {name:'ปริชา ฝ่ายขาย', email:'sale@kgr.local', role:'เซลส์', status:'active'},
  {name:'สุรชัย ทองดี', email:'smelt03@kgr.local', role:'ช่างหลอม/จัด/สกัด', status:'active', phone:'0833333303'},
];

/* ---------- KANBAN (Dashboard) ---------- */
const KANBAN_COLS = [
  // ===== เลน 1 — ระดับ RF No (เมนูบิลรับงาน) =====
  {key:'new', label:'NEW', color:'plain', items:[
    {rf:'RF-004', cust:'ห้างทองเยาวราชกิจ', date:'18/08/2569', w:'85.20'},
    {rf:'RF-005', cust:'ห้างทองศิริทองคำ', date:'18/08/2569', w:'212.00'},
  ]},
  {key:'melt', label:'หลอม', color:'progress', items:[
    {rf:'RF-006', cust:'โรงงานทองไทยเจริญ', date:'17/08/2569', w:'160.40'},
  ]},
  {key:'test', label:'ทดสอบ %', color:'test', items:[
    {rf:'RF-007', cust:'ห้างทองแม่ทองย้อย', date:'16/08/2569', w:'93.75'},
    {rf:'RF-008', cust:'ห้างทองชั่วเช่งเฮง', date:'16/08/2569', w:'305.10'},
  ]},
  {key:'tdc', label:'TDC', color:'info', items:[
    {rf:'RF-002', cust:'นายศุภพัฒน์ ตริเทพาสัมพัทธ์', date:'13/08/2569', w:'100.00'},
  ]},
  {key:'deduct', label:'หักทอง', color:'sched', items:[
    {rf:'RF-009', cust:'ห้างทองใบเยาวราช', date:'15/08/2569', w:'147.60'},
  ]},

  // ===== เลน 2 — ระดับ Lot No (การจัดล็อต/รีด/สกัด/หลอม99) =====
  {key:'lot', label:'จัดล็อต', color:'sched', items:[
    {rf:'RF-B009', cust:'ห้างทองเยาวราชกิจ', lot:'LOT-202608-0003', date:'29/07/2569', w:'447.50'},
    {rf:'RF-B008', cust:'ห้างทองศิริทองคำ', lot:'LOT-202608-0004', date:'30/07/2569', w:'264.10'},
  ]},
  {key:'presend', label:'ก่อนส่งรีด', color:'info', items:[
    {rf:'RF-B006', cust:'ห้างทองแม่ทองย้อย', lot:'LOT-202608-0005', date:'31/07/2569', w:'152.30'},
  ]},
  {key:'postsend', label:'หลังส่งรีด', color:'done', items:[
    {rf:'RF-26081301', cust:'โรงงานทองไทยเจริญ', lot:'LOT-202608-0006', date:'01/08/2569', w:'300.00'},
  ]},
  {key:'extract', label:'สกัด', color:'sched', items:[
    {rf:'FO-155', cust:'ห้างทองชั่วเช่งเฮง', lot:'LOT-202608-0007', date:'07/08/2569', w:'100.00'},
  ]},
  {key:'pre99', label:'ก่อนส่งหลอม 99', color:'hold', items:[
    {rf:'GOLD-123', cust:'สมชาย ใจดี', lot:'LOT-202608-0008', date:'12/08/2569', w:'200.00'},
  ]},
  {key:'post99', label:'หลังส่งหลอม 99', color:'hold', items:[
    {rf:'RF-001', cust:'มาลิ มีนา', lot:'LOT-202608-0001', date:'14/08/2569', w:'100.00'},
  ]},
];

const KANBAN_CLOSED = [
  {rf:'RF-003', cust:'มาลิ มีนา', lot:'LOT-202608-0002', date:'08/08/2569', w:'10.00'},
];

/* ---------- THAI PROVINCES & DISTRICTS (LOCATION DROPDOWNS) ---------- */
const TH_LOCATIONS = {
  'กรุงเทพมหานคร': {
    'เขตจตุจักร': ['จตุจักร','ลาดยาว','เสนานิคม','จันทรเกษม'],
    'เขตบางรัก': ['บางรัก','สีลม','สุริยวงศ์'],
    'เขตห้วยขวาง': ['ห้วยขวาง','บางกะปิ','สามเสนนอก'],
  },
  'สมุทรปราการ': {
    'เมืองสมุทรปราการ': ['ปากน้ำ','สำโรงเหนือ','บางเมือง'],
    'บางพลี': ['บางพลีใหญ่','บางแก้ว','บางปลา'],
  },
  'เชียงใหม่': {
    'เมืองเชียงใหม่': ['ศรีภูมิ','ช้างม่อย','หายยา'],
    'สันทราย': ['สันทรายหลวง','สันทรายน้อย','หนองแหย่ง'],
  },
  'ชลบุรี': {
    'เมืองชลบุรี': ['บางปลาสร้อย','มะขามหย่ง','บ้านสวน'],
    'ศรีราชา': ['ศรีราชา','สุรศักดิ์','หนองขาม'],
  },
};
