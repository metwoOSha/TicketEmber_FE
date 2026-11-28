// TODO: remove with the mocks. Fakes network latency so loading states are visible.
export const mockDelay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
