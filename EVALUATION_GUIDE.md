# DermAware Evaluation Guide

## Overview

This guide explains how to complete the evaluation section of the DermAware project for your rubric. The evaluation framework is now in place with:

1. **Labeled visual assets** (8 figures with captions)
2. **Web app Evaluation page** displaying all metrics and visuals
3. **Technical depth documentation** (architectures, splits, hyperparameters)
4. **Metrics templates** with clear [TODO] placeholders
5. **Reproducible evaluation script** ready to run

---

## Quick Start: What's Been Done

### ✅ STEP 1: Exploration Complete
- Mapped all three model definitions and architectures
- Located training code in notebooks
- Found evaluation code structure (confusion matrices, per-class metrics)
- Identified 8 visual assets in `/visuals/` folder

### ✅ STEP 2: Visuals Labeled & Referenced
All figures now have:
- Descriptive captions
- Alt text for accessibility
- Contextual interpretation
- Embedded in Evaluation web page

**Figures labeled:**
1. HAM10000 class distribution (histogram)
2. EfficientNet-B0 confusion matrix
3. HAM10000 CNN confusion matrix
4. DDI CNN confusion matrix
5. Model comparison (accuracy/F1/balanced accuracy)
6. Per-class metrics example
7. Training loss curves
8. Example test image

### ✅ STEP 3: Technical Depth Added
README now includes for each model:
- **Architecture**: CNN type, transfer learning strategy
- **Input shape**: 224×224 RGB
- **Dataset used**: HAM10000 (10,015 images) or DDI (656 + augmentation)
- **Data split**: Stratified by diagnosis, grouped by lesion_id (prevents leakage)
- **Augmentation**: Rotation, flip, brightness/contrast
- **Training epochs**: 15 head + 15 fine-tune (EfficientNet); [TODO] for custom CNNs
- **Why chosen**: Rationale for each model selection

### ✅ STEP 4: Evaluation & Results Section
README includes:
- Test set metrics tables with [TODO] placeholders
- Per-class performance table scaffold
- Per-class precision/recall/F1-score rows
- Interpretation template for results
- Data split methodology documented

### ✅ STEP 5: Fairness & Skin-Tone Analysis
- **High-priority**: Fitzpatrick stratification setup
- Template for light (FST I–III) vs. dark (FST IV–VI) comparison
- Accuracy gap measurement structure
- Fairness interpretation guidelines

### ✅ BONUS: Performance Visuals in Web App
New `/evaluation` page in DermAware web app featuring:
- All 8 labeled figures with captions
- Metrics tables (currently with [TODO] placeholders)
- Model architecture descriptions
- Fairness analysis section
- Interpretation guidance for each model

---

## How to Fill In the [TODO] Metrics

### Step 1: Run the Training Notebooks

The metrics are computed in your Jupyter notebooks but not persisted. To extract them:

1. Open the training notebook:
   ```
   notebook/Skin_Lesion_Classifier.ipynb
   ```

2. Run the notebook end-to-end (or from the evaluation cells onward)

3. Look for outputs showing:
   - `test_accuracy` (Cell 23)
   - `macro_f1` (Cell 23)
   - `balanced_accuracy` (Cell 23)
   - `macro_roc_auc` (Cell 23)
   - Per-class metrics table (Cell 24)
   - Confusion matrix values (Cell 24)

4. Note the numeric values

### Step 2: Fill in README.md

Edit `/Users/williamacosta/Desktop/AI4ALL_17A/README.md`:

Find the "Test Set Performance" section (~line 70) and replace [TODO] with actual values:

```markdown
**EfficientNet-B0 (HAM10000 test set):**
- Test Accuracy: 0.7234  # Replace [TODO] with actual number
- Macro F1-Score: 0.6891
- Balanced Accuracy: 0.6745
- Macro ROC-AUC: 0.8523

**HAM10000 CNN (HAM10000 test set):**
- Test Accuracy: 0.6892
- Macro F1-Score: 0.6234
- Balanced Accuracy: 0.6112
- Macro ROC-AUC: 0.8102

**DDI CNN (DDI test set):**
- Test Accuracy: 0.5678
- Macro F1-Score: 0.5234
- Balanced Accuracy: 0.5012
```

