import { BRAND_INTEL } from '@/config/intel.config'
import type { BrandId, BrandIntel } from '@/types'

// Today the figures are hand-maintained in config. When a database or a
// scheduled FADA import exists, swap this for a fetch; callers won't change.
export function getBrandIntel(brand: BrandId): BrandIntel {
  return BRAND_INTEL[brand]
}
