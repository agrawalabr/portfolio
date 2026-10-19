import React, { useEffect, useMemo, useRef, useState } from 'react';
import './profile.css';
import details from '../../assets/data.json';
import photo from '../../assets/profile.png';
import introCutout from '../../assets/intro-cutout-hq.webm';
import introFallback from '../../assets/intro.mp4';
import BrandLogo from '../BrandLogo/BrandLogo';
import { brandColorFor } from '../BrandLogo/skillBrandColors';
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaGithub,
  FaLinkedin,
  FaVolumeHigh,
  FaVolumeXmark,
} from 'react-icons/fa6';

const STRIP_VISIBLE = 5;

function skillIcon(icon) {
  if (!icon || typeof icon !== 'string') return null;
  const lower = icon.toLowerCase();
  if (lower.startsWith('fa')) return require('react-icons/fa')[icon] || null;
  if (lower.startsWith('si')) return require('react-icons/si')[icon] || null;
  if (lower.startsWith('vsc')) return require('react-icons/vsc')[icon] || null;
  if (lower.startsWith('tb')) return require('react-icons/tb')[icon] || null;
  return null;
}

const abbrevOf = (name) => {
  const clean = name.replace(/[^A-Za-z0-9+./#]/g, '');
  if (clean.length <= 3) return clean;
  const parts = name.split(/[\s/&-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return clean.slice(0, 2);
};

const useTheme = () => {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  );
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return theme;
};

const useScrollMotion = () => {
  const lastY = useRef(0);
  const [dir, setDir] = useState('down');

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const next = y > lastY.current + 2 ? 'down' : y < lastY.current - 2 ? 'up' : dir;
      if (next !== dir) setDir(next);
      lastY.current = y;
      document.documentElement.setAttribute('data-scroll-dir', next);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dir]);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-in');
          else e.target.classList.remove('is-in');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    nodes.forEach((n) => io.observe(n));
    requestAnimationFrame(() => {
      nodes.forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 40) n.classList.add('is-in');
      });
    });
    return () => io.disconnect();
  }, []);

  return dir;
};

