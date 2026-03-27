import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  useEffect(() => {
    gsap.fromTo(
      '.t-entry',
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.85,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#experience', start: 'top 78%', once: true },
      }
    );
  }, []);

  return (
    <section id="experience">
      <div className="exp-wrap">
        <div className="sec-tag">Work History</div>
        <h2 className="sec-h2-lg">Experience</h2>
        <div className="timeline">
          <div className="t-entry">
            <div className="t-meta">
              <span className="t-co">HCLTech</span>
              <span className="t-badge">Software Engineer</span>
              <span className="t-period">Oct 2023 - Present · 2+ yrs · Mumbai</span>
            </div>
            <div className="t-client">Client: Danfoss - Manufacturing Execution Systems</div>
            <ul className="t-buls">
              <li>
                Architected high-throughput <strong>RESTful APIs for MES-SAP ERP synchronisation</strong>,
                automating workflows via Generic Tables, Smart Tables and Lookup Tables while
                improving real-time production visibility across factory floors.
              </li>
              <li>
                Eliminated recursive processing in work-order APIs using an iterative <strong>BFS algorithm</strong>,
                achieving an <strong>80% reduction in API latency</strong> and improving throughput under peak load.
              </li>
            </ul>
          </div>

          <div className="t-entry">
            <div className="t-meta">
              <span className="t-co">HCLTech</span>
              <span className="t-badge cloud">Cloud Engineer</span>
              <span className="t-period">Oct 2023 - Present</span>
            </div>
            <div className="t-client plum">Client: Solventum - Healthcare Technology</div>
            <ul className="t-buls">
              <li>
                Maintained data consistency across distributed systems during live migrations with
                <strong> zero critical downtime</strong>, supporting uninterrupted healthcare operations.
              </li>
              <li>
                Deployed containerised microservices on <strong>AWS EKS</strong> using Docker and
                Kubernetes, enabling auto-scaling and high availability for production workloads.
              </li>
              <li>
                Built CI/CD pipelines plus CloudWatch and Prometheus monitoring, boosting release
                frequency by <strong>25%</strong> and reducing mean time to detect issues.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
