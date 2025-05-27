import { LangCode } from '@lang/enum';

export const langMap = (lang: LangCode) => {
    switch (lang) {
        case 'en':
            return 'English';
        case 'es':
            return 'Spanish';
    }
};
