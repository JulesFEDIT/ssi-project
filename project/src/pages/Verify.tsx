import React, { useState } from 'react';
import { Key, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Verify = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  const [success1, setSuccess1] = useState(false);
  const [success2, setSuccess2] = useState(false);

  const verifyInput1 = () => {
    if (input1 === 'B13N-J0U3-FR3R07') {
      setSuccess1(true);
      setError1('');
    } else {
      setError1('Invalid first verification string');
      setSuccess1(false);
    }
  };

  const verifyInput2 = () => {
    if (input2 === 'ValidateMe456') {
      setSuccess2(true);
      setError2('');
    } else {
      setError2('Invalid second verification string');
      setSuccess2(false);
    }
  };

  const clearInput = (inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
    inputSetter('');
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <Key className="h-12 w-12 text-cyan-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Flags Verification</h1>
        <p className="text-slate-400 mt-2">Enter the verification Flags</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-8">
        <form className="space-y-6">
          <div>
            <label htmlFor="input1" className="block text-sm font-medium mb-2">
              First Flag
            </label>
            <input
              type="text"
              id="input1"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-500"
              placeholder="Enter first Flag"
              required
            />
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={() => clearInput(setInput1)}
                className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium transition"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={verifyInput1}
                className="bg-cyan-600 hover:bg-cyan-700 py-2 px-4 rounded-lg font-medium transition"
              >
                Verify
              </button>
            </div>
            {error1 && (
              <div className="bg-red-900/50 text-red-200 rounded-lg p-4 flex items-center mt-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                {error1}
              </div>
            )}
            {success1 && (
              <div className="bg-green-900/50 text-green-200 rounded-lg p-4 flex items-center mt-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                First flag verified!
              </div>
            )}
          </div>

          <div>
            <label htmlFor="input2" className="block text-sm font-medium mb-2">
              Second Flag
            </label>
            <input
              type="text"
              id="input2"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:border-cyan-500"
              placeholder="Enter second Flag"
              required
            />
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={() => clearInput(setInput2)}
                className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-medium transition"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={verifyInput2}
                className="bg-cyan-600 hover:bg-cyan-700 py-2 px-4 rounded-lg font-medium transition"
              >
                Verify
              </button>
            </div>
            {error2 && (
              <div className="bg-red-900/50 text-red-200 rounded-lg p-4 flex items-center mt-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                {error2}
              </div>
            )}
            {success2 && (
              <div className="bg-green-900/50 text-green-200 rounded-lg p-4 flex items-center mt-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                Second flag verified!
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Verify;
