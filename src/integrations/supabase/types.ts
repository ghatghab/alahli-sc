export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      competitions: {
        Row: {
          country: string | null
          created_at: string
          ext_id: string | null
          id: string
          logo_url: string | null
          name_ar: string | null
          name_en: string
          name_fr: string | null
          season: string | null
          source: string
          sport: string
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          ext_id?: string | null
          id?: string
          logo_url?: string | null
          name_ar?: string | null
          name_en: string
          name_fr?: string | null
          season?: string | null
          source?: string
          sport: string
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          ext_id?: string | null
          id?: string
          logo_url?: string | null
          name_ar?: string | null
          name_en?: string
          name_fr?: string | null
          season?: string | null
          source?: string
          sport?: string
          updated_at?: string
        }
        Relationships: []
      }
      fixtures: {
        Row: {
          away_score: number | null
          away_team_id: string | null
          competition_id: string | null
          created_at: string
          ext_id: string | null
          home_score: number | null
          home_team_id: string | null
          id: string
          kickoff_at: string
          raw: Json | null
          source: string
          sport: string
          status: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_id?: string | null
          competition_id?: string | null
          created_at?: string
          ext_id?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          kickoff_at: string
          raw?: Json | null
          source?: string
          sport: string
          status?: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_id?: string | null
          competition_id?: string | null
          created_at?: string
          ext_id?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          kickoff_at?: string
          raw?: Json | null
          source?: string
          sport?: string
          status?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fixtures_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "sport_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "sport_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          author_id: string | null
          category_id: string | null
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string
          id: string
          published: boolean
          published_at: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "news_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      news_categories: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name_ar: string
          name_en: string
          name_fr: string
          slug: string
          sort_order: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name_ar: string
          name_en: string
          name_fr: string
          slug: string
          sort_order?: number
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string
          name_fr?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      news_translations: {
        Row: {
          article_id: string
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          locale: string
          title: string
          updated_at: string
        }
        Insert: {
          article_id: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          locale: string
          title: string
          updated_at?: string
        }
        Update: {
          article_id?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          locale?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_translations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          album: string
          created_at: string
          id: string
          image_url: string
          sort_order: number
          taken_at: string | null
          title_ar: string | null
          title_en: string | null
          title_fr: string | null
          updated_at: string
        }
        Insert: {
          album?: string
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          taken_at?: string | null
          title_ar?: string | null
          title_en?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Update: {
          album?: string
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          taken_at?: string | null
          title_ar?: string | null
          title_en?: string | null
          title_fr?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          active: boolean
          bio_ar: string | null
          bio_en: string | null
          bio_fr: string | null
          created_at: string
          date_of_birth: string | null
          id: string
          is_staff: boolean
          jersey_number: number | null
          name_ar: string | null
          name_en: string
          name_fr: string | null
          nationality: string | null
          photo_url: string | null
          position: string | null
          sort_order: number
          sport: string
          staff_role: string | null
          team: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          bio_ar?: string | null
          bio_en?: string | null
          bio_fr?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          is_staff?: boolean
          jersey_number?: number | null
          name_ar?: string | null
          name_en: string
          name_fr?: string | null
          nationality?: string | null
          photo_url?: string | null
          position?: string | null
          sort_order?: number
          sport: string
          staff_role?: string | null
          team?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          bio_ar?: string | null
          bio_en?: string | null
          bio_fr?: string | null
          created_at?: string
          date_of_birth?: string | null
          id?: string
          is_staff?: boolean
          jersey_number?: number | null
          name_ar?: string | null
          name_en?: string
          name_fr?: string | null
          nationality?: string | null
          photo_url?: string | null
          position?: string | null
          sort_order?: number
          sport?: string
          staff_role?: string | null
          team?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sport_teams: {
        Row: {
          created_at: string
          ext_id: string | null
          id: string
          is_alahli: boolean
          logo_url: string | null
          name_ar: string | null
          name_en: string
          name_fr: string | null
          short_name: string | null
          source: string
          sport: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ext_id?: string | null
          id?: string
          is_alahli?: boolean
          logo_url?: string | null
          name_ar?: string | null
          name_en: string
          name_fr?: string | null
          short_name?: string | null
          source?: string
          sport: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ext_id?: string | null
          id?: string
          is_alahli?: boolean
          logo_url?: string | null
          name_ar?: string | null
          name_en?: string
          name_fr?: string | null
          short_name?: string | null
          source?: string
          sport?: string
          updated_at?: string
        }
        Relationships: []
      }
      standings: {
        Row: {
          competition_id: string
          created_at: string
          drawn: number
          goals_against: number
          goals_for: number
          id: string
          lost: number
          played: number
          points: number
          rank: number
          season: string | null
          source: string
          team_id: string
          updated_at: string
          won: number
        }
        Insert: {
          competition_id: string
          created_at?: string
          drawn?: number
          goals_against?: number
          goals_for?: number
          id?: string
          lost?: number
          played?: number
          points?: number
          rank?: number
          season?: string | null
          source?: string
          team_id: string
          updated_at?: string
          won?: number
        }
        Update: {
          competition_id?: string
          created_at?: string
          drawn?: number
          goals_against?: number
          goals_for?: number
          id?: string
          lost?: number
          played?: number
          points?: number
          rank?: number
          season?: string | null
          source?: string
          team_id?: string
          updated_at?: string
          won?: number
        }
        Relationships: [
          {
            foreignKeyName: "standings_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "standings_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "sport_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_runs: {
        Row: {
          details: Json | null
          error: string | null
          finished_at: string | null
          id: string
          items_upserted: number
          source: string
          started_at: string
          success: boolean | null
        }
        Insert: {
          details?: Json | null
          error?: string | null
          finished_at?: string | null
          id?: string
          items_upserted?: number
          source?: string
          started_at?: string
          success?: boolean | null
        }
        Update: {
          details?: Json | null
          error?: string | null
          finished_at?: string | null
          id?: string
          items_upserted?: number
          source?: string
          started_at?: string
          success?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
