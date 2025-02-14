import React from 'react';
import './left-panel.css';
import { FaGithub, FaLinkedin, FaInstagram, FaPhone } from 'react-icons/fa';
import photo from '../../assets/profile.png';
import details from '../../assets/data.json'

const LeftPanel = () => {
    return (
        <div className='left-panel'>
            <div className='profile-image'>
                <img src={photo} alt='Profile' />
            </div>
            <h1 className='profile-name'>{details['profile-name']}</h1>
            <p className='profile-description'>
                {details['profile-description']}
            </p>
            <div className='social-links'>
                <a href="https://www.linkedin.com/in/abhishek-agrawal-360472128" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="social-icon" />
                </a>
                <a href="https://github.com/agrawalabr" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="social-icon" />
                </a>
                <a href="https://www.instagram.com/_abhishekagrawal_" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="social-icon" />
                </a>
                <a href="tel:+1 (669) 278-5382" target="_blank" rel="noopener noreferrer">
                    <FaPhone className="social-icon" />
                </a>
            </div>
        </div>
    );
};

export default LeftPanel;