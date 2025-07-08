# AI Module Implementation Plan

## Monsoft CRM - AI-Powered Conversation Assistant

### Overview

This document outlines a comprehensive implementation plan for integrating AI capabilities into the Monsoft CRM system. The AI module will process conversation history across multiple communication channels (SMS, WhatsApp, Email), provide contextual assistance to sales representatives through customizable virtual assistants, and maintain conversation summaries to optimize token usage.

### System Context

**Current Architecture:**

-   **Framework**: TypeScript, tRPC, Drizzle ORM, React + Vite
-   **Database**: PostgreSQL with Drizzle ORM
-   **Communication Channels**: SMS (Twilio), WhatsApp (Meta), Email (Resend)
-   **Module Structure**: Feature-based modules in `/mods/` directory
-   **Infrastructure**: Express backend, session-based auth, event-driven architecture

**Existing Communication Infrastructure:**

-   Contact management with multi-channel support
-   Message status tracking and webhooks
-   Event-driven message processing
-   Structured database relations for contacts and messages

---

## Phase 1: Foundation & Core AI Infrastructure

**Duration**: 3-4 weeks  
**Goal**: Establish AI module structure, virtual assistant system, and basic conversation processing

### 1.1 AI Module Structure Setup (Week 1)

#### 1.1.1 Create AI Module Base Structure

```bash
# Create AI module following existing patterns
monsoft-crm-app/mods/ai/
├── types/              # TypeScript type definitions
├── schemas/            # Zod validation schemas
├── enums/              # AI-specific enums
├── constants/          # AI module constants
├── utils/              # Pure utility functions
├── providers/          # AI service providers
├── db/                 # Database schema for AI data
├── api/                # tRPC AI endpoints
├── events/             # AI-related events
├── hooks/              # React hooks for AI
├── components/         # AI UI components
└── views/              # AI feature views
```

**Deliverables:**

-   [ ] AI module directory structure
-   [ ] Basic TypeScript types for AI entities
-   [ ] Integration with existing module patterns

#### 1.1.2 AI-SDK Integration & Configuration

```typescript
// mods/ai/providers/ai-client.provider.ts
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export const aiClient = {
    openai: openai({
        apiKey: process.env.MSS_OPENAI_API_KEY,
    }),
    anthropic: anthropic({
        apiKey: process.env.MSS_ANTHROPIC_API_KEY,
    }),
};
```

**Deliverables:**

-   [ ] AI-SDK package installation and setup
-   [ ] Environment variables configuration
-   [ ] Provider abstraction layer
-   [ ] Basic AI client initialization

### 1.2 Database Schema Design (Week 1-2)

#### 1.2.1 Virtual Assistant Tables

```typescript
// mods/ai/db/ai-assistant.table.ts
import { relations } from 'drizzle-orm';

import { table, text, bigint, enumType, boolean } from '@db/sql';

import { user } from '@db/db';

import { aiAssistantToneEnum, aiAssistantSpecialtyEnum } from '../enums';

export const aiAssistantTone = enumType(
    'ai_assistant_tone',
    aiAssistantToneEnum.options,
);

export const aiAssistantSpecialty = enumType(
    'ai_assistant_specialty',
    aiAssistantSpecialtyEnum.options,
);

// AI virtual assistants
export const aiAssistant = table('ai_assistant', {
    id: text('id').primaryKey(),

    // name of the assistant
    name: text('name').notNull(),

    // description of the assistant's role
    description: text('description').notNull(),

    // tone of voice (professional, friendly, casual, technical)
    tone: aiAssistantTone('tone').notNull(),

    // specialty area (sales, customer_service, technical_support, general)
    specialty: aiAssistantSpecialty('specialty').notNull(),

    // custom instructions for behavior
    customInstructions: text('custom_instructions'),

    // knowledge areas specific to this assistant
    knowledgeAreas: text('knowledge_areas'),

    // whether this is a system default assistant
    isSystemDefault: boolean('is_system_default').default(false).notNull(),

    // creator of the assistant (null for system defaults)
    createdBy: text('created_by').references(() => user.id),

    // active status
    isActive: boolean('is_active').default(true).notNull(),

    createdAt: bigint('created_at', { mode: 'number' }).notNull(),

    updatedAt: bigint('updated_at', { mode: 'number' }).notNull(),
});

export const aiAssistantRelations = relations(aiAssistant, ({ one }) => ({
    creator: one(user, {
        fields: [aiAssistant.createdBy],
        references: [user.id],
    }),
}));
```

```typescript
// mods/ai/db/conversation-assistant.table.ts
import { relations } from 'drizzle-orm';

import { table, text, bigint } from '@db/sql';

import { contact, user } from '@db/db';

// Links conversations to their assigned AI assistants
export const conversationAssistant = table('conversation_assistant', {
    id: text('id').primaryKey(),

    // contact this assistant is assigned to
    contactId: text('contact_id')
        .notNull()
        .references(() => contact.id, { onDelete: 'cascade' }),

    // the assigned assistant
    assistantId: text('assistant_id')
        .notNull()
        .references(() => aiAssistant.id),

    // user who assigned the assistant
    assignedBy: text('assigned_by')
        .notNull()
        .references(() => user.id),

    assignedAt: bigint('assigned_at', { mode: 'number' }).notNull(),
});

export const conversationAssistantRelations = relations(
    conversationAssistant,
    ({ one }) => ({
        contact: one(contact, {
            fields: [conversationAssistant.contactId],
            references: [contact.id],
        }),

        assistant: one(aiAssistant, {
            fields: [conversationAssistant.assistantId],
            references: [aiAssistant.id],
        }),

        assignedByUser: one(user, {
            fields: [conversationAssistant.assignedBy],
            references: [user.id],
        }),
    }),
);
```

