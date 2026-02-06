import { ReactElement } from 'react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@ui/table.ui';

import { Badge } from '@ui/badge.ui';

type PhoneNumber = {
    phoneNumber: string;
    friendlyName: string;
    sid: string;
    brandName: string | null;
};

export function TwilioPhoneNumbersTable({
    phoneNumbers,
    hasCredentials,
}: {
    phoneNumbers: PhoneNumber[];
    hasCredentials: boolean;
}): ReactElement {
    if (!hasCredentials) {
        return (
            <p className="text-muted-foreground text-sm">
                Configure your Twilio credentials above to view phone numbers.
            </p>
        );
    }

    if (phoneNumbers.length === 0) {
        return (
            <p className="text-muted-foreground text-sm">
                No phone numbers found in your Twilio account.
            </p>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Friendly Name</TableHead>
                    <TableHead>Assigned Brand</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {phoneNumbers.map((number) => (
                    <TableRow key={number.sid}>
                        <TableCell className="font-mono">
                            {number.phoneNumber}
                        </TableCell>

                        <TableCell>{number.friendlyName}</TableCell>

                        <TableCell>
                            {number.brandName ? (
                                <Badge variant="secondary">
                                    {number.brandName}
                                </Badge>
                            ) : (
                                <span className="text-muted-foreground text-sm">
                                    Unassigned
                                </span>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
