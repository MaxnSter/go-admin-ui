export { parseTime, formatTime } from '@/utils'

function pluralize(time: number, label: string): string {
  return time === 1 ? `${time}${label}` : `${time}${label}s`
}

export function timeAgo(time: number): string {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(Math.floor(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(Math.floor(between / 3600), ' hour')
  }
  return pluralize(Math.floor(between / 86400), ' day')
}

export function numberFormatter(num: number, digits: number): string {
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' }
  ]
  for (const item of si) {
    if (num >= item.value) {
      return (
        num / item.value
      ).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + item.symbol
    }
  }
  return String(num)
}

export function toThousandFilter(num: number | string): string {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function uppercaseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
