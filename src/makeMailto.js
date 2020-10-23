export function makeMailto({to, cc, bcc, subject, body}) {
  // URI.js doesn't work well with mailto, because React escapes the "&" set by
  // URI.setQuery()
  const uri = `mailto:${to}`

  const parameters = Object.entries({cc, bcc, subject, body}).reduce(
    (acc, [key, value]) => {
      if (value != null) {
        acc.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
      return acc
    },
    [],
    // 0x0026 is "&", which would otherwise be escaped by React
  ).join(String.fromCharCode(0x0026))

  if (parameters) return uri + '?' + parameters

  return uri
}
