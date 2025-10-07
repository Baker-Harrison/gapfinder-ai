# Getting Started with GapFinder AI

## Quick Start Guide

### Installation

1. **Install dependencies:**
   ```bash
   cd gapfinder-ai
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Navigate to `http://localhost:1420`
   - App should load with empty state

### First-Time Setup

#### Step 1: Import Learning Objectives

1. Click **"Import"** in the sidebar
2. Select **"Learning Objectives"** tab
3. Paste your LOs (one per line):
   ```
   Calculate creatinine clearance using Cockcroft-Gault
   Identify major drug interactions for warfarin
   Recommend first-line therapy for hypertension
   Counsel patients on proper inhaler technique
   ```
4. Click **"Preview Import"**
5. Review auto-mapped concepts
6. Click **"Confirm Import"**

✅ **Success:** You should see a toast notification and be redirected to the Concepts page.

---

#### Step 2: Run a Quick Diagnostic

1. Navigate to **"Home"**
2. Click **"Quick Diagnostic (5 min)"**
3. Answer 5-10 questions
4. Rate your confidence (1-5) for each
5. Review feedback after each question
6. Complete the diagnostic

✅ **Success:** Your mastery scores are now calculated and visible in the heatmap.

---

#### Step 3: Explore the Heatmap

1. Navigate to **"Concepts"**
2. Observe the color-coded grid:
   - 🟢 Green = Strong (≥80%)
   - 🟡 Yellow = Developing (70-79%)
   - 🟠 Orange = Weak (50-69%)
   - 🔴 Red = Critical Gap (<50%)
3. Click on a **red or orange cell**
4. Review concept details in the drawer
5. Click **"Practice This Concept"**

✅ **Success:** A focused practice session starts with items linked to that concept.

---

#### Step 4: Complete a Practice Session

1. Read the question stem
2. Select/enter your answer
3. Rate your confidence (1-5)
4. Click **"Submit Answer"**
5. Review the feedback and explanation
6. Click **"Next Question"**
7. Repeat until session complete

✅ **Success:** Your mastery score updates and you see progress.

---

## Key Features Overview

### 🏠 Home (Today)

**What it shows:**
- Today's plan (reviews + diagnostics)
- Top 5 gaps (weakest concepts)
- Coverage percentage
- Quick actions

**What you can do:**
- Start a session
- Run a quick diagnostic
- Review only
- Add content

---

### 📚 Learn (Session Player)

**What it shows:**
- Current question
- Progress bar
- Timer
- Context pane (linked concepts, shortcuts)

**What you can do:**
- Answer questions (MCQ, free recall, calc, case, cloze)
- Rate confidence
- Flag items
- View explanations

**Keyboard shortcuts:**
- `1-5`: Select MCQ option
- `Enter`: Submit answer
- `F`: Flag item
- `G`: Open concept drawer

---

### 🧠 Concepts (Heatmap)

**What it shows:**
- Visual grid of all concepts
- Color-coded by mastery
- Grouped by domain

**What you can do:**
- Filter by weakness
- Search concepts
- Click to see details
- Start focused practice
- Export snapshot

---

### 📝 Items (Bank & Authoring)

**What it shows:**
- Searchable table of all items
- Type, concepts, difficulty
- Last edit date

**What you can do:**
- Create new items (MCQ, calc, free recall, case, cloze)
- Edit existing items
- Duplicate items
- Import CSV
- Bulk operations

---

### 📊 Analytics

**What it shows:**
- Performance over time
- Calibration (confidence vs accuracy)
- Error patterns
- Domain breakdown

**What you can do:**
- Track progress
- Identify error types
- View Brier score
- Export reports

---

### 📥 Import

**What it shows:**
- Import pipelines (LOs, CSV, Anki)
- Preview before import
- Recent imports

**What you can do:**
- Import learning objectives
- Upload CSV files
- Import Anki decks
- Map concepts

---

### ⚙️ Settings

**What it shows:**
- General settings (theme, font, formats)
- SRS parameters
- Mastery thresholds
- Privacy & backup

**What you can do:**
- Toggle dark mode
- Adjust FSRS parameters
- Set mastery thresholds
- Export/restore backups

---

## Common Workflows

### Workflow 1: Daily Review Routine

1. Open app → Home
2. Check "Today's Plan"
3. Click "Start Session"
4. Complete reviews (10-15 min)
5. Check updated mastery scores

**Time:** ~15 minutes/day

---

### Workflow 2: Exam Preparation

1. Navigate to Home
2. Click "Exam Mode"
3. Configure: 30 questions, 60 minutes
4. Complete exam
5. Review results
6. Click "Start Remediation"
7. Practice weak areas

**Time:** ~90 minutes

---

### Workflow 3: Create Custom Content

1. Navigate to Items
2. Click "Create Item"
3. Select item type (MCQ, Calc, etc.)
4. Fill in details
5. Link to concepts
6. Save
7. Add to next session

**Time:** ~5 minutes per item

---

### Workflow 4: Track Progress

1. Navigate to Analytics
2. View "Performance" tab
3. Check accuracy trend
4. Review "Calibration" tab
5. Identify error patterns
6. Practice weak areas

**Time:** ~5 minutes

---

## Tips & Best Practices

### 🎯 Effective Learning

1. **Consistency over intensity:**
   - 15 min/day > 2 hours/week
   - Daily reviews maintain retention

