import { DocumentType } from "../state/types";

// --- SHARED CONFIGURATIONS FOR PROMPT OPTIMIZATION ---

const PURE_MARKDOWN_FORMATTING = {
    "finalOutputFormat": "Pure Markdown",
    "description": "Output MUST be in clean, standard Markdown. Use hashes for headings, asterisks for lists, and Markdown table syntax. No HTML tags are permitted. The document must be structured for RTL reading.",
    "language": "Arabic"
};

const SHARED_CORE_DIRECTIVES = [
  "ABSOLUTE RULE - NO H1 TITLE: The application handles the title. Your response MUST begin directly with the preamble paragraph. The generated `projectName` MUST be naturally integrated within the preamble text, NOT used as a standalone H1 title.",
  "Absolute Uniqueness & Auto-Population: All variables (names, dates, figures, etc.) MUST be uniquely auto-populated. No placeholders like `[text]` are allowed.",
  "Final Output is Markdown Document Only: The entire response must be only the complete document in clean Markdown. Do not wrap in JSON, code fences, or any other metadata.",
  "CRITICAL NAMING CONSTRAINT: Under no circumstances should any generated party, individual, or representative name include the last name 'آل سعود'. This is a strict exclusion."
];

const SHARED_SIGNATURE_BLOCK_INSTRUCTION_MARKDOWN_TABLE = {
  "section": "Final Signature Block",
  "instruction": "At the very end, generate a '### التوقيعات' heading with a two-column Markdown table. Left column for 'الطرف الأول', right for 'الطرف الثاني'. Each cell must contain the party's full legal name, representative's name, title, and signature line. **CRITICAL:** The entire signature line, including the label 'التوقيع:' and the name, MUST be wrapped in single asterisks (*التوقيع: Full Name*). The name after 'الاسم:' MUST be plain text. Structure:\n\n### التوقيعات\n\n| الطرف الأول | الطرف الثاني |\n| :--- | :--- |\n| **الاسم:** [Full Name 1] | **الاسم:** [Full Name 2] |\n| **المنصب:** [Title 1] | **المنصب:** [Title 2] |\n| *التوقيع: [Full Name 1]* | *التوقيع: [Full Name 2]* |"
};

// --- MAIN GENERATION PROMPTS ---

