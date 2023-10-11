export interface ISearchIconsQueryParameters {
  token?: string; // TODO: make required?
  term: string;
  suggest?: boolean;
  amount?: number;
  offset?: number;
  platform?: string;
  category?: string;
  language?: string;
  authors?: string;
  authorId?: string;
  authorName?: string;
  isAnimated?: boolean;
  isOuch?: boolean;
  isColor?: boolean;
  spellcheck?: boolean;
  allowExplicit?: boolean;
  replaceNameWithSynonyms?: boolean;
}

export interface ISearchIconsResponseBody {
  success?: boolean;
  parameters?: IParametersResponseBody
  suggestion?: string;
  isSuggestionApplied?: string;
  icons?: IIcon[];
  message?: string;
}

export interface IParametersResponseBody {
  amount?: number;
  countAll?: number;
  language?: string;
  foundLanguage?: string;
  offset?: number;
  term?: string;
  searchTranslations?: ISearchTranslations;
};

export interface ISearchTranslations{
  en?: string;
  ru?: string;
  de?: string;
  es?: string;
  ja?: string;
  it?: string;
  hi?: string;
  fr?: string;
  pt?: string;
  pl?: string;
  ar?: string;
  ko?: string;
  zh?: string;
}

export interface IIcon {
  id?: string;
  name?: string;
  commonName?: string;
  category?: string;
  platform?: string;
  isAnimated?: boolean;
  isFree?: boolean;
  isExternal?: boolean;
  isColor?: boolean;
  isExplicit?: boolean;
  authorId?: string;
  authorName?: string;
  sourceFormat?: string;
}
