import React, { Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function ComposedSuspense({ children }) {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 10,
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      {children}
    </Suspense>
  );
}
