import { ReactElement } from 'react';

import { Link, useLocation } from '@tanstack/react-router';

import { hasPermission } from '@guard/providers';

import { api, apiClientUtils } from '@api/providers/web';
import { Route } from '@routes/_public/templates/monitor.lazy';

import { Button } from '@shared/ui/button.ui';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@shared/ui/card.ui';

import { cn } from '@css/utils';

import { RefreshCw } from 'lucide-react';

import { Spinner } from '@shared/ui/spinner.ui';

import { Table, TableBody, TableCell, TableRow } from '@shared/ui/table.ui';

import { ShortInfoMessage } from '@shared/components/short-info-message.component';

// network access level, and public host+port from the web environment

// templates monitor view
export function TemplatesMonitorView(): ReactElement {
    const { pathname } = useLocation();

    // get current session, and log out function from route context
    const {
        auth: { logOut },
        loggedInUser,
    } = Route.useRouteContext();

    // get templates stats
    const { data: templatesStatsQuery } =
        api.template.getTemplatesStats.useQuery();

    // function to set templates stats
    const { setData: setTemplatesStats } =
        apiClientUtils.template.getTemplatesStats;

    // get whether random template service is active
    const { data: isRandomServiceActiveQuery } =
        api.template.getIsRandomServiceActive.useQuery(undefined, {
            enabled: !!loggedInUser,
        });

    const randomServiceAvailable =
        isRandomServiceActiveQuery !== undefined &&
        isRandomServiceActiveQuery.error === null &&
        isRandomServiceActiveQuery.data;

    // function to set whether random template service is active
    const { setData: setIsRandomServiceActiveData } =
        apiClientUtils.template.getIsRandomServiceActive;

    // get random template
    const {
        // random template data
        data: randomTemplate,

        // function to refetch random template
        refetch: refetchRandomTemplate,

        // whether random template is being refetched
        isRefetching: isRefetchingRandomTemplate,
    } = api.template.getRandomTemplate.useQuery(undefined, {
        // never consider random template stale
        staleTime: Number.POSITIVE_INFINITY,

        // only fetch random template if random template service is active
        enabled: !!randomServiceAvailable,
    });

    // toggle random-template-service mutation
    const { mutateAsync: toggleRandomTemplateService } =
        api.template.toggleRandomTemplateService.useMutation();

    // templates-stats-changed subscription
    api.template.onTemplatesStatsChanged.useSubscription(undefined, {
        onData: (newStats) => {
            setTemplatesStats(undefined, (prevData) => {
                if (!prevData) return undefined;

                return {
                    ...prevData,
                    data: newStats,
                };
            });
        },
    });

    // function to toggle random template service
    const handleToggleRandomTemplateService = async (active: boolean) => {
        await toggleRandomTemplateService({
            active,
        });

        setIsRandomServiceActiveData(undefined, (prevData) => {
            if (!prevData) return undefined;

            return {
                ...prevData,
                data: active,
            };
        });
    };

    const TemplateStats = () => {
        //  if query result not available
        if (!templatesStatsQuery)
            return (
                <>
                    <TableRow className="text-center italic">
                        <TableCell colSpan={2}>
                            Loading templates stats...
                        </TableCell>
                    </TableRow>

                    <TableRow className="text-center italic">
                        <TableCell colSpan={2}>
                            <Spinner className="size-4" />
                        </TableCell>
                    </TableRow>
                </>
            );

        const { error: templateStatsError } = templatesStatsQuery;

        if (templateStatsError)
            return (
                <>
                    <TableRow className="text-center italic">
                        <TableCell colSpan={2}>
                            sorry, an unexpected error occurred
                        </TableCell>
                    </TableRow>

                    <TableRow className="text-center italic">
                        <TableCell colSpan={2}>
                            while loading our template stats
                        </TableCell>
                    </TableRow>
                </>
            );

        const { data: templateStatsData } = templatesStatsQuery;

        const { numDraftTemplates, numFinishedTemplates, numCreators } =
            templateStatsData;

        const numTotalTemplates = numDraftTemplates + numFinishedTemplates;

        // render in two rows
        return (
            <>
                {/* first row: templates */}
                <TableRow>
                    <TableCell className="max-w-mi font-semibold">
                        templates
                    </TableCell>

                    {/* show the total number of templates */}
                    {/* broken down into draft and finished */}
                    <TableCell>
                        {numTotalTemplates} ({numDraftTemplates} draft,{' '}
                        {numFinishedTemplates} finished)
                    </TableCell>
                </TableRow>

                {/* second row: creators */}
                <TableRow>
                    <TableCell className="max-w-mi font-semibold">
                        creators
                    </TableCell>

                    {/* show the total number of creators */}
                    <TableCell>{numCreators.toString()}</TableCell>
                </TableRow>
            </>
        );
    };

    // render templates monitor view
    return (
        <main className="container w-min pt-10">
            <div className="min-h-24">
                <h1 className="mb-2 text-3xl font-medium">Template Monitor</h1>

                <>
                    {/* if user is logged in */}
                    {loggedInUser && (
                        <p className="italic">
                            yout can visit our private{' '}
                            {/* link to template management */}
                            <Link to="/template/manage">
                                <Button
                                    variant="link"
                                    className="h-0 px-0 italic"
                                >
                                    Template Management
                                </Button>
                            </Link>
                        </p>
                    )}
                </>
            </div>

            {/* card showing templates stats */}
            <Card className="mx-auto mt-20 w-96">
                <CardHeader>
                    <CardTitle className="">Watch</CardTitle>

                    <CardDescription>
                        Don&apos;t trust, verify !
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableBody>
                            <TemplateStats />

                            <TableRow>
                                {/* if user is not logged in */}
                                {!loggedInUser ? (
                                    // show descriptive message
                                    <TableCell
                                        colSpan={2}
                                        className="invisible"
                                    >
                                        requires log in
                                    </TableCell>
                                ) : // if random service is off
                                !randomServiceAvailable ||
                                  randomTemplate?.error ===
                                      'SERVICE_INACTIVE' ? (
                                    // show descriptive message
                                    <TableCell className="italic" colSpan={2}>
                                        Random service is off, you can{' '}
                                        {/* if user has permission to toggle random template service */}
                                        {hasPermission({
                                            user: loggedInUser,
                                            resource: 'template',
                                            action: 'toggle_random_template_service',
                                        }) ? (
                                            // show a button to turn random template service on
                                            <Button
                                                variant="link"
                                                className="h-0 px-0 italic"
                                                onClick={() =>
                                                    void handleToggleRandomTemplateService(
                                                        true,
                                                    )
                                                }
                                            >
                                                turn it on
                                            </Button>
                                        ) : (
                                            // otherwise, ask user to contact admin
                                            <>contact admin.</>
                                        )}
                                    </TableCell>
                                ) : // if random template is being fetched
                                randomTemplate === undefined ? (
                                    // show a spinner
                                    <TableCell className="flex items-center">
                                        <Spinner className="size-4" />
                                    </TableCell>
                                ) : // if no random template was found
                                randomTemplate.error === 'NOT_FOUND' ? (
                                    <span>no template available</span>
                                ) : // if random template service failed for some unknown reason
                                randomTemplate.error ? (
                                    <span>failed to fetch random template</span>
                                ) : (
                                    // otherwise, show random template
                                    <>
                                        <TableCell className="font-semibold">
                                            random
                                        </TableCell>

                                        <TableCell className="relative flex items-center justify-between gap-2 italic">
                                            <span>
                                                &rdquo;
                                                {randomTemplate.data.name}
                                                &rdquo;
                                            </span>

                                            {/* button to refresh random template */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="-my-10"
                                                onClick={() => {
                                                    void refetchRandomTemplate();
                                                }}
                                            >
                                                <RefreshCw
                                                    className={cn(
                                                        'size-4',
                                                        isRefetchingRandomTemplate &&
                                                            'animate-spin',
                                                    )}
                                                />
                                            </Button>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>

                <CardFooter className="flex-col items-start justify-start">
                    {/* if user is logged in */}
                    {loggedInUser ? (
                        <div className="flex items-center gap-2">
                            <ShortInfoMessage>
                                you can {/* log out button */}
                                <Button
                                    variant="link"
                                    className="text-destructive h-0 px-0 italic"
                                    onClick={() => void logOut()}
                                >
                                    log out
                                </Button>{' '}
                                and stay here !
                            </ShortInfoMessage>
                        </div>
                    ) : (
                        <ShortInfoMessage>
                            you can {/* link to log-in */}
                            <Link
                                to="/auth/log-in"
                                search={{ returnTo: pathname }}
                            >
                                <Button
                                    variant="link"
                                    className="h-0 px-0 italic"
                                >
                                    log in
                                </Button>{' '}
                            </Link>
                            to see a random one
                        </ShortInfoMessage>
                    )}

                    {/* if random service is on, and user is logged in, and has permission to toggle random template service */}
                    {randomServiceAvailable &&
                        loggedInUser &&
                        hasPermission({
                            user: loggedInUser,
                            resource: 'template',
                            action: 'toggle_random_template_service',
                        }) && (
                            <ShortInfoMessage>
                                or{' '}
                                {/* button to turn random template service off */}
                                <Button
                                    variant="link"
                                    className="text-destructive h-0 px-0 italic"
                                    onClick={() =>
                                        void handleToggleRandomTemplateService(
                                            false,
                                        )
                                    }
                                >
                                    turn off
                                </Button>{' '}
                                the random service
                            </ShortInfoMessage>
                        )}
                </CardFooter>
            </Card>
        </main>
    );
}
