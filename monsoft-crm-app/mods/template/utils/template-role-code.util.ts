import { Role } from '@guard/types';

// utility function to get the template role name
// in a human readable format
export const templateRoleHumanReadable = (role: Role) => {
    switch (role) {
        case 'template_creator':
            return 'creator';

        case 'template_reviewer':
            return 'reviewer';

        case 'template_cleaner':
            return 'cleaner';

        case 'template_service_admin':
            return 'admin';

        default:
            return null;
    }
};
