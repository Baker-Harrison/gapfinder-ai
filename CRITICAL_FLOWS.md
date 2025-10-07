# Critical User Flows

## Flow 1: First-Run Onboarding → Import LOs → 5-min Diagnostic → Heatmap → Guided Practice

### Step 1: First-Run Onboarding
**Screen:** Home (empty state)

**User sees:**
- Welcome message
- Empty state cards with explanatory text
- "Get Started" CTA

**Actions:**
1. Click "Add Content" or "Import LOs"
2. Navigate to Import page

**Success Criteria:**
- User understands the app's purpose
- Clear path to first action
- No confusion about next steps

---

### Step 2: Import Learning Objectives
**Screen:** Import > Learning Objectives tab

**User sees:**
- Large textarea for pasting LOs
- Example format
- "Preview Import" button

**Actions:**
1. Paste learning objectives (one per line):
   ```
   Calculate creatinine clearance using Cockcroft-Gault equation
   Identify drug-drug interactions for warfarin
   Recommend appropriate antibiotic therapy for CAP
   ```
2. Click "Preview Import"
3. Review auto-mapped concepts (80%+ success rate)
4. Click "Confirm Import"

**Success Criteria:**
- ≥80% of LOs auto-mapped to concepts
- Clear preview of what will be imported
- Toast notification on success
- Redirected to Concepts page

**Time:** ~2 minutes

---

### Step 3: 5-Minute Diagnostic
**Screen:** Home > Quick Diagnostic button

**User sees:**
- "Quick Diagnostic (5 min)" button
- Explanation: "Answer 5-10 questions to identify your top gaps"

**Actions:**
1. Click "Quick Diagnostic"
2. Answer 5-10 mixed items across domains
3. Rate confidence (1-5) for each
4. Submit answers and see instant feedback
5. Complete diagnostic

**Success Criteria:**
- Session completes in ≤5 minutes
- Items span multiple domains
- Confidence ratings collected
- Feedback shown immediately
- Results saved to update mastery scores

**Time:** ~5 minutes

---

### Step 4: View Heatmap
**Screen:** Concepts (Heatmap)

**User sees:**
- Color-coded grid of concepts by domain
- Red/orange cells for weak areas
- Green cells for strong areas
- Legend explaining colors

**Actions:**
1. Automatically redirected after diagnostic OR
2. Navigate to Concepts page
3. Observe visual representation of gaps
4. Click on a weak (red) concept cell

**Success Criteria:**
- Heatmap renders in ≤1 second
- Colors clearly distinguish mastery levels
- Clicking cell opens drawer with details
- Weak concepts visually prominent

**Time:** ~30 seconds

---

### Step 5: Guided Practice
**Screen:** Concepts > Concept Drawer > Practice button

**User sees:**
- Concept details (mastery, stability, coverage)
- "Next Best Actions" with recommendations
- "Practice This Concept" button

**Actions:**
1. Review concept details in drawer
2. See remediation plan:
   - "Review 5 previously incorrect items (8 min)"
   - "Practice 10 new items on this concept (15 min)"
3. Click "Practice This Concept"
4. Start focused practice session
5. Complete 5-10 items
6. See updated mastery score

**Success Criteria:**
- Remediation plan shows ≥3 concrete actions
- Practice session starts immediately
- Items filtered to selected concept
- Mastery score updates after session
- User sees progress toward 80% target

**Time:** ~15 minutes

---

**Total Flow Time:** ~23 minutes
**Success Rate Target:** ≥90% task completion

---

## Flow 2: Click Weak Concept → Drill with Mixed Items → Recheck Mastery → Back to Plan

### Step 1: Identify Weak Concept
**Screen:** Home > Top Gaps OR Concepts > Heatmap

**User sees:**
- List of weak concepts (mastery <70)
- Mastery scores and trend arrows
- "Practice" buttons

**Actions:**
1. Identify concept with low mastery (e.g., "Renal Dosing - 45%")
2. Click "Practice" button OR click concept in heatmap

**Success Criteria:**
- Weak concepts clearly highlighted
- One-click access to practice
- Visual feedback on selection

**Time:** ~10 seconds

---

### Step 2: Start Drill Session
**Screen:** Learn (Session Player)

**User sees:**
- Progress bar (e.g., "Question 1 of 10")
- Item stem with context
- Answer controls
- Timer

**Actions:**
1. Read question stem
2. Select/enter answer
3. Rate confidence (1-5)
4. Submit answer
5. Review feedback and explanation
6. Click "Next Question"
7. Repeat for 10 items

