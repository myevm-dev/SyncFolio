import React from "react";
import "./animated-button.css";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <button onClick={onClick} className={`animated-button ${className}`}>
      <div>{children}</div>
    </button>
  );
};

export default AnimatedButton;
