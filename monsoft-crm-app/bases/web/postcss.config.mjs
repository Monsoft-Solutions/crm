import tailwindcss from 'tailwindcss';

import autoprefixer from 'autoprefixer';

export default {
    plugins: [
        // tailwindcss plugin: generate css from tailwind classes
        // set path to tailwind.config
        tailwindcss({ config: '../../app/css/tailwind.config' }),

        // autoprefixer plugin: add vendor prefixes to css
        autoprefixer,
    ],
};
