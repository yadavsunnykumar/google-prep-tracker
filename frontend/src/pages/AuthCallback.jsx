import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spinner } from '../components/ui'

// This page handles the redirect from GitHub/Google OAuth
// URL: /auth/callback?token=<jwt>  OR  /auth/callback?error=<reason>
export default function AuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const error = params.get('error')

    if (token) {
      localStorage.setItem('token', token)
      // Force a page reload so AuthContext picks up the new token
      window.location.href = '/dashboard'
    } else {
      const msg = error === 'github_not_configured' ? 'GitHub OAuth is not configured on this server.'
                : error === 'google_not_configured' ? 'Google OAuth is not configured on this server.'
                : 'OAuth login failed. Please try again.'
      navigate(`/login?oauthError=${encodeURIComponent(msg)}`, { replace: true })
    }
  }, [])   // eslint-disable-line

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Spinner size={32} />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Signing you in…</p>
      </div>
    </div>
  )
}
