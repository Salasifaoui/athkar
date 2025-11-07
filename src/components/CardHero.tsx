import { Card } from '@/components/ui/card';
export default function CardHero({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <Card className={`p-5 rounded-2xl max-w-[360px] m-3 border-2 border-primary-400 ${className}`}>
      {children}
    </Card>
  );
}