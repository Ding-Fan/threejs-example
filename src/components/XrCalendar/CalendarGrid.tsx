import DayBox from "./DayBox";

const CalendarGrid: React.FC<{ setSelectedPosition: (position: [number, number, number]) => void }> = ({ setSelectedPosition }) => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const columns = 7;
  const rows = Math.ceil(days.length / columns);
  const boxSize = 1.5;
  const gridWidth = columns * boxSize;
  const gridHeight = rows * boxSize;

  return (
    <group>
      {days.map((day, index) => {
        const x = (index % columns) * boxSize - gridWidth / 2 + boxSize / 2;
        const y = -(Math.floor(index / columns) * boxSize - gridHeight / 2 + boxSize / 2);
        if (day === 15) { // Example: select day 15 as a default selection
          setSelectedPosition([x, y, 0]);
        }
        return <DayBox key={day} position={[x, y, 0]} label={day.toString()} />;
      })}
    </group>
  );
};


export default CalendarGrid;
