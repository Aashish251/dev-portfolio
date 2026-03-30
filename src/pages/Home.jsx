import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import About from '../sections/About';
import Experience from '../sections/Experience';
import HeroScene from '../scenes/HeroScene';
import SkillsScene from '../scenes/SkillsScene';
import NeonCityScene from '../scenes/NeonCityScene';
import NetworkScene from '../scenes/NetworkScene';

gsap.registerPlugin(ScrollTrigger, Observer);

const projectCards = [
  {
    index: '01',
    title: 'E-Commerce Microservices Platform',
    subtitle: 'Reactive commerce architecture for throughput, resilience, and scaling.',
    description:
      'A production-grade system built around Spring Boot, WebFlux, Kafka, and Docker with async order orchestration, inventory events, and payment isolation.',
    tags: ['Spring Boot', 'Kafka', 'WebFlux', 'Docker', 'PostgreSQL'],
    cursor: 'View',
    visual: <NeonCityScene />,
  },
  {
    index: '02',
    title: 'Medical Management System',
    subtitle: 'Operational tooling for healthcare scheduling and secure staff workflows.',
    description:
      'A full-stack platform with JWT auth, RBAC, Docker deployment, and Swagger-backed APIs for scheduling and rostering across 500+ staff members.',
    tags: ['Node.js', 'React', 'TypeScript', 'MySQL', 'JWT'],
    cursor: 'View',
    visual: <NetworkScene />,
  },
];

const stats = [
  { label: 'Production systems shipped', value: 2, suffix: '+', tone: 'gold' },
  { label: 'Latency reduction delivered', value: 80, suffix: '%', tone: 'violet' },
  { label: 'LeetCode and CP practice', value: 500, suffix: '+', tone: 'rose' },
  { label: 'Coding Championship rank', value: 1148, suffix: 'th', tone: 'mint' },
];

const skillCloud = [
  'Java',
  'Spring Boot',
  'Kafka',
  'AWS EKS',
  'Docker',
  'Kubernetes',
  'LangChain',
  'WebFlux',
  'PostgreSQL',
  'React',
];

