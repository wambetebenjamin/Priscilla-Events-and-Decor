/**
 * The styling team.
 *
 * Six stylists and coordinators, matching the brief's four to six. Portraits are
 * real Pexels photography of East African professionals; credits are recorded in
 * image-credits.md. Names and specialisations are sample content, ready to be
 * replaced with the real team.
 */

export type TeamMember = {
  name: string;
  role: string;
  specialisation: string;
  favourite: string;
  /** Revealed on hover, in the member's own voice. */
  quote: string;
  image: string;
  imageAlt: string;
};

export const TEAM: TeamMember[] = [
  {
    name: 'Priscilla Wangari',
    role: 'Founder and Creative Director',
    specialisation: 'Full venue transformation and design direction',
    favourite: 'Garden weddings at golden hour',
    quote:
      'I still walk into every empty venue and sketch the room in my head before anything is unloaded.',
    image: '/images/team-1.jpg',
    imageAlt: 'Portrait of the founder in business dress, smiling',
  },
  {
    name: 'Amina Kilonzo',
    role: 'Lead Florist',
    specialisation: 'Statement installations and bridal work',
    favourite: 'A bridal bouquet that smells like a garden',
    quote:
      'If the bouquet is right, the bride stands differently. You can see it in the first photograph.',
    image: '/images/team-2.jpg',
    imageAlt: 'Portrait of the lead florist seated, arms crossed',
  },
  {
    name: 'Njeri Mwangi',
    role: 'Events Coordinator',
    specialisation: 'Run of show and on the day coordination',
    favourite: 'The quiet half hour before guests arrive',
    quote:
      'My favourite moment is when the room is finished and nobody has seen it yet. That is the whole job.',
    image: '/images/team-3.jpg',
    imageAlt: 'Close-up portrait of the events coordinator smiling',
  },
  {
    name: 'Brian Otieno',
    role: 'Head of Lighting and Build',
    specialisation: 'Lighting design, rigging and technical build',
    favourite: 'Uplighting a room that everyone thought was too dark',
    quote:
      'Give me a tired hall and four hours and I will give you a room people do not want to leave.',
    image: '/images/team-4.jpg',
    imageAlt: 'Portrait of the head of lighting in a suit',
  },
  {
    name: 'Kevin Mureithi',
    role: 'Corporate Accounts Lead',
    specialisation: 'Galas, launches and venue partnerships',
    favourite: 'A gala that runs exactly to the minute',
    quote:
      'Corporate clients do not want surprises. They want the stage ready before the first guest sits down.',
    image: '/images/team-5.jpg',
    imageAlt: 'Portrait of the corporate accounts lead in a tailored suit',
  },
  {
    name: 'Zawadi Achieng',
    role: 'Stylist and Table Designer',
    specialisation: 'Table composition, linen and tableware',
    favourite: 'A table setting photographed up close',
    quote:
      'Guests forget the ceiling. They never forget their own table, and that is where I work.',
    image: '/images/team-6.jpg',
    imageAlt: 'Portrait of the table designer in natural light',
  },
];