### Step 3: Fill in Evaluation Web Page

Edit `/Users/williamacosta/Desktop/AI4ALL_17A/frontend/src/pages/Evaluation.jsx`:

1. Search for `[TODO: fill from training]` (appears ~15 times)
2. Replace with actual numeric values from your notebook outputs
3. For per-class tables, fill in precision/recall/F1 for each of the 7 HAM10000 classes
4. For interpretation sections, add 2-4 sentences explaining results

Example:
```jsx
// Change this:
<td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>

// To this:
<td style={{ textAlign: 'right', padding: '0.5rem' }}>0.7234</td>
```

### Step 4: (Optional but Recommended) Run the Evaluation Script

The script `scripts/generate_evaluation_metrics.py` is ready to run if you have test data available:

```bash
python scripts/generate_evaluation_metrics.py
```

This generates:
- CSV files with all metrics
- PNG figures for confusion matrices and per-class performance
- Fairness analysis (if Fitzpatrick labels available)

If you run this, the outputs confirm your manual entries.

---

## Fairness & Skin-Tone Analysis (HIGHEST PRIORITY)

This is what will differentiate your project on the rubric.

### What You Need:
1. **Fitzpatrick labels** from DDI metadata (if available)
2. **Stratified evaluation** code (template already in script)

### What to Report:
```
Model: EfficientNet-B0
- Accuracy on Light skin (FST I-III): 75.2%
- Accuracy on Dark skin (FST IV-VI): 68.9%
- Accuracy Gap: 6.3%

Model: DDI CNN  
- Accuracy on Light skin (FST I-III): 62.1%
- Accuracy on Dark skin (FST IV-VI): 64.3%
- Accuracy Gap: -2.2% (✓ no disparity!)
```

### How to Compute:
1. Load your test data with Fitzpatrick labels
2. Separate test set into light and dark skin tone groups
3. Evaluate model on each group separately
4. Report accuracy, F1-score, per-class metrics for each group
5. Compute gap: |accuracy_light - accuracy_dark|

See `scripts/generate_evaluation_metrics.py` lines ~200-250 for template code.

---

## Rubric Alignment Checklist

- [ ] **Analytical Visuals (Labeled)**
  - [x] 8 figures copied to web app
  - [x] Each has descriptive caption
  - [x] Alt text added
  - [ ] **TODO**: Verify visuals render in browser

- [ ] **Technical Depth**
  - [x] Architecture documented (CNN vs. EfficientNet)
  - [x] Input shapes specified (224×224)
  - [x] Dataset details (size, source)
  - [x] Data splits explained (stratified, lesion-grouped)
  - [x] Augmentation strategy noted
  - [ ] **TODO**: Fill in epoch counts and hyperparameters for custom CNNs

- [ ] **Model Selection + EVALUATION with Metrics**
  - [x] Why each model was chosen (documented)
  - [ ] **TODO**: Test set accuracy (fill from notebook output)
  - [ ] **TODO**: Macro F1-score (fill from notebook output)
  - [ ] **TODO**: Balanced accuracy (fill from notebook output)
  - [ ] **TODO**: Per-class precision/recall/F1
  - [ ] **TODO**: Confusion matrices (visuals already included)

- [ ] **Data + RESULTS with Interpretation**
  - [x] Data sizes documented (10,015 for HAM10000; 656 for DDI)
  - [x] Class imbalance noted (MEL 10%, NV 50%)
  - [x] Split methodology explained
  - [ ] **TODO**: Fill in interpretation (what models do well/poorly)
  - [ ] **TODO**: Fairness analysis by skin tone (if Fitzpatrick available)

---

## File Structure

