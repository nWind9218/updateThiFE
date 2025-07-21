import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
export default function DropDate({ address, value, onChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ padding: 2 }}>
        <DatePicker 
          label="Thời gian"
          value={value}
          onChange={onChange}
          format="DD/MM/YYYY"
          disabled={!address}
          slotProps={{
            textField: {
              placeholder: "DD/MM/YYYY"
            }
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}