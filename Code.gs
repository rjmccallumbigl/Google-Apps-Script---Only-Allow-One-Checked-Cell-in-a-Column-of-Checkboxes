/**
* Script that modifies the sheet whenever it is edited
*
* @param e {Object} The current cell being edited
*
* Sources:
* https://developers.google.com/apps-script/guides/triggers/#Simple
* https://webapps.stackexchange.com/questions/103976/how-to-add-a-note-containing-date-to-a-cell-in-column-x-when-it-is-edited
* https://stackoverflow.com/questions/12583187/google-spreadsheet-script-check-if-edited-cell-is-in-a-specific-range
* https://stackoverflow.com/questions/12995262/how-can-i-return-the-range-of-an-edited-cell-using-an-onedit-event
*
*/

function onEdit(e){
  //  Declare variables 
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var sheetName = "Sheet1";           // Make sure you change this to your actual sheet name if not using Sheet1
  var columnNumber = 1;               // Make sure you change this if not using ColA a.k.a Col 1 as your column of checkboxes  
  var headerRow = 1;                  // Make sure you change this if not using Row 1 as your header row
  
  // Edited cell gets passed into function
  var range = e.range;  
  
  //  Returns the number of the edited row and column
  var thisRow = range.getRow();
  var thisCol = range.getColumn();
  
  //  Run function if checked column is edited
  if (thisRow > headerRow && thisCol === columnNumber && sheet.getName() === sheetName && range.isChecked()){
    console.log("Run Function");
    oneTrueCell(sheet, thisRow, thisCol);
  } else {
    console.log("Didn't run function") ;
  }
}

/**
*
* Only allow one cell in your checkbox column to be checked at a time. If a cell has been checked, unchecks other cells in the same column.
* 
* @param sheet {sheet} The active sheet in the spreadsheet being edited
* @param thisRow {Integer} The current row being edited
* @param thisCol {Integer} The current column being edited
*
*/

function oneTrueCell(sheet, thisRow, thisCol) {

  //  Declare variables 
  var dataRange = sheet.getRange(1, thisCol, sheet.getLastRow(), 1);
  var dataRangeValues = dataRange.getDisplayValues();

  //  Create array for only check column members
  var columnArray = new Array(dataRangeValues.length);
  
  //  Make sure header is the same
  columnArray[0] = dataRangeValues[0];
  
//  Make the last checked box the only checked box in the column
  for (var x = 1; x < columnArray.length; x++){    
    columnArray[x] = (x !== thisRow - 1 && (x !== "TRUE" || x !== "FALSE")) ? ["FALSE"] : ["TRUE"];    
  }
  
  //  Set array of checkboxes to sheet
  dataRange.setValues(columnArray); 
  SpreadsheetApp.flush();
}
