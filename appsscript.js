/*************************************************
 DREAM LADDERS AI BACKEND
*************************************************/

const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const type = body.type || "";

    if (type === "LEAD") return saveLead(body);
    if (type === "CHAT") return saveChat(body);
    if (type === "AI_CHAT") return callGemini(body.message || "");

    return jsonResponse({ success:false, message:"Invalid type" });

  } catch(err) {
    return jsonResponse({ success:false, error:err.toString() });
  }
}

/******** SAVE LEAD ********/
function saveLead(data) {

  const sheet = getSheet();

  sheet.appendRow([
    new Date(),
    "LEAD",
    data.name || "",
    data.phone || "",
    data.city || "",
    data.sqft || "",
    data.finish || "",
    data.estimate || "",
    "",
    ""
  ]);

  return jsonResponse({
    success:true,
    message:"Lead saved"
  });
}

/******** SAVE CHAT ********/
function saveChat(data) {

  const sheet = getSheet();

  sheet.appendRow([
    new Date(),
    "CHAT",
    "",
    "",
    "",
    "",
    "",
    "",
    data.message || "",
    data.reply || ""
  ]);

  return jsonResponse({
    success:true
  });
}

/******** GEMINI ********/
function callGemini(userMessage) {

const prompt =
`You are Dream Ladders AI.
You are an expert Indian civil engineering consultant.
Specialized in home construction, cost estimation, RCC, planning, materials.
Reply clearly.
If user asks Telugu, reply Telugu.
Keep answers short and practical.

User Question: ${userMessage}`;

const url =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

const payload = {
contents:[
{
parts:[
{text:prompt}
]
}
]
};

const options = {
method:"post",
contentType:"application/json",
payload:JSON.stringify(payload),
muteHttpExceptions:true
};

const res = UrlFetchApp.fetch(url, options);
const result = JSON.parse(res.getContentText());

const reply =
result?.candidates?.[0]?.content?.parts?.[0]?.text ||
"Please try again.";

return jsonResponse({
success:true,
reply:reply
});
}

/******** GET SHEET ********/
function getSheet() {

const ss = SpreadsheetApp.getActiveSpreadsheet();
let sheet = ss.getSheetByName(SHEET_NAME);

if (!sheet) {

sheet = ss.insertSheet(SHEET_NAME);

sheet.appendRow([
"Date",
"Type",
"Name",
"Phone",
"City",
"Sqft",
"Finish",
"Estimate",
"User Message",
"AI Reply"
]);

sheet.getRange(1,1,1,10).setFontWeight("bold");
}

return sheet;
}

/******** RESPONSE ********/
function jsonResponse(obj) {
return ContentService
.createTextOutput(JSON.stringify(obj))
.setMimeType(ContentService.MimeType.JSON);
}
