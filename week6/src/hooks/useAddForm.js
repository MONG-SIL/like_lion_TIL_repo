import { useEffect, useState } from 'react';
import {
  formFieldsFromLion,
  isFormComplete,
  lionFromFormFields,
  normalizeText,
  validateFormFields,
} from '../utils/lionUtils.js';

const EMPTY_FORM = {
  name: '',
  part: '',
  skills: '',
  tagline: '',
  intro: '',
  email: '',
  phone: '',
  website: '',
  quote: '',
};

export function useAddForm({ onAdd, fetchOneForForm, isFetching }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function resetForm() {
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function closeForm() {
    resetForm();
    setIsOpen(false);
  }

  function openForm() {
    setIsOpen(true);
  }

  function toggleForm() {
    if (isOpen) closeForm();
    else openForm();
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fields = {
      name: normalizeText(form.name),
      part: normalizeText(form.part),
      skills: normalizeText(form.skills),
      tagline: normalizeText(form.tagline),
      intro: normalizeText(form.intro),
      email: normalizeText(form.email),
      phone: normalizeText(form.phone),
      website: normalizeText(form.website),
      quote: normalizeText(form.quote),
    };

    const result = validateFormFields(fields);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    onAdd(
      lionFromFormFields({
        ...fields,
        skills: form.skills,
      })
    );
    closeForm();
  }

  async function handleFillRandom() {
    try {
      await fetchOneForForm((lion) => {
        setForm(formFieldsFromLion(lion));
        setErrors({});
        if (!isOpen) setIsOpen(true);
      });
    } catch {
      // 상태 메시지는 fetch 훅에서 처리
    }
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeForm();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const canSubmit = isFormComplete(form);

  return {
    isOpen,
    form,
    errors,
    canSubmit,
    toggleForm,
    closeForm,
    updateField,
    handleSubmit,
    handleFillRandom,
    isFillDisabled: isFetching,
  };
}
