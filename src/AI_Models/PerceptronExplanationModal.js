import React, { useState } from 'react';
import { Button, Modal, Box, Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  fontFamily: 'Prompt',
};

export default function PerceptronExplanationModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen} variant="outlined" sx={{ fontFamily: 'Prompt' }}>
        📘 คำอธิบายการใช้งาน Perceptron
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            🧠 คำอธิบายการใช้งาน Perceptron Interactive Trainer
          </Typography>

          <Typography sx={{ mt: 2 }}>
            โปรแกรมนี้จำลองการทำงานของ <strong>โมเดล Perceptron</strong> สำหรับการจำแนกข้อมูลออกเป็น 2 กลุ่ม (0 หรือ 1)
            โดยให้ผู้ใช้งานสามารถป้อนข้อมูลเอง ฝึกโมเดล และดูผลลัพธ์ในรูปแบบกราฟได้
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>📌 ขั้นตอนการใช้งาน:</Typography>
          <ol style={{ marginLeft: '1.5rem', fontSize: '1rem' }}>
            <li><strong>ป้อนข้อมูล:</strong> กรอกค่า <code>x₁</code>, <code>x₂</code>, และ <code>y</code> แล้วกด “Add Data”</li>
            <li><strong>ฝึกโมเดล:</strong> กด “🚀 ฝึกโมเดล” เพื่อเริ่มเรียนรู้</li>
            <li><strong>ดูผลลัพธ์:</strong> แสดงกราฟ Error และ Weights</li>
            <li><strong>ใช้ตัวอย่าง:</strong> กด “🚀 ตัวอย่างข้อมูลจำลอง”</li>
            <li><strong>ล้างข้อมูล:</strong> กด “ล้าง” เพื่อเริ่มใหม่</li>
          </ol>

          <Typography variant="h6" sx={{ mt: 2 }}>📈 กราฟผลลัพธ์:</Typography>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li><strong>Error per Epoch:</strong> ความผิดพลาดในแต่ละรอบ</li>
            <li><strong>Weights over Epochs:</strong> การเปลี่ยนแปลงของน้ำหนัก</li>
          </ul>

          <Typography sx={{ mt: 2, fontSize: '0.95rem' }}>
            🔍 หมายเหตุ: ใช้ Learning Rate = <code>0.1</code>, Epoch = <code>50</code> และ Step Function เป็นฟังก์ชันตัดสินใจ
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
