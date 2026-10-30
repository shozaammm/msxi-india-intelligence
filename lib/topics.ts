// Rule-based topic tags for headlines. Transparent and cheap; swap for a
// small-model classifier later (run it in a batch job, never per page view).

export const TOPICS = [
  { id: 'launch', label: 'Launches', pattern: /\b(launch(es|ed)?|unveil(s|ed)?|debut(s|ed)?|revealed?|introduc(es|ed)|first look|bookings? open)\b/i },
  { id: 'pricing', label: 'Pricing', pattern: /\b(price[ds]?|pricing|hike|discounts?|offers?|lakh|crore)\b|₹|\brs\.?\s?\d/i },
  { id: 'sales', label: 'Sales & market', pattern: /\b(sales|sold|units|registrations?|market share|retail|wholesale|deliver(y|ies|ed)|fada|siam|vahan)\b/i },
  { id: 'ev', label: 'EV & tech', pattern: /\b(ev|evs|electric|battery|charging|hybrid|phev|bev|software|autonomous|adas)\b/i },
  { id: 'policy', label: 'Policy & industry', pattern: /\b(gst|tariff|duty|policy|government|regulat\w*|emission|bs-?vi|plant|investment|factory|localis\w*|jobs?)\b/i },
  { id: 'performance', label: 'Performance & motorsport', pattern: /\b(amg|m division|track|race|racing|formula|f1|motorsport|horsepower|hp|bhp|drift|nurburgring)\b/i },
  { id: 'review', label: 'Reviews & drives', pattern: /\b(review|first drive|test drive|road test|driven|comparison|vs\.?)\b/i },
  { id: 'recall', label: 'Recalls & safety', pattern: /\b(recall(s|ed)?|safety|crash test|ncap|airbag|defect|investigation)\b/i },
] as const

export type TopicId = (typeof TOPICS)[number]['id']

export function classifyTopics(text: string): TopicId[] {
  return TOPICS.filter((t) => t.pattern.test(text)).map((t) => t.id)
}

export function topicLabel(id: string): string {
  return TOPICS.find((t) => t.id === id)?.label ?? id
}

// Stories that name a car brand but are not automotive news (court cases, crime, HR/finance gossip).
const OFF_TOPIC = /\b(judge|court|high court|arrest(ed)?|bail|police|murder|accused|hit[- ]and[- ]run|lawsuit|sues?|buyouts?|layoffs?|celebrity|wedding|actor|actress|cricketer)\b/i

/** Keep only car sales, launches, pricing, features, tech, reviews, recalls and industry news. */
export function isAutoRelevant(headline: string, snippet = ''): boolean {
  if (OFF_TOPIC.test(`${headline} ${snippet}`)) return false
  // The headline itself must carry an automotive signal; a snippet alone is too loose.
  return classifyTopics(headline).length > 0
}