const Profile = () => {
  const families = Object.keys(details.skills || {});
  const theme = useTheme();
  useScrollMotion();

  const [skillFamily, setSkillFamily] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);
  const [projectIdx, setProjectIdx] = useState(0);
  const [stripStart, setStripStart] = useState(0);
  const [badgeFlipped, setBadgeFlipped] = useState(false);
  const [expProgress, setExpProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [introMuted, setIntroMuted] = useState(false);
  const [contactStatus, setContactStatus] = useState('idle');
  const [contactError, setContactError] = useState('');
  const expTrackRef = useRef(null);
  const introRef = useRef(null);
  const ribbonRef = useRef(null);

  const skillFlat = useMemo(() => {
    const rows = [];
    let n = 0;
    Object.entries(details.skills || {}).forEach(([fam, group]) => {
      Object.entries(group || {}).forEach(([name, icon]) => {
        n += 1;
        rows.push({ fam, name, icon, num: String(n).padStart(2, '0') });
      });
    });
    return rows;
  }, []);

  const roleNodes = useMemo(() => {
    const nodes = [];
    (details.experience || []).forEach((chapter) => {
      (chapter.roles || []).forEach((role) => {
        nodes.push({
          org: chapter.org,
          link: chapter.link,
          title: role.title,
          years: role.years,
          note: role.note,
        });
      });
    });
    return nodes;
  }, []);

  const projects = useMemo(
    () => (details.projects || []).filter((p) => !/portfolio/i.test(p.name || '')),
    []
  );
  const activeProject = projects[projectIdx] || projects[0];
  const ActiveIcon = activeSkill ? skillIcon(activeSkill.icon) : null;
  const logoColor = activeSkill ? brandColorFor(activeSkill.name, theme) : undefined;
  const stripEnd = Math.min(projects.length, stripStart + STRIP_VISIBLE);
  const stripProjects = projects.slice(stripStart, stripEnd);

  const selectProject = (i) => {
    setProjectIdx(i);
    if (i < stripStart) setStripStart(i);
    else if (i >= stripStart + STRIP_VISIBLE) setStripStart(Math.max(0, i - STRIP_VISIBLE + 1));
  };

  const stripPrev = () => {
    const nextStart = Math.max(0, stripStart - 1);
    setStripStart(nextStart);
    if (projectIdx >= nextStart + STRIP_VISIBLE) setProjectIdx(nextStart + STRIP_VISIBLE - 1);
  };

  const stripNext = () => {
    const maxStart = Math.max(0, projects.length - STRIP_VISIBLE);
    const nextStart = Math.min(maxStart, stripStart + 1);
    setStripStart(nextStart);
    if (projectIdx < nextStart) setProjectIdx(nextStart);
  };

  const orgLogo = (path) => {
    if (!path) return null;
    try {
      return require(`../../assets/${path}`);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!activeSkill && skillFlat[0]) setActiveSkill(skillFlat[0]);
  }, [activeSkill, skillFlat]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrollY(y);

      const exp = expTrackRef.current;
      if (exp) {
        const rect = exp.getBoundingClientRect();
        const track = Math.max(1, rect.height - window.innerHeight);
        const traveled = Math.min(track, Math.max(0, -rect.top));
        setExpProgress(traveled / track);
      }

      const ribbon = ribbonRef.current;
      if (ribbon) {
        const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const t = Math.min(1, Math.max(0, y / docH));
        ribbon.style.setProperty('--ribbon-t', t.toFixed(4));
        ribbon.style.setProperty('--ribbon-wave', `${Math.sin(t * Math.PI * 4) * 18}px`);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const openResume = () => window.open(require(`../../assets/${details.resume}`), '_blank');
  const openEmail = () => {
    const emails = details.emails || [];
    if (emails.length === 1) {
      window.location.href = `mailto:${emails[0]}`;
      return;
    }
    const choice = prompt(emails.map((e, i) => `${i + 1}) ${e}`).join('\n'));
    const selected = emails[Number(choice) - 1];
    if (selected) window.location.href = `mailto:${selected}`;
  };

  const resolveMedia = (image) => {
    const src = (image || '').trim();
    if (!src) return null;
    if (src.startsWith('/') || /^https?:\/\//i.test(src)) return src;
    return require(`../../assets/${src}`);
  };

  useEffect(() => {
    const el = introRef.current;
    if (!el) return undefined;
    el.muted = false;
    el.volume = 1;
    setIntroMuted(false);
    const tryPlay = () => {
      el.play().catch(() => {
        el.muted = true;
        setIntroMuted(true);
        el.play().catch(() => {});
      });
    };
    tryPlay();
    return undefined;
  }, []);

  const toggleMute = () => {
    const next = !introMuted;
    setIntroMuted(next);
    if (introRef.current) {
      introRef.current.muted = next;
      if (!next) introRef.current.play().catch(() => {});
    }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    setContactError('');
    const form = e.currentTarget;
    if (form.querySelector('[name="botcheck"]')?.value) return;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    setContactStatus('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(details.emails[0])}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Portfolio · ${name || 'Visitor'}`,
          _template: 'table',
          _captcha: false,
          _replyto: email,
          name,
          email,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false || data.success === 'false') {
        throw new Error(data.message || 'Could not send.');
      }
      setContactStatus('success');
      form.reset();
    } catch (err) {
      setContactStatus('error');
      setContactError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const mediaSrc = resolveMedia(activeProject?.image);
  const mediaIsVideo = /\.(mov|mp4|webm)$/i.test(activeProject?.image || '');

  // Watermark: snappy parallax, stay centered
  const wmY = Math.round(scrollY * 0.42);
  const wmScale = 1 + Math.min(0.08, scrollY / 4000);
  const wmOpacity = Math.max(0.28, 1 - scrollY / 900);

  return (
    <div className="folio">
      {/* Story ribbon — top-left → bottom-right, waves with scroll */}
      <div className="story-ribbon" ref={ribbonRef} aria-hidden="true">
        <svg className="story-ribbon-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            className="story-ribbon-path"
            d="M -5,6 C 12,2 22,18 34,14 S 52,4 64,20 S 78,42 88,58 S 96,78 105,92"
          />
          <path
            className="story-ribbon-path story-ribbon-path--soft"
            d="M -6,14 C 16,10 26,26 40,22 S 58,10 72,28 S 86,52 106,78"
          />
        </svg>
        <div className="story-ribbon-labels">
          {(details.recommendations || []).map((rec, i) => (
            <blockquote key={i} className={`story-ribbon-label story-ribbon-label--${i} rec-watermark`}>
              <p>&ldquo;{rec.quote}&rdquo;</p>
              <cite>
                — {rec.from}
                <span>{rec.org}{rec.relation ? ` · ${rec.relation}` : ''}</span>
              </cite>
            </blockquote>
          ))}
        </div>
      </div>

      {/* LANDING */}
      <section id="landing" className="sec-landing">
        <div className="landing-wash" aria-hidden="true" />
        <div
          className="landing-watermark"
          aria-hidden="true"
          style={{
            transform: `translate(-50%, calc(-50% + ${wmY}px)) scale(${wmScale})`,
            opacity: wmOpacity,
          }}
        >
          {(details['profile-short'] || 'ABHISHEK').toUpperCase()}
        </div>

        <div className="landing-figure" data-reveal="rise">
          <button type="button" className="landing-sound" onClick={toggleMute}>
            {introMuted ? <FaVolumeXmark /> : <FaVolumeHigh />}
            <span>{introMuted ? 'Unmute' : 'Mute'}</span>
          </button>
          <video
            ref={introRef}
            className="landing-video"
            autoPlay
            loop
            muted={introMuted}
            playsInline
            preload="auto"
            aria-label={`${details['profile-name']} introducing himself`}
          >
            <source src={introCutout} type="video/webm" />
            <source src={introFallback} type="video/mp4" />
          </video>
        </div>

        <div className="landing-copy" data-reveal="slide-left">
          <p className="landing-eyebrow">{details['profile-name']}</p>
          <h1>{details['profile-role']}.</h1>
          <p className="landing-focus">{details['profile-focus']}</p>
        </div>

        <div className="landing-cta" data-reveal="slide-right">
          <button type="button" className="btn-ink" onClick={() => go('work')}>
            Explore work <FaArrowRight />
          </button>
          <div className="landing-cta-row">
            <button type="button" className="btn-ghost" onClick={() => go('reach')}>Let&rsquo;s talk</button>
            <button type="button" className="btn-ghost" onClick={openResume}>Resume</button>
          </div>
        </div>
      </section>

      {/* ABOUT — short copy left, icard right */}
      <section id="about" className="sec-pad sec-about">
        <div className="shell about-layout">
          <p className="sec-label" data-reveal="fade">01 — About</p>

          <div className="about-hero" data-reveal="rise">
            <div className="about-copy">
              <p className="about-greeting">{details['about-greeting']}</p>
              <h2>{details['about-headline']}</h2>
              {(details['about-story'] || []).map((para) => (
                <p key={para.slice(0, 28)} className="about-story">{para}</p>
              ))}
              <div className="about-actions">
                <button type="button" className="btn-ink" onClick={openResume}>Résumé</button>
                <a className="btn-ghost" href={details.socials.github} target="_blank" rel="noopener noreferrer">
                  GitHub <FaArrowUpRightFromSquare />
                </a>
                <a className="btn-ghost" href={details.socials.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <FaArrowUpRightFromSquare />
                </a>
              </div>

              <aside className="facts">
                {(details.facts || []).map((f) => (
                  <div key={f.label} className="fact">
                    <span>{f.label}</span>
                    <strong>{f.value}</strong>
                  </div>
                ))}
              </aside>
            </div>

            <div className="badge-stage">
              <div className="badge-orgs" aria-label="Organizations">
                {(details.badge.orgs || []).map((org, i) => {
                  const src = orgLogo(
                    theme === 'dark' && org.logoDark ? org.logoDark : org.logo
                  );
                  return (
                    <a
                      key={org.name}
                      className={`badge-org badge-org--${i}`}
                      href={org.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={org.label}
                    >
                      {src ? <img src={src} alt="" /> : <span>{org.name.slice(0, 2)}</span>}
                      <em>{org.label}</em>
                    </a>
                  );
                })}
              </div>

              <button
                type="button"
                className={`badge-flip${badgeFlipped ? ' is-flipped' : ''}`}
                onClick={() => setBadgeFlipped((v) => !v)}
                aria-pressed={badgeFlipped}
                aria-label={badgeFlipped ? 'Show badge front' : 'Flip badge'}
              >
                <div className="badge-flip-inner">
                  {/* FRONT face — lanyard + card flip together */}
                  <div className="badge-face badge-face--front">
                    <div className="lanyard" aria-hidden="true">
                      <span className="lanyard-strap" />
                      <span className="lanyard-block" />
                      <span className="lanyard-loop" />
                    </div>
                    <div className="id-badge">
                      <div className="id-badge-slot" aria-hidden="true" />
                      <div className="id-badge-glow" aria-hidden="true" />
                      <div className="id-badge-top">
                        <BrandLogo className="brand-logo--badge" />
                        <div className="id-badge-titles">
                          <strong>{details.badge.title}</strong>
                          <small>{details.badge.subtitle}</small>
                        </div>
                        <span className="id-badge-chip">{details.badge.id}</span>
                      </div>
                      <div className="id-badge-photo">
                        <img src={photo} alt={details['profile-name']} />
                      </div>
                      <div className="id-badge-body">
                        <h3>{details['profile-name']}</h3>
                        <p className="id-role">{details.badge.role}</p>
                        <p className="id-loc">{details.badge.location}</p>
                        <div className="id-meta">
                          <span>{details.badge.major}</span>
                          <span>{details.badge.year}</span>
                        </div>
                        <p className="id-flip-hint">Click to flip</p>
                      </div>
                    </div>
                  </div>

                  {/* BACK face — matching lanyard */}
                  <div className="badge-face badge-face--back">
                    <div className="lanyard" aria-hidden="true">
                      <span className="lanyard-strap" />
                      <span className="lanyard-block" />
                      <span className="lanyard-loop" />
                    </div>
                    <div className="id-badge id-badge--back">
                      <div className="id-badge-slot" aria-hidden="true" />
                      <div className="id-badge-glow" aria-hidden="true" />
                      <div className="id-badge-top">
                        <BrandLogo className="brand-logo--badge" />
                        <div className="id-badge-titles">
                          <strong>IMPACT</strong>
                          <small>{details.badge.back?.headline}</small>
                        </div>
                      </div>
                      <div className="id-badge-back-body">
                        <div className="id-stats">
                          {(details.badge.back?.stats || []).map((s) => (
                            <div key={s.k} className="id-stat">
                              <strong>{s.k}</strong>
                              <span>{s.v}</span>
                            </div>
                          ))}
                        </div>
                        <p className="id-flip-hint">{details.badge.back?.note || 'Click to flip back'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="sec-pad sec-skills">
        <div className="shell">
          <p className="sec-label" data-reveal="fade">02 — Skills</p>
          <div className="skills-head" data-reveal="rise">
            <h2>Stack</h2>
            <div className="skill-filters">
              <button
                type="button"
                className={`skill-filter${!skillFamily ? ' is-active' : ''}`}
                onClick={() => setSkillFamily(null)}
              >
                All
              </button>
              {families.map((fam) => (
                <button
                  key={fam}
                  type="button"
                  className={`skill-filter${skillFamily === fam ? ' is-active' : ''}`}
                  onClick={() => setSkillFamily(fam)}
                >
                  {fam}
                </button>
              ))}
            </div>
          </div>

          <div className="skills-board" data-reveal="rise">
            <div className="skills-table">
              {skillFlat.map((item) => {
                const lit = !skillFamily || skillFamily === item.fam;
                const selected = activeSkill?.name === item.name && activeSkill?.fam === item.fam;
                const color = brandColorFor(item.name, theme);
                return (
                  <button
                    key={`${item.fam}-${item.name}`}
                    type="button"
                    className={`skill-tile${lit ? ' is-lit' : ' is-dim'}${selected ? ' is-selected' : ''}`}
                    style={{ '--skill-brand': color }}
                    onMouseEnter={() => setActiveSkill(item)}
                    onFocus={() => setActiveSkill(item)}
                    onClick={() => {
                      setActiveSkill(item);
                      setSkillFamily(item.fam);
                    }}
                  >
                    <span className="skill-num">{item.num}</span>
                    <span className="skill-abbr" style={{ color: selected ? undefined : color }}>
                      {abbrevOf(item.name)}
                    </span>
                    <span className="skill-name">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div
              className="skill-logo-panel"
              style={logoColor ? { '--skill-brand': logoColor } : undefined}
            >
              {ActiveIcon ? (
                <>
                  <div
                    className="skill-logo-block"
                    key={activeSkill.name}
                    style={{ color: logoColor }}
                  >
                    {React.createElement(ActiveIcon)}
                  </div>
                  <p className="skill-logo-name">{activeSkill.name}</p>
                  <p className="skill-logo-family">{activeSkill.fam}</p>
                </>
              ) : (
                <p className="skill-logo-hint">Pick a skill</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* WORK — cinema stage for wide imagery */}
      <section id="work" className="sec-pad sec-work">
        <div className="shell">
          <p className="sec-label" data-reveal="fade">03 — Work</p>
          <div className="work-head" data-reveal="rise">
            <h2>Things I&rsquo;ve built.</h2>
            <p className="work-count">{projects.length} chapters</p>
          </div>

          <div className="cinema" data-reveal="rise">
            <div className="cinema-stage" key={activeProject?.name}>
              {mediaSrc ? (
                mediaIsVideo ? (
                  <video className="cinema-media" src={mediaSrc} autoPlay loop muted playsInline />
                ) : (
                  <img className="cinema-media" src={mediaSrc} alt={activeProject?.name} />
                )
              ) : (
                <div className="cinema-empty">
                  <strong>{activeProject?.metric?.value || 'DE'}</strong>
                  <span>{activeProject?.metric?.label || 'Featured'}</span>
                </div>
              )}

              <div className="cinema-caption">
                <div className="cinema-caption-top">
                  <p className="work-cat">
                    {String(projectIdx + 1).padStart(2, '0')} · {activeProject?.category}
                  </p>
                  {activeProject?.metric && (
                    <div className="work-metric">
                      <strong>{activeProject.metric.value}</strong>
                      <span>{activeProject.metric.label}</span>
                    </div>
                  )}
                </div>
                <h3>{activeProject?.name}</h3>
                <p className="work-blurb">{activeProject?.blurb}</p>
                <ul className="cinema-features">
                  {(activeProject?.features || []).slice(0, 4).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="work-tags">
                  {(activeProject?.skills || []).map((s) => <span key={s}>{s}</span>)}
                  {activeProject?.github && (
                    <a href={activeProject.github} target="_blank" rel="noopener noreferrer">
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {(Array.isArray(activeProject?.link)
                    ? activeProject.link
                    : activeProject?.link
                      ? [activeProject.link]
                      : []
                  ).map((href, li) => {
                    const resolved = resolveMedia(href) || href;
                    const isPdf = /\.pdf(\?|#|$)/i.test(href);
                    const label = isPdf
                      ? (li === 0 ? 'Research paper' : `Paper ${li + 1}`)
                      : (li === 0 ? 'Read more' : `Link ${li + 1}`);
                    return (
                      <a key={href} href={resolved} target="_blank" rel="noopener noreferrer">
                        {label} <FaArrowUpRightFromSquare />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="cinema-strip-wrap">
              <button
                type="button"
                className="cinema-nav"
                onClick={stripPrev}
                disabled={stripStart <= 0}
                aria-label="Previous projects"
              >
                <FaArrowLeft />
              </button>

              <div className="cinema-strip" role="tablist" aria-label="Projects">
                {stripProjects.map((p, localIdx) => {
                  const i = stripStart + localIdx;
                  const thumb = resolveMedia(p.image);
                  const thumbVid = /\.(mov|mp4|webm)$/i.test(p.image || '');
                  return (
                    <button
                      key={p.name}
                      type="button"
                      role="tab"
                      aria-selected={i === projectIdx}
                      className={`cinema-thumb${i === projectIdx ? ' is-active' : ''}`}
                      onClick={() => selectProject(i)}
                    >
                      <span className="cinema-thumb-media">
                        {thumb ? (
                          thumbVid ? (
                            <video src={thumb} muted playsInline preload="metadata" />
                          ) : (
                            <img src={thumb} alt="" />
                          )
                        ) : (
                          <span className="cinema-thumb-fallback">{String(i + 1).padStart(2, '0')}</span>
                        )}
                      </span>
                      <span className="cinema-thumb-meta">
                        <em>{p.name}</em>
                        <small>{p.metric?.value || p.category}</small>
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="cinema-nav"
                onClick={stripNext}
                disabled={stripStart + STRIP_VISIBLE >= projects.length}
                aria-label="Next projects"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE — centered lineage, alternating role badges */}
      <section id="experience" className="sec-experience" ref={expTrackRef}>
        <div className="exp-sticky">
          <div className="shell">
            <p className="sec-label">04 — Experience</p>
            <div className="exp-head">
              <h2>Journey so far.</h2>
            </div>

            <div className="exp-lineage">
              <div className="exp-spine" aria-hidden="true">
                <div className="exp-spine-fill" style={{ height: `${expProgress * 100}%` }} />
              </div>

              {roleNodes.map((node, idx) => {
                const n = roleNodes.length || 1;
                const start = idx / n;
                const end = (idx + 1) / n;
                const local = Math.min(1, Math.max(0, (expProgress - start) / Math.max(0.001, end - start)));
                const lit = expProgress >= start + 0.015;
                const side = idx % 2 === 0 ? 'left' : 'right';
                return (
                  <article
                    key={`${node.org}-${node.title}-${node.years}`}
                    className={`exp-badge exp-badge--${side}${lit ? ' is-lit' : ''}`}
                    style={{
                      opacity: 0.18 + local * 0.82,
                      transform: `translateY(${(1 - local) * 48}px)`,
                    }}
                  >
                    <div className="exp-badge-dot" />
                    <div className="exp-badge-card">
                      <a className="exp-org" href={node.link} target="_blank" rel="noopener noreferrer">
                        {node.org}
                      </a>
                      <strong className="exp-title">{node.title}</strong>
                      <span className="exp-years">{node.years}</span>
                      <p className="exp-note">{node.note}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="exp-cta">
              <div>
                <h3>Your data team?</h3>
                <p>{details['hiring-line']}</p>
              </div>
              <button type="button" className="btn-light" onClick={() => go('reach')}>
                Let&rsquo;s talk <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROUD */}
      <section id="proud" className="sec-pad sec-proud">
        <div className="shell">
          <p className="sec-label" data-reveal="fade">05 — Achievements</p>
          <h2 data-reveal="rise">Proud moments.</h2>
          <div className="proud-grid">
            {(details.proud || []).map((p, i) => (
              <article
                key={p.label}
                className="proud-card"
                data-reveal="rise"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{p.metric}</strong>
                <p>{p.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REACH */}
      <section id="reach" className="sec-pad sec-reach">
        <div className="shell">
          <p className="sec-label" data-reveal="fade">06 — Contact</p>
          <h2 className="reach-line" data-reveal="rise">{details['closing-line']}</h2>
          <div className="reach-actions" data-reveal="rise">
            <button type="button" className="btn-ink" onClick={openEmail}>
              Email me <FaArrowRight />
            </button>
            <button type="button" className="btn-ghost" onClick={openResume}>Resume</button>
            <a className="btn-ghost" href={details.socials.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin /> LinkedIn
            </a>
            <a className="btn-ghost" href={details.socials.github} target="_blank" rel="noopener noreferrer">
              <FaGithub /> GitHub
            </a>
          </div>

          <form className="reach-form" onSubmit={handleContact} data-reveal="rise">
            <input className="hp" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="reach-fields">
              <input name="name" placeholder="Name" required autoComplete="name" />
              <input name="email" type="email" placeholder="Email" required autoComplete="email" />
            </div>
            <textarea name="message" placeholder="A short note…" required rows={4} />
            <button type="submit" className="btn-ink" disabled={contactStatus === 'sending'}>
              {contactStatus === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {contactStatus === 'success' && <p className="reach-ok">Sent — I&rsquo;ll reply soon.</p>}
            {contactStatus === 'error' && <p className="reach-err">{contactError}</p>}
          </form>
        </div>
      </section>

      <footer className="folio-foot">
        <div className="shell foot-row">
          <a href="https://github.com/agrawalabr/portfolio" target="_blank" rel="noopener noreferrer">
            Designed &amp; built by Abhishek Agrawal
          </a>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
