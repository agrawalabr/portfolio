import React from 'react';
import './right-panel.css';
import details from '../../assets/data.json';

const RightPanel = () => {
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

    return (
        <div className='right-panel'>
            <button className='email' onClick={handleEmailClick}>
                {emails[1]}
            </button>
            <div className="right-badge-line"></div>
        </div>
    );
};

export default RightPanel;