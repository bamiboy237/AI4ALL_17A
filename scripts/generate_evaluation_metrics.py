#!/usr/bin/env python3
"""
Generate evaluation metrics for all three DermAware models.

Usage:
  python generate_evaluation_metrics.py

Requirements:
  - HAM10000 dataset with images and metadata
  - DDI dataset with images and metadata
  - Trained models in project root
  - sklearn, tensorflow, pandas, numpy, matplotlib

This script:
  1. Loads test data for each dataset
  2. Evaluates each model on its test set
  3. Computes: accuracy, macro-F1, balanced accuracy, macro ROC-AUC
  4. Generates confusion matrices
  5. Per-class precision/recall/F1
  6. Saves metrics to CSV and PNG figures
  7. (If DDI metadata available) Stratifies by Fitzpatrick group
"""

import os
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

import tensorflow as tf
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    f1_score,
    balanced_accuracy_score,
    precision_recall_fscore_support,
    roc_auc_score,
)
from sklearn.preprocessing import label_binarize

# Configuration
HAM10000_CLASSES = [
    "akiec",  # Actinic keratosis / Bowen's disease
    "bcc",    # Basal cell carcinoma
    "bkl",    # Benign keratosis-like lesion
    "df",     # Dermatofibroma
    "mel",    # Melanoma
    "nv",     # Melanocytic nevus
    "vasc",   # Vascular lesion
]

DDI_CLASSES = [
    "Acne",
    "Alopecia",
    "Angioma",
    "Atopic Dermatitis",
    "Benign Keratosis",
    "Bullous Pemphigoid",
    "Cafe-au-Lait Spot",
    "Candida",
    "Corn",
    "Flat Wart",
    "Folliculitis",
    "Hemangioma",
    "Lichen Planus",
    "Melanoma",
    "Seborrheic Keratosis",
    "Other or miscellaneous",
]

OUTPUT_DIR = Path("evaluation_results")
OUTPUT_DIR.mkdir(exist_ok=True)


