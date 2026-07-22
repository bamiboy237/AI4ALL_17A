import React from 'react';
import './Page.css';

function About() {
  return (
    <div className="page">
      <div className="page-container">
        <header className="page-header">
          <h1>About This Tool</h1>
          <p className="page-subtitle">Understanding the algorithms</p>
        </header>

        <div className="page-content">
          <section className="content-section">
            <h2>What is this tool?</h2>
            <p>
              This is a clinical reference tool that uses deep learning to analyze dermoscopic images
              of skin lesions. It classifies lesions using two independently trained convolutional neural
              networks (CNNs), each optimized for different datasets and use cases.
            </p>
          </section>

          <section className="content-section">
            <h2>The Models</h2>

            <div className="subsection">
              <h3>HAM10000 CNN</h3>
              <p>
                Trained on the HAM10000 dataset, this model classifies skin lesions into seven categories:
              </p>
              <ul>
                <li><strong>Melanoma</strong> (Malignant) - Most dangerous form of skin cancer</li>
                <li><strong>Melanocytic nevus</strong> (Benign) - Common mole</li>
                <li><strong>Basal cell carcinoma</strong> (Malignant) - Most common skin cancer</li>
                <li><strong>Actinic keratosis</strong> (Malignant) - Pre-cancerous lesion</li>
                <li><strong>Benign keratosis</strong> (Benign) - Age spot or seborrheic keratosis</li>
                <li><strong>Dermatofibroma</strong> (Benign) - Fibrous skin lesion</li>
                <li><strong>Vascular lesion</strong> (Benign) - Blood vessel abnormality</li>
              </ul>
              <p>
                This model provides detailed classification across more lesion types, useful when
                you need specific diagnostic categories.
              </p>
            </div>

            <div className="subsection">
              <h3>DDI CNN</h3>
              <p>
                Trained on the Diverse Dermatology Images (DDI) dataset, this model uses a simpler
                binary classification:
              </p>
              <ul>
                <li><strong>Melanoma</strong> (Malignant)</li>
                <li><strong>Non-melanoma</strong> (Benign)</li>
              </ul>
              <p>
                The DDI dataset was specifically curated to include diverse skin tones, making this
                model particularly useful for evaluating fairness and accuracy across demographic groups.
              </p>
            </div>
          </section>

          <section className="content-section">
            <h2>How it works</h2>
            <ol className="ordered-list">
              <li>
                <strong>Image preprocessing:</strong> Your image is resized to 75×100 pixels, converted
                to RGB color space if needed, and normalized to 0-1 scale.
              </li>
              <li>
                <strong>Feature extraction:</strong> The CNN analyzes patterns in the image using learned
                convolutional filters, extracting visual features at multiple scales.
              </li>
              <li>
                <strong>Classification:</strong> Extracted features are passed through fully connected
                layers to produce probability scores for each lesion class.
              </li>
              <li>
                <strong>Results:</strong> The highest-probability class is displayed as the primary
                prediction, with confidence scores and per-class probabilities shown for reference.
              </li>
            </ol>
          </section>

          <section className="content-section">
            <h2>Important limitations</h2>
            <ul>
              <li>
                <strong>Not a diagnostic tool:</strong> This model is for research and education only.
                It is not clinically validated and should never be used for diagnosis.
              </li>
              <li>
                <strong>Requires quality input:</strong> The model works best with clear dermoscopic
                images. Clinical photography or smartphone images may produce unreliable results.
              </li>
              <li>
                <strong>Context matters:</strong> Dermatologists integrate visual inspection with patient
                history, risk factors, and additional tests. This tool lacks that critical context.
              </li>
              <li>
                <strong>Fairness considerations:</strong> While DDI was curated for diversity, no model
                is perfectly fair. Results may vary across different demographics.
              </li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Fairness and skin tones</h2>
            <p>
              A core motivation for this project is investigating whether deep learning models can
              classify skin lesions fairly across diverse skin tones. The DDI dataset was specifically
              selected for its representation of individuals with darker skin types, who are historically
              underrepresented in dermatology research.
            </p>
            <p>
              Both models are evaluated across Fitzpatrick skin tone groups to measure performance
              disparities and help identify when accuracy may vary by demographic.
            </p>
          </section>

          <section className="content-section">
            <h2>Always consult a dermatologist</h2>
            <p>
              If you have concerns about a skin lesion, schedule an appointment with a qualified
              dermatologist. They can perform a comprehensive exam, order additional tests if needed,
              and provide a definitive diagnosis and treatment plan.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
