import React, { useState } from 'react';
import './navbar.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import details from '../../assets/data.json'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { id: '01.', text: 'Home', link: 'about-me' },
        { id: '02.', text: 'Skills', link: 'skills' },
        { id: '03.', text: 'Experience', link: 'experience' },
        { id: '04.', text: 'Projects', link: 'projects' },
        { id: '05.', text: 'Contact', link: 'contact' }
    ];

    const handleMenuClick = (id) => {
        const selectedItem = menuItems.find(item => item.id === id);
        if (selectedItem) {
            document.getElementById(selectedItem.link).scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    const handleResumeClick = () => {
        const resumeUrl = details.resume;
        window.open(resumeUrl, '_blank');
    };

    return (
        <nav className='navbar'>
            <img src={logo} alt="logo" className='logo'/>

            <div className='menu-icon' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
            </div>

            <div className={`dropdown-menu ${isMenuOpen ? 'active' : ''}`}>
                {menuItems.map(({ id, text, link }) => (
                    <Link key={link} className='menuItems' onClick={() => handleMenuClick(id)}>
                        <span>{id}</span> {text}
                    </Link>
                ))}
                <button className='dropdown-resume' onClick={handleResumeClick}>
                    Resume
                </button>
            </div>

            <div className='menu'>
                {menuItems.map(({ id, text, link }) => (
                    <Link key={link} className='menuItems' onClick={() => handleMenuClick(id)}>
                        <span>{id}</span> {text}
                    </Link>
                ))}
            </div>

            <button className='resume' onClick={handleResumeClick}>
                Resume
            </button>
        </nav>
    );
};

export default Navbar;