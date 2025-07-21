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


  const examShiftsData = [
    { value: "Ca 1 buổi sáng", label: "Ca 1 buổi sáng" },
    { value: "Ca 2 buổi sáng", label: "Ca 2 buổi sáng" },
    { value: "Ca 3 buổi sáng", label: "Ca 3 buổi sáng" },
    { value: "Ca 1 buổi chiều", label: "Ca 1 buổi chiều" },
    { value: "Ca 2 buổi chiều", label: "Ca 2 buổi chiều" },
    { value: "Ca 3 buổi chiều", label: "Ca 3 buổi chiều" }
  ];
  // const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1); hello => Hello
  const Body = () => {
    const [address, setAddress] = useState("All");
    const [shift, setShift] = useState("");
    const [date, setDate] = useState(null);
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const initialShift = "";
    const initialDate = null;
    const initialAddress = "All";

    useEffect(() => {
      const fetchData = async () => {
        let data = null
        try {
          if (address == "Hà Nội"){
            const response = await axios.get("http://localhost:5000/hanoi")
            data = response.data
          }
          else if (address == "Đà Nẵng"){
            const response = await axios.get("http://localhost:5000/danang")
            data = response.data
          }
          else if (address == "TP. Hồ Chí Minh"){
            const response = await axios.get("http://localhost:5000/tphcm")
            data = response.data
          }
          else{
            const response = await axios.get("http://localhost:5000/all")
            data = response.data
          }
          const processedData = data.map((item) => {
          return {
            id: item?.id?.toString() || "Không có dữ liệu",
            ca: typeof item?.ca_thi === 'string'
                ? item.ca_thi.split(' ')[1] || "Không có dữ liệu"
                : "Không có dữ liệu",
            shift: typeof item?.buoi === 'string'
                ? (item.buoi.includes("sáng") ? "Sáng"
                  : item.buoi.includes("chiều") ? "Chiều"
                  : "Không có dữ liệu")
                : "Không có dữ liệu",
            time: typeof item?.gio_thi === 'string'
                ? item.gio_thi
                : "Không có dữ liệu",
            date: item?.ngay_thi
                ? item.ngay_thi.trim()
                : "Không có dữ liệu",
            location: typeof item?.dia_diem === 'string'
                ? item.dia_diem.replace("Thi tại ", "")
                : "Không có dữ liệu",
          };
        });
          setRows(processedData)
          setFilteredRows(processedData)
        }
        catch(error){
          console.error("Lỗi khi lấy dữ liệu: ", error)
        }
      }
      fetchData()
    }, [address]);
    console.log(address)
    console.log(shift)
    console.log(date)
    const handleResetFilter = () => {
        setAddress(initialAddress);
        setShift(initialShift);
        setDate(initialDate);
      };
    const handleFilter = () => {
      let result = [...rows];
      // Filter theo address trước (luôn All hoặc 1 địa chỉ)
      if (address && address !== "All") {
        result = result.filter((row) => row.location === address);
      }
      // Nếu shift có giá trị (tức khác giá trị khởi tạo), filter thêm theo shift
      if (shift && shift !== initialShift) {
        result = result.filter((row) => row.shift && row.shift.includes(shift));
      }
      // Nếu date có giá trị (khác null), filter thêm theo date
      if (date && date !== initialDate) {
        const target = date.toISOString().slice(0, 10);
        result = result.filter((row) => {
          // row.date phải là object Date hoặc dạng ISO, nếu string thì convert
          let rowDate;
          if (typeof row.date === 'string') {
            rowDate = new Date(row.date);
          } else {
            rowDate = row.date;
          }
          return rowDate && rowDate.toISOString && rowDate.toISOString().slice(0, 10) === target;
        });
      }
      setFilteredRows(result);
    };

    return (
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
          boxSizing: "border-box",
          pt: { xs: "74px", sm: "50px" }, // Đẩy body xuống để tránh bị header đè (header fixed height ~60-70px)
          pb: { xs: "64px", sm: "64px" }, // Tránh bị footer đè lên
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
            mt: { xs: 3, md: 5 }, // Cách header rõ ràng hơn
            mb: { xs: 3, md: 5 },
            background: "rgba(255,255,255,0.96)",
            boxShadow: "0 8px 40px 0 rgba(31,38,135,0.12)",
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
            <Grid item xs={12} md={3} sx={{ display: "flex", alignItems: "center", mb: { xs: 1.5, md: 0 } }}>
              <EmojiEventsIcon color="primary" sx={{ fontSize: 38, mr: 1 }} />
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
              <Grid container spacing={2} alignItems="center" flexWrap="wrap">
                <Grid item xs={12} sm={4} md={3}>
                  <DropAddress address={address} setAddress={setAddress} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarMonthIcon color="secondary" sx={{ mr: 1 }} />
                    <DropDate
                      address={address}
                      value={date}
                      onChange={setDate}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                    <DropShift
                    address={address}
                    examShifts={examShiftsData}
                    shift={shift}
                    setShift={setShift}
                  />
                  
                  </Box>
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
                      Filter
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      sx={{
                        fontWeight: 700,
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        letterSpacing: 1,
                        ml: 2,
                      }}
                      onClick={handleResetFilter}
                    >
                      Reset
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
          <DatTable rows={filteredRows} setRows={setRows} />
        </Box>
      </Box>
    );
  };

  export default Body;