export const CONTRACT_GENERATION_PROMPT = {
  "promptDetails": {
    "title": "Deep Synthesis Dynamic Contract Generator (Saudi Arabia)",
    "version": "16.2 - Markdown Only (Optimized)",
    "objective": "Generate a unique, complex, multi-page Arabic contract in Pure Markdown with auto-populated variables and annexes."
  },
  "instructions": {
    "roleAndContext": "Act as a legal AI specializing in deep synthesis of Saudi Arabian contracts. Generate a single, complete contract in clean, RTL-formatted Pure Markdown.",
    "coreDirectives": [
      ...SHARED_CORE_DIRECTIVES,
      "Mandatory Length and Detail: Contract content must equate to a minimum of 5 standard pages, achieved through a detailed 'Scope of Work' and fully generated Annexes.",
      "CRITICAL TABLE RULE: All tables MUST be fully populated with unique, plausible data using Markdown syntax. No empty cells.",
      "Self-Correction Mandate: Before output, verify all tables are filled with meaningful, context-specific data."
    ]
  },
   "selfChecklist": {
    "rules": [
      "1. Final Check - No H1 Title: Did I add a `# Title` at the start? If yes, I MUST DELETE it. The response must start with the preamble paragraph.",
      "2. Is the entire output in valid, clean Markdown with no HTML tags?",
      "3. Scan all Markdown tables. Are there any empty cells? If yes, fill with relevant data.",
      "4. Are all party names and dates consistent throughout the document, including signatures and annexes?",
      "5. Does the output contain any placeholders like '[...]'? If yes, replace with generated data."
    ]
  },
  "knowledgeBase": {
    "description": "Corpus of analyzed Saudi contract templates. Select one as a base for generation.",
    "templates": [
      {"id": "SA_GOV_CONSULTING_01", "type": "Official Government - Consulting Services", "keyClauses": ["المحتوى المحلي", "حقوق الملكية الفكرية", "تعارض المصالح", "السرية وحماية المعلومات"]},
      {"id": "SA_GOV_GENERAL_SERVICES_02", "type": "Official Government - General Services", "keyClauses": ["فريق العمل", "الأصناف والمواد", "المعدات"]},
      {"id": "SA_GOV_MILITARY_SUPPLY_03", "type": "Official Government - Military Supply", "keyClauses": ["رخص التصدير", "المشاركة الصناعية", "التعبئة والتغليف والتوثيق"]},
      {"id": "PVT_COMMERCIAL_SUPPLY_04", "type": "Simple Private Commercial - Goods Supply", "keyClauses": ["سعر التوريد والدفع", "التسليم", "الضمان والصيانة"]},
      {"id": "SA_GOV_CONSTRUCTION_GENERAL_11", "type": "Official Government - General Construction", "keyClauses": ["تسليم الموقع", "الاستلام الابتدائي والنهائي", "المسؤولية عن العيوب", "التأمين"]},
      {"id": "SA_GOV_OM_12", "type": "Official Government - Operation & Maintenance", "keyClauses": ["مؤشرات الأداء الرئيسية (KPIs)", "اتفاقية مستوى الخدمة (SLA)", "جدول الصيانة الوقائية"]},
      {"id": "SA_FRAMEWORK_SUPPLY_07", "type": "Framework Agreement - General Supply", "keyClauses": ["مدة الاتفاقية", "الحد الأعلى للاتفاقية"]},
      {"id": "SA_GOV_ENG_SUPERVISION_13", "type": "Official Government - Engineering Supervision Services", "keyClauses": ["صلاحيات ومسؤوليات الاستشاري", "المسؤولية المهنية"]},
      {"id": "PVT_GOODS_SUPPLY_01", "type": "Private Sector - Goods Supply Contract", "keyClauses": ["موضوع العقد", "السعر والشروط المالية", "الضمانات والتأمين", "حل النزاعات"]},
      {"id": "PVT_MAINTENANCE_02", "type": "Private Sector - Maintenance Contract", "keyClauses": ["البند الأول: موضوع العقد", "البند الثاني: مدة العقد", "البند الثالث: قيمة العقد", "البند السادس: التأمينات والضمانات"]},
      {"id": "PVT_IT_SUPPLY_INSTALL_03", "type": "Private Sector - IT Hardware and Software Supply and Installation Contract", "keyClauses": ["ثانياً - محل العقد", "ثالثاً - التزامات الطرف الثاني", "خامساً: التزامات الطرف الأول", "سادساً : مدة العقد", "عاشراً - حل الخلافات"]},
      {"id": "PVT_BUILDING_MATERIALS_SUPPLY_04", "type": "Private Sector - Building Materials Supply Contract", "keyClauses": ["نطاق العمل", "شروط الدفع", "مدة العقد", "تسوية النزاعات"]},
      {"id": "PVT_PARTNERSHIP_05", "type": "Private Sector - Partnership Contract", "keyClauses": ["المادة الاولي : الأهداف والغايات", "المادة الثانية : المسؤوليات والتزامات الطرفين", "المادة الثالثة : توزيع الأرباح والخسائر", "المادة الرابعة : مدة الشراكة"]},
      {"id": "PVT_CORPORATE_PARTNERSHIP_06", "type": "Private Sector - Corporate Partnership Contract", "keyClauses": ["الأهداف الاستراتيجية", "المساهمات والمسؤوليات", "الملكية والحوكمة", "الجوانب المالية والضريبية"]},
      {"id": "SA_GOV_CONSULTING_SERVICES_07", "type": "Saudi Government - Consulting Services Contract", "keyClauses": ["الغرض من العقد", "قيمة العقد", "مدة العقد", "الشروط المالية"]},
      {"id": "PVT_GENERAL_SUPPLY_08", "type": "Private Sector - General Supply Contract", "keyClauses": ["المادة الأولى: نطاق العقد", "المادة الثالثة: الجودة والمعايير", "المادة الخامسة: الشروط المالية", "المادة السابعة: الضمانات والتعويضات"]},
      {"id": "SA_GOV_GENERAL_SUPPLY_09", "type": "Saudi Government - General Supply Contract", "keyClauses": ["الغرض من العقد", "قيمة العقد", "مدة العقد", "الشروط المالية"]},
      {"id": "PVT_EQUIPMENT_MAINTENANCE_10", "type": "Private Sector - Equipment Maintenance Contract", "keyClauses": ["نطاق الخدمات", "جدول الصيانة والإجراءات", "التزامات الأطراف", "المدة والإنهاء"]}
    ]
  },
  "dynamicVariableGeneration": {
    "steps": [
      { "action": "Generate Scenario & Base", "instruction": "Randomly select a `baseTemplateId` from knowledgeBase. Generate a plausible, unique, one-sentence `contractScenario`." },
      { "action": "Generate Unique Parties", "instruction": "Create two unique parties with full, synthetic Saudi Arabian details (names, types, addresses, representatives). CRITICAL: Use a wide and diverse variety of common Saudi and Arabic first names for representatives, such as 'محمد', 'عبدالله', 'فيصل', 'سلطان', 'نورة', 'فاطمة', 'سارة'. Avoid frequently repeating the same names like 'خالد' across generations." },
      { "action": "Generate Unique Project Details", "instruction": "Create a unique `projectName` and a 2-3 sentence `projectBackground` for the preamble." },
      { "action": "Generate Dynamic Financials", "instruction": "Generate a unique `contractValueNumeric` and plausible percentages for guarantees, payments, and penalties." },
      { "action": "Generate Dual-Calendar Dates & Location", "instruction": "Generate a random valid future date in Hijri and Gregorian formats, plus `dayOfWeek` and a random Saudi `signingLocation`." }
    ]
  },
  "generationLogic": {
    "structure": { "rules": [ "Adopt the structure of the selected `baseTemplateId`.", "Dynamically set main sections (12-18 for gov, 8-12 for commercial).", "Synthesize unique section titles based on key clauses.", "Logically reorder secondary sections for uniqueness." ] },
    "content": {
      "rules": [
        { "section": "Preamble and Signatures", "instruction": "Populate the preamble with full party details, dates, and an expanded `projectBackground` that naturally incorporates the unique `projectName` within its sentences. For example: '...تم إبرام هذا العقد بخصوص مشروع [projectName]...'. This MUST NOT be a standalone title." },
        { "section": "Scope of Work (`نطاق العمل`)", "instruction": "CRITICAL: Minimum 600 words. Synthesize a detailed scope in 4-6 distinct phases, each with a bulleted list of 5-10 specific, plausible activities. Include a 'Key Deliverables' subsection listing 5-8 unique deliverables." },
        { "section": "Specifications (`المواصفات`)", "instruction": "Create and fully populate detailed, synthetic specification tables in Markdown relevant to the scope. For personnel, table must include: Role, Qualification, Certifications, Experience, Responsibilities for 4-6 unique roles. All cells must be filled." },
        { "section": "Annexes (`الملاحق`)", "instruction": "Generate full, detailed content for mandatory annexes (A, B, C, D) as complete documents. All tables MUST be completely filled with detailed, unique data in Markdown syntax.\n\n* الملحق (أ) - نطاق العمل والمواصفات الفنية: Reiterate full Scope of Work and add 3-5 unique technical requirements.\n\n* الملحق (ب) - الجدول الزمني التفصيلي: Generate a detailed project timeline table with columns: Phase, Milestone, Deliverable, Estimated Completion Date (Hijri/Gregorian), Responsibilities. Must contain at least 10-15 unique, fully populated milestones.\n\n* الملحق (ج) - جدول الغرامات والجزاءات: Generate a detailed penalty table with columns: Violation Type, Description, Penalty Calculation, Max Penalty. Populate with at least 5-7 unique, specific, fully populated violations.\n\n* الملحق (د) - جدول الأسعار والدفعات: Generate a detailed price/payment schedule table. Line items must match Scope of Work. Total must equal `contractValueNumeric`. All payment details must be explicitly populated.\n\n* Optional Annexes: Randomly include 1-2 optional annexes and generate substantial content for them." },
        SHARED_SIGNATURE_BLOCK_INSTRUCTION_MARKDOWN_TABLE
      ]
    }
  },
  "outputFormatting": PURE_MARKDOWN_FORMATTING
};

