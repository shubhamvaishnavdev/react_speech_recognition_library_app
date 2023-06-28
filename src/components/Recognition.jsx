import React, { useState, useEffect, useCallback } from 'react';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Recognition = () => {

    //states & variables
    const [on, setOn] = useState(false);
    const [value, setValue] = useState('');
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    //useEffect hooks
    useEffect(() => {
        checkMicrophonePermission();
    }, []);
    useEffect(() => {
        setValue(transcript);
    }, [transcript]);

    //condition checks
    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    //functions
    const checkMicrophonePermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (error) {
            console.error('Error accessing microphone:', error);
            return <span>Microphone permission not granted.</span>
        }
    };
    const startListening = () => SpeechRecognition.startListening({ continuous: true });

    const handleMic = () => {
        setOn(prev => !prev);
        if (!on) {
            startListening();
        } else {
            SpeechRecognition.stopListening();
        }
    };

    function handleChange(e) {
        const change = e.target.value;
        setValue(change);
    }        


    const notify = (type) => {
        switch (type) {
            case 'success':
                toast.success("Copied", {
                    position: toast.POSITION.TOP_CENTER
                });
                break;

            case 'error':
                toast.error("Error", {
                    position: toast.POSITION.TOP_LEFT
                });
                break;

            default:toast("default")
                break;
        }



    };


    return (
        <div className="h-[80%] w-[90%] flex flex-col justify-between p-4 bg-gray-300 md:w-[60%] md:h-[40%] " >

            <textarea type="text" value={value} onChange={(e) => {
                handleChange(e);

            }} className='w-full h-[70%] bg-gray-300 focus:outline-none' />

            <div className="flex flex-wrap flex-col items-center gap-4 md:gap-0 md:flex-row md:justify-around ">
                <button
                    onClick={handleMic}
                    className={`p-4 rounded-full ${on ? 'bg-red-500' : 'bg-green-500'}`}
                >
                    {on ? (
                        <BsFillMicMuteFill />
                    ) : (
                        <BsFillMicFill />
                    )}
                </button>
                <p className="inline">Recording: {listening ? 'on' : 'off'}</p>
                <button
                        onClick={resetTranscript}
                        className='px-4 py-2 bg-green-500 text-md hover:scale-105'>Reset</button>
                <CopyToClipboard text={value}>
                    <button
                        onClick={() => notify('success')}
                        className='px-4 py-2 bg-green-500 text-md hover:scale-105'>copy</button>
                </CopyToClipboard>

            </div>
                <ToastContainer autoClose={2000} />
        </div>
    );
};

export default Recognition;
