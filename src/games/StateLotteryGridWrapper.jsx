// StateLotteryGridWrapper.jsx
import { useNavigate } from "react-router-dom";
import StateLotteryGrid from "./StateLotteryGrid";

export default function StateLotteryGridWrapper() {
  const navigate = useNavigate();

  return (
    <StateLotteryGrid
      onSelectLottery={(lottery) => {
        navigate(`/state-lottery/${lottery.id}`);
      }}
    />
  );
}