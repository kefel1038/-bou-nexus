interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  id?: string;
}

export default function Card({ children, className = "", onClick, hover, id }: CardProps) {
  return (
    <div
      id={id}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
        hover ? "hover:shadow-md hover:border-bou-200 transition-all duration-200 cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`px-6 py-4 ${className}`} style={style}>{children}</div>;
}