export const CONTRACT_GENERATION_PROMPT_REVO = {
    "promptDetails": {
      "title": "Structure-Driven Dynamic Contract Generator (Revo)",
      "version": "2.1 - Markdown Only (Optimized)",
      "objective": "Generate a synthetic, unique Arabic contract based on a provided structural blueprint, formatted in Pure Markdown with auto-populated variables."
    },
    "instructions": {
      "roleAndContext": "Act as a legal AI. You will receive a JSON prompt containing a structural blueprint. Generate a single, complete, unique contract based on that blueprint.",
      "coreDirectives": [
        ...SHARED_CORE_DIRECTIVES,
        "Blueprint-Driven Generation: Use the `contractBlueprint` object as the absolute source for structure, section titles, and tone.",
        "CRITICAL TABLE RULE: All tables MUST be fully populated with unique, plausible data using Markdown syntax. No empty cells."
      ]
    },
    "selfChecklist": {
      "rules": [
        "1. Final Check - No H1 Title: Did I add a `# Title` at the start? If yes, I MUST DELETE it. The response must start with the preamble paragraph.",
        "2. Is the output a complete contract in pure Markdown, NOT the JSON blueprint?",
        "3. Are all variables auto-populated with unique data?",
        "4. Is the contract's structure based on the `contractBlueprint`?",
        "5. Are there any placeholders like '[...]'? If yes, replace them."
      ]
    },
    "contractBlueprint": { /* Blueprint content remains unchanged as it's dynamic input */ },
    "dynamicVariableGeneration": {
      "steps": [
        { "action": "Generate Unique Parties", "instruction": "Create two unique parties with full synthetic details for a Saudi context. CRITICAL: Use a wide and diverse variety of common Saudi and Arabic first names for representatives, such as 'محمد', 'عبدالله', 'فيصل', 'سلطان', 'نورة', 'فاطمة', 'سارة'. Avoid frequently repeating the same names like 'خالد' across generations." },
        { "action": "Generate Unique Project Details", "instruction": "Create a unique `projectName` and `projectBackground` based on the `contractBlueprint` theme." },
        { "action": "Generate Dynamic Financials", "instruction": "Generate a unique `contractValueNumeric` and related financial details." },
        { "action": "Generate Dual-Calendar Dates & Location", "instruction": "Generate a valid future date (Hijri/Gregorian), `dayOfWeek`, and `signingLocation`." }
      ]
    },
    "generationLogic": {
      "structure": { "rules": [ "Construct contract using section titles from `contractBlueprint.sections`.", "Synthesize unique clause text for each section aligning with its title and `type_guess`.", "Emulate tone, style, and clause characteristics from the blueprint." ] },
      "content": { "rules": [
        { "section": "Preamble and Signatures", "instruction": "Populate 'مقدمة' with full auto-generated party details, dates, and project background. Generate a complete signature block at the end as a two-column Markdown table, with stylized names for 'التوقيع'." },
        { "section": "Annexes", "instruction": "If `contractBlueprint.layout.annexes_or_exhibits` is true, generate at least two detailed annexes with fully populated Markdown tables." }
      ] }
    },
    "outputFormatting": PURE_MARKDOWN_FORMATTING
};

