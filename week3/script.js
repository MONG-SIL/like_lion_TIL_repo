document.addEventListener('DOMContentLoaded', () => {
  const CLUB_NAME = '멋쟁이 사자처럼';

  /**
   * @typedef {Object} Lion
   * @property {string} id
   * @property {boolean} isSelf
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

  /** @type {Lion[]} */
  let lions = [];

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
    $deleteLastBtn.disabled = lions.length === 0;
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

  function syncAriaIds() {
    Array.from($summaryGrid.querySelectorAll('.summary-card')).forEach(($card, i) => {
      const index = i + 1;
      const $name = $card.querySelector('.summary-card__name');
      if ($name) {
        $name.id = `sum-name-${index}`;
        $card.setAttribute('aria-labelledby', $name.id);
      }
    });

    Array.from($detailList.querySelectorAll('.detail-card')).forEach(($card, i) => {
      const index = i + 1;
      const $title = $card.querySelector('.detail-card__title');
      if ($title) {
        $title.id = `detail-name-${index}`;
        $card.setAttribute('aria-labelledby', $title.id);
      }
    });
  }

  function addLion(lion) {
    lions.push(lion);

    const nextIndex = lions.length;
    $summaryGrid.append(createSummaryCardElement(lion, nextIndex));
    $detailList.append(createDetailCardElement(lion, nextIndex));

    syncAriaIds();
    updateCount();
  }

  function deleteLastLion() {
    if (lions.length === 0) return;

    lions.pop();

    const $lastSummary = $summaryGrid.lastElementChild;
    const $lastDetail = $detailList.lastElementChild;
    if ($lastSummary) $lastSummary.remove();
    if ($lastDetail) $lastDetail.remove();

    syncAriaIds();
    updateCount();
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

    // 배지는 “상세 관심기술 첫 번째 항목”과 동기화
    lions.forEach((lion, idx) => {
      const $badge = summaryCards[idx]?.querySelector('.summary-card__badge');
      if ($badge) $badge.textContent = lion.skills[0] || '';
    });

    syncAriaIds();
    updateCount();
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
      name,
      part: /** @type {any} */ (part),
      photoUrl,
      tagline,
      intro,
      skills,
      contact: { email, phone, website },
      quote,
    };

    addLion(lion);
    closeForm();
  }

  $toggleFormBtn.addEventListener('click', toggleForm);
  $cancelFormBtn.addEventListener('click', closeForm);
  $deleteLastBtn.addEventListener('click', deleteLastLion);
  $addForm.addEventListener('submit', handleAddFormSubmit);

  initFromExistingDom();
});

