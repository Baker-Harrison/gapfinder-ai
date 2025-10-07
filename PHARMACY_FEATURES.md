# Pharmacy-Specific Features

## Overview

GapFinder AI includes first-class support for pharmacy education with built-in taxonomies, calculation templates, and clinical case frameworks.

---

## Drug Class Taxonomies

### Structure

```typescript
interface DrugClass {
  id: string;
  name: string;
  exemplarDrugs: string[];
  moa: string; // Mechanism of action
  indications: string[];
  contraindications: string[];
  adverseEffects: string[];
  monitoring: string[];
  interactions: string[];
}
```

### Example: ACE Inhibitors

```json
{
  "id": "ace-inhibitors",
  "name": "ACE Inhibitors",
  "exemplarDrugs": [
    "Lisinopril",
    "Enalapril",
    "Ramipril",
    "Captopril"
  ],
  "moa": "Inhibit angiotensin-converting enzyme, reducing angiotensin II formation and aldosterone secretion",
  "indications": [
    "Hypertension",
    "Heart failure with reduced ejection fraction",
    "Post-MI",
    "Diabetic nephropathy"
  ],
  "contraindications": [
    "Pregnancy",
    "Bilateral renal artery stenosis",
    "History of angioedema",
    "Hyperkalemia"
  ],
  "adverseEffects": [
    "Dry cough (10-15%)",
    "Hyperkalemia",
    "Acute kidney injury",
    "Angioedema (rare)",
    "Hypotension"
  ],
  "monitoring": [
    "Blood pressure",
    "Serum creatinine and BUN",
    "Serum potassium",
    "Signs of angioedema"
  ],
  "interactions": [
    "NSAIDs: Reduced antihypertensive effect, increased AKI risk",
    "Potassium supplements/K-sparing diuretics: Hyperkalemia",
    "Lithium: Increased lithium levels",
    "Aliskiren: Contraindicated in diabetes"
  ]
}
```

### Built-In Drug Classes

**Cardiovascular:**
- ACE Inhibitors
- ARBs
- Beta Blockers
- Calcium Channel Blockers
- Diuretics (Loop, Thiazide, K-sparing)
- Statins
- Anticoagulants (Warfarin, DOACs)
- Antiplatelets

**Infectious Disease:**
- Penicillins
- Cephalosporins
- Macrolides
- Fluoroquinolones
- Aminoglycosides
- Carbapenems
- Antivirals (HIV, Influenza, Herpes)
- Antifungals

**Neurology:**
- Antiepileptics
- Antidepressants (SSRIs, SNRIs, TCAs)
- Antipsychotics (Typical, Atypical)
- Parkinson's agents
- Alzheimer's agents

**Endocrine:**
- Insulins
- Oral hypoglycemics
- Thyroid agents
- Corticosteroids

---

## Calculation Templates

### Template Structure

```typescript
interface CalcTemplate {
  id: string;
  name: string;
  formula: string;
  parameters: CalcParameter[];
  unit: string;
  workingSolution?: string;
  references?: string[];
}

interface CalcParameter {
  name: string;
  symbol: string;
  min: number;
  max: number;
  unit: string;
  description?: string;
}
```

### 1. Cockcroft-Gault Creatinine Clearance

**Formula:**
```
CrCl (mL/min) = [(140 - age) × weight × (0.85 if female)] / (72 × SCr)
```

**Parameters:**
- Age: 18-120 years
- Weight: 40-200 kg
- SCr: 0.5-15 mg/dL
- Sex: Male/Female

**Worked Solution Example:**
```
Patient: 65-year-old male, 80 kg, SCr 1.2 mg/dL

Step 1: CrCl = (140 - 65) × 80 / (72 × 1.2)
Step 2: CrCl = 75 × 80 / 86.4
Step 3: CrCl = 6000 / 86.4
Step 4: CrCl = 69.4 mL/min
```

**Unit Checking:**
- Age must be in years
- Weight must be in kg (convert from lbs if needed)
- SCr must be in mg/dL

---

### 2. Ideal Body Weight (IBW)

**Formula:**
```
Male: IBW (kg) = 50 + 2.3 × (height in inches - 60)
Female: IBW (kg) = 45.5 + 2.3 × (height in inches - 60)
```

**Parameters:**
- Height: 48-84 inches (or 122-213 cm)
- Sex: Male/Female

**Adjusted Body Weight (AdjBW):**
```
AdjBW = IBW + 0.4 × (actual weight - IBW)
```

---

### 3. E-Value (Isotonicity)

