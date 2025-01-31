
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string | null
          description: string
          estimated_reading_time: number
          id: string
          published_at: string | null
          slug: string
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          description: string
          estimated_reading_time: number
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          description?: string
          estimated_reading_time?: number
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_posts_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      estimate_features: {
        Row: {
          category: string
          created_at: string | null
          description: string
          duration: number
          estimate_id: string | null
          id: string
          is_required: boolean
          name: string
          price: number
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          duration: number
          estimate_id?: string | null
          id?: string
          is_required?: boolean
          name: string
          price: number
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          duration?: number
          estimate_id?: string | null
          id?: string
          is_required?: boolean
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "estimate_features_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_requirements: {
        Row: {
          created_at: string | null
          design_format: string | null
          estimate_id: string | null
          has_brand_guidelines: boolean
          has_content: boolean
          has_custom_fonts: boolean
          has_design: boolean
          has_icons: boolean
          has_images: boolean
          has_logo: boolean
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          design_format?: string | null
          estimate_id?: string | null
          has_brand_guidelines?: boolean
          has_content?: boolean
          has_custom_fonts?: boolean
          has_design?: boolean
          has_icons?: boolean
          has_images?: boolean
          has_logo?: boolean
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          design_format?: string | null
          estimate_id?: string | null
          has_brand_guidelines?: boolean
          has_content?: boolean
          has_custom_fonts?: boolean
          has_design?: boolean
          has_icons?: boolean
          has_images?: boolean
          has_logo?: boolean
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimate_requirements_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          base_cost: number
          contact_id: string | null
          created_at: string | null
          deadline: string
          description: string
          id: string
          project_type: string
          rush_fee: number
          status: string
          total_cost: number
          updated_at: string | null
        }
        Insert: {
          base_cost: number
          contact_id?: string | null
          created_at?: string | null
          deadline: string
          description: string
          id?: string
          project_type: string
          rush_fee?: number
          status?: string
          total_cost: number
          updated_at?: string | null
        }
        Update: {
          base_cost?: number
          contact_id?: string | null
          created_at?: string | null
          deadline?: string
          description?: string
          id?: string
          project_type?: string
          rush_fee?: number
          status?: string
          total_cost?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimates_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      technologies: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      work_challenges: {
        Row: {
          created_at: string | null
          description: string
          id: string
          sort_order: number
          title: string
          updated_at: string | null
          work_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          sort_order?: number
          title: string
          updated_at?: string | null
          work_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_challenges_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_details: {
        Row: {
          created_at: string | null
          id: string
          overview: string
          period: string
          role: string
          team_size: string
          updated_at: string | null
          work_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          overview: string
          period: string
          role: string
          team_size: string
          updated_at?: string | null
          work_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          overview?: string
          period?: string
          role?: string
          team_size?: string
          updated_at?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_details_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_images: {
        Row: {
          alt: string
          caption: string | null
          created_at: string | null
          id: string
          sort_order: number
          updated_at: string | null
          url: string
          work_id: string
        }
        Insert: {
          alt: string
          caption?: string | null
          created_at?: string | null
          id?: string
          sort_order?: number
          updated_at?: string | null
          url: string
          work_id: string
        }
        Update: {
          alt?: string
          caption?: string | null
          created_at?: string | null
          id?: string
          sort_order?: number
          updated_at?: string | null
          url?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_images_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_responsibilities: {
        Row: {
          created_at: string | null
          description: string
          id: string
          sort_order: number
          updated_at: string | null
          work_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          sort_order?: number
          updated_at?: string | null
          work_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          sort_order?: number
          updated_at?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_responsibilities_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_results: {
        Row: {
          created_at: string | null
          description: string
          id: string
          sort_order: number
          updated_at: string | null
          work_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          sort_order?: number
          updated_at?: string | null
          work_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          sort_order?: number
          updated_at?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_results_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_solutions: {
        Row: {
          challenge_id: string | null
          created_at: string | null
          description: string
          id: string
          sort_order: number
          title: string
          updated_at: string | null
          work_id: string
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          sort_order?: number
          title: string
          updated_at?: string | null
          work_id: string
        }
        Update: {
          challenge_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_solutions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "work_challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_solutions_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      work_technologies: {
        Row: {
          created_at: string | null
          technology_id: string
          work_id: string
        }
        Insert: {
          created_at?: string | null
          technology_id: string
          work_id: string
        }
        Update: {
          created_at?: string | null
          technology_id?: string
          work_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_technologies_technology_id_fkey"
            columns: ["technology_id"]
            isOneToOne: false
            referencedRelation: "technologies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_technologies_work_id_fkey"
            columns: ["work_id"]
            isOneToOne: false
            referencedRelation: "works"
            referencedColumns: ["id"]
          },
        ]
      }
      works: {
        Row: {
          category: string
          created_at: string | null
          description: string
          github_url: string | null
          id: string
          slug: string
          status: string
          thumbnail_url: string
          title: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          github_url?: string | null
          id?: string
          slug: string
          status?: string
          thumbnail_url: string
          title: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          github_url?: string | null
          id?: string
          slug?: string
          status?: string
          thumbnail_url?: string
          title?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
