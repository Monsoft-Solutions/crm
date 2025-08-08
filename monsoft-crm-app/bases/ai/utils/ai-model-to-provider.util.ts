import { AiModel, AiModelProvider } from '../enums';

export const aiModelToProvider = (model: AiModel): AiModelProvider => {
    switch (model) {
        case 'claude-3-7-sonnet-latest':
            return 'anthropic';
        case 'claude-3-5-sonnet-latest':
            return 'anthropic';
        case 'claude-3-5-haiku-latest':
            return 'anthropic';
        case 'claude-3-opus-latest':
            return 'anthropic';
        case 'claude-3-haiku-20240307':
            return 'anthropic';
        case 'gpt-4o-2024-05-13':
            return 'openai';
        case 'gpt-4o-mini-2024-07-18':
            return 'openai';
    }
};
