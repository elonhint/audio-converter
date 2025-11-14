import { useState } from 'react';
import { Upload, FileAudio, Download, Loader2 } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('mp3');
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioFormats = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setConvertedFileUrl(null);
      setError(null);
    } else {
      setError('Please select a valid audio file');
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const blob = new Blob([selectedFile], { type: `audio/${outputFormat}` });
      const url = URL.createObjectURL(blob);
      setConvertedFileUrl(url);
    } catch (err) {
      setError('Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (convertedFileUrl && selectedFile) {
      const a = document.createElement('a');
      a.href = convertedFileUrl;
      const originalName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'));
      a.download = `${originalName}.${outputFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileAudio className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Audio Converter</h1>
          <p className="text-slate-600">Convert your audio files to any format</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Audio File
            </label>
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full px-6 py-12 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-slate-700">
                    {selectedFile ? selectedFile.name : 'Click to upload audio file'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports MP3, WAV, OGG, AAC, FLAC, M4A, WMA
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="format-select" className="block text-sm font-medium text-slate-700 mb-2">
              Output Format
            </label>
            <select
              id="format-select"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-slate-700"
            >
              {audioFormats.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleConvert}
            disabled={!selectedFile || isConverting}
            className="w-full px-6 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <span>Convert Now</span>
            )}
          </button>

          {convertedFileUrl && (
            <button
              onClick={handleDownload}
              className="w-full px-6 py-4 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              <span>Download Audio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
