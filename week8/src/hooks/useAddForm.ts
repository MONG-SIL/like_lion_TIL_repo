import { useEffect, useState, type FormEvent } from 'react';
import type { FormErrors, FormFieldName, Lion, LionFormFields } from '../types/lion';
import {
  formFieldsFromLion,
  isFormComplete,
  lionFromFormFields,
  normalizeText,
  validateFormFields,
} from '../utils/lionUtils';

const EMPTY_FORM: LionFormFields = {
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

export interface UseAddFormParams {
  onAdd: (lion: Lion) => void;
  fetchOneForForm: (onSuccess: (lion: Lion) => void) => Promise<Lion>;
  isFetching: boolean;
}

export interface UseAddFormReturn {
  isOpen: boolean;
  form: LionFormFields;
  errors: FormErrors;
  canSubmit: boolean;
  toggleForm: () => void;
  closeForm: () => void;
  updateField: (name: FormFieldName, value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleFillRandom: () => Promise<void>;
  isFillDisabled: boolean;
}

export function useAddForm({ onAdd, fetchOneForForm, isFetching }: UseAddFormParams): UseAddFormReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [form, setForm] = useState<LionFormFields>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  function resetForm(): void {
    setForm(EMPTY_FORM);
    setErrors({});
  }

  function closeForm(): void {
    resetForm();
    setIsOpen(false);
  }

  function openForm(): void {
    setIsOpen(true);
  }

  function toggleForm(): void {
    if (isOpen) closeForm();
    else openForm();
  }

  function updateField(name: FormFieldName, value: string): void {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const fields: LionFormFields = {
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

  async function handleFillRandom(): Promise<void> {
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

    function handleKeyDown(event: Event): void {
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
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