def evaluate_model(
    model_name: str,
    model_path: str,
    test_images: np.ndarray,
    test_labels: np.ndarray,
    class_names: list,
    image_size: int = 224,
) -> dict:
    """Evaluate a single model on test data."""
    print(f"\n{'='*60}")
    print(f"Evaluating: {model_name}")
    print(f"{'='*60}")

    # Load model
    model = tf.keras.models.load_model(model_path)
    print(f"✓ Loaded model: {model_path}")

    # Predict
    print("Computing predictions...")
    predictions = model.predict(test_images, verbose=0)
    y_pred = predictions.argmax(axis=1)

    # Overall metrics
    accuracy = accuracy_score(test_labels, y_pred)
    macro_f1 = f1_score(test_labels, y_pred, average="macro", zero_division=0)
    balanced_acc = balanced_accuracy_score(test_labels, y_pred)

    # Per-class metrics
    precision, recall, f1, support = precision_recall_fscore_support(
        test_labels, y_pred, average=None, zero_division=0
    )

    # ROC-AUC (multi-class)
    try:
        y_test_one_hot = label_binarize(test_labels, classes=np.arange(len(class_names)))
        macro_roc_auc = roc_auc_score(
            y_test_one_hot, predictions, average="macro", multi_class="ovr"
        )
    except Exception as e:
        print(f"  Warning: Could not compute ROC-AUC: {e}")
        macro_roc_auc = None

    # Confusion matrix
    conf_matrix = confusion_matrix(test_labels, y_pred)

    # Prepare results
    results = {
        "model": model_name,
        "accuracy": accuracy,
        "macro_f1": macro_f1,
        "balanced_accuracy": balanced_acc,
        "macro_roc_auc": macro_roc_auc,
        "per_class_metrics": {
            "class": class_names,
            "precision": precision.tolist(),
            "recall": recall.tolist(),
            "f1": f1.tolist(),
            "support": support.tolist(),
        },
        "confusion_matrix": conf_matrix.tolist(),
        "num_test_samples": len(test_labels),
    }

    # Print summary
    print(f"\nTest Accuracy: {accuracy:.4f}")
    print(f"Macro F1: {macro_f1:.4f}")
    print(f"Balanced Accuracy: {balanced_acc:.4f}")
    if macro_roc_auc:
        print(f"Macro ROC-AUC: {macro_roc_auc:.4f}")
    print(f"Test set size: {len(test_labels)}")

    # Save metrics table
    metrics_df = pd.DataFrame({
        "metric": ["Test Accuracy", "Macro F1", "Balanced Accuracy", "Macro ROC-AUC"],
        "value": [accuracy, macro_f1, balanced_acc, macro_roc_auc or np.nan],
    })
    metrics_csv = OUTPUT_DIR / f"{model_name.lower().replace(' ', '_')}_metrics.csv"
    metrics_df.to_csv(metrics_csv, index=False)
    print(f"✓ Saved metrics: {metrics_csv}")

    # Save per-class metrics
    per_class_df = pd.DataFrame(results["per_class_metrics"])
    per_class_csv = OUTPUT_DIR / f"{model_name.lower().replace(' ', '_')}_per_class.csv"
    per_class_df.to_csv(per_class_csv, index=False)
    print(f"✓ Saved per-class metrics: {per_class_csv}")

    # Plot confusion matrix
    fig, axes = plt.subplots(1, 2, figsize=(16, 7))

    # Raw counts
    sns.heatmap(
        conf_matrix,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
        ax=axes[0],
        cbar_kws={"label": "Count"},
    )
    axes[0].set_title(f"{model_name}: Confusion Matrix (Test Set)", fontsize=14, fontweight="bold")
    axes[0].set_xlabel("Predicted Label")
    axes[0].set_ylabel("True Label")

    # Normalized
    conf_normalized = conf_matrix.astype("float") / conf_matrix.sum(axis=1, keepdims=True)
    sns.heatmap(
        conf_normalized,
        annot=True,
        fmt=".2f",
        cmap="Blues",
        xticklabels=class_names,
        yticklabels=class_names,
        ax=axes[1],
        cbar_kws={"label": "Proportion"},
    )
    axes[1].set_title(f"{model_name}: Normalized Confusion Matrix", fontsize=14, fontweight="bold")
    axes[1].set_xlabel("Predicted Label")
    axes[1].set_ylabel("True Label")

    plt.tight_layout()
    confusion_png = OUTPUT_DIR / f"{model_name.lower().replace(' ', '_')}_confusion.png"
    plt.savefig(confusion_png, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✓ Saved confusion matrix: {confusion_png}")

    # Plot per-class metrics
    fig, ax = plt.subplots(figsize=(12, 6))
    x = np.arange(len(class_names))
    width = 0.25

    ax.bar(x - width, precision, width, label="Precision", alpha=0.8)
    ax.bar(x, recall, width, label="Recall", alpha=0.8)
    ax.bar(x + width, f1, width, label="F1-Score", alpha=0.8)

    ax.set_xlabel("Class", fontsize=12)
    ax.set_ylabel("Score", fontsize=12)
    ax.set_title(f"{model_name}: Per-Class Metrics (Test Set)", fontsize=14, fontweight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels(class_names, rotation=45, ha="right")
    ax.legend()
    ax.set_ylim([0, 1])
    ax.grid(axis="y", alpha=0.3)

    plt.tight_layout()
    per_class_png = OUTPUT_DIR / f"{model_name.lower().replace(' ', '_')}_per_class.png"
    plt.savefig(per_class_png, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✓ Saved per-class chart: {per_class_png}")

    # Print classification report
    print("\nClassification Report:")
    print(classification_report(test_labels, y_pred, target_names=class_names, digits=4))

    return results


def evaluate_fairness_by_skin_tone(
    model_name: str,
    model_path: str,
    test_images: np.ndarray,
    test_labels: np.ndarray,
    fitzpatrick_groups: np.ndarray,
    class_names: list,
) -> dict:
    """
    Evaluate model performance stratified by Fitzpatrick skin tone group.

    fitzpatrick_groups: Array where values are 1-6 representing FST I-VI groups
    """
    print(f"\n{'='*60}")
    print(f"Fairness Evaluation: {model_name} by Skin Tone (Fitzpatrick)")
    print(f"{'='*60}")

    model = tf.keras.models.load_model(model_path)
    predictions = model.predict(test_images, verbose=0)
    y_pred = predictions.argmax(axis=1)

    # Group by light vs. dark skin tones
    # FST I-III = Light, FST IV-VI = Dark
    light_mask = fitzpatrick_groups <= 3
    dark_mask = fitzpatrick_groups >= 4

    results = {}

    for group_name, mask in [("Light (FST I-III)", light_mask), ("Dark (FST IV-VI)", dark_mask)]:
        if mask.sum() == 0:
            print(f"  ⚠ No samples in {group_name}")
            continue

        group_labels = test_labels[mask]
        group_preds = y_pred[mask]

        accuracy = accuracy_score(group_labels, group_preds)
        macro_f1 = f1_score(group_labels, group_preds, average="macro", zero_division=0)

        results[group_name] = {
            "accuracy": accuracy,
            "macro_f1": macro_f1,
            "num_samples": mask.sum(),
        }

        print(f"\n{group_name}:")
        print(f"  Samples: {mask.sum()}")
        print(f"  Accuracy: {accuracy:.4f}")
        print(f"  Macro F1: {macro_f1:.4f}")

    # Compare
    if len(results) == 2:
        light_acc = results["Light (FST I-III)"]["accuracy"]
        dark_acc = results["Dark (FST IV-VI)"]["accuracy"]
        gap = abs(light_acc - dark_acc)
        print(f"\n  Accuracy Gap: {gap:.4f} ({light_acc:.4f} vs {dark_acc:.4f})")

    return results


# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    print("DermAware Evaluation Metrics Generator")
    print("=====================================\n")

    all_results = {}

    # -----------------------------------------------------------------------
    # HAM10000 CNN
    # -----------------------------------------------------------------------
    ham10000_model_path = "ham10000_cnn_improved.keras"
    if Path(ham10000_model_path).exists():
        print(f"\n[TODO] Load HAM10000 test data...")
        print("Steps:")
        print("  1. Load metadata from HAM10000_metadata.csv")
        print("  2. Split by lesion_id using StratifiedGroupKFold")
        print("  3. Load test images (224x224)")
        print("  4. Apply same preprocessing as training")
        # all_results["ham10000_cnn"] = evaluate_model(
        #     "HAM10000 CNN",
        #     ham10000_model_path,
        #     test_images,
        #     test_labels,
        #     HAM10000_CLASSES,
        # )
    else:
        print(f"⚠ Model not found: {ham10000_model_path}")

    # -----------------------------------------------------------------------
    # EfficientNet-B0
    # -----------------------------------------------------------------------
    effnet_model_path = "ham10000_efficientnet_b0.keras"
    if Path(effnet_model_path).exists():
        print(f"\n[TODO] Load HAM10000 test data for EfficientNet...")
        print("Same as HAM10000 CNN (same dataset, different architecture)")
        # all_results["efficientnet_b0"] = evaluate_model(
        #     "EfficientNet-B0",
        #     effnet_model_path,
        #     test_images,
        #     test_labels,
        #     HAM10000_CLASSES,
        # )
    else:
        print(f"⚠ Model not found: {effnet_model_path}")

    # -----------------------------------------------------------------------
    # DDI CNN
    # -----------------------------------------------------------------------
    ddi_model_path = "ddi_cnn_improved.keras"
    if Path(ddi_model_path).exists():
        print(f"\n[TODO] Load DDI test data...")
        print("Steps:")
        print("  1. Load DDI dataset")
        print("  2. Extract/verify Fitzpatrick group labels (if available)")
        print("  3. Create test split (stratified by label & Fitzpatrick)")
        print("  4. Load test images (224x224)")
        # all_results["ddi_cnn"] = evaluate_model(
        #     "DDI CNN",
        #     ddi_model_path,
        #     test_images,
        #     test_labels,
        #     DDI_CLASSES,
        # )

        # Fairness evaluation (if Fitzpatrick groups available)
        # all_results["ddi_fairness"] = evaluate_fairness_by_skin_tone(
        #     "DDI CNN",
        #     ddi_model_path,
        #     test_images,
        #     test_labels,
        #     fitzpatrick_groups,
        #     DDI_CLASSES,
        # )
    else:
        print(f"⚠ Model not found: {ddi_model_path}")

    # -----------------------------------------------------------------------
    # Summary
    # -----------------------------------------------------------------------
    print(f"\n\n{'='*60}")
    print("Summary")
    print(f"{'='*60}")
    print(f"Output directory: {OUTPUT_DIR}")
    print("\nTo run this script fully:")
    print("  1. Uncomment the evaluate_model() and evaluate_fairness_by_skin_tone() calls")
    print("  2. Provide test data loading for each dataset")
    print("  3. Run: python scripts/generate_evaluation_metrics.py")
    print("\nGenerated files will include:")
    print("  - Model metrics CSV files")
    print("  - Per-class metrics CSV files")
    print("  - Confusion matrix PNG charts")
    print("  - Per-class performance bar charts")
    print("  - Fairness analysis (if Fitzpatrick groups available)")
