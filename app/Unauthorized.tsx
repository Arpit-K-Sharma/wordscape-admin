import React from "react";

const UnauthorizedAccess: React.FC = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-4xl font-bold mb-4">Unauthorized Access</div>
      <div className="text-xl">
        You do not have permission to access this page.
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
