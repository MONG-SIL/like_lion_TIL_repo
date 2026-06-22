import type { LionContactRow } from './lion';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      lions: {
        Row: {
          id: string;
          is_self: boolean;
          photo_url: string;
          badge: string;
          name: string;
          part: string;
          tagline: string;
          organization: string;
          intro: string;
          skills: string[];
          contacts: LionContactRow[];
          quote: string;
          created_at: number;
        };
        Insert: {
          id?: string;
          is_self?: boolean;
          photo_url: string;
          badge: string;
          name: string;
          part: string;
          tagline: string;
          organization: string;
          intro: string;
          skills: string[];
          contacts: LionContactRow[];
          quote: string;
          created_at: number;
        };
        Update: {
          id?: string;
          is_self?: boolean;
          photo_url?: string;
          badge?: string;
          name?: string;
          part?: string;
          tagline?: string;
          organization?: string;
          intro?: string;
          skills?: string[];
          contacts?: LionContactRow[];
          quote?: string;
          created_at?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type LionRow = Database['public']['Tables']['lions']['Row'];
export type LionInsert = Database['public']['Tables']['lions']['Insert'];