#### 1.2.2 Conversation Summary Table

```typescript
// mods/ai/db/conversation-summary.table.ts
import { relations } from 'drizzle-orm';

import { table, text, bigint, integer } from '@db/sql';

import { contact } from '@db/db';

// Summaries of conversation chunks
export const conversationSummary = table('conversation_summary', {
    id: text('id').primaryKey(),

    // contact this summary belongs to
    contactId: text('contact_id')
        .notNull()
        .references(() => contact.id, { onDelete: 'cascade' }),

    // the summary text
    summaryText: text('summary_text').notNull(),

    // number of messages summarized
    messageCount: integer('message_count').notNull(),

    // ID of first message in summary
    firstMessageId: text('first_message_id').notNull(),

    // ID of last message in summary
    lastMessageId: text('last_message_id').notNull(),

    // token count of the summary
    tokenCount: integer('token_count').notNull(),

    createdAt: bigint('created_at', { mode: 'number' }).notNull(),
});

export const conversationSummaryRelations = relations(
    conversationSummary,
    ({ one }) => ({
        contact: one(contact, {
            fields: [conversationSummary.contactId],
            references: [contact.id],
        }),
    }),
);
```

#### 1.2.3 AI Knowledge Context Table

```typescript
// mods/ai/db/ai-knowledge-context.table.ts
import { relations } from 'drizzle-orm';

import { table, text, bigint, enumType, boolean } from '@db/sql';

import { brand } from '@db/db';

import { aiKnowledgeTypeEnum } from '../enums';

export const aiKnowledgeType = enumType(
    'ai_knowledge_type',
    aiKnowledgeTypeEnum.options,
);

// TODO: Refine this so we don't duplicate data with entities already defined in the system (products)
// Knowledge context for AI per brand
export const aiKnowledgeContext = table('ai_knowledge_context', {
    id: text('id').primaryKey(),

    // brand this knowledge belongs to
    brandId: text('brand_id')
        .notNull()
        .references(() => brand.id, { onDelete: 'cascade' }),

    // type of knowledge (products, services, policies, faqs)
    contextType: aiKnowledgeType('context_type').notNull(),

    // title for easy identification
    title: text('title').notNull(),

    // the actual content
    content: text('content').notNull(),

    // whether this context is active
    isActive: boolean('is_active').default(true).notNull(),

    createdAt: bigint('created_at', { mode: 'number' }).notNull(),

    updatedAt: bigint('updated_at', { mode: 'number' }).notNull(),
});

export const aiKnowledgeContextRelations = relations(
    aiKnowledgeContext,
    ({ one }) => ({
        brand: one(brand, {
            fields: [aiKnowledgeContext.brandId],
            references: [brand.id],
        }),
    }),
);
```

**Deliverables:**

-   [ ] Database migration files
-   [ ] Table relationships with existing contact/message tables
-   [ ] Indexes for performance optimization
-   [ ] Database seeding scripts for default AI assistants

### 1.3 Basic AI Services (Week 2-3)

#### 1.3.1 Virtual Assistant Service

```typescript
// mods/ai/providers/assistant-manager.provider.ts
export class AssistantManager {
    async createDefaultAssistants() {
        // Create system default assistants:
        // - Sales Representative
        // - Customer Service
        // - Technical Specialist
        // - General Assistant
    }

    async createCustomAssistant(data: CreateAssistantInput) {
        // Allow users to create custom assistants
    }

    async assignAssistantToConversation(
        contactId: string,
        assistantId: string,
        userId: string,
    ) {
        // Assign an assistant to handle a conversation
    }

    async getAssistantForConversation(contactId: string) {
        // Get the assigned assistant or return default
    }
}
```

**Deliverables:**

-   [ ] Virtual assistant CRUD operations
-   [ ] Default assistant templates
-   [ ] Assistant assignment logic
-   [ ] Assistant customization interface

#### 1.3.2 Conversation Processing Service