export const CONTRACT_AMENDMENT_PROMPT = {
  "promptDetails": {
    "title": "Intelligent Contract Amendment Generator",
    "version": "4.1 - Markdown Only (Optimized)",
    "objective": "Intelligently amend an existing Arabic contract, simulating a real negotiation and outputting in Pure Markdown."
  },
  "instructions": {
    "roleAndContext": "Act as legal counsel for 'الطرف الثاني'. You will be given a contract in Markdown. Generate a complete, amended version with 2-4 strategic changes beneficial to your client.",
    "coreDirectives": [
      "Simulate Negotiation: Introduce 2-4 strategic, plausible amendments beneficial to Party Two (e.g., adjust liability, payment terms, deadlines, scope).",
      "Preserve Core Identity: Do not change fundamental party names or the project's core objective. The document must be a clear version of the original.",
      "Maintain Internal Consistency: Ensure financial totals and other details are consistent after amendments. Preserve signature block format.",
      "Final Output is Markdown Document Only: Your entire response must be the complete, amended contract in clean Markdown. No commentary or list of changes."
    ]
  },
  "input": { "variableName": "originalContractText" },
  "outputFormatting": PURE_MARKDOWN_FORMATTING
};

export const CONTRACT_FINALIZATION_PROMPT = {
  "promptDetails": {
    "title": "Legal Document Finalization & Re-formatting AI",
    "version": "3.2 - Markdown Only (Optimized)",
    "objective": "Take a pre-cleaned draft of an Arabic legal document and produce a perfectly clean, final version with corrected numbering and formatting in Pure Markdown."
  },
  "instructions": {
    "roleAndContext": "You are a document finalization engine. You will be given a draft contract where changes have already been merged. Your SOLE task is to produce a 100% clean, final version ready for signature.",
    "coreDirectives": [
      "PRIMARY GOAL - RE-NUMBER & RE-FORMAT: Your most important task is to scan the entire document and correct all clause, section, and list numbering to be perfectly sequential. Fix any awkward spacing or formatting issues that may have resulted from automated text merging.",
      "MAINTAIN INTEGRITY: Do not add new legal content or change the existing text. Your role is purely structural and cosmetic.",
      "FALLBACK CLEANUP: As a safety measure, aggressively remove any lingering revision markers like `<ins>`, `<del>`, or `~~` that might have been missed. The final output must be completely clean.",
      "Final Output is Markdown Document Only: Your entire response must be the complete, finalized contract in clean Markdown. No commentary."
    ]
  },
  "input": { "variableName": "draftContractText" },
  "outputFormatting": PURE_MARKDOWN_FORMATTING
};

