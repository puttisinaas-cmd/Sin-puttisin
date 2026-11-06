// Project context uses the existing portfolio copy and the photographer's selected images.
// Add commissioning credits and dates only after the photographer confirms them.
const portfolioAvailability = 'Available for assignments throughout Thailand and internationally.';
const projectStories = {
  0: {
    role: 'Photographer', client: '', year: '',
    context: [{label:'Venue',value:'Bangkok Kunsthalle'}],
    text: 'A performance by Tosh Basco, in conversation with Korakrit Arunanondchai at Bangkok Kunsthalle. The photographs follow the performer, the audience and the atmosphere of the space.'
  },
  1: {
    role: 'Photographer', client: '', year: '',
    context: [{label:'Location',value:'Khaoyai Art Forest, Thailand'}],
    text: 'Artworks and installation views at Khaoyai Art Forest. The series moves between individual works and the surrounding landscape.'
  },
  5: {
    role: 'Photographer', client: '', year: '',
    context: [{label:'Publication',value:'AD Spain'}],
    text: 'Architectural and cultural photography for AD Spain. A series of portraits, interiors and architectural details.'
  },
  2: {
    role: 'Photographer', client: '', year: '',
    context: [{label:'Subject',value:'People / Portraiture'}],
    text: 'A collection of portraits, from individual moments to people gathered together. Light and gesture connect the photographs.'
  },
  3: {
    role: 'Photographer', client: '', year: '',
    context: [{label:'Subject',value:'Art / Dining experience'}],
    text: 'An evening with Xie Fan, where dining becomes an event. Portraits, guests and details of the table follow the atmosphere of the evening.'
  }
};

if (portfolioAvailability) {
  document.querySelectorAll('.intro-location,.about-location').forEach(line => {
    line.textContent = portfolioAvailability;
    line.hidden = false;
  });
}

document.querySelectorAll('[data-story-project]').forEach(entry => {
  const projectIndex = Number(entry.dataset.storyProject);
  const story = projectStories[projectIndex];
  if (!story) return;
  const details = document.createElement('details');
  details.className = 'project-story';
  const summary = document.createElement('summary');
  summary.textContent = 'About the project';
  summary.setAttribute('aria-label',`About ${projects[projectIndex].title}`);
  const body = document.createElement('div');
  body.className = 'project-story-body';
  const facts = [
    {label:'Role',value:story.role},
    {label:'Client',value:story.client},
    {label:'Year',value:story.year},
    ...story.context
  ].filter(fact => fact.value);
  if (facts.length) {
    const list = document.createElement('dl');
    list.className = 'project-facts';
    facts.forEach(fact => {
      const group = document.createElement('div');
      const label = document.createElement('dt');
      label.textContent = fact.label;
      const value = document.createElement('dd');
      value.textContent = fact.value;
      group.append(label,value);
      list.append(group);
    });
    body.append(list);
  }
  const text = document.createElement('p');
  text.textContent = story.text;
  body.append(text);
  details.append(summary,body);
  entry.append(details);
  // Both gallery implementations read the same project description when opened.
  projects[projectIndex].description = story.text;
});