**Formula:**
```
E = (0.52 × MW × i) / 1000
```

**Parameters:**
- MW: Molecular weight (g/mol)
- i: Dissociation factor (1-3)

**Worked Solution Example:**
```
Calculate E-value for NaCl (MW = 58.5, i = 2)

Step 1: E = (0.52 × 58.5 × 2) / 1000
Step 2: E = 60.84 / 1000
Step 3: E = 0.0608 or 6.08%
```

**Common E-Values:**
- NaCl: 0.58
- Dextrose: 0.18
- KCl: 0.76
- Boric acid: 0.52

---

### 4. Henderson-Hasselbalch Equation

**Formula:**
```
pH = pKa + log([A⁻] / [HA])
```

**Parameters:**
- pKa: 2-12
- [A⁻]: Conjugate base concentration
- [HA]: Weak acid concentration

**Applications:**
- Buffer preparation
- pH calculation
- Ionization state

---

### 5. Pharmacokinetic Parameters

**Half-Life:**
```
t½ = 0.693 / k
```

**Clearance:**
```
Cl = k × Vd
```

**Volume of Distribution:**
```
Vd = Dose / C₀
```

**Loading Dose:**
```
LD = Vd × Css
```

**Maintenance Dose:**
```
MD = Cl × Css × τ
```

**Parameters:**
- k: Elimination rate constant (h⁻¹)
- Vd: Volume of distribution (L)
- Cl: Clearance (L/h)
- Css: Steady-state concentration (mg/L)
- τ: Dosing interval (h)

---

### 6. Infusion Rate Calculations

**IV Drip Rate:**
```
Rate (gtt/min) = (Volume in mL × Drop factor) / (Time in min)
```

**Parameters:**
- Volume: 50-1000 mL
- Drop factor: 10, 15, 20, 60 gtt/mL
- Time: 15-1440 minutes

**Infusion Rate (mg/min):**
```
Rate = (Dose in mg × Weight in kg) / (Concentration in mg/mL × 60)
```

---

### 7. Electrolyte Conversions

**mEq Calculation:**
```
mEq = (mg × valence) / molecular weight
```

**mOsm Calculation:**
```
mOsm = (mg × number of particles) / molecular weight
```

**Common Conversions:**
- NaCl: 1 g = 17.1 mEq Na⁺ = 17.1 mEq Cl⁻
- KCl: 1 g = 13.4 mEq K⁺ = 13.4 mEq Cl⁻
- CaCl₂: 1 g = 13.6 mEq Ca²⁺

---

## Clinical Case Templates

### Case Structure

```typescript
interface ClinicalCase {
  id: string;
  vignette: string;
  patientInfo: PatientInfo;
  steps: CaseStep[];
  rubric: ScoringRubric;
}

interface CaseStep {
  question: string;
  type: 'mcq' | 'short-answer' | 'calculation';
  correctAnswer: string | string[];
  partialCredit?: PartialCreditRule[];
  points: number;
}
```

### Example: Heart Failure Case

**Vignette:**
```
JM is a 68-year-old male presenting to the ED with worsening dyspnea, 
orthopnea, and bilateral lower extremity edema over the past week.

PMH: HFrEF (EF 30%), HTN, T2DM, CKD Stage 3
Medications: Metoprolol 50 mg BID, Lisinopril 20 mg daily, Metformin 1000 mg BID

Vitals: BP 150/95, HR 88, RR 22, O2 sat 88% on RA
Labs: Na 138, K 4.2, Cl 102, CO2 24, BUN 32, SCr 1.8, Glucose 145
BNP 1250 pg/mL
```

**Step 1: Assessment (MCQ)**
```
Question: What is the most likely cause of JM's current presentation?
A. Acute decompensated heart failure
B. Pneumonia
C. Pulmonary embolism
D. COPD exacerbation

Correct: A
Points: 2
```

**Step 2: Treatment Plan (Short Answer)**
```
Question: List 3 immediate interventions for JM.

Correct Answers:
- IV loop diuretic (furosemide)
- Oxygen therapy
- Fluid restriction
- Elevate head of bed
- Consider IV vasodilator if BP permits

Partial Credit:
- 3 correct = 3 points
- 2 correct = 2 points
- 1 correct = 1 point

Points: 3
```

**Step 3: Medication Adjustment (Calculation)**
```
Question: Calculate the appropriate furosemide dose for JM given his 
CrCl of 45 mL/min. Use the formula: Dose = 40 mg × (CrCl / 100)

Correct: 18-20 mg IV (accept range)
Points: 2
```