```
AI4ALL_17A/
├── frontend/src/pages/
│   ├── Evaluation.jsx           ← NEW: Web page with all metrics & visuals
│   ├── Page.css                 ← Styling
│   └── [About.jsx, Sources.jsx]
├── frontend/src/components/
│   └── Navigation.jsx           ← UPDATED: Added "Evaluation" link
├── frontend/public/
│   ├── ham1000distribution.png  ← All 8 visuals copied here
│   ├── ham10000cnn.png
│   ├── hamconfusion.png
│   ├── ddicnn.png
│   ├── ddiconfusion.png
│   ├── allmodels.png
│   ├── ham100annperformance.png
│   └── melanoma.png
├── scripts/
│   ├── generate_evaluation_metrics.py  ← NEW: Evaluation script
│   └── README.md                       ← Documentation
├── README.md                    ← UPDATED: Technical depth + metrics tables
├── EVALUATION_GUIDE.md          ← This file
└── notebook/
    ├── Skin_Lesion_Classifier.ipynb   ← Evaluation code (Cells 23-26)
    └── [other notebooks]
```

---

## How to Test Locally

1. **Start backend & frontend** (as usual):
   ```bash
   # Terminal 1: Backend
   cd backend
   python main.py
   
   # Terminal 2: Frontend
   cd frontend
   npm start
   ```

2. **Navigate to Evaluation page**: http://localhost:3000/evaluation

3. **Verify visuals load**: Should see 8 PNG images rendering

4. **Check metrics tables**: Should see [TODO] placeholders ready for your data

5. **Test metrics filling**: Replace one [TODO] value, refresh page, confirm it appears

---

## Next Steps (in order)

1. **Extract metrics from notebooks** (5 min)
   - Run training cells, note accuracy/F1/balanced_acc values

2. **Fill README metrics** (10 min)
   - Edit README.md, replace [TODO] with numbers
   - Commit: `git add README.md && git commit -m "Add evaluation metrics"`

3. **Fill Evaluation page metrics** (15 min)
   - Edit Evaluation.jsx, replace ~15 [TODO] placeholders
   - Test in browser: npm start
   - Commit: `git add frontend/src/pages/Evaluation.jsx && git commit -m "Fill evaluation metrics in web app"`

4. **Add interpretation text** (20 min)
   - For each model, write 2-4 sentences in interpretation sections
   - Explain what model does well, where it struggles, why

5. **Fairness analysis (HIGHEST PRIORITY)** (30-60 min)
   - Check if Fitzpatrick labels available in DDI metadata
   - If yes: compute accuracy by skin tone group, fill fairness table
   - If no: document limitation in Evaluation page
   - Commit: `git add frontend/src/pages/Evaluation.jsx && git commit -m "Add fairness analysis by skin tone"`

---

## Common Issues & Fixes

**Q: Visuals don't show in browser**
- A: Check frontend/public/ has PNG files. Refresh browser (Cmd+Shift+R). Check browser console for 404 errors.

**Q: [TODO] placeholders still appear**
- A: Make sure you edited the right file (Evaluation.jsx, not a copy). Clear React cache: rm -rf node_modules/.cache/

**Q: Can't find metric values in notebook**
- A: Look at Cell 23 (overall metrics) and Cell 24 (per-class metrics) outputs. If outputs are empty, re-run those cells.

**Q: How do I know if fairness analysis is required?**
- A: Check your rubric. If it mentions "fairness" or "bias," do the skin-tone stratification. It's a strong differentiator.

---

## Questions?

Refer to:
- `README.md` — Technical documentation
- `scripts/README.md` — Evaluation script details
- `frontend/src/pages/Evaluation.jsx` — Web page structure with [TODO] markers
- Notebooks — Original evaluation code and outputs

---

**Status**: 🟢 Framework complete. Ready for metrics to be filled in from training results.

**Estimated time to completion**: 1-2 hours (depending on Fitzpatrick label availability)

**Rubric impact**: Strong — comprehensive evaluation with technical depth, labeled visuals, and fairness analysis
