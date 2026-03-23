// src/lib/fallbackData.js
// Used when the Windsor API is unavailable or returns no data.
// Update these manually or regenerate via Claude when needed.

export const shopify30d = { orders: 943, grossSales: 28625.9, netSales: 23592.57 }
export const subscribers = 1200

export const skioWeekly = [
  { week: 'W07', orders: 58,  revenue: 1479.51 },
  { week: 'W08', orders: 238, revenue: 6336.95 },
  { week: 'W09', orders: 266, revenue: 5677.70 },
  { week: 'W10', orders: 159, revenue: 3087.77 },
  { week: 'W11', orders: 209, revenue: 5855.85 },
]

export const ga4Weekly = [
  { week: 'W04', users: 337, newUsers: 284, sessions: 396, engagedSessions: 131, engagementRate: 33.1, bounceRate: 66.9 },
  { week: 'W05', users: 350, newUsers: 288, sessions: 403, engagedSessions: 124, engagementRate: 30.8, bounceRate: 69.2 },
  { week: 'W06', users: 314, newUsers: 273, sessions: 351, engagedSessions: 97,  engagementRate: 27.6, bounceRate: 72.4 },
  { week: 'W07', users: 280, newUsers: 240, sessions: 305, engagedSessions: 78,  engagementRate: 25.6, bounceRate: 74.4 },
  { week: 'W08', users: 392, newUsers: 338, sessions: 436, engagedSessions: 103, engagementRate: 23.6, bounceRate: 76.4 },
  { week: 'W09', users: 292, newUsers: 246, sessions: 331, engagedSessions: 88,  engagementRate: 26.6, bounceRate: 73.4 },
  { week: 'W10', users: 245, newUsers: 222, sessions: 276, engagedSessions: 62,  engagementRate: 22.5, bounceRate: 77.5 },
  { week: 'W11', users: 576, newUsers: 512, sessions: 610, engagedSessions: 130, engagementRate: 21.3, bounceRate: 78.7 },
  { week: 'W12*', users: 67, newUsers: 56,  sessions: 73,  engagedSessions: 15,  engagementRate: 20.6, bounceRate: 79.4 },
]

export const klaviyoWeekly = [
  { week: 'W07', subscribed: 1, unsubscribed: 0,  revenue: 1769.51 },
  { week: 'W08', subscribed: 2, unsubscribed: 0,  revenue: 7692.77 },
  { week: 'W09', subscribed: 1, unsubscribed: 0,  revenue: 8332.63 },
  { week: 'W10', subscribed: 6, unsubscribed: 95, revenue: 4851.55 },
  { week: 'W11', subscribed: 4, unsubscribed: 57, revenue: 8508.92 },
]

export const lastCampaign = {
  recipients: 3844,
  uniqueOpens: 1723,
  openRate: 45.1,
  uniqueClicks: 9,
  conversionValue: 3036.05,
  unsubscribes: 55,
}

export const dailyData = [
  { date: '09 Mar', shopifyOrders: 41, shopifyRevenue: 159.71,  users: 222, sessions: 227, engagedSessions: 44, klaviyoRevenue: 1019.66 },
  { date: '10 Mar', shopifyOrders: 20, shopifyRevenue: 491.49,  users: 129, sessions: 135, engagedSessions: 16, klaviyoRevenue: 589.82  },
  { date: '11 Mar', shopifyOrders: 21, shopifyRevenue: 499.80,  users: 52,  sessions: 54,  engagedSessions: 14, klaviyoRevenue: 599.80  },
  { date: '12 Mar', shopifyOrders: 17, shopifyRevenue: 399.84,  users: 41,  sessions: 42,  engagedSessions: 11, klaviyoRevenue: 479.84  },
  { date: '13 Mar', shopifyOrders: 18, shopifyRevenue: 119.85,  users: 38,  sessions: 43,  engagedSessions: 18, klaviyoRevenue: 503.84  },
  { date: '14 Mar', shopifyOrders: 17, shopifyRevenue: 537.34,  users: 47,  sessions: 48,  engagedSessions: 12, klaviyoRevenue: 638.84  },
  { date: '15 Mar', shopifyOrders: 31, shopifyRevenue: 1691.39, users: 67,  sessions: 73,  engagedSessions: 15, klaviyoRevenue: 2029.72 },
  { date: '16 Mar', shopifyOrders: 26, shopifyRevenue: 890.61,  users: 60,  sessions: 63,  engagedSessions: 14, klaviyoRevenue: 1068.77 },
  { date: '17 Mar', shopifyOrders: 35, shopifyRevenue: 565.71,  users: 49,  sessions: 53,  engagedSessions: 15, klaviyoRevenue: 869.71  },
  { date: '18 Mar', shopifyOrders: 34, shopifyRevenue: 1867.82, users: 57,  sessions: 61,  engagedSessions: 18, klaviyoRevenue: 2241.45 },
  { date: '19 Mar', shopifyOrders: 36, shopifyRevenue: 699.72,  users: 48,  sessions: 51,  engagedSessions: 11, klaviyoRevenue: 839.72  },
  { date: '20 Mar', shopifyOrders: 34, shopifyRevenue: 699.72,  users: 42,  sessions: 45,  engagedSessions: 10, klaviyoRevenue: 839.72  },
  { date: '21 Mar', shopifyOrders: 20, shopifyRevenue: 521.50,  users: 40,  sessions: 43,  engagedSessions: 11, klaviyoRevenue: 619.83  },
  { date: '22 Mar', shopifyOrders: 24, shopifyRevenue: 574.77,  users: 44,  sessions: 46,  engagedSessions: 8,  klaviyoRevenue: 689.77  },
]