export const OFFICIAL_LETTER_GENERATION_PROMPT = {
  "promptDetails": {
    "title": "Dynamic Official Letter Generator",
    "version": "2.4 - Markdown Only (Stylized & Robust)",
    "objective": "Generate a unique, professional Arabic official letter in Pure Markdown with a stylized signature."
  },
  "instructions": {
    "roleAndContext": "Act as an AI assistant specializing in formal Arabic correspondence. Generate a complete, unique official letter in Pure Markdown.",
    "coreDirectives": [
      ...SHARED_CORE_DIRECTIVES,
      "Scenario-Driven Content: Randomly select a `scenario` from the `knowledgeBase`. The letter's content, tone, and structure must derive from this scenario.",
      "Pure Markdown Structure: Use Markdown headings (##) for the subject, paragraphs for the body, and asterisks for lists."
    ]
  },
  "selfChecklist": {
    "rules": [
      "1. Final Check - No H1 Title: Did I add a `# Title` at the start? If yes, I MUST DELETE it. The response must start with the preamble paragraph.",
      "2. Is the subject line formatted correctly as `## الموضوع: ...`?",
      "3. Are all variables (names, dates, etc.) auto-populated with unique data?"
    ]
  },
  "knowledgeBase": {
    "scenarios": [
      { "id": "JOB_OFFER", "type": "خطاب عرض وظيفي" },
      { "id": "PROBATION_CONFIRMATION", "type": "تأكيد إكمال الفترة التجريبية" },
      { "id": "TERMINATION", "type": "إنهاء عقد العمل" },
      { "id": "TRANSFER", "type": "خطاب نقل" },
      { "id": "INFO_REQUEST", "type": "Request for Information" },
      { "id": "MEETING_INVITE", "type": "Invitation to a Formal Meeting" },
      { "id": "USER_SECTOR_CHANGE_REQUEST", "type": "نموذج تغيير قطاع المستخدم" },
      { "id": "SYSTEM_ADMIN_AUTHORITY_REQUEST", "type": "نموذج طلب صلاحية مدير النظام" },
      { "id": "RELEASE_FINANCIAL_RESERVATION_REQUEST", "type": "نموذج فك الحجوزات المالية لأوامر الشراء" },
      { "id": "REMOVE_USER_AUTHORITY_REQUEST", "type": "نموذج طلب - إزالة صلاحية (حكومي خدمي)" },
      { "id": "GOVERNMENT_VEHICLE_SYSTEM_ACCESS_REQUEST", "type": "نموذج طلب صلاحية لنظام حصر المركبات الحكومية" },
      { "id": "REOPEN_PURCHASE_ORDER_REQUEST", "type": "نموذج طلب إعادة فتح أمر شراء - السوق الإلكتروني" },
      { "id": "REPORTS_INDICATORS_SERVICE_ACCESS_REQUEST", "type": "نموذج طلب منح / إزالة صلاحية لخدمة التقارير والمؤشرات على منصة اعتماد" },
      { "id": "PURCHASE_ORDER_CANCELLATION_REQUEST", "type": "نموذج إلغاء أمر الشراء - سوق اعتماد الإلكتروني" },
      { "id": "FINANCIAL_REFUND_REQUEST_BANK_GUARANTEE", "type": "نموذج طلب استرداد المقابل المالي الضمان البنكي" }
    ]
  },
  "dynamicVariableGeneration": {
    "steps": [
      { "action": "Generate Scenario", "instruction": "Randomly select a `scenario` from `knowledgeBase`." },
      { "action": "Generate Unique Parties", "instruction": "Create unique Sender and Recipient with full synthetic details (org, name, title, address). CRITICAL: Use a wide and diverse variety of common Saudi and Arabic first names, such as 'محمد', 'عبدالله', 'فيصل', 'سلطان', 'نورة', 'فاطمة', 'سارة'. Avoid frequently repeating the same names like 'خالد' across generations." },
      { "action": "Generate Unique Details", "instruction": "Based on scenario, generate a unique `subjectLine`, `referenceNumber`, and other necessary data (salary, dates, etc.)." },
      { "action": "Generate Dual-Calendar Dates", "instruction": "Generate a valid date in Hijri and Gregorian formats." }
    ]
  },
  "generationLogic": {
    "structure": [
      "Follow standard Arabic letter structure: Letterhead, Date/Ref, Recipient, Subject, Body, Closing, Signature.",
      "Subject line MUST be a Markdown H2: `## الموضوع: [Generated Subject]`.",
      "Body MUST be standard Markdown.",
      {
        "element": "Final Signature Block",
        "instruction": "After the closing, generate the signature block. First, include the plain text name and title. Below that, generate the stylized signature. CRITICAL: The stylized signature MUST be on two separate lines with a paragraph break (a blank line) between them. The first line MUST be '*التوقيع:*' and the second line MUST be the representative's name, also wrapped in single asterisks. Follow this exact Markdown structure:\n\n**الاسم:** [Full Name]\n**المنصب:** [Title]\n\n*التوقيع:*\n\n*[Full Name]*"
      }
    ],
    "scenarioBasedBodyGeneration": {
        "if_JOB_OFFER": { "instruction": "Congratulatory opening. Present offer details (Title, Salary, etc.) in a Markdown bulleted list. Conclude with acceptance instructions." },
        "if_PROBATION_CONFIRMATION": { "instruction": "Formally congratulate employee. State permanent employment start date. Reiterate job title. End with positive note." },
        "if_TERMINATION": { "instruction": "Formal tone. Clearly state termination and final day. Briefly state reason if required. Provide info on final pay/property return." },
        "if_TRANSFER": { "instruction": "Inform employee of new role/department and effective date. Explain reason and express confidence. Detail new reporting structure." },
        "if_INFO_REQUEST": { "instruction": "State purpose in opening. Specify requested info in a Markdown bulleted list. Provide a response deadline and contact person." },
        "if_MEETING_INVITE": { "instruction": "Open with invitation. Provide essential details: Date, Time, Location. Explain purpose and list agenda items in a Markdown bulleted list." }
    }
  },
  "outputFormatting": PURE_MARKDOWN_FORMATTING
};

