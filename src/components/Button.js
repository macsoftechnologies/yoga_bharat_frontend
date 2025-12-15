import React from "react";

function Button({
  text,
  onClick,
  variant = "primary",
  size = "medium",
  rounded = false,
  fullWidth = false,
  color,
}) {
  // Default Styles
  const baseStyle = {
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    padding: "10px 20px",
    borderRadius: rounded ? "25px" : "5px",
    width: fullWidth ? "100%" : "auto",
  };

  // Variant Styles
  const variantStyles = {
    primary: { backgroundColor: "#007bff", color: "#fff" },
    secondary: { backgroundColor: "#6c757d", color: "#fff" },
    success: { backgroundColor: "#28a745", color: "#fff" },
    danger: { backgroundColor: "#dc3545", color: "#fff" },
    outline: {
      backgroundColor: "transparent",
      color: "#007bff",
      border: "2px solid #007bff",
    },
  };

  // Size Styles
  const sizeStyles = {
    small: { padding: "5px 12px", fontSize: "13px" },
    medium: { padding: "10px 20px", fontSize: "15px" },
    large: { padding: "14px 28px", fontSize: "17px" },
  };

  // Merge all styles
  const finalStyle = {
    ...baseStyle,
    ...(color ? { backgroundColor: color } : variantStyles[variant]),
    ...sizeStyles[size],
  };

  return (
    <button style={finalStyle} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
