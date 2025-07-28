import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

import { Button } from '@ui/button.ui';
import { InputAnimatedLabel } from '@shared/ui/input-animated-label.ui';
import { Textarea } from '@ui/textarea.ui';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@ui/form.ui';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/ui/select.ui';

import { AiModel, aiModelEnum } from '@ai/enums';

import {
    assistantSchema,
    Assistant,
    CreateAssistant,
    UpdateAssistant,
} from '../schemas';

import { api } from '@api/providers/web';
import { AssistantType, assistantTypeEnum } from '../enums';

type AssistantFormProps = {
    onSuccess?: () => void | Promise<void>;
    onCancel?: () => void;
} & (
    | {
          id?: never;
          brandId: string;
          assistant?: never;
      }
    | {
          id: string;
          assistant: Assistant;
          brandId?: never;
      }
);

export function AssistantForm({
    id,
    brandId,
    assistant,
    onSuccess,
    onCancel,
}: AssistantFormProps) {
    const form = useForm<Required<UpdateAssistant>>({
        resolver: zodResolver(assistantSchema),
        defaultValues: assistant ?? {
            name: '',
            description: '',
            model: aiModelEnum.options.at(0),
            type: assistantTypeEnum.options.at(0),
            tone: '',
            instructions: '',
            expertise: '',
        },
    });

    const handleCreate = async (values: CreateAssistant) => {
        const { error: createError } =
            await api.assistant.createAssistant.mutate(values);

        if (createError) {
            toast.error('Failed to update assistant');
            return;
        }

        toast.success('Assistant created successfully');
        await onSuccess?.();
    };

    const handleUpdate = async (values: Required<UpdateAssistant>) => {
        const { error: updateError } =
            await api.assistant.updateAssistant.mutate(values);

        if (updateError) {
            toast.error('Failed to update assistant');
            return;
        }

        toast.success('Assistant updated successfully');
        await onSuccess?.();
    };

    const handleSubmit = async (values: {
        name: string;
        description: string;
        model: AiModel;
        type: AssistantType;
        tone: string;
        instructions: string;
        expertise: string;
    }) => {
        if (assistant) {
            await handleUpdate({
                id,
                ...values,
            });
        } else {
            await handleCreate({
                brandId,
                ...values,
            });
        }
    };

    return (
        <Form {...form}>
            <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                    void form.handleSubmit(handleSubmit)(e);
                }}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <InputAnimatedLabel
                                label="Assistant Name"
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <InputAnimatedLabel
                                label="Assistant Description"
                                {...field}
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Model</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="AI Model" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {aiModelEnum.options.map((model) => (
                                        <SelectItem key={model} value={model}>
                                            {model}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Assistant Type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {assistantTypeEnum.options.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                        <FormItem>
                            <InputAnimatedLabel label="Tone" {...field} />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Instructions..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expertise"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expertise</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Expertise..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 pt-4">
                    <Button type="submit">Save</Button>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}
