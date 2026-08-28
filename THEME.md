# KGR Group — ระบบจัดการ Order ทอง
## Design System Reference (THEME.md)

เอกสารนี้สรุปธีมสี/รูปแบบที่ใช้ทั้งเว็บ ใช้เป็นข้อมูลอ้างอิงเวลาสั่งงาน AI (Claude, Antigravity, ฯลฯ) ให้แก้/เพิ่มหน้าใหม่ **ต้องใช้ token และ class ที่มีอยู่แล้วในรายการนี้เท่านั้น ห้ามสร้างของใหม่ซ้ำซ้อน**

ไฟล์ต้นทาง: `css/tokens.css`, `css/layout.css`, `css/components.css`, `css/responsive.css`

---

## 1. สีหลัก (Brand Colors)

| Token | ค่าจริง (Hex) | ใช้ตรงไหน |
|---|---|---|
| `--header-bg` | `#002060` น้ำเงินกรมท่า | Topbar, ปุ่มหลัก, Active nav, RF No./Lot No. ในหัวการ์ด |
| `--btn-primary` | `#0056FF` ฟ้าสด | Accent, badge, hover, focus ring |
| `--btn-primary-hover` | เข้มกว่า btn-primary เล็กน้อย | สถานะ hover ของปุ่มหลัก |
| `--table-head-bg` | น้ำเงินเข้มกว่า header-bg | หัวตาราง (thead) |
| `--page-bg` / `--main-bg` | `#F8FAFC` เทาอ่อนสะอาด | พื้นหลังหน้าเว็บทั้งหมด |
| `--surface` | `#FFFFFF` ขาว | การ์ด, Sidebar, ช่อง Input, พื้นผิวตาราง |
| `--card-highlight-bg` | ฟ้าอ่อนอมม่วง | หัว Panel สรุปผล/ผู้ดำเนินการ (`.panel-head-blue`) |
| `--soft-blue` | `#EFF6FF` | ไฮไลต์สถานะทั่วไป |
| `--text-primary` | `#1E293B` | ตัวหนังสือหลัก (คอนทราสต์สูงเพื่อผู้สูงอายุ) |
| `--text-secondary` | `#4B5563` | ตัวหนังสือรอง (เข้มกว่าปกติโดยตั้งใจ) |
| `--border` | `#E2E8F0` | เส้นขอบบางของการ์ด/ตาราง |
| `--border-strong` | เข้มกว่า border | เส้นขอบช่อง Input |
| `--zebra` | เทาอ่อนมาก | แถบสลับสีในตาราง |

### Sidebar
| Token | ใช้ตรงไหน |
|---|---|
| `--sidebar-bg` | พื้นหลัง Sidebar (ขาว) |
| `--sidebar-active` | เมนูที่กำลังเลือก (น้ำเงินกรมท่า) |
| `--sidebar-fg` | ตัวหนังสือเมนูปกติ |
| `--sidebar-active-pill-bg` | พื้นหลังเมนูที่ active แบบฟ้าอ่อน |
| `--nav-hover-bg` / `--nav-hover-fg` | สถานะ hover ของเมนู |

---

## 2. สีสถานะ (Status Badges) — 5 ชุดคงที่ ห้ามผสมกัน

| Token | ความหมาย | สี |
|---|---|---|
| `--st-info-*` | เพิ่งเริ่มงาน | เทา-ฟ้า |
| `--st-progress-*` | กำลังดำเนินการ | ส้ม |
| `--st-done-*` | เสร็จสิ้น | เขียว |
| `--st-hold-*` | **สงวนเฉพาะ "ยกเลิก" เท่านั้น** | แดง |
| `--st-sched-*` | หมวดพิเศษ (เช่น ฝั่ง Ag-เงิน) | ม่วง |

แต่ละชุดมี 3 ตัวแปรย่อย: `-bg` (พื้นหลัง), `-fg` (ตัวหนังสือ), `-bd` (ขอบ) — ใช้คู่กับ class `.badge-info`, `.badge-progress`, `.badge-done`, `.badge-hold`, `.badge-sched`

