import React from 'react'
import './profile.css'
import parse from 'html-react-parser';
import details from '../../assets/data.json'
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

const Profile = () => {
    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    };
    // TODO- store contact us these to a csv or a data file on s3
    // TODO- ML and LLM to be added to data.json
  return (
    <div className='profile'>  
        <section id='about-me'>
            <h2 className='section-heading' style={{marginTop:0}} onClick={() => scrollToSection('about-me')}>
                <div className='highlight'>01.</div>About Me<div className='line'></div></h2>
            <div className='about-me'>
                <h3> Big Data | Machine Learning | Web Development | Cloud Computing </h3>
                {Object.entries(details['about-me']).map(([key, value]) => (
                    <p key={key}>{parse(value)}</p>
                ))}
            </div>
        </section>
        <section id='skills'>
            <h2 className='section-heading' onClick={() => scrollToSection('skills')}>
                <div className='highlight'>03.</div>Skills<div className='line'></div></h2>
            <div className='skills-container'>
                {Object.entries(details.skills).map(([type, value]) => (
                    <div key={type}> 
                        <h3 key={type} className='type-heading'>{type}</h3>
                        <div className='skills-grid'>
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
                    </div>
                ))}
            </div>
        </section>
        <section id='experience' >
            <h2 className='section-heading' onClick={() => scrollToSection('experience')}>
                <div className='highlight'>02.</div>Experience<div className='line'></div></h2>
            <div className='timeline'>
                <div className='mid'>
                    <div className='undergrad'></div>
                    <div className='grad'></div>
                    <div className='arcs'></div>
                    <div className='info'></div>
                </div>
                {Object.entries(details.experiences).map(([key, experience]) => (
                    <div key={key} className={key}>
                        <h3>{experience.name && experience.name.includes("@") ? <a href={experience.name.split("@")[1]} target="_blank" rel="noopener noreferrer">{experience.name.split("@")[0]}<br/></a> :
                            experience.name}</h3>
                        <p>{experience.comment && experience.comment.includes("@") ? (<a href={experience.comment.split("@")[1]} target="_blank" rel="noopener noreferrer">{experience.comment.split("@")[0]}<br/></a>) : 
                            experience.comment && (<span style={{ color: 'var(--text-color)', opacity: 0.8 }}>{experience.comment}<br/></span>)}
                           {experience.years}<br/>
                           {experience.position}<br/>
                           {experience.location}</p>
                    </div>
                ))}
            </div>
        </section>
        <section id='projects'>
            <h2 className='section-heading' onClick={() => scrollToSection('projects')}>
                <div className='highlight'>04.</div>Projects<div className='line'></div></h2>
                {Object.entries(details.projects).map(([key, project]) => (
                    <div key={key} className='project-container'>
                        <div className='project-image'>{project.image && <img src={require(`../../assets/${project.image}`)} alt={project.name} />}</div>
                        <div className='project-item'>
                            <div className='description'>
                                <a href={project.link} target="_blank" rel="noopener noreferrer"><h3>{project.name}<FaArrowUpRightFromSquare className='arrow-icon' /></h3></a>
                                {project.description && <p>{project.description}</p>}
                            </div>
                            {project.skills && <div className='resources'>{project.skills?.map(skill => skill === 'github' ? 
                            (<a className='github-a' href={project.github} target="_blank" rel="noopener noreferrer"><FaGithub className='github-icon' /></a>):
                            (<span key={skill}>{skill} </span>)
                            )}</div>}
                        </div>
                    </div>
                ))}
        </section>
        <section id='contact'>
            <h2 className='section-heading' onClick={() => scrollToSection('contact')}>
                <div className='highlight'>05.</div>Contact me<div className='line'></div></h2>
            <div className='contact-form'>
            <h3>Leave a message and let's connect!</h3>
                <form>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" required></input>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required></input>
                    <label htmlFor="mobile">Phone No:</label>
                    <input type="mobile" id="mobile" name="mobile" required></input>
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" name="message" required></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>

        </section>
        <section className="footer">
            <a className="built-by" href="https://github.com/agrawalabr/portfolio" target="_blank" rel="noopener noreferrer">
                <div>Designed &amp; Built by Abhishek Agrawal</div>
            </a>
            <div className="copy-right">
                <span>Copyright &copy; 2024 Abhishek Agrawal | All rights reserved.</span>
            </div>
        </section>
      </div>
  )
}

export default Profile