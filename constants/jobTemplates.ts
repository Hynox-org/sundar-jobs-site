export interface JobPostFormData {
  id?: string;
  title: string;
  job_title: string;
  vacancy: number;
  // job_type: string;
  category: string;
  experience: string;
  // salary: string;
  // job_description: string;
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  // application_deadline: string;
  // additional_info: string;
  additional_jobs?: AdditionalJob[]; // <-- add this line
  is_draft?: boolean;
  template_id?: string;
  poster_url?: string;
}
export interface AdditionalJob {
  job_title: string;
  vacancy: number;
  experience: string;
}
export interface HtmlTemplate {
  id: string;
  name: string;
}

export const HTML_TEMPLATES: HtmlTemplate[] = [
  {
    id: "template-1",
    name: "Template 1",
  },
  {
    id: "template-2",
    name: "Template 2",
  },
  {
    id: "template-3",
    name: "Template 3",
  },
  {
    id: "template-4",
    name: "Template 4",
  },
  {
    id: "template-5",
    name: "Template 5",
  },
  {
    id: "template-6",
    name: "Template 6",
  },
  {
    id: "template-7",
    name: "Template 7",
  }
];
