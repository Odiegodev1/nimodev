const formatter = new Intl.RelativeTimeFormat("pt-BR", {
    numeric: "auto",
  })
  
  export function formatRelativeTime(
    date: Date | string
  ): string {
    const timestamp = new Date(date).getTime()
  
    if (!Number.isFinite(timestamp)) {
      return "Data indisponível"
    }
  
    const seconds = Math.max(
      0,
      Math.floor((Date.now() - timestamp) / 1000)
    )
  
    if (seconds < 60) {
      return "agora"
    }
  
    const minutes = Math.floor(seconds / 60)
  
    if (minutes < 60) {
      return formatter.format(-minutes, "minute")
    }
  
    const hours = Math.floor(minutes / 60)
  
    if (hours < 24) {
      return formatter.format(-hours, "hour")
    }
  
    const days = Math.floor(hours / 24)
  
    if (days < 30) {
      return formatter.format(-days, "day")
    }
  
    const months = Math.floor(days / 30)
  
    if (months < 12) {
      return formatter.format(-months, "month")
    }
  
    return formatter.format(
      -Math.floor(months / 12),
      "year"
    )
  }