import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import About from '../sections/About';
import Experience from '../sections/Experience';
import HeroScene from '../scenes/HeroScene';
import SkillsScene from '../scenes/SkillsScene';
import NeonCityScene from '../scenes/NeonCityScene';
import NetworkScene from '../scenes/NetworkScene';

gsap.registerPlugin(ScrollTrigger);

const marqueeItems = [
  { label: 'Java', highlight: true },
  { label: 'Spring Boot', highlight: false },
  { label: 'Kafka', highlight: true },
  { label: 'AWS EKS', highlight: false },
  { label: 'LangChain', highlight: true },
  { label: 'Docker', highlight: false },
  { label: 'Kubernetes', highlight: true },
  { label: 'React.js', highlight: false },
  { label: 'PostgreSQL', highlight: true },
  { label: 'Node.js', highlight: false },
  { label: 'WebFlux', highlight: false },
  { label: 'TypeScript', highlight: true },
];

const skillGroups = [
  { title: 'Languages', className: 'c1', items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C#'] },
  { title: 'Backend & Streaming', className: 'c2', items: ['Spring Boot', 'WebFlux', 'Node.js', 'Express.js', 'Apache Kafka'] },
  { title: 'Cloud & DevOps', className: 'c3', items: ['AWS EKS', 'Lambda', 'Docker', 'Kubernetes', 'Prometheus'] },
  { title: 'Databases', className: 'c4', items: ['MySQL', 'PostgreSQL', 'MongoDB', 'ChromaDB', 'Pinecone'] },
  { title: 'AI / GenAI', className: 'c5', items: ['LangChain', 'RAG', 'LLM APIs', 'Prompt Eng.'] },
];

const projectCards = [
  {
    id: 'proj1',
    tags: ['Java 17', 'Spring Boot', 'WebFlux', 'Kafka', 'Docker'],
    title: 'E-Commerce Microservices',
    description:
      'Production-grade reactive microservices platform. Event-driven architecture via Kafka for decoupled order, inventory and payment services. Zero-downtime schema migrations with Liquibase plus Hibernate/JPA.',
    visual: <NeonCityScene />,
  },
  {
    id: 'proj2',
    tags: ['Node.js', 'React.js', 'TypeScript', 'MySQL', 'JWT'],
    title: 'Medical Management System',
    description:
      'Full-stack platform for Sant Nirankari Mission, digitising scheduling and rostering for 500+ staff. Enterprise JWT auth, RBAC, bcrypt hashing, Docker deployment, and Swagger docs.',
    visual: <NetworkScene />,
  },
];

function Home({ animateIntro }) {
  const heroRef = useRef(null);
  const marqueeRef = useRef(null);
  const ach1Ref = useRef(null);
  const ach2Ref = useRef(null);
  const ach3Ref = useRef(null);

  useEffect(() => {
    if (!animateIntro || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('#main-nav', {
        y: -30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.1,
      });

      gsap.from(['#hl1', '#hl2', '#hl3'], {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.2,
      });

      gsap.from(['.hero-tag', '.hero-p', '.hero-btns'], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1,
        delay: 0.55,
      });
    }, heroRef);

    return () => ctx.revert();
  }, [animateIntro]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.s3d-wrap', '.s3d-hint'],
        { x: -30, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#skills', start: 'top 78%', once: true },
        }
      );

      gsap.fromTo(
        '.sk-row',
        { x: 24, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '#skills', start: 'top 76%', once: true },
        }
      );

      gsap.fromTo(
        '.proj-card',
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#projects', start: 'top 78%', once: true },
        }
      );

      gsap.fromTo(
        '.ach-card',
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: '#achievements', start: 'top 78%', once: true },
        }
      );

      gsap.fromTo(
        '.pub-blk',
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: '#achievements', start: 'top 68%', once: true },
        }
      );

      gsap.fromTo(
        ['.ct-ey', '.ct-h2', '.ct-links'],
        { y: 32, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#contact', start: 'top 78%', once: true },
        }
      );

      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: 'none',
          duration: 28,
          repeat: -1,
        });
      }

      ScrollTrigger.create({
        trigger: '.ach-grid',
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const counters = [
            { ref: ach1Ref, value: 500 },
            { ref: ach2Ref, value: 1148 },
            { ref: ach3Ref, value: 156 },
          ];

          counters.forEach(({ ref, value }) => {
            if (!ref.current) return;
            gsap.fromTo(
              { n: 0 },
              {
                n: value,
                duration: 1.5,
                ease: 'power2.out',
                onUpdate() {
                  ref.current.textContent = Math.floor(this.targets()[0].n);
                },
              }
            );
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const smoothScroll = (event, id) => {
    event.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const marqueeLoop = [...marqueeItems, ...marqueeItems];

  return (
    <>
      <section id="hero" ref={heroRef}>
        <div className="orb o1"></div>
        <div className="orb o2"></div>
        <div className="orb o3"></div>

        <div className="hero-left">
          <div className="hero-tag">Mumbai, India · HCLTech · 2+ Yrs</div>
          <h1 className="hero-h1">
            <span className="ln">
              <span id="hl1">Software</span>
            </span>
            <span className="ln">
              <span id="hl2">
                <em>Engineer</em>
              </span>
            </span>
            <span className="ln">
              <span id="hl3">&amp; Builder</span>
            </span>
          </h1>
          <p className="hero-p">
            Backend systems architect building high-throughput APIs, reactive microservices and
            cloud-native platforms that scale across global enterprise clients.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn-p" onClick={(event) => smoothScroll(event, '#projects')}>
              View Work
            </a>
            <a href="#contact" className="btn-o" onClick={(event) => smoothScroll(event, '#contact')}>
              Get In Touch
            </a>
          </div>
        </div>

        <div className="hero-right">
          <HeroScene />
          <div className="hero-badge">
            <div className="badge-pulse"></div>
            <div>
              <div className="badge-t">Open to Opportunities</div>
              <div className="badge-s">Backend · Cloud · GenAI</div>
            </div>
          </div>
          <div className="hero-scroll-hint">Scroll</div>
        </div>
      </section>

      <About />
      <Experience />

      <section id="skills">
        <div className="skills-inner">
          <div className="sec-tag">Technical Arsenal</div>
          <h2 className="sec-h2-lg">Skills</h2>
          <div className="skills-top">
            <div className="s3d-wrap">
              <SkillsScene />
              <div className="s3d-hint">Hover to interact · 3D visualization</div>
            </div>

            <div className="skill-rows">
              {skillGroups.map((group) => (
                <div className="sk-row" key={group.title}>
                  <div className={`sk-cat ${group.className}`}>{group.title}</div>
                  <div className="sk-pills">
                    {group.items.map((item) => (
                      <span className="sk-pill" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mq-track">
            <div className="mq-inner" ref={marqueeRef}>
              {marqueeLoop.map((item, index) => (
                <div className="mq-item" key={`${item.label}-${index}`}>
                  <span className={`mq-w ${item.highlight ? 'hi' : ''}`}>{item.label}</span>
                  <span className="mq-sep">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="container-wide">
          <div className="sec-tag">Selected Work</div>
          <h2 className="sec-h2-lg">Projects</h2>
          <div className="proj-grid">
            {projectCards.map((project) => (
              <article className="proj-card" id={project.id} key={project.id}>
                <div className="proj-vis">
                  {project.visual}
                  <div className="proj-overlay"></div>
                </div>
                <div className="proj-arr">↗</div>
                <div className="proj-body">
                  <div className="proj-tags">
                    {project.tags.map((tag) => (
                      <span className="ptag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="proj-name">{project.title}</div>
                  <p className="proj-desc">{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="achievements">
        <div className="container-wide">
          <div className="sec-tag">Recognition</div>
          <h2 className="sec-h2-lg">Milestones</h2>
          <div className="ach-grid">
            <div className="ach-card">
              <div className="ach-num">
                <span ref={ach1Ref}>500</span>+
              </div>
              <p className="ach-desc">
                <strong>Problems solved</strong> on LeetCode, GFG and InterviewBit through sustained
                competitive programming practice.
              </p>
            </div>
            <div className="ach-card">
              <div className="ach-num">
                <span ref={ach2Ref}>1148</span>
                <sup>th</sup>
              </div>
              <p className="ach-desc">
                <strong>Rank among 90,000+</strong> participants in the Innovate India Coding
                Championship.
              </p>
            </div>
            <div className="ach-card">
              <div className="ach-num">
                <span ref={ach3Ref}>156</span>
                <sup>th</sup>
              </div>
              <p className="ach-desc">
                <strong>Rank in Code KBC</strong> across 50 Indian colleges.
              </p>
            </div>
          </div>

          <div className="pub-blk">
            <div className="pub-ico">P</div>
            <div>
              <div className="pub-lbl">IEEE Publication · ICCCNT 2023</div>
              <p className="pub-txt">
                K. Chhabra, A. Gupta, Y. C. Adsule, <strong>A. G. Ravidas</strong>, S. J. Nanda.
                <em> Multi-objective Image Segmentation using SMS-EMOA for Side Scan Sonar Data Analysis.</em>
                {' '}14th ICCCNT 2023, IEEE, pp. 1-7.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="orb ct-orb1"></div>
        <div className="orb ct-orb2"></div>
        <div className="contact-center">
          <div className="ct-ey">Available for new roles</div>
          <h2 className="ct-h2">
            Let&apos;s build
            <br />
            <em>together.</em>
          </h2>
          <div className="ct-links">
            <a className="ct-link em" href="mailto:ashishravidas25@gmail.com">
              ✉ ashishravidas25@gmail.com
            </a>
            <a className="ct-link gh" href="https://github.com/Aashish251" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="ct-link li" href="https://linkedin.com/in/aashishravidas" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <footer>
        <span className="fc">© 2024 Aashish Ravidas</span>
        <span className="fc">Mumbai · MNIT Jaipur · HCLTech</span>
      </footer>
    </>
  );
}

export default Home;
