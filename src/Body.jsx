import React, { useEffect, useState } from "react";
  import DropAddress from "./utils/DropAddress";
  import DropShift from "./utils/DropShift";
  import DropDate from "./utils/DropDate";
  import Box from "@mui/material/Box";
  import Grid from "@mui/material/Grid";
  import Typography from "@mui/material/Typography";
  import Paper from "@mui/material/Paper";
  import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
  import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
  import AccessTimeIcon from "@mui/icons-material/AccessTime";
  import Button from "@mui/material/Button";
  import DatTable from "./DatTable";
  import axios from "axios";


  // const updateExamShiftData = [
  //   { value: "Ca 1 buổi sáng", time: "07h45 - 09h15"},
  //   { value: "Ca 2 buổi sáng", time: "09h30 - 11h00"},
  //   { value: "Ca 3 buổi sáng", time: "11h00 - 12h30"},
  //   { value: "Ca 1 buổi chiều", time: "14h00 - 15h30"},
  //   { value: "Ca 2 buổi chiều", time: "15h30 - 17h00"},
  //   { value: "Ca 3 buổi chiều", time: "17h00 - 18h30"}
  // ];
  // const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);// hello => Hello
const Body = () => {
  const [address, setAddress] = useState("Hà Nội");
  const [reload, setReload] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let data = []; 
      try {
        let endpoint = '';
        if (address === "Hà Nội") endpoint = "http://localhost:5000/hanoi";
        else if (address === "Đà Nẵng") endpoint = "http://localhost:5000/danang";
        else if (address === "TP. Hồ Chí Minh") endpoint = "http://localhost:5000/tphcm";

        if (endpoint) {
            const response = await axios.get(endpoint);
            data = response.data;
        }
        
        // Xử lý dữ liệu trả về từ API
        const processedData = data.map((item, index) => {
          return {
            // Đảm bảo ID luôn tồn tại - sử dụng ID từ database hoặc tạo ID tạm thời
            id: item.id || `temp_${Date.now()}_${index}`, 
            
            ca: item.ca_thi || "Không có dữ liệu",
            slot: item.slot,
            
            // Giữ nguyên giá trị `buổi sáng`/`buổi chiều` từ DB
            // Việc chuyển đổi sang 'Sáng'/'Chiều' sẽ do DatTable đảm nhận ở tầng hiển thị
            shift: item.buoi || "Không có dữ liệu", 
            
            date: item.ngay_thi ? item.ngay_thi.trim() : "Không có dữ liệu",
            location: item.dia_diem ? item.dia_diem.replace("Thi tại ", "") : "Khác",
            time: item.gio_thi || "Không có dữ liệu", 
            area: address
          };
        });

        setRows(processedData);

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu: ", error);
        setRows([]);
      }
    };

    fetchData();
  }, [address, reload]);

  const handleFilter = () => {
    setReload(!reload);
  };
    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          bgcolor: "linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)", // xanh lá cây nhạt
          boxSizing: "border-box",
          pt: { xs: "74px", sm: "50px" },
          pb: { xs: "64px", sm: "64px" },
        }}
      >
        {/* Filter Section */}
        <Paper
          elevation={7}
          sx={{
            borderRadius: 3,
            px: { xs: 2, md: 5 },
            py: { xs: 2, md: 3 },
            width: "100%",
            maxWidth: 1430,
            mx: "auto",
            mt: { xs: 3, md: 5 },
            mb: { xs: 3, md: 5 },
            background: "rgba(232,245,233,0.96)", // xanh lá cây nhạt
            boxShadow: "0 8px 40px 0 rgba(31,38,135,0.12)",
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center", mb: { xs: 1.5, md: 0 } }}>
              <Box
                component="img"
                src="/logo.jpg"
                alt="Logo"
                sx={{
                  width: 38,
                  height: 38,
                  mr: 1,
                  borderRadius: "8px",
                  objectFit: "cover",
                  boxShadow: 2,
                  background: "#fff"
              }}
              />
              <Box>
                <Typography variant="h5" fontWeight={700} color="primary">
                  Quản lý ca thi
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Bộ lọc hỗ trợ tìm kiếm, cập nhật ca thi
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={10} alignItems="center" flexWrap="wrap">
                <Grid item xs={12} sm={4} md={3}>
                  <DropAddress address={address} setAddress={setAddress} />
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", md: "flex-end" },
                      mt: { xs: 1, md: 0 },
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        fontWeight: 700,
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        letterSpacing: 1,
                      }}
                      onClick={handleFilter}
                    >
                      Reload  
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        {/* Data Table Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1400,
            mx: "auto",
            bgcolor: "transparent",
            borderRadius: 2,
            minHeight: 500,
          }}
        >
          <DatTable rows={rows} setRows={setRows} area={address} />
        </Box>
      </Box>
    );
  };

  export default Body;