**กติกา:** ห้ามใช้สีแดง (`hold`) กับสถานะปกติที่ไม่ใช่การยกเลิก แม้จะรู้สึกว่า "เข้มดี" ก็ตาม

### Document-type badges (ต้นฉบับ/สำเนา)
`--doc-original-*` (เหลือง), `--doc-copy1-*` (เขียว), `--doc-copy2-*` (ฟ้า)

---

## 3. ฟอนต์ (2 แบบเท่านั้น — เพื่อความเป็นระเบียบและทางการ)

| Font | ใช้กับ |
|---|---|
| **Sarabun** (`--font-body` และ `--font-display`) | หัวข้อ h1–h4 (ตัวหนา 700) **และ** เนื้อหาทั่วไปทั้งหมด, label, ปุ่ม |
| **Roboto** (`--font-mono`) | ตัวเลข/น้ำหนักเท่านั้น — ใช้ class `.num` หรือ `.mono`, จัดชิดขวาเสมอ, เปิด `font-variant-numeric: tabular-nums` เพื่อให้ตัวเลขจัดคอลัมน์ตรงกัน |

**หลักการ:** ใช้แค่ 2 ตระกูลฟอนต์ทั้งเว็บ — Sarabun (ข้อความทั้งหมดรวมหัวข้อ) และ Roboto (ตัวเลขล้วน) ห้ามเพิ่มฟอนต์ที่ 3 ฟอนต์ตัวเลขควบคุมจาก token เดียว (`--font-mono` ใน tokens.css) ห้าม hardcode ชื่อฟอนต์ตรงๆ ใน component ใดๆ อีก — เปลี่ยนที่เดียวใน tokens.css พอ

### ขนาดฟอนต์ที่ใช้จริง (px)

| ขนาด | ใช้ตรงไหน |
|---|---|
| **32px** | ตัวเลขสรุปใหญ่ (`.stat-card .value`) |
| **26px** | ช่อง % แบบเน้น (`.percent-input-lg`) |
| **24px** | หัวข้อหน้า (`.page-head h1`) |
| **22px** | หัวการ์ดตัวเลือก (`.choice-card-title`), ยอดรวมย่อย (`.calc-subtotal .val`) |
| **20px** | ตัวเลขในช่อง Input (`.num-input`), หัว Modal (`.modal-head h3`), หัว Invoice |
| **18px** | Label ของช่องกรอก (`.field label`), ค่า Readonly (`.ro-val`), ขนาด body พื้นฐานทั้งเว็บ (`body`) |
| **17px** | ตัวหนังสือในตาราง (`tbody td`), หัว Panel เลือกเทมเพลต |
| **16px** | ค่าเริ่มต้นของเว็บ (ปุ่ม, breadcrumb, sidebar, badge, tab, label ย่อย ฯลฯ — ใช้เยอะที่สุด) |
| **16.5px** | ปุ่มบางแบบเฉพาะ |
| **15px** | หัว badge สถานะ Lot (`.lot-stage-badge`), เลข Lot ใน Kanban card |
| **14px** | badge เล็ก (เช่น badge บนแท็บ) |
| **12px** | `.field-tag` ("กรอกเอง") — เล็กสุดในระบบ |

**กติกา:** ห้ามใช้ต่ำกว่า **16px** กับตัวหนังสือที่ผู้ใช้ต้องอ่าน/กรอกจริง (เพื่อผู้สูงอายุ/ช่างโรงงาน) — 12-14px ใช้ได้เฉพาะ badge/tag เสริมเท่านั้น

---

## 4. Spacing Scale (4pt grid)

`--space-3xs` (4px) → `--space-2xs` (8px) → `--space-xs` (12px) → `--space-sm` (16px) → `--space-md` (20px) → `--space-lg` (24px) → `--space-xl` (32px) → `--space-2xl` (40px) → `--space-3xl` (56px)

