import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface GridPatternCardProps {
  children: React.ReactNode;
  className?: string;
  patternClassName?: string;
  gradientClassName?: string;
  delay?: number;
}

export function GridPatternCard({
  children,
  className,
  patternClassName,
  gradientClassName,
  delay = 0,
}: GridPatternCardProps) {
  return (
    <motion.div
      className={cn(
        'border w-full rounded-xl overflow-hidden',
        'bg-[#0d0a1a]',
        'border-white/8',
        'p-3',
        className
      )}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      <div
        className={cn(
          'size-full bg-repeat bg-[length:30px_30px]',
          'bg-grid-pattern',
          patternClassName
        )}
      >
        <div
          className={cn(
            'size-full bg-gradient-to-tr',
            'from-[#0d0a1a]/95 via-[#0d0a1a]/55 to-[#0d0a1a]/5',
            gradientClassName
          )}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function GridPatternCardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-left p-4 md:p-6', className)} {...props} />;
}
