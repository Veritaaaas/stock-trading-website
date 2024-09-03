import StockChart  from "../../components/StockChart";
import Image from "next/image";

const sampleData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
];

const chartColors = {
  backgroundColor: 'white',
  lineColor: '#2962FF',
  textColor: 'black',
  areaTopColor: '#2962FF',
  areaBottomColor: 'rgba(41, 98, 255, 0.28)',
};

export default function Portfolio() {
  return (
    <div>
      <h1>Portfolio</h1>
      <StockChart data={sampleData} colors={chartColors} />
      <img src="https://img.logo.dev/ticker/ESTC?token=pk_Is4c7FZtRNaPVHt0pldwqA" alt="" />
    </div>
  );
}