**Success Criteria:**
- Items mixed (review + new)
- All items linked to selected concept
- Feedback includes worked solutions (for calc items)
- Keyboard shortcuts work (1-5, Enter, F, G)
- Session completable in ≤15 minutes

**Time:** ~12 minutes

---

### Step 3: Recheck Mastery
**Screen:** Session Complete > Results

**User sees:**
- Session summary:
  - "8/10 correct (80%)"
  - "Average confidence: 3.4"
  - "Renal Dosing mastery: 45% → 58%"
- Updated mastery score
- Trend indicator (↑)

**Actions:**
1. Review session results
2. See mastery improvement
3. Click "View Concept" to see updated heatmap

**Success Criteria:**
- Mastery score updates immediately
- Clear before/after comparison
- Trend shows improvement
- Link to concept details

**Time:** ~30 seconds

---

### Step 4: Return to Plan
**Screen:** Home (Today)

**User sees:**
- Updated "Top Gaps" list
- Concept moved up or removed if mastery ≥70
- New recommendations based on updated scores

**Actions:**
1. Navigate to Home
2. See updated plan
3. Identify next gap to address

**Success Criteria:**
- Plan reflects new mastery scores
- Recommendations update automatically
- User sees progress
- Clear next action

**Time:** ~20 seconds

---

**Total Flow Time:** ~13 minutes
**Success Rate Target:** ≥90% task completion

---

## Flow 3: Author a Calc Item (E-value) → Generate 5 Variants → Add to Session

### Step 1: Navigate to Items
**Screen:** Items (Bank & Authoring)

**User sees:**
- Item table
- "Create Item" button
- Search and filters

**Actions:**
1. Click "Create Item" button
2. Author dialog opens

**Success Criteria:**
- Dialog opens in ≤200ms
- Clear, focused interface
- No distractions

**Time:** ~5 seconds

---

### Step 2: Author E-value Calculation
**Screen:** Author Dialog > Calculation tab

**User sees:**
- Item type tabs (MCQ, Free Recall, Calc, Case, Cloze)
- Calculation-specific fields:
  - Question stem
  - Formula
  - Unit
  - Worked solution

**Actions:**
1. Select "Calculation" tab
2. Enter stem:
   ```
   Calculate the E-value for adding 2 mL of 23.4% NaCl to 100 mL of sterile water.
   ```
3. Enter formula: `E = (0.52 × MW × i) / 1000`
4. Enter unit: `%`
5. Enter worked solution:
   ```
   Step 1: NaCl MW = 58.5, i = 2
   Step 2: E = (0.52 × 58.5 × 2) / 1000 = 0.061
   Step 3: Convert to %: 0.061 × 100 = 6.1%
   ```
6. Link to concept: "Compounding > Isotonicity"
7. Click "Save Item"

**Success Criteria:**
- Formula field supports math notation
- Unit field has common options
- Worked solution supports multi-line
- Concept linking with autocomplete
- Live preview of item

**Time:** ~3 minutes

---

### Step 3: Generate Variants
**Screen:** Items table > Item row > Actions menu

**User sees:**
- Newly created item in table
- Actions: Edit, Duplicate, Generate Variants, Delete

**Actions:**
1. Click "Generate Variants" (or similar action)
2. Specify parameters:
   - Number of variants: 5
   - Vary: Concentration, volume, or both
3. Preview generated variants
4. Click "Create Variants"

**Success Criteria:**
- Variants generated with different values
- Formula remains same
- Worked solutions auto-calculated
- All variants linked to same concept
- Toast notification: "5 variants created"

**Time:** ~1 minute

---

### Step 4: Add to Session
**Screen:** Items table > Bulk actions

**User sees:**
- Checkboxes next to items
- Bulk action toolbar

**Actions:**
1. Select original item + 5 variants (6 total)
2. Click "Add to Session" in bulk toolbar
3. Choose session type: "Practice" or "Exam"
4. Click "Start Session"

**Success Criteria:**
- Multi-select works smoothly
- Bulk actions clearly visible
- Session starts with selected items
- Items appear in random order

**Time:** ~30 seconds

---

**Total Flow Time:** ~5 minutes
**Success Rate Target:** ≥85% task completion

---

## Flow 4: Exam Mode (30 Q) → Report → One-Click Remediation Plan

### Step 1: Start Exam Mode
**Screen:** Home > "Exam Mode" button OR Items > "Create Exam"

**User sees:**
- Exam configuration:
  - Number of questions: 30
  - Time limit: 60 minutes
  - Domains: All or specific
  - Difficulty: Mixed

