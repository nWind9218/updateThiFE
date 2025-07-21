import * as React from 'react';
import Box from '@mui/material/Box';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
} from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import CancelIcon from '@mui/icons-material/Close';
import { faker } from '@faker-js/faker';
import DatTable from './DatTable'; // Import the updated DatTable component

const initialRows = [
  {
    id: faker.string.uuid(),
    shift: 'Sáng',
    time: '08:00 - 12:00',
    date: faker.date.past(),
    location: faker.location.city(),
  },
  {
    id: faker.string.uuid(),
    shift: 'Chiều',
    time: '13:00 - 17:00',
    date: faker.date.past(),
    location: faker.location.city(),
  },
  {
    id: faker.string.uuid(),
    shift: 'Tối',
    time: '18:00 - 22:00',
    date: faker.date.past(),
    location: faker.location.city(),
  },
];

export default function EditableDataGrid() {
  const [rows, setRows] = React.useState(initialRows);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <DatTable rows={rows} setRows={setRows} />
    </Box>
  );
}