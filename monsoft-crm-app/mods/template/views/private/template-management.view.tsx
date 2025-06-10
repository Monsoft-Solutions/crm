import { ReactElement, useState } from 'react';

import { Link } from '@tanstack/react-router';

import { hasPermission } from '@guard/providers';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import { api, apiClientUtils } from '@api/providers/web';

import { TemplateRecord } from '@mods/template/types';

import {
    Bitcoin,
    ClipboardCheck,
    Eraser,
    NotepadTextDashed,
    Trash2,
} from 'lucide-react';

import { cn } from '@css/utils';

import { Button } from '@shared/ui/button.ui';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/ui/card.ui';

import { Form, FormField, FormItem } from '@shared/ui/form.ui';
import { FormControl } from '@shared/ui/form.ui';
import { Input } from '@shared/ui/input.ui';

import { Table, TableBody, TableCell, TableRow } from '@shared/ui/table.ui';

import { Separator } from '@shared/ui/separator.ui';
import { Spinner } from '@shared/ui/spinner.ui';

import { type AddTemplateForm, addTemplateFormSchema } from '../../schemas';

import type {
    TemplateCreatedEvent,
    TemplateDeletedEvent,
    TemplateStatusUpdatedEvent,
} from '@mods/template/events';

import { Route } from '@routes/_private/route';
import { ScrollArea } from '@shared/ui/scroll-area.ui';

