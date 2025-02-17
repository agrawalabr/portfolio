import React from 'react';
import './navbar.css';
import logo from '../../assets/logo.png';
import {Link} from 'react-scroll';

const Navbar = () => {
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
        const option = prompt("Please select an option:\n1. Resume\n2. Cover Letter");
        const documents = {
            '1': 'resume.pdf',
            '2': 'cover-letter.pdf'
        };

        const selectedDoc = documents[option];
        if (selectedDoc) {
            window.open(`https://your-s3-bucket.s3.amazonaws.com/${selectedDoc}`, '_blank');
        } else {
            alert('Invalid option selected');
        }
    };

    return (
        <nav className='navbar'>
            <img src={logo} alt="logo" className='logo'/>
            <div className='menu'>
                {menuItems.map(({id, text, link}) => (
                    <Link key={link} className='menuItems'
                    onClick={() => handleMenuClick(id)}>
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