import React from 'react';
import './Page.css';

function Evaluation() {
  return (
    <div className="page">
      <div className="page-container">
        <header className="page-header">
          <h1>Model Evaluation & Results</h1>
          <p className="page-subtitle">Performance metrics and fairness analysis</p>
        </header>

        <div className="page-content">
          {/* ============================================================== */}
          {/* HAM10000 DATASET OVERVIEW */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>HAM10000 Dataset Overview</h2>

            <div className="subsection">
              <h3>Figure 1: Class Distribution</h3>
              <img
                src="/ham1000distribution.png"
                alt="Figure 1. HAM10000 dataset class distribution showing 7 lesion categories. MEL (melanoma) represents approximately 10% of samples, while NV (melanocytic nevus) is the largest class at ~50%."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
              <p>
                The HAM10000 dataset contains 10,015 dermatoscopic images across 7 lesion categories.
                Classes are imbalanced, with melanocytic nevus (NV) comprising ~50% of the dataset
                and melanoma (MEL) only ~10%. The distribution reflects real-world prevalence patterns.
              </p>
            </div>
          </section>

          {/* ============================================================== */}
          {/* EFFICIENTNET-B0 RESULTS */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>EfficientNet-B0 (HAM10000)</h2>

            <div className="subsection">
              <h3>Architecture & Training</h3>
              <ul>
                <li><strong>Base Model</strong>: EfficientNet-B0 (ImageNet pretrained)</li>
                <li><strong>Input Shape</strong>: 224×224 RGB images</li>
                <li><strong>Output Classes</strong>: 7 lesion categories</li>
                <li><strong>Training Procedure</strong>: Two-stage fine-tuning
                  <ul>
                    <li>Stage 1: Freeze base layers, train classification head (15 epochs)</li>
                    <li>Stage 2: Fine-tune top 30 base layers (15 epochs)</li>
                  </ul>
                </li>
                <li><strong>Optimizer</strong>: Adam with learning rate decay</li>
                <li><strong>Batch Size</strong>: 16</li>
                <li><strong>Data Split</strong>: Stratified by diagnosis, grouped by lesion_id
                  (ensures no patient/lesion leakage across train/val/test)</li>
                <li><strong>Augmentation</strong>: Random horizontal flip, rotation, brightness, contrast</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Figure 2: EfficientNet-B0 Confusion Matrix</h3>
              <img
                src="/ham10000cnn.png"
                alt="Figure 2. EfficientNet-B0 confusion matrix on HAM10000 test set (left: raw counts, right: normalized proportions). Shows strong performance on benign classes (NV, BKL) and weaker performance on rare classes like DF and VASC."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
              <p>
                The EfficientNet-B0 model achieves strong performance on common classes (melanocytic nevus,
                benign keratosis) but shows lower accuracy on rare classes like dermatofibroma and vascular lesions.
                This is typical for imbalanced datasets.
              </p>
            </div>

            <div className="subsection">
              <h3>Test Set Metrics</h3>
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Metric</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Test Accuracy</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Macro F1-Score</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Balanced Accuracy</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>Macro ROC-AUC (OvR)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Test set size: [TODO: # images]. Evaluation on held-out test set (stratified, lesion-disjoint from train/val).
              </p>
            </div>

            <div className="subsection">
              <h3>Per-Class Performance</h3>
              <p>
                Precision, recall, and F1-score for each of the 7 lesion categories:
              </p>
              <table style={{ width: '100%', marginBottom: '1rem', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Class</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Precision</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Recall</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>F1-Score</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Test Samples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>AKIEC (Actinic keratosis)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>BCC (Basal cell carcinoma)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>BKL (Benign keratosis-like)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>DF (Dermatofibroma)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>MEL (Melanoma)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>NV (Melanocytic nevus)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>VASC (Vascular lesion)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="subsection">
              <h3>Interpretation</h3>
              <p>
                [TODO: After running evaluation, interpret results here. Key points to address:]
              </p>
              <ul>
                <li>Overall accuracy compared to baseline and other models</li>
                <li>Classes where the model performs well (high recall for clinically important classes)</li>
                <li>Classes where performance is weak and why (class imbalance, visual similarity)</li>
                <li>False positive/negative patterns (e.g., how often does it misclassify melanoma?)</li>
                <li>How transfer learning from ImageNet affects performance vs. training from scratch</li>
              </ul>
            </div>
          </section>

          {/* ============================================================== */}
          {/* HAM10000 CNN RESULTS */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>HAM10000 Custom CNN</h2>

            <div className="subsection">
              <h3>Architecture & Training</h3>
              <ul>
                <li><strong>Architecture</strong>: Custom convolutional neural network</li>
                <li><strong>Input Shape</strong>: 224×224 RGB images</li>
                <li><strong>Output Classes</strong>: 7 lesion categories</li>
                <li><strong>Layers</strong>: [TODO: specify conv/pool/dense layers]</li>
                <li><strong>Training Epochs</strong>: [TODO: number of epochs]</li>
                <li><strong>Batch Size</strong>: 16</li>
                <li><strong>Data Split</strong>: Stratified by diagnosis, grouped by lesion_id</li>
                <li><strong>Augmentation</strong>: Random horizontal flip, rotation, brightness, contrast</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Figure 3: HAM10000 CNN Confusion Matrix</h3>
              <img
                src="/hamconfusion.png"
                alt="Figure 3. HAM10000 custom CNN confusion matrix on test set (left: raw counts, right: normalized proportions)."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
            </div>

            <div className="subsection">
              <h3>Test Set Metrics</h3>
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Metric</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Test Accuracy</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Macro F1-Score</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Balanced Accuracy</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>Macro ROC-AUC (OvR)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="subsection">
              <h3>Interpretation</h3>
              <p>
                [TODO: Compare custom CNN to EfficientNet-B0. Key points:]
              </p>
              <ul>
                <li>Performance gap between transfer learning vs. training from scratch</li>
                <li>Computational cost vs. accuracy trade-off</li>
                <li>Generalization differences (validation vs. test set)</li>
              </ul>
            </div>
          </section>

          {/* ============================================================== */}
          {/* DDI CNN RESULTS */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>DDI Custom CNN (Diverse Skin Tones)</h2>

            <div className="subsection">
              <h3>Architecture & Training</h3>
              <ul>
                <li><strong>Architecture</strong>: Custom convolutional neural network</li>
                <li><strong>Input Shape</strong>: 224×224 RGB images</li>
                <li><strong>Output Classes</strong>: 16 disease groups</li>
                <li><strong>Dataset</strong>: Diverse Dermatology Images (DDI) — curated for representation across skin tones</li>
                <li><strong>Training Epochs</strong>: [TODO: number of epochs]</li>
                <li><strong>Data Augmentation</strong>: [TODO: augmentation strategy]</li>
                <li><strong>Class Balance Strategy</strong>: [TODO: specify if class weights used or oversampling]</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Figure 4: DDI CNN Confusion Matrix</h3>
              <img
                src="/ddiconfusion.png"
                alt="Figure 4. DDI custom CNN confusion matrix on test set showing performance across 16 disease groups."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
            </div>

            <div className="subsection">
              <h3>Test Set Metrics</h3>
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Metric</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Test Accuracy</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Macro F1-Score</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Balanced Accuracy</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>Macro ROC-AUC (OvR)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO: fill from training]</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="subsection">
              <h3>Interpretation</h3>
              <p>
                [TODO: Analyze DDI CNN results in context of fairness. Key points:]
              </p>
              <ul>
                <li>How does larger class count (16 vs. 7) affect per-class performance?</li>
                <li>Does diverse training data improve robustness?</li>
                <li>Which disease groups are most and least well-recognized?</li>
              </ul>
            </div>
          </section>

          {/* ============================================================== */}
          {/* MODEL COMPARISON */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>Model Comparison</h2>

            <div className="subsection">
              <h3>Figure 5: Overall Performance Comparison</h3>
              <img
                src="/allmodels.png"
                alt="Figure 5. Side-by-side comparison of all three models: HAM10000 CNN, EfficientNet-B0, and DDI CNN. Shows test accuracy, F1-score, and balanced accuracy."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
            </div>

            <div className="subsection">
              <h3>Comparative Metrics</h3>
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Model</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Accuracy</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Macro F1</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Classes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>HAM10000 CNN</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>7</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>EfficientNet-B0</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>7</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>DDI CNN</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>16</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Note: DDI CNN addresses a different classification problem (16 disease groups)
                and is evaluated on a separate dataset focused on diverse skin tone representation.
              </p>
            </div>
          </section>

          {/* ============================================================== */}
          {/* FAIRNESS & SKIN TONE ANALYSIS */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>Fairness & Skin Tone Analysis</h2>

            <div className="subsection">
              <h3>Motivation</h3>
              <p>
                Skin lesion classification models trained on HAM10000 (primarily light-skinned patients)
                may perform poorly on darker skin tones. The DDI dataset was curated specifically to address
                this representation gap, with diverse Fitzpatrick skin tone labels.
              </p>
            </div>

            <div className="subsection">
              <h3>Fitzpatrick Scale Stratification</h3>
              <p>
                If Fitzpatrick skin tone labels are available in the DDI metadata:
              </p>
              <ul>
                <li><strong>Light (FST I–III)</strong>: Fair to medium skin</li>
                <li><strong>Dark (FST IV–VI)</strong>: Olive to very dark skin</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Fairness Metrics by Skin Tone</h3>
              <p>
                [TODO: If Fitzpatrick groups are available, populate this table after evaluation runs]
              </p>
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Model & Skin Tone Group</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Accuracy</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Macro F1</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Test Samples</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>EfficientNet: Light (FST I–III)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>EfficientNet: Dark (FST IV–VI)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}><strong>Accuracy Gap</strong></td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}><strong>[TODO]</strong></td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>—</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>—</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>DDI CNN: Light (FST I–III)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>DDI CNN: Dark (FST IV–VI)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>[TODO]</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="subsection">
              <h3>Key Findings & Interpretation</h3>
              <p>
                [TODO: After computing fairness metrics, interpret here. Key questions:]
              </p>
              <ul>
                <li>Do models trained on HAM10000 show disparities across skin tone groups?</li>
                <li>Does the DDI dataset (with diverse representation) close the accuracy gap?</li>
                <li>Are there specific lesion types where disparities are largest?</li>
                <li>What is the practical clinical significance of observed gaps?</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Limitations</h3>
              <p>
                [TODO: Document limitations of this fairness analysis]
              </p>
              <ul>
                <li>If Fitzpatrick labels are not available in DDI metadata, fairness evaluation cannot proceed</li>
                <li>Fitzpatrick scale has known limitations (self-reported, doesn't capture full spectrum)</li>
                <li>Small sample sizes in some skin tone groups may limit statistical power</li>
                <li>Cross-dataset evaluation (HAM10000 models on DDI test set) may not be fair due to distribution shift</li>
              </ul>
            </div>
          </section>

          {/* ============================================================== */}
          {/* GENERAL INTERPRETATION & NEXT STEPS */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>Discussion & Limitations</h2>

            <div className="subsection">
              <h3>What the Models Do Well</h3>
              <ul>
                <li>[TODO: Highlight strong performance on clinically important classes]</li>
                <li>[TODO: Note classes with high recall (few false negatives)]</li>
                <li>[TODO: Discuss generalization properties]</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Where Models Struggle</h3>
              <ul>
                <li>[TODO: Classes with low recall or precision]</li>
                <li>[TODO: Common failure modes (e.g., misclassifications between similar conditions)]</li>
                <li>[TODO: Potential causes: class imbalance, visual similarity, training data issues]</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Evaluation Methodology</h3>
              <ul>
                <li><strong>Test Set Split</strong>: Stratified by class, grouped by patient/lesion ID to prevent data leakage</li>
                <li><strong>Metrics</strong>: Test accuracy, macro F1-score, balanced accuracy, per-class precision/recall/F1</li>
                <li><strong>Confusion Matrices</strong>: Raw counts and normalized by true class for interpretability</li>
                <li><strong>Imbalanced Data</strong>: Macro-averaged metrics prioritized (treat all classes equally) over micro-averaged (weight by prevalence)</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Important Limitations</h3>
              <ul>
                <li><strong>Not a Medical Device</strong>: Models are not clinically validated. Do not use for diagnosis.</li>
                <li><strong>Distribution Shift</strong>: Phone photos differ from dermatoscopic images. Performance on real-world data may be lower.</li>
                <li><strong>Missing Context</strong>: Models do not use patient history, medication, location of lesion, or other clinical information.</li>
                <li><strong>Dataset Bias</strong>: Even with diverse DDI data, representation may not be truly global. Other skin conditions, lighting, equipment differences not captured.</li>
                <li><strong>Fairness is Hard</strong>: Skin tone is one dimension. Age, gender, geography, socioeconomic factors also affect healthcare disparities.</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Responsible AI Context</h3>
              <p>
                This research project investigates how dataset composition affects model fairness.
                The goal is <em>not</em> to deploy a product, but to understand challenges in building
                more equitable AI for dermatology. Always consult a qualified healthcare professional
                for diagnosis and treatment decisions.
              </p>
            </div>
          </section>

          {/* ============================================================== */}
          {/* HOW TO REGENERATE THESE RESULTS */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>How to Regenerate These Results</h2>

            <div className="subsection">
              <h3>Running Full Evaluation</h3>
              <p>
                To regenerate all evaluation metrics, confusion matrices, and fairness analysis:
              </p>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '8px',
                overflowX: 'auto',
                fontSize: '0.9rem',
              }}>
{`python scripts/generate_evaluation_metrics.py`}
              </pre>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                See <code>scripts/generate_evaluation_metrics.py</code> for full implementation.
              </p>
            </div>

            <div className="subsection">
              <h3>Outputs Generated</h3>
              <ul>
                <li><code>evaluation_results/</code> — CSV files with metrics</li>
                <li><code>evaluation_results/*_confusion.png</code> — Confusion matrix charts</li>
                <li><code>evaluation_results/*_per_class.png</code> — Per-class performance bar charts</li>
                <li><code>evaluation_results/*_fairness.csv</code> — Skin-tone stratified metrics (if available)</li>
              </ul>
            </div>
          </section>

          <section className="content-section">
            <p style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ccc', fontSize: '0.9rem', color: '#666' }}>
              <strong>Disclaimer:</strong> This evaluation is based on research data and should not be used
              for clinical decision-making. Always consult a qualified healthcare professional for medical advice.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Evaluation;
