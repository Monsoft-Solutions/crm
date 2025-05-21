export const userAdditionalFields = {
    lastName: {
        type: 'string',
        required: false,
    },

    language: {
        type: 'string',
        defaultValue: 'en',
        required: false,
    },

    bookmarked: {
        type: 'boolean',
        defaultValue: true,
    },

    hasDoneTour: {
        type: 'boolean',
        defaultValue: true,
    },
} as const;
