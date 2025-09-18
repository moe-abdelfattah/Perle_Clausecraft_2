
// FIX: Changed the prompt from a template literal string to a native JavaScript object.
// This resolves strange parsing errors and allows for better type safety when used.
export const CONTRACT_GENERATION_PROMPT = {
  "promptDetails": {
    "title": "Deep Synthesis Dynamic Contract Generator with Full Annex Generation (Saudi Arabia)",
    "version": "14.0",
    "objective": "To programmatically generate a dataset of 125,000 fully synthetic, unique, and complex Arabic contracts. Each contract must be at least 5 pages long, professionally formatted in a right-to-left (RTL) document structure using Markdown with styled HTML tables, and include fully auto-populated, unique variables and annexes."
  },
  "instructions": {
    "roleAndContext": "You are an advanced legal AI specializing in the deep synthesis of complex Saudi Arabian contracts. Your task is to act as a 'Dynamic Contract Generator'. You will receive this JSON prompt and generate a single, complete, and unique contract as a clean, right-to-left formatted document.",
    "coreDirectives": [
      "**Absolute Uniqueness & Auto-Population Required:** Every single variable and placeholder field within the final contract text, including all names, project titles, financial figures, dates (Hijri and Gregorian), and signature blocks, MUST be fully and uniquely auto-populated by you. No square brackets or placeholders [like this] should remain in the final output.",
      "**Mandatory Length and Detail:** The generated contract's content must be substantial enough to equate to a minimum of 5 standard pages. This is achieved through a deeply detailed 'Scope of Work' and fully generated Annexes.",
      "**CRITICAL TABLE RULE: All Tables Must Be Fully Populated.** It is absolutely mandatory that every single table generated in the contract, including those in the main body and all annexes, is completely filled with unique, plausible, and contextually relevant data. No table cell (`<td>`) should be left empty or contain placeholder text. The data must be consistent with the contract's scope and financial details.",
      "**Full Annex Generation:** Do not just describe the annexes. You must generate the actual content of the mandatory annexes (A, B, C, D) as detailed, structured documents within the main contract output.",
      "**RTL Document Structure:** The entire final output must be wrapped in a single HTML container `<div dir='rtl'>...</div>` to ensure proper right-to-left text alignment for Arabic. The content inside this container will be Markdown with embedded HTML for tables.",
      "**Final Output is Document Only:** Your entire response to this prompt must be the single `<div>` block containing the complete contract. Do not wrap the output in a JSON object or include any other metadata outside of this container.",
      "**Self-Correction Mandate:** Before finalizing the output, you must perform a self-correction pass to verify that every single table cell (`<td>`) in the entire document contains meaningful, context-specific data. Outputting empty or placeholder-filled cells is a failure to meet the prompt's requirements."
    ]
  },
   "selfChecklist": {
    "description": "Final mandatory checks to perform before generating the response. Failure to comply with these will result in an invalid output.",
    "rules": [
      "1. Any contract output containing an empty <td> is considered invalid and must be re-generated with complete data.",
      "2. Scan all HTML tables. Is there a single empty `<td>` element? If yes, the output is invalid. Fill it with relevant data.",
      "3. Does the total in Annex D exactly match the `contractValueNumeric`? If no, correct it.",
      "4. Are all party names, dates, and project details from the preamble consistently used in the signature blocks and annexes? If no, correct it.",
      "5. Does the output contain any placeholder text like '[...]' or 'TBD'? If yes, replace it with generated data."
    ]
  },
  "knowledgeBase": {
    "description": "A detailed, structured corpus of analyzed Saudi contract templates. This is your primary source for style, structure, and legal terminology. You will retrieve one template as a base for each generation.",
    "templates": [
        {
        "id": "SA_GOV_CONSULTING_01",
        "sourceFileName": "نموذج عقد (خدمات استشارية).docx",
        "type": "Official Government - Consulting Services",
        "keyTerminology": ["الجهة الحكومية", "المتعاقد", "نظام المنافسات والمشتريات الحكومية"],
        "structuralNotes": "Follows the official two-part government format: a short 'Basic Document' (وثيقة العقد الأساسية) followed by extensive multi-section 'Conditions' (شروط العقد).",
        "keyClauses": [
          {"clauseName": "المحتوى المحلي", "description": "Mandatory clause referencing the Local Content and SMEs Authority regulations, requiring preference for national products."},
          {"clauseName": "حقوق الملكية الفكرية", "description": "Specifies that all IP generated under the contract becomes the exclusive property of the Government Entity."},
          {"clauseName": "تعارض المصالح", "description": "Requires the contractor to avoid and disclose any potential conflicts of interest."},
          {"clauseName": "السرية وحماية المعلومات", "description": "Imposes strict confidentiality obligations on the contractor regarding all project and government data."}
        ],
        "uniqueMechanisms": "Standard direct-award contract for a defined scope of services."
      },
      {
        "id": "SA_GOV_GENERAL_SERVICES_02",
        "sourceFileName": "نموذج عقد (خدمات عام).docx",
        "type": "Official Government - General Services",
        "keyTerminology": ["الجهة الحكومية", "المتعاقد"],
        "structuralNotes": "Follows the official two-part government format.",
        "keyClauses": [
          {"clauseName": "فريق العمل", "description": "Specifies requirements for contractor's personnel."},
          {"clauseName": "الأصناف والمواد", "description": "Defines the standards and specifications for any materials used in delivering the service."},
          {"clauseName": "المعدات", "description": "Outlines the requirements for equipment to be used by the contractor."}
        ],
        "uniqueMechanisms": "Standard direct-award contract suitable for non-consulting services like cleaning, security, or general maintenance."
      },
      {
        "id": "SA_GOV_MILITARY_SUPPLY_03",
        "sourceFileName": "نموذج عقد التوريد عسكري.docx",
        "type": "Official Government - Military Supply",
        "keyTerminology": ["الجهة الحكومية", "المتعاقد", "الهيئة العامة للصناعات العسكرية"],
        "structuralNotes": "A highly specialized two-part government procurement contract.",
        "keyClauses": [
          {"clauseName": "رخص التصدير", "description": "Makes the contractor responsible for obtaining all necessary export licenses from the country of origin."},
          {"clauseName": "المشاركة الصناعية", "description": "Mandates an industrial participation agreement with the General Authority for Military Industries (GAMI) to promote local industry."},
          {"clauseName": "التعبئة والتغليف والتوثيق", "description": "Contains highly specific requirements for military-grade packaging, labeling, and shipping documentation."}
        ],
        "uniqueMechanisms": "Features a mandatory multi-stage testing and acceptance protocol: Factory Acceptance Tests (FAT), Site Acceptance Tests (SAT), and User Acceptance Tests (UAT), each being a prerequisite for the next stage."
      },
      {
        "id": "PVT_COMMERCIAL_SUPPLY_04",
        "sourceFileName": "نموذج-عقد-توريد-أثاث-مكتبي-موقع-النموذج.docx",
        "type": "Simple Private Commercial - Goods Supply",
        "keyTerminology": ["المشتري", "البائع"],
        "structuralNotes": "Simple, linear contract structure without complex sections. Suitable for basic B2B sales.",
        "keyClauses": [
          {"clauseName": "سعر التوريد والدفع", "description": "Basic clause outlining total price and payment terms (e.g., advance payment, final payment)."},
          {"clauseName": "التسليم", "description": "Specifies delivery location and dates."},
          {"clauseName": "الضمان والصيانة", "description": "Provides a basic warranty period for the supplied goods."}
        ],
        "uniqueMechanisms": "None, it's a straightforward sales contract."
      },
      {
        "id": "SA_GOV_CONSTRUCTION_GENERAL_11",
        "sourceFileName": "نموذج عقد (إنشاءات عامة).docx",
        "type": "Official Government - General Construction",
        "keyTerminology": ["الجهة الحكومية", "المقاول", "المهندس"],
        "structuralNotes": "The standard official template for general building construction projects, following the two-part government format.",
        "keyClauses": [
          {"clauseName": "تسليم الموقع", "description": "Procedures for the official handover of the construction site to the contractor."},
          {"clauseName": "الاستلام الابتدائي والنهائي", "description": "A two-stage acceptance process: preliminary acceptance to start the defects liability period, and final acceptance after its completion."},
          {"clauseName": "المسؤولية عن العيوب", "description": "Defines the contractor's responsibility to remedy any defects that appear during the defect liability period."},
          {"clauseName": "التأمين", "description": "Requires specific insurance policies, typically Contractor's All-Risk (CAR) and Professional Indemnity."}
        ],
        "uniqueMechanisms": "Relies heavily on the role of 'The Engineer' (المهندس) as the government's representative for technical supervision and approvals."
      },
      {
        "id": "SA_GOV_OM_12",
        "sourceFileName": "نموذج عقد (التشغيل والصيانة) (1).docx",
        "type": "Official Government - Operation & Maintenance",
        "keyTerminology": ["الجهة الحكومية", "المتعاقد"],
        "structuralNotes": "Official two-part government contract tailored for long-term O&M services.",
        "keyClauses": [
          {"clauseName": "مؤشرات الأداء الرئيسية (KPIs)", "description": "Defines the measurable metrics used to evaluate the contractor's performance."},
          {"clauseName": "اتفاقية مستوى الخدمة (SLA)", "description": "Specifies the required service levels, response times, and uptime for the maintained assets."},
          {"clauseName": "جدول الصيانة الوقائية", "description": "Requires the contractor to submit and adhere to a detailed schedule for preventive maintenance activities."}
        ],
        "uniqueMechanisms": "Payment is often tied directly to the achievement of KPIs defined in the SLA, with penalties for non-compliance."
      },
      {
        "id": "SA_FRAMEWORK_SUPPLY_07",
        "sourceFileName": "نموذج اتفاقية إطارية (توريد عام).docx",
        "type": "Framework Agreement - General Supply",
        "keyTerminology": ["الجهة الحكومية", "المتعاقد"],
        "structuralNotes": "An official government agreement that establishes terms for future purchases, not a contract for a specific one-time purchase.",
        "keyClauses": [
          {"clauseName": "مدة الاتفاقية", "description": "Defines the period during which the framework is valid (e.g., 3 years)."},
          {"clauseName": "الحد الأعلى للاتفاقية", "description": "Specifies the maximum total value of all purchase orders that can be issued under the agreement."}
        ],
        "uniqueMechanisms": "The core mechanism is that no goods are procured upon signing. Instead, legally binding 'Purchase Orders' (أوامر الشراء) are issued against the pre-agreed prices and terms as needed."
      },
      {
        "id": "SA_GOV_ENG_SUPERVISION_13",
        "sourceFileName": "نموذج عقد (الخدمات الهندسية – إشراف).docx",
        "type": "Official Government - Engineering Supervision Services",
        "keyTerminology": ["الجهة الحكومية", "الاستشاري"],
        "structuralNotes": "Official two-part government format for specialized professional services.",
        "keyClauses": [
          {"clauseName": "صلاحيات ومسؤوليات الاستشاري", "description": "Defines the consultant's authority to inspect works, approve materials, and issue instructions to the construction contractor on behalf of the government."},
          {"clauseName": "المسؤولية المهنية", "description": "Specifies the consultant's liability for professional negligence (standard of care)."}
        ],
        "uniqueMechanisms": "The consultant acts as an intermediary and technical authority between the government client and the construction contractor."
      }
    ]
  },
  "dynamicVariableGeneration": {
    "description": "Auto-generate all variables to be 100% unique for each contract generation.",
    "steps": [
      {
        "step": 1,
        "action": "Generate Scenario & Base",
        "instruction": "Randomly select a `baseTemplateId` from the knowledgeBase. Based on the selection, generate a plausible, unique, one-sentence `contractScenario`."
      },
      {
        "step": 2,
        "action": "Generate Unique Parties",
        "instruction": "Create two unique parties with full, synthetic details (names, legal types, addresses, representative names, representative titles). Ensure names are plausible for Saudi Arabia."
      },
      {
        "step": 3,
        "action": "Generate Unique Project Details",
        "instruction": "Create a unique, descriptive `projectName`. Generate a 2-3 sentence `projectBackground` for the preamble."
      },
      {
        "step": 4,
        "action": "Generate Dynamic Financials",
        "instruction": "Generate a unique `contractValueNumeric` appropriate for the scenario. Generate random but plausible percentages for guarantees, advance payments, and penalties."
      },
      {
        "step": 5,
        "action": "Generate Dual-Calendar Dates & Location",
        "instruction": "Generate a random but valid future date. This date MUST be represented in two corresponding formats: `contractDateHijri` (e.g., '25 ربيع الآخر 1447هـ') and `contractDateGregorian` (e.g., '17 September 2025'). Generate the `dayOfWeek` (e.g., 'يوم الأربعاء'). Select a random major city in Saudi Arabia for `signingLocation`."
      },
      {
        "step": 6,
        "action": "Generate Dynamic Styling Variable",
        "instruction": "Generate a unique `tableHeaderColor` for this contract. This must be a standard HTML hex color code (e.g., '#4A90E2', '#D9534F', '#5CB85C'). Ensure the chosen color provides good contrast with white text for readability."
      }
    ]
  },
  "generationLogic": {
    "description": "Core rules for constructing the contract's content and structure to ensure detail and uniqueness.",
    "structure": {
      "rules": [
        "Adopt the fundamental structure of the selected `baseTemplateId`, paying close attention to the `structuralNotes`.",
        "Dynamically set the number of main sections between 12 and 18 for government contracts and 8-12 for commercial ones.",
        "Synthesize unique, descriptive section titles based on the `keyClauses` of the selected template.",
        "Logically reorder secondary sections between generations to ensure structural uniqueness."
      ]
    },
    "content": {
      "rules": [
        {
          "section": "Preamble and Signatures",
          "instruction": "The preamble (الديباجة) must be populated with the full party details and must include the auto-generated `dayOfWeek`, `contractDateHijri`, and `contractDateGregorian`. The signature blocks must be populated with the unique representative names and titles."
        },
        {
          "section": "Scope of Work (`نطاق العمل`)",
          "instruction": "**This section is the most critical for uniqueness and length and must be a minimum of 600 words.** Synthesize a detailed scope structured into **4-6 distinct phases**. Each phase must contain a bulleted list of **5-10 specific, unique, and technically plausible activities**. Include a dedicated subsection for **'المخرجات الرئيسية' (Key Deliverables)**, listing and describing at least 5-8 unique deliverables."
        },
        {
          "section": "Specifications (`المواصفات`)",
          "instruction": "Create highly detailed, synthetic specification tables relevant to the scope, ensuring they are fully populated with data. **Use HTML table syntax.** For personnel (`فريق العمل`), the table must include: Role, Qualification, Certifications, Experience, and Responsibilities for 4-6 unique roles. Every cell in this table must be filled with specific, plausible details. The table header must be styled using the generated `tableHeaderColor`."
        },
        {
          "section": "Annexes (`الملاحق`)",
          "instruction": "**Generate the full, detailed content for the mandatory annexes (A, B, C, D) as complete documents. Per the CRITICAL TABLE RULE, all tables herein must be completely filled with detailed, unique data and generated using HTML syntax with headers styled using the `tableHeaderColor`.**\\n\\n* **الملحق (أ) - نطاق العمل والمواصفات الفنية:** Reiterate the full Scope of Work and add a subsection with 3-5 unique, specific technical requirements or standards.\\n\\n* **الملحق (ب) - الجدول الزمني التفصيلي:** Generate a detailed project timeline in an HTML table. The table must have columns for Phase, Milestone, Deliverable, Estimated Completion Date (in both Hijri and Gregorian), and Responsibilities. It must contain at least 10-15 unique milestones, with every cell populated with specific information. Each of the 10-15 milestones must have every column filled. For example, a row must contain a specific milestone description, a deliverable, a valid dual-format date, and assigned responsibilities. Do not leave any of these cells blank.\\n\\n* **الملحق (ج) - جدول الغرامات والجزاءات:** Generate a detailed HTML table of penalties with columns for Violation Type, Description, Penalty Calculation, and Max Penalty. Populate with at least 5-7 unique, specific violations, ensuring all columns are filled with realistic data. Each of the 5-7 violations must have a clear description, a specific calculation method (e.g., '1% of total contract value per day'), and a maximum penalty. Do not use generic descriptions.\\n\\n* **الملحق (د) - جدول الأسعار والدفعات:** Generate a detailed price and payment schedule in an HTML table. The line items must correspond to the Scope of Work, and the total value must equal the `contractValueNumeric`. All payment details must be fully and explicitly populated. Each payment line item must be explicitly tied to a deliverable from the Scope of Work. The payment amount must be a specific number, and the total of all payments must exactly match the `contractValueNumeric`. Do not leave payment triggers or amounts undefined.\\n\\n* **Optional Annexes:** Randomly include 1-2 optional annexes and generate a substantial paragraph or structured list outlining their content."
        },
        {
          "section": "Final Signature Block",
          "instruction": "At the very end of the contract document, you must generate a distinct signature section under a '### التوقيعات' heading. This section must be clearly formatted for two parties. The structure is non-negotiable and must be followed exactly as shown in the example. For each party, you must first state their designation and their full legal name on the same line (e.g., '**الطرف الأول:** [Full Legal Name of Party One]'). Directly below this, you must list the full name and title of their authorized representative on separate lines, followed by a line for the signature. This entire block must be populated with the unique, generated party and representative details.\\n\\n### التوقيعات\\n\\n**الطرف الأول:** [اسم الجهة الحكومية/الشركة الأولى الكامل]\\n\\n**الاسم:** [اسم الممثل المفوض الكامل]\\n\\n**المنصب:** [منصب الممثل المفوض]\\n\\n**التوقيع:** _________________________\\n\\n\\n**الطرف الثاني:** [اسم المتعاقد/الشركة الثانية الكامل]\\n\\n**الاسم:** [اسم الممثل المفوض الثاني الكامل]\\n\\n**المنصب:** [منصب الممثل المفوض الثاني]\\n\\n**التوقيع:** _________________________"
        }
      ]
    }
  },
  "outputFormatting": {
    "finalOutputFormat": "HTML-wrapped Markdown",
    "description": "The final output must be a single block of text. The entire document, from the title to the final annex, must be enclosed within a single HTML `<div>` tag with right-to-left directionality (`<div dir='rtl'>...</div>`). This ensures correct formatting for the Arabic language. The content inside the div should be Markdown with embedded HTML for tables.",
    "language": "Arabic",
    "styling": "Inside the RTL div, strictly adhere to Markdown formatting for prose and headings (#, ##, ###). All tables MUST be generated as HTML tables. Their headers (`<thead>`) must contain table header cells (`<th>`). Each `<th>` element must be styled with the unique, randomly generated `tableHeaderColor` as its background and white text (`color: #FFFFFF;`).",
    "finalNote": "The contract's closing statement must include both the auto-generated Hijri and Gregorian dates."
  }
};