// template-management view
export function TemplateManagementView(): ReactElement {
    const {
        auth: { logOut },
        loggedInUser,
    } = Route.useRouteContext();

    // whether the current user can create templates
    const userCanCreate = hasPermission({
        user: loggedInUser,
        resource: 'template',
        action: 'create',
    });

    // whether the current bpi is being fetched
    const [isFetchingBpi, setIsFetchingBpi] = useState(false);

    // search query
    const [search, setSearch] = useState('');

    // add-template form
    const addTemplateForm = useForm<AddTemplateForm>({
        resolver: zodResolver(addTemplateFormSchema),

        // initialize search query to empty string
        defaultValues: { name: '' },
    });

    // whether the current user can read templates from anyone
    const userCanReadFromAnyone = hasPermission({
        user: loggedInUser,
        resource: 'template',
        action: 'read',
    });

    // search templates creator matcher
    // if the user can read from anyone, search for templates created by anyone
    // otherwise, search only for templates created by the current user
    const searchTemplatesCreatorMatcher = userCanReadFromAnyone
        ? 'anyone'
        : 'me';

    // found templates
    const {
        data: matchingTemplates,
        error: matchingTemplatesError,
        isLoading: isLoadingMatchingTemplates,
    } = api.template.searchTemplates.useQuery({
        search,
        creator: searchTemplatesCreatorMatcher,
    });

    // function to update matching templates
    const { setData: setMatchingTemplates } =
        apiClientUtils.template.searchTemplates;

    // function to add a template to the matching templates array
    const addMatchingTemplate = (template: TemplateCreatedEvent) => {
        setMatchingTemplates(
            { search, creator: searchTemplatesCreatorMatcher },

            (cache) =>
                !cache || cache.error
                    ? cache
                    : { ...cache, data: [...cache.data, template] },
        );
    };

    // function to update a matching template status
    const updateMatchingTemplateStatus = (
        template: TemplateStatusUpdatedEvent,
    ) => {
        setMatchingTemplates(
            { search, creator: searchTemplatesCreatorMatcher },

            (cache) =>
                !cache || cache.error
                    ? cache
                    : {
                          ...cache,
                          data: cache.data.map((t) =>
                              t.id === template.id
                                  ? { ...t, status: template.status }
                                  : t,
                          ),
                      },
        );
    };

    // function to remove a template from the matching templates array
    const removeMatchingTemplate = (template: TemplateDeletedEvent) => {
        setMatchingTemplates(
            { search, creator: searchTemplatesCreatorMatcher },

            (cache) =>
                !cache || cache.error
                    ? cache
                    : {
                          ...cache,
                          data: cache.data.filter((t) => t.id !== template.id),
                      },
        );
    };

    // template-created subscription
    api.template.onTemplateCreated.useSubscription(
        { creator: searchTemplatesCreatorMatcher },

        {
            onData: (template) => {
                // if the template id matches the search query
                if (new RegExp(search, 'i').test(template.id)) {
                    // add it to the matching templates array
                    addMatchingTemplate(template);
                }
            },
        },
    );

    // template-status-updated subscription
    api.template.onTemplateStatusUpdated.useSubscription(
        { creator: searchTemplatesCreatorMatcher },

        {
            onData: (template) => {
                // update the matching template status
                updateMatchingTemplateStatus(template);
            },
        },
    );

    // template-deleted subscription
    api.template.onTemplateDeleted.useSubscription(
        { creator: searchTemplatesCreatorMatcher },

        {
            onData: (template) => {
                // remove the matching template
                removeMatchingTemplate(template);
            },
        },
    );

    // function to handle the add-template form submission
    const onSubmit = async (values: AddTemplateForm) => {
        const { error } = await api.template.createTemplate.mutate(values);

        // if successfully created,
        if (!error) {
            // reset the form
            addTemplateForm.reset();

            // show success message
            toast.success('Template created', {
                description: `new template name:  ${values.name}`,
            });

            return;
        }
        // otherwise...

        // if it failed because the template name was already taken
        if (error === 'DUPLICATE') {
            // show descriptive error message
            toast.error('Template already exists', {
                description: 'Please choose a different name',
            });

            return;
        }
        // otherwise...

        // any other unexpected error
        toast.error('Unexpected error', {
            description: 'Please trye again',
        });
    };

    // function to toggle a template status
    const onToggleStatus = async (template: TemplateRecord) => {
        const { error } = await api.template.updateTemplateStatus.mutate({
            id: template.id,
            status: template.status === 'draft' ? 'finished' : 'draft',
        });

        // if successfully updated
        if (!error) {
            toast.success('Template status updated', {
                description: `new status: ${
                    template.status === 'draft' ? 'finished' : 'draft'
                }`,
            });
            return;
        }
        // otherwise...

        toast.error('Template status update failed', {
            description: 'Unexpected error occurred, please try again',
        });
    };

    // function to delete a template
    const onDelete = async (template: TemplateRecord) => {
        await api.template.deleteTemplate.mutate({
            id: template.id,
        });
    };

    // function to set the template name to the current bpi
    const setTemplateNameToBpi = async () => {
        setIsFetchingBpi(true);
        const bpiResponse = await api.template.getBpi.mutate();
        setIsFetchingBpi(false);

        const { error: bpiError } = bpiResponse;

        // if error getting bpi
        if (bpiError) {
            // show descriptive error message
            toast.error('Could not get BPI', {
                description: 'Please check your connection',
            });
        }
        // if successfully fetched
        else {
            const { data: bpi } = bpiResponse;

            const bpiShortStr = `${Math.round(bpi / 1000).toString()}k`;

            // set the template name to the current bpi
            addTemplateForm.setValue('name', `1 BTC = ${bpiShortStr} EUR`);
        }
    };

    // function to clear the template name
    const clearTemplateName = () => {
        addTemplateForm.setValue('name', '');
    };

    // render template management view
    return (
        <main className="container w-min pt-10">
            <div className="min-h-24">
                <h1 className="mb-2 text-3xl font-medium">
                    Template Management
                </h1>

                <p className="italic">
                    when you&apos;re done here, remember to{' '}
                    {/* log out button */}
                    <Button
                        variant="link"
                        className="text-destructive h-0 px-0 italic"
                        onClick={() => void logOut()}
                    >
                        log out
                    </Button>
                </p>

                <p className="italic">
                    you can also check our public{' '}
                    <Link to="/templates/monitor">
                        {/* templates-monitor link */}
                        <Button variant="link" className="h-0 px-0 italic">
                            Templates Monitor
                        </Button>
                    </Link>
                </p>
            </div>

            <Card className="mt-20 w-96">
                <CardHeader>
                    <CardTitle className="">Explore</CardTitle>

                    <CardDescription>
                        <span>Search our templates</span>
                        {userCanCreate && <span>, create your own !</span>}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {userCanCreate && (
                        <Form {...addTemplateForm}>
                            <form
                                onSubmit={(e) =>
                                    void addTemplateForm.handleSubmit(onSubmit)(
                                        e,
                                    )
                                }
                                className="flex justify-stretch gap-2"
                            >
                                <FormField
                                    control={addTemplateForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <div className="relative flex items-center gap-2">
                                            {/* button to set new template name to bpi */}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="h-8 px-2"
                                                onClick={(e) => {
                                                    void setTemplateNameToBpi();
                                                    e.preventDefault();
                                                }}
                                            >
                                                <Bitcoin
                                                    className={cn(
                                                        'size-4 stroke-orange-400',
                                                        isFetchingBpi &&
                                                            'animate-spin',
                                                    )}
                                                />
                                            </Button>

                                            <FormItem className="flex w-full items-center">
                                                <FormControl>
                                                    {/* new template name input */}
                                                    <Input
                                                        className="h-8 placeholder:italic"
                                                        placeholder="new template..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                            </FormItem>

                                            {/* button to clear the new template name input */}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="absolute right-0 mr-1 size-7 px-0"
                                                onClick={(e) => {
                                                    clearTemplateName();
                                                    e.preventDefault();
                                                }}
                                            >
                                                <Eraser className="stroke-destructive size-4" />
                                            </Button>
                                        </div>
                                    )}
                                />

                                {/* button to add a new template with the name showing in the input */}
                                <Button variant="ghost" className="h-8">
                                    Add
                                </Button>
                            </form>
                        </Form>
                    )}

                    <Separator className="my-6" />

                    <div className="flex items-center gap-4">
                        <span className="min-w-max font-bold">In stock</span>

                        {/* search query input */}
                        <Input
                            className="h-6 rounded-full placeholder:italic"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            placeholder="search..."
                        />
                    </div>

                    <ScrollArea className="mt-4 h-96">
                        <Table>
                            <TableBody>
                                {/* if the matching templates are being fetched */}
                                {isLoadingMatchingTemplates ? (
                                    // show a loading spinner
                                    <TableRow
                                        key={'empty'}
                                        className="text-center"
                                    >
                                        <TableCell className="italic">
                                            <Spinner />
                                        </TableCell>
                                    </TableRow>
                                ) : // if no template search failed
                                matchingTemplatesError ? (
                                    // show a descriptive message
                                    <TableRow
                                        key={'empty'}
                                        className="text-center"
                                    >
                                        <TableCell className="italic">
                                            No templates found
                                        </TableCell>
                                    </TableRow>
                                ) : // if no matching templates found
                                matchingTemplates.length === 0 ? (
                                    // show a descriptive message
                                    <TableRow
                                        key={'empty'}
                                        className="text-center"
                                    >
                                        <TableCell className="italic">
                                            No templates found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    // otherwise, show the matching templates as a table
                                    matchingTemplates.map((template) => (
                                        <TableRow key={template.id}>
                                            <TableCell className="flex items-center justify-between">
                                                <span>{template.name}</span>

                                                <div className="flex gap-2">
                                                    {/* if user has permission to update this template's status */}
                                                    {hasPermission({
                                                        user: loggedInUser,
                                                        resource: 'template',
                                                        action: 'update_status',
                                                        instance: template,
                                                    }) && (
                                                        // show a button to toggle the template status
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="rounded-full"
                                                            onClick={() =>
                                                                void onToggleStatus(
                                                                    template,
                                                                )
                                                            }
                                                        >
                                                            {template.status ===
                                                            'draft' ? (
                                                                <NotepadTextDashed className="size-4 stroke-slate-500" />
                                                            ) : (
                                                                <ClipboardCheck className="size-4 stroke-green-500" />
                                                            )}
                                                        </Button>
                                                    )}

                                                    {/* if user has permission to delete this template */}
                                                    {hasPermission({
                                                        user: loggedInUser,
                                                        resource: 'template',
                                                        action: 'delete',
                                                        instance: template,
                                                    }) && (
                                                        // show a button to delete the template
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                void onDelete(
                                                                    template,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="stroke-destructive size-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </main>
    );
}
