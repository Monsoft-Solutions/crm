import { UserLang } from '@auth/enum/user-lang.enum';

export const langMap = (lang: UserLang) => {
    switch (lang) {
        case 'en':
            return 'English';
        case 'es':
            return 'Spanish';
    }
};
