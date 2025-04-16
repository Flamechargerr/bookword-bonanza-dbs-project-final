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
      author: {
        Row: {
          contact_details: string | null
          id: number
          name: string
        }
        Insert: {
          contact_details?: string | null
          id?: number
          name: string
        }
        Update: {
          contact_details?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      author_book: {
        Row: {
          author_id: number
          book_isbn: string
        }
        Insert: {
          author_id: number
          book_isbn: string
        }
        Update: {
          author_id?: number
          book_isbn?: string
        }
        Relationships: [
          {
            foreignKeyName: "author_book_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "author_book_book_isbn_fkey"
            columns: ["book_isbn"]
            isOneToOne: false
            referencedRelation: "book"
            referencedColumns: ["isbn"]
          },
        ]
      }
      book: {
        Row: {
          edition: string | null
          format: string | null
          genre: string | null
          image_url: string | null
          isbn: string
          language: string | null
          name: string
          physical_attributes: string | null
          publisher_id: number | null
          rating: number | null
          summary: string | null
          updated_at: string | null
        }
        Insert: {
          edition?: string | null
          format?: string | null
          genre?: string | null
          image_url?: string | null
          isbn: string
          language?: string | null
          name: string
          physical_attributes?: string | null
          publisher_id?: number | null
          rating?: number | null
          summary?: string | null
          updated_at?: string | null
        }
        Update: {
          edition?: string | null
          format?: string | null
          genre?: string | null
          image_url?: string | null
          isbn?: string
          language?: string | null
          name?: string
          physical_attributes?: string | null
          publisher_id?: number | null
          rating?: number | null
          summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "publisher"
            referencedColumns: ["id"]
          },
        ]
      }
      books_read: {
        Row: {
          book_isbn: string
          comment: string | null
          rating: number | null
          user_id: string
          wishlist: boolean | null
        }
        Insert: {
          book_isbn: string
          comment?: string | null
          rating?: number | null
          user_id: string
          wishlist?: boolean | null
        }
        Update: {
          book_isbn?: string
          comment?: string | null
          rating?: number | null
          user_id?: string
          wishlist?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "books_read_book_isbn_fkey"
            columns: ["book_isbn"]
            isOneToOne: false
            referencedRelation: "book"
            referencedColumns: ["isbn"]
          },
        ]
      }
      customer: {
        Row: {
          id: string
          password: string
          username: string
        }
        Insert: {
          id?: string
          password: string
          username: string
        }
        Update: {
          id?: string
          password?: string
          username?: string
        }
        Relationships: []
      }
      publisher: {
        Row: {
          id: number
          location: string | null
          name: string
          pincode: string | null
        }
        Insert: {
          id?: number
          location?: string | null
          name: string
          pincode?: string | null
        }
        Update: {
          id?: number
          location?: string | null
          name?: string
          pincode?: string | null
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
