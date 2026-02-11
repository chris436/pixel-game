/**
 * Pixel Art Quiz Game - Backend Script
 * 
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. Create two tabs: "Questions" and "Responses".
 * 3. "Questions" headers (Row 1): [ID, Question, OptionA, OptionB, OptionC, OptionD, Answer]
 * 
 * 4. "Responses" headers (Row 1): [ID, PlayCount, TotalScore, MaxScore, FirstClearScore, AttemptsToClear, LastPlayedAt]
 *    (注意：TotalScore 是總分，由程式自動累加)
 * 
 * 5. Extensions > Apps Script > Paste this code.
 * 6. Deploy > New Deployment > Web App > Execute as: Me > Who has access: Anyone.
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_QUESTIONS = "Questions";
const SHEET_RESPONSES = "Responses";

function doGet(e) {
  const param = e.parameter.action;
  
  if (param === "getQuestions") {
    return getQuestions(e.parameter.count || 5);
  }
  
  return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Invalid action"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "submitResult") {
      return submitResult(data);
    }
    
    return jsonResponse({status: "error", message: "Invalid action"});
  } catch (error) {
    return jsonResponse({status: "error", message: error.toString()});
  }
}

function getQuestions(count) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_QUESTIONS);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // Remove headers
  
  const questions = data.map((row, index) => ({
    id: row[0] || index, // Fallback ID
    question: row[1],
    options: [row[2], row[3], row[4], row[5]],
  }));
  
  shuffleArray(questions);
  
  const selected = questions.slice(0, count).map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));
  
  return jsonResponse({
    status: "success",
    data: selected
  });
}

function submitResult(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const rSheet = ss.getSheetByName(SHEET_RESPONSES);
  
  // Grade result on server side
  const qSheet = ss.getSheetByName(SHEET_QUESTIONS);
  const qData = qSheet.getDataRange().getValues();
  qData.shift(); 
  
  const answerMap = new Map();
  qData.forEach(row => {
    answerMap.set(String(row[0]), String(row[6]).trim().toUpperCase());
  });
  
  let correctCount = 0;
  data.answers.forEach(ans => {
    const correct = answerMap.get(String(ans.id));
    if (correct && correct === String(ans.answer).toUpperCase()) {
      correctCount++;
    }
  });
  
  const totalQuestions = data.answers.length;
  const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  
  // Update Responses
  const rData = rSheet.getDataRange().getValues();
  let rowIndex = -1;
  const userId = String(data.userId).trim();
  
  for (let i = 1; i < rData.length; i++) {
    if (String(rData[i][0]) === userId) {
      rowIndex = i + 1; 
      break;
    }
  }
  
  const timestamp = new Date();
  const passThreshold = data.passThreshold || 60;
  const isPass = finalScore >= passThreshold;

  if (rowIndex === -1) {
    // New User
    // [ID, PlayCount, TotalScore, MaxScore, FirstClearScore, AttemptsToClear, LastPlayedAt]
    rSheet.appendRow([
      userId, 
      1, 
      finalScore, 
      finalScore, 
      isPass ? finalScore : "", 
      isPass ? 1 : 0, 
      timestamp
    ]);
  } else {
    // Update User
    const currentRow = rData[rowIndex - 1];
    // Index mapping (0-based from row array):
    // 0: ID
    // 1: PlayCount
    // 2: TotalScore
    // 3: MaxScore
    // 4: FirstClearScore
    // 5: AttemptsToClear
    // 6: LastPlayedAt
    
    const playCount = Number(currentRow[1] || 0) + 1;
    const previousTotal = Number(currentRow[2] || 0);
    const totalSum = previousTotal + finalScore;
    
    const currentMax = Number(currentRow[3] || 0);
    const maxScore = Math.max(currentMax, finalScore);
    
    let firstClear = currentRow[4];
    let attemptsToClear = currentRow[5];
    
    if (!firstClear && isPass) {
      firstClear = finalScore;
      attemptsToClear = playCount; 
    } else if (!firstClear && !isPass) {
      // Keep attempts logic? If we want "total attempts until clear", we can update it?
      // For now let's just leave it blank or update to 0? 
      // The requirement says "花幾次通關". If not cleared, maybe we don't show the number yet?
      // Or we can track current attempts. Let's keep existing logic.
    }
    
    // Update ranges: Col 2 to 7 (6 columns) -> B to G
    const range = rSheet.getRange(rowIndex, 2, 1, 6);
    range.setValues([[
      playCount, 
      totalSum, 
      maxScore, 
      firstClear, 
      attemptsToClear, 
      timestamp
    ]]);
  }
  
  return jsonResponse({
    status: "success",
    score: finalScore,
    correctCount: correctCount,
    isPass: isPass,
    debug: {
        totalSum: rowIndex === -1 ? finalScore : "calculated"
    }
  });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
