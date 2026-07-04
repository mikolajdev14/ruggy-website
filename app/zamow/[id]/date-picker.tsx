"use client";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
export const DatePicker = () => {
  const [selected, setSelected] = useState();
  return <DayPicker selected={selected} />;
};