## Radius & Shadow
- `--radius-sm` 8px / `--radius-md` 12px / `--radius-lg` 18px
- `--shadow-sm` / `--shadow-md` / `--shadow-lg` — ใช้กับการ์ดและ modal

---

## 5. Component มาตรฐาน (ต้องใช้ซ้ำเสมอ ห้ามสร้างใหม่)

```
.panel                        → กล่องเนื้อหาหลัก (มีขอบ, เงา, มุมโค้ง)
.panel-head                   → หัว Panel (พื้นเทา) ใช้ทั่วไป
.panel-head-blue              → หัว Panel (พื้นฟ้าอ่อน) ใช้กับกล่องสรุปผล/ผู้ดำเนินการ
.panel-body                   → เนื้อหาภายใน Panel

.field                        → ช่องกรอกข้อมูล 1 หน่วย (label + input)
.field label                  → ป้ายชื่อช่อง
.field-tag                    → badge "กรอกเอง" (สีฟ้า ใช้ wfManualTag())

.num-input                    → ช่องตัวเลข (ล็อกพิมพ์ได้แค่ 0-9 กับจุดทศนิยม, ชิดขวา)
.input-locked                 → ช่อง Readonly (พื้นเทาอ่อน)
diff-match / diff-mismatch    → สีเขียว/แดง เฉพาะช่อง "ขาด/เกิน" เท่านั้น (Minimal accent)

.grid-2 / .grid-3 / .grid-4   → จัดคอลัมน์ความกว้างเท่ากัน
.section-label                → หัวข้อย่อยภายใน Panel (เช่น "ก่อนหลอม 99")

.badge + badge-info/progress/done/hold/sched
.decision-card + .approve/.reject → การ์ดเลือกอนุมัติ/ไม่อนุมัติ (radio-backed)

.btn-primary                  → ปุ่มหลัก (น้ำเงิน)
.btn-secondary                → ปุ่มรอง (ขอบเทา)
.btn-danger-ghost             → ปุ่มอันตราย/ปฏิเสธ (ขอบแดง พื้นโปร่ง)

.table-wrap                   → กรอบตาราง (ขอบมน, overflow:hidden — ห้ามแก้ตัวนี้ตรงๆ)
.tabs / .tab                  → แท็บสลับมุมมอง
.step-chip                    → Stepper (ใช้ใน Workflow และ Order Wizard)
.seg-control                  → ปุ่มเลือกแบบบล็อกใหญ่ (แทน dropdown)
```

### ตารางกว้างเกินจอ
ห้ามแก้ `.table-wrap` (ใช้ทั่วเว็บ ต้องคง `overflow:hidden` ไว้เพื่อขอบมน) — ให้ซ้อน `<div style="overflow-x:auto;">` ไว้ข้างในแทน:
```html
<div class="table-wrap">
  <div style="overflow-x:auto;">
    <table style="min-width:1400px;">...</table>
  </div>
</div>
```

---

## 6. กติกาเหล็ก (ห้ามฝ่าฝืนเวลาแก้ไข/เพิ่มหน้าใหม่)

1. **ห้าม hardcode สี hex** ในไฟล์ .js หรือ .css — ทุกสีต้องมาจาก `var(--token-name)` เท่านั้น
2. **ห้ามสร้าง class ใหม่ที่ซ้ำหน้าที่กับของเดิม** — เช็ครายการข้อ 5 ก่อนเสมอ
3. **ห้ามใช้ไอคอนจากไลบรารีภายนอก** (Font Awesome ฯลฯ) — ใช้ฟังก์ชัน SVG ที่มีอยู่แล้ว (`iconEye()`, `iconCheck()`, `iconDownload()` ฯลฯ)
4. **ห้ามแก้ field/label/data-attribute** เวลาทำงานด้าน UI — งานปรับธีมคือแก้ class/style เท่านั้น ไม่แตะโครงสร้างข้อมูล
5. ช่องตัวเลขทุกช่องต้องมี class `.num-input` เสมอ (ระบบจะล็อกการพิมพ์ให้อัตโนมัติ)
