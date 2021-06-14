import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Error() {
  useEffect(() => {
    document.title = "404 Not Found";
    return () => {
      return;
    };
  }, []);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "calc(100vh - 140px)" }}
    >
      ⚠ 404 Not Found back
      <Link to="/" style={{ color: "white", textDecoration: "underline" }}>
        Home
      </Link>
    </div>
  );
}
