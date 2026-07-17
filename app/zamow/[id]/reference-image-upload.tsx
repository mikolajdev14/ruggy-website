"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ReferenceImageUploadProps = {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
};

export const ReferenceImageUpload = ({
  file,
  setFile,
}: ReferenceImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setError(undefined);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setFile(null);
      setError("Wybierz zdjęcie w formacie JPG, PNG lub WEBP.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("Zdjęcie może mieć maksymalnie 5 MB.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setError(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-4">
        <input
          ref={inputRef}
          type="file"
          name="referenceImage"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="block w-full text-sm text-neutral-600 file:me-3 file:rounded-full file:border-0 file:bg-[var(--ruggy-blue)] file:px-4 file:py-2 file:text-xs file:font-black file:text-white file:transition-opacity hover:file:opacity-85"
        />

        {file ? (
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-neutral-700">
              {file.name}
            </span>
            <button
              type="button"
              onClick={removeFile}
              className="shrink-0 text-xs font-semibold text-neutral-600 underline underline-offset-2 hover:text-neutral-950"
            >
              Usuń
            </button>
          </div>
        ) : null}

        <p className="mt-2 text-xs text-neutral-500">
          JPG, PNG lub WEBP, maksymalnie 5 MB.
        </p>

        {error ? (
          <p className="mt-2 text-xs font-medium text-red-700">{error}</p>
        ) : null}
      </div>
    </section>
  );
};