```typescript
// mods/ai/providers/conversation-processor.provider.ts
export class ConversationProcessor {
    private readonly maxContextTokens = 4000; // Configurable
    private readonly summaryTokens = 1000;
    private readonly recentMessagesKeep = 25; // Keep last 25 messages unsummarized

    async processConversation(
        contactId: string,
        newMessage: string,
        assistantId: string,
    ) {
        // 1. Fetch assigned assistant details
        const assistant = await this.getAssistant(assistantId);

        // 2. Build context on-demand
        const context = await this.buildConversationContext(contactId);

        // 3. Generate response suggestions
        const suggestions = await this.generateSuggestions(
            context,
            newMessage,
            assistant,
        );

        // 4. After processing, check if summarization is needed
        this.checkAndCreateSummaryIfNeeded(contactId);

        return suggestions;
    }

    private async buildConversationContext(contactId: string) {
        // Build context on-demand from:
        // - Recent messages
        // - Existing summaries
        // - Brand knowledge
        // - Contact history
    }

    private async checkAndCreateSummaryIfNeeded(contactId: string) {
        // Get all messages without summaries
        const unsummarizedMessages =
            await this.getUnsummarizedMessages(contactId);

        // If we have more than threshold, create summary
        // TODO/FIX: Don't only check the amount of messages, but also the total chars (tokens) of the messages
        if (unsummarizedMessages.length > this.recentMessagesKeep + 20) {
            // Exclude the recent messages
            const messagesToSummarize = unsummarizedMessages.slice(
                0,
                unsummarizedMessages.length - this.recentMessagesKeep,
            );

            await this.createSummary(messagesToSummarize, contactId);
        }
    }

    private async createSummary(messages: Message[], contactId: string) {
        // Use AI-SDK to summarize conversation chunk
        // Store summary with first and last message IDs
    }
}
```

**Deliverables:**

-   [ ] On-demand context building
-   [ ] Message summarization logic
-   [ ] Token counting utilities
-   [ ] Integration with existing message tables

#### 1.3.3 AI Context Management

```typescript
// mods/ai/providers/context-manager.provider.ts
export class AIContextManager {
    async getBusinessContext(brandId: string) {
        // Fetch brand-specific information, products, services, policies
    }

    async getContactHistory(contactId: string) {
        // Get the history of the contact, in case they have bought a
        // product or service, invoices, payments...
    }

    async buildSystemPrompt(assistant: AIAssistant, brandId: string) {
        // Combine assistant personality with brand knowledge
        return `
      You are ${assistant.name}, a ${assistant.specialty} assistant.
      
      Your communication style: ${assistant.tone}
      ${assistant.customInstructions ? `Special instructions: ${assistant.customInstructions}` : ''}
      
      Brand context and knowledge will be provided in the conversation.
    `;
    }
}
```

**Deliverables:**

-   [ ] Brand context retrieval system
-   [ ] Contact history analysis
-   [ ] System prompt generation with assistant personality
-   [ ] Context caching mechanisms

### 1.4 Backend AI Processing (Week 3-4)

#### 1.4.1 Message Processing Integration

// TODO/IX: This is duplicated

```typescript
// mods/ai/providers/message-processor.provider.ts
export class AIMessageProcessor {
    async processIncomingMessage(
        message: IncomingMessage,
        contactId: string,
        channelType: 'sms' | 'whatsapp' | 'email',
    ) {
        // 1. Get assigned assistant for conversation
        const assistant =
            await this.assistantManager.getAssistantForConversation(contactId);

        // 2. Process conversation with AI
        const suggestions =
            await this.conversationProcessor.processConversation(
                contactId,
                message.content,
                assistant.id,
            );

        // 3. Store suggestions for frontend retrieval
        await this.storeSuggestions(contactId, suggestions);

        // 4. Emit event for UI update
        emit({
            event: 'aiSuggestionsReady',
            payload: { contactId, suggestions },
        });
    }
}
```

**Deliverables:**

-   [ ] Integration with existing message webhooks
-   [ ] Suggestion storage mechanism
-   [ ] Event emission for real-time updates
-   [ ] Error handling and fallbacks

#### 1.4.2 Backend API Endpoints

```typescript
// mods/ai/api/ai.api.ts
export const aiApi = router({
    // Get AI suggestions for a conversation
    getSuggestions: protectedProcedure
        .input(
            z.object({
                contactId: z.string(),
            }),
        )
        .query(async ({ input, ctx }) => {
            // Retrieve stored suggestions for the conversation
            return await getSuggestionsForContact(input.contactId);
        }),

    // Manage AI assistants
    createAssistant: protectedProcedure
        .input(createAssistantSchema)
        .mutation(async ({ input, ctx }) => {
            return await assistantManager.createCustomAssistant({
                ...input,
                createdBy: ctx.user.id,
            });
        }),

    assignAssistant: protectedProcedure
        .input(
            z.object({
                contactId: z.string(),
                assistantId: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            return await assistantManager.assignAssistantToConversation(
                input.contactId,
                input.assistantId,
                ctx.user.id,
            );
        }),

    // Knowledge management
    updateBrandKnowledge: protectedProcedure
        .input(
            z.object({
                brandId: z.string(),
                contextType: z.enum([
                    'products',
                    'services',
                    'policies',
                    'faqs',
                ]),
                title: z.string(),
                content: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            // Update brand-specific knowledge base
            return await knowledgeManager.updateBrandKnowledge(input);
        }),
});
```

**Deliverables:**

-   [ ] tRPC endpoints for AI features
-   [ ] Assistant management APIs
-   [ ] Knowledge management APIs
-   [ ] Suggestion retrieval endpoints

---

## Phase 2: Conversation Management & Summarization

**Duration**: 3-4 weeks  
**Goal**: Implement intelligent conversation history management and summarization

### 2.1 Intelligent Summarization System (Week 5-6)

#### 2.1.1 Multi-Level Summarization Strategy

