"use client"
import {UploadDropzone} from "@/lib/uploadthing";
import {ourFileRouter} from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
}
export default function FileUpload({onChange, endpoint}: FileUploadProps){
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(file) => {
                 onChange(file?.[0].url);
            }}
            onUploadError={(error:Error) => {
                 toast.error(`${error?.message}`);
            }}
        />
    )
}
