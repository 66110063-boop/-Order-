/* ============================================================
   KGR GROUP — APPLICATION STATE & STATION CONFIG
   ============================================================ */

let state = {
  page: 'dashboard',
  orderTab: 'all',
  lotStage: 'all',
  acctTab: 'nonum',
  stockTab: 'prep',
  custShowTrash: false,
  wizardStep: 1,
  invoiceNo: null,
  invoiceMode: 'new',
  invoiceTemplate: 'gold',
  lotAllocateView: null, // null = landing page; 'bar' | 'pellet' = sub-view
  lotAllocateChecked: [],
  detailStep: 1,
  detailRf: null,
  wfCurrent: 1,      // 10-Station Gold Order Workflow — current station
  wfMaxUnlocked: 1,  // 10-Station Gold Order Workflow — furthest unlocked station
  wfStepperLimit: null, // null = full stepper; 4 = Orders-page context (RF-level only, up to หักทอง)
  wfStepperRange: null, // null = no range filter; [5,9] = จัดการข้อมูลล็อต context (Lot-level stations only)
  rfSummaryTarget: null,
};

/* 10-STATION GOLD ORDER WORKFLOW DEFINITION */
const WF_STATIONS = [
  {n:1, key:'new', label:'สร้าง Order'},
  {n:2, key:'melt', label:'หลอมทองเก่า'},
  {n:3, key:'test', label:'ทดสอบ %'},
  {n:4, key:'deduct', label:'หักทอง'},
  {n:5, key:'presend', label:'ก่อนส่งรีด'},
  {n:6, key:'postsend', label:'หลังส่งรีด'},
  {n:7, key:'extract', label:'ก่อนส่งสกัด'},
  {n:8, key:'pre99', label:'ก่อนหลอม 99'},
  {n:9, key:'post99', label:'ปิดงาน'},
];

// Map station number -> Dashboard Kanban column key
const WF_STATION_TO_KANBAN_KEY = {
  1:'new', 2:'melt', 3:'test', 4:'deduct', 
  5:'presend', 6:'postsend', 7:'extract', 8:'pre99'
};

/* WORKFLOW OPERATOR STAFF LIST */
const WF_STAFF = [
  'สมชาย ช่างทอง', 
  'วิไล ช่างเงิน', 
  'ประยุทธ เจ้าหน้าที่คลัง', 
  'อรทัย เจ้าหน้าที่บัญชี', 
  'ณัฐวุฒิ หัวหน้าไลน์ผลิต'
];

const CURRENT_USER_EMAIL = 'office@kgr.local';
