interface WeatherDetailItemProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
}

export function WeatherDetailItem({ label, value, unit = '', icon }: WeatherDetailItemProps) {
  return (
    <div className="weather-detail-item">
      <div className="weather-detail-label">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </div>
      <div className="font-semibold">
        {value}{unit}
      </div>
    </div>
  );
}