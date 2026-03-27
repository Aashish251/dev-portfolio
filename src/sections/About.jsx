import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AboutScene from '../scenes/AboutScene';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  useEffect(() => {
    gsap.fromTo(
      '.about-vis',
      { x: -40, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#about', start: 'top 78%', once: true },
      }
    );

    gsap.fromTo(
      '.about-text .sec-tag, .about-text .sec-h2, .about-text .about-p, .about-highlights, .chips',
      { y: 28, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#about', start: 'top 76%', once: true },
      }
    );
  }, []);

  return (
    <section id="about">
      <div className="about-inner">
        <div className="about-vis">
          <div className="a-canvas-wrap float-a">
            <AboutScene />
          </div>
          <div className="a-float">
            <div className="af-lbl">Experience</div>
            <div className="af-val">2+</div>
            <div className="af-sub">Years at HCLTech</div>
          </div>
        </div>
        <div className="about-text">
          <div className="sec-tag">About Me</div>
          <h2 className="sec-h2">
            Engineering platforms that <em>perform</em>, adapt, and last
          </h2>
          <p className="about-p">
            B.Tech in Electronics &amp; Communication from MNIT Jaipur (2019-2023). Currently
            Software Engineer at HCLTech, architecting distributed systems for global enterprise
            clients in manufacturing &amp; healthcare. Passionate about clean architecture, reactive
            programming, and the intersection of backend and AI.
          </p>
          <div className="about-highlights">
            <div className="about-point">
              <span className="about-point-kicker">Core Focus</span>
              <p>Designing resilient backend systems with event-driven flows, strong observability, and cloud-native deployment.</p>
            </div>
            <div className="about-point">
              <span className="about-point-kicker">What I Build</span>
              <p>High-throughput APIs, microservices, automation pipelines, and AI-assisted products that solve real business problems.</p>
            </div>
            <div className="about-point">
              <span className="about-point-kicker">How I Work</span>
              <p>Clean architecture, pragmatic iteration, and performance-first thinking with a strong bias toward maintainability.</p>
            </div>
            <div className="about-point">
              <span className="about-point-kicker">Edge</span>
              <p>Comfortable moving between Java backend engineering, cloud infrastructure, and modern frontend integration when the product needs it.</p>
            </div>
          </div>
          <div className="chips">
            <span className="chip ch-c">Spring Boot</span>
            <span className="chip ch-i">AWS EKS</span>
            <span className="chip ch-p">LangChain</span>
            <span className="chip ch-c">Apache Kafka</span>
            <span className="chip ch-i">Kubernetes</span>
            <span className="chip ch-p">React.js</span>
            <span className="chip ch-c">WebFlux</span>
            <span className="chip ch-i">Docker</span>
            <span className="chip ch-p">RAG Systems</span>
          </div>
        </div>
      </div>
    </section>
  );
}