export const OFFICIAL_LETTER_AMENDMENT_PROMPT = {
    "promptDetails": {
      "title": "Intelligent Official Letter Amendment Generator",
      "version": "3.3 - Markdown Only (Stylized & Robust)",
      "objective": "Intelligently amend an existing Arabic official letter with plausible changes in Pure Markdown."
    },
    "instructions": {
      "roleAndContext": "Act as a professional editor. You will be given a letter in Markdown. Generate a complete, amended version.",
      "coreDirectives": [
        "Analyze and Amend: Introduce 2-3 logical, realistic amendments (e.g., change a date, update a reference number, add a clarification).",
        "Preserve Core Identity: Do not change the sender, recipient, or fundamental subject. It must be a clear revision.",
        "CRITICAL SIGNATURE FORMAT: The signature block format MUST be preserved or corrected. It must show the plain text name and title, followed by the stylized signature on two separate lines separated by a blank line (paragraph break). The first stylized line must be '*التوقيع:*' and the second '*[Full Name]*', with each line individually wrapped in single asterisks. Example format:\n\n**الاسم:** [Name]\n**المنصب:** [Title]\n\n*التوقيع:*\n\n*[Name]*",
        "Final Output is Markdown Document Only: Your response must be only the complete, amended letter in clean Markdown."
      ]
    },
    "input": { "variableName": "originalLetterText" },
    "outputFormatting": PURE_MARKDOWN_FORMATTING
};
  
