import React from 'react'
import './profile.css'
import details from '../../assets/data.json'

const Profile = () => {
  return (
    <div className='profile'>  
        <div id='home'>
            <h2 className='section-heading'><div className='highlight'>01.</div>About Me<div className='line'></div></h2>
                    {details['about-me']}
        </div>
        <div id='skills'>
            <h2 className='section-heading'><div className='highlight'>02.</div>Skills<div className='line'></div></h2>
            <div className='skills-container'>
                {Object.entries(details.skills).map(([type, value]) => (
                    <>
                        <h3 key={type} className='type-heading'>{type}</h3>
                        <div key={type} className='skills-grid'> 
                        {Object.entries(value).map(([skill, icon]) => (
                            <div key={skill} className='skills-item'>
                                {icon.toLowerCase().startsWith('fa') ? React.createElement(require(`react-icons/fa`)[icon], { className: "social-icon" }) : 
                                icon.toLowerCase().startsWith('si') ? React.createElement(require(`react-icons/si`)[icon], { className: "social-icon" }) : 
                                icon.toLowerCase().startsWith('io') ? React.createElement(require(`react-icons/io5`)[icon], { className: "social-icon" }) : 
                                icon.toLowerCase().startsWith('vsc') ? React.createElement(require(`react-icons/vsc`)[icon], { className: "social-icon" }) :
                                null}
                                {skill}
                            </div>
                        ))}
                        </div>
                    </>
                ))}
            </div>
        </div>
        <div id='experience'>
            <h2 className='section-heading'><div className='highlight'>03.</div>Experience<div className='line'></div></h2>
                    {details['about-me']}
        </div>
        <div id='projects'>
            <h2 className='section-heading'><div className='highlight'>04.</div>Projects<div className='line'></div></h2>
                    {details['about-me']}
        </div>
        <div id='contact'>
            <h2 className='section-heading'><div className='highlight'>05.</div>Contact me<div className='line'></div></h2>
                    {details['about-me']}
        </div>
    </div>
  )
}

export default Profile