```typescript
// mods/ai/providers/summarization.provider.ts
export class SummarizationService {
    async summarizeMessages(
        messages: Message[],
        contactId: string,
    ): Promise<ConversationSummary> {
        // Group messages by conversation flow
        const messageText = messages
            .map(
                (m) =>
                    `${m.direction === 'inbound' ? 'Contact' : 'Agent'}: ${m.body}`,
            )
            .join('\n');

        // Use AI to create concise summary
        const { text: summaryText } = await generateText({
            model: aiClient.openai('gpt-4-turbo'),
            prompt: `Summarize this conversation concisely, maintaining key points and context:\n\n${messageText}`,
            maxTokens: this.summaryTokens,
        });

        // Calculate token count
        const tokenCount = await this.countTokens(summaryText);

        return {
            summaryText,
            messageCount: messages.length,
            firstMessageId: messages[0].id,
            lastMessageId: messages[messages.length - 1].id,
            tokenCount,
        };
    }

    private async countTokens(text: string): Promise<number> {
        // Implement token counting logic
        return encode(text).length;
    }
}
```

**Deliverables:**

-   [ ] Message grouping and summarization
-   [ ] Token counting implementation
-   [ ] Summary storage with message ID references
-   [ ] Summary quality validation

#### 2.1.2 Context Window Management

```typescript
// mods/ai/providers/context-window.provider.ts
export class ContextWindowManager {
    async buildOptimalContext(
        contactId: string,
        brandId: string,
        maxTokens: number,
    ) {
        // Get recent messages
        const recentMessages = await this.getRecentMessages(contactId, 20);

        // Get relevant summaries
        const summaries = await this.getConversationSummaries(contactId);

        // Get brand context
        const brandContext =
            await this.contextManager.getBusinessContext(brandId);

        // Get contact history
        const contactHistory =
            await this.contextManager.getContactHistory(contactId);

        return this.optimizeTokenUsage({
            recentMessages,
            summaries,
            brandContext,
            contactHistory,
            maxTokens,
        });
    }

    private optimizeTokenUsage(context: FullContext) {
        // Prioritize recent messages and relevant context
        // Truncate if necessary to fit within token limits
    }
}
```

**Deliverables:**

-   [ ] Dynamic context window sizing
-   [ ] Context prioritization logic
-   [ ] Token optimization algorithms
-   [ ] Context relevance filtering

---

## Phase 3: AI-Powered Assistance Features

**Duration**: 4-5 weeks  
**Goal**: Implement AI features for sales representative assistance

### 3.1 Response Generation & Suggestions (Week 7-8)

#### 3.1.1 Contextual Response Generation

```typescript
// mods/ai/providers/response-generator.provider.ts
import { streamText, generateText } from 'ai';

export class ResponseGenerator {
    async generateResponseSuggestions(input: ResponseGenerationInput) {
        const { contactId, message, assistant, brandId } = input;

        // Build comprehensive context
        const context = await this.contextWindowManager.buildOptimalContext(
            contactId,
            brandId,
            this.maxContextTokens,
        );

        // Build system prompt with assistant personality
        const systemPrompt = await this.contextManager.buildSystemPrompt(
            assistant,
            brandId,
        );

        // Format messages for AI SDK
        const messages = this.formatMessagesForAI(context, message);

        // Generate multiple suggestions using AI SDK
        const suggestions = await Promise.all([
            this.generateSingleSuggestion(
                systemPrompt,
                messages,
                'professional',
            ),
            this.generateSingleSuggestion(systemPrompt, messages, 'friendly'),
            this.generateSingleSuggestion(systemPrompt, messages, 'detailed'),
        ]);

        return suggestions.filter((s) => s !== null);
    }

    private formatMessagesForAI(context: OptimalContext, newMessage: string) {
        const messages = [];

        // Add summaries as system context
        if (context.summaries.length > 0) {
            messages.push({
                role: 'system',
                content: `Previous conversation summary:\n${context.summaries.map((s) => s.summaryText).join('\n\n')}`,
            });
        }

        // Add recent messages
        context.recentMessages.forEach((msg) => {
            messages.push({
                role: msg.direction === 'inbound' ? 'user' : 'assistant',
                content: msg.body,
            });
        });

        // Add the new message
        messages.push({
            role: 'user',
            content: newMessage,
        });

        return messages;
    }

    private async generateSingleSuggestion(
        systemPrompt: string,
        messages: any[],
        style: string,
    ) {
        try {
            const { text } = await generateText({
                model: aiClient.openai('gpt-4-turbo'),
                system: `${systemPrompt}\n\nGenerate a ${style} response.`,
                messages,
                maxTokens: 500,
                temperature: 0.7,
            });

            return {
                text,
                style,
                timestamp: Date.now(),
            };
        } catch (error) {
            console.error(`Failed to generate ${style} suggestion:`, error);
            return null;
        }
    }
}
```

**Deliverables:**

-   [ ] Multi-style response generation
-   [ ] AI SDK integration with proper message formatting
-   [ ] Assistant personality integration
-   [ ] Error handling and fallbacks

### 3.2 Conversation Insights & Analytics (Week 8-9)

#### 3.2.1 Real-time Conversation Analysis