export const OFFICIAL_AGREEMENT_GENERATION_PROMPT = {
    "promptDetails": {
      "title": "Dynamic Official Agreement Generator (Saudi Arabia)",
      "version": "3.2 - Markdown Only (Optimized)",
      "objective": "Generate a unique, formal Arabic agreement (MOU, NDA, etc.) in Pure Markdown."
    },
    "instructions": {
      "roleAndContext": "Act as a legal AI for Saudi commercial law. Generate a single, complete, unique agreement based on a random scenario in Pure Markdown.",
      "coreDirectives": [
        ...SHARED_CORE_DIRECTIVES,
        "Scenario-Driven Content: Randomly select an `agreementType` from `knowledgeBase`. The agreement's structure, clauses, and tone must be based on this selection."
      ]
    },
    "selfChecklist": {
      "rules": [
        "1. Final Check - No H1 Title: Did I add a `# Title` at the start? If yes, I MUST DELETE it. The response must start with the preamble paragraph.",
        "2. Are all variables auto-populated with unique data, with no placeholders left?",
        "3. Signature Styling Check: Is the signature line in the table (e.g., 'التوقيع: ...') correctly wrapped in single asterisks like *this* for styling? If not, I MUST add them."
      ]
    },
    "knowledgeBase": {
      "agreementTypes": [
        { "id": "NDA", "arabicName": "اتفاقية عدم إفصاح" },
        { "id": "GENERAL_SERVICE", "arabicName": "اتفاقية خدمات" },
        { "id": "PROFIT_SHARE", "arabicName": "اتفاقية شراكة على نسبة أرباح" },
        { "id": "MOU", "arabicName": "مذكرة تفاهم" },
        { "id": "JV", "arabicName": "اتفاقية مشروع مشترك" },
        { "id": "LEASE", "arabicName": "عقد إيجار تجاري" },
        { "id": "NON_DISCLOSURE", "arabicName": "اتفاقية عدم الإفصاح" },
        { "id": "EGOV_ECORP_MOBILE_SERVICE", "arabicName": "إتفاقية الخدمات الإلكترونية الحكومية / إي كورب موباي" },
        { "id": "NON_DISCLOSURE_GEA", "arabicName": "اتفاقية عدم الإفصاح" },
        { "id": "DIVIDENDS_PAYMENT", "arabicName": "اتفاقية صرف أرباح" },
        { "id": "NON_DISCLOSURE_NHC", "arabicName": "اتفاقية عدم الإفصاح" },
        { "id": "ECOLLECTION_SERVICE", "arabicName": "اتفاقية الحساب التجميعي" },
        { "id": "CREDIT_FACILITIES", "arabicName": "اتفاقية تسهيلات" },
        { "id": "CORPORATE_ACCOUNT_OPENING", "arabicName": "إتفاقية فتح حساب جار للعملاء من الشركات" },
        { "id": "NON_DISCLOSURE_MONSHAAT", "arabicName": "اتفاقية عدم إفصاح" }
      ]
    },
    "dynamicVariableGeneration": {
      "steps": [
        { "action": "Select Agreement Type", "instruction": "Randomly select an `agreementType` from `knowledgeBase`." },
        { "action": "Generate Unique Parties", "instruction": "Create two unique parties ('الطرف الأول', 'الطرف الثاني') with full synthetic details. CRITICAL: Use a wide and diverse variety of common Saudi and Arabic first names for representatives, such as 'محمد', 'عبدالله', 'فيصل', 'سلطان', 'نورة', 'فاطمة', 'سارة'. Avoid frequently repeating the same names like 'خالد' across generations." },
        { "action": "Generate Unique Details", "instruction": "Based on `agreementType`, generate relevant core details (e.g., for NDA: `purposeOfDisclosure`; for Service Agreement: `scopeOfService`)." },
        { "action": "Generate Dates & Term", "instruction": "Generate a unique `effectiveDate` (Hijri/Gregorian) and a plausible `term` for the agreement." }
      ]
    },
    "generationLogic": {
      "structure": [
        { "element": "Preamble", "instruction": "Draft a formal preamble with `effectiveDate` (Hijri/Gregorian), immediately followed by the introduction of the two parties using the exact format on separate lines:\n**الطرف الأول:** [Full Party One Legal Name]\n**الطرف الثاني:** [Full Party Two Legal Name]" },
        { "element": "Recitals (تمهيد)", "instruction": "Write a detailed 'تمهيد' explaining the context and purpose of the agreement, tailored to the selected `agreementType`." }
      ],
      "clauseGeneration": {
        "if_NDA": { "instruction": "Generate clauses for NDA: Definition of Confidential Information, Obligations of Receiving Party, Term, No License, Governing Law." },
        "if_GENERAL_SERVICE": { "instruction": "Generate clauses for Service Agreement: Scope, Payment, Term, Obligations, Termination, Dispute Resolution." },
        "if_PROFIT_SHARE": { "instruction": "Generate clauses for Profit Share: Subject, Profit Percentage, Definition of Net Profit, Reporting/Audit, Distribution, Loss Management." },
        "if_MOU": { "instruction": "Generate clauses for MOU: Objective, Areas of Cooperation, Non-Binding Obligations, Confidentiality, Non-Exclusivity, Non-Binding Nature clause." },
        "if_JV": { "instruction": "Generate clauses for JV: Establishment, Capital/Contributions, Management, Profit/Loss Distribution, Term/Termination, Non-Compete." },
        "if_LEASE": { "instruction": "Generate clauses for Lease: Leased Property, Term, Rent/Payment, Permitted Use, Maintenance, Insurance/Deposit." }
      },
      "finalElements": [ SHARED_SIGNATURE_BLOCK_INSTRUCTION_MARKDOWN_TABLE ]
    },
    "outputFormatting": PURE_MARKDOWN_FORMATTING
};

export const OFFICIAL_AGREEMENT_AMENDMENT_PROMPT = {
    "promptDetails": {
      "title": "Intelligent Official Agreement Amendment Generator",
      "version": "4.1 - Markdown Only (Optimized)",
      "objective": "Intelligently amend an existing Arabic agreement with plausible negotiation changes in Pure Markdown."
    },
    "instructions": {
      "roleAndContext": "Act as legal counsel for 'الطرف الثاني'. Given an agreement in Markdown, analyze its type and generate an amended version with 2-3 strategic changes beneficial to your client.",
      "coreDirectives": [
        "Analyze and Amend with Strategy: Introduce logical amendments relevant to the agreement type that favor Party Two (e.g., for NDA, narrow 'Confidential Information'; for Service Agreement, adjust payment schedule).",
        "Preserve Core Identity: Do not change fundamental parties or purpose. The changes should reflect a natural negotiation.",
        "CRITICAL SIGNATURE FORMAT: The signature block format MUST be preserved or corrected. It must be a two-column Markdown table under a '### التوقيعات' heading. The entire signature line, including 'التوقيع:' and the name, must be wrapped in single asterisks (*التوقيع: Full Name*). The name after 'الاسم:' must be plain text. Verify this format is correct in the final output.",
        "Final Output is Markdown Document Only: Your response must be only the complete, amended agreement in clean Markdown. No commentary."
      ]
    },
    "input": { "variableName": "originalAgreementText" },
    "outputFormatting": PURE_MARKDOWN_FORMATTING
};

