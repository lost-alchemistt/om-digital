export type Database = {
  public: {
    tables: {
      users: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          mobile: string | null
          gender: 'male' | 'female' | 'other'
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          mobile?: string | null
          gender: 'male' | 'female' | 'other'
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          mobile?: string | null
          gender?: 'male' | 'female' | 'other'
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
