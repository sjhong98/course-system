import ThemeSyncToastContainer from '@/shared/components/ui/ThemeSyncToastContainer'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Geist, Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

import '@/app/globals.css'
import { THEME_COOKIE_NAME } from '@/shared/libs/utils/theme'
import Providers from '@/app/Providers'
import MobileWrapper from '@/shared/components/container/MobileWrapper'

const pretendard = localFont({
  src: [
    { path: './fonts/Pretendard-Thin.otf', weight: '100' },
    { path: './fonts/Pretendard-ExtraLight.otf', weight: '200' },
    { path: './fonts/Pretendard-Light.otf', weight: '300' },
    { path: './fonts/Pretendard-Regular.otf', weight: '400' },
    { path: './fonts/Pretendard-Medium.otf', weight: '500' },
    { path: './fonts/Pretendard-SemiBold.otf', weight: '600' },
    { path: './fonts/Pretendard-Bold.otf', weight: '700' },
    { path: './fonts/Pretendard-ExtraBold.otf', weight: '800' },
    { path: './fonts/Pretendard-Black.otf', weight: '900' },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'COURSE',
  description: 'COURSE SYSTEM',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const theme = cookieStore.get(THEME_COOKIE_NAME)?.value === 'dark' ? 'dark' : 'light'

  return (
    <html lang="ko" className={theme === 'dark' ? 'dark' : ''} suppressHydrationWarning>
      <body className={`${pretendard.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased h-screen m-0`}>
        <ThemeSyncToastContainer
          className="!max-w-[500px]"
          position="top-center"
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="flex flex-col min-w-screen h-screen items-center">
          <Providers>
            <MobileWrapper>{children}</MobileWrapper>
          </Providers>
        </div>
      </body>
    </html>
  )
}