**Step 4: Monitoring (MCQ)**
```
Question: Which parameter is MOST important to monitor after starting 
IV furosemide?
A. Blood pressure
B. Serum potassium
C. Urine output
D. All of the above

Correct: D
Points: 1
```

**Total Points: 8**

---

## Medication Error Prevention

### Built-In Safety Checks

**1. Dose Range Checking:**
- Warn if dose exceeds typical range
- Flag pediatric vs adult dosing
- Check renal/hepatic adjustments

**2. Drug-Drug Interactions:**
- Major interactions flagged
- Mechanism explained
- Alternative suggested

**3. Allergy Checking:**
- Cross-sensitivity warnings
- Alternative drug classes

**4. Duplicate Therapy:**
- Same drug class
- Same mechanism

**5. Pregnancy/Lactation:**
- Category warnings
- Safer alternatives

---

## NAPLEX-Style Questions

### Question Types

**1. Patient Case with Multiple Questions:**
- Vignette with patient info
- 3-5 related questions
- Progressive difficulty

**2. Calculation Questions:**
- Dosing calculations
- Kinetic parameters
- Compounding
- Nutrition support

**3. Drug Information:**
- MOA, indications, ADEs
- Counseling points
- Storage requirements

**4. Clinical Judgment:**
- Best therapy selection
- Monitoring parameters
- Patient education

---

## Study Aids

### Drug Comparison Tables

Auto-generate comparison tables:

**Example: Beta Blockers**
| Drug | Selectivity | ISA | MSA | Indications |
|------|-------------|-----|-----|-------------|
| Metoprolol | β1 | No | No | HTN, HF, MI |
| Atenolol | β1 | No | No | HTN, angina |
| Carvedilol | Non-selective | No | Yes | HF, HTN |
| Propranolol | Non-selective | No | Yes | HTN, migraine |

### Mnemonic Generators

**Example: Warfarin Interactions (SICKFACES.COM)**
- **S**ulfonamides
- **I**soniazid
- **C**imetidine
- **K**etoconazole
- **F**luconazole
- **A**miodarone
- **C**iprofloxacin
- **E**rythromycin
- **S**ulfinpyrazone
- **C**hloramphenicol
- **O**meprazole
- **M**etronidazole

---

## Integration with FSRS

### Pharmacy-Specific Scheduling

**High-Stakes Items:**
- Calculations: Shorter intervals (higher retention target)
- Safety/Toxicity: More frequent review
- Common drugs: Standard intervals

**Low-Stakes Items:**
- Rare drugs: Longer intervals
- Historical info: Lower retention target

**Adaptive Difficulty:**
- Increase complexity as mastery improves
- Multi-step calculations for advanced learners
- Case-based integration

---

## Content Templates

### Quick-Add Templates

**1. Drug Card:**
- Generic/Brand name
- Class
- MOA
- Indications (top 3)
- Key ADEs
- Monitoring
- Counseling points

**2. Disease State:**
- Pathophysiology
- Symptoms
- First-line therapy
- Alternative therapies
- Monitoring

**3. Calculation:**
- Formula
- When to use
- Common pitfalls
- Example problem

---

## Regulatory & Law Content

### Topics Covered

**1. Controlled Substances:**
- DEA schedules
- Prescription requirements
- Record keeping
- Disposal

**2. HIPAA:**
- Privacy rules
- Breach notification
- Patient rights

**3. Liability:**
- Standard of care
- Medication errors
- Documentation

**4. State-Specific:**
- Scope of practice
- Collaborative practice
- Immunization authority

---

## Assessment Blueprints

### NAPLEX Coverage

**Area 1: Patient Assessment (25%)**
- Labs interpretation
- Vital signs
- Physical assessment
- Drug therapy problems

**Area 2: Drug Therapy (50%)**
- Selection
- Dosing
- Monitoring
- Patient education

**Area 3: Health & Wellness (25%)**
- Prevention
- Immunizations
- Self-care
- Public health

---

## Future Enhancements

**1. Drug Database Integration:**
- Real-time drug information
- FDA updates
- Shortage alerts

**2. Clinical Guidelines:**
- AHA/ACC guidelines
- IDSA guidelines
- ADA standards

**3. Formulary Management:**
- Tier preferences
- Prior authorization
- Therapeutic substitution

**4. Compounding Calculator:**
- Recipe scaling
- Beyond-use dating
- Stability data

**5. Immunization Scheduler:**
- CDC schedules
- Contraindications
- Documentation
