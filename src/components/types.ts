export type Organization = {
  organization_id: number;
  organization_name: string;
  organization_type: string;
  contact_email: string;
  is_approved: boolean;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any> | null;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export type Chapter = {
  id: number;
  course_id: number;
  title: string;
  description: string;
  chapter_order: number;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: number;
  question: string;
  type: "single" | "multiple" | "likert";
  options: string[];
  answer: string | null;
  created_at: string;
};

export type Quiz = {
  id: number;
  couse_id: number;
  chapter_id: number;
  title: string;
  description: string;
  image: string;
  total_questions: number;
  created_at: string;
  updated_at: string;
};

export type Therapist = {
  therapist_id: number;
  user_id: number | null;
  email: string;
  password: string;
  therapist_name: string;
  dob: string;
  license_number: string;
  specializations: string;
  assigned_user_ids: number[];
  metadata: any;
  created_at: string;
  updated_at: string;
};

export type Patient = {
  patient_id: number;
  user_id: number;
  symptoms: string[];
  progress: {
    notes: string;
    status: string;
    last_update: string;
  };
  history: {
    allergies: string[];
    past_conditions: string[];
    hospitalized_before: boolean;
  };
  created_at: string;
  updated_at: string;
  metadata: any;
  first_name: string;
  last_name: string;
  email: string;
};

export type Session = {
  session_id: number;
  patient_id: number;
  therapist_id: number;
  content_id: number | null;
  session_status: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any> | null;
  patient_user_id: number;
  therapist_user_id: number | null;
};

export type UserRole = "candidate" | "admin" | "org" | "therapist";
