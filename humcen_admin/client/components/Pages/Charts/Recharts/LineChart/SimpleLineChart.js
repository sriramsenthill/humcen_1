import React from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
];

const SimpleLineChart = () => {
  return (
    <>
      <Card
        sx={{
          margin: "10px",
          boxShadow: "none",
          borderRadius: "10px",
          p: "30px",
          mb: "15px",
          border: "1px solid black",
          width: "100%",
        }}
      >
        <Typography
          as="h3"
          sx={{
            fontSize: 18,
            fontWeight: 500,
            borderBottom: "1px solid #EEF0F7",
            paddingBottom: "5px",
            mb: "15px",
          }}
          className="for-dark-bottom-border"
        >
          Revenue
        </Typography>
        <Typography
          sx={{
            fontStyle: "normal",
            fontWeight: "500",
            fontSize: "40px",
            color: "#00002B",
          }}
        >
          9,580
          <sup style={{ fontSize: "16px" }}>USD</sup>
        </Typography>
        <Typography sx={{ marginBottom: "15px" }}>
          <span style={{ color: "red" }}>↓ 2.4%</span> Lesser than last week
        </Typography>
        <ResponsiveContainer width="100%" aspect={2.0 / 0.9}>
          <LineChart
            width={400}
            height={800}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
};

export default SimpleLineChart;
