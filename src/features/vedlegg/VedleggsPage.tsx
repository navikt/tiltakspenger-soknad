import React from "react";
import Header from "../../components/Header";

const VedleggsPage = () => {
  return (
    <div>
      <Header />
      <div className="bg-white border border-gray-300 p-8 flex justify-center">
        <div className="max-w-2xl">
          <h2 className="text-3xl text-center mb-4">Vedlegg</h2>
          <form>
            <label
              htmlFor="file"
              className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 p-8"
            >
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
              <input name="file" id="file" type="file" className="hidden" />
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VedleggsPage;
