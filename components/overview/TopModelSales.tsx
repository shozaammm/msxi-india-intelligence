'use client'
import Link from 'next/link'
import { ModelSalesBoard } from '@/components/sales/ModelSalesBoard'
import { Panel } from '@/components/ui/Panel'

/** Best-selling luxury cars in India across all brands, by units. */
export function TopModelSales() {
  return (
    <Panel
      title="Best-selling cars"
      kicker="Models, by units sold"
      footer={<p className="text-[12px] text-fg-3">Other periods, brand totals and more: <Link href="/sales" className="underline underline-offset-2 hover:text-fg">Sales rankings</Link></p>}
    >
      <ModelSalesBoard period="cy2025" limit={10} showFilter={false} />
    </Panel>
  )
}
