import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../src/tooltip';

interface CreditBreakdownRow {
  label: string;
  value: string;
}

const rows: CreditBreakdownRow[] = [
  { label: 'Monthly allowance', value: '1,200' },
  { label: 'Top-up balance', value: '650' },
  { label: 'Campaign bonus', value: '175' },
];

const total = '2,025';

function CreditBreakdown({
  breakdownRows,
  breakdownTotal,
}: {
  breakdownRows: CreditBreakdownRow[];
  breakdownTotal: string;
}) {
  return (
    <div className="rounded-md border border-background/20">
      <div className="space-y-1 p-3">
        {breakdownRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-6">
            <span>{row.label}</span>
            <span className="font-medium">{row.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-6 border-t border-background/20 p-3 font-semibold">
        <span>Ready to use</span>
        <span>{breakdownTotal}</span>
      </div>
    </div>
  );
}

const meta = {
  title: 'shadcn-ui/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover for details</Button>
      </TooltipTrigger>
      <TooltipContent>Helpful context appears inside the tooltip.</TooltipContent>
    </Tooltip>
  ),
};

export const WithCreditBreakdown: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Inspect balance</Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm p-4" sideOffset={8}>
        <div className="space-y-3">
          <p className="text-sm font-semibold">Usage Balance</p>
          <ul className="list-disc space-y-1 pl-4 text-xs">
            <li>This amount is the balance currently eligible for new actions.</li>
            <li>
              It combines recurring allowance, manual top-ups, vouchers, and active
              campaign grants.
            </li>
            <li>Balances closest to expiry are selected before longer-lived balances.</li>
          </ul>
          <CreditBreakdown breakdownRows={rows} breakdownTotal={total} />
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};
