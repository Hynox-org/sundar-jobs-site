import React from "react";
import {
  JobPostFormData,
  HtmlTemplate as TemplateType,
} from "../constants/jobTemplates";
import { generateTemplate1Html } from "../components/templates/Template1";
import { generateTemplate2Html } from "../components/templates/Template2";
import { generateTemplate3Html } from "../components/templates/Template3";
import { generateTemplate4Html } from "../components/templates/Template4";
import { generateTemplate5Html } from "../components/templates/Template5";
import { generateTemplate6Html } from "../components/templates/Template6";
import { generateTemplate7Html } from "../components/templates/Template7";

interface HtmlTemplateProps {
  formData: JobPostFormData;
  template: TemplateType;
}

const HtmlTemplate: React.FC<HtmlTemplateProps> = ({ formData, template }) => {
  if (!formData || !template) {
    return <div>Loading...</div>;
  }

  const defaultStyle = {
    backgroundColor: "#FFFFFF",
    textColor: "#333333",
    primaryColor: "#2563EB",
    secondaryColor: "#60A5FA",
    fontFamily: "Arial, sans-serif",
  };

  let htmlString = "";
  switch (template.id) {
    case "template-1":
      htmlString = generateTemplate1Html({ formData, ...defaultStyle });
      break;
    case "template-2":
      htmlString = generateTemplate2Html({ formData, ...defaultStyle });
      break;
    case "template-3":
      htmlString = generateTemplate3Html({ formData, ...defaultStyle });
      break;
    case "template-4":
      htmlString = generateTemplate4Html({ formData, ...defaultStyle });
      break;
    case "template-5":
      htmlString = generateTemplate5Html({ formData, ...defaultStyle });
      break;
    case "template-6":
      htmlString = generateTemplate6Html({ formData, ...defaultStyle });
      break;
    case "template-7":
      htmlString = generateTemplate7Html({ formData, ...defaultStyle });
      break;
    default:
      htmlString = generateTemplate1Html({ formData, ...defaultStyle });
      break;
  }

  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

export default HtmlTemplate;
