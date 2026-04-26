document.addEventListener('DOMContentLoaded', () => {
  const CLUB_NAME = '멋쟁이 사자처럼';
  const RANDOM_USER_URL = (n) => `https://randomuser.me/api/?results=${encodeURIComponent(n)}&nat=us,gb,ca,au,nz`;

  /**
   * @typedef {Object} Lion
   * @property {string} id
   * @property {boolean} isSelf
   * @property {number} createdAt
   * @property {string} name
   * @property {'Frontend'|'Backend'|'Design'} part
   * @property {string} photoUrl
   * @property {string} tagline
   * @property {string} intro
   * @property {string[]} skills
   * @property {{ email: string, phone: string, website: string }} contact
   * @property {string} quote
   */

  const $summaryGrid = document.getElementById('summary-grid');
  const $detailList = document.getElementById('detail-list');
  const $countText = document.getElementById('count-text');
  const $toggleFormBtn = document.getElementById('toggle-form-btn');
  const $deleteLastBtn = document.getElementById('delete-last-btn');
  const $addForm = document.getElementById('add-form');
  const $cancelFormBtn = document.getElementById('cancel-form-btn');
  const $fetchAdd1Btn = document.getElementById('fetch-add-1-btn');
  const $fetchAdd5Btn = document.getElementById('fetch-add-5-btn');
  const $fetchRefreshBtn = document.getElementById('fetch-refresh-btn');
  const $requestStatusText = document.getElementById('request-status-text');
  const $requestRetryBtn = document.getElementById('request-retry-btn');
  const $filterPart = document.getElementById('filter-part');
  const $sortBy = document.getElementById('sort-by');
  const $searchName = document.getElementById('search-name');
  const $emptyState = document.getElementById('empty-state');
  const $fillRandomBtn = document.getElementById('fill-random-btn');

  /** @type {Lion[]} */
  let lions = [];

  const viewOptions = {
    part: 'all',
    sortBy: 'latest',
    searchName: '',
  };

  /** @type {null | (() => Promise<void>)} */
  let lastRequest = null;

  let isFetching = false;

  function normalizeText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function parseSkills(skillsText) {
    return String(skillsText)
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  function normalizeWebsite(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://${raw}`;
  }

  function picsumUrl(seed) {
    return `https://picsum.photos/seed/${encodeURIComponent(seed)}/240/240`;
  }

  function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function setRequestStatus(text, { showRetry = false } = {}) {
    $requestStatusText.textContent = text;
    if (showRetry) $requestRetryBtn.classList.remove('is-hidden');
    else $requestRetryBtn.classList.add('is-hidden');
  }

  function setFetching(next) {
    isFetching = next;
    const disabled = Boolean(next);
    [$fetchAdd1Btn, $fetchAdd5Btn, $fetchRefreshBtn, $fillRandomBtn].forEach(($btn) => {
      if ($btn) $btn.disabled = disabled;
    });
  }

  function setError(name, message) {
    const $error = $addForm.querySelector(`[data-error-for="${CSS.escape(name)}"]`);
    if (!$error) return;
    $error.textContent = message || '';
  }

  function clearErrors() {
    $addForm.querySelectorAll('.field__error').forEach(($el) => {
      $el.textContent = '';
    });
  }

  function updateCount() {
    $countText.textContent = `총 ${lions.length}명`;
    const deletableCount = lions.filter((l) => !l.isSelf).length;
    $deleteLastBtn.disabled = deletableCount === 0;
  }

  function openForm() {
    $addForm.classList.remove('is-hidden');
    $toggleFormBtn.setAttribute('aria-expanded', 'true');
    const first = $addForm.querySelector('input, select, textarea');
    if (first) first.focus();
  }

  function closeForm() {
    $addForm.reset();
    clearErrors();
    $addForm.classList.add('is-hidden');
    $toggleFormBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleForm() {
    const isHidden = $addForm.classList.contains('is-hidden');
    if (isHidden) openForm();
    else closeForm();
  }

  function createSummaryCardElement(lion, index) {
    const $article = document.createElement('article');
    $article.className = lion.isSelf ? 'summary-card summary-card--self' : 'summary-card';
    $article.setAttribute('aria-labelledby', `sum-name-${index}`);
    if (lion.isSelf) $article.setAttribute('aria-label', '내 자기소개 카드');

    const $figure = document.createElement('figure');
    $figure.className = 'summary-card__figure';

    const $img = document.createElement('img');
    $img.className = 'summary-card__photo';
    $img.src = lion.photoUrl;
    $img.width = 120;
    $img.height = 120;
    $img.alt = `${lion.name} 프로필 사진`;

    const $badge = document.createElement('span');
    $badge.className = 'summary-card__badge';
    $badge.textContent = lion.skills[0] || '';

    $figure.append($img, $badge);

    const $body = document.createElement('section');
    $body.className = 'summary-card__body';
    $body.setAttribute('aria-label', '요약 정보');

    const $name = document.createElement('h3');
    $name.className = 'summary-card__name';
    $name.id = `sum-name-${index}`;
    $name.textContent = lion.name;

    const $role = document.createElement('p');
    $role.className = 'summary-card__role';
    $role.textContent = lion.part;

    const $tagline = document.createElement('p');
    $tagline.className = 'summary-card__tagline';
    $tagline.textContent = lion.tagline;

    $body.append($name, $role, $tagline);
    $article.append($figure, $body);
    return $article;
  }

  function createDetailCardElement(lion, index) {
    const $article = document.createElement('article');
    $article.className = 'detail-card';
    $article.setAttribute('aria-labelledby', `detail-name-${index}`);

    const $title = document.createElement('h3');
    $title.className = 'detail-card__title';
    $title.id = `detail-name-${index}`;
    $title.textContent = lion.name;

    const $dl = document.createElement('dl');
    $dl.className = 'detail-card__fields';

    const addField = (label, value, { block = false, paragraph = false } = {}) => {
      const $wrap = document.createElement('div');
      $wrap.className = block ? 'detail-field detail-field--block' : 'detail-field';

      const $dt = document.createElement('dt');
      $dt.className = 'detail-field__label';
      $dt.textContent = label;

      const $dd = document.createElement('dd');
      $dd.className = paragraph ? 'detail-field__value detail-field__value--paragraph' : 'detail-field__value';
      $dd.textContent = value;

      $wrap.append($dt, $dd);
      $dl.append($wrap);
    };

    addField('이름', lion.name);
    addField('소속 파트', lion.part);
    addField('동아리명', CLUB_NAME);
    addField('자기소개', lion.intro, { block: true, paragraph: true });

    {
      const $wrap = document.createElement('div');
      $wrap.className = 'detail-field detail-field--block';

      const $dt = document.createElement('dt');
      $dt.className = 'detail-field__label';
      $dt.textContent = '관심 기술';

      const $dd = document.createElement('dd');
      $dd.className = 'detail-field__value';

      const $ul = document.createElement('ul');
      $ul.className = 'skill-list';
      lion.skills.forEach((skill) => {
        const $li = document.createElement('li');
        $li.textContent = skill;
        $ul.append($li);
      });

      $dd.append($ul);
      $wrap.append($dt, $dd);
      $dl.append($wrap);
    }

    {
      const $wrap = document.createElement('div');
      $wrap.className = 'detail-field detail-field--block';

      const $dt = document.createElement('dt');
      $dt.className = 'detail-field__label';
      $dt.textContent = '연락처';

      const $dd = document.createElement('dd');
      $dd.className = 'detail-field__value';

      const $ul = document.createElement('ul');
      $ul.className = 'contact-list';

      const addContactRow = (key, valueNodeOrText) => {
        const $li = document.createElement('li');
        $li.className = 'contact-list__item';

        const $key = document.createElement('span');
        $key.className = 'contact-list__key';
        $key.textContent = key;

        const $val = document.createElement('span');
        $val.className = 'contact-list__val';
        if (typeof valueNodeOrText === 'string') $val.textContent = valueNodeOrText;
        else $val.append(valueNodeOrText);

        $li.append($key, $val);
        $ul.append($li);
      };

      addContactRow('이메일', lion.contact.email);

      {
        const $a = document.createElement('a');
        $a.href = lion.contact.website;
        $a.target = '_blank';
        $a.rel = 'noopener noreferrer';
        $a.textContent = lion.contact.website.replace(/^https?:\/\//i, '');
        addContactRow('웹사이트', $a);
      }

      addContactRow('휴대전화', lion.contact.phone);

      $dd.append($ul);
      $wrap.append($dt, $dd);
      $dl.append($wrap);
    }

    addField('한 마디', lion.quote, { block: true });

    $article.append($title, $dl);
    return $article;
  }

  function getVisibleLions() {
    let list = [...lions];

    if (viewOptions.part !== 'all') {
      list = list.filter((l) => l.part === viewOptions.part);
    }

    const q = normalizeText(viewOptions.searchName).toLowerCase();
    if (q) {
      list = list.filter((l) => normalizeText(l.name).toLowerCase().includes(q));
    }

    if (viewOptions.sortBy === 'name') {
      list.sort((a, b) => normalizeText(a.name).localeCompare(normalizeText(b.name), 'ko'));
    } else {
      // 최신추가순: 새로운 항목이 위로
      list.sort((a, b) => b.createdAt - a.createdAt);
    }

    return list;
  }

  function render() {
    const visible = getVisibleLions();

    $summaryGrid.innerHTML = '';
    $detailList.innerHTML = '';

    visible.forEach((lion, i) => {
      const index = i + 1;
      $summaryGrid.append(createSummaryCardElement(lion, index));
      $detailList.append(createDetailCardElement(lion, index));
    });

    if (visible.length === 0) $emptyState.classList.remove('is-hidden');
    else $emptyState.classList.add('is-hidden');

    updateCount();
  }

  function addLions(nextLions) {
    lions = [...lions, ...nextLions];
    render();
  }

  function deleteLastLion() {
    if (lions.length === 0) return;
    if (lions.length === 1 && lions[0].isSelf) return;

    const last = lions[lions.length - 1];
    if (last.isSelf) return;
    lions = lions.slice(0, -1);
    render();
  }

  function initFromExistingDom() {
    const summaryCards = Array.from($summaryGrid.querySelectorAll('.summary-card'));
    const detailCards = Array.from($detailList.querySelectorAll('.detail-card'));

    const count = Math.min(summaryCards.length, detailCards.length);
    lions = [];

    for (let i = 0; i < count; i += 1) {
      const $sum = summaryCards[i];
      const $det = detailCards[i];

      const isSelf = $sum.classList.contains('summary-card--self');
      const name = normalizeText($sum.querySelector('.summary-card__name')?.textContent);
      const part = normalizeText($sum.querySelector('.summary-card__role')?.textContent);
      const tagline = normalizeText($sum.querySelector('.summary-card__tagline')?.textContent);
      const photoUrl = String($sum.querySelector('img')?.getAttribute('src') || '').trim();

      const intro = normalizeText(
        Array.from($det.querySelectorAll('.detail-field')).find(($field) =>
          normalizeText($field.querySelector('.detail-field__label')?.textContent) === '자기소개'
        )?.querySelector('.detail-field__value')?.textContent
      );

      const skills = Array.from($det.querySelectorAll('.skill-list li')).map(($li) => normalizeText($li.textContent));

      const contacts = new Map();
      $det.querySelectorAll('.contact-list__item').forEach(($item) => {
        const key = normalizeText($item.querySelector('.contact-list__key')?.textContent);
        const $val = $item.querySelector('.contact-list__val');
        const $a = $val?.querySelector('a');
        const value = $a ? String($a.getAttribute('href') || '').trim() : normalizeText($val?.textContent);
        if (key) contacts.set(key, value);
      });

      const quote = normalizeText(
        Array.from($det.querySelectorAll('.detail-field')).find(($field) =>
          normalizeText($field.querySelector('.detail-field__label')?.textContent) === '한 마디'
        )?.querySelector('.detail-field__value')?.textContent
      );

      /** @type {Lion} */
      const lion = {
        id: crypto.randomUUID(),
        isSelf,
        createdAt: Date.now() - (count - i) * 1000,
        name,
        part: /** @type {any} */ (part),
        photoUrl: photoUrl || picsumUrl(name || `lion-${i + 1}`),
        tagline,
        intro,
        skills,
        contact: {
          email: String(contacts.get('이메일') || '').trim(),
          website: String(contacts.get('웹사이트') || '').trim(),
          phone: String(contacts.get('휴대전화') || '').trim(),
        },
        quote,
      };

      lions.push(lion);
    }

    render();
  }

  function validateForm() {
    clearErrors();
    const formData = new FormData($addForm);

    const name = normalizeText(formData.get('name'));
    const part = normalizeText(formData.get('part'));
    const skillsText = normalizeText(formData.get('skills'));
    const tagline = normalizeText(formData.get('tagline'));
    const intro = normalizeText(formData.get('intro'));
    const email = normalizeText(formData.get('email'));
    const phone = normalizeText(formData.get('phone'));
    const websiteRaw = normalizeText(formData.get('website'));
    const quote = normalizeText(formData.get('quote'));

    let ok = true;

    const required = [
      ['name', name, '이름을 입력해 주세요.'],
      ['part', part, '파트를 선택해 주세요.'],
      ['skills', skillsText, '관심 기술을 입력해 주세요.'],
      ['tagline', tagline, '한 줄 소개를 입력해 주세요.'],
      ['intro', intro, '자기소개를 입력해 주세요.'],
      ['email', email, '이메일을 입력해 주세요.'],
      ['phone', phone, '전화번호를 입력해 주세요.'],
      ['website', websiteRaw, '웹사이트를 입력해 주세요.'],
      ['quote', quote, '한 마디를 입력해 주세요.'],
    ];

    required.forEach(([key, value, msg]) => {
      if (!value) {
        ok = false;
        setError(String(key), String(msg));
      }
    });

    if (part && !['Frontend', 'Backend', 'Design'].includes(part)) {
      ok = false;
      setError('part', '파트는 Frontend / Backend / Design 중 하나여야 합니다.');
    }

    const skills = parseSkills(skillsText);
    if (skillsText && skills.length < 3) {
      ok = false;
      setError('skills', '관심 기술은 쉼표(,)로 구분하여 최소 3개를 입력해 주세요.');
    }

    const website = normalizeWebsite(websiteRaw);

    return {
      ok,
      data: { name, part, skills, tagline, intro, email, phone, website, quote },
    };
  }

  function handleAddFormSubmit(event) {
    event.preventDefault();

    const result = validateForm();
    if (!result.ok) return;

    const { name, part, skills, tagline, intro, email, phone, website, quote } = result.data;

    const photoUrl = picsumUrl(`${name}-${Date.now()}`);

    /** @type {Lion} */
    const lion = {
      id: crypto.randomUUID(),
      isSelf: false,
      createdAt: Date.now(),
      name,
      part: /** @type {any} */ (part),
      photoUrl,
      tagline,
      intro,
      skills,
      contact: { email, phone, website },
      quote,
    };

    addLions([lion]);
    closeForm();
  }

  async function fetchRandomUsers(n) {
    const res = await fetch(RANDOM_USER_URL(n));
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
  }

  function randomLionFromApiUser(user) {
    const first = normalizeText(user?.name?.first);
    const last = normalizeText(user?.name?.last);
    const name = normalizeText(`${first} ${last}`) || `아기 사자 ${Math.floor(Math.random() * 1000)}`;

    const part = /** @type {'Frontend'|'Backend'|'Design'} */ (
      randomPick(['Frontend', 'Backend', 'Design'])
    );

    const skillBank = {
      Frontend: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Next.js', 'Accessibility'],
      Backend: ['Node.js', 'PostgreSQL', 'Redis', 'REST API', 'Docker', 'Testing'],
      Design: ['Figma', 'Design System', 'UX Writing', 'Prototyping', 'Motion', 'Typography'],
    };

    const skills = [...new Set([randomPick(skillBank[part]), randomPick(skillBank[part]), randomPick(skillBank[part])])];

    const taglineBank = {
      Frontend: '사용자 흐름이 자연스러운 UI를 만들고 싶어요.',
      Backend: '안정적인 API와 데이터 설계에 관심이 많아요.',
      Design: '명확한 정보 구조와 일관된 UI를 지향해요.',
    };

    const introBank = {
      Frontend: '컴포넌트 구조와 상태 흐름을 다듬는 것을 좋아합니다. 작은 상호작용도 놓치지 않는 구현을 목표로 합니다.',
      Backend: '데이터 모델링과 에러 처리에 강한 백엔드를 만들고 싶습니다. 관측 가능성과 운영 관점도 함께 고민합니다.',
      Design: '문제 정의부터 와이어프레임, 시안까지 흐름을 설계합니다. 개발과 협업 가능한 디자인을 중요하게 생각합니다.',
    };

    const quoteBank = ['함께 성장해요!', '좋은 코드는 디테일에서 나온다고 믿어요.', '배운 것을 나누며 성장하고 싶어요.'];

    const email = normalizeText(user?.email) || `lion${Math.floor(Math.random() * 10000)}@example.com`;
    const phone = normalizeText(user?.phone) || `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const username = normalizeText(user?.login?.username) || `lion-${Math.floor(Math.random() * 10000)}`;
    const website = `https://example.com/${encodeURIComponent(username)}`;

    return /** @type {Lion} */ ({
      id: crypto.randomUUID(),
      isSelf: false,
      createdAt: Date.now(),
      name,
      part,
      photoUrl: normalizeText(user?.picture?.large) || picsumUrl(`${name}-${Date.now()}`),
      tagline: taglineBank[part],
      intro: introBank[part],
      skills,
      contact: { email, phone, website },
      quote: randomPick(quoteBank),
    });
  }

  async function runRequest(task, { successText = '완료!' } = {}) {
    try {
      setFetching(true);
      setRequestStatus('불러오는 중...', { showRetry: false });
      await task();
      setRequestStatus(successText, { showRetry: false });
      window.setTimeout(() => {
        setRequestStatus('준비 완료', { showRetry: false });
      }, 900);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setRequestStatus(`불러오기 실패: ${msg}`, { showRetry: true });
      throw err;
    } finally {
      setFetching(false);
    }
  }

  async function handleFetchAdd(n) {
    lastRequest = () => handleFetchAdd(n);
    await runRequest(async () => {
      const json = await fetchRandomUsers(n);
      const next = (json?.results || []).map(randomLionFromApiUser);
      addLions(next);
    }, { successText: `랜덤 ${n}명 추가 완료!` });
  }

  async function handleFetchRefresh() {
    lastRequest = () => handleFetchRefresh();
    await runRequest(async () => {
      const self = lions.find((l) => l.isSelf) || null;
      const keepCount = lions.length;
      const target = Math.max(0, keepCount - (self ? 1 : 0));

      if (target === 0) {
        lions = self ? [self] : [];
        render();
        return;
      }

      const json = await fetchRandomUsers(target);
      const next = (json?.results || []).map(randomLionFromApiUser);
      lions = self ? [self, ...next] : next;
      render();
    }, { successText: '전체 새로고침 완료!' });
  }

  async function handleRetry() {
    if (!lastRequest) return;
    try {
      await lastRequest();
    } catch {
      // 실패 메시지는 runRequest에서 처리됨
    }
  }

  async function handleFillRandom() {
    lastRequest = () => handleFillRandom();
    await runRequest(async () => {
      const json = await fetchRandomUsers(1);
      const user = (json?.results || [])[0];
      const lion = randomLionFromApiUser(user);

      $addForm.elements.namedItem('name').value = lion.name;
      $addForm.elements.namedItem('part').value = lion.part;
      $addForm.elements.namedItem('skills').value = lion.skills.join(', ');
      $addForm.elements.namedItem('tagline').value = lion.tagline;
      $addForm.elements.namedItem('intro').value = lion.intro;
      $addForm.elements.namedItem('email').value = lion.contact.email;
      $addForm.elements.namedItem('phone').value = lion.contact.phone;
      $addForm.elements.namedItem('website').value = lion.contact.website;
      $addForm.elements.namedItem('quote').value = lion.quote;

      if ($addForm.classList.contains('is-hidden')) openForm();
      clearErrors();
    }, { successText: '랜덤 값 채우기 완료!' });
  }

  function handleViewOptionsChange() {
    viewOptions.part = $filterPart.value;
    viewOptions.sortBy = $sortBy.value;
    viewOptions.searchName = $searchName.value;
    render();
  }

  $toggleFormBtn.addEventListener('click', toggleForm);
  $cancelFormBtn.addEventListener('click', closeForm);
  $deleteLastBtn.addEventListener('click', deleteLastLion);
  $addForm.addEventListener('submit', handleAddFormSubmit);
  $fetchAdd1Btn.addEventListener('click', () => handleFetchAdd(1));
  $fetchAdd5Btn.addEventListener('click', () => handleFetchAdd(5));
  $fetchRefreshBtn.addEventListener('click', () => handleFetchRefresh());
  $requestRetryBtn.addEventListener('click', handleRetry);
  $fillRandomBtn.addEventListener('click', handleFillRandom);
  [$filterPart, $sortBy].forEach(($el) => $el.addEventListener('change', handleViewOptionsChange));
  $searchName.addEventListener('input', handleViewOptionsChange);

  initFromExistingDom();
  setRequestStatus('준비 완료', { showRetry: false });
});