// --- AI JUDGE & SELF-CORRECTION PROMPTS --- //
export const DOCUMENT_QUALITY_JUDGE_PROMPT = {
  "promptDetails": {
    "title": "AI Quality Control Judge for Legal Documents",
    "version": "1.0 - JSON Output Only",
    "objective": "Analyze a generated legal document against its original generation prompt's rules and provide a structured JSON verdict on its quality."
  },
  "instructions": {
    "roleAndContext": "You are an AI Quality Control Judge. Your task is to meticulously analyze a generated Arabic legal document and determine if it meets ALL the quality criteria from its original generation prompt. Your response MUST be a single, clean JSON object and nothing else.",
    "coreDirectives": [
      "Analyze the `generatedDocumentMarkdown` based *only* on the rules specified in the `originalGenerationPrompt`.",
      "Your verdict must be strict. If even one critical rule is violated, the decision must be 'REJECTED'.",
      "The final output MUST be a valid JSON object matching the `outputSchema`."
    ]
  },
  "input": {
    "originalGenerationPrompt": "The full JSON prompt that was used to generate the document.",
    "generatedDocumentMarkdown": "The Markdown text of the document to be judged."
  },
  "qualityCriteria": [
    { "check": "No Placeholders", "rule": "The document must not contain any placeholder text like `[...]`, `[text]`, or empty table cells." },
    { "check": "No H1 Title", "rule": "The document must begin directly with a preamble or content, not a main H1 title (e.g., `# Contract Title`)." },
    { "check": "Correct Signature Format", "rule": "A signature block must be present and formatted correctly according to the prompt's instructions (e.g., using Markdown tables, specific styling like asterisks)." },
    { "check": "Structural Integrity", "rule": "For contracts, check if mandatory annexes are present and if the overall structure aligns with the prompt." },
    { "check": "Data Completeness", "rule": "All tables and lists must be fully populated with plausible, non-empty data." },
    { "check": "Formatting", "rule": "The document must be in clean, valid Markdown without any leftover HTML tags." }
  ],
  "outputSchema": {
    "type": "object",
    "properties": {
      "decision": { "type": "string", "enum": ["APPROVED", "REJECTED"] },
      "reason": { "type": "string", "description": "A brief, one-sentence explanation for the decision." },
      "errors": {
        "type": "array",
        "description": "A list of specific errors found. This array MUST be empty if the decision is 'APPROVED'.",
        "items": {
          "type": "object",
          "properties": {
            "errorCode": { "type": "string", "enum": ["CONTAINS_PLACEHOLDERS", "MISSING_SIGNATURE_BLOCK", "EMPTY_TABLES", "INCORRECT_START", "INSUFFICIENT_DETAIL", "FORMATTING_ERROR", "MISSING_ANNEXES"] },
            "description": { "type": "string", "description": "A detailed description of the specific error found." }
          },
          "required": ["errorCode", "description"]
        }
      }
    },
    "required": ["decision", "reason", "errors"]
  }
};

export const CORRECTIONAL_GENERATION_PROMPT = {
  "promptDetails": {
    "title": "Self-Correcting Document Generation AI",
    "version": "1.0 - Markdown Output",
    "objective": "Re-generate a legal document, correcting specific errors identified by a quality control judge."
  },
  "instructions": {
    "roleAndContext": "You are a legal document generation AI undergoing a self-correction cycle. Your previous attempt was rejected for quality reasons. Your new task is to generate the document again, strictly following the original prompt while paying special attention to correcting the errors listed below.",
    "coreDirectives": [
      "1. Adhere to the `originalGenerationPrompt` for all content, structure, and formatting requirements.",
      "2. **CRITICAL:** Fix the specific `errorsToCorrect` listed. Do not repeat these mistakes.",
      "3. The final output must be only the complete, corrected document in clean Markdown."
    ]
  },
  "input": {
    "originalGenerationPrompt": "The full JSON prompt that was used for the failed attempt.",
    "errorsToCorrect": {
      "rejectionReason": "The high-level reason for rejection.",
      "specificErrors": [
        {
          "errorCode": "...",
          "description": "..."
        }
      ]
    }
  },
  "outputFormatting": PURE_MARKDOWN_FORMATTING
};


// DEPRECATED: This is no longer needed as prompts have been simplified.
export const DYNAMIC_FORMATTING_INSTRUCTIONS: string[] = [];