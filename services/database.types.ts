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
          avatar: string | null
        }
        Insert: {
          id?: string
          agency_owner_id: string
          name: string
          email: string
          status: "Active" | "Pending" | "Inactive"
          created_at?: string
          avatar?: string | null
        }
        Update: {
          id?: string
          agency_owner_id?: string
          name?: string
          email?: string
          status?: "Active" | "Pending" | "Inactive"
          created_at?: string
          avatar?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_agency_owner_id_fkey"
            columns: ["agency_owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          id?: string
          user_id?: string
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          id?: string
          user_id?: string
          message?: string
          read?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          primary_niche?: string | null
          platforms?: ("tiktok" | "instagram" | "youtube")[] | null
          preferred_tone?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          primary_niche?: string | null
          platforms?: ("tiktok" | "instagram" | "youtube")[] | null
          preferred_tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          id?: string
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
        Relationships: [
          {
            foreignKeyName: "scripts_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scripts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          id?: string
          user_id?: string
          trend_data?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "watched_trends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}