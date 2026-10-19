import { TEAM } from '@/lib/team';
import Reveal from './Reveal';

/**
 * Meet the team.
 *
 * Six stylists and coordinators, each with a name, role, specialisation and
 * favourite kind of event. Hovering, or focusing inside the card with a keyboard,
 * reveals a short quote in their own voice.
 */
export default function TeamGrid() {
  return (
    <div className="team-grid">
      {TEAM.map((member, index) => (
        <Reveal key={member.name} delay={index * 70}>
          <article className="team-card" tabIndex={0} aria-label={`${member.name}, ${member.role}`}>
            <div className="team-media">
              <img
                src={member.image}
                alt={member.imageAlt}
                width={1400}
                height={1750}
                loading="lazy"
                decoding="async"
              />
              <blockquote className="team-quote">
                <i className="bi bi-quote" aria-hidden="true" /> {member.quote}
              </blockquote>
            </div>

            <div className="team-body">
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <ul className="team-facts">
                <li>
                  <strong>Specialisation</strong>
                  {member.specialisation}
                </li>
                <li>
                  <strong>Favourite event</strong>
                  {member.favourite}
                </li>
              </ul>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
