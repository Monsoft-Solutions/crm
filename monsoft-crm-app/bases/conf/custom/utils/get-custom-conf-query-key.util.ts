export const getCustomConfQueryKey = ({
    organizationId,
}: {
    organizationId: string;
}) => ['conf', 'custom', organizationId];