```typescript
// mods/ai/providers/conversation-analyzer.provider.ts
export class ConversationAnalyzer {
    async analyzeConversationTone(messages: Message[]) {
        // Sentiment analysis, urgency detection, satisfaction levels
        const analysis = await generateObject({
            model: aiClient.openai('gpt-4-turbo'),
            schema: z.object({
                sentiment: z.enum(['positive', 'neutral', 'negative']),
                urgency: z.enum(['low', 'medium', 'high']),
                satisfaction: z.number().min(1).max(10),
                topics: z.array(z.string()),
            }),
            prompt: `Analyze this conversation: ${messages.map((m) => m.body).join('\n')}`,
        });

        return analysis.object;
    }

    async detectSalesOpportunities(conversationContext: ConversationContext) {
        // Identify potential upsell/cross-sell opportunities
    }

    async predictNextBestAction(conversationState: ConversationState) {
        // Suggest optimal next steps for sales rep
    }
}
```

**Deliverables:**

-   [ ] Sentiment and tone analysis
-   [ ] Opportunity detection algorithms
-   [ ] Engagement scoring
-   [ ] Next action recommendations

#### 3.2.2 Assistant Performance Analytics

```typescript
// mods/ai/providers/assistant-analytics.provider.ts
export class AssistantAnalytics {
    async trackAssistantPerformance(assistantId: string) {
        // Track metrics per assistant:
        // - Response acceptance rate
        // - Average conversation outcomes
        // - User satisfaction scores
    }

    async compareAssistantEffectiveness() {
        // Compare different assistants' performance
        // Identify which assistants work best for different scenarios
    }
}
```

**Deliverables:**

-   [ ] Assistant performance metrics
-   [ ] Comparative analytics
-   [ ] Effectiveness tracking
-   [ ] Improvement recommendations

### 3.3 Knowledge Management Integration (Week 9-10)

#### 3.3.1 Dynamic Knowledge Base

```typescript
// mods/ai/providers/knowledge-manager.provider.ts
export class KnowledgeManager {
    async updateBrandKnowledge(input: UpdateKnowledgeInput) {
        // Store brand-specific knowledge
        const { brandId, contextType, title, content } = input;

        // Validate and structure the knowledge
        const structuredContent = await this.structureKnowledge(
            content,
            contextType,
        );

        // Store in database
        await db.insert(aiKnowledgeContext).values({
            id: generateId(),
            brandId,
            contextType,
            title,
            content: structuredContent,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    }

    async getBrandKnowledge(brandId: string) {
        // Retrieve all active knowledge for a brand
        return await db.query.aiKnowledgeContext.findMany({
            where: (record, { eq, and }) =>
                and(eq(record.brandId, brandId), eq(record.isActive, true)),
        });
    }
}
```

**Deliverables:**

-   [ ] Brand knowledge management
-   [ ] Knowledge structuring and validation
-   [ ] Knowledge versioning
-   [ ] Knowledge search capabilities

#### 3.3.2 Learning from Interactions

```typescript
// mods/ai/providers/learning-engine.provider.ts
export class LearningEngine {
    async analyzeSuccessfulInteractions(brandId: string) {
        // Learn from successful conversations
        // Identify patterns that lead to positive outcomes
    }

    async improveAssistantBehavior(assistantId: string, feedback: Feedback[]) {
        // Update assistant instructions based on feedback
    }
}
```

**Deliverables:**

-   [ ] Success pattern recognition
-   [ ] Feedback integration system
-   [ ] Assistant improvement mechanisms
-   [ ] Learning metrics tracking

### 3.4 Multi-Channel Coordination (Week 10-11)

#### 3.4.1 Channel-Aware Response Generation

```typescript
// mods/ai/providers/channel-coordinator.provider.ts
export class ChannelCoordinator {
    async optimizeResponseForChannel(
        response: string,
        channelType: 'sms' | 'whatsapp' | 'email',
    ) {
        // Adapt response based on channel constraints
        switch (channelType) {
            case 'sms':
                return this.optimizeForSMS(response);
            case 'whatsapp':
                return this.optimizeForWhatsApp(response);
            case 'email':
                return this.formatForEmail(response);
        }
    }

    private optimizeForSMS(response: string) {
        // Keep it concise for SMS (160 char segments)
        if (response.length <= 160) return response;

        // Use AI to condense while maintaining meaning
        const { text } = await generateText({
            model: aiClient.openai('gpt-4-turbo'),
            prompt: `Condense this message to under 160 characters while keeping the key information: ${response}`,
        });

        return text;
    }
}
```

**Deliverables:**

-   [ ] Channel-specific optimization
-   [ ] Message length management
-   [ ] Format adaptation
-   [ ] Multi-channel consistency

---

## Phase 4: User Interface & Experience

**Duration**: 3-4 weeks  
**Goal**: Create intuitive UI for AI features and ensure seamless integration

### 4.1 AI-Enhanced Conversation View (Week 12-13)

#### 4.1.1 Assistant Selection and Management

```typescript
// mods/ai/components/assistant-selector.component.tsx
export function AssistantSelector({ contactId }: { contactId: string }) {
  const { data: assistants } = useAssistants();
  const { data: currentAssistant } = useConversationAssistant(contactId);
  const assignAssistant = useAssignAssistant();

  return (
    <div className="assistant-selector">
      <div className="current-assistant">
        {currentAssistant ? (
          <AssistantCard assistant={currentAssistant} />
        ) : (
          <p>No assistant assigned</p>
        )}
      </div>

      <Select
        value={currentAssistant?.id}
        onValueChange={(assistantId) =>
          assignAssistant.mutate({ contactId, assistantId })
        }
      >
        {assistants?.map(assistant => (
          <SelectItem key={assistant.id} value={assistant.id}>
            <AssistantOption assistant={assistant} />
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
```

