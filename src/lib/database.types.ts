export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "pet_owner" | "practice_owner" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: "pet_owner" | "practice_owner" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: "pet_owner" | "practice_owner" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      practices: {
        Row: {
          id: string;
          slug: string;
          name: string;
          address: string;
          town: string;
          county: string;
          postcode: string;
          phone: string;
          email: string | null;
          website: string | null;
          rating: number;
          review_count: number;
          transparency_score: number;
          is_independent: boolean;
          parent_group: string | null;
          opening_since: number | null;
          lat: number | null;
          lng: number | null;
          features: string[];
          claimed_by: string | null;
          is_claimed: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          address: string;
          town: string;
          county?: string;
          postcode: string;
          phone: string;
          email?: string | null;
          website?: string | null;
          rating?: number;
          review_count?: number;
          transparency_score?: number;
          is_independent?: boolean;
          parent_group?: string | null;
          opening_since?: number | null;
          lat?: number | null;
          lng?: number | null;
          features?: string[];
          claimed_by?: string | null;
          is_claimed?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          address?: string;
          town?: string;
          county?: string;
          postcode?: string;
          phone?: string;
          email?: string | null;
          website?: string | null;
          rating?: number;
          review_count?: number;
          transparency_score?: number;
          is_independent?: boolean;
          parent_group?: string | null;
          opening_since?: number | null;
          lat?: number | null;
          lng?: number | null;
          features?: string[];
          claimed_by?: string | null;
          is_claimed?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      prices: {
        Row: {
          id: string;
          practice_id: string;
          procedure_key: string;
          price: number;
          notes: string | null;
          effective_from: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          practice_id: string;
          procedure_key: string;
          price: number;
          notes?: string | null;
          effective_from?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          practice_id?: string;
          procedure_key?: string;
          price?: number;
          notes?: string | null;
          effective_from?: string;
          created_at?: string;
        };
      };
      price_history: {
        Row: {
          id: string;
          practice_id: string;
          procedure_key: string;
          old_price: number | null;
          new_price: number;
          changed_at: string;
          changed_by: string | null;
        };
        Insert: {
          id?: string;
          practice_id: string;
          procedure_key: string;
          old_price?: number | null;
          new_price: number;
          changed_at?: string;
          changed_by?: string | null;
        };
        Update: {
          id?: string;
          practice_id?: string;
          procedure_key?: string;
          old_price?: number | null;
          new_price?: number;
          changed_at?: string;
          changed_by?: string | null;
        };
      };
      leads: {
        Row: {
          id: string;
          practice_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          pet_type: string;
          service: string;
          message: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          practice_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          pet_type: string;
          service: string;
          message?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          practice_id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          pet_type?: string;
          service?: string;
          message?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      practice_claims: {
        Row: {
          id: string;
          practice_id: string;
          user_id: string;
          status: "pending" | "approved" | "rejected";
          evidence: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          practice_id: string;
          user_id: string;
          status?: "pending" | "approved" | "rejected";
          evidence?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          practice_id?: string;
          user_id?: string;
          status?: "pending" | "approved" | "rejected";
          evidence?: string | null;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_practices: {
        Row: {
          id: string;
          user_id: string;
          practice_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          practice_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          practice_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      current_prices: {
        Row: {
          id: string;
          practice_id: string;
          procedure_key: string;
          price: number;
          notes: string | null;
          effective_from: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: {
      user_role: "pet_owner" | "practice_owner" | "admin";
      claim_status: "pending" | "approved" | "rejected";
    };
  };
};