**Actions:**
1. Click "Exam Mode" or "Create Exam"
2. Configure exam settings
3. Click "Start Exam"

**Success Criteria:**
- Clear exam vs practice distinction
- Configurable settings
- Timer displayed prominently
- No feedback until completion

**Time:** ~30 seconds

---

### Step 2: Complete Exam
**Screen:** Learn (Exam Mode)

**User sees:**
- Question counter (e.g., "15/30")
- Timer (countdown from 60:00)
- Item stem and answer controls
- "Flag for Review" option
- No immediate feedback

**Actions:**
1. Answer 30 questions
2. Rate confidence for each
3. Flag uncertain items
4. Submit exam

**Success Criteria:**
- Timer counts down
- Can navigate between questions
- Flagged items highlighted
- Warning before submit if unanswered
- No feedback until submit

**Time:** ~45 minutes

---

### Step 3: View Exam Report
**Screen:** Exam Results

**User sees:**
- Overall score: "24/30 (80%)"
- Time taken: "42:15"
- Score by domain:
  - Calculations: 85%
  - Cardiology: 75%
  - ID: 90%
  - Neurology: 70%
  - Law: 80%
- Calibration: Brier score 0.15
- Flagged items: 5
- Incorrect items: 6

**Actions:**
1. Review overall performance
2. Identify weak domains
3. Scroll to remediation section

**Success Criteria:**
- Report generates in ≤2 seconds
- Clear visual breakdown
- Domain scores sortable
- Link to review incorrect items

**Time:** ~2 minutes

---

### Step 4: One-Click Remediation
**Screen:** Exam Results > Remediation Plan

**User sees:**
- "Remediation Plan" section
- Weak domains highlighted:
  - **Neurology (70%)**: 4 incorrect
  - **Cardiology (75%)**: 3 incorrect
- Recommended actions:
  - "Review 4 Neurology items (6 min)"
  - "Practice 10 new Neurology items (15 min)"
  - "Review 3 Cardiology items (5 min)"
- "Start Remediation" button

**Actions:**
1. Review remediation plan
2. Click "Start Remediation"
3. Begin focused practice session on weak areas

**Success Criteria:**
- ≥3 concrete actions per weak domain
- Time estimates provided
- One-click to start
- Items prioritized by weakness
- Plan saves for later if not started immediately

**Time:** ~1 minute

---

### Step 5: Complete Remediation
**Screen:** Learn (Remediation Session)

**User sees:**
- Items from weak domains
- Mix of review (incorrect) + new items
- Progress toward domain mastery

**Actions:**
1. Complete remediation items
2. See updated domain scores
3. Return to Home with updated plan

**Success Criteria:**
- Session focuses on weak areas
- Mastery scores update
- User sees progress
- Remediation marked complete

**Time:** ~20 minutes

---

**Total Flow Time:** ~69 minutes
**Success Rate Target:** ≥90% task completion

---

## Acceptance Criteria Summary

### Flow 1: First-Run to Guided Practice
- ✅ User can complete 10-item session with only keyboard
- ✅ Heatmap click opens drawer in ≤1s
- ✅ Post-diagnostic shows ≥3 actions per weak concept
- ✅ Import validates and maps ≥80% of LOs

### Flow 2: Weak Concept to Mastery Improvement
- ✅ One-click from gap to practice
- ✅ Mastery updates immediately after session
- ✅ Plan reflects new scores automatically

### Flow 3: Author Calc Item with Variants
- ✅ Calc item enforces units
- ✅ Displays complete worked solution
- ✅ Variant generation works for parameterized items

### Flow 4: Exam to Remediation
- ✅ Exam mode disables feedback until completion
- ✅ Report shows score by domain
- ✅ One-click remediation with ≥3 actions per weak domain
- ✅ Remediation session prioritizes weak areas

---

## Usability Testing Script

### Pre-Test
1. Explain purpose: "Test the app, not you"
2. Think-aloud protocol
3. No hints unless stuck >2 minutes

### Tasks
1. "Import these learning objectives and run a diagnostic"
2. "Find your weakest concept and practice it"
3. "Create a calculation question about creatinine clearance"
4. "Take a 10-question exam and review your results"

### Post-Test
1. System Usability Scale (SUS) questionnaire
2. Open feedback
3. Identify pain points

### Success Metrics
- Task completion rate: ≥90%
- Time on task: Within estimates ±20%
- Error rate: ≤10%
- SUS score: ≥80 (Grade A)