**Components to Develop:**

-   [ ] Assistant selector dropdown
-   [ ] Assistant card display
-   [ ] Assistant creation modal
-   [ ] Assistant customization form

#### 4.1.2 AI Suggestions Panel

```typescript
// mods/ai/components/ai-suggestions-panel.component.tsx
export function AISuggestionsPanel({ contactId }: { contactId: string }) {
  const { data: suggestions, isLoading } = useAISuggestions(contactId);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');

  return (
    <div className="ai-suggestions-panel">
      <div className="panel-header">
        <h3>AI Suggestions</h3>
        <AssistantIndicator contactId={contactId} />
      </div>

      {isLoading ? (
        <SuggestionsSkeleton />
      ) : (
        <div className="suggestions-list">
          {suggestions?.map((suggestion, index) => (
            <SuggestionCard
              key={index}
              suggestion={suggestion}
              onSelect={() => setSelectedSuggestion(suggestion.text)}
              isSelected={selectedSuggestion === suggestion.text}
            />
          ))}
        </div>
      )}

      <div className="suggestion-actions">
        <Button onClick={() => copySuggestion(selectedSuggestion)}>
          Copy to Message
        </Button>
        <Button variant="secondary" onClick={regenerateSuggestions}>
          Regenerate
        </Button>
      </div>
    </div>
  );
}
```

**Features to Implement:**

-   [ ] Real-time suggestion updates
-   [ ] Suggestion style indicators
-   [ ] Copy and edit functionality
-   [ ] Regeneration options

### 4.2 Assistant Management Interface (Week 13-14)

#### 4.2.1 Assistant Creation and Customization

```typescript
// mods/ai/views/assistant-manager.view.tsx
export function AssistantManagerView() {
  const { data: assistants } = useAssistants();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="assistant-manager">
      <div className="manager-header">
        <h2>AI Assistants</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          Create New Assistant
        </Button>
      </div>

      <div className="assistants-grid">
        <div className="system-assistants">
          <h3>System Assistants</h3>
          {assistants?.filter(a => a.isSystemDefault).map(assistant => (
            <AssistantCard key={assistant.id} assistant={assistant} />
          ))}
        </div>

        <div className="custom-assistants">
          <h3>Custom Assistants</h3>
          {assistants?.filter(a => !a.isSystemDefault).map(assistant => (
            <AssistantCard
              key={assistant.id}
              assistant={assistant}
              editable
            />
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateAssistantModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
```

**Management Features:**

-   [ ] Assistant creation wizard
-   [ ] Personality customization
-   [ ] Knowledge area configuration
-   [ ] Performance analytics view

#### 4.2.2 Brand Knowledge Management

```typescript
// mods/ai/components/brand-knowledge-editor.component.tsx
export function BrandKnowledgeEditor({ brandId }: { brandId: string }) {
  const { data: knowledge } = useBrandKnowledge(brandId);
  const updateKnowledge = useUpdateKnowledge();

  return (
    <div className="brand-knowledge-editor">
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        {['products', 'services', 'policies', 'faqs'].map(type => (
          <TabsContent key={type} value={type}>
            <KnowledgeSection
              type={type}
              content={knowledge?.find(k => k.contextType === type)}
              onUpdate={(content) =>
                updateKnowledge.mutate({ brandId, type, content })
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
```

**Knowledge Management Features:**

-   [ ] Rich text editor for knowledge content
-   [ ] Knowledge categorization
-   [ ] Version history
-   [ ] Knowledge validation

### 4.3 Mobile-Responsive Design (Week 14)

#### 4.3.1 Mobile AI Features

-   [ ] Compact assistant selector
-   [ ] Swipeable suggestion cards
-   [ ] Voice input for messages
-   [ ] Quick suggestion actions
-   [ ] Offline suggestion caching

#### 4.3.2 Progressive Enhancement

-   [ ] Graceful degradation for slower connections
-   [ ] Background suggestion generation
-   [ ] Push notifications for AI insights
-   [ ] Reduced motion options

---

## Phase 5: Testing, Optimization & Deployment

**Duration**: 3-4 weeks  
**Goal**: Ensure reliability, performance, and successful production deployment

### 5.1 Testing Strategy (Week 15-16)

#### 5.1.1 Comprehensive Test Suite

```typescript
// tests/ai/conversation-processor.test.ts
describe('ConversationProcessor', () => {
    it('should generate suggestions before creating summaries', async () => {
        const processor = new ConversationProcessor();
        const mockAssistant = createMockAssistant();

        // Process conversation
        const result = await processor.processConversation(
            'contact123',
            'Hello, I need help',
            mockAssistant.id,
        );

        // Verify suggestions were generated
        expect(result.suggestions).toHaveLength(3);

        // Verify summary creation happens after
        expect(mockSummarizationService.createSummary).toHaveBeenCalledAfter(
            mockResponseGenerator.generateSuggestions,
        );
    });

    it('should only summarize older messages', async () => {
        const processor = new ConversationProcessor();
        const messages = generateTestMessages(35); // 35 messages

        await processor.checkAndCreateSummaryIfNeeded('contact123');

        // Should summarize all but the last 10 messages
        expect(mockSummarizationService.createSummary).toHaveBeenCalledWith(
            messages.slice(0, 25),
            'contact123',
        );
    });
});
```

