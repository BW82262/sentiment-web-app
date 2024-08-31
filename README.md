# Sentiment Cloud Generator

The **Sentiment Cloud Generator** is a React web application that allows users to create word clouds based on sentiment analysis. Users can upload a CSV file or input custom words to generate visual representations of word frequencies and their associated sentiments. Positive words appear in green, neutral words in gray, and negative words in red.

## Features

- **CSV Upload**: Generate word clouds from multiple columns in a CSV file.
- **Custom Input**: Enter words or phrases manually to create a custom word cloud.
- **Sentiment Analysis**: Visualize the sentiment of words with color coding.
- **Reset Functionality**: Easily reset the display to clear all generated word clouds.

## Installation

To run the application locally, follow these steps:

1. **Clone the repository**:

```
git clone https://github.com/your-username/sentiment-cloud-generator.git cd sentiment-cloud-generator
```

2. **Install dependencies**:

Make sure you have Node.js installed. Then, install the required packages:

```
npm install
```

3. **Start the development server**:

```
npm start
```

The application should now be running at `http://localhost:3000`.

## Usage

1. **Upload CSV**:

- Click on "Choose File" to upload a CSV file.
- Each column in the CSV file will generate a separate word cloud.
- Words in each column are analyzed for sentiment and displayed accordingly.

2. **Custom Input**:

- Enter one word or phrase per line in the text area provided.
- Optionally, enter a custom title for the word cloud.
- Click the "Generate Word Cloud" button to create the word cloud.

3. **Reset Data**:

- Click the "Reset Data" button at the bottom of the left side to clear all displayed word clouds.

## How It Works

- **CSV Processing**:
- The application uses `PapaParse` to parse CSV files. Each column is processed to normalize and extract words.
- Words are analyzed using the `Sentiment` library, which determines their sentiment score.

- **Custom Input Processing**:
- Words or phrases are split by newlines, normalized, and then analyzed for sentiment.

- **Word Cloud Generation**:
- The `react-wordcloud` library is used to render word clouds based on word frequency and sentiment scores.
- The application dynamically updates to show either CSV-generated or custom input word clouds.

## Technologies Used

- **React**: Front-end library for building the user interface.
- **PapaParse**: CSV parsing library for handling CSV file uploads.
- **Compromise**: Natural language processing library for word normalization.
- **Sentiment**: Library for performing sentiment analysis on words.
- **react-wordcloud**: Library for generating word cloud visualizations.
- **D3.js**: Used for color scaling in sentiment analysis.
