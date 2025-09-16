const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

app.post('/submit-data', async (req, res) => {
  const { careerField, toolUsed, usageFrequency } = req.body;
  if (!careerField || !toolUsed || !usageFrequency) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sheets = await getSheetsClient();
    const values = [[careerField, toolUsed, usageFrequency, new Date().toISOString()]];
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Sheet1!A:D',
      valueInputOption: 'RAW',
      resource: { values },
    });
    res.status(200).json({ message: 'Data submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit data' });
  }
});

app.get('/get-data', async (req, res) => {
  try {
    const sheets = await getSheetsClient();
    const values = [[careerField, toolUsed, usageFrequency, new Date().toISOString()]];
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Sheet1!A:D',
      valueInputOption: 'RAW',
      resource: { values },
    });
    res.status(200).json({ message: 'Data submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit data' });
  }

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
});