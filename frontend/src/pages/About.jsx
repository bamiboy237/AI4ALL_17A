import React from 'react';
import './Page.css';

function About() {
  return (
    <div className="page">
      <div className="page-container">
        <header className="page-header">
          <h1>About DermAware</h1>
          <p className="page-subtitle">A skin-lesion classification research prototype</p>
        </header>

        <div className="page-content">
          <section className="content-section">
            <h2>Purpose</h2>
            <p>
              DermAware compares two image-classification models that were trained
              on HAM10000. The application shows model scores for seven lesion
              classes. It does not provide a medical diagnosis.
            </p>
          </section>

          <section className="content-section">
            <h2>Available models</h2>

            <div className="subsection">
              <h3>HAM10000 CNN</h3>
              <p>
                This custom convolutional neural network learns image features
                directly from the HAM10000 training data.
              </p>
            </div>

            <div className="subsection">
              <h3>EfficientNet-B0</h3>
              <p>
                This transfer-learning model starts with visual features learned
                from ImageNet and adapts them to the same seven HAM10000 classes.
              </p>
            </div>
          </section>

          <section className="content-section">
            <h2>How the application works</h2>
            <ol className="ordered-list">
              <li>The API checks the image type and file size.</li>
              <li>The API converts the image to RGB.</li>
              <li>The API resizes the image to the selected model&apos;s input shape.</li>
              <li>The selected model returns one score for each lesion class.</li>
              <li>The application shows the highest class scores.</li>
            </ol>
          </section>

          <section className="content-section">
            <h2>Fairness study</h2>
            <p>
              The wider project studies how dataset representation can affect
              model performance across skin tones. The team uses Diverse
              Dermatology Images (DDI) for this analysis. DDI inference is not
              active in the current web application because its label mapping
              still requires verification.
            </p>
          </section>

          <section className="content-section">
            <h2>Limits</h2>
            <ul>
              <li>The models are not clinically validated.</li>
              <li>The models do not use medical history or other clinical context.</li>
              <li>A phone photo can differ from the dermatoscopic training images.</li>
              <li>A high model score does not mean that the output is correct.</li>
              <li>The current application does not report validated fairness metrics.</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Medical concerns</h2>
            <p>
              Contact a qualified healthcare professional if you have a concern
              about a skin lesion. Do not use this application to make a
              diagnosis or treatment decision.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default About;
