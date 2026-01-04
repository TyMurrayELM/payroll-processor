import './globals.css'

export const metadata = {
  title: 'Payroll Processor - Encore Landscape Management',
  description: 'Convert Aspire exports to NetSuite upload format',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js" defer></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
