import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { googleTranslate, microsoftTranslate } from '../../api'

type MockResponseOverrides = Partial<
  Pick<Response, 'ok' | 'status' | 'statusText'> & {
    json: () => Promise<unknown>
    text: () => Promise<string>
  }
>

function createMockResponse(overrides: MockResponseOverrides = {}): Response {
  return ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({}),
    text: async () => '',
    ...overrides,
  }) as Response
}

const originalFetch = globalThis.fetch
const fetchMock = vi.fn<typeof fetch>()

beforeAll(() => {
  globalThis.fetch = fetchMock as unknown as typeof fetch
})

beforeEach(() => {
  fetchMock.mockReset()
})

afterAll(() => {
  globalThis.fetch = originalFetch
})

describe('googleTranslate', () => {
  it('should translate text', async () => {
    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        json: async () => [[['图书馆']]],
      }),
    )

    const result = await googleTranslate('Library', 'en', 'zh')
    expect(result).toBe('图书馆')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('tl=zh'),
      expect.objectContaining({ method: 'GET' }),
    )
  })
  it('should translate text to traditional chinese', async () => {
    fetchMock.mockResolvedValueOnce(
      createMockResponse({
        json: async () => [[['圖書館']]],
      }),
    )

    const result = await googleTranslate('Library', 'en', 'zh-TW')
    expect(result).toBe('圖書館')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('tl=zh-TW'),
      expect.objectContaining({ method: 'GET' }),
    )
  })
})

describe('microsoftTranslate', () => {
  it('should translate text', async () => {
    fetchMock
      .mockResolvedValueOnce(
        createMockResponse({
          text: async () => 'mock-token',
        }),
      )
      .mockResolvedValueOnce(
        createMockResponse({
          json: async () => [
            {
              translations: [{ text: '图书馆' }],
            },
          ],
        }),
      )

    const result = await microsoftTranslate('Library', 'en', 'zh')
    expect(result).toBe('图书馆')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const firstCall = fetchMock.mock.calls[0]
    expect(firstCall).toBeDefined()
    expect(String(firstCall?.[0])).toContain('edge.microsoft.com/translate/auth')
    const secondCall = fetchMock.mock.calls[1]
    expect(secondCall).toBeDefined()
    expect(String(secondCall?.[0])).toContain('to=zh')
    expect(secondCall?.[1]).toMatchObject({
      headers: expect.objectContaining({
        'Authorization': 'Bearer mock-token',
        'Ocp-Apim-Subscription-Key': 'mock-token',
      }),
      method: 'POST',
    })
    expect(secondCall?.[1]?.body).toContain('Library')
  })
  it('should translate text to traditional chinese', async () => {
    fetchMock
      .mockResolvedValueOnce(
        createMockResponse({
          text: async () => 'mock-token',
        }),
      )
      .mockResolvedValueOnce(
        createMockResponse({
          json: async () => [
            {
              translations: [{ text: '圖書館' }],
            },
          ],
        }),
      )

    const result = await microsoftTranslate('Library', 'en', 'zh-TW')
    expect(result).toBe('圖書館')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const secondCall = fetchMock.mock.calls[1]
    expect(secondCall).toBeDefined()
    expect(String(secondCall?.[0])).toContain('to=zh-TW')
    expect(secondCall?.[1]?.body).toContain('Library')
  })
})
