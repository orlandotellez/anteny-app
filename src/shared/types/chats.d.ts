export interface IChatItem {
  id: string
  avatar: string
  name: string
  message: string
  time: string
  unread?: number
  online?: boolean
}
