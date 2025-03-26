import { FilePdf, PaperPlaneRight } from "@phosphor-icons/react";
import { ChangeEventHandler, DragEventHandler, useState } from "react";
import { extractPDFContent, getQuestions } from "../services/api";
import { useQuiz } from "../hooks/useQuiz";
import { toast, ToastContainer } from "react-toastify";
import { Loading } from "../components/Loading";

export const SendFile = () => {
  const [file, setFile] = useState<File>();
  const { setupQuestions } = useQuiz();
  const [loading, setLoading] = useState(false);

  const onDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer!.dropEffect = "copy";
  };

  const onDragLeave: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const fileFromEvent = event.dataTransfer?.files?.[0];

    if (fileFromEvent) setFile(fileFromEvent);
  };

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = event.target;
    const fileFromEvent = input.files?.[0];

    if (fileFromEvent) setFile(fileFromEvent);
  };

  const submitFile = async () => {
    setLoading(true);

    if (file) {
      try {
        const { text } = await extractPDFContent(file);

        const { message } = await getQuestions(text, 10, 5);

        setupQuestions(message);
      } catch (error) {
        console.log(error);

        toast.error(
          "Something went wrong while generating your quiz. Please try again later."
        );
      }
    }

    setLoading(false);
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen w-full bg-zinc-800">
      <ToastContainer />
      <h1 className="text-5xl text-slate-50 font-bold">Quiz from PDF</h1>
      <h2 className="text-slate-300 mt-4">Upload your file below</h2>
      {loading && file ? (
        <div className="border-2 border-slate-50 border-dashed rounded-lg w-2/5 h-2/5 relative mt-8 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-center">
              <FilePdf size={32} className="text-red-500" weight="fill" />
              <div className="ml-2">
                <Loading />
              </div>
            </div>
            <span className="text-slate-50 text-xs mt-2 w-2/3 overflow-hidden text-ellipsis">
              {file.name}
            </span>
          </div>
          <span className="text-slate-50 mt-4 w-2/3 text-center">
            <span className="font-bold">Don't close the application.</span> It
            may take a few minutes.
          </span>
        </div>
      ) : (
        <div
          className="border-2 border-slate-50 border-dashed rounded-lg w-2/5 h-2/5 relative mt-8 flex items-center justify-center hover:bg-zinc-700"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <input
            className="w-full h-full text-transparent select-none absolute top-0 left-0 cursor-pointer outline-none appearance-none"
            id="file_input"
            type="file"
            onChange={onChange}
          />

          {file ? (
            <div className="flex flex-col items-center">
              <FilePdf size={32} className="text-red-500" weight="fill" />
              <span className="text-slate-50 text-xs">{file.name}</span>
            </div>
          ) : (
            <FilePdf size={32} className="text-slate-50" />
          )}
        </div>
      )}

      {loading ? null : (
        <button
          className="appearance-none disabled:bg-slate-400 disabled:text-slate-300 disabled:cursor-not-allowed disabled:hover:opacity-100 outline-none bg-slate-50 text-zinc-800 rounded-2xl h-12 p-4 mt-8 flex items-center justify-center cursor-pointer hover:opacity-75"
          onClick={submitFile}
          disabled={!file}
        >
          Generate Quiz
          <PaperPlaneRight
            size={24}
            className="text-zinc-800 ml-2"
            weight="fill"
          />
        </button>
      )}
    </section>
  );
};
