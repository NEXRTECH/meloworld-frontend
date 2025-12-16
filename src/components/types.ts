export type Organization = {
  organization_id: string;
  organization_name: string;
  organization_type: string;
  contact_email: string;
  is_approved: boolean;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any> | null;
  scales?: string[]; // Array of scale/course IDs assigned to this organization
};

export type Norm = {
  _id?: string;
  type?: string;
  normId: number;
  scale_name: string;
  gender: string;
  age_min: number;
  age_max: number;
  description: string;
  norm_thresholds: NormThresholds;
  interpretations: Interpretations;
  recommendations: Recommendations;
}

export type Course = {
  _id: string;
  title: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
}

export type Chapter = {
  _id: string;
  course_id: string;
  title: string;
  image?: string;
  description: string;
  chapter_order: number;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: string;
  question: string;
  type: "single" | "multiple" | "likert";
  options: string[] | Record<number, string>;
  answer: string | null;
  created_at: string;
  quiz_id?: string;
  chapter_id?: string;
};

export type Submission = {
  _id: string;
  quiz_id: string;
  course_id: string;
  chapter_id: string;
  user_id: string;
  question_id: string;
  __v: number;
  created_at: string;
  organization_id: string;
  score: number;
  selected_option: number;
};

export type NormThresholds = {
  low_max: number;
  avg_min: number;
  avg_max: number;
  high_min: number;
};

export type Interpretations = {
  high: string;
  average: string;
  low: string;
};

export type Recommendations = {
  high: string;
  average: string;
  low: string;
}

export type Scale = {
  quiz_id: string;
  scale_name: string;
  score: number;
  interpretation: string;
  description: string;
  norm_thresholds: NormThresholds;
  interpretations: Interpretations;
};

export type Report = {
  user_id: string;
  course_id: string;
  generated_at: string;
  age: number;
  gender: string;
  scales: Scale[];
};

export type Quiz = {
  id: string;
  course_id: string;
  chapter_id: string;
  title: string;
  description: string;
  image: string;
  total_questions: number;
  created_at: string;
  updated_at: string;
};

export type Therapist = {
  therapist_id: string;
  user_id: string | null;
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
  patient_id: string;
  user_id: string;
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
  session_id: string;
  patient_id: string;
  therapist_id: string;
  content_id: string | null;
  session_status: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any> | null;
  patient_user_id: string;
  therapist_user_id: string | null;
};

export type UserRole = "candidate" | "admin" | "org" | "therapist";
