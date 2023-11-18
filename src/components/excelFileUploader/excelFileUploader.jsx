import React, { useState } from "react";
import { useForm } from "react-hook-form";
// import { object, string, number } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import useServerErrors from "../../utils/useServerErrors";
import { toast } from "react-toastify";
// import CricularLoader from "../circularLoaders/circularProgress";

// Excel file validation schema using zod
// const excelFileSchema = object({
//   file: object({
//     name: string(),
//     size: number(),
//     type: string().regex(
//       /\.xlsx?$/i,
//       "Please upload an Excel file (XLSX or XLS)",
//     ),
//   }).refine(
//     (value) => value.size < 1024 * 1024,
//     "File size should be less than 1MB",
//   ),
// });

const ExcelUploader = () => {
  const handleServerErrors = useServerErrors();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm({
    // resolver: zodResolver(excelFileSchema),
  });

  const handleFileUpload = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", data.file[0]);

      // Send file to Express.js server
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_JUDICIAL_URL}/api/upload-excel`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      console.log(response);

      setLoading(false);

      toast.success(response.data.message, { position: "top-right" });
    } catch (err) {
      setLoading(false);
      console.error("Error uploading file:", err.response);
      handleServerErrors(err.response);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFileUpload)}>
      <input type="file" {...register("file")} />
      {/* {errors?.file && <p>{errors?.file?.message}</p>} */}
      <button type="submit" disabled={loading}>
        {loading ? "..." : "بارگزاری اطلاعات کارکنان"}
      </button>
    </form>
  );
};

export default ExcelUploader;