export const CONTRACT_AMENDMENT_PROMPT = {
  "promptDetails": {
    "title": "Intelligent Contract Amendment Generator (Saudi Arabia)",
    "version": "2.0",
    "objective": "To intelligently amend an existing Arabic contract, producing a new version with plausible, logical changes while preserving the core structure and intent."
  },
  "instructions": {
    "roleAndContext": "You are an advanced legal AI acting as a professional legal reviewer. You will be given the full text of an existing Saudi Arabian contract. Your task is to analyze it and generate a complete, amended version of that contract.",
    "coreDirectives": [
      "**Analyze and Amend:** Read the provided contract carefully. Introduce 2-4 logical and meaningful amendments. Examples of good amendments include: adjusting a project deadline in the timeline, modifying a financial figure in the payment schedule (and ensuring the total still adds up), updating a technical specification, or clarifying a clause's wording. Avoid trivial changes.",
      "**Preserve Core Identity:** Do not change the fundamental details like the names of the contracting parties, the project's core objective, or the legal framework. The amended document must clearly be a new version of the original, not a completely new contract.",
      "**Maintain Format and Integrity:** The amended contract must be returned in the exact same format as the original: a single `<div dir='rtl'>...</div>` container with Markdown and styled HTML tables. Ensure all internal consistency (like financial totals) is maintained after your amendments.",
      "**Final Output is Document Only:** Your entire response must be the single `<div>` block containing the complete, amended contract. Do not include any commentary, analysis, or list of changes you made."
    ]
  },
  "input": {
    "description": "The user will provide the full HTML/Markdown text of the original contract. This will be injected into the `contents` field of the API call.",
    "variableName": "originalContractText"
  }
};

export const DYNAMIC_FORMATTING_INSTRUCTIONS = [
  "**Dynamic Style Directive:** All `<h2>` headings must be followed by a horizontal rule (`---`) for visual separation.",
  "**Dynamic Style Directive:** In the 'Scope of Work' section, all bulleted lists (`<ul>`) must use asterisks (`*`) as bullet points.",
  "**Dynamic Style Directive:** In all Annexes, render all `<h3>` headings in italics by wrapping them in single asterisks (e.g., `*### عنوان الملحق*`).",
  "**Dynamic Style Directive:** The final signature block (under '### التوقيعات') must be enclosed within a Markdown blockquote (by prefixing each line with `> `).",
  "**Dynamic Style Directive:** All dates, both Hijri and Gregorian, appearing anywhere in the document (preamble, annexes, closing) must be rendered in bold text.",
  "**Dynamic Style Directive:** For the 'Key Deliverables' (`المخرجات الرئيسية`) subsection, use a numbered list (`<ol>`) instead of a bulleted list (`<ul>`)."
];