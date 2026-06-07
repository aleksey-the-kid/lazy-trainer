import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void
  onError?: () => void
}

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  return (
    <div className="flex w-full justify-center [&>div]:w-full [&>div]:flex [&>div]:justify-center">
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
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="pill"
        width="280"
      />
    </div>
  )
}
