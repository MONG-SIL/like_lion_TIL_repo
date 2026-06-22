export interface LionContactRow {
  label: string;
  value: string;
  href?: string;
}

export type LionPart = 'Frontend' | 'Backend' | 'Design';

export interface Lion {
  id: string;
  isSelf: boolean;
  photoUrl: string;
  badge: string;
  name: string;
  part: LionPart;
  tagline: string;
  organization: string;
  intro: string;
  skills: string[];
  contacts: LionContactRow[];
  quote: string;
  createdAt: number;
}

/** 초기 mock 데이터용 (createdAt은 prepareInitialLions에서 부여) */
export type LionSeed = Omit<Lion, 'createdAt'>;

export type PartFilter = 'all' | LionPart;

export type SortBy = 'latest' | 'name';

export interface ViewOptions {
  part: PartFilter;
  sortBy: SortBy;
  searchName: string;
}

export interface LionFormFields {
  name: string;
  part: string;
  skills: string;
  tagline: string;
  intro: string;
  email: string;
  phone: string;
  website: string;
  quote: string;
}

export type FormFieldName = keyof LionFormFields;

export type FormErrors = Partial<Record<FormFieldName, string>>;

export interface ValidationResult {
  ok: boolean;
  errors: FormErrors;
  skills: string[];
}

export interface RandomUserName {
  first: string;
  last: string;
}

export interface RandomUserLogin {
  username: string;
}

export interface RandomUserPicture {
  large: string;
}

export interface RandomUser {
  name: RandomUserName;
  email: string;
  phone: string;
  picture: RandomUserPicture;
  login: RandomUserLogin;
}

export interface RandomUserResponse {
  results: RandomUser[];
}

export interface DetailLocationState {
  from?: string;
}
