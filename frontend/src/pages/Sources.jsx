import React from 'react';
import './Page.css';

function Sources() {
  return (
    <div className="page">
      <div className="page-container">
        <header className="page-header">
          <h1>Sources & References</h1>
          <p className="page-subtitle">Data, research, and acknowledgments</p>
        </header>

        <div className="page-content">
          <section className="content-section">
            <h2>Datasets</h2>

            <div className="subsection">
              <h3>HAM10000</h3>
              <p className="source-meta">
                Tschandl, P., Rosendahl, C., & Kittler, H. (2018)
              </p>
              <p>
                The HAM10000 ("Human Against Machine with 10,000 training images") dataset contains
                10,015 dermatoscopic images of skin lesions. Images were collected from multiple sources
                and clinically and histopathologically confirmed.
              </p>
              <div className="source-link">
                <a href="https://arxiv.org/abs/1803.10417" target="_blank" rel="noopener noreferrer">
                  Read the paper →
                </a>
                <a href="https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000" target="_blank" rel="noopener noreferrer">
                  Access the dataset →
                </a>
              </div>
            </div>

            <div className="subsection">
              <h3>Diverse Dermatology Images (DDI)</h3>
              <p className="source-meta">
                Groh et al., Stanford AI Index
              </p>
              <p>
                The DDI dataset was created specifically to address skin tone representation gaps in
                dermatology datasets. It contains dermatoscopic images with diverse representation
                across Fitzpatrick skin tone groups.
              </p>
              <div className="source-link">
                <a href="https://stanfordaimi.azurewebsites.net/datasets/35866158-8196-48d8-87bf-50dca81df965" target="_blank" rel="noopener noreferrer">
                  Access the dataset →
                </a>
              </div>
            </div>

            <div className="subsection">
              <h3>ISIC 2019</h3>
              <p className="source-meta">
                International Skin Imaging Collaboration
              </p>
              <p>
                ISIC provides a large repository of dermoscopic images with ground truth diagnoses.
                Used for benchmarking and additional model evaluation.
              </p>
              <div className="source-link">
                <a href="https://www.kaggle.com/datasets/andrewmvd/isic-2019" target="_blank" rel="noopener noreferrer">
                  Access the dataset →
                </a>
              </div>
            </div>
          </section>

          <section className="content-section">
            <h2>Key Research</h2>

            <div className="subsection">
              <h3>Fairness in Medical AI</h3>
              <ul>
                <li>
                  Obermeyer, Z., Powers, B., Vogeli, C., & Mullainathan, S. (2019).
                  "Dissecting racial bias in an algorithm used to manage the health of populations."
                  <em>Science</em>, 366(6464), 447-453.
                </li>
                <li>
                  Gianfrancesco, M. A., Tamang, S., Yazdany, J., & Schmajuk, G. (2018).
                  "Potential Biases in Machine Learning Algorithms Using Electronic Health Record Data."
                  <em>JAMA Internal Medicine</em>, 178(11), 1544-1547.
                </li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Skin Cancer Detection with Deep Learning</h3>
              <ul>
                <li>
                  Esteva, A., Kuprel, B., Novoa, R. A., et al. (2017).
                  "Dermatologist-level classification of skin cancer with deep neural networks."
                  <em>Nature Medicine</em>, 23(8), 923-926.
                </li>
                <li>
                  Haenssle, H. A., Fink, C., Schneiderbauer, R., et al. (2020).
                  "Man against machine: diagnostic performance of a deep learning convolutional neural network
                  for dermoscopic melanoma recognition in comparison to 58 dermatologists."
                  <em>Annals of Oncology</em>, 31(4), 540-547.
                </li>
              </ul>
            </div>

            <div className="subsection">
              <h3>Convolutional Neural Networks</h3>
              <ul>
                <li>
                  LeCun, Y., Bengio, Y., & Hinton, G. (2015).
                  "Deep learning." <em>Nature</em>, 521(7553), 436-444.
                </li>
                <li>
                  Krizhevsky, A., Sutskever, I., & Hinton, G. E. (2012).
                  "ImageNet classification with deep convolutional neural networks."
                  <em>Advances in Neural Information Processing Systems</em>.
                </li>
              </ul>
            </div>
          </section>

          <section className="content-section">
            <h2>Technologies</h2>
            <ul>
              <li><strong>TensorFlow & Keras:</strong> Deep learning framework</li>
              <li><strong>FastAPI:</strong> Backend web framework</li>
              <li><strong>React:</strong> Frontend user interface</li>
              <li><strong>Python:</strong> Machine learning implementation</li>
            </ul>
          </section>

          <section className="content-section">
            <h2>Project Team</h2>
            <p>
              This project was developed as part of the AI4ALL program,
              investigating fairness in skin lesion classification across diverse skin tones.
            </p>
            <p>
              Team: Avani Joshi, Daisy Phung, Phuong Hoang, Tigist Wujira, William Acosta Lora,
              Belyse Munezero, Bogning Guy-robert
            </p>
          </section>

          <section className="content-section">
            <h2>Disclaimer</h2>
            <p>
              This tool is provided for educational and research purposes only. It has not been
              clinically validated and should not be used for medical diagnosis or treatment.
              Always consult a qualified healthcare provider for any medical concerns.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Sources;
