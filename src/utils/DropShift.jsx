import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function DropShift({ address, examShifts, shift, setShift }) {
  const handleChange = (event) => {
    setShift(event.target.value);
  };

  return (
    <FormControl disabled={!address} sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="filter_shift">Ca Thi</InputLabel>
      <Select
        labelId="filter_shift"
        id="selector-shift"
        value={shift}
        label="Ca Thi"
        onChange={handleChange}
      >
        <MenuItem value="">Tất cả</MenuItem>
        {examShifts && examShifts.length > 0 ? (
          examShifts.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            Không có ca thi
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
}