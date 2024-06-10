import { useState } from "react";

const Togglable = ({ showLabel, hideLabel, children }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => setVisible(!visible);

  return (
    <>
      <button style={hideWhenVisible} onClick={toggleVisibility}>
        {showLabel}
      </button>

      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>{hideLabel}</button>
      </div>
    </>
  );
};

export default Togglable;
