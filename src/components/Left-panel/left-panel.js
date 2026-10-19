import React from 'react';
import './left-panel.css';
import { FaGithub, FaLinkedin, FaPhone } from 'react-icons/fa';
import { SiGmail } from "react-icons/si";
import photo from '../../assets/profile.png';
import details from '../../assets/data.json'

const LeftPanel = () => {
    const emails = details.emails.reduce((emails, email, index) => {
        emails[index + 1] = email;
        return emails;}, {});

    const handleEmailClick = () => {
        const emailOptions = Object.entries(emails)
            .map(([key, email]) => `${key}) ${email}`)
            .join('\n');
            
        const option = prompt(`Please choose an email: \n${emailOptions}`);
        
        if (!option) return;
        
        const selectedEmail = emails[option];
        if (selectedEmail) {
            window.location.href = `mailto:${selectedEmail}`;
        } else {
            alert('Invalid option selected.');
        }
    };

    const scrollToProjects = () => {
        const section = document.getElementById('projects');
        const container = document.querySelector('.profile');
        if (!section) return;
        const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const offset = 1.5 * remPx;
        if (container) {
            const top = section.offsetTop - container.offsetTop - offset;
            container.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
        } else {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const openResume = () => {
        const resumePath = require(`../../assets/${details.resume}`);
        window.open(resumePath, '_blank');
    };

    return (
        <div className='left-panel-org'>
            <div className='profile-image'>
                <img src={photo} alt='Profile' />
            </div>
            <h1 className='profile-name'>{details['profile-name']}</h1>
            {details['profile-tagline'] && (
                <span className='profile-tagline'>{details['profile-tagline']}</span>
            )}
            {details['profile-focus'] && (
                <p className='profile-focus-line'>{details['profile-focus']}</p>
            )}
            <div className='left-proof'>
                {(details.proof || []).map((item) => (
                    <div key={item.label} className='left-proof-item'>
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
            <div className='left-actions'>
                <button type='button' className='left-btn-primary' onClick={scrollToProjects}>
                    Explore work
                </button>
                <button type='button' className='left-btn-ghost' onClick={openResume}>
                    Resume
                </button>
            </div>
            <div className='social-links'>
                <a href="https://www.linkedin.com/in/agrawalabr" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="social-icon" />
                </a>
                <a href="https://github.com/agrawalabr" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="social-icon" />
                </a>
                <div onClick={handleEmailClick}>
                    <SiGmail className="social-icon" />
                </div>
                <a href="tel:+1 (669) 278-5382" target="_blank" rel="noopener noreferrer">
                    <FaPhone className="social-icon" />
                </a>
            </div>
        </div>
    );
};

export default LeftPanel;
