import React from 'react';
import './Page.css';

function Evaluation() {
  return (
    <div className="page">
      <div className="page-container">
        <header className="page-header">
          <h1>Model Evaluation & Results</h1>
          <p className="page-subtitle">Performance metrics and visual analysis</p>
        </header>

        <div className="page-content">
          {/* ============================================================== */}
          {/* HAM10000 OVERVIEW */}
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
                and melanoma (MEL) only ~10%.
              </p>
            </div>
          </section>

          {/* ============================================================== */}
          {/* ANN BASELINE RESULTS */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>ANN Baseline Model</h2>

            <div className="subsection">
              <h3>Architecture & Training</h3>
              <ul>
                <li><strong>Architecture</strong>: Artificial Neural Network (baseline model)</li>
                <li><strong>Input Shape</strong>: 224×224 RGB images</li>
                <li><strong>Output Classes</strong>: 7 lesion categories</li>
                <li><strong>Data Split</strong>: Stratified by diagnosis, grouped by lesion_id to prevent data leakage</li>
                <li><strong>Augmentation</strong>: Random horizontal flip, rotation, brightness/contrast adjustments</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Figure 2: Training History</h3>
              <img
                src="/ham100annperformance.png"
                alt="Figure 2. ANN baseline training history showing accuracy and loss over epochs."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
              <p>
                Training curves show learning progression across epochs. Accuracy increases while loss decreases,
                indicating successful model learning.
              </p>
            </div>

            <div className="subsection">
              <h3>Test Results</h3>
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Metric</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Accuracy</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>70.99%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Precision</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>72.14%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Recall (Sensitivity)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>70.19%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>Loss</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>16.8%</td>
                  </tr>
                </tbody>
              </table>
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
                <li><strong>Data Split</strong>: Stratified by diagnosis, grouped by lesion_id to prevent data leakage</li>
                <li><strong>Augmentation</strong>: Random horizontal flip, rotation, brightness/contrast adjustments</li>
                <li><strong>Preprocessing</strong>: Resize to 224×224, normalize using training set mean/std</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Figure 3: Training History</h3>
              <img
                src="/ham10000cnn.png"
                alt="Figure 3. HAM10000 CNN training history showing accuracy and loss progression."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
              <p>
                Training curves demonstrate model convergence, with validation accuracy plateauing as the model approaches optimal performance.
              </p>
            </div>

            <div className="subsection">
              <h3>Figure 4: Confusion Matrix</h3>
              <img
                src="/hamconfusion.png"
                alt="Figure 4. HAM10000 CNN confusion matrix on test set showing classification performance across 7 lesion categories."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
              <p>
                Confusion matrix displays how the model classifies each lesion type. Diagonal values (correct predictions)
                indicate good performance; off-diagonal values show common misclassifications.
              </p>
            </div>

            <div className="subsection">
              <h3>Test Results</h3>
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Metric</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Accuracy</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>75.74%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Precision</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>84.02%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Recall (Sensitivity)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>69.85%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>Loss</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>67.5%</td>
                  </tr>
                </tbody>
              </table>
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
                <li><strong>Dataset</strong>: Diverse Dermatology Images (DDI) — curated for diverse skin tone representation</li>
                <li><strong>Size</strong>: 656 images + augmentation to address dataset imbalance</li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Figure 5: Training History</h3>
              <img
                src="/ddicnn.png"
                alt="Figure 5. DDI CNN training history showing accuracy and loss over epochs."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
              <p>
                Training on the diverse DDI dataset shows steady improvement with strong convergence to high accuracy levels.
              </p>
            </div>

            <div className="subsection">
              <h3>Figure 6: Confusion Matrix</h3>
              <img
                src="/ddiconfusion.png"
                alt="Figure 6. DDI CNN confusion matrix on test set showing performance across 16 disease groups."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
              <p>
                DDI CNN addresses a different classification problem (16 disease groups) and is evaluated on a separate dataset
                specifically curated for diverse skin tone representation.
              </p>
            </div>

            <div className="subsection">
              <h3>Test Results</h3>
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Metric</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Accuracy</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>81.57%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Precision</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>88.07%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>Recall (Sensitivity)</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>78.76%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>Loss</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>73.95%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ============================================================== */}
          {/* MODEL COMPARISON */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>Model Comparison</h2>

            <div className="subsection">
              <h3>Figure 7: Performance Comparison</h3>
              <img
                src="/allmodels.png"
                alt="Figure 7. Side-by-side comparison of all three models showing test accuracy, precision, recall, and loss."
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }}
              />
            </div>

            <div className="subsection">
              <h3>Summary</h3>
              <table style={{ width: '100%', marginBottom: '1rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left', padding: '0.5rem' }}>Model</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Accuracy</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Precision</th>
                    <th style={{ textAlign: 'right', padding: '0.5rem' }}>Recall</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>ANN Baseline</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>70.99%</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>72.14%</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>70.19%</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.5rem' }}>HAM10000 CNN</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>75.74%</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>84.02%</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>69.85%</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem' }}>DDI CNN</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>81.57%</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>88.07%</td>
                    <td style={{ textAlign: 'right', padding: '0.5rem' }}>78.76%</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                <strong>Key Finding:</strong> DDI CNN achieves the highest accuracy (81.57%) and precision (88.07%),
                demonstrating that diverse training data improves model performance.
              </p>
            </div>
          </section>

          {/* ============================================================== */}
          {/* FAIRNESS & SKIN TONE */}
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
                Evaluation can be stratified by skin tone groups using Fitzpatrick classification:
              </p>
              <ul>
                <li><strong>Light (FST I–III)</strong>: Fair to medium skin</li>
                <li><strong>Dark (FST IV–VI)</strong>: Olive to very dark skin</li>
              </ul>
              <p>
                This allows measurement of accuracy gaps and assessment of whether diverse training data reduces disparities.
              </p>
            </div>

            <div className="subsection">
              <h3>Key Insight</h3>
              <p>
                The superior performance of DDI CNN suggests that training on a diverse dataset improves
                model robustness and fairness across different skin tones.
              </p>
            </div>
          </section>

          {/* ============================================================== */}
          {/* IMPORTANT DISCLAIMERS */}
          {/* ============================================================== */}
          <section className="content-section">
            <h2>Important Limitations</h2>

            <ul>
              <li><strong>Not a Medical Device</strong>: Models are not clinically validated and should not be used for diagnosis.</li>
              <li><strong>Distribution Shift</strong>: Phone photos differ from dermatoscopic images. Real-world performance may be lower.</li>
              <li><strong>Missing Context</strong>: Models do not use patient history, medication, lesion location, or other clinical information.</li>
              <li><strong>Dataset Bias</strong>: Even with diverse data, representation may not be truly global.</li>
              <li><strong>Always Consult a Professional</strong>: Contact a qualified healthcare professional for any skin concerns.</li>
            </ul>
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
