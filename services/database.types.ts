
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          agency_owner_id: string
          name: string
          email: string
          status: "Active" | "Pending" | "Inactive"
          created_at: string
          avatar: string
        }
        Insert: {
          id?: string
          agency_owner_id: string
          name: string
          email: string
          status?: "Active" | "Pending" | "Inactive"
          created_at?: string
          avatar: string
        }
        Update: {
          agency_owner_id?: string
          name?: string
          email?: string
          status?: "Active" | "Pending" | "Inactive"
          created_at?: string
          avatar?: string
        }
        Relationships: []
      }
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          user_id?: string
          message?: string
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          primary_niche: string | null
          platforms: ("tiktok" | "instagram" | "youtube")[] | null
          preferred_tone: string | null
          isPersonalized: boolean
          plan: "basic" | "unlimited" | "dfy" | "agency"
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          primary_niche?: string | null
          platforms?: ("tiktok" | "instagram" | "youtube")[] | null
          preferred_tone?: string | null
          isPersonalized?: boolean
          plan?: "basic" | "unlimited" | "dfy" | "agency"
        }
        Update: {
          name?: string
          email?: string
          avatar_url?: string | null
          primary_niche?: string | null
          platforms?: ("tiktok" | "instagram" | "youtube")[] | null
          preferred_tone?: string | null
          isPersonalized?: boolean
          plan?: "basic" | "unlimited" | "dfy" | "agency"
        }
        Relationships: []
      }
      scripts: {
        Row: {
          id: string
          user_id: string
          folder_id: string | null
          title: string
          hook: string
          script: string
          tone: string
          viral_score_breakdown: Json | null
          visuals: string[] | null
          niche: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          folder_id?: string | null
          title: string
          hook: string
          script: string
          tone: string
          viral_score_breakdown?: Json | null
          visuals?: string[] | null
          niche?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          folder_id?: string | null
          title?: string
          hook?: string
          script?: string
          tone?: string
          viral_score_breakdown?: Json | null
          visuals?: string[] | null
          niche?: string | null
          created_at?: string
        }
        Relationships: []
      }
      watched_trends: {
        Row: {
          id: string
          user_id: string
          trend_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trend_data: Json
          created_at?: string
        }
        Update: {
          user_id?: string
          trend_data?: Json
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}