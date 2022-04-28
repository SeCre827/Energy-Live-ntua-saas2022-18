/* All the needed components for the page are imported */
import React from 'react';
import './About.css';

function About() {
  return (
    <main>
      <section class='blank-banner-1'>
        <div class='vartical-center'>
          <div class='about-box'>
            <h1 class='h1'>Energy Live 2022 Creators</h1>
            <p>
              {' '}
              <b>Αλέξανδρος Κουριδάκης:</b>{' '}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://webmail.ntua.gr'
              >
                el18008@mail.ntua.gr{' '}
              </a>
            </p>
            <p>
              {' '}
              <b>Λευτέρης Οικονόμου:</b>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://webmail.ntua.gr'
              >
                el17827@mail.ntua.gr{' '}
              </a>
            </p>
            <p>
              {' '}
              <b>Βικέντιος Βιτάλης:</b>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://webmail.ntua.gr'
              >
                el18803@mail.ntua.gr{' '}
              </a>
            </p>
            <p>
              {' '}
              <b>Στέφανος Τσώλος:</b>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://webmail.ntua.gr'
              >
                el18050@mail.ntua.gr{' '}
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
