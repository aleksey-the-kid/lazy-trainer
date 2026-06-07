import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void
  onError?: () => void
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  return (
    <GoogleLogin
      onSuccess={(response: CredentialResponse) => {
        if (response.credential) {
          onSuccess(response.credential)
        } else {
          onError?.()
        }
      }}
      onError={() => onError?.()}
      useOneTap={false}
      theme="outline"
      size="large"
      text="signin_with"
      shape="rectangular"
    />
  )
}
