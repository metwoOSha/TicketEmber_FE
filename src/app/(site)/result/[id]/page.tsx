import ResultContainer from '@/base/site/Result/ResultContainer';

export default async function ResultPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ status?: string }>;
}) {
    const { id } = await params;
    const { status } = await searchParams;
    return <ResultContainer id={id} status={status} />;
}