2. **Trust the algorithm:**
   - FSRS schedules items optimally
   - Don't skip reviews

3. **Rate confidence honestly:**
   - Improves calibration
   - Helps identify overconfidence

4. **Review explanations:**
   - Even when correct
   - Reinforces understanding

---

### 📈 Mastery Building

1. **Focus on gaps:**
   - Red/orange concepts first
   - Use "Practice Weakest" action

2. **Mix item types:**
   - MCQ for recognition
   - Free recall for retrieval
   - Calc for application

3. **Use remediation plans:**
   - Follow recommended actions
   - Track progress to 80%

---

### 🔧 Content Creation

1. **Link to concepts:**
   - Every item should have ≥1 concept
   - Enables gap detection

2. **Write clear stems:**
   - Avoid ambiguity
   - Include all necessary info

3. **Add explanations:**
   - Explain why answer is correct
   - Reference sources

4. **Use tags:**
   - Organize by topic
   - Enable filtering

---

### 🛡️ Data Management

1. **Enable auto-backup:**
   - Settings → Privacy → Auto Backup
   - Daily backups recommended

2. **Export regularly:**
   - Settings → Privacy → Export Backup
   - Store in cloud/external drive

3. **Review storage:**
   - Settings → Privacy → Database Size
   - Clean up old sessions if needed

---

## Keyboard Shortcuts

### Global
- `⌘/Ctrl + K`: Command palette
- `Tab`: Navigate forward
- `Shift + Tab`: Navigate backward
- `Esc`: Close dialogs

### Session Player
- `1-5`: Select MCQ option
- `Enter`: Submit answer
- `F`: Flag item
- `G`: Open concept drawer
- `C`: Focus confidence slider

### Navigation
- `⌘/Ctrl + 1`: Home
- `⌘/Ctrl + 2`: Learn
- `⌘/Ctrl + 3`: Items
- `⌘/Ctrl + 4`: Concepts
- `⌘/Ctrl + 5`: Analytics

---

## Troubleshooting

### Items not appearing in sessions

**Cause:** Items not linked to concepts

**Solution:**
1. Navigate to Items
2. Edit item
3. Add concept links
4. Save

---

### Mastery scores not updating

**Cause:** Session not completed

**Solution:**
1. Complete all items in session
2. Click "Finish Session"
3. Check Concepts page

---

### Import failed

**Cause:** CSV format incorrect

**Solution:**
1. Download template CSV
2. Match column headers exactly
3. Ensure required fields present
4. Re-upload

---

### Can't find a feature

**Cause:** Not familiar with navigation

**Solution:**
1. Press `⌘/Ctrl + K`
2. Type feature name
3. Select from results

---

## Next Steps

### After First Week

1. ✅ Complete daily reviews
2. ✅ Run weekly diagnostics
3. ✅ Check analytics for trends
4. ✅ Adjust study plan based on gaps

### After First Month

1. ✅ Take practice exam
2. ✅ Review calibration
3. ✅ Identify persistent gaps
4. ✅ Create custom content for weak areas

### Ongoing

1. ✅ Maintain daily review habit
2. ✅ Import new content as needed
3. ✅ Track progress toward goals
4. ✅ Adjust FSRS parameters if needed

---

## Support & Resources

### Documentation
- `README.md`: Project overview
- `DESIGN_SPEC.md`: UI/UX specifications
- `COMPONENT_SPEC.md`: Component details
- `CRITICAL_FLOWS.md`: User flows
- `PHARMACY_FEATURES.md`: Pharmacy-specific features

### Community
- GitHub Issues: Bug reports and feature requests
- Discussions: Questions and tips
- Wiki: Extended documentation

### Contact
- Email: support@gapfinder.ai
- Discord: [Community Server]
- Twitter: @GapFinderAI

---

## FAQ

**Q: How often should I review?**
A: Daily is ideal. The FSRS algorithm schedules items based on your performance.

**Q: What's a good mastery score?**
A: 80%+ is considered strong. 70-79% is developing. Focus on <70% first.

**Q: Can I import from Anki?**
A: Yes! Import → Anki Deck tab. Note: Scheduling data won't transfer.

**Q: How is mastery calculated?**
A: Based on accuracy, confidence, and recency of attempts using FSRS.

**Q: Can I use this for non-pharmacy subjects?**
A: Absolutely! The core features work for any subject. Pharmacy features are optional.

**Q: Is my data private?**
A: Yes. All data is stored locally on your device. No cloud sync.

**Q: Can I export my data?**
A: Yes. Settings → Privacy → Export Backup. Exports to JSON.

**Q: What if I make a mistake on an item?**
A: Edit the item in Items page. Past attempts remain unchanged.

**Q: How do I reset my progress?**
A: Settings → Privacy → Reset Database. WARNING: This deletes all data.

**Q: Can I customize the mastery thresholds?**
A: Yes. Settings → Thresholds. Adjust gap/weak/strong cutoffs.

---

## Welcome!

You're now ready to start using GapFinder AI. Remember:

1. 🎯 **Start small:** Import a few LOs, run a diagnostic
2. 📅 **Be consistent:** Daily reviews are key
3. 📊 **Track progress:** Use analytics to guide study
4. 🧠 **Trust the process:** FSRS optimizes retention

Happy learning! 🚀
