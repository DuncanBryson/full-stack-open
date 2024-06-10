import { useState, forwardRef, useImperativeHandle } from "react";

const Togglable = forwardRef(({ showLabel, hideLabel, children }, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => setVisible(!visible);

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <>
      <button style={hideWhenVisible} onClick={toggleVisibility}>
        {showLabel}
      </button>

      <button style={showWhenVisible} onClick={toggleVisibility}>
        {hideLabel}
      </button>
      <div style={showWhenVisible}>{children}</div>
    </>
  );
});
Togglable.displayName = "Togglable";
export default Togglable;
