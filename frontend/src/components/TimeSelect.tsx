import React, { useState, ChangeEvent } from 'react';

import { Icon } from '@iconify/react';
import logger from '@/lib/logger';

interface TimeSelectProps {
  onSubmit: (selectedTime: string) => void;
}

const TimeSelect: React.FC<TimeSelectProps> = ({ onSubmit }) => {
  const [selectedHour, setSelectedHour] = useState<number>(1);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('AM');

  const [isSelectionMade, setIsSelectionMade] = useState<boolean>(false);

  const hours: number[] = Array.from({ length: 12 }, (_, index) => index + 1);
  const minutes: number[] = Array.from({ length: 60 }, (_, index) => index);

  const handleHourChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedHour(parseInt(event.target.value));

    if (isSelectionMade) return;
    setIsSelectionMade(true);
  };

  const handleMinuteChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMinute(parseInt(event.target.value));

    if (isSelectionMade) return;
    setIsSelectionMade(true);
  };

  const handlePeriodChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);

    if (isSelectionMade) return;
    setIsSelectionMade(true);
  };

  const handleSubmit = () => {
    const formattedTime = `${selectedHour}:${
      selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute
    } ${selectedPeriod}`;
    onSubmit(formattedTime);
    setIsSelectionMade(false);
  };

  return (
    <div className='flex space-x-1'>
      <select
        className='border-1 border-primary rounded-md p-1'
        value={selectedHour}
        onChange={handleHourChange}
      >
        {hours.map((hour) => (
          <option key={`hour-${hour}`} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <span className='text-primary self-center'>:</span>
      <select
        className='border-1 border-primary rounded-md p-1'
        value={selectedMinute}
        onChange={handleMinuteChange}
      >
        {minutes.map((minute) => (
          <option key={`minute-${minute}`} value={minute}>
            {minute < 10 ? `0${minute}` : minute}
          </option>
        ))}
      </select>
      <select
        className='border-1 border-primary rounded-md p-1'
        value={selectedPeriod}
        onChange={handlePeriodChange}
      >
        <option value='AM'>AM</option>
        <option value='PM'>PM</option>
      </select>
      {isSelectionMade && (
        <span
          className='bg-primary cursor-pointer rounded-full p-2'
          onClick={handleSubmit}
        >
          <Icon icon='radix-icons:check' className='text-brand h-5 w-5' />
        </span>
      )}
    </div>
  );
};

export default TimeSelect;
