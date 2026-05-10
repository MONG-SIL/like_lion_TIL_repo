/**
 * 아기 사자 명단 mock 데이터 (외부 API 미사용)
 * @typedef {{ label: string, value: string, href?: string }} LionContactRow
 * @typedef {{
 *   id: string,
 *   isSelf: boolean,
 *   photoUrl: string,
 *   badge: string,
 *   name: string,
 *   part: string,
 *   tagline: string,
 *   organization: string,
 *   intro: string,
 *   skills: string[],
 *   contacts: LionContactRow[],
 *   quote: string
 * }} Lion
 */

/** @type {Lion[]} */
export const lions = [
  {
    id: 'lion-chj',
    isSelf: true,
    photoUrl: 'https://picsum.photos/seed/chj/240/240',
    badge: 'HTML / CSS',
    name: '최정환',
    part: 'Frontend',
    tagline:
      '컴퓨터 공학과 GBT를 전공하고 있고, 프론트엔드를 개발하고 있습니다. 창업을 목표로 하고 있습니다.',
    organization: '멋쟁이 사자처럼',
    intro:
      '대학에서 컴퓨터 공학과 GBT를 전공하고 있으며, 사용자 화면을 만드는 프론트엔드 개발에 집중하고 있습니다. 아직 배울 것이 많지만 꾸준히 실력을 쌓아가고 있으며, 장기적으로는 창업을 목표로 두고 있습니다.',
    skills: ['HTML / CSS', 'JavaScript', 'React'],
    contacts: [
      { label: 'Email', value: 'abok2836@naver.com' },
      { label: 'Phone', value: '010-8611-2972' },
      {
        label: 'Website',
        value: 'github.com/MONG-SIL',
        href: 'https://github.com/MONG-SIL?tab=repositories',
      },
    ],
    quote: '한 번 시작한 건 대충 마무리하기보다는 할 수 있는 한 열심히 해보겠습니다.',
  },
  {
    id: 'lion-ksy',
    isSelf: false,
    photoUrl: 'https://picsum.photos/seed/ksy/240/240',
    badge: 'Node.js',
    name: '김서연',
    part: 'Backend',
    tagline: '서비스 안정성과 API 설계에 관심이 많고, 팀 단위 협업을 중시합니다.',
    organization: '멋쟁이 사자처럼',
    intro:
      'RESTful API 설계와 데이터베이스 모델링을 중심으로 백엔드 기능을 구현합니다. 에러 처리와 로깅을 꼼꼼히 다루며, 팀 내 코드 리뷰를 통해 품질을 맞추는 협업을 중요하게 생각합니다.',
    skills: ['Node.js', 'PostgreSQL', '캐시 전략'],
    contacts: [
      { label: 'Email', value: 'kim.sy@example.com' },
      { label: 'Phone', value: '010-2341-8890' },
      {
        label: 'Website',
        value: 'github.com/kim-sy-dev',
        href: 'https://github.com',
      },
    ],
    quote: '견고한 서버로 사용자 경험의 기반을 다지겠습니다.',
  },
  {
    id: 'lion-pjh',
    isSelf: false,
    photoUrl: 'https://picsum.photos/seed/pjh/240/240',
    badge: 'Figma',
    name: '박준호',
    part: 'Design',
    tagline: '사용자 흐름을 단순하게 만드는 인터페이스를 지향합니다.',
    organization: '멋쟁이 사자처럼',
    intro:
      '와이어프레임으로 정보 구조를 먼저 잡고, 시안 단계에서 일관된 색·타이포 톤을 유지합니다. 개발자와 소통하며 구현 가능한 컴포넌트 단위로 나누는 작업을 즐깁니다.',
    skills: ['Figma', '디자인 시스템', '모션 가이드'],
    contacts: [
      { label: 'Email', value: 'park.jh@example.com' },
      { label: 'Phone', value: '010-5512-3044' },
      {
        label: 'Website',
        value: 'behance.net/parkjh-ui',
        href: 'https://www.behance.net',
      },
    ],
    quote: '사용자가 이해하기 쉬운 화면을 최우선으로 하겠습니다.',
  },
  {
    id: 'lion-lde',
    isSelf: false,
    photoUrl: 'https://picsum.photos/seed/lde/240/240',
    badge: 'Vue',
    name: '이다은',
    part: 'Frontend',
    tagline: '컴포넌트 구조와 상태 관리 패턴을 익히며 성장 중입니다.',
    organization: '멋쟁이 사자처럼',
    intro:
      '재사용 가능한 UI 컴포넌트와 명확한 상태 흐름을 다루는 프론트엔드 개발자입니다. API 연동과 폼 검증 등 실사용 시나리오를 고려한 구현을 지향합니다.',
    skills: ['Vue', 'TypeScript', 'Vite'],
    contacts: [
      { label: 'Email', value: 'lee.de@example.com' },
      { label: 'Phone', value: '010-7788-1203' },
      {
        label: 'Website',
        value: 'github.com/lee-de-vue',
        href: 'https://github.com',
      },
    ],
    quote: '기술 부채를 줄이는 코드를 지향하겠습니다.',
  },
];