function Home({ animateIntro }) {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const projectTrackRef = useRef(null);
  const counterRefs = useRef([]);
  counterRefs.current = [];

  useEffect(() => {
    if (!animateIntro || !pageRef.current) return;

    let observer;
    const ctx = gsap.context(() => {
      gsap.from('#main-nav', {
        y: -24,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out',
      });

      gsap.from(['.hero-kicker', '.hero-meta', '.hero-copy', '.hero-actions', '.hero-microcopy'], {
        y: 26,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.1,
      });

      gsap.from('.hero-name-line > span', {
        yPercent: 105,
        autoAlpha: 0,
        duration: 1.15,
        stagger: 0.12,
        ease: 'power4.out',
        delay: 0.15,
      });

      gsap.from(['.hero-note', '.hero-command-card', '.hero-scene-shell'], {
        y: 36,
        autoAlpha: 0,
        duration: 1.05,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
        .to('.hero-copy', { yPercent: 10, scale: 0.94, ease: 'none' }, 0)
        .to('.hero-name', { yPercent: 18, scale: 0.88, transformOrigin: 'left top', ease: 'none' }, 0)
        .to(['.hero-kicker', '.hero-meta', '.hero-microcopy', '.hero-copy-body', '.hero-actions'], {
          autoAlpha: 0.72,
          ease: 'none',
        }, 0)
        .to('.hero-scene-shell', { scale: 1.08, yPercent: -8, ease: 'none' }, 0)
        .to('.hero-command-card', { yPercent: -10, autoAlpha: 0.7, ease: 'none' }, 0)
        .to('.hero-note', { yPercent: 10, autoAlpha: 0.72, ease: 'none' }, 0);

      observer = Observer.create({
        target: heroRef.current,
        type: 'wheel,touch,pointer',
        tolerance: 8,
        onChange: ({ deltaX, deltaY }) => {
          gsap.to('.hero-scene-shell', {
            x: deltaX * 0.08,
            y: deltaY * 0.06,
            duration: 0.8,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        },
      });
    }, pageRef);

    return () => {
      observer?.kill();
      ctx.revert();
    };
  }, [animateIntro]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.section-heading > *', {
        y: 26,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.section-heading',
          start: 'top 82%',
          once: true,
        },
      });

      gsap.from('.about-panel, .skill-cloud-shell, .architecture-shell, .editorial-card, .contact-shell', {
        y: 34,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-panel',
          start: 'top 82%',
          once: true,
        },
      });

      gsap.from('.project-card', {
        y: 34,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 78%',
          once: true,
        },
      });

      if (projectTrackRef.current) {
        gsap.to(projectTrackRef.current, {
          xPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: '#projects',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      gsap.from('.arch-node', {
        scale: 0.86,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.14,
        ease: 'back.out(1.6)',
        scrollTrigger: {
          trigger: '#architecture',
          start: 'top 78%',
          once: true,
        },
      });

      gsap.from('.arch-flow-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.9,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#architecture',
          start: 'top 78%',
          once: true,
        },
      });

      gsap.from('.skill-orbit-pill', {
        y: 24,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.07,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 80%',
          once: true,
        },
      });

      gsap.from('.editorial-mask > span', {
        yPercent: 110,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '#publication',
          start: 'top 78%',
          once: true,
        },
      });

      ScrollTrigger.create({
        trigger: '#achievements',
        start: 'top 78%',
        once: true,
        onEnter: () => {
          stats.forEach((stat, index) => {
            const node = counterRefs.current[index];
            if (!node) return;

            gsap.fromTo(
              { value: 0 },
              {
                value: stat.value,
                duration: 1.6,
                ease: 'power2.out',
                onUpdate() {
                  node.textContent = Math.floor(this.targets()[0].value).toString();
                },
              }
            );
          });
        },
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const smoothScroll = (event, id) => {
    event.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const setCounterRef = (element) => {
    if (element && !counterRefs.current.includes(element)) {
      counterRefs.current.push(element);
    }
  };

  return (
    <div ref={pageRef}>
      <section id="hero" ref={heroRef}>
        <div className="hero-noise"></div>
        <div className="hero-copy">
          <div className="hero-kicker">Software Engineer / Backend / Cloud / GenAI</div>
          <div className="hero-meta">Mumbai, India / HCLTech / Spring Boot / AWS / AI Systems</div>
          <h1 className="hero-name">
            <span className="hero-name-line">
              <span>Aashish</span>
            </span>
            <span className="hero-name-line hero-name-line-accent">
              <span>Ravidas</span>
            </span>
          </h1>
          <p className="hero-microcopy">
            Building product-grade backend platforms with a cinematic frontend layer.
          </p>
          <p className="hero-copy-body">
            I design resilient Spring systems, cloud-native delivery pipelines, and GenAI-enabled
            experiences that make complex infrastructure feel premium, precise, and easy to trust.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary" onClick={(event) => smoothScroll(event, '#projects')}>
              Explore Projects
            </a>
            <a href="#contact" className="btn-secondary" onClick={(event) => smoothScroll(event, '#contact')}>
              Open Contact
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-note">
            <span className="hero-note-index">01</span>
            <p>
              Scroll to push the name into depth while the motion field expands like an intelligent
              cloud mesh coming online.
            </p>
          </div>

          <div className="hero-scene-shell">
            <HeroScene />
          </div>

          <div className="hero-command-card">
            <div className="hero-command-line">
              <span className="prompt">$</span>
              <span>status --focus backend cloud genai</span>
            </div>
            <div className="hero-command-result">
              <div className="status-dot"></div>
              <div>
                <strong>Available for high-impact engineering roles</strong>
                <span>Enterprise APIs / AWS delivery / intelligent systems</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-rail">
        <article className="rail-panel">
          <span>01</span>
          <h3>Backend Engine Room</h3>
          <p>Reactive services, event-driven integrations, and production-safe API design.</p>
        </article>
        <article className="rail-panel">
          <span>02</span>
          <h3>Cloud Delivery</h3>
          <p>Containers, Kubernetes, AWS EKS, observability, and deployment discipline.</p>
        </article>
        <article className="rail-panel">
          <span>03</span>
          <h3>Applied GenAI</h3>
          <p>LangChain and retrieval-driven systems grounded in product and performance constraints.</p>
        </article>
      </section>

      <About />
      <Experience />

      <section id="projects">
        <div className="section-heading">
          <div className="sec-tag">Selected Work</div>
          <h2 className="section-title">Projects staged like product stories.</h2>
          <p className="section-copy">
            Each project is framed as a system: architecture, technologies, delivery choices, and
            the visual clarity needed to communicate technical depth.
          </p>
        </div>

        <div className="projects-track-wrap">
          <div className="projects-track" ref={projectTrackRef}>
            {projectCards.map((project) => (
              <article
                className="project-card"
                key={project.title}
                data-cursor={project.cursor}
              >
                <div className="project-visual">
                  {project.visual}
                  <div className="project-overlay"></div>
                  <div className="project-chip">{project.index}</div>
                  <div className="project-tech-tip">
                    <span>Technologies</span>
                    <p>{project.tags.join(' / ')}</p>
                  </div>
                </div>
                <div className="project-body">
                  <div className="project-subtitle">{project.subtitle}</div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="architecture">
        <div className="section-heading">
          <div className="sec-tag">System Flow</div>
          <h2 className="section-title">A small architecture story inside the portfolio.</h2>
          <p className="section-copy">
            The visual language mirrors how I think about backend platforms: data moves clearly,
            responsibilities stay separated, and throughput remains observable.
          </p>
        </div>

        <div className="architecture-shell">
          <div className="architecture-grid">
            <div className="arch-node">
              <span className="arch-label">Client</span>
              <strong>User Interface</strong>
            </div>
            <div className="arch-flow-line"></div>
            <div className="arch-node">
              <span className="arch-label">Gateway</span>
              <strong>API Layer</strong>
            </div>
            <div className="arch-flow-line"></div>
            <div className="arch-node">
              <span className="arch-label">Services</span>
              <strong>Spring Boot + WebFlux</strong>
            </div>
            <div className="arch-flow-line"></div>
            <div className="arch-node arch-node-accent">
              <span className="arch-label">Streaming</span>
              <strong>Kafka Event Bus</strong>
            </div>
            <div className="arch-flow-line"></div>
            <div className="arch-node">
              <span className="arch-label">Delivery</span>
              <strong>AWS EKS + Observability</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="section-heading">
          <div className="sec-tag">Skills Cloud</div>
          <h2 className="section-title">A floating field instead of a static list.</h2>
          <p className="section-copy">
            My stack drifts across backend engineering, cloud infrastructure, and AI integration,
            with motion used to make the breadth feel structured rather than busy.
          </p>
        </div>

        <div className="skill-cloud-shell">
          <div className="skill-cloud-copy">
            <div className="about-panel">
              <span className="panel-kicker">Core Areas</span>
              <p>
                Java, Spring Boot, Kafka, Kubernetes, AWS EKS, Docker, LangChain, vector tooling,
                and the production patterns required to connect them well.
              </p>
            </div>
          </div>
          <div className="skill-scene-wrap">
            <SkillsScene />
            <div className="skill-orbit">
              {skillCloud.map((skill, index) => (
                <span
                  className={`skill-orbit-pill skill-orbit-pill-${(index % 5) + 1}`}
                  key={skill}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="achievements">
        <div className="section-heading">
          <div className="sec-tag">Recognition</div>
          <h2 className="section-title">Large numbers, backed by real work.</h2>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <article className={`stat-card stat-card-${stat.tone}`} key={stat.label}>
              <div className="stat-value">
                <span ref={setCounterRef}>0</span>
                {stat.suffix}
              </div>
              <p>{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="publication">
        <div className="editorial-card">
          <div className="editorial-meta">IEEE Publication / ICCCNT 2023</div>
          <h2 className="editorial-title">
            <span className="editorial-mask">
              <span>Multi-objective Image Segmentation</span>
            </span>
            <span className="editorial-mask">
              <span>using SMS-EMOA for Side Scan Sonar</span>
            </span>
            <span className="editorial-mask">
              <span>Data Analysis.</span>
            </span>
          </h2>
          <p className="editorial-copy">
            K. Chhabra, A. Gupta, Y. C. Adsule, <strong>A. G. Ravidas</strong>, S. J. Nanda.
            Published in the 14th ICCCNT 2023 proceedings, IEEE, pages 1-7.
          </p>
        </div>
      </section>

      <section id="contact">
        <div className="section-heading">
          <div className="sec-tag">Contact</div>
          <h2 className="section-title">A command-palette close, built for engineers.</h2>
        </div>

        <div className="contact-shell">
          <div className="command-bar">
            <span className="prompt">$</span>
            <span>open collaboration --mode backend-cloud-genai</span>
          </div>
          <div className="command-grid">
            <a className="command-link" href="mailto:ashishravidas25@gmail.com">
              <span className="command-key">01</span>
              <div>
                <strong>Email</strong>
                <p>ashishravidas25@gmail.com</p>
              </div>
            </a>
            <a
              className="command-link"
              href="https://github.com/Aashish251"
              target="_blank"
              rel="noreferrer"
            >
              <span className="command-key">02</span>
              <div>
                <strong>GitHub</strong>
                <p>github.com/Aashish251</p>
              </div>
            </a>
            <a
              className="command-link"
              href="https://linkedin.com/in/aashishravidas"
              target="_blank"
              rel="noreferrer"
            >
              <span className="command-key">03</span>
              <div>
                <strong>LinkedIn</strong>
                <p>linkedin.com/in/aashishravidas</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <footer>
        <span className="fc">Copyright 2026 Aashish Ravidas</span>
        <span className="fc">Backend / Cloud / GenAI / Mumbai</span>
      </footer>
    </div>
  );
}

export default Home;
