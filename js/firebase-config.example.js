// Recommended architecture:
// - Raw employer responses: restricted Firebase collection.
// - Public website: reads only a reviewed, pre-aggregated public findings document.
// - Never expose respondent-level records to the public client.
// Add the real Firebase config only after project/collection names and security rules are confirmed.
