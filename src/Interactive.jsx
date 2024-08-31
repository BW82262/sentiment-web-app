import { useState } from "react";
import Papa from "papaparse";
import nlp from "compromise";
import Sentiment from "sentiment";
import WordCloud from "react-wordcloud";
import { scaleLinear } from "d3-scale";

function Interactive() {
  const [data, setData] = useState([]);
  const [wordCountsByColumn, setWordCountsByColumn] = useState({});
  const [customTitle, setCustomTitle] = useState("Custom Word Cloud");
  const [customWords, setCustomWords] = useState("");
  const [customWordCloud, setCustomWordCloud] = useState([]);
  const [displayMode, setDisplayMode] = useState(""); // 'csv' or 'custom'
  const sentimentAnalyzer = new Sentiment();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setDisplayMode("csv"); // Set display mode to CSV
    setCustomWordCloud([]); // Clear any custom input word clouds

    Papa.parse(file, {
      complete: (result) => {
        const rows = result.data;
        const filteredRows = filterData(rows);
        const normalizedRows = normalizeWords(filteredRows);
        const wordCountDataByColumn =
          calculateWordFrequenciesByColumn(normalizedRows);
        setData(normalizedRows);
        setWordCountsByColumn(wordCountDataByColumn);
      },
      header: true,
    });
  };

  const handleTextInputChange = (e) => {
    setCustomWords(e.target.value);
  };

  const handleGenerateCustomWordCloud = () => {
    if (!customWords.trim()) return;

    setDisplayMode("custom"); // Set display mode to custom input
    setWordCountsByColumn({}); // Clear any CSV word clouds

    // Split words by newlines or spaces
    const words = customWords
      .split(/\r?\n/)
      .map((word) => word.trim().toLowerCase());
    const wordCounts = {};

    words.forEach((word) => {
      if (word) {
        const sentimentScore = sentimentAnalyzer.analyze(word).score;
        if (!wordCounts[word]) {
          wordCounts[word] = { count: 0, sentiment: sentimentScore };
        }
        wordCounts[word].count += 1;
      }
    });

    const wordCloudData = Object.entries(wordCounts).map(
      ([word, { count, sentiment }]) => ({
        text: word,
        value: count,
        sentiment,
      })
    );

    setCustomWordCloud(wordCloudData);
  };

  const handleResetData = () => {
    setWordCountsByColumn({});
    setCustomWordCloud([]);
    setDisplayMode("");
  };

  const filterData = (rows) => {
    const foreignCharacterRegex = /[^\w\s,]/u;
    const sentenceRegex = /\b(\w+\s+\w+)\b/;

    return rows.filter((row) => {
      return !Object.values(row).some(
        (value) =>
          foreignCharacterRegex.test(value) || sentenceRegex.test(value)
      );
    });
  };

  const normalizeWords = (rows) => {
    return rows.map((row) => {
      const normalizedRow = {};
      Object.entries(row).forEach(([key, value]) => {
        if (value.includes(",")) {
          const words = value.split(",").map((word) => {
            const lemma = nlp(word.trim()).verbs().toInfinitive().out();
            return lemma || word.trim();
          });
          normalizedRow[key] = words.join(", ");
        } else {
          const lemma = nlp(value.trim()).verbs().toInfinitive().out();
          normalizedRow[key] = lemma || value.trim();
        }
      });
      return normalizedRow;
    });
  };

  const calculateWordFrequenciesByColumn = (rows) => {
    const wordCounts = {};

    rows.forEach((row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (!key.endsWith("_sentiment")) {
          if (!wordCounts[key]) {
            wordCounts[key] = {};
          }

          const words = value
            .split(",")
            .map((word) => word.trim().toLowerCase());
          words.forEach((word) => {
            if (word) {
              const sentimentScore = sentimentAnalyzer.analyze(word).score;
              if (!wordCounts[key][word]) {
                wordCounts[key][word] = { count: 0, sentiment: sentimentScore };
              }
              wordCounts[key][word].count += 1;
            }
          });
        }
      });
    });

    Object.keys(wordCounts).forEach((column) => {
      wordCounts[column] = Object.entries(wordCounts[column]).map(
        ([word, { count, sentiment }]) => ({
          text: word,
          value: count,
          sentiment,
        })
      );
    });

    return wordCounts;
  };

  const colorScale = scaleLinear()
    .domain([-5, 0, 5])
    .range(["red", "gray", "green"]);

  const options = {
    rotations: 1,
    rotationAngles: [0, 0],
    fontSizes: [10, 60],
    spiral: "rectangular",
    padding: 1,
    deterministic: true,
  };

  const callbacks = {
    getWordColor: (word) => colorScale(word.sentiment),
  };

  return (
    <div style={{ display: "flex", height: "80vh", width: "80vw" }}>
      {/* Left side container for file upload and text input */}
      <div
        style={{
          width: "20%",
          padding: "20px",
          borderRight: "1px solid #ccc",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3>Upload CSV</h3>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <h3>OR Enter Words</h3>
          <textarea
            rows="6"
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="Enter one word or phrase per line"
            value={customWords}
            onChange={handleTextInputChange}
          />
          <label style={{ display: "block", marginBottom: "5px" }}>
            Enter Title:
          </label>
          <input
            type="text"
            placeholder="Enter title"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button
            onClick={handleGenerateCustomWordCloud}
            style={{ width: "100%" }}
          >
            Generate Word Cloud
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleResetData}
          style={{ width: "100%", marginTop: "20px" }}
        >
          Reset Data
        </button>
      </div>

      {/* Right side container for word clouds or instructions */}
      <div
        style={{
          width: "80%",
          overflowY: "auto",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        {/* Display instructions if no word clouds are available */}
        {displayMode === "" && (
          <div style={{ color: "#666" }}>
            <h2>Instructions</h2>
            <p>Welcome to the Word Cloud Generator! Here's how to use it:</p>
            <ol>
              <li>
                <strong>Option 1:</strong> Upload a CSV file with multiple
                columns. Each column will generate its own word cloud based on
                the words it contains.
              </li>
              <li>
                <strong>Option 2:</strong> Enter words manually in the text area
                provided. Write one word or phrase per line. You can also set a
                custom title for your word cloud.
              </li>
              <li>
                Click the <strong>Generate Word Cloud</strong> button to create
                your word cloud!
              </li>
            </ol>
            <p>
              The word clouds will visually represent the frequency and
              sentiment of each word. Positive words will appear in green,
              neutral words in gray, and negative words in red.
            </p>
          </div>
        )}

        {/* Render word clouds generated from CSV upload */}
        {displayMode === "csv" &&
          Object.keys(wordCountsByColumn).map((column, index) => (
            <div key={column}>
              <h3>Word Cloud for {column}</h3>
              <WordCloud
                words={wordCountsByColumn[column]}
                options={options}
                callbacks={callbacks}
              />
              {index < Object.keys(wordCountsByColumn).length - 1 && (
                <hr style={{ margin: "20px 0", borderColor: "#ccc" }} />
              )}
            </div>
          ))}

        {/* Render custom word cloud from text input */}
        {displayMode === "custom" && customWordCloud.length > 0 && (
          <div>
            <h3>{customTitle}</h3>
            <WordCloud
              words={customWordCloud}
              options={options}
              callbacks={callbacks}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Interactive;
