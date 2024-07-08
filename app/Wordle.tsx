"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { easyWords, mediumWords, hardWords } from "./words";
import { descriptions } from "./descriptions";

const Wordle = () => {
  const [word, setWord] = useState("");
  const [wordDescription, setWordDescription] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);
  const [showDifficultyButtons, setShowDifficultyButtons] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const instructions = `Hướng dẫn chơi: Nhập từ dự đoán của bạn và nhấn Enter. Bạn có 6 lượt đoán. Màu xanh lá cây nghĩa là chữ cái đúng vị trí, màu vàng nghĩa là chữ cái đúng nhưng sai vị trí, và màu xám nghĩa là chữ cái sai. Các từ phải có 6 chữ cái.
Chọn chế độ chơi: Nhấn nút "Choose Difficulty Level" để chọn mức độ dễ, trung bình hoặc khó.`;

  useEffect(() => {
    const selectWord = () => {
      let selectedWord;
      switch (difficulty) {
        case "easy":
          selectedWord = easyWords[Math.floor(Math.random() * easyWords.length)];
          break;
        case "medium":
          selectedWord = mediumWords[Math.floor(Math.random() * mediumWords.length)];
          break;
        case "hard":
          selectedWord = hardWords[Math.floor(Math.random() * hardWords.length)];
          break;
        default:
          selectedWord = easyWords[Math.floor(Math.random() * easyWords.length)];
      }
      setWord(selectedWord);
      setWordDescription(descriptions[selectedWord]);
    };

    selectWord();
  }, [difficulty]);

  const handleKeyPress = (key: string) => {
    if (gameOver) return;

    if (key === "Enter") {
      if (currentGuess.length !== word.length) {
        setMessage(`Word must be ${word.length} letters long`);
        setShake(true);
        setTimeout(() => setShake(false), 300);
        return;
      }
      const newGuesses = [...guesses];
      const currentGuessIndex = newGuesses.findIndex((guess) => guess === "");
      newGuesses[currentGuessIndex] = currentGuess;
      setGuesses(newGuesses);
      setCurrentGuess("");

      if (currentGuess === word) {
        setGameOver(true);
        setMessage("Congratulations! You guessed the word!");
        setShowConfetti(true);
      } else if (currentGuessIndex === 5) {
        setGameOver(true);
        setMessage(`Game over! The word was ${word}`);
      }
    } else if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(key) && currentGuess.length < word.length) {
      setCurrentGuess((prev) => prev + key.toUpperCase());
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyPress(e.key);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, gameOver, word]);

  const renderGrid = () => {
    return guesses.map((guess, i) => (
      <motion.div
        key={i}
        className="flex mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
      >
        {word.split("").map((_, j) => {
          const letter =
            guess[j] ||
            (i === guesses.findIndex((g) => g === "") ? currentGuess[j] : "");
          let className =
            "w-14 h-14 border-2 border-gray-700 flex items-center justify-center text-2xl font-bold mr-2 transition-all duration-300";
          if (guess) {
            if (letter === word[j]) {
              className += " bg-green-500 text-white border-green-500";
            } else if (word.includes(letter)) {
              className += " bg-yellow-500 text-white border-yellow-500";
            } else {
              className += " bg-gray-500 text-white border-gray-500";
            }
          }
          return (
            <motion.div
              key={j}
              className={className}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: guess ? 360 : 0 }}
              transition={{ delay: j * 0.1 }}
            >
              {letter}
            </motion.div>
          );
        })}
      </motion.div>
    ));
  };

  const restartGame = () => {
    let selectedWord;
    switch (difficulty) {
      case "easy":
        selectedWord = easyWords[Math.floor(Math.random() * easyWords.length)];
        break;
      case "medium":
        selectedWord = mediumWords[Math.floor(Math.random() * mediumWords.length)];
        break;
      case "hard":
        selectedWord = hardWords[Math.floor(Math.random() * hardWords.length)];
        break;
      default:
        selectedWord = easyWords[Math.floor(Math.random() * easyWords.length)];
    }
    setWord(selectedWord);
    setWordDescription(descriptions[selectedWord]);
    setGuesses(Array(6).fill(""));
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
    setShowConfetti(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {showConfetti && <Confetti />}
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Vocab Wordle
      </motion.h1>
      <div className="flex justify-center mb-4">
        <Button onClick={() => setShowDifficultyButtons(!showDifficultyButtons)} className="bg-gray-500 text-white text-lg">
          Choose Difficulty Level
        </Button>
      </div>
      {showDifficultyButtons && (
        <div className="flex justify-center mb-4">
          <Button onClick={() => { setDifficulty("easy"); setShowDifficultyButtons(false); restartGame(); }} className="bg-[#0d47a1] text-white text-lg mr-2">
            Easy
          </Button>
          <Button onClick={() => { setDifficulty("medium"); setShowDifficultyButtons(false); restartGame(); }} className="bg-[#0d47a1] text-white text-lg mr-2">
            Medium
          </Button>
          <Button onClick={() => { setDifficulty("hard"); setShowDifficultyButtons(false); restartGame(); }} className="bg-[#0d47a1] text-white text-lg">
            Hard
          </Button>
        </div>
      )}
      <motion.div
        className="flex flex-col items-center mb-4"
        animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
        transition={{ duration: 0.4 }}
      >
        {renderGrid()}
      </motion.div>
      <Button onClick={restartGame} className="mb-4" style={{ backgroundColor: '#d32f2f', color: '#ffeb3b', fontSize: '1.25rem' }}>
        Restart Game
      </Button>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Trạng thái trò chơi</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
            {gameOver && message.startsWith("Game over") && (
              <AlertDescription>Better luck next time!</AlertDescription>
            )}
            {gameOver && (
              <AlertDescription style={{ whiteSpace: "pre-line" }}>{`Word Description:\n${wordDescription.replace(/\.\s+/g, '.\n')}`}</AlertDescription>
            )}
          </Alert>
        </motion.div>
      )}
      <div className="absolute top-4 left-4">
        <motion.div
          className="p-4 bg-white border border-gray-700 rounded cursor-pointer flex items-center"
          onClick={() => setShowInstructions(!showInstructions)}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          <div>
            <AlertTitle>Hướng dẫn chơi</AlertTitle>
            {showInstructions && <AlertDescription>{instructions}</AlertDescription>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wordle;
