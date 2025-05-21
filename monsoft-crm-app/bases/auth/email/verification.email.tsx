import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

const THEME = {
    colors: {
        brand: '#2250f4',
        offwhite: '#fafbfb',
        text: '#1b1b1f',
    },
    spacing: {
        0: '0px',
        16: '16px',
        24: '24px',
        40: '40px',
    },
};

const translations = {
    en: {
        preview: 'Verify your email to start using Monsoft CRM',
        welcome: 'Welcome to Monsoft CRM',
        message:
            'Thanks for signing up! Click the button below to confirm your email address and activate your account.',
        buttonText: 'Verify Email',
        fallback:
            "If the button doesn't work, copy & paste this link into your browser:",
        footerMessage:
            "You received this email because you signed up for Monsoft CRM. If you didn't create an account, you can safely ignore this message.",
    },
    es: {
        preview:
            'Verifica tu correo electrónico para comenzar a usar Monsoft CRM',
        welcome: 'Bienvenido a Monsoft CRM',
        message:
            '¡Gracias por registrarte! Haz clic en el botón a continuación para confirmar tu dirección de correo electrónico y activar tu cuenta.',
        buttonText: 'Verificar Correo',
        fallback:
            'Si el botón no funciona, copia y pega este enlace en tu navegador:',
        footerMessage:
            'Recibiste este correo electrónico porque te registraste en Monsoft CRM. Si no creaste una cuenta, puedes ignorar este mensaje.',
    },
};

export const VerificationEmail = ({
    url,
    language = 'en',
}: {
    url: string;
    language?: string;
}) => {
    const lang = language === 'es' ? 'es' : 'en';
    const t = translations[lang];

    return (
        <Html lang={lang}>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: THEME.colors,
                            spacing: THEME.spacing,
                        },
                    },
                }}
            >
                <Head />

                <Preview>{t.preview}</Preview>

                <Body className="bg-offwhite text-text font-sans text-base leading-relaxed">
                    {/* Accent bar */}
                    <Section className="bg-brand h-1" role="presentation" />

                    <Container className="mx-auto max-w-[600px] rounded-lg bg-white p-24 shadow-sm">
                        {/* Header */}
                        <Heading
                            as="h1"
                            className="mb-16 mt-0 text-center text-2xl font-semibold"
                        >
                            {t.welcome}
                        </Heading>

                        <Text className="mb-24">{t.message}</Text>

                        <Section className="mb-24 text-center">
                            <Button
                                href={url}
                                rel="noopener noreferrer"
                                aria-label="Verify email address"
                                className="bg-brand rounded-lg px-6 py-3 font-medium text-white"
                            >
                                {t.buttonText}
                            </Button>
                        </Section>

                        {/* Fallback link (hidden ≥640px) */}
                        <Text className="text-center text-xs text-gray-500 sm:hidden">
                            {t.fallback}
                            <br />
                            <a
                                href={url}
                                rel="noopener noreferrer"
                                className="break-all"
                            >
                                {url}
                            </a>
                        </Text>

                        <Hr className="my-24 border-t border-gray-200" />

                        <Text className="mt-24 text-center text-xs text-gray-500">
                            {t.footerMessage}
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
