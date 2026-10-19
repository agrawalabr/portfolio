import React from 'react';
import './BrandLogo.css';
import logoMark from '../../assets/logo-mark.png';

/** Real AA mark (two overlapping As) on a theme-aware plate */
const BrandLogo = ({ className = '', title = 'Abhishek Agrawal' }) => (
  <span className={`brand-logo ${className}`.trim()} role="img" aria-label={title}>
    <span className="brand-logo__plate" aria-hidden="true" />
    <img className="brand-logo__mark" src={logoMark} alt="" draggable={false} />
  </span>
);

export default BrandLogo;
