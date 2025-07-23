import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// Nhận thêm prop setAddress để truyền dữ liệu ra ngoài
export default function DropAddress({ address, setAddress }) {
  const handleChange = (event) => {
    setAddress(event.target.value);
  };

  return (
    <div>
      <FormControl required sx={{ m: 1, minWidth: 300 }}>
        <InputLabel id="selector_address">Địa chỉ</InputLabel>
        <Select
          labelId="selector_address"
          id="selector-address"
          value={address}
          label="Địa chỉ"
          onChange={handleChange}
        >
          <MenuItem value="Hà Nội">Hà Nội</MenuItem>
          <MenuItem value="Đà Nẵng">Đà Nẵng</MenuItem>
          <MenuItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}