export type UserRole = "admin" | "member";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Phase {
  id: string;
  program_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  program_id: string;
  enrolled_at: string;
}

// Extended types with relations
export interface ProgramWithPhases extends Program {
  phases: Phase[];
}

export interface ProgramWithEnrollments extends Program {
  enrollments: (Enrollment & { profile: Profile })[];
}

export interface EnrollmentWithProgram extends Enrollment {
  program: Program;
}

export interface EnrollmentWithProfile extends Enrollment {
  profile: Profile;
}

// ===========================================
// FORM SYSTEM TYPES
// ===========================================

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "scale"
  | "text"
  | "textarea";

export interface FormTemplate {
  id: string;
  name: string;
  description: string | null;
  intro_title: string | null;
  intro_description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormSection {
  id: string;
  form_template_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface FormQuestion {
  id: string;
  section_id: string;
  question_text: string;
  question_type: QuestionType;
  help_text: string | null;
  is_required: boolean;
  is_inverted: boolean;
  scale_min: number | null;
  scale_max: number | null;
  scale_min_label: string | null;
  scale_max_label: string | null;
  max_selections: number | null;
  scoring_category: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface FormOption {
  id: string;
  question_id: string;
  option_text: string;
  option_value: string | null;
  order_index: number;
  created_at: string;
}

export interface ProgramForm {
  id: string;
  program_id: string;
  form_template_id: string;
  available_until: string | null;
  is_required: boolean;
  created_at: string;
}

export interface FormSubmission {
  id: string;
  user_id: string;
  program_form_id: string;
  noise_score: number | null;
  power_score: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FormAnswer {
  id: string;
  submission_id: string;
  question_id: string;
  answer_text: string | null;
  answer_scale: number | null;
  answer_options: string[] | null;
  created_at: string;
}

// Extended types with relations
export interface FormQuestionWithOptions extends FormQuestion {
  options: FormOption[];
}

export interface FormSectionWithQuestions extends FormSection {
  questions: FormQuestionWithOptions[];
}

export interface FormTemplateWithSections extends FormTemplate {
  sections: FormSectionWithQuestions[];
}

export interface ProgramFormWithTemplate extends ProgramForm {
  form_template: FormTemplate;
}

export interface ProgramFormFull extends ProgramForm {
  form_template: FormTemplateWithSections;
}

export interface FormSubmissionWithAnswers extends FormSubmission {
  answers: FormAnswer[];
}

export interface FormSubmissionWithUser extends FormSubmission {
  profile: Profile;
}

export interface ProgramWithForms extends Program {
  program_forms: ProgramFormWithTemplate[];
}
