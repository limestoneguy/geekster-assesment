import '../styles/globals.scss'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body className='bg-blue-50'>{children}</body>
    </html>
  )
}
