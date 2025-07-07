import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

export default function App() {
  const [number, setNumber] = useState("");
  const [factType, setFactType] = useState("trivia");
  const [isRandom, setIsRandom] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const fetchNumberFact = async () => {
    try {
      setError("");

      let url;
      if (isRandom) {
        url = `http://numbersapi.com/random/${factType}?json`;
      } else {
        if (!number.trim()) {
          setError("Пожалуйста, введите число");
          return;
        }
        if (isNaN(number)) {
          setError("Число должно быть в виде цифры");
          return;
        }
        url = `http://numbersapi.com/${number}/${factType}?json`;
      }

      const data = await (await fetch(url)).json();
      setResult({
        number: data.number || number,
        text: data.text,
        type: factType,
        isRandom,
      });
    } catch {
      setError(
        "Произошла ошибка при получении данных. Пожалуйста, попробуйте ещё раз."
      );
    }
  };

  const resetForm = () => {
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-blue-800">
          Интересные факты о числах
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Узнай что‑то новое прямо сейчас
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="form"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8"
          >
            {/* чекбокс случайного числа */}
            <label className="flex items-center gap-3 text-gray-700 text-base mb-6">
              <input
                type="checkbox"
                checked={isRandom}
                onChange={(e) => setIsRandom(e.target.checked)}
                className="h-5 w-5 accent-blue-600"
              />
              Использовать случайное число
            </label>

            {/* поле ввода числа */}
            {!isRandom && (
              <div className="flex flex-col mb-6">
                <label className="text-gray-700 font-medium mb-1">
                  Введите число:
                </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Например, 42"
                  className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            )}

            {/* выбор типа факта */}
            <div className="flex flex-col mb-6">
              <label className="text-gray-700 font-medium mb-1">
                Выберите тип факта:
              </label>
              <select
                value={factType}
                onChange={(e) => setFactType(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="trivia">Trivia (общие факты)</option>
                <option value="math">Math (математические факты)</option>
                <option value="date">Date (факты о датах)</option>
              </select>
            </div>

            {/* сообщение об ошибке */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm font-medium bg-red-100 p-2 rounded-md mb-4"
              >
                {error}
              </motion.div>
            )}

            {/* кнопка */}
            <motion.button
              onClick={fetchNumberFact}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Получить факт
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 space-y-4"
          >
            <h2 className="text-2xl font-semibold text-blue-800">Результат</h2>

            <div className="text-gray-800 space-y-1">
              <p>
                <strong>Число:</strong> {result.number}
              </p>
              <p>
                <strong>Тип факта:</strong> {result.type}
              </p>
              <p>
                <strong>Случайное число:</strong>{" "}
                {result.isRandom ? "Да" : "Нет"}
              </p>
            </div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md text-blue-800"
            >
              {result.text}
            </motion.div>

            <motion.button
              onClick={resetForm}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gray-500 text-white py-2 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Назад
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
