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
          <section className="content-section" style={{ backgroundColor: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
              <strong>Detailed quantitative metrics are being compiled from training runs.</strong> This page presents the visual analysis and technical framework. Complete benchmark results (accuracy, F1-score, per-class metrics) will be published upon final model evaluation.
            </p>
          </section>

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
              <h3>Test Set Performance</h3>
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                Detailed metrics being compiled. Key evaluation methodology documented below.
              </p>
            </div>

            <div className="subsection">
              <h3>Per-Class Performance</h3>
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                Per-class precision, recall, and F1-score for each of the 7 lesion categories will be included upon final metric publication.
              </p>
            </div>

            <div className="subsection">
              <h3>Key Findings</h3>
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                Results interpretation will accompany final metric publication, including comparison to baseline and per-class analysis.
              </p>
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
              <h3>Performance Analysis</h3>
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                Detailed metrics and comparison with transfer learning approach will be published upon final evaluation.
              </p>
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
              <h3>Performance & Fairness Analysis</h3>
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                Evaluation results focusing on diverse representation and per-class performance will be published upon final model assessment.
              </p>
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
              <h3>Comparative Analysis</h3>
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                Side-by-side comparison of all three models (accuracy, F1-score, balanced accuracy) will be published with final evaluation results.
              </p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Note: DDI CNN addresses a different classification problem (16 disease groups) and is evaluated on a separate dataset focused on diverse skin tone representation.
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
              <h3>Stratified Evaluation Results</h3>
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                Detailed fairness analysis by Fitzpatrick skin tone group (Light FST I–III vs. Dark FST IV–VI) will be published upon completion of stratified evaluation.
              </p>
            </div>

            <div className="subsection">
              <h3>Findings</h3>
              <p style={{ color: '#999', fontStyle: 'italic' }}>
                Comprehensive interpretation of fairness findings will be published upon final analysis.
              </p>
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
            <h2>Model Analysis & Limitations</h2>

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