**Testing Areas:**

-   [ ] Unit tests for all AI providers
-   [ ] Integration tests for assistant assignment
-   [ ] Performance tests for context building
-   [ ] Load tests for concurrent processing
-   [ ] End-to-end assistant interaction tests

#### 5.1.2 Assistant Quality Assurance

```typescript
// tests/ai/assistant-quality.test.ts
describe('Assistant Response Quality', () => {
    it('should maintain assistant personality in responses', async () => {
        const salesAssistant = createAssistant({
            specialty: 'sales',
            tone: 'enthusiastic',
        });

        const response = await generateResponse(salesAssistant, testContext);

        const toneAnalysis = await analyzeTone(response);
        expect(toneAnalysis.enthusiasm).toBeGreaterThan(0.7);
    });

    it('should adapt responses to brand context', async () => {
        // Test brand knowledge integration
    });
});
```

**Quality Metrics:**

-   [ ] Assistant personality consistency
-   [ ] Brand knowledge accuracy
-   [ ] Response appropriateness
-   [ ] Channel optimization effectiveness

### 5.2 Performance Optimization (Week 16-17)

#### 5.2.1 AI Processing Optimization

```typescript
// mods/ai/providers/optimization.provider.ts
export class AIOptimizationProvider {
    async optimizeContextBuilding(contactId: string) {
        // Cache frequently accessed context
        // Use database indexes efficiently
        // Implement smart prefetching
    }

    async batchProcessMessages(messages: Message[]) {
        // Process multiple messages efficiently
        // Reuse context between similar requests
    }
}
```

**Optimization Areas:**

-   [ ] Context caching strategies
-   [ ] Database query optimization
-   [ ] Parallel processing for suggestions
-   [ ] Token usage monitoring
-   [ ] Response time optimization

#### 5.2.2 Monitoring & Analytics

```typescript
// mods/ai/providers/ai-monitoring.provider.ts
export class AIMonitoringProvider {
    async trackAssistantUsage(metrics: AssistantMetrics) {
        // Track which assistants are used most
        // Monitor suggestion acceptance rates
        // Measure response generation times
    }

    async alertOnIssues(threshold: Threshold) {
        // Alert on high token usage
        // Notify on AI failures
        // Track cost anomalies
    }
}
```

**Monitoring Setup:**

-   [ ] Assistant usage analytics
-   [ ] Performance metrics dashboard
-   [ ] Cost tracking per brand
-   [ ] Error rate monitoring
-   [ ] User satisfaction tracking

### 5.3 Security & Privacy (Week 17-18)

#### 5.3.1 Data Privacy Implementation

```typescript
// mods/ai/providers/privacy.provider.ts
export class AIPrivacyProvider {
    async sanitizeForAI(data: any) {
        // Remove PII before sending to AI
        // Encrypt sensitive information
        // Implement data retention policies
    }

    async auditAIUsage(brandId: string) {
        // Track what data is processed by AI
        // Generate compliance reports
        // Manage consent preferences
    }
}
```

**Privacy & Security Features:**

-   [ ] PII detection and removal
-   [ ] Encryption for AI data
-   [ ] Audit trails per brand
-   [ ] GDPR compliance tools
-   [ ] Data retention automation

#### 5.3.2 AI Safety Measures

```typescript
// mods/ai/providers/safety.provider.ts
export class AISafetyProvider {
    async validateAssistantResponse(response: string, assistant: AIAssistant) {
        // Check response aligns with assistant guidelines
        // Filter inappropriate content
        // Verify factual accuracy
    }

    async preventHarmfulContent(message: string) {
        // Screen for harmful patterns
        // Implement safety filters
        // Provide fallback responses
    }
}
```

**Safety Implementation:**

-   [ ] Content filtering by assistant type
-   [ ] Response validation pipeline
-   [ ] Harmful content detection
-   [ ] Fallback mechanism design
-   [ ] Safety metrics tracking

### 5.4 Deployment & Rollout (Week 18)

#### 5.4.1 Staged Deployment Strategy

1. **Development Testing**: Complete feature validation
2. **Staging Deployment**: Test with production-like data
3. **Beta Release**: Deploy to select brands/users
4. **Production Rollout**: Gradual deployment with monitoring

#### 5.4.2 Feature Flags & Configuration

```typescript
// mods/ai/providers/feature-flags.provider.ts
export class AIFeatureFlags {
    async isAIEnabledForBrand(brandId: string): Promise<boolean> {
        // Check if brand has AI features enabled
    }

    async getEnabledAssistants(brandId: string): Promise<string[]> {
        // Return list of available assistants for brand
    }

    async getFeatureConfiguration(brandId: string): Promise<AIConfig> {
        // Return brand-specific AI configuration
    }
}
```

**Rollout Plan:**

-   [ ] Per-brand feature enablement
-   [ ] Gradual assistant rollout
-   [ ] Performance monitoring during deployment
-   [ ] Feedback collection system
-   [ ] Rollback procedures

---

