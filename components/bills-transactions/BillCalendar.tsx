"use client";

import React from "react";

import Calendar from "react-calendar";

const BillCalendar = () => {
  const maxDate = new Date();
  const minDate = new Date();
  minDate.setFullYear(maxDate.getFullYear() - 7);

  return (
    <div className="flex justify-center">
      <Calendar maxDate={maxDate} minDate={minDate} />
    </div>
  );
};

export default BillCalendar;
