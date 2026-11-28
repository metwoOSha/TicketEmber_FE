import Checkout from '@/base/site/Checkout/Checkout';

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <Checkout id={id} />;
}
