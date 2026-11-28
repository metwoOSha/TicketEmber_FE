import Button from '@/components/Button/Button';
import PageContainer from '@/components/PageContainer/PageContainer';
import cls from './Result.module.css';

export type ResultStatus = 'paid' | 'declined' | 'expired';

type Props = { status: ResultStatus; orderId: string; sessionId?: string; summary?: string };

const VARIANTS = {
    paid: {
        kicker: 'PAYMENT SUCCESSFUL',
        word: 'Enjoy.',
        text: 'Your tickets are ready and were sent to your email.',
        glow: 'rgb(40 170 115 / 0.45)',
        accent: 'var(--color-success)',
        cta: 'View tickets',
    },
    declined: {
        kicker: 'PAYMENT FAILED',
        word: 'Declined.',
        text: 'The payment did not go through. Your seats are still held, so you can try again before the timer ends.',
        glow: 'rgb(220 70 70 / 0.4)',
        accent: 'var(--color-danger)',
        cta: 'Try again',
    },
    expired: {
        kicker: 'ORDER EXPIRED',
        word: 'Too late.',
        text: 'The 15 minutes are over and the seats were released. You can pick seats again if they are still free.',
        glow: 'rgb(230 160 60 / 0.4)',
        accent: 'var(--color-warning)',
        cta: 'Choose seats again',
    },
} as const;

/** Outcome of a payment: paid, declined or expired. */
export default function Result({ status, orderId, sessionId, summary }: Props) {
    const v = VARIANTS[status];
    const href =
        status === 'paid'
            ? `/tickets/${orderId}`
            : status === 'declined'
              ? `/checkout/${orderId}`
              : sessionId
                ? `/seats/${sessionId}`
                : '/';

    return (
        <PageContainer>
            <div
                className={cls.glow}
                style={{ background: `radial-gradient(ellipse 70% 70% at 50% 45%, ${v.glow} 0%, transparent 70%)` }}
            />
            <div className={cls.content}>
                <span className={cls.kicker} style={{ color: v.accent }}>
                    {v.kicker}
                </span>
                <h1 className={cls.word}>{v.word}</h1>
                <p className={cls.text}>{v.text}</p>
                {status === 'paid' && summary && <p className={cls.summary}>{summary}</p>}
                <div className={cls.actions}>
                    <Button href={href} arrow>
                        {v.cta}
                    </Button>
                    <Button href="/" variant="ghost">
                        Back to now showing
                    </Button>
                </div>
            </div>
        </PageContainer>
    );
}
