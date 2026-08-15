# DermAware Scripts

Utility scripts for training, evaluation, and analysis.

## `generate_evaluation_metrics.py`

Evaluates all three models on their respective test sets and generates:
- Overall metrics (accuracy, macro F1-score, balanced accuracy, macro ROC-AUC)
- Per-class metrics (precision, recall, F1-score)
- Confusion matrices (raw counts and normalized %)
- Per-class performance bar charts
- Fairness analysis by Fitzpatrick skin tone group (if available)

### Usage

```bash
python generate_evaluation_metrics.py
```

### Requirements

- TensorFlow/Keras (for loading models)
- scikit-learn (for metrics computation)
- pandas (for data handling)
- matplotlib/seaborn (for visualization)
- numpy

### Output

Generates `evaluation_results/` directory with:
- `{model_name}_metrics.csv` — Overall metrics
- `{model_name}_per_class.csv` — Per-class metrics
- `{model_name}_confusion.png` — Confusion matrix chart
- `{model_name}_per_class.png` — Per-class metrics bar chart
- `{model_name}_fairness.csv` — Fairness metrics by skin tone (if applicable)

### Current Status

Script has template structure with detailed comments. To run fully:

1. **HAM10000 Test Data**: Load HAM10000 test images and labels
   - Images: Load from HAM10000_images_part_X/ directories
   - Metadata: Load from HAM10000_metadata.csv
   - Split: Use same StratifiedGroupKFold split as training (by lesion_id)

2. **DDI Test Data**: Load DDI test images and labels
   - Images: Load from DDI dataset directory
   - Labels: Parse from DDI metadata
   - Fitzpatrick groups: Extract if available (for fairness analysis)

3. **Uncomment evaluation calls**: Uncomment the `evaluate_model()` and `evaluate_fairness_by_skin_tone()` function calls

4. **Run**: Execute script and check `evaluation_results/` for generated files

### Key Design Decisions

- **Stratified splits**: Test sets are stratified by class and grouped by patient/lesion ID to prevent leakage
- **Macro averaging**: F1-score and other metrics averaged across classes (not weighted by prevalence) to treat all lesion types equally
- **Multiple confusions matrices**: Both raw counts (for class size context) and normalized (for performance comparison)
- **Fairness as priority**: Fitzpatrick group stratification is emphasized for skin tone analysis
