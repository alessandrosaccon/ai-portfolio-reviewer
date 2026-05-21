export interface UserProfile {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  userId: string
  defaultJobTitle?: string
  emailNotifications: boolean
}
