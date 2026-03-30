import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experienceCards = [
  {
    tone: 'gold',
    eyebrow: 'HCLTech / Software Engineer',
    title: 'Danfoss',
    subtitle: 'Manufacturing execution systems and ERP synchronization',
    copy: [
      'Architected high-throughput REST APIs for MES and SAP ERP synchronization across production workflows.',
      'Reworked recursive work-order processing into an iterative BFS path, delivering an 80% reduction in latency under peak load.',
    ],
    badge: '80% reduction in latency',
  },
  {
    tone: 'violet',
    eyebrow: 'HCLTech / Cloud Delivery',
    title: 'Solventum',
    subtitle: 'Healthcare technology migrations and platform reliability',
    copy: [
      'Maintained data consistency through live migration windows with zero critical downtime for operational workloads.',
      'Deployed containerized services on AWS EKS with Kubernetes-driven scaling, stronger resilience, and cleaner rollout control.',
    ],
    badge: 'AWS EKS deployment',
  },
  {
    tone: 'ivory',
    eyebrow: 'HCLTech / Platform Mindset',
    title: 'Operating Style',
    subtitle: 'The way I approach enterprise engineering work',
    copy: [
      'Production-minded design, observability, and cloud architecture decisions that stay readable for teams.',
      'A strong bias toward reliable APIs, scalable services, and delivery systems that support product velocity.',
    ],
    badge: 'Backend + cloud + product clarity',
  },
];

export default function Experience() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      gsap.from('.exp-card', {
        y: 28,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 76%',
          once: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef}>
      <div className="section-heading">
        <div className="sec-tag">Experience</div>
        <h2 className="section-title">Pinned like a deck, because each role builds on the last.</h2>
        <p className="section-copy">
          Enterprise engineering across manufacturing and healthcare, with a focus on throughput,
          migration safety, and cloud-ready delivery.
        </p>
      </div>

      <div className="exp-stage">
        <div className="exp-stack">
          {experienceCards.map((card) => (
            <article className={`exp-card exp-card-${card.tone}`} key={card.title}>
              <div className="exp-card-top">
                <div>
                  <div className="exp-eyebrow">{card.eyebrow}</div>
                  <h3>{card.title}</h3>
                  <p className="exp-subtitle">{card.subtitle}</p>
                </div>
                <div className="exp-badge">{card.badge}</div>
              </div>
              <div className="exp-copy">
                {card.copy.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
