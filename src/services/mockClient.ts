function delay(ms = 180): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockRequest<T>(data: T, ms?: number): Promise<T> {
  await delay(ms);
  return structuredClone(data);
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
): { data: T[]; total: number; page: number; pageSize: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