## Architecture Considerations

### Technology Stack Integration

**AI-SDK Integration with PostgreSQL:**

```typescript
// Example of AI-SDK with proper error handling
import { generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '@db/providers/server';

export const aiProvider = {
    generateResponse: async (prompt: string, assistantId: string) => {
        try {
            // Get assistant configuration
            const assistant = await db.query.aiAssistant.findFirst({
                where: (record, { eq }) => eq(record.id, assistantId),
            });

            if (!assistant) throw new Error('Assistant not found');

            // Generate response with assistant personality
            const { text } = await generateText({
                model: openai('gpt-4-turbo'),
                system: `You are ${assistant.name}, a ${assistant.specialty} assistant with ${assistant.tone} tone.`,
                prompt,
                maxTokens: 500,
            });

            return text;
        } catch (error) {
            // Handle errors gracefully
            console.error('AI generation failed:', error);
            throw error;
        }
    },
};
```

**Database Integration:**

-   Follow existing PostgreSQL table patterns
-   Use proper foreign key relationships
-   Implement efficient indexing for AI queries
-   Maintain consistency with current naming conventions

**Event System Integration:**

-   Integrate with existing webhook handlers
-   Use established event patterns for AI notifications
-   Maintain real-time updates for suggestions

### Performance & Scalability

**Token Management Strategy:**

-   Build context on-demand to reduce storage
-   Implement smart summarization thresholds
-   Cache frequently used assistant responses
-   Monitor token usage per brand

**Database Optimization:**

-   Index queries by contact and brand
-   Efficient message retrieval with pagination
-   Optimize summary storage and retrieval
-   Consider read replicas for heavy AI queries

**API Rate Limiting:**

-   Implement per-brand rate limits
-   Queue AI requests during peak usage
-   Use exponential backoff for retries
-   Cache common suggestion patterns

### Security & Compliance

**Data Privacy:**

-   Brand-level data isolation
-   Encryption for sensitive AI data
-   Audit trails for assistant actions
-   User consent management

**AI Safety:**

-   Assistant-specific content filters
-   Response validation per specialty
-   Human oversight capabilities
-   Fallback to safe responses

---

## Success Metrics & KPIs

### Technical Metrics

-   **Response Time**: AI suggestions within 2-3 seconds
-   **Context Efficiency**: Stay within token limits 95% of time
-   **Assistant Accuracy**: Suggestions accepted >70% of time
-   **System Uptime**: AI features available 99.5% of time

### Business Metrics

-   **Assistant Adoption**: 80% of conversations use AI assistants
-   **Response Quality**: Improved customer satisfaction by 25%
-   **Sales Efficiency**: Reduced response time by 40%
-   **Brand Satisfaction**: 90% of brands actively using AI features

### User Experience Metrics

-   **Assistant Usage**: Track most effective assistants
-   **Customization Rate**: % of brands creating custom assistants
-   **Suggestion Relevance**: Click-through rate on suggestions
-   **Learning Effectiveness**: Improvement in suggestion quality over time

---

## Risk Mitigation

### Technical Risks

1. **AI API Failures**: Fallback to cached suggestions
2. **Token Limit Issues**: Smart summarization and context management
3. **Performance Impact**: Asynchronous processing and caching
4. **Database Growth**: Automated summary cleanup policies

### Business Risks

1. **Assistant Inconsistency**: Regular quality audits
2. **Brand Confusion**: Clear assistant differentiation
3. **Cost Management**: Per-brand usage limits and monitoring
4. **Privacy Concerns**: Transparent data handling policies

### Operational Risks

1. **Assistant Management**: Intuitive UI for configuration
2. **Knowledge Drift**: Regular knowledge base updates
3. **Multi-channel Complexity**: Channel-specific testing
4. **User Training**: Comprehensive onboarding materials

---

## Future Enhancements

### Phase 6+: Advanced Features

-   **Voice Assistants**: Speech integration for each assistant
-   **Proactive Suggestions**: AI-initiated customer outreach
-   **Assistant Collaboration**: Multiple assistants working together
-   **Advanced Analytics**: Predictive modeling per assistant type

### Emerging Technologies

-   **Multimodal Assistants**: Image and document understanding
-   **Autonomous Actions**: Assistants completing tasks independently
-   **Real-time Learning**: Assistants improving from each interaction
-   **Industry-Specific Assistants**: Specialized assistants for verticals

---

## Conclusion

This implementation plan provides a comprehensive approach to integrating AI virtual assistants into the Monsoft CRM system. By focusing on:

1. **Customizable Assistants**: Allowing brands to create AI personalities that match their needs
2. **Smart Architecture**: Building context on-demand while maintaining performance
3. **Brand-Centric Design**: Organizing knowledge and features around brands
4. **Efficient Processing**: Processing messages first, then summarizing intelligently
5. **Scalable Foundation**: Using PostgreSQL and established patterns for growth

The plan delivers a powerful AI system that enhances sales team capabilities while maintaining the flexibility and reliability expected from a modern CRM platform.

**Estimated Total Timeline**: 18 weeks (approximately 4.5 months)  
**Team Size**: 3-4 developers (1 AI specialist, 2-3 full-stack developers)  
**Key Success Factors**: Strong assistant differentiation, efficient context management, and seamless brand integration
