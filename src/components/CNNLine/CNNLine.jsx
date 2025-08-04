import React from "react";

const CNNLine = () => {
  const text = " Hi, it's Yantarne FM — Stay tuned for more updates! • ";

  return (
    <main className="w-full h-10 bg-red-600 overflow-hidden relative">
      <div className="cnn-text">
        {Array(20).fill(text).join(" ")}
      </div>
    </main>
  );
};

export default CNNLine;
