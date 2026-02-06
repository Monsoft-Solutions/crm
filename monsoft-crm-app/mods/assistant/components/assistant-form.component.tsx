import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';
import { Sparkles, Loader2, ChevronDown } from 'lucide-react';

import { Button } from '@ui/button.ui';
import { InputAnimatedLabel } from '@shared/ui/input-animated-label.ui';
import { Textarea } from '@ui/textarea.ui';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@ui/form.ui';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@ui/collapsible.ui';

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
import {
    AssistantType,
    assistantTypeEnum,
    DetailLevel,
    detailLevelEnum,
    ResponseMode,
    responseModeEnum,
} from '../enums';
import { ScrollArea } from '@shared/ui/scroll-area.ui';

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
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

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
            communicationStyle: '',
            responseTone: '',
            detailLevel: detailLevelEnum.options.at(0),
            responseMode: 'auto_reply',
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
        communicationStyle: string;
        responseTone: string;
        detailLevel: DetailLevel;
        responseMode: ResponseMode;
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

    const handleGenerateConfig = async () => {
        if (!aiPrompt.trim()) {
            toast.error('Please enter a description for your assistant');
            return;
        }

        setIsGenerating(true);

        const { data: config, error: configError } =
            await api.assistant.generateAssistantConfig.mutate({
                prompt: aiPrompt,
            });

        setIsGenerating(false);

        if (configError) {
            toast.error('Failed to generate configuration');
            return;
        }

        form.reset({
            ...config,
            model: form.getValues('model'),
        });

        toast.success('Configuration generated successfully');
    };

    return (
        <ScrollArea className="max-h-[50vh]">
            <Form {...form}>
                <form
                    className="flex flex-col gap-4 py-2 pr-4"
                    onSubmit={(e) => {
                        void form.handleSubmit(handleSubmit)(e);
                    }}
                >
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex w-full items-center justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Generate with AI
                                </span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-3 space-y-3">
                            <Textarea
                                placeholder="Describe your assistant, e.g. 'A friendly support agent for a SaaS billing product'"
                                className="min-h-[80px]"
                                value={aiPrompt}
                                onChange={(e) => {
                                    setAiPrompt(e.target.value);
                                }}
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={isGenerating}
                                onClick={() => {
                                    void handleGenerateConfig();
                                }}
                            >
                                {isGenerating ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4" />
                                )}
                                Generate Configuration
                            </Button>
                        </CollapsibleContent>
                    </Collapsible>

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
                                            <SelectItem
                                                key={model}
                                                value={model}
                                            >
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
                                        {assistantTypeEnum.options.map(
                                            (type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="responseMode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Response Mode</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Response Mode" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {responseModeEnum.options.map(
                                            (mode) => (
                                                <SelectItem
                                                    key={mode}
                                                    value={mode}
                                                >
                                                    {mode === 'auto_reply'
                                                        ? 'Auto Reply'
                                                        : 'Suggest Reply'}
                                                </SelectItem>
                                            ),
                                        )}
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

                    <FormField
                        control={form.control}
                        name="communicationStyle"
                        render={({ field }) => (
                            <FormItem>
                                <InputAnimatedLabel
                                    label="Communication Style"
                                    {...field}
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="responseTone"
                        render={({ field }) => (
                            <FormItem>
                                <InputAnimatedLabel
                                    label="Response Tone"
                                    {...field}
                                />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="detailLevel"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Detail Level</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Detail Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {detailLevelEnum.options.map(
                                            (level) => (
                                                <SelectItem
                                                    key={level}
                                                    value={level}
                                                >
                                                    {level}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
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
        </ScrollArea>
    );
}
