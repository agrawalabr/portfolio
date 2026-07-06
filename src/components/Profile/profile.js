import React, { useState } from 'react'
import './profile.css'
import parse from 'html-react-parser';
import details from '../../assets/data.json'
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";

const Profile = () => {
    
    function skillIconComponent(icon) {
        if (!icon || typeof icon !== 'string') return null;
        const lower = icon.toLowerCase();
        if (lower.startsWith('fa')) return require('react-icons/fa')[icon] || null;
        if (lower.startsWith('si')) return require('react-icons/si')[icon] || null;
        if (lower.startsWith('io')) return require('react-icons/io5')[icon] || null;
        if (lower.startsWith('vsc')) return require('react-icons/vsc')[icon] || null;
        if (lower.startsWith('go')) return require('react-icons/go')[icon] || null;
        if (lower.startsWith('pi')) return require('react-icons/pi')[icon] || null;
        if (lower.startsWith('tb')) return require('react-icons/tb')[icon] || null;
        return null;
    } 

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
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
  const [contactStatus, setContactStatus] = useState('idle');
  const [contactError, setContactError] = useState('');

  const contactEmail = details.emails?.[0] || 'agrawalabr@gmail.com';

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');

    const form = e.currentTarget;
    if (form.querySelector('input[name="botcheck"]')?.value) {
      return;
    }

    const getVal = (id) => String(form.querySelector(`#${id}`)?.value || '').trim();
    const name = getVal('name');
    const email = getVal('email');
    const phone = getVal('mobile');
    const text = getVal('message');
    const submittedAt = new Date();
    const timeLabel = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(submittedAt);

    const record = {
      name,
      email,
      phone,
      message: text,
      submittedAt: submittedAt.toISOString(),
      source: 'portfolio',
    };
    const recordLine = JSON.stringify(record);

    setContactStatus('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contactEmail)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `New message · ${name || 'Visitor'} · portfolio`,
          _template: 'table',
          _captcha: false,
          _replyto: email,
          name,
          email,
          phone: phone || '—',
          message: text,
          time: timeLabel,
          origin: "Abhishek Agrawal's portfolio — contact form",
          record: recordLine,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (typeof data.message === 'string' && data.message) || data.error || 'Could not send message. Try again later.'
        );
      }
      if (data.success === false || data.success === 'false') {
        throw new Error(
          (typeof data.message === 'string' && data.message) || 'Could not send message. Try again later.'
        );
      }
      setContactStatus('success');
      form.reset();
    } catch (err) {
      setContactStatus('error');
      setContactError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className='profile'>  
        <section id='about-me'>
            <h2 className='section-heading' style={{marginTop:0}} onClick={() => scrollToSection('about-me')}>
                <div className='highlight'>01.</div>About Me<div className='line'></div></h2>
            <div className='about-me'>
                <h3 className='about-tagline'>{details['about-tagline']}</h3>
                {Object.entries(details['about-me']).map(([key, value]) => (
                    <p key={key}>{parse(value)}</p>
                ))}
            </div>
        </section>

        <section id='skills'>
            <h2 className='section-heading' onClick={() => scrollToSection('skills')}>
                <div className='highlight'>02.</div>Skills<div className='line'></div></h2>
            <div className='skills-container'>
                {Object.entries(details.skills).map(([type, value]) => (
                    <div key={type}> 
                        <h3 key={type} className='type-heading'>{type}</h3>
                        <div className='skills-grid'>
                        {Object.entries(value).map(([skill, icon]) => {
                            const Icon = skillIconComponent(icon);
                            return (
                            <div key={skill} className='skills-item'>
                                {Icon ? React.createElement(Icon, { className: 'social-icon' }) : null}
                                {skill}
                            </div>
                            );
                        })}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section id='experience' >
            <h2 className='section-heading' onClick={() => scrollToSection('experience')}>
                <div className='highlight'>03.</div>Experience<div className='line'></div>
            </h2>

            <div className='timeline'>
                <div className='timeline-rail'></div>
                {Object.entries(details.experiences).map(([key, experience], idx) => {;
                    const isBadge = experience.badge && ( /present/i.test(experience.badge) || /most recent/i.test(experience.badge) );
                    const side = idx % 2 === 0 ? 'right' : 'left';
                    const nameHasLink = experience.name && experience.name.includes('@');
                    const commentHasLink = experience.comment && experience.comment.includes('@');
                    return (
                    <div key={key} className={`tl-item tl-${side}${isBadge ? ' tl-ongoing' : ''}`}>
                        <div className='tl-dot'> {isBadge && <span className='tl-pulse'></span>} </div>
                        <div className='tl-card'>
                            <div className='tl-meta'>
                                <span className='tl-years'>{experience.years}</span>
                                {isBadge && <span className='tl-badge'>{experience.badge}</span>}
                            </div>
                            <h3 className='tl-title'>
                                {nameHasLink ? ( <a href={experience.name.split('@')[1]} target='_blank' rel='noopener noreferrer'> {experience.name.split('@')[0]} </a>
                                                ) : experience.name}
                            </h3>
                            <p className='tl-position'>{experience.position}</p>
                            {experience.comment && (
                                commentHasLink ? (
                                    <a className='tl-comment' href={experience.comment.split('@')[1]} target='_blank' rel='noopener noreferrer'>
                                        {experience.comment.split('@')[0]}
                                    </a>
                                ) : (
                                    <p className='tl-comment'>{experience.comment}</p>
                                )
                            )}
                            <p className='tl-location'>{experience.location}</p>
                        </div>
                    </div>);})}
            </div>
        </section>

        <section id='projects'>
            <h2 className='section-heading' onClick={() => scrollToSection('projects')}>
                <div className='highlight'>04.</div>Projects<div className='line'></div></h2>
                {Object.entries(details.projects).slice(0, 5).map(([key, project]) => {
                    const isimage = project.image ? (/\.mov$/.test(project.image) ? false : true) : null;
                    return (
                    <div key={key} className='project-container'>
                        {(isimage === null) ? (
                            <div className='project-image'> <img style={{display: 'block', textAlign: 'center', alignContent: 'center'}} src="" alt={project.name} /></div>
                        ) : (
                            isimage ? <div className='project-image'> <img src={require(`../../assets/${project.image}`)} alt={project.name} /></div> :
                            <div className='project-image'> <video src={require(`../../assets/${project.image}`)} alt={project.name} autoPlay loop muted playsInline /> </div>
                        )}
                        <div className='project-item'>
                            <div className='description'>
                                {project.link ? (<a href={project.link} target="_blank" rel="noopener noreferrer"><h3>{project.name}<FaArrowUpRightFromSquare className='arrow-icon' /></h3></a>) :
                                (<h3 style={{color: 'var(--accent-color)'}}>{project.name}</h3>)}
                                {project.description && <p>{project.description}</p>} 
                            </div>
                            {project.skills && <div className='resources'>{project.skills?.map(skill => skill === 'github' ? 
                            (<a key={skill} className='github-a' href={project.github} target="_blank" rel="noopener noreferrer"><FaGithub className='github-icon' /></a>):
                            (<span key={skill}>{skill} </span>)
                            )}</div>}
                        </div>
                    </div>
                    );
                })}
        </section>

        <section id='contact'>
            <h2 className='section-heading' onClick={() => scrollToSection('contact')}>
                <div className='highlight'>05.</div>Contact me<div className='line'></div></h2>
            <div className='contact-div'>
                <div className='contact-form'>
                    <h3>Leave a message — <span className='accent'>let's connect</span></h3>
                    <form onSubmit={handleContactSubmit}>
                        <input
                            className="contact-honeypot"
                            type="text"
                            name="botcheck"
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                        />
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" placeholder="Your name" autoComplete="name" required />
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" required />
                        <label htmlFor="mobile">Phone</label>
                        <input type="tel" id="mobile" name="mobile" placeholder="+1 (555) 123-4567" autoComplete="tel" required />
                        <label htmlFor="message">Message</label>
                        <textarea id="message" name="message" placeholder="What would you like to chat about?" required />
                        <button type="submit" disabled={contactStatus === 'sending'}>
                            {contactStatus === 'sending' ? 'Sending…' : 'Send Message'}
                        </button>
                        {contactStatus === 'success' && (
                            <p className="contact-form__status contact-form__status--success" role="status" aria-live="polite">
                                Thanks — your message is on its way. I&rsquo;ll get back to you soon.
                            </p>
                        )}
                        {contactStatus === 'error' && contactError && (
                            <p className="contact-form__status contact-form__status--error" role="alert">
                                {contactError}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
        <section className="footer">
            <a className="built-by" href="https://github.com/agrawalabr/portfolio" target="_blank" rel="noopener noreferrer">
                <div>Designed &amp; Built by Abhishek Agrawal</div>
            </a>
            <div className="copy-right">
                <span>Copyright &copy; 2026 Abhishek Agrawal | All rights reserved.</span>
            </div>
        </section>
      </div>
  )
}

export default Profile