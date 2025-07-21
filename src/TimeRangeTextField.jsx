import React, { useState, useEffect, useCallback } from "react";
import { Box, TextField } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const TimeRangeTextField = ({ value, onChange, label = "Thời gian" }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [internalError, setInternalError] = useState("");

  // Effect to update displayValue when the external value prop changes
  useEffect(() => {
    setDisplayValue(value);
    // Re-validate the incoming value to ensure error state is correct
    validateAndReport(value);
  }, []);

  const validateAndReport = useCallback(
    (inputValue) => {
      let currentError = "";
      let isValid = true;
      let formattedValue = "";

      const parts = inputValue.split(" - ");
      if (parts.length === 2) {
        const [startStr, endStr] = parts;
        const startTime = dayjs(startStr, "HH:mm", true); // true for strict parsing
        const endTime = dayjs(endStr, "HH:mm", true);

        if (!startTime.isValid() || !endTime.isValid()) {
          currentError = "Định dạng thời gian không hợp lệ (HH:MM - HH:MM)!";
          isValid = false;
        } else if (endTime.isBefore(startTime)) {
          currentError = "Thời gian kết thúc phải lớn hơn thời gian bắt đầu!";
          isValid = false;
        } else {
          formattedValue = `${startTime.format("HH:mm")} - ${endTime.format("HH:mm")}`;
        }
      } else if (inputValue === "") {
        // Empty input is considered valid
        isValid = true;
        formattedValue = "";
      } else {
        currentError = "Vui lòng nhập đầy đủ khoảng thời gian (HH:MM - HH:MM)!";
        isValid = false;
      }

      setInternalError(currentError);
      onChange(formattedValue, isValid && !currentError);
    },
    [onChange]
  );

  const handleChange = (event) => {
    const newValue = event.target.value;
    setDisplayValue(newValue);
    validateAndReport(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label={label}
        value={displayValue}
        onChange={handleChange}
        placeholder="HH:MM - HH:MM"
        fullWidth
        error={!!internalError}
        helperText={internalError}
      />
    </Box>
  );
};

export default TimeRangeTextField;
