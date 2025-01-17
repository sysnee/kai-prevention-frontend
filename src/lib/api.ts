import { RequestOptions } from 'http'
import { getSession, signIn } from 'next-auth/react'
import jwt from 'jsonwebtoken'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1'

async function handleResponse(response: Response) {
  if (response.status === 401 || response.status === 403) {
    signIn('auth0')
    return
  }

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || `Error: ${response.status}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

const apiCall = async (url: string, options: RequestOptions & { body?: any; params?: any }) => {
  const { method, headers = {}, body = null, params = {} } = options
  const session = await getSession()

  if (!session) {
    signIn('auth0')
    throw new Error('No session found')
  }

  const queryString = new URLSearchParams(params).toString()
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`
  const normalizedBaseUrl = API_BASE_URL.endsWith('/')
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL

  const fullUrl = `${normalizedBaseUrl}${normalizedUrl}${queryString ? `?${queryString}` : ''}`
  const sessionJwt = jwt.sign(session.user, 'any')

  const fetchOptions = {
    method,
    body,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Session: 'Bearer ' + sessionJwt,
      Authorization: 'Bearer ' + (session as any)['accessToken'],
      ...headers
    }
  }

  if (body) {
    fetchOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(fullUrl, fetchOptions as RequestInit)
    return await handleResponse(response)
  } catch (error: any) {
    const errorMessage = error.message || 'Network error'
    throw new Error(`API Error: ${errorMessage}`)
  }
}

export default {
  get: async (url: string, options?: any) => apiCall(url, { method: 'GET', ...options }),
  post: async (url: string, body?: any, options?: any) => apiCall(url, { method: 'POST', body, ...options, }),
  put: async (url: string, body?: any, options?: any) => apiCall(url, { method: 'PUT', body, ...options }),
  delete: async (url: string, options?: any) => apiCall(url, { method: 'DELETE', ...options }),
  patch: async (url: string, body?: any, options?: any) => apiCall(url, { method: 'PATCH', body, ...options })
}
