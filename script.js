const branches = {
  data: { index: '01 / DATA & SYSTEMS', title: 'Make information dependable.', copy: 'Enterprise data work sits underneath everything else: definitions, quality rules, lineage, reporting logic and the quiet discipline of checking what is true.', link: 'projects/' },
  ai: { index: '02 / AI WORKFLOWS', title: 'Automate with judgement.', copy: 'The interesting question is not what an agent can do. It is where an agent should stop, ask for evidence, or hand the decision back to a human.', link: 'about/' },
  build: { index: '03 / BUILD', title: 'Turn problems into evidence.', copy: 'Small, reproducible systems are a way to make learning visible. Each project starts with a real problem and ends with a clear boundary around what was proven.', link: 'projects/' },
  learn: { index: '04 / LEARN', title: 'Keep the system growing.', copy: 'Learning is treated as an operating loop: understand the mechanism, test the assumption, connect it to real work, then keep only what changes behaviour.', link: 'notes/' },
  think: { index: '05 / THINK', title: 'Name the real problem.', copy: 'Before choosing a tool, I try to find the hidden decision, the missing definition, and the unknown that genuinely needs to be resolved now.', link: 'notes/' },
  life: { index: '06 / LONG GAME', title: 'Build a life with room.', copy: 'A stable foundation is not the opposite of ambition. It creates the time and attention needed for independent experiments, deeper work and long-term compounding.', link: 'about/' }
};

const index = document.querySelector('#panel-index');
const title = document.querySelector('#panel-title');
const copy = document.querySelector('#panel-copy');
const link = document.querySelector('#panel-link');
document.querySelectorAll('[data-branch]').forEach((node) => {
  const activate = () => {
    const branch = branches[node.dataset.branch];
    index.textContent = branch.index;
    title.textContent = branch.title;
    copy.textContent = branch.copy;
    link.href = branch.link;
    link.firstChild.textContent = node.dataset.branch === 'build' ? 'View evidence ' : 'Open branch ';
    document.querySelector('#branch-panel').scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  node.addEventListener('click', activate);
  node.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); } });
});

const scene = document.querySelector('.scene');
scene.addEventListener('pointermove', (event) => {
  const rect = scene.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  document.querySelector('.portrait-shell').style.transform = `translate(-50%, -50%) rotateY(${x * 18 - 12}deg) rotateX(${y * -10}deg)`;
});
