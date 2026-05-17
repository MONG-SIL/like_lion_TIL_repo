const CLUB_NAME = '멋쟁이 사자처럼';

export function normalizeText(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

export function parseSkills(skillsText) {
  return String(skillsText)
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function normalizeWebsite(url) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export function picsumUrl(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/240/240`;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function prepareInitialLions(initialLions) {
  const now = Date.now();
  return initialLions.map((lion, index) => ({
    ...lion,
    createdAt: now - (initialLions.length - index) * 1000,
  }));
}

export function getVisibleLions(lions, { part, sortBy, searchName }) {
  let list = [...lions];

  if (part !== 'all') {
    list = list.filter((l) => l.part === part);
  }

  const q = normalizeText(searchName).toLowerCase();
  if (q) {
    list = list.filter((l) => normalizeText(l.name).toLowerCase().includes(q));
  }

  if (sortBy === 'name') {
    list.sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name), 'ko'));
  } else {
    list.sort((a, b) => b.createdAt - a.createdAt);
  }

  return list;
}

export function lionFromApiUser(user) {
  const first = normalizeText(user?.name?.first);
  const last = normalizeText(user?.name?.last);
  const name =
    normalizeText(`${first} ${last}`) || `아기 사자 ${Math.floor(Math.random() * 1000)}`;

  const part = randomPick(['Frontend', 'Backend', 'Design']);

  const skillBank = {
    Frontend: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Next.js', 'Accessibility'],
    Backend: ['Node.js', 'PostgreSQL', 'Redis', 'REST API', 'Docker', 'Testing'],
    Design: ['Figma', 'Design System', 'UX Writing', 'Prototyping', 'Motion', 'Typography'],
  };

  const skills = [
    ...new Set([
      randomPick(skillBank[part]),
      randomPick(skillBank[part]),
      randomPick(skillBank[part]),
    ]),
  ];

  const taglineBank = {
    Frontend: '사용자 흐름이 자연스러운 UI를 만들고 싶어요.',
    Backend: '안정적인 API와 데이터 설계에 관심이 많아요.',
    Design: '명확한 정보 구조와 일관된 UI를 지향해요.',
  };

  const introBank = {
    Frontend:
      '컴포넌트 구조와 상태 흐름을 다듬는 것을 좋아합니다. 작은 상호작용도 놓치지 않는 구현을 목표로 합니다.',
    Backend:
      '데이터 모델링과 에러 처리에 강한 백엔드를 만들고 싶습니다. 관측 가능성과 운영 관점도 함께 고민합니다.',
    Design:
      '문제 정의부터 와이어프레임, 시안까지 흐름을 설계합니다. 개발과 협업 가능한 디자인을 중요하게 생각합니다.',
  };

  const quoteBank = [
    '함께 성장해요!',
    '좋은 코드는 디테일에서 나온다고 믿어요.',
    '배운 것을 나누며 성장하고 싶어요.',
  ];

  const email =
    normalizeText(user?.email) || `lion${Math.floor(Math.random() * 10000)}@example.com`;
  const phone =
    normalizeText(user?.phone) ||
    `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
  const username = normalizeText(user?.login?.username) || `lion-${Math.floor(Math.random() * 10000)}`;
  const website = `https://example.com/${encodeURIComponent(username)}`;
  const websiteDisplay = website.replace(/^https?:\/\//i, '');

  return {
    id: crypto.randomUUID(),
    isSelf: false,
    createdAt: Date.now(),
    photoUrl: normalizeText(user?.picture?.large) || picsumUrl(`${name}-${Date.now()}`),
    badge: skills[0] || '',
    name,
    part,
    tagline: taglineBank[part],
    organization: CLUB_NAME,
    intro: introBank[part],
    skills,
    contacts: [
      { label: 'Email', value: email },
      { label: 'Phone', value: phone },
      {
        label: 'Website',
        value: websiteDisplay,
        href: website,
      },
    ],
    quote: randomPick(quoteBank),
  };
}

export function lionFromFormFields(fields) {
  const skills = parseSkills(fields.skills);
  const website = normalizeWebsite(fields.website);
  const websiteDisplay = website.replace(/^https?:\/\//i, '');

  return {
    id: crypto.randomUUID(),
    isSelf: false,
    createdAt: Date.now(),
    photoUrl: picsumUrl(`${fields.name}-${Date.now()}`),
    badge: skills[0] || '',
    name: fields.name,
    part: fields.part,
    tagline: fields.tagline,
    organization: CLUB_NAME,
    intro: fields.intro,
    skills,
    contacts: [
      { label: 'Email', value: fields.email },
      { label: 'Phone', value: fields.phone },
      {
        label: 'Website',
        value: websiteDisplay,
        href: website,
      },
    ],
    quote: fields.quote,
  };
}

export function formFieldsFromLion(lion) {
  const email = lion.contacts.find((c) => c.label === 'Email')?.value || '';
  const phone = lion.contacts.find((c) => c.label === 'Phone')?.value || '';
  const websiteContact = lion.contacts.find((c) => c.label === 'Website');
  const website = websiteContact?.href || websiteContact?.value || '';

  return {
    name: lion.name,
    part: lion.part,
    skills: lion.skills.join(', '),
    tagline: lion.tagline,
    intro: lion.intro,
    email,
    phone,
    website,
    quote: lion.quote,
  };
}

export function validateFormFields(fields) {
  const errors = {};
  let ok = true;

  const required = [
    ['name', fields.name, '이름을 입력해 주세요.'],
    ['part', fields.part, '파트를 선택해 주세요.'],
    ['skills', fields.skills, '관심 기술을 입력해 주세요.'],
    ['tagline', fields.tagline, '한 줄 소개를 입력해 주세요.'],
    ['intro', fields.intro, '자기소개를 입력해 주세요.'],
    ['email', fields.email, '이메일을 입력해 주세요.'],
    ['phone', fields.phone, '전화번호를 입력해 주세요.'],
    ['website', fields.website, '웹사이트를 입력해 주세요.'],
    ['quote', fields.quote, '한 마디를 입력해 주세요.'],
  ];

  required.forEach(([key, value, msg]) => {
    if (!normalizeText(value)) {
      ok = false;
      errors[key] = msg;
    }
  });

  if (fields.part && !['Frontend', 'Backend', 'Design'].includes(fields.part)) {
    ok = false;
    errors.part = '파트는 Frontend / Backend / Design 중 하나여야 합니다.';
  }

  const skills = parseSkills(fields.skills);
  if (normalizeText(fields.skills) && skills.length < 3) {
    ok = false;
    errors.skills = '관심 기술은 쉼표(,)로 구분하여 최소 3개를 입력해 주세요.';
  }

  return { ok, errors, skills };
}

export function isFormComplete(fields) {
  return (
    normalizeText(fields.name) &&
    normalizeText(fields.part) &&
    normalizeText(fields.skills) &&
    normalizeText(fields.tagline) &&
    normalizeText(fields.intro) &&
    normalizeText(fields.email) &&
    normalizeText(fields.phone) &&
    normalizeText(fields.website) &&
    normalizeText(fields.quote)
  );
}
