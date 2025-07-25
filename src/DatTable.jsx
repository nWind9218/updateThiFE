import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, TextField, Select, MenuItem, FormControl, InputLabel,
  Toolbar, Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

export default function DatTable({ rows, setRows, area }) {
  const [selectionModel, setSelectionModel] = useState([]);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newRowData, setNewRowData] = useState({
    ca: '', shift: '', date: null, time: '', location: '', slot: ''
  });
  const [addDialogErrors, setAddDialogErrors] = useState({});

  // --- LOGIC THÊM MỚI ---
  const handleOpenAddDialog = () => {
    setNewRowData({ ca: '', shift: '', date: null, time: '', location: '', slot: '' });
    setAddDialogErrors({});
    setOpenAddDialog(true);
  };
  const handleCloseAddDialog = () => setOpenAddDialog(false);
  const handleAddDialogChange = (field, value) => setNewRowData(prev => ({ ...prev, [field]: value }));

  const handleSaveAddDialog = async () => {
    // Thêm validation nếu cần
    try {
      const dataToSend = {
        ca_thi: newRowData.ca,
        buoi: newRowData.shift === 'Sáng' ? 'buổi sáng' : 'buổi chiều',
        ngay_thi: dayjs(newRowData.date).format('DD/MM/YYYY'),
        gio_thi: newRowData.time,
        dia_diem: newRowData.location,
        slot: parseInt(newRowData.slot) || 0,
        area: area
      };

      const response = await axios.post("http://localhost:5000/addExamSession", dataToSend);

      if (response.status === 201) {
        // Dùng chính dữ liệu server trả về để cập nhật UI, đảm bảo ID chính xác
        const newRowFromServer = response.data.data;
        
        // Chuyển đổi dữ liệu trả về để khớp với cấu trúc `rows` của bạn
        const rowToAdd = {
          id: newRowFromServer.id,
          ca: newRowFromServer.ca_thi,
          shift: newRowFromServer.buoi,
          date: newRowFromServer.ngay_thi,
          time: newRowFromServer.gio_thi,
          location: newRowFromServer.dia_diem,
          slot: newRowFromServer.slot,
          area: area
        };
        
        setRows(prevRows => [rowToAdd, ...prevRows]);
        handleCloseAddDialog();
      }
    } catch (error) {
      console.error("Lỗi khi thêm ca thi:", error);
    }
  };

  const handleOpenDeleteConfirm = () => setOpenDeleteConfirm(true);
  const handleCloseDeleteConfirm = () => setOpenDeleteConfirm(false);

  const handleConfirmDelete = async () => {
    if (!selectionModel || selectionModel.length === 0) {
      alert("Vui lòng chọn ít nhất một ca thi để xóa.");
      return;
    }

    try {
      // Chỉ gửi danh sách ID và area - đơn giản và hiệu quả hơn
      const payload = { 
        ids: selectionModel, // Gửi trực tiếp danh sách ID đã chọn
        area: area 
      };
      
      console.log('Payload gửi đi:', payload); // Debug log
      
      const response = await axios.delete("http://localhost:5000/deleteExamSession", { 
        data: payload 
      });

      if (response.status === 200) {
        // Cập nhật UI bằng cách loại bỏ các hàng đã xóa
        setRows((prevRows) => prevRows.filter((row) => !selectionModel.includes(row.id)));
        setSelectionModel([]);
        
        // Hiển thị thông báo thành công
        alert(`${response.data.message}`);
      }
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      const errorMessage = error.response?.data?.error || error.message;
      alert(`Lỗi khi xóa: ${errorMessage}`);
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'ca', headerName: 'Ca', width: 100 },
    { 
      field: 'shift', 
      headerName: 'Buổi', 
      width: 120,
      valueGetter: (params) => params.value?.includes('sáng') ? 'Sáng' : 'Chiều',
    },
    { field: 'date', headerName: 'Ngày', width: 150 },
    { field: 'time', headerName: 'Thời gian', width: 150 },
    { field: 'location', headerName: 'Địa điểm', width: 350 },
    { field: 'slot', headerName: 'Slot', width: 100, type: 'number' },
    { field: 'area', headerName: 'Thành phố', width: 150 },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ px: 0, height: 500, width: '100%' }}>
        <Toolbar sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}> Dữ liệu quản lý ca thi </Typography>
            <Box>
                <Button startIcon={<AddIcon />} onClick={handleOpenAddDialog} sx={{ mr: 1 }}>Thêm ca thi</Button>
                <Button startIcon={<DeleteIcon />} onClick={handleOpenDeleteConfirm} color="error" disabled={selectionModel.length === 0}> Xóa</Button>
            </Box>
        </Toolbar>

        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id} 
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          checkboxSelection
          disableRowSelectionOnClick
        />
        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
              <DialogContentText>Bạn có chắc chắn muốn xóa {selectionModel.length} ca thi đã chọn không?</DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleCloseDeleteConfirm}>Hủy</Button>
              <Button onClick={handleConfirmDelete} color="error" autoFocus>Xóa</Button>
          </DialogActions>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
            <DialogTitle>Thêm ca thi mới</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: 400 }}>
                <FormControl fullWidth>
                  <InputLabel>Ca</InputLabel>
                  <Select label="Ca" value={newRowData.ca} onChange={(e) => handleAddDialogChange('ca', e.target.value)}>
                    <MenuItem value="Ca 1">Ca 1</MenuItem>
                    <MenuItem value="Ca 2">Ca 2</MenuItem>
                    <MenuItem value="Ca 3">Ca 3</MenuItem>
                    <MenuItem value="Ca 4">Ca 4</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Buổi</InputLabel>
                  <Select label="Buổi" value={newRowData.shift} onChange={(e) => handleAddDialogChange('shift', e.target.value)}>
                    <MenuItem value="Sáng">Sáng</MenuItem>
                    <MenuItem value="Chiều">Chiều</MenuItem>
                  </Select>
                </FormControl>
                <DatePicker label="Ngày" value={newRowData.date} onChange={(newValue) => handleAddDialogChange('date', newValue)} format="DD/MM/YYYY"/>
                <TextField label="Thời gian" value={newRowData.time} onChange={(e) => handleAddDialogChange('time', e.target.value)} placeholder="Ví dụ: 08:00 - 09:30"/>
                <TextField label="Địa điểm" value={newRowData.location} onChange={(e) => handleAddDialogChange('location', e.target.value)}/>
                <TextField label="Slot" type="number" value={newRowData.slot} onChange={(e) => handleAddDialogChange('slot', e.target.value)}/>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddDialog}>Hủy</Button>
              <Button onClick={handleSaveAddDialog} color="primary">Thêm</Button>
            </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
