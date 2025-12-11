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
  },
  {
    id: "template-8",
    name: "Template 8",
  },
  {
    id: "template-9",
    name: "Template 9",
  },
  {
    id: "template-10",
    name: "Template 10",
  },
  {
    id: "template-11",
    name: "Template 11",
  },
  {
    id: "template-12",
    name: "Template 12",
  },
  {
    id: "template-13",
    name: "Template 13",
  },
  {
    id: "template-14",
    name: "Template 14",
  },
  {
    id: "template-15",
    name: "Template 15",
  },
  {
    id: "template-16",
    name: "Template 16",
  },
  {
    id: "template-17",
    name: "Template 17",
  },
  {
    id: "template-18",
    name: "Template 18",
  },
  {
    id: "template-19",
    name: "Template 19",
  },
  {
    id: "template-20",
    name: "Template 20",
  },
  {
    id: "template-21",
    name: "Template 21",
  },
  {
    id: "template-22",
    name: "Template 22",
  },
  {
    id: "template-23",
    name: "Template 23",
  },
  {
    id: "template-24",
    name: "Template 24",
  },
  {
    id: "template-25",
    name: "Template 25",
  },
  {
    id: "template-26",
    name: "Template 26",
  },
  {
    id: "template-27",
    name: "Template 27",
  },
  {
    id: "template-28",
    name: "Template 28",
  },
  {
    id: "template-29",
    name: "Template 29",
  },
  {
    id: "template-30",
    name: "Template 30",
  },
  {
    id: "template-31",
    name: "Template 31",
  },
  {
    id: "template-32",
    name: "Template 32",
  },
  {
    id: "template-33",
    name: "Template 33",
  },
  {
    id: "template-34",
    name: "Template 34",
  },
  {
    id: "template-35",
    name: "Template 35",
  },
  {
    id: "template-36",
    name: "Template 36",
  },
  {
    id: "template-37",
    name: "Template 37",
  },
  {
    id: "template-38",
    name: "Template 38",
  },
  {
    id: "template-39",
    name: "Template 39",
  },
  {
    id: "template-40",
    name: "Template 40",
  }
